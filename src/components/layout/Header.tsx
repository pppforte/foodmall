'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import MobileMenu from './MobileMenu';

const NAV_ITEMS = [
  { label: '브랜드소개', href: '#brand' },
  { label: '메뉴', href: '#menu' },
  { label: '미디어', href: '#media' },
  { label: '가맹안내', href: '#franchise' },
  { label: '인테리어', href: '#interior' },
  { label: '매장안내', href: '#store' },
  { label: '창업문의', href: '#contact' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const element = document.querySelector(href);
      if (element) {
        const offset = 80;
        const top = element.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <span
                className={`text-xl lg:text-2xl font-black transition-colors ${
                  isScrolled ? 'text-[var(--color-primary)]' : 'text-white'
                }`}
              >
                완뚝순두부
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`text-sm font-medium transition-colors hover:text-[var(--color-primary)] ${
                    isScrolled ? 'text-gray-700' : 'text-white'
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </nav>

            {/* Phone + Mobile Menu */}
            <div className="flex items-center space-x-4">
              <a
                href="tel:1668-1977"
                className={`hidden sm:flex items-center space-x-1 text-sm font-bold transition-colors ${
                  isScrolled ? 'text-[var(--color-primary)]' : 'text-white'
                }`}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                </svg>
                <span>1668-1977</span>
              </a>

              {/* Mobile: Phone icon */}
              <a
                href="tel:1668-1977"
                className={`sm:hidden p-2 transition-colors ${
                  isScrolled ? 'text-[var(--color-primary)]' : 'text-white'
                }`}
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                </svg>
              </a>

              {/* Hamburger */}
              <button
                className="lg:hidden p-2"
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="메뉴 열기"
              >
                <svg
                  className={`w-6 h-6 transition-colors ${
                    isScrolled ? 'text-gray-700' : 'text-white'
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        navItems={NAV_ITEMS}
      />
    </>
  );
}
