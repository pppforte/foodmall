'use client';

import { useState } from 'react';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    hasStore: 'no',
    region: '',
    content: '',
    privacyAgreed: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else if (name === 'phone') {
      setFormData((prev) => ({ ...prev, [name]: value.replace(/[^0-9]/g, '') }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.privacyAgreed) {
      alert('개인정보 수집 이용에 동의해주세요.');
      return;
    }
    setIsSubmitting(true);
    setSubmitResult(null);

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, source: 'form' }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitResult({ success: true, message: '상담 문의가 접수되었습니다. 빠른 시일 내에 연락드리겠습니다.' });
        setFormData({ name: '', phone: '', hasStore: 'no', region: '', content: '', privacyAgreed: false });
      } else {
        setSubmitResult({ success: false, message: data.error || '접수에 실패했습니다. 다시 시도해주세요.' });
      }
    } catch {
      setSubmitResult({ success: false, message: '네트워크 오류가 발생했습니다.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-16 lg:py-24 bg-[var(--color-secondary)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-black text-white mb-4">창업 문의</h2>
          <p className="text-gray-400">성공 창업의 첫 걸음, 지금 바로 상담하세요</p>
          <div className="w-16 h-1 bg-[var(--color-accent)] mx-auto mt-4" />
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
          {/* Left: Contact Info */}
          <div className="w-full lg:w-1/3 text-white">
            <div className="bg-white/10 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6">연락처</h3>
              <a
                href="tel:1668-1977"
                className="flex items-center space-x-4 mb-6 p-4 bg-[var(--color-primary)] rounded-xl hover:bg-[var(--color-primary-dark)] transition-colors"
              >
                <svg className="w-8 h-8 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                </svg>
                <div>
                  <p className="text-sm opacity-80">대표번호</p>
                  <p className="text-2xl font-bold">1668-1977</p>
                </div>
              </a>
              <p className="text-gray-400 text-sm leading-relaxed">
                평일 09:00 ~ 18:00<br />
                토/일/공휴일 휴무<br /><br />
                전화 상담이 어려우시면<br />
                우측 폼으로 문의해주세요.
              </p>
            </div>
          </div>

          {/* Right: Form */}
          <div className="w-full lg:w-2/3">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 lg:p-10 shadow-xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">이름 *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition"
                    placeholder="이름을 입력하세요"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">연락처 *</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    inputMode="numeric"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition"
                    placeholder="숫자만 입력하세요"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">점포 유무</label>
                  <div className="flex items-center space-x-6 py-3">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="hasStore"
                        value="yes"
                        checked={formData.hasStore === 'yes'}
                        onChange={handleChange}
                        className="w-5 h-5 text-[var(--color-primary)]"
                      />
                      <span>있음</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="hasStore"
                        value="no"
                        checked={formData.hasStore === 'no'}
                        onChange={handleChange}
                        className="w-5 h-5 text-[var(--color-primary)]"
                      />
                      <span>없음</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">창업 희망 지역 *</label>
                  <input
                    type="text"
                    name="region"
                    value={formData.region}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition"
                    placeholder="예: 서울 강남구"
                  />
                </div>
              </div>

              <div className="mt-4 lg:mt-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">문의 내용 *</label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition resize-none"
                  placeholder="문의 내용을 입력하세요"
                />
              </div>

              <div className="mt-4 flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="privacyAgreed"
                  checked={formData.privacyAgreed}
                  onChange={handleChange}
                  className="w-5 h-5"
                  id="privacy"
                />
                <label htmlFor="privacy" className="text-sm text-gray-600 cursor-pointer">
                  개인정보 수집 및 이용에 동의합니다 (필수)
                </label>
              </div>

              {submitResult && (
                <div className={`mt-4 p-4 rounded-lg text-sm ${
                  submitResult.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                }`}>
                  {submitResult.message}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-6 py-4 bg-[var(--color-primary)] text-white font-bold text-lg rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? '접수 중...' : '상담 신청하기'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
