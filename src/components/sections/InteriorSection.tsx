'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import Image from 'next/image';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const INTERIOR_IMAGES = Array.from({ length: 10 }, (_, i) => ({
  src: `https://wandduk.com/images/interiorslide${i + 1}.jpg`,
  alt: `인테리어 ${i + 1}`,
}));

export default function InteriorSection() {
  return (
    <section id="interior" className="py-16 lg:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl lg:text-4xl font-black text-[var(--color-primary)] mb-4">
            인테리어
          </h2>
          <p className="text-[var(--color-text-light)]">모던하고 따뜻한 공간</p>
          <div className="w-16 h-1 bg-[var(--color-accent)] mx-auto mt-4" />
        </div>

        <Swiper
          modules={[Autoplay, Navigation, Pagination]}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          navigation
          pagination={{ clickable: true }}
          loop
          spaceBetween={0}
          slidesPerView={1}
          className="rounded-2xl overflow-hidden shadow-xl"
        >
          {INTERIOR_IMAGES.map((img, i) => (
            <SwiperSlide key={i}>
              <div className="relative aspect-[5/3] bg-gray-200">
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
