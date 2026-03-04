'use client';

import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import Image from 'next/image';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const CATEGORIES = [
  {
    label: '순두부',
    images: Array.from({ length: 7 }, (_, i) => ({
      src: `https://wandduk.com/images/menuslide${i + 1}.jpg`,
      alt: `순두부 메뉴 ${i + 1}`,
    })),
  },
  {
    label: '돌솥밥',
    images: Array.from({ length: 3 }, (_, i) => ({
      src: `https://wandduk.com/images/menuslide${i + 8}.jpg`,
      alt: `돌솥밥 메뉴 ${i + 1}`,
    })),
  },
  {
    label: '사이드',
    images: Array.from({ length: 6 }, (_, i) => ({
      src: `https://wandduk.com/images/menuslide${i + 11}.jpg`,
      alt: `사이드 메뉴 ${i + 1}`,
    })),
  },
];

export default function MenuTabSection() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section id="menu" className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl lg:text-4xl font-black text-[var(--color-primary)] mb-4">
            메뉴 소개
          </h2>
          <div className="w-16 h-1 bg-[var(--color-accent)] mx-auto" />
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-gray-100 rounded-full p-1">
            {CATEGORIES.map((cat, i) => (
              <button
                key={i}
                onClick={() => setActiveTab(i)}
                className={`px-6 py-3 rounded-full font-semibold text-sm transition-all ${
                  activeTab === i
                    ? 'bg-[var(--color-primary)] text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Slider */}
        <Swiper
          key={activeTab}
          modules={[Autoplay, Navigation, Pagination]}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          navigation
          pagination={{ clickable: true }}
          loop={CATEGORIES[activeTab].images.length > 1}
          spaceBetween={0}
          slidesPerView={1}
          className="rounded-2xl overflow-hidden shadow-xl"
        >
          {CATEGORIES[activeTab].images.map((img, i) => (
            <SwiperSlide key={i}>
              <div className="relative aspect-[2/1] bg-gray-200">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
