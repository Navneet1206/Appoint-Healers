import React from 'react';
import { FileText,  AlertTriangle } from 'lucide-react';

const TermsOfService: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Terms of Service</h1>
        <p className="text-gray-600">
          Last Updated: May 15, 2025
        </p>
      </div>

      <div className="prose prose-lg max-w-none">
        <div className="bg-teal-50 p-6 rounded-lg mb-8">
          <div className="flex items-start">
            <FileText className="h-6 w-6 text-teal-600 mt-1 mr-3 flex-shrink-0" />
            <p className="text-gray-700">
              Please read these Terms of Service ("Terms") carefully before using the SAVAYAS HEALS platform. These Terms constitute a legally binding agreement between you and SAVAYAS HEALS governing your access to and use of the platform, including any content, functionality, and services offered.
            </p>
          </div>
        </div>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
          <p className="mb-4">
            By accessing or using the SAVAYAS HEALS platform, you agree to be bound by these Terms. If you do not agree to these Terms, you must not access or use the platform.
          </p>
          <p>
            We may revise these Terms at any time by updating this page. Your continued use of the platform following the posting of revised Terms means that you accept and agree to the changes.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Eligibility</h2>
          <p className="mb-4">
            You must be at least 18 years old to use the SAVAYAS HEALS platform. By using the platform, you represent and warrant that you are at least 18 years old and have the legal capacity to enter into these Terms.
          </p>
          <p>
            If you are using the platform on behalf of a company, organization, or other entity, you represent and warrant that you have the authority to bind that entity to these Terms, in which case "you" will refer to that entity.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Account Registration</h2>
          <p className="mb-4">
            To access certain features of the platform, you may be required to register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
          </p>
          <p className="mb-4">
            You are responsible for safeguarding your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account or any other breach of security.
          </p>
          <p>
            We reserve the right to disable any user account at any time if, in our opinion, you have violated any provision of these Terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Booking and Cancellation Policy</h2>
          <p className="mb-4">
            When you book an appointment through the SAVAYAS HEALS platform, you agree to the following:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>
              You must provide accurate and complete information for the booking.
            </li>
            <li>
              You may cancel or reschedule an appointment up to 24 hours before the scheduled time without penalty.
            </li>
            <li>
              Cancellations made less than 24 hours before the scheduled appointment time may be subject to a cancellation fee, as specified at the time of booking.
            </li>
            <li>
              No-shows (failure to attend a scheduled appointment without cancellation) may result in a charge for the full appointment fee.
            </li>
            <li>
              Professionals may have their own cancellation policies, which will be communicated to you at the time of booking.
            </li>
          </ul>
          <p>
            SAVAYAS HEALS reserves the right to modify the cancellation policy at any time, with such modifications being effective immediately upon posting on the platform.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Payment Terms</h2>
          <p className="mb-4">
            By booking an appointment through the SAVAYAS HEALS platform, you agree to pay all fees associated with the service at the rates in effect when the charges are incurred.
          </p>
          <p className="mb-4">
            Payment processing services for users on SAVAYAS HEALS are provided by Razorpay and are subject to the Razorpay Terms of Service and Privacy Policy. By agreeing to these Terms, you also agree to be bound by Razorpay's Terms of Service and Privacy Policy.
          </p>
          <p className="mb-4">
            All fees are non-refundable except as expressly set forth in these Terms or as required by applicable law.
          </p>
          <p>
            SAVAYAS HEALS reserves the right to change its fees and payment policies at any time, with such changes being effective immediately upon posting on the platform.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">6. User Conduct</h2>
          <p className="mb-4">
            You agree not to use the SAVAYAS HEALS platform in any way that:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>
              Violates any applicable law, regulation, or these Terms.
            </li>
            <li>
              Is harmful, fraudulent, deceptive, threatening, harassing, defamatory, obscene, or otherwise objectionable.
            </li>
            <li>
              Jeopardizes the security of your account or anyone else's account.
            </li>
            <li>
              Attempts to obtain unauthorized access to the platform or other users' accounts.
            </li>
            <li>
              Interferes with the proper functioning of the platform.
            </li>
            <li>
              Engages in any automated use of the platform, such as using scripts to send messages or upload content.
            </li>
          </ul>
          <p>
            SAVAYAS HEALS reserves the right to terminate or suspend your access to the platform immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach these Terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Intellectual Property Rights</h2>
          <p className="mb-4">
            The SAVAYAS HEALS platform and its entire contents, features, and functionality (including but not limited to all information, software, text, displays, images, video, and audio, and the design, selection, and arrangement thereof) are owned by SAVAYAS HEALS, its licensors, or other providers of such material and are protected by copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
          </p>
          <p>
            These Terms do not grant you any right, title, or interest in the platform or its content, and you may not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any of the material on our platform, except as generally and ordinarily permitted through the platform according to these Terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Disclaimer of Warranties</h2>
          <div className="bg-yellow-50 p-6 rounded-lg mb-4 border-l-4 border-yellow-400">
            <div className="flex items-start">
              <AlertTriangle className="h-6 w-6 text-yellow-600 mt-1 mr-3 flex-shrink-0" />
              <div>
                <p className="text-yellow-700 font-semibold mb-2">Important Disclaimer</p>
                <p className="text-yellow-700">
                  THE SAVAYAS HEALS PLATFORM IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS, WITHOUT ANY WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. SAVAYAS HEALS DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
                </p>
              </div>
            </div>
          </div>
          <p>
            SAVAYAS HEALS does not warrant that the platform will be uninterrupted or error-free, that defects will be corrected, or that the platform or the server that makes it available are free of viruses or other harmful components. SAVAYAS HEALS makes no warranties or representations about the accuracy or completeness of the content on the platform or the content of any sites linked to the platform.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Limitation of Liability</h2>
          <p className="mb-4">
            IN NO EVENT WILL SAVAYAS HEALS, ITS AFFILIATES, OR THEIR LICENSORS, SERVICE PROVIDERS, EMPLOYEES, AGENTS, OFFICERS, OR DIRECTORS BE LIABLE FOR DAMAGES OF ANY KIND, UNDER ANY LEGAL THEORY, ARISING OUT OF OR IN CONNECTION WITH YOUR USE, OR INABILITY TO USE, THE PLATFORM, ANY WEBSITES LINKED TO IT, ANY CONTENT ON THE PLATFORM OR SUCH OTHER WEBSITES, OR ANY SERVICES OR ITEMS OBTAINED THROUGH THE PLATFORM OR SUCH OTHER WEBSITES, INCLUDING ANY DIRECT, INDIRECT, SPECIAL, INCIDENTAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO, PERSONAL INJURY, PAIN AND SUFFERING, EMOTIONAL DISTRESS, LOSS OF REVENUE, LOSS OF PROFITS, LOSS OF BUSINESS OR ANTICIPATED SAVINGS, LOSS OF USE, LOSS OF GOODWILL, LOSS OF DATA, AND WHETHER CAUSED BY TORT (INCLUDING NEGLIGENCE), BREACH OF CONTRACT, OR OTHERWISE, EVEN IF FORESEEABLE.
          </p>
          <p>
            THE FOREGOING DOES NOT AFFECT ANY LIABILITY WHICH CANNOT BE EXCLUDED OR LIMITED UNDER APPLICABLE LAW.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Indemnification</h2>
          <p>
            You agree to defend, indemnify, and hold harmless SAVAYAS HEALS, its affiliates, licensors, and service providers, and its and their respective officers, directors, employees, contractors, agents, licensors, suppliers, successors, and assigns from and against any claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising out of or relating to your violation of these Terms or your use of the platform, including, but not limited to, any use of the platform's content, services, and products other than as expressly authorized in these Terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Governing Law and Jurisdiction</h2>
          <p className="mb-4">
            These Terms and any dispute or claim arising out of or in connection with them or their subject matter or formation (including non-contractual disputes or claims) shall be governed by and construed in accordance with the laws of India, without giving effect to any choice or conflict of law provision or rule.
          </p>
          <p>
            Any legal suit, action, or proceeding arising out of, or related to, these Terms or the platform shall be instituted exclusively in the courts of India, although we retain the right to bring any suit, action, or proceeding against you for breach of these Terms in your country of residence or any other relevant country.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Waiver and Severability</h2>
          <p className="mb-4">
            No waiver by SAVAYAS HEALS of any term or condition set out in these Terms shall be deemed a further or continuing waiver of such term or condition or a waiver of any other term or condition, and any failure of SAVAYAS HEALS to assert a right or provision under these Terms shall not constitute a waiver of such right or provision.
          </p>
          <p>
            If any provision of these Terms is held by a court or other tribunal of competent jurisdiction to be invalid, illegal, or unenforceable for any reason, such provision shall be eliminated or limited to the minimum extent such that the remaining provisions of the Terms will continue in full force and effect.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Entire Agreement</h2>
          <p>
            These Terms, our Privacy Policy, and any other agreements expressly incorporated by reference herein constitute the sole and entire agreement between you and SAVAYAS HEALS regarding the platform and supersede all prior and contemporaneous understandings, agreements, representations, and warranties, both written and oral, regarding the platform.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Contact Information</h2>
          <p className="mb-4">
            If you have any questions or concerns about these Terms, please contact us at:
          </p>
          <div className="bg-gray-50 p-6 rounded-lg">
            <p className="mb-2"><strong>SAVAYAS HEALS</strong></p>
            <p className="mb-2">123 Healing Street</p>
            <p className="mb-2">Wellness City, 12345</p>
            <p className="mb-2">United States</p>
            <p className="mb-2">Email: legal@savayasheals.com</p>
            <p>Phone: +1 (555) 123-4567</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default TermsOfService;