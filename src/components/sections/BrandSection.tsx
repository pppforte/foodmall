'use client';

import { useInView } from '@/hooks/useInView';
import Image from 'next/image';

export default function BrandSection() {
  const { ref: ref1, isInView: inView1 } = useInView({ threshold: 0.2 });
  const { ref: ref2, isInView: inView2 } = useInView({ threshold: 0.2 });

  return (
    <section id="brand" className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl lg:text-4xl font-black text-[var(--color-primary)] mb-4">
            브랜드 소개
          </h2>
          <div className="w-16 h-1 bg-[var(--color-accent)] mx-auto" />
        </div>

        {/* Content Row 1 */}
        <div
          ref={ref1}
          className={`flex flex-col lg:flex-row items-center gap-8 lg:gap-16 mb-16 lg:mb-24 transition-all duration-700 ${
            inView1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="w-full lg:w-1/2">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl bg-gray-200">
              <Image
                src="https://wandduk.com/images/interiorslide1.jpg"
                alt="완뚝순두부 매장"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          </div>
          <div className="w-full lg:w-1/2">
            <h3 className="text-2xl lg:text-3xl font-bold mb-4 text-[var(--color-secondary)]">
              정성을 담은 한 그릇
            </h3>
            <p className="text-[var(--color-text-light)] leading-relaxed text-base lg:text-lg">
              완뚝순두부는 국내산 콩을 사용하여 매일 아침 직접 순두부를 만듭니다.
              전통 방식 그대로 정성을 다해 만든 순두부와 돌솥밥으로
              고객 한 분 한 분에게 따뜻한 한 끼를 제공합니다.
              <br /><br />
              20년 이상의 노하우를 바탕으로 변하지 않는 맛을 지켜가고 있으며,
              전 가맹점에서 동일한 맛과 품질을 유지하고 있습니다.
            </p>
          </div>
        </div>

        {/* Content Row 2 */}
        <div
          ref={ref2}
          className={`flex flex-col-reverse lg:flex-row items-center gap-8 lg:gap-16 transition-all duration-700 ${
            inView2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="w-full lg:w-1/2">
            <h3 className="text-2xl lg:text-3xl font-bold mb-4 text-[var(--color-secondary)]">
              전 가맹점 웨이팅 기본!
            </h3>
            <p className="text-[var(--color-text-light)] leading-relaxed text-base lg:text-lg">
              검증된 맛과 브랜드 파워로 오픈과 동시에 웨이팅이 시작됩니다.
              체계적인 본사 지원 시스템과 지속적인 메뉴 개발로
              안정적인 매출을 보장합니다.
              <br /><br />
              가맹점주님의 성공이 곧 우리의 성공입니다.
              함께 성장하는 파트너십을 지향합니다.
            </p>
            <a
              href="#contact"
              className="inline-block mt-6 px-6 py-3 bg-[var(--color-primary)] text-white font-semibold rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors"
            >
              가맹 문의하기 →
            </a>
          </div>
          <div className="w-full lg:w-1/2">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl bg-gray-200">
              <Image
                src="https://wandduk.com/images/interiorslide2.jpg"
                alt="완뚝순두부 음식"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
