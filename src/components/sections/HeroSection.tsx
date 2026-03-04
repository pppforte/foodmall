'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';

const HERO_SLIDES = [
  {
    title: '전 가맹점 웨이팅 기본!',
    subtitle: '검증된 맛과 브랜드로 안정적인 창업',
    bg: 'from-[var(--color-primary)] to-[var(--color-primary-dark)]',
  },
  {
    title: '체계적인 지원과 노하우 전수',
    subtitle: '맞춤형 상담 및 다양한 창업 패키지 제공',
    bg: 'from-amber-900 to-amber-950',
  },
  {
    title: '소자본으로 시작하는 한식 창업',
    subtitle: '업종변경도 OK! 지금 바로 상담하세요',
    bg: 'from-stone-800 to-stone-900',
  },
];

export default function HeroSection() {
  const scrollToContact = () => {
    const el = document.querySelector('#contact');
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative">
      <Swiper
        modules={[Autoplay, EffectFade, Pagination]}
        effect="fade"
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop
        className="w-full h-[100svh] min-h-[600px]"
      >
        {HERO_SLIDES.map((slide, i) => (
          <SwiperSlide key={i}>
            <div className={`relative w-full h-full bg-gradient-to-br ${slide.bg} flex items-center justify-center`}>
              <div className="absolute inset-0 bg-black/30" />
              <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 lg:mb-6 leading-tight">
                  {slide.title}
                </h1>
                <p className="text-lg sm:text-xl md:text-2xl font-light mb-8 lg:mb-12 opacity-90">
                  {slide.subtitle}
                </p>
                <button
                  onClick={scrollToContact}
                  className="inline-block px-8 py-4 bg-[var(--color-accent)] text-white font-bold text-lg rounded-full hover:bg-yellow-600 transition-all active:scale-95 shadow-lg"
                >
                  창업 상담 신청하기
                </button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
