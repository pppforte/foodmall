'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface SettingsForm {
  // Section 1: 사이트 정보
  siteName: string;
  siteUrl: string;
  phone: string;
  // Section 2: 관리자 계정
  adminUsername: string;
  newPassword: string;
  confirmPassword: string;
  // Section 3: 이메일 (SMTP) 설정
  smtpHost: string;
  smtpPort: string;
  smtpUser: string;
  smtpPass: string;
  mailTo: string;
  mailFrom: string;
  // Section 4: 외부 API 키
  kakaoMapKey: string;
  naverClientId: string;
  naverClientSecret: string;
  // Section 5: 블로그 수집 설정
  blogSearchKeyword: string;
  cronSecret: string;
}

interface SettingsApiResponse {
  success: boolean;
  data?: Partial<SettingsForm> & { hasPassword?: boolean };
  error?: string;
}

const emptyForm: SettingsForm = {
  siteName: '',
  siteUrl: '',
  phone: '',
  adminUsername: '',
  newPassword: '',
  confirmPassword: '',
  smtpHost: '',
  smtpPort: '',
  smtpUser: '',
  smtpPass: '',
  mailTo: '',
  mailFrom: '',
  kakaoMapKey: '',
  naverClientId: '',
  naverClientSecret: '',
  blogSearchKeyword: '',
  cronSecret: '',
};

export default function AdminSettingsPage() {
  const router = useRouter();
  const [form, setForm] = useState<SettingsForm>(emptyForm);
  const [hasPassword, setHasPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [validationError, setValidationError] = useState('');

  // Password field visibility toggles
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSmtpPass, setShowSmtpPass] = useState(false);

  // Track original values for change detection
  const [originalForm, setOriginalForm] = useState<Partial<SettingsForm>>({});

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((res) => res.json())
      .then((data: SettingsApiResponse) => {
        if (!data.success) {
          router.push('/admin/login');
          return;
        }
        const apiData = data.data ?? {};
        const populated: SettingsForm = {
          siteName: apiData.siteName ?? '',
          siteUrl: apiData.siteUrl ?? '',
          phone: apiData.phone ?? '',
          adminUsername: apiData.adminUsername ?? '',
          newPassword: '',
          confirmPassword: '',
          smtpHost: apiData.smtpHost ?? '',
          smtpPort: apiData.smtpPort ?? '',
          smtpUser: apiData.smtpUser ?? '',
          smtpPass: '',
          mailTo: apiData.mailTo ?? '',
          mailFrom: apiData.mailFrom ?? '',
          kakaoMapKey: apiData.kakaoMapKey ?? '',
          naverClientId: apiData.naverClientId ?? '',
          naverClientSecret: apiData.naverClientSecret ?? '',
          blogSearchKeyword: apiData.blogSearchKeyword ?? '',
          cronSecret: apiData.cronSecret ?? '',
        };
        setForm(populated);
        setOriginalForm(populated);
        setHasPassword(apiData.hasPassword ?? false);
        setLoading(false);
      })
      .catch(() => {
        router.push('/admin/login');
      });
  }, [router]);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSave = async () => {
    setValidationError('');

    if (form.newPassword && form.newPassword !== form.confirmPassword) {
      setValidationError('새 비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      return;
    }

    setSaving(true);
    try {
      // Build payload with only changed fields
      const payload: Record<string, string | number> = {};

      const textFields: (keyof SettingsForm)[] = [
        'siteName',
        'siteUrl',
        'phone',
        'adminUsername',
        'smtpHost',
        'smtpPort',
        'smtpUser',
        'mailTo',
        'mailFrom',
        'kakaoMapKey',
        'naverClientId',
        'naverClientSecret',
        'blogSearchKeyword',
        'cronSecret',
      ];

      for (const field of textFields) {
        if (form[field] !== originalForm[field]) {
          payload[field] = form[field];
        }
      }

      // smtpPass: only include if user typed something
      if (form.smtpPass) {
        payload.smtpPass = form.smtpPass;
      }

      // newPassword: only include if provided
      if (form.newPassword) {
        payload.newPassword = form.newPassword;
      }

      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data: SettingsApiResponse = await res.json();

      if (!data.success) {
        showToast('error', data.error ?? '저장에 실패했습니다.');
        return;
      }

      // Update original form reference and clear password fields
      setOriginalForm({ ...form, newPassword: '', confirmPassword: '', smtpPass: '' });
      setForm((prev) => ({ ...prev, newPassword: '', confirmPassword: '', smtpPass: '' }));

      if (form.newPassword) {
        setHasPassword(true);
      }

      showToast('success', '설정이 저장되었습니다.');
    } catch {
      showToast('error', '네트워크 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-400';

  const setField = (field: keyof SettingsForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 max-w-4xl mx-auto">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg text-sm font-medium text-white transition-all ${
            toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Top bar */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="text-gray-400 hover:text-gray-600 text-sm">
            대시보드
          </Link>
          <span className="text-gray-300">/</span>
          <h1 className="text-xl font-bold text-gray-800">설정</h1>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors text-sm font-medium disabled:opacity-50"
        >
          {saving ? '저장 중...' : '저장'}
        </button>
      </div>

      {/* Validation error */}
      {validationError && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
          {validationError}
        </div>
      )}

      <div className="space-y-6">
        {/* Section 1: 사이트 정보 */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="font-bold text-gray-800 mb-5">사이트 정보</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">사이트명</label>
              <input
                type="text"
                value={form.siteName}
                onChange={(e) => setField('siteName', e.target.value)}
                className={inputClass}
                placeholder="예: 푸드몰"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">사이트 URL</label>
              <input
                type="text"
                value={form.siteUrl}
                onChange={(e) => setField('siteUrl', e.target.value)}
                className={inputClass}
                placeholder="https://example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">대표 전화번호</label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setField('phone', e.target.value)}
                className={inputClass}
                placeholder="02-0000-0000"
              />
            </div>
          </div>
        </div>

        {/* Section 2: 관리자 계정 */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="font-bold text-gray-800 mb-5">관리자 계정</h2>
          <div className="mb-3">
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                hasPassword
                  ? 'bg-teal-50 text-teal-700'
                  : 'bg-yellow-50 text-yellow-700'
              }`}
            >
              {hasPassword
                ? '현재 비밀번호가 설정되어 있습니다'
                : '비밀번호가 설정되지 않았습니다'}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">관리자 아이디</label>
              <input
                type="text"
                value={form.adminUsername}
                onChange={(e) => setField('adminUsername', e.target.value)}
                className={inputClass}
                placeholder="admin"
                autoComplete="username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                새 비밀번호
                <span className="ml-1 text-gray-400 font-normal text-xs">(비어있으면 변경 안함)</span>
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={form.newPassword}
                  onChange={(e) => setField('newPassword', e.target.value)}
                  className={`${inputClass} pr-20`}
                  placeholder="새 비밀번호"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600"
                >
                  {showNewPassword ? '숨기기' : '표시'}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호 확인</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={form.confirmPassword}
                  onChange={(e) => setField('confirmPassword', e.target.value)}
                  className={`${inputClass} pr-20`}
                  placeholder="비밀번호 확인"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? '숨기기' : '표시'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: 이메일 (SMTP) 설정 */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="font-bold text-gray-800 mb-5">이메일 (SMTP) 설정</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SMTP 호스트</label>
              <input
                type="text"
                value={form.smtpHost}
                onChange={(e) => setField('smtpHost', e.target.value)}
                className={inputClass}
                placeholder="smtp.gmail.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SMTP 포트</label>
              <input
                type="number"
                value={form.smtpPort}
                onChange={(e) => setField('smtpPort', e.target.value)}
                className={inputClass}
                placeholder="587"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SMTP 사용자 (이메일)
              </label>
              <input
                type="text"
                value={form.smtpUser}
                onChange={(e) => setField('smtpUser', e.target.value)}
                className={inputClass}
                placeholder="your@email.com"
                autoComplete="email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SMTP 비밀번호
                <span className="ml-1 text-gray-400 font-normal text-xs">(앱 비밀번호)</span>
              </label>
              <div className="relative">
                <input
                  type={showSmtpPass ? 'text' : 'password'}
                  value={form.smtpPass}
                  onChange={(e) => setField('smtpPass', e.target.value)}
                  className={`${inputClass} pr-20`}
                  placeholder="앱 비밀번호 입력 시에만 변경"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowSmtpPass((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600"
                >
                  {showSmtpPass ? '숨기기' : '표시'}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                문의 수신 이메일
              </label>
              <input
                type="text"
                value={form.mailTo}
                onChange={(e) => setField('mailTo', e.target.value)}
                className={inputClass}
                placeholder="inquiry@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">발신자 표시</label>
              <input
                type="text"
                value={form.mailFrom}
                onChange={(e) => setField('mailFrom', e.target.value)}
                className={inputClass}
                placeholder="푸드몰 <noreply@example.com>"
              />
            </div>
          </div>
        </div>

        {/* Section 4: 외부 API 키 */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="font-bold text-gray-800 mb-5">외부 API 키</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                카카오맵 JavaScript 키
              </label>
              <input
                type="text"
                value={form.kakaoMapKey}
                onChange={(e) => setField('kakaoMapKey', e.target.value)}
                className={inputClass}
                placeholder="카카오 개발자 콘솔에서 발급"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                네이버 Client ID
              </label>
              <input
                type="text"
                value={form.naverClientId}
                onChange={(e) => setField('naverClientId', e.target.value)}
                className={inputClass}
                placeholder="네이버 개발자 센터에서 발급"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                네이버 Client Secret
              </label>
              <input
                type="text"
                value={form.naverClientSecret}
                onChange={(e) => setField('naverClientSecret', e.target.value)}
                className={inputClass}
                placeholder="네이버 개발자 센터에서 발급"
              />
            </div>
          </div>
        </div>

        {/* Section 5: 블로그 수집 설정 */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="font-bold text-gray-800 mb-5">블로그 수집 설정</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                블로그 검색 키워드
              </label>
              <input
                type="text"
                value={form.blogSearchKeyword}
                onChange={(e) => setField('blogSearchKeyword', e.target.value)}
                className={inputClass}
                placeholder="예: 푸드몰 맛집"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">크론 시크릿 키</label>
              <input
                type="text"
                value={form.cronSecret}
                onChange={(e) => setField('cronSecret', e.target.value)}
                className={inputClass}
                placeholder="크론 작업 인증 키"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom save button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors text-sm font-medium disabled:opacity-50"
        >
          {saving ? '저장 중...' : '저장'}
        </button>
      </div>
    </div>
  );
}
