'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Store {
  _id: string;
  name: string;
  region: string;
  address: string;
  jibunAddress: string;
  phone: string;
  latitude: number;
  longitude: number;
  businessHours: string;
  imageUrl: string;
  description: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
}

const emptyForm = {
  name: '',
  region: '',
  address: '',
  jibunAddress: '',
  phone: '',
  latitude: 37.5665,
  longitude: 126.978,
  businessHours: '',
  imageUrl: '',
  description: '',
  isActive: true,
  sortOrder: 0,
};

export default function AdminStoresPage() {
  const router = useRouter();
  const [stores, setStores] = useState<Store[]>([]);
  const [filtered, setFiltered] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [regionFilter, setRegionFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<Store | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const fetchStores = useCallback(async () => {
    const res = await fetch('/api/admin/stores');
    const data = await res.json();
    if (!data.success) {
      router.push('/admin/login');
      return;
    }
    setStores(data.data);
    setFiltered(data.data);
    setLoading(false);
  }, [router]);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  useEffect(() => {
    if (regionFilter) {
      setFiltered(stores.filter((s) => s.region === regionFilter));
    } else {
      setFiltered(stores);
    }
  }, [regionFilter, stores]);

  const regions = Array.from(new Set(stores.map((s) => s.region))).filter(Boolean).sort();

  const openCreate = () => {
    setEditTarget(null);
    setForm(emptyForm);
    setError('');
    setShowModal(true);
  };

  const openEdit = (store: Store) => {
    setEditTarget(store);
    setForm({
      name: store.name,
      region: store.region,
      address: store.address,
      jibunAddress: store.jibunAddress,
      phone: store.phone,
      latitude: store.latitude,
      longitude: store.longitude,
      businessHours: store.businessHours,
      imageUrl: store.imageUrl,
      description: store.description,
      isActive: store.isActive,
      sortOrder: store.sortOrder,
    });
    setError('');
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      setError('매장명을 입력해주세요.');
      return;
    }
    if (!form.region.trim()) {
      setError('지역을 입력해주세요.');
      return;
    }
    if (!form.address.trim()) {
      setError('주소를 입력해주세요.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const url = editTarget ? `/api/admin/stores/${editTarget._id}` : '/api/admin/stores';
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
      await fetchStores();
    } catch {
      setError('네트워크 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (store: Store) => {
    await fetch(`/api/admin/stores/${store._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !store.isActive }),
    });
    await fetchStores();
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/admin/stores/${id}`, { method: 'DELETE' });
    setDeleteId(null);
    await fetchStores();
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
          <h1 className="text-xl font-bold">매장 관리</h1>
        </div>
        <button
          onClick={openCreate}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
        >
          + 매장 추가
        </button>
      </div>

      {/* Region Filter */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <button
          onClick={() => setRegionFilter('')}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${regionFilter === '' ? 'bg-green-500 text-white' : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'}`}
        >
          전체 ({stores.length})
        </button>
        {regions.map((region) => (
          <button
            key={region}
            onClick={() => setRegionFilter(region)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${regionFilter === region ? 'bg-green-500 text-white' : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'}`}
          >
            {region} ({stores.filter((s) => s.region === region).length})
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">매장명</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">지역</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">주소</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">전화번호</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">순서</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">활성</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">작업</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-10 text-gray-400">
                  등록된 매장이 없습니다.
                </td>
              </tr>
            ) : (
              filtered.map((store) => (
                <tr key={store._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium">{store.name}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium">
                      {store.region}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 max-w-xs truncate">{store.address}</td>
                  <td className="px-4 py-3 text-gray-500">{store.phone || '-'}</td>
                  <td className="px-4 py-3 text-gray-500">{store.sortOrder}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleToggleActive(store)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${store.isActive ? 'bg-green-500' : 'bg-gray-300'}`}
                    >
                      <span
                        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${store.isActive ? 'translate-x-4' : 'translate-x-0.5'}`}
                      />
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(store)}
                        className="text-xs px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => setDeleteId(store._id)}
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
              <h2 className="text-lg font-bold">{editTarget ? '매장 수정' : '매장 추가'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">
                &times;
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">매장명 *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">지역 *</label>
                  <input
                    type="text"
                    value={form.region}
                    onChange={(e) => setForm({ ...form, region: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-400"
                    placeholder="예: 서울, 경기"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">도로명 주소 *</label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">지번 주소</label>
                <input
                  type="text"
                  value={form.jibunAddress}
                  onChange={(e) => setForm({ ...form, jibunAddress: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">전화번호</label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-400"
                  placeholder="02-0000-0000"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">위도</label>
                  <input
                    type="number"
                    step="0.000001"
                    value={form.latitude}
                    onChange={(e) => setForm({ ...form, latitude: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">경도</label>
                  <input
                    type="number"
                    step="0.000001"
                    value={form.longitude}
                    onChange={(e) => setForm({ ...form, longitude: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-400"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">영업시간</label>
                <input
                  type="text"
                  value={form.businessHours}
                  onChange={(e) => setForm({ ...form, businessHours: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-400"
                  placeholder="예: 09:00 - 21:00 (연중무휴)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">이미지 URL</label>
                <input
                  type="text"
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-400"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">설명</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-400 resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">정렬 순서</label>
                  <input
                    type="number"
                    value={form.sortOrder}
                    onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-400"
                  />
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={form.isActive}
                      onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                      className="w-4 h-4 accent-green-500"
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
                className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition-colors disabled:opacity-50"
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
            <h2 className="text-lg font-bold mb-2">매장 삭제</h2>
            <p className="text-gray-600 text-sm mb-6">이 매장을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.</p>
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
