import React from 'react';
import { useParams, Link } from 'react-router-dom';
import {  Brain, Users, Heart, Coffee, Bot as Lotus, Cog as Yoga, Check, Calendar, Clock, DollarSign } from 'lucide-react';

interface ServiceInfo {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  icon: JSX.Element;
  image: string;
  benefits: string[];
  process: {
    title: string;
    description: string;
  }[];
  pricing: {
    title: string;
    price: string;
    duration: string;
    features: string[];
  }[];
  faqs: {
    question: string;
    answer: string;
  }[];
}

const ServiceDetails: React.FC = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  
  const services: Record<string, ServiceInfo> = {
    'therapy': {
      id: 'therapy',
      title: 'Therapy Sessions',
      description: 'Connect with licensed therapists for individual, couples, or family therapy sessions to address mental health concerns.',
      longDescription: 'Our therapy sessions provide a safe, confidential space for you to work through mental health challenges with licensed professionals. Whether you are dealing with anxiety, depression, relationship issues, or other concerns, our therapists use evidence-based approaches to help you develop coping strategies and improve your overall well-being.',
      icon: <Brain className="h-8 w-8 text-teal-600" />,
      image: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      benefits: [
        'Professional guidance for mental health challenges',
        'Confidential and secure environment',
        'Personalized treatment plans',
        'Evidence-based therapeutic approaches',
        'Flexible scheduling options',
        'Both in-person and virtual sessions available'
      ],
      process: [
        {
          title: 'Initial Consultation',
          description: 'Begin with a comprehensive assessment to understand your needs and goals.'
        },
        {
          title: 'Treatment Planning',
          description: 'Work with your therapist to develop a personalized treatment plan.'
        },
        {
          title: 'Regular Sessions',
          description: 'Attend weekly or bi-weekly sessions to work through challenges and develop coping strategies.'
        },
        {
          title: 'Progress Evaluation',
          description: 'Regularly review your progress and adjust your treatment plan as needed.'
        }
      ],
      pricing: [
        {
          title: 'Individual Therapy',
          price: '₹2,500',
          duration: '50 minutes',
          features: [
            'One-on-one sessions with a licensed therapist',
            'Personalized treatment approach',
            'Available in-person or virtually',
            'Flexible scheduling options'
          ]
        },
        {
          title: 'Couples Therapy',
          price: '₹3,500',
          duration: '80 minutes',
          features: [
            'Sessions with a therapist specializing in relationship counseling',
            'Focus on communication and conflict resolution',
            'Tools for strengthening your relationship',
            'Available in-person or virtually'
          ]
        },
        {
          title: 'Family Therapy',
          price: '₹4,000',
          duration: '90 minutes',
          features: [
            'Sessions with a therapist specializing in family dynamics',
            'Strategies for improving family communication',
            'Tools for resolving family conflicts',
            'Available in-person or virtually'
          ]
        }
      ],
      faqs: [
        {
          question: 'How do I know if therapy is right for me?',
          answer: 'Therapy can be beneficial for anyone experiencing emotional distress, relationship problems, or seeking personal growth. If you are feeling overwhelmed, struggling with persistent negative thoughts, or having difficulty coping with life is challenges, therapy might be helpful.'
        },
        {
          question: 'How long does therapy typically last?',
          answer: 'The duration of therapy varies depending on your specific needs and goals. Some people benefit from short-term therapy (8-12 sessions), while others may find longer-term therapy more beneficial. Your therapist will discuss recommendations during your initial sessions.'
        },
        {
          question: 'Is what I share in therapy confidential?',
          answer: 'Yes, confidentiality is a fundamental aspect of therapy. Information shared in sessions is protected by professional ethics and laws. There are limited exceptions, such as when there is a risk of harm to yourself or others, which your therapist will discuss with you.'
        },
        {
          question: 'Can I switch therapists if I do not feel comfortable?',
          answer: 'Absolutely. The therapeutic relationship is important, and it is essential that you feel comfortable with your therapist. If you do not feel it is a good fit, you can request to switch to another professional on our platform.'
        }
      ]
    },
    'counseling': {
      id: 'counseling',
      title: 'Counseling',
      description: 'Get guidance and support from professional counselors for personal, career, or educational challenges.',
      longDescription: 'Our counseling services offer professional guidance to help you navigate life s challenges and make informed decisions. Whether you are facing personal dilemmas, career transitions, or educational choices, our counselors provide objective insights and practical strategies to help you move forward with confidence.',
      icon: <Users className="h-8 w-8 text-teal-600" />,
      image: 'https://images.unsplash.com/photo-1573497620053-ea5300f94f21?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      benefits: [
        'Clarity on personal or professional challenges',
        'Improved decision-making skills',
        'Enhanced self-awareness',
        'Practical strategies for growth',
        'Objective perspective on your situation',
        'Support during life transitions'
      ],
      process: [
        {
          title: 'Initial Assessment',
          description: 'Discuss your current situation and identify specific areas where you need guidance.'
        },
        {
          title: 'Goal Setting',
          description: 'Work with your counselor to establish clear, achievable goals for your sessions.'
        },
        {
          title: 'Exploration and Guidance',
          description: 'Explore options and receive guidance to help you make informed decisions.'
        },
        {
          title: 'Implementation Support',
          description: 'Receive support as you implement changes and work toward your goals.'
        }
      ],
      pricing: [
        {
          title: 'Personal Counseling',
          price: '₹2,000',
          duration: '45 minutes',
          features: [
            'One-on-one sessions with a professional counselor',
            'Focus on personal challenges and growth',
            'Practical strategies for moving forward',
            'Available in-person or virtually'
          ]
        },
        {
          title: 'Career Counseling',
          price: '₹2,500',
          duration: '60 minutes',
          features: [
            'Sessions with a career development specialist',
            'Career assessment and exploration',
            'Job search and interview strategies',
            'Work-life balance guidance'
          ]
        },
        {
          title: 'Educational Counseling',
          price: '₹1,800',
          duration: '45 minutes',
          features: [
            'Sessions with an educational counselor',
            'Academic planning and goal setting',
            'Study skills and time management strategies',
            'Educational path exploration'
          ]
        }
      ],
      faqs: [
        {
          question: 'What is the difference between counseling and therapy?',
          answer: 'While there is some overlap, counseling typically focuses on specific issues and practical solutions for current problems, while therapy often involves deeper exploration of long-standing patterns and emotional issues. Counseling is often shorter-term and more goal-oriented.'
        },
        {
          question: 'How many counseling sessions will I need?',
          answer: 'The number of sessions varies depending on your specific situation and goals. Many people find that 4-6 sessions provide sufficient guidance for a specific issue, but this can vary. Your counselor will discuss recommendations during your initial session.'
        },
        {
          question: 'Can counseling help with career indecision?',
          answer: 'Yes, career counseling is specifically designed to help with career exploration, decision-making, and transitions. A career counselor can help you assess your skills, interests, and values to identify suitable career paths.'
        },
        {
          question: 'Is counseling covered by insurance?',
          answer: 'Coverage varies depending on your insurance provider and plan. We recommend checking with your insurance company about coverage for counseling services. We can provide documentation to submit for reimbursement if your plan covers these services.'
        }
      ]
    },
    'wellness': {
      id: 'wellness',
      title: 'Wellness Programs',
      description: 'Join structured programs designed to improve your overall well-being, including stress management and healthy lifestyle choices.',
      longDescription: 'Our wellness programs offer a holistic approach to health and well-being, addressing physical, mental, and emotional aspects of your life. These structured programs provide the knowledge, tools, and support you need to make sustainable lifestyle changes and develop healthy habits that enhance your quality of life.',
      icon: <Heart className="h-8 w-8 text-teal-600" />,
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2020&q=80',
      benefits: [
        'Comprehensive approach to health',
        'Structured guidance for lifestyle changes',
        'Community support and accountability',
        'Measurable progress tracking',
        'Expert-led sessions and workshops',
        'Personalized wellness plans'
      ],
      process: [
        {
          title: 'Wellness Assessment',
          description: 'Complete a comprehensive assessment to identify your current health status and wellness goals.'
        },
        {
          title: 'Program Selection',
          description: 'Choose from various wellness programs based on your specific needs and interests.'
        },
        {
          title: 'Guided Implementation',
          description: 'Participate in structured sessions and activities with expert guidance.'
        },
         {
          title: 'Progress Monitoring',
          description: 'Track your progress and receive ongoing support to help you maintain healthy habits.'
        }
      ],
      pricing: [
        {
          title: 'Stress Management Program',
          price: '₹8,000',
          duration: '8 weeks',
          features: [
            'Weekly group sessions with a wellness coach',
            'Stress reduction techniques and practices',
            'Personalized stress management plan',
            'Access to online resources and community support'
          ]
        },
        {
          title: 'Healthy Lifestyle Program',
          price: '₹12,000',
          duration: '12 weeks',
          features: [
            'Comprehensive nutrition and exercise guidance',
            'Bi-weekly one-on-one sessions with a wellness coach',
            'Weekly group workshops',
            'Personalized lifestyle plan and progress tracking'
          ]
        },
        {
          title: 'Sleep Improvement Program',
          price: '₹6,000',
          duration: '6 weeks',
          features: [
            'Assessment of sleep patterns and challenges',
            'Weekly sessions with a sleep specialist',
            'Personalized sleep hygiene plan',
            'Ongoing support and progress monitoring'
          ]
        }
      ],
      faqs: [
        {
          question: 'Who can benefit from wellness programs?',
          answer: 'Wellness programs are beneficial for anyone looking to improve their overall health and well-being. Whether youre dealing with stress, wanting to develop healthier habits, or seeking to enhance your quality of life, these programs provide structured support for positive change.'
        },
        {
          question: 'How much time commitment is required?',
          answer: 'Time commitment varies by program, but most require 2-4 hours per week for sessions and activities. Additionally, you will be implementing new practices in your daily life. The programs are designed to be integrated into busy schedules.'
        },
        {
          question: 'Can I join a program that has already started?',
          answer: 'Most of our programs have specific start dates to ensure all participants progress together. However, some programs offer rolling admission. Check the specific program details or contact us to find the next available start date.'
        },
        {
          question: 'Will I receive individual attention in group programs?',
          answer: 'Yes, while many activities are conducted in a group setting to provide community support, our programs include individual check-ins and personalized plans to address your specific needs and goals.'
        }
      ]
    },
    'coaching': {
      id: 'coaching',
      title: 'Life Coaching',
      description: 'Work with certified life coaches to set and achieve personal and professional goals, overcome obstacles, and create positive change.',
      longDescription: 'Our life coaching services empower you to bridge the gap between where you are and where you want to be. Through a collaborative partnership with a certified coach, you will gain clarity about your goals, develop actionable strategies, and receive the support and accountability you need to create meaningful change in your personal and professional life.',
      icon: <Coffee className="h-8 w-8 text-teal-600" />,
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      benefits: [
        'Goal setting and achievement strategies',
        'Accountability and motivation',
        'Personal growth and development',
        'Improved work-life balance',
        'Enhanced decision-making skills',
        'Greater self-awareness and confidence'
      ],
      process: [
        {
          title: 'Discovery Session',
          description: 'Explore your current situation, values, and aspirations to establish a foundation for coaching.'
        },
        {
          title: 'Goal Definition',
          description: 'Define clear, meaningful goals and create a roadmap for achieving them.'
        },
        {
          title: 'Action and Accountability',
          description: 'Implement action steps with ongoing support and accountability from your coach.'
        },
        {
          title: 'Review and Refinement',
          description: 'Regularly review progress, celebrate successes, and refine strategies as needed.'
        }
      ],
      pricing: [
        {
          title: 'Individual Coaching',
          price: '₹3,000',
          duration: '60 minutes',
          features: [
            'One-on-one sessions with a certified life coach',
            'Personalized coaching approach',
            'Email support between sessions',
            'Available in-person or virtually'
          ]
        },
        {
          title: 'Career Coaching',
          price: '₹3,500',
          duration: '60 minutes',
          features: [
            'Focus on professional development and career advancement',
            'Career transition strategies',
            'Leadership development',
            'Work-life balance optimization'
          ]
        },
        {
          title: 'Coaching Package',
          price: '₹15,000',
          duration: '6 sessions',
          features: [
            'Six 60-minute coaching sessions',
            'Comprehensive goal setting and action planning',
            'Unlimited email support',
            'Resources tailored to your specific goals'
          ]
        }
      ],
      faqs: [
        {
          question: 'What is the difference between coaching and therapy?',
          answer: 'While therapy often focuses on healing past issues and addressing mental health concerns, coaching is primarily future-oriented and focuses on setting and achieving goals. Coaches work with mentally healthy individuals who want to optimize their personal or professional lives.'
        },
        {
          question: 'How long does the coaching relationship typically last?',
          answer: 'The duration varies depending on your goals and needs. Some clients achieve their desired results in 3-6 months, while others maintain a coaching relationship for a year or more as they work on different areas of their lives or set new goals.'
        },
        {
          question: 'What qualifications do your coaches have?',
          answer: 'All our coaches are certified by recognized coaching organizations such as the International Coach Federation (ICF), with additional specialized training in their areas of expertise. Many also have backgrounds in business, psychology, or related fields.'
        },
        {
          question: 'How do I know if coaching is right for me?',
          answer: 'Coaching is ideal if youre ready to take action toward your goals, open to feedback and new perspectives, and willing to be accountable for your progress. If youre seeking guidance and support to create positive change rather than addressing mental health issues, coaching may be a good fit.'
        }
      ]
    },
    'meditation': {
      id: 'meditation',
      title: 'Meditation Classes',
      description: 'Learn meditation techniques from experienced instructors to reduce stress, improve focus, and enhance mental clarity.',
      longDescription: 'Our meditation classes provide a structured approach to developing a meditation practice, guided by experienced instructors. Whether youre a beginner or looking to deepen your existing practice, these classes offer techniques to help you reduce stress, improve focus, and cultivate greater awareness and inner peace in your daily life.',
      icon: <Lotus className="h-8 w-8 text-teal-600" />,
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      benefits: [
        'Reduced stress and anxiety',
        'Improved focus and concentration',
        'Enhanced emotional well-being',
        'Better sleep quality',
        'Increased self-awareness',
        'Tools for managing difficult emotions'
      ],
      process: [
        {
          title: 'Introduction to Meditation',
          description: 'Learn the fundamentals of meditation and establish a foundation for your practice.'
        },
        {
          title: 'Technique Exploration',
          description: 'Explore various meditation techniques to find approaches that resonate with you.'
        },
        {
          title: 'Regular Practice',
          description: 'Develop consistency through guided practice sessions and personalized feedback.'
        },
        {
          title: 'Integration',
          description: 'Learn to integrate mindfulness and meditation into your daily life beyond formal practice.'
        }
      ],
      pricing: [
        {
          title: 'Beginner Meditation Course',
          price: '₹4,500',
          duration: '6 weeks',
          features: [
            'Weekly 60-minute group classes',
            'Fundamentals of meditation practice',
            'Guided meditations for home practice',
            'Online resources and community support'
          ]
        },
        {
          title: 'Private Meditation Sessions',
          price: '₹1,800',
          duration: '45 minutes',
          features: [
            'One-on-one instruction with an experienced meditation teacher',
            'Personalized guidance for your specific needs',
            'Customized practice recommendations',
            'Available in-person or virtually'
          ]
        },
        {
          title: 'Advanced Meditation Course',
          price: '₹6,000',
          duration: '8 weeks',
          features: [
            'For those with established meditation practice',
            'Deeper exploration of meditation techniques',
            'Weekly 75-minute group classes',
            'Advanced practices and philosophical context'
          ]
        }
      ],
      faqs: [
        {
          question: 'Do I need any prior experience to start meditation classes?',
          answer: 'No prior experience is necessary for our beginner classes. We welcome practitioners of all levels and provide appropriate guidance based on your experience. Our instructors create a supportive environment for everyone to learn and grow.'
        },
        {
          question: 'How long does it take to see benefits from meditation?',
          answer: 'Many people report feeling more relaxed and centered after their first few sessions. However, the more profound benefits of meditation typically develop with regular practice over time. Research suggests that practicing for 8 weeks can lead to measurable changes in stress levels and focus.'
        },
        {
          question: 'Do I need any special equipment for meditation classes?',
          answer: 'No special equipment is required. We recommend comfortable clothing and, for in-person classes, you might want to bring your own meditation cushion or mat if you have one, though we provide these items as well. For virtual classes, just find a quiet space where you will not be disturbed.'
        },
        {
          question: 'Can meditation help with specific conditions like anxiety or insomnia?',
          answer: 'Research suggests that meditation can be beneficial for various conditions, including anxiety, stress, and sleep difficulties. While it is not a replacement for medical treatment, many people find it to be a valuable complementary practice. Our instructors can help you learn techniques that may be particularly helpful for your specific concerns.'
        }
      ]
    },
    'yoga': {
      id: 'yoga',
      title: 'Yoga Sessions',
      description: 'Practice yoga with certified instructors to improve flexibility, strength, and mental well-being through guided sessions.',
      longDescription: 'Our yoga sessions offer a holistic approach to physical and mental well-being, guided by certified instructors. Whether youre new to yoga or an experienced practitioner, these sessions provide a supportive environment to develop strength, flexibility, and mindfulness through various yoga styles and practices tailored to different levels and needs.',
      icon: <Yoga className="h-8 w-8 text-teal-600" />,
      image: 'https://images.unsplash.com/photo-1599447292180-45fd84092ef4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      benefits: [
        'Increased flexibility and strength',
        'Improved posture and balance',
        'Stress reduction and relaxation',
        'Mind-body connection',
        'Enhanced breathing awareness',
        'Community and support'
      ],
      process: [
        {
          title: 'Assessment and Orientation',
          description: 'Discuss your experience level, physical conditions, and goals to find the right yoga approach for you.'
        },
        {
          title: 'Foundational Practice',
          description: 'Learn proper alignment and basic poses to establish a safe and effective practice.'
        },
        {
          title: 'Progressive Development',
          description: 'Gradually build your practice with new poses and sequences appropriate for your level.'
        },
        {
          title: 'Deepening Awareness',
          description: 'Develop greater mindfulness and connection between breath, movement, and awareness.'
        }
      ],
      pricing: [
        {
          title: 'Group Yoga Classes',
          price: '₹600',
          duration: '75 minutes',
          features: [
            'Instruction in a small group setting',
            'Various class styles and levels available',
            'Alignment guidance and modifications',
            'Community support and motivation'
          ]
        },
        {
          title: 'Private Yoga Sessions',
          price: '₹2,000',
          duration: '60 minutes',
          features: [
            'One-on-one instruction with a certified yoga teacher',
            'Personalized practice tailored to your needs',
            'Focused attention on alignment and technique',
            'Available in-person or virtually'
          ]
        },
        {
          title: 'Yoga Package',
          price: '₹5,000',
          duration: '10 classes',
          features: [
            'Ten group yoga classes',
            'Valid for 3 months',
            'Access to all class levels and styles',
            'Discounted rate compared to drop-in classes'
          ]
        }
      ],
      faqs: [
        {
          question: 'I am not flexible. Can I still do yoga?',
          answer: 'Absolutely! Yoga is for everybody, regardless of flexibility. In fact, many people start yoga precisely because they want to become more flexible. Our instructors offer modifications for all poses to accommodate different body types and abilities. Flexibility develops with practice over time.'
        },
        {
          question: 'What should I wear to yoga classes?',
          answer: 'Wear comfortable clothing that allows you to move freely. Stretchy, breathable fabrics work well. You do not need special yoga clothes, but avoid very loose items that might get in the way during poses. For in-person classes, yoga is typically practiced barefoot on a mat.'
        },
        {
          question: 'What is the difference between the various yoga styles offered?',
          answer: 'We offer several styles to meet different needs: Hatha is gentle and focuses on basic poses, good for beginners; Vinyasa links movement with breath in flowing sequences; Yin involves holding poses for longer periods to target connective tissues; Restorative uses props to support the body in passive poses for deep relaxation. Our class descriptions provide more details.'
        },
        {
          question: 'How often should I practice yoga to see benefits?',
          answer: 'Consistency is more important than frequency. Even practicing once or twice a week can provide benefits. Many people find that 3-4 sessions per week offers a good balance for progress while allowing for rest. Listen to your body and find a schedule that works for your life and goals.'
        }
      ]
    }
  };
  
  const service = serviceId ? services[serviceId] : null;
  
  if (!service) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Service Not Found</h1>
          <p className="text-xl text-gray-600 mb-8">
            The service youre looking for doesn't exist or has been moved.
          </p>
          <Link 
            to="/services" 
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700"
          >
            View All Services
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-16">
        <div className="flex items-center mb-4">
          <div className="bg-teal-100 p-3 rounded-full mr-4">
            {service.icon}
          </div>
          <h1 className="text-4xl font-bold text-gray-900">{service.title}</h1>
        </div>
        <p className="text-xl text-gray-600 max-w-3xl">
          {service.longDescription}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
        <div>
          <img 
            src={service.image} 
            alt={service.title} 
            className="rounded-lg shadow-xl w-full h-auto"
          />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Benefits</h2>
          <ul className="space-y-4">
            {service.benefits.map((benefit, index) => (
              <li key={index} className="flex items-start">
                <div className="bg-teal-100 p-1 rounded-full mr-3 mt-1">
                  <Check className="h-4 w-4 text-teal-600" />
                </div>
                <span className="text-gray-700">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mb-20">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Our Process</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {service.process.map((step, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md relative">
              <div className="absolute -top-4 -left-4 bg-teal-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                {index + 1}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-20">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Pricing Options</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {service.pricing.map((option, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
              <div className="bg-teal-600 text-white p-6 text-center">
                <h3 className="text-xl font-bold mb-1">{option.title}</h3>
                <div className="flex items-center justify-center">
                  <DollarSign className="h-5 w-5" />
                  <span className="text-3xl font-bold">{option.price}</span>
                </div>
                <div className="flex items-center justify-center mt-2 text-teal-100">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{option.duration}</span>
                </div>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                  {option.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="h-5 w-5 text-teal-600 mr-2 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  <Link 
                    to={`/book-appointment?service=${service.id}&option=${index}`} 
                    className="block w-full text-center bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 transition duration-300"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-20">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
        <div className="space-y-6 max-w-3xl mx-auto">
          {service.faqs.map((faq, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-3 text-gray-900">{faq.question}</h3>
              <p className="text-gray-600">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-teal-50 rounded-xl p-12 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Book your first {service.title.toLowerCase()} today and take the first step on your journey to better health and well-being.
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link
            to={`/book-appointment?service=${service.id}`}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700"
          >
            <Calendar className="h-5 w-5 mr-2" />
            Book Appointment
          </Link>
          <Link
            to="/professionals"
            className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <Users className="h-5 w-5 mr-2" />
            Browse Professionals
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetails;