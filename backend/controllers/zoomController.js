import axios from 'axios';
import qs from 'qs';

/**
 * Obtains an access token from Zoom's OAuth endpoint using server-to-server OAuth.
 * @returns {Promise<string>} The access token.
 * @throws {Error} If the token request fails or environment variables are missing.
 */
export const getZoomAccessToken = async () => {
  try {
    // Validate environment variables
    if (!process.env.ZOOM_CLIENT_ID || !process.env.ZOOM_CLIENT_SECRET || !process.env.ZOOM_ACCOUNT_ID) {
      const missingVars = [];
      if (!process.env.ZOOM_CLIENT_ID) missingVars.push('ZOOM_CLIENT_ID');
      if (!process.env.ZOOM_CLIENT_SECRET) missingVars.push('ZOOM_CLIENT_SECRET');
      if (!process.env.ZOOM_ACCOUNT_ID) missingVars.push('ZOOM_ACCOUNT_ID');
      throw new Error(`Missing Zoom environment variables: ${missingVars.join(', ')}`);
    }

    // Log credentials for debugging (remove in production)
    console.log('Zoom Credentials:', {
      clientId: process.env.ZOOM_CLIENT_ID,
      accountId: process.env.ZOOM_ACCOUNT_ID,
    });

    const auth = Buffer.from(`${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`).toString('base64');
    const response = await axios.post(
      'https://zoom.us/oauth/token',
      qs.stringify({
        grant_type: 'account_credentials',
        account_id: process.env.ZOOM_ACCOUNT_ID,
      }),
      {
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    if (!response.data.access_token) {
      throw new Error('No access token returned from Zoom API');
    }

    console.log('Zoom Access Token Obtained:', response.data.access_token); // Debug log
    return response.data.access_token;
  } catch (error) {
    console.error('Get Zoom Access Token Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    throw new Error(`Failed to obtain Zoom access token: ${error.response?.status || 'Unknown'} - ${error.response?.data?.message || error.message}`);
  }
};

/**
 * Creates a Zoom meeting using the provided access token and meeting details.
 * @param {string} accessToken - The Zoom access token.
 * @param {Object} meetingDetails - The meeting details (e.g., topic, start_time, duration).
 * @returns {Promise<Object>} The created meeting details.
 * @throws {Error} If the meeting creation fails.
 */
export const createZoomMeeting = async (accessToken, meetingDetails) => {
  try {
    if (!accessToken) {
      throw new Error('No access token provided');
    }

    console.log('Creating Zoom meeting with details:', meetingDetails); // Debug log

    const response = await axios.post(
      'https://api.zoom.us/v2/users/me/meetings',
      meetingDetails,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Zoom Meeting Created:', response.data); // Debug log
    return response.data;
  } catch (error) {
    console.error('Create Zoom Meeting Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    throw new Error(`Failed to create Zoom meeting: ${error.response?.status || 'Unknown'} - ${error.response?.data?.message || error.message}`);
  }
};