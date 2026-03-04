'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Notice {
  _id: string;
  title: string;
  content: string;
  thumbnailUrl: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
}

const emptyForm = {
  title: '',
  content: '',
  thumbnailUrl: '',
  isActive: true,
  sortOrder: 0,
};

export default function AdminNoticesPage() {
  const router = useRouter();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<Notice | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const fetchNotices = useCallback(async () => {
    const res = await fetch('/api/admin/notices');
    const data = await res.json();
    if (!data.success) {
      router.push('/admin/login');
      return;
    }
    setNotices(data.data);
    setLoading(false);
  }, [router]);

  useEffect(() => {
    fetchNotices();
  }, [fetchNotices]);

  const openCreate = () => {
    setEditTarget(null);
    setForm(emptyForm);
    setError('');
    setShowModal(true);
  };

  const openEdit = (notice: Notice) => {
    setEditTarget(notice);
    setForm({
      title: notice.title,
      content: notice.content,
      thumbnailUrl: notice.thumbnailUrl,
      isActive: notice.isActive,
      sortOrder: notice.sortOrder,
    });
    setError('');
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      setError('제목을 입력해주세요.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const url = editTarget
        ? `/api/admin/notices/${editTarget._id}`
        : '/api/admin/notices';
      const method = editTarget ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.error || '저장에 실패했습니다.');
        return;
      }
      setShowModal(false);
      await fetchNotices();
    } catch {
      setError('네트워크 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (notice: Notice) => {
    await fetch(`/api/admin/notices/${notice._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !notice.isActive }),
    });
    await fetchNotices();
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/admin/notices/${id}`, { method: 'DELETE' });
    setDeleteId(null);
    await fetchNotices();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="text-gray-400 hover:text-gray-600 text-sm">
            대시보드
          </Link>
          <span className="text-gray-300">/</span>
          <h1 className="text-xl font-bold">공지사항 관리</h1>
        </div>
        <button
          onClick={openCreate}
          className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm font-medium"
        >
          + 공지사항 추가
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">제목</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">내용</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">썸네일</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">활성</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">정렬순서</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">등록일</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">작업</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {notices.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-10 text-gray-400">
                  등록된 공지사항이 없습니다.
                </td>
              </tr>
            ) : (
              notices.map((notice) => (
                <tr key={notice._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium max-w-[200px] truncate">{notice.title}</td>
                  <td className="px-4 py-3 text-gray-500 max-w-[240px] truncate">
                    {notice.content || '-'}
                  </td>
                  <td className="px-4 py-3">
                    {notice.thumbnailUrl ? (
                      <span className="text-xs text-blue-600 underline max-w-[120px] block truncate">
                        {notice.thumbnailUrl}
                      </span>
                    ) : (
                      <span className="text-gray-300 text-xs">없음</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleToggleActive(notice)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${notice.isActive ? 'bg-purple-500' : 'bg-gray-300'}`}
                    >
                      <span
                        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${notice.isActive ? 'translate-x-4' : 'translate-x-0.5'}`}
                      />
                    </button>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{notice.sortOrder}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {new Date(notice.createdAt).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(notice)}
                        className="text-xs px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => setDeleteId(notice._id)}
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
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-bold">{editTarget ? '공지사항 수정' : '공지사항 추가'}</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 text-xl leading-none"
              >
                &times;
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">제목 *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-purple-400"
                  placeholder="공지사항 제목"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">내용</label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-purple-400 resize-y"
                  placeholder="공지사항 내용을 입력하세요."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">썸네일 URL</label>
                <input
                  type="text"
                  value={form.thumbnailUrl}
                  onChange={(e) => setForm({ ...form, thumbnailUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-purple-400"
                  placeholder="https://..."
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">정렬 순서</label>
                  <input
                    type="number"
                    value={form.sortOrder}
                    onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={form.isActive}
                      onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                      className="w-4 h-4 accent-purple-500"
                    />
                    <span className="text-sm font-medium text-gray-700">활성화</span>
                  </label>
                </div>
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>
            <div className="flex justify-end gap-3 p-6 border-t">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-purple-500 text-white rounded-lg text-sm hover:bg-purple-600 transition-colors disabled:opacity-50"
              >
                {saving ? '저장 중...' : '저장'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
            <h2 className="text-lg font-bold mb-2">공지사항 삭제</h2>
            <p className="text-gray-600 text-sm mb-6">
              이 공지사항을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </p>
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
