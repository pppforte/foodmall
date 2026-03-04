'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Popup {
  _id: string;
  title: string;
  type: 'image' | 'youtube';
  imageUrl: string;
  youtubeUrl: string;
  top: number;
  left: number;
  width: number;
  height: number;
  linkUrl: string;
  linkTarget: '_self' | '_blank';
  startDate: string;
  endDate: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
}

const emptyForm = {
  title: '',
  type: 'image' as 'image' | 'youtube',
  imageUrl: '',
  youtubeUrl: '',
  top: 150,
  left: 0,
  width: 600,
  height: 800,
  linkUrl: '',
  linkTarget: '_blank' as '_self' | '_blank',
  startDate: new Date().toISOString().slice(0, 10),
  endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
  isActive: true,
  sortOrder: 0,
};

export default function AdminPopupsPage() {
  const router = useRouter();
  const [popups, setPopups] = useState<Popup[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<Popup | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const fetchPopups = useCallback(async () => {
    const res = await fetch('/api/admin/popups');
    const data = await res.json();
    if (!data.success) {
      router.push('/admin/login');
      return;
    }
    setPopups(data.data);
    setLoading(false);
  }, [router]);

  useEffect(() => {
    fetchPopups();
  }, [fetchPopups]);

  const openCreate = () => {
    setEditTarget(null);
    setForm(emptyForm);
    setError('');
    setShowModal(true);
  };

  const openEdit = (popup: Popup) => {
    setEditTarget(popup);
    setForm({
      title: popup.title,
      type: popup.type,
      imageUrl: popup.imageUrl,
      youtubeUrl: popup.youtubeUrl,
      top: popup.top,
      left: popup.left,
      width: popup.width,
      height: popup.height,
      linkUrl: popup.linkUrl,
      linkTarget: popup.linkTarget,
      startDate: popup.startDate.slice(0, 10),
      endDate: popup.endDate.slice(0, 10),
      isActive: popup.isActive,
      sortOrder: popup.sortOrder,
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
        ? `/api/admin/popups/${editTarget._id}`
        : '/api/admin/popups';
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
      await fetchPopups();
    } catch {
      setError('네트워크 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (popup: Popup) => {
    await fetch(`/api/admin/popups/${popup._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !popup.isActive }),
    });
    await fetchPopups();
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/admin/popups/${id}`, { method: 'DELETE' });
    setDeleteId(null);
    await fetchPopups();
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
          <h1 className="text-xl font-bold">팝업 관리</h1>
        </div>
        <button
          onClick={openCreate}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
        >
          + 팝업 추가
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">제목</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">유형</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">크기</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">순서</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">기간</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">활성</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">작업</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {popups.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-10 text-gray-400">
                  등록된 팝업이 없습니다.
                </td>
              </tr>
            ) : (
              popups.map((popup) => (
                <tr key={popup._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium">{popup.title}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${popup.type === 'image' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
                      {popup.type === 'image' ? '이미지' : 'YouTube'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {popup.width} x {popup.height}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{popup.sortOrder}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {popup.startDate.slice(0, 10)} ~ {popup.endDate.slice(0, 10)}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleToggleActive(popup)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${popup.isActive ? 'bg-blue-500' : 'bg-gray-300'}`}
                    >
                      <span
                        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${popup.isActive ? 'translate-x-4' : 'translate-x-0.5'}`}
                      />
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(popup)}
                        className="text-xs px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => setDeleteId(popup._id)}
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
              <h2 className="text-lg font-bold">{editTarget ? '팝업 수정' : '팝업 추가'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">유형</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value as 'image' | 'youtube' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="image">이미지</option>
                  <option value="youtube">YouTube</option>
                </select>
              </div>
              {form.type === 'image' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">이미지 URL</label>
                  <input
                    type="text"
                    value={form.imageUrl}
                    onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="https://..."
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">YouTube URL</label>
                  <input
                    type="text"
                    value={form.youtubeUrl}
                    onChange={(e) => setForm({ ...form, youtubeUrl: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">너비 (px)</label>
                  <input
                    type="number"
                    value={form.width}
                    onChange={(e) => setForm({ ...form, width: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">높이 (px)</label>
                  <input
                    type="number"
                    value={form.height}
                    onChange={(e) => setForm({ ...form, height: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">상단 위치 (px)</label>
                  <input
                    type="number"
                    value={form.top}
                    onChange={(e) => setForm({ ...form, top: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">좌측 위치 (px)</label>
                  <input
                    type="number"
                    value={form.left}
                    onChange={(e) => setForm({ ...form, left: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">링크 URL</label>
                <input
                  type="text"
                  value={form.linkUrl}
                  onChange={(e) => setForm({ ...form, linkUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">링크 열기</label>
                <select
                  value={form.linkTarget}
                  onChange={(e) => setForm({ ...form, linkTarget: e.target.value as '_self' | '_blank' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="_blank">새 탭</option>
                  <option value="_self">현재 탭</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">시작일</label>
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">종료일</label>
                  <input
                    type="date"
                    value={form.endDate}
                    onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">정렬 순서</label>
                  <input
                    type="number"
                    value={form.sortOrder}
                    onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={form.isActive}
                      onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                      className="w-4 h-4 accent-blue-500"
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
                className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors disabled:opacity-50"
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
            <h2 className="text-lg font-bold mb-2">팝업 삭제</h2>
            <p className="text-gray-600 text-sm mb-6">이 팝업을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.</p>
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
