import React, { useState } from 'react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const faqData = [
  {
    question: 'How does the AI matching work?',
    answer: 'TalentMatch AI uses Claude (by Anthropic) to analyze resume content against job descriptions. It evaluates skills, experience, education, and overall fit to generate a compatibility score from 0–100% along with matching skills and detailed reasoning.',
  },
  {
    question: 'What file formats are supported for resumes?',
    answer: 'We support PDF, DOC, DOCX, and TXT file formats. The system automatically extracts and parses the text content from your resume for AI analysis. Maximum file size is 5MB.',
  },
  {
    question: 'Is TalentMatch AI free to use?',
    answer: 'Yes! TalentMatch AI is free to get started. Both recruiters and candidates can sign up, post jobs, upload resumes, and use the AI matching feature at no cost during our open beta.',
  },
  {
    question: 'How accurate is the matching score?',
    answer: 'Our AI matching achieves approximately 96% accuracy compared to expert human evaluation. The system considers technical skills, years of experience, educational background, and contextual fit — not just keyword matching.',
  },
  {
    question: 'Can I use it as both a recruiter and a candidate?',
    answer: 'Currently, each account is tied to a single role (recruiter or candidate) selected during registration. If you need to switch roles, you can update your profile or create a second account with a different email.',
  },
  {
    question: 'How is my data protected?',
    answer: 'We use JWT-based authentication, bcrypt password hashing, and role-based access control. Resume content is processed securely and only used for matching purposes. We never share your data with third parties.',
  },
];

const FAQ = () => {
  const [ref, isVisible] = useScrollAnimation();
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="relative py-20 lg:py-24" style={{ background: '#030014' }}>
      <div ref={ref} className="w-full max-w-3xl mx-auto px-6 sm:px-8">
        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/20 bg-purple-500/5 text-purple-400 text-sm font-medium mb-6">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            FAQ
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4 tracking-tight">
            Frequently asked <span className="gradient-text">questions</span>
          </h2>
          <p className="text-slate-400 text-lg">
            Everything you need to know about TalentMatch AI.
          </p>
        </div>

        {/* Accordion */}
        <div className={`space-y-3 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {faqData.map((faq, i) => (
            <div
              key={i}
              className="rounded-2xl overflow-hidden transition-all duration-300 bg-white/5 backdrop-blur-md border border-white/10 text-white"
            >
              <button
                onClick={() => toggle(i)}
                className="text-white flex justify-between items-center w-full p-5 sm:p-6 text-left group hover:bg-white/10 transition-colors"
              >
                <h3 className="text-white font-semibold text-base sm:text-lg pr-4">
                  {faq.question}
                </h3>
                <span className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                  openIndex === i
                    ? 'bg-purple-600 text-white rotate-45 shadow-md shadow-purple-500/30'
                    : 'bg-white/10 text-white group-hover:bg-white/20 group-hover:scale-110'
                }`}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                  </svg>
                </span>
              </button>
              <div
                className="overflow-hidden transition-all duration-300 ease-in-out"
                style={{
                  maxHeight: openIndex === i ? '300px' : '0',
                  opacity: openIndex === i ? 1 : 0,
                }}
              >
                <p className="px-5 sm:px-6 pb-5 sm:pb-6 text-gray-300 text-base leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
