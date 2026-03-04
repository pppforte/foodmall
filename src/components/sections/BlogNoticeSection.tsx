'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface BlogPost {
  _id: string;
  title: string;
  description: string;
  link: string;
  bloggerName: string;
  publishedAt: string;
}

interface Notice {
  _id: string;
  title: string;
  content: string;
  thumbnailUrl: string;
  createdAt: string;
}

type Tab = 'blog' | 'notice';

export default function BlogNoticeSection() {
  const [activeTab, setActiveTab] = useState<Tab>('blog');
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [blogPage, setBlogPage] = useState(1);
  const [blogTotal, setBlogTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch blog posts
    fetchBlogPosts(1);
    // Fetch notices
    fetch('/api/notices')
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setNotices(data.data);
      })
      .catch(console.error);
  }, []);

  const fetchBlogPosts = async (page: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/blog?page=${page}&limit=10`);
      const data = await res.json();
      if (data.success) {
        setBlogPosts(data.data);
        setBlogTotal(data.total);
        setBlogPage(page);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(blogTotal / 10);

  // Strip HTML tags from blog description
  const stripHtml = (html: string) => html.replace(/<[^>]*>/g, '');

  return (
    <section id="blog" className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-black text-[var(--color-secondary)] mb-4">
            소식
          </h2>
          <div className="w-16 h-1 bg-[var(--color-primary)] mx-auto mt-4" />
        </div>

        {/* Tab Buttons */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setActiveTab('blog')}
            className={`px-8 py-3 rounded-full font-semibold text-sm transition-all ${
              activeTab === 'blog'
                ? 'bg-[var(--color-primary)] text-white shadow-lg'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            블로그
          </button>
          <button
            onClick={() => setActiveTab('notice')}
            className={`px-8 py-3 rounded-full font-semibold text-sm transition-all ${
              activeTab === 'notice'
                ? 'bg-[var(--color-primary)] text-white shadow-lg'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            공지사항
          </button>
        </div>

        {/* Blog Tab */}
        {activeTab === 'blog' && (
          <div>
            {loading ? (
              <div className="text-center py-12 text-gray-400">로딩 중...</div>
            ) : blogPosts.length === 0 ? (
              <div className="text-center py-12 text-gray-400">등록된 블로그 글이 없습니다.</div>
            ) : (
              <>
                <div className="bg-gray-50 rounded-xl overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="px-4 lg:px-6 py-4 text-left text-sm font-semibold text-gray-600 w-20">구분</th>
                        <th className="px-4 lg:px-6 py-4 text-left text-sm font-semibold text-gray-600">제목</th>
                      </tr>
                    </thead>
                    <tbody>
                      {blogPosts.map((post) => (
                        <tr key={post._id} className="border-b border-gray-100 hover:bg-gray-100 transition-colors">
                          <td className="px-4 lg:px-6 py-4 text-sm text-[var(--color-primary)] font-medium">블로그</td>
                          <td className="px-4 lg:px-6 py-4">
                            <a
                              href={post.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block"
                            >
                              <p className="font-bold text-gray-800 hover:text-[var(--color-primary)] transition-colors line-clamp-1">
                                {stripHtml(post.title)}
                              </p>
                              <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                {stripHtml(post.description)}
                              </p>
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-6">
                    <button
                      onClick={() => fetchBlogPosts(blogPage - 1)}
                      disabled={blogPage <= 1}
                      className="px-3 py-2 rounded text-sm bg-gray-100 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      이전
                    </button>
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      const start = Math.max(1, blogPage - 2);
                      const pageNum = start + i;
                      if (pageNum > totalPages) return null;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => fetchBlogPosts(pageNum)}
                          className={`px-3 py-2 rounded text-sm ${
                            pageNum === blogPage
                              ? 'bg-[var(--color-primary)] text-white'
                              : 'bg-gray-100 hover:bg-gray-200'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => fetchBlogPosts(blogPage + 1)}
                      disabled={blogPage >= totalPages}
                      className="px-3 py-2 rounded text-sm bg-gray-100 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      다음
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Notice Tab */}
        {activeTab === 'notice' && (
          <div>
            {notices.length === 0 ? (
              <div className="text-center py-12 text-gray-400">등록된 공지사항이 없습니다.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {notices.map((notice) => (
                  <div
                    key={notice._id}
                    className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    {notice.thumbnailUrl && (
                      <div className="relative aspect-square">
                        <Image
                          src={notice.thumbnailUrl}
                          alt={notice.title}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="font-bold text-gray-800 line-clamp-2 mb-2">{notice.title}</h3>
                      <p className="text-sm text-gray-500 line-clamp-2">{notice.content}</p>
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(notice.createdAt).toLocaleDateString('ko-KR')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
