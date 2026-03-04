'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Inquiry {
  _id: string;
  name: string;
  phone: string;
  hasStore: 'yes' | 'no';
  region: string;
  content: string;
  source: 'form' | 'sky';
  status: 'pending' | 'confirmed' | 'completed';
  privacyAgreed: boolean;
  emailSent: boolean;
  ipAddress: string;
  createdAt: string;
}

const STATUS_LABELS: Record<string, string> = {
  pending: '미처리',
  confirmed: '확인됨',
  completed: '완료',
};

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
};

const PAGE_SIZE = 20;

export default function AdminInquiriesPage() {
  const router = useRouter();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [detailTarget, setDetailTarget] = useState<Inquiry | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchInquiries = useCallback(async (currentPage: number, status: string) => {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(currentPage),
      limit: String(PAGE_SIZE),
    });
    if (status) params.set('status', status);

    const res = await fetch(`/api/admin/inquiries?${params.toString()}`);
    const data = await res.json();
    if (!data.success) {
      router.push('/admin/login');
      return;
    }
    setInquiries(data.data);
    setTotal(data.total);
    setLoading(false);
  }, [router]);

  useEffect(() => {
    fetchInquiries(page, statusFilter);
  }, [fetchInquiries, page, statusFilter]);

  const handleStatusChange = async (id: string, status: string) => {
    setUpdatingId(id);
    await fetch(`/api/admin/inquiries/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    setUpdatingId(null);
    await fetchInquiries(page, statusFilter);
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/admin/inquiries/${id}`, { method: 'DELETE' });
    setDeleteId(null);
    if (detailTarget?._id === id) setDetailTarget(null);
    await fetchInquiries(page, statusFilter);
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const handleFilterChange = (status: string) => {
    setStatusFilter(status);
    setPage(1);
  };

  return (
    <div className="p-6 lg:p-10 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="text-gray-400 hover:text-gray-600 text-sm">
            대시보드
          </Link>
          <span className="text-gray-300">/</span>
          <h1 className="text-xl font-bold">문의 관리</h1>
        </div>
        <span className="text-sm text-gray-500">총 {total}건</span>
      </div>

      {/* Status Filter */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {['', 'pending', 'confirmed', 'completed'].map((status) => (
          <button
            key={status}
            onClick={() => handleFilterChange(status)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${statusFilter === status ? 'bg-orange-500 text-white' : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'}`}
          >
            {status === '' ? '전체' : STATUS_LABELS[status]}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-gray-400">로딩 중...</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">이름</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">연락처</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">희망 지역</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">출처</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">상태</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">접수일</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">작업</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {inquiries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-gray-400">
                    문의가 없습니다.
                  </td>
                </tr>
              ) : (
                inquiries.map((inquiry) => (
                  <tr key={inquiry._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium">
                      <button
                        onClick={() => setDetailTarget(inquiry)}
                        className="hover:text-orange-600 transition-colors text-left"
                      >
                        {inquiry.name}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{inquiry.phone}</td>
                    <td className="px-4 py-3 text-gray-600">{inquiry.region || '-'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${inquiry.source === 'form' ? 'bg-gray-100 text-gray-600' : 'bg-purple-100 text-purple-700'}`}>
                        {inquiry.source === 'form' ? '홈페이지' : 'SKY'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={inquiry.status}
                        disabled={updatingId === inquiry._id}
                        onChange={(e) => handleStatusChange(inquiry._id, e.target.value)}
                        className={`px-2 py-1 rounded text-xs font-medium border-0 outline-none cursor-pointer disabled:opacity-50 ${STATUS_COLORS[inquiry.status]}`}
                      >
                        <option value="pending">미처리</option>
                        <option value="confirmed">확인됨</option>
                        <option value="completed">완료</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {new Date(inquiry.createdAt).toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setDetailTarget(inquiry)}
                          className="text-xs px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                        >
                          상세
                        </button>
                        <button
                          onClick={() => setDeleteId(inquiry._id)}
                          className="text-xs px-3 py-1 border border-red-300 text-red-600 rounded hover:bg-red-50 transition-colors"
                        >
                          삭제
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            이전
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
            .reduce<(number | string)[]>((acc, p, idx, arr) => {
              if (idx > 0 && (arr[idx - 1] as number) + 1 < p) acc.push('...');
              acc.push(p);
              return acc;
            }, [])
            .map((item, idx) =>
              item === '...' ? (
                <span key={`ellipsis-${idx}`} className="px-3 py-1.5 text-sm text-gray-400">
                  ...
                </span>
              ) : (
                <button
                  key={item}
                  onClick={() => setPage(item as number)}
                  className={`px-3 py-1.5 border rounded-lg text-sm transition-colors ${page === item ? 'bg-orange-500 text-white border-orange-500' : 'border-gray-300 hover:bg-gray-50'}`}
                >
                  {item}
                </button>
              )
            )}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            다음
          </button>
        </div>
      )}

      {/* Detail Modal */}
      {detailTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-bold">문의 상세</h2>
              <button onClick={() => setDetailTarget(null)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">
                &times;
              </button>
            </div>
            <div className="p-6 space-y-3 text-sm">
              <div className="flex gap-3">
                <span className="w-24 text-gray-500 shrink-0">이름</span>
                <span className="font-medium">{detailTarget.name}</span>
              </div>
              <div className="flex gap-3">
                <span className="w-24 text-gray-500 shrink-0">연락처</span>
                <span>{detailTarget.phone}</span>
              </div>
              <div className="flex gap-3">
                <span className="w-24 text-gray-500 shrink-0">희망 지역</span>
                <span>{detailTarget.region || '-'}</span>
              </div>
              <div className="flex gap-3">
                <span className="w-24 text-gray-500 shrink-0">기존 매장</span>
                <span>{detailTarget.hasStore === 'yes' ? '있음' : '없음'}</span>
              </div>
              <div className="flex gap-3">
                <span className="w-24 text-gray-500 shrink-0">출처</span>
                <span>{detailTarget.source === 'form' ? '홈페이지' : 'SKY'}</span>
              </div>
              <div className="flex gap-3">
                <span className="w-24 text-gray-500 shrink-0">상태</span>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${STATUS_COLORS[detailTarget.status]}`}>
                  {STATUS_LABELS[detailTarget.status]}
                </span>
              </div>
              <div className="flex gap-3">
                <span className="w-24 text-gray-500 shrink-0">이메일 발송</span>
                <span>{detailTarget.emailSent ? '완료' : '미발송'}</span>
              </div>
              <div className="flex gap-3">
                <span className="w-24 text-gray-500 shrink-0">접수일</span>
                <span>
                  {new Date(detailTarget.createdAt).toLocaleString('ko-KR', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              {detailTarget.content && (
                <div className="flex gap-3">
                  <span className="w-24 text-gray-500 shrink-0">내용</span>
                  <span className="whitespace-pre-wrap leading-relaxed">{detailTarget.content}</span>
                </div>
              )}
              <div className="flex gap-3">
                <span className="w-24 text-gray-500 shrink-0">IP</span>
                <span className="text-gray-400 text-xs">{detailTarget.ipAddress || '-'}</span>
              </div>
            </div>
            <div className="flex justify-between p-6 border-t">
              <button
                onClick={() => {
                  setDeleteId(detailTarget._id);
                  setDetailTarget(null);
                }}
                className="px-4 py-2 border border-red-300 text-red-600 rounded-lg text-sm hover:bg-red-50 transition-colors"
              >
                삭제
              </button>
              <div className="flex gap-2">
                <select
                  value={detailTarget.status}
                  onChange={async (e) => {
                    const newStatus = e.target.value;
                    await handleStatusChange(detailTarget._id, newStatus);
                    setDetailTarget({ ...detailTarget, status: newStatus as Inquiry['status'] });
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-400"
                >
                  <option value="pending">미처리</option>
                  <option value="confirmed">확인됨</option>
                  <option value="completed">완료</option>
                </select>
                <button
                  onClick={() => setDetailTarget(null)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
            <h2 className="text-lg font-bold mb-2">문의 삭제</h2>
            <p className="text-gray-600 text-sm mb-6">이 문의를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
