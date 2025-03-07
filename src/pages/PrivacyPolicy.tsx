import React from 'react';
import { Shield, Lock, Eye, FileText, Clock, AlertTriangle } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
        <p className="text-gray-600">
          Last Updated: May 15, 2025
        </p>
      </div>

      <div className="prose prose-lg max-w-none">
        <div className="bg-teal-50 p-6 rounded-lg mb-8">
          <div className="flex items-start">
            <Shield className="h-6 w-6 text-teal-600 mt-1 mr-3 flex-shrink-0" />
            <p className="text-gray-700">
              At SAVAYAS HEALS, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform. Please read this policy carefully to understand our practices regarding your personal data.
            </p>
          </div>
        </div>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <FileText className="h-6 w-6 text-teal-600 mr-2" />
            Information We Collect
          </h2>
          <p className="mb-4">
            We collect several types of information from and about users of our platform, including:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>
              <strong>Personal Information:</strong> Name, email address, phone number, postal address, date of birth, and payment information.
            </li>
            <li>
              <strong>Health Information:</strong> Information about your health conditions, treatment history, and other health-related data that you choose to share with healthcare professionals through our platform.
            </li>
            <li>
              <strong>Account Information:</strong> Username, password, account preferences, and other information related to your account.
            </li>
            <li>
              <strong>Usage Data:</strong> Information about how you use our platform, including your browsing history, search queries, and interactions with healthcare professionals.
            </li>
            <li>
              <strong>Device Information:</strong> Information about the device you use to access our platform, including IP address, browser type, operating system, and device identifiers.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <Eye className="h-6 w-6 text-teal-600 mr-2" />
            How We Use Your Information
          </h2>
          <p className="mb-4">
            We use the information we collect for various purposes, including:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>
              <strong>Providing Services:</strong> To facilitate appointments with healthcare professionals, process payments, and provide customer support.
            </li>
            <li>
              <strong>Improving Our Platform:</strong> To analyze usage patterns, identify areas for improvement, and enhance the user experience.
            </li>
            <li>
              <strong>Communication:</strong> To send you appointment reminders, updates about our services, and respond to your inquiries.
            </li>
            <li>
              <strong>Marketing:</strong> To send promotional materials and information about new services or features (with your consent).
            </li>
            <li>
              <strong>Legal Compliance:</strong> To comply with applicable laws, regulations, and legal processes.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <Lock className="h-6 w-6 text-teal-600 mr-2" />
            How We Protect Your Information
          </h2>
          <p className="mb-4">
            We implement a variety of security measures to maintain the safety of your personal information, including:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>
              <strong>Encryption:</strong> All sensitive information is encrypted using industry-standard protocols.
            </li>
            <li>
              <strong>Access Controls:</strong> Only authorized personnel have access to personal information, and they are required to maintain confidentiality.
            </li>
            <li>
              <strong>Regular Audits:</strong> We conduct regular security audits and vulnerability assessments to identify and address potential security risks.
            </li>
            <li>
              <strong>Secure Infrastructure:</strong> Our platform is hosted on secure servers with advanced security features.
            </li>
          </ul>
          <p>
            While we take reasonable measures to protect your information, no method of transmission over the Internet or electronic storage is 100% secure. We cannot guarantee absolute security.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <AlertTriangle className="h-6 w-6 text-teal-600 mr-2" />
            Information Sharing and Disclosure
          </h2>
          <p className="mb-4">
            We may share your information in the following circumstances:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>
              <strong>Healthcare Professionals:</strong> We share your information with healthcare professionals you choose to book appointments with.
            </li>
            <li>
              <strong>Service Providers:</strong> We may share your information with third-party service providers who perform services on our behalf, such as payment processing, data analysis, and customer support.
            </li>
            <li>
              <strong>Legal Requirements:</strong> We may disclose your information if required to do so by law or in response to valid requests by public authorities.
            </li>
            <li>
              <strong>Business Transfers:</strong> If we are involved in a merger, acquisition, or sale of all or a portion of our assets, your information may be transferred as part of that transaction.
            </li>
            <li>
              <strong>With Your Consent:</strong> We may share your information with third parties when you have given us your consent to do so.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <Clock className="h-6 w-6 text-teal-600 mr-2" />
            Data Retention
          </h2>
          <p className="mb-4">
            We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. When we no longer need your personal information, we will securely delete or anonymize it.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Rights</h2>
          <p className="mb-4">
            Depending on your location, you may have certain rights regarding your personal information, including:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>
              <strong>Access:</strong> You have the right to request access to the personal information we hold about you.
            </li>
            <li>
              <strong>Correction:</strong> You have the right to request that we correct inaccurate or incomplete information about you.
            </li>
            <li>
              <strong>Deletion:</strong> You have the right to request that we delete your personal information in certain circumstances.
            </li>
            <li>
              <strong>Restriction:</strong> You have the right to request that we restrict the processing of your personal information in certain circumstances.
            </li>
            <li>
              <strong>Data Portability:</strong> You have the right to receive a copy of your personal information in a structured, machine-readable format.
            </li>
            <li>
              <strong>Objection:</strong> You have the right to object to the processing of your personal information in certain circumstances.
            </li>
          </ul>
          <p>
            To exercise any of these rights, please contact us using the information provided in the "Contact Us" section below.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookies and Tracking Technologies</h2>
          <p className="mb-4">
            We use cookies and similar tracking technologies to collect information about your browsing activities on our platform. You can control cookies through your browser settings and other tools. However, if you block certain cookies, you may not be able to use all the features of our platform.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Children's Privacy</h2>
          <p className="mb-4">
            Our platform is not intended for children under the age of 18. We do not knowingly collect personal information from children under 18. If you are a parent or guardian and believe that your child has provided us with personal information, please contact us, and we will delete such information from our records.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to This Privacy Policy</h2>
          <p className="mb-4">
            We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last Updated" date at the top of this page. You are advised to review this Privacy Policy periodically for any changes.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
          <p className="mb-4">
            If you have any questions or concerns about this Privacy Policy or our privacy practices, please contact us at:
          </p>
          <div className="bg-gray-50 p-6 rounded-lg">
            <p className="mb-2"><strong>SAVAYAS HEALS</strong></p>
            <p className="mb-2">123 Healing Street</p>
            <p className="mb-2">Wellness City, 12345</p>
            <p className="mb-2">United States</p>
            <p className="mb-2">Email: privacy@savayasheals.com</p>
            <p>Phone: +1 (555) 123-4567</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;