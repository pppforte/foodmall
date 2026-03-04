'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface DashboardData {
  popups: number;
  stores: number;
  inquiries: { total: number; pending: number };
  notices: number;
  blogPosts: number;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/popups').then((r) => r.json()),
      fetch('/api/admin/stores').then((r) => r.json()),
      fetch('/api/admin/inquiries').then((r) => r.json()),
      fetch('/api/admin/notices').then((r) => r.json()),
      fetch('/api/admin/blog').then((r) => r.json()),
    ])
      .then(([popups, stores, inquiries, notices, blog]) => {
        if (!popups.success || !stores.success || !inquiries.success) {
          router.push('/admin/login');
          return;
        }
        setData({
          popups: popups.data?.length || 0,
          stores: stores.data?.length || 0,
          inquiries: {
            total: inquiries.total || 0,
            pending:
              inquiries.data?.filter((i: { status: string }) => i.status === 'pending').length || 0,
          },
          notices: notices.data?.length || 0,
          blogPosts: blog.data?.length || 0,
        });
        setLoading(false);
      })
      .catch(() => {
        router.push('/admin/login');
      });
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

  const cards = [
    {
      title: '팝업 관리',
      count: data?.popups || 0,
      href: '/admin/popups',
      color: 'bg-blue-500',
      desc: '등록된 팝업',
    },
    {
      title: '매장 관리',
      count: data?.stores || 0,
      href: '/admin/stores',
      color: 'bg-green-500',
      desc: '등록된 매장',
    },
    {
      title: '문의 관리',
      count: data?.inquiries.total || 0,
      href: '/admin/inquiries',
      color: 'bg-orange-500',
      desc: `미처리 ${data?.inquiries.pending || 0}건`,
    },
    {
      title: '공지사항 관리',
      count: data?.notices || 0,
      href: '/admin/notices',
      color: 'bg-purple-500',
      desc: '등록된 공지',
    },
    {
      title: '블로그 관리',
      count: data?.blogPosts || 0,
      href: '/admin/blog',
      color: 'bg-teal-500',
      desc: '등록된 블로그 글',
    },
    {
      title: '사이트 설정',
      count: 0,
      href: '/admin/settings',
      color: 'bg-gray-500',
      desc: 'SMTP, API 키, 관리자 계정',
    },
  ];

  return (
    <div className="p-6 lg:p-10 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">관리자 대시보드</h1>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
            사이트 보기
          </Link>
          <button onClick={handleLogout} className="text-sm text-red-500 hover:text-red-700">
            로그아웃
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="block bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6"
          >
            <div
              className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center text-white text-xl font-bold mb-4`}
            >
              {card.href === '/admin/settings' ? '⚙' : card.count}
            </div>
            <h2 className="text-lg font-semibold mb-1">{card.title}</h2>
            <p className="text-sm text-gray-500">{card.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
