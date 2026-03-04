'use client';

import { useEffect } from 'react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: { label: string; href: string }[];
}

export default function MobileMenu({ isOpen, onClose, navItems }: MobileMenuProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleNavClick = (href: string) => {
    onClose();
    if (href.startsWith('#')) {
      setTimeout(() => {
        const element = document.querySelector(href);
        if (element) {
          const offset = 80;
          const top = element.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }, 300);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-[100] transition-all duration-300 ${
        isOpen ? 'visible opacity-100' : 'invisible opacity-0'
      }`}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      {/* Menu Panel */}
      <div
        className={`absolute right-0 top-0 bottom-0 w-[80%] max-w-sm bg-white shadow-2xl transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Close button */}
        <div className="flex justify-end p-4">
          <button onClick={onClose} aria-label="메뉴 닫기" className="p-2">
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Logo */}
        <div className="px-6 pb-6 border-b">
          <span className="text-2xl font-black text-[var(--color-primary)]">완뚝순두부</span>
        </div>

        {/* Navigation */}
        <nav className="px-6 py-4">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(item.href);
              }}
              className="block py-4 text-lg font-medium text-gray-700 border-b border-gray-100 hover:text-[var(--color-primary)] transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Phone */}
        <div className="px-6 py-4">
          <a
            href="tel:1668-1977"
            className="flex items-center justify-center space-x-2 w-full py-4 bg-[var(--color-primary)] text-white rounded-lg font-bold text-lg"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
            </svg>
            <span>1668-1977</span>
          </a>
        </div>

        {/* CTA */}
        <div className="px-6">
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('#contact');
            }}
            className="block w-full py-4 bg-[var(--color-accent)] text-white text-center rounded-lg font-bold text-lg"
          >
            창업 문의하기
          </a>
        </div>
      </div>
    </div>
  );
}
