'use client';

import { useState, useEffect } from 'react';

export default function MobileCTA() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = () => {
    const contactSection = document.querySelector('#contact');
    if (contactSection) {
      const offset = 80;
      const top = contactSection.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <div
      className={`lg:hidden fixed bottom-4 left-4 right-4 z-40 transition-all duration-300 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
      }`}
    >
      <button
        onClick={handleClick}
        className="w-full py-4 bg-[var(--color-primary)] text-white rounded-full font-bold text-lg shadow-lg hover:bg-[var(--color-primary-dark)] active:scale-95 transition-all flex items-center justify-center space-x-2"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
        </svg>
        <span>창업 문의하기</span>
      </button>
    </div>
  );
}
