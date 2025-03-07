import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const FAQ: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const faqItems: FAQItem[] = [
    {
      question: "How do I book an appointment?",
      answer: "Booking an appointment is easy! Simply create an account, browse our professionals, select one that matches your needs, choose an available time slot, and complete the booking process. You'll receive a confirmation email with all the details.",
      category: "appointments"
    },
    {
      question: "Can I cancel or reschedule my appointment?",
      answer: "Yes, you can cancel or reschedule your appointment up to 24 hours before the scheduled time without any penalty. To do this, log in to your account, go to 'My Appointments', and select the appointment you wish to modify.",
      category: "appointments"
    },
    {
      question: "How do I pay for my appointments?",
      answer: "We accept various payment methods including credit/debit cards and online payment services. Payment is processed securely through our platform at the time of booking. For some services, you may have the option to pay after the appointment.",
      category: "payments"
    },
    {
      question: "Is my personal information secure?",
      answer: "Yes, we take data security very seriously. All personal information is encrypted and stored securely. We comply with all relevant data protection regulations and never share your information with third parties without your consent.",
      category: "privacy"
    },
    {
      question: "What if I'm not satisfied with my session?",
      answer: "Your satisfaction is important to us. If you're not satisfied with your session, please contact our support team within 48 hours of your appointment. We'll work with you to resolve any issues, which may include a partial or full refund depending on the circumstances.",
      category: "appointments"
    },
    {
      question: "How are professionals verified?",
      answer: "All professionals on our platform undergo a rigorous verification process. This includes checking their qualifications, certifications, and professional experience. We also conduct background checks and collect reviews from clients to ensure high-quality service.",
      category: "professionals"
    },
    {
      question: "Can I choose the same professional for future appointments?",
      answer: "Absolutely! If you've had a positive experience with a professional, you can easily book future appointments with them. Simply go to their profile or check your appointment history to book with them again.",
      category: "appointments"
    },
    {
      question: "What types of services do you offer?",
      answer: "We offer a wide range of wellness and healthcare services including therapy sessions, counseling, wellness programs, life coaching, meditation classes, and yoga sessions. Each service is provided by qualified professionals in their respective fields.",
      category: "services"
    },
    {
      question: "How do I become a professional on your platform?",
      answer: "If you're a qualified healthcare or wellness professional interested in joining our platform, please visit the 'Join as a Professional' section on our website. You'll need to submit your qualifications, experience, and other required documentation for our verification process.",
      category: "professionals"
    },
    {
      question: "What if I need to contact my professional before the appointment?",
      answer: "Once your appointment is confirmed, you'll have access to a secure messaging system to communicate with your professional. This allows you to share any relevant information or ask questions before your session.",
      category: "appointments"
    },
    {
      question: "Are virtual appointments available?",
      answer: "Yes, many of our professionals offer virtual appointments through our secure video conferencing system. When booking, you can filter for professionals who offer virtual sessions if you prefer this option.",
      category: "appointments"
    },
    {
      question: "How do I get a receipt for my appointment?",
      answer: "Receipts are automatically generated and sent to your email after payment is processed. You can also access and download your receipts at any time from the 'Payment History' section in your account dashboard.",
      category: "payments"
    }
  ];

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const filteredFAQs = faqItems.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'appointments', name: 'Appointments' },
    { id: 'payments', name: 'Payments' },
    { id: 'professionals', name: 'Professionals' },
    { id: 'privacy', name: 'Privacy & Security' },
    { id: 'services', name: 'Services' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Find answers to common questions about our services, appointments, and more.
        </p>
      </div>

      <div className="mb-8">
        <div className="relative max-w-xl mx-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
            placeholder="Search for questions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {categories.map(category => (
          <button
            key={category.id}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              activeCategory === category.id
                ? 'bg-teal-600 text-white'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
            onClick={() => setActiveCategory(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className="max-w-3xl mx-auto">
        {filteredFAQs.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-600">No questions found matching your search criteria.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFAQs.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  className="flex justify-between items-center w-full px-6 py-4 text-left bg-white hover:bg-gray-50 focus:outline-none"
                  onClick={() => toggleFAQ(index)}
                >
                  <span className="text-lg font-medium text-gray-900">{faq.question}</span>
                  {activeIndex === index ? (
                    <ChevronUp className="h-5 w-5 text-teal-600" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </button>
                {activeIndex === index && (
                  <div className="px-6 py-4 bg-gray-50">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-16 bg-teal-50 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Still have questions?</h2>
        <p className="text-gray-600 mb-6">
          If you couldn't find the answer to your question, our support team is here to help.
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <a
            href="/contact"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700"
          >
            Contact Support
          </a>
          <a
            href="mailto:support@savayasheals.com"
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Email Us
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQ;