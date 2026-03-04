'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface BlogPost {
  _id: string;
  title: string;
  link: string;
  description: string;
  bloggerName: string;
  source: 'naver' | 'manual';
  publishedAt: string;
  isActive: boolean;
  createdAt: string;
}

const emptyForm = {
  title: '',
  link: '',
  description: '',
  bloggerName: '',
  source: 'manual' as 'naver' | 'manual',
  publishedAt: new Date().toISOString().slice(0, 10),
  isActive: true,
};

const SOURCE_LABELS: Record<string, string> = {
  naver: '네이버',
  manual: '직접 등록',
};

const SOURCE_COLORS: Record<string, string> = {
  naver: 'bg-green-100 text-green-700',
  manual: 'bg-gray-100 text-gray-600',
};

export default function AdminBlogPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<BlogPost | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [collecting, setCollecting] = useState(false);
  const [collectResult, setCollectResult] = useState<string | null>(null);
  const [keyword, setKeyword] = useState('완뚝순두부');

  const fetchPosts = useCallback(async () => {
    const res = await fetch('/api/admin/blog');
    const data = await res.json();
    if (!data.success) {
      router.push('/admin/login');
      return;
    }
    setPosts(data.data);
    setLoading(false);
  }, [router]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const openCreate = () => {
    setEditTarget(null);
    setForm(emptyForm);
    setError('');
    setShowModal(true);
  };

  const openEdit = (post: BlogPost) => {
    setEditTarget(post);
    setForm({
      title: post.title,
      link: post.link,
      description: post.description,
      bloggerName: post.bloggerName,
      source: post.source,
      publishedAt: post.publishedAt ? post.publishedAt.slice(0, 10) : '',
      isActive: post.isActive,
    });
    setError('');
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      setError('제목을 입력해주세요.');
      return;
    }
    if (!form.link.trim()) {
      setError('링크 URL을 입력해주세요.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const url = editTarget
        ? `/api/admin/blog/${editTarget._id}`
        : '/api/admin/blog';
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
      await fetchPosts();
    } catch {
      setError('네트워크 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (post: BlogPost) => {
    await fetch(`/api/admin/blog/${post._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !post.isActive }),
    });
    await fetchPosts();
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/admin/blog/${id}`, { method: 'DELETE' });
    setDeleteId(null);
    await fetchPosts();
  };

  const handleCollect = async (fullCollect: boolean) => {
    if (!keyword.trim()) {
      setCollectResult('키워드를 입력해주세요.');
      return;
    }
    setCollecting(true);
    setCollectResult(null);
    try {
      const res = await fetch('/api/admin/blog/collect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword: keyword.trim(), fullCollect }),
      });
      const data = await res.json();
      if (data.success) {
        const mode = data.data.mode === 'full' ? '완전수집' : '최신수집';
        const filtered = data.data.filtered ? `, 키워드 미포함 ${data.data.filtered}건 제외` : '';
        setCollectResult(
          `${mode} 완료: "${data.data.keyword}" 검색결과 ${data.data.totalFound}건 중 ${data.data.fetched}건 조회 → 새로 ${data.data.newlyAdded}건 추가 (중복 ${data.data.skipped}건 스킵${filtered})`
        );
        await fetchPosts();
      } else {
        setCollectResult(`수집 실패: ${data.error}`);
      }
    } catch {
      setCollectResult('네트워크 오류가 발생했습니다.');
    } finally {
      setCollecting(false);
    }
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
          <h1 className="text-xl font-bold">블로그 관리</h1>
        </div>
        <button
          onClick={openCreate}
          className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors text-sm font-medium"
        >
          + 직접 추가
        </button>
      </div>

      {/* Blog Collection Panel */}
      <div className="bg-white rounded-xl shadow-md p-5 mb-6">
        <h2 className="text-sm font-bold text-gray-700 mb-3">네이버 블로그 수집</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-400"
            placeholder="검색 키워드 입력"
          />
          <div className="flex gap-2">
            <button
              onClick={() => handleCollect(false)}
              disabled={collecting}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium disabled:opacity-50 whitespace-nowrap"
            >
              {collecting ? '수집 중...' : '최신 100건 수집'}
            </button>
            <button
              onClick={() => handleCollect(true)}
              disabled={collecting}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium disabled:opacity-50 whitespace-nowrap"
            >
              {collecting ? '수집 중...' : '완전수집 (최대 1000건)'}
            </button>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          최신 100건: 1시간 자동수집과 동일 / 완전수집: 처음 세팅 시 과거 글까지 최대한 수집
        </p>
      </div>

      {collectResult && (
        <div className={`mb-4 px-4 py-3 rounded-lg text-sm ${collectResult.includes('실패') || collectResult.includes('오류') || collectResult.includes('입력') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
          {collectResult}
          <button onClick={() => setCollectResult(null)} className="ml-2 text-xs opacity-60 hover:opacity-100">&times;</button>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">제목</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">출처</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">블로거</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">게시일</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">활성</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">작업</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {posts.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-10 text-gray-400">
                  등록된 블로그 글이 없습니다.
                </td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr key={post._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium max-w-[240px]">
                    <a
                      href={post.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-teal-600 transition-colors truncate block"
                    >
                      {post.title}
                    </a>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${SOURCE_COLORS[post.source] ?? 'bg-gray-100 text-gray-600'}`}
                    >
                      {SOURCE_LABELS[post.source] ?? post.source}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{post.bloggerName || '-'}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {post.publishedAt ? post.publishedAt.slice(0, 10) : '-'}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleToggleActive(post)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${post.isActive ? 'bg-teal-500' : 'bg-gray-300'}`}
                    >
                      <span
                        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${post.isActive ? 'translate-x-4' : 'translate-x-0.5'}`}
                      />
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(post)}
                        className="text-xs px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => setDeleteId(post._id)}
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
              <h2 className="text-lg font-bold">{editTarget ? '블로그 글 수정' : '블로그 글 추가'}</h2>
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-400"
                  placeholder="블로그 글 제목"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">링크 URL *</label>
                <input
                  type="text"
                  value={form.link}
                  onChange={(e) => setForm({ ...form, link: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-400"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">설명</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-400 resize-y"
                  placeholder="블로그 글 요약 설명"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">블로거 이름</label>
                <input
                  type="text"
                  value={form.bloggerName}
                  onChange={(e) => setForm({ ...form, bloggerName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-400"
                  placeholder="블로거 닉네임 또는 이름"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">출처</label>
                <select
                  value={form.source}
                  onChange={(e) =>
                    setForm({ ...form, source: e.target.value as 'naver' | 'manual' })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-400"
                >
                  <option value="naver">네이버</option>
                  <option value="manual">직접 등록</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">게시일</label>
                <input
                  type="date"
                  value={form.publishedAt}
                  onChange={(e) => setForm({ ...form, publishedAt: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-400"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                    className="w-4 h-4 accent-teal-500"
                  />
                  <span className="text-sm font-medium text-gray-700">활성화</span>
                </label>
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
                className="px-4 py-2 bg-teal-500 text-white rounded-lg text-sm hover:bg-teal-600 transition-colors disabled:opacity-50"
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
            <h2 className="text-lg font-bold mb-2">블로그 글 삭제</h2>
            <p className="text-gray-600 text-sm mb-6">
              이 블로그 글을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
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
