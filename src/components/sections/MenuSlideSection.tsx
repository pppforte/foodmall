'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import Image from 'next/image';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const MENU_IMAGES = Array.from({ length: 7 }, (_, i) => ({
  src: `https://wandduk.com/images/menuslide${i + 1}.jpg`,
  alt: `메뉴 ${i + 1}`,
}));

export default function MenuSlideSection() {
  return (
    <section id="menu-slide" className="py-16 lg:py-24 bg-[var(--color-secondary)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl lg:text-4xl font-black text-white mb-4">
            대표 메뉴
          </h2>
          <div className="w-16 h-1 bg-[var(--color-accent)] mx-auto" />
        </div>

        <Swiper
          modules={[Autoplay, Navigation, Pagination]}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          navigation
          pagination={{ clickable: true }}
          loop
          spaceBetween={20}
          slidesPerView={1}
          breakpoints={{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="menu-swiper"
        >
          {MENU_IMAGES.map((img, i) => (
            <SwiperSlide key={i}>
              <div className="relative aspect-[2/1] rounded-xl overflow-hidden bg-gray-700">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
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
