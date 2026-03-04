'use client';

import { useInView } from '@/hooks/useInView';

const BENEFITS = [
  { icon: '🏪', title: '소자본 창업', desc: '합리적인 창업 비용으로 시작하는 안정적인 사업' },
  { icon: '📋', title: '체계적 교육', desc: '오픈 전 집중 교육 및 지속적인 현장 지원' },
  { icon: '🍲', title: '검증된 레시피', desc: '20년 노하우가 담긴 표준화된 조리 시스템' },
  { icon: '📈', title: '매출 보장', desc: '전 가맹점 웨이팅 기본! 검증된 수익 모델' },
  { icon: '🚚', title: '원재료 공급', desc: '본사 직영 물류로 안정적인 식자재 공급' },
  { icon: '📢', title: '마케팅 지원', desc: '본사 주도 TV광고, SNS 마케팅 지원' },
];

export default function FranchiseSection() {
  const { ref, isInView } = useInView();

  return (
    <section id="franchise" className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl lg:text-4xl font-black text-[var(--color-primary)] mb-4">
            가맹 안내
          </h2>
          <p className="text-[var(--color-text-light)] text-lg">
            성공 창업의 파트너, 완뚝순두부
          </p>
          <div className="w-16 h-1 bg-[var(--color-accent)] mx-auto mt-4" />
        </div>

        <div
          ref={ref}
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 transition-all duration-700 ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          {BENEFITS.map((item, i) => (
            <div
              key={i}
              className="bg-gray-50 rounded-2xl p-6 lg:p-8 hover:bg-[var(--color-primary)] hover:text-white group transition-all duration-300 cursor-default"
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-white">{item.title}</h3>
              <p className="text-[var(--color-text-light)] group-hover:text-white/80 text-sm leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="#contact"
            className="inline-block px-8 py-4 bg-[var(--color-primary)] text-white font-bold text-lg rounded-full hover:bg-[var(--color-primary-dark)] transition-colors shadow-lg"
          >
            지금 상담받기 →
          </a>
        </div>
      </div>
    </section>
  );
}
