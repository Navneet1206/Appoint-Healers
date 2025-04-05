import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from 'axios'

export const AppContext = createContext()

const AppContextProvider = (props) => {

    const currencySymbol = '₹'
    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [doctors, setDoctors] = useState([])
    const [token, setToken] = useState(localStorage.getItem('token') || '')
    const [userData, setUserData] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    // Getting Doctors using API
    const getDoctosData = async () => {

        try {

            const { data } = await axios.get(backendUrl + '/api/doctor/list')
            if (data.success) {
                setDoctors(data.doctors)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }

    }

    // Getting User Profile using API
    const loadUserProfileData = async () => {
        if (!token) {
            setIsLoading(false)
            setUserData(null)
            return
        }

        try {
            const { data } = await axios.get(backendUrl + '/api/user/get-profile', {
                headers: { token }
            })

            if (data.success) {
                setUserData(data.userData)
            } else {
                // If token is invalid, clear it
                localStorage.removeItem('token')
                setToken('')
                setUserData(null)
                toast.error('Session expired. Please login again.')
            }
        } catch (error) {
            console.log(error)
            // If request fails due to invalid token
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                localStorage.removeItem('token')
                setToken('')
                setUserData(null)
                toast.error('Session expired. Please login again.')
            } else {
                toast.error(error.message)
            }
        } finally {
            setIsLoading(false)
        }
    }

    // Logout function
    const logout = () => {
        localStorage.removeItem('token')
        setToken('')
        setUserData(null)
        toast.success('Logged out successfully')
    }

    useEffect(() => {
        getDoctosData()
    }, [])

    useEffect(() => {
        loadUserProfileData()
    }, [token])

    const value = {
        doctors, getDoctosData,
        currencySymbol,
        backendUrl,
        token, setToken,
        userData, setUserData, loadUserProfileData,
        isLoading,
        logout
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )

}

export default AppContextProvider