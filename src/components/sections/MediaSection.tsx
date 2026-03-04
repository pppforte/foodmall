'use client';

import { useInView } from '@/hooks/useInView';

const MEDIA_ITEMS = [
  { name: 'KBS', program: '생생정보' },
  { name: 'MBC', program: '생방송 오늘 아침' },
  { name: 'SBS', program: '좋은 아침' },
  { name: 'TV조선', program: '식객 허영만의 백반기행' },
  { name: '매일경제', program: '프랜차이즈 대상' },
  { name: 'YTN', program: '창업 트렌드' },
];

export default function MediaSection() {
  const { ref, isInView } = useInView();

  return (
    <section id="media" className="py-16 lg:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-black text-[var(--color-primary)] mb-4">
            미디어
          </h2>
          <p className="text-[var(--color-text-light)]">다양한 매체에서 인정받은 맛</p>
          <div className="w-16 h-1 bg-[var(--color-accent)] mx-auto mt-4" />
        </div>

        <div
          ref={ref}
          className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6 transition-all duration-700 ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          {MEDIA_ITEMS.map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-16 h-16 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-gray-600">{item.name}</span>
              </div>
              <p className="text-xs text-[var(--color-text-light)]">{item.program}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
