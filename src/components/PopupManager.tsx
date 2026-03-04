'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { PopupData } from '@/types';

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
}

function setCookie(name: string, value: string, hours: number) {
  const date = new Date();
  date.setTime(date.getTime() + hours * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`;
}

export default function PopupManager() {
  const [popups, setPopups] = useState<PopupData[]>([]);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch('/api/popups')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          // Filter out popups dismissed by cookie
          const activePopups = data.data.filter((p: PopupData) => {
            return !getCookie(`popup_dismiss_${p._id}`);
          });
          setPopups(activePopups);
        }
      })
      .catch(console.error);
  }, []);

  const handleClose = (id: string) => {
    setDismissed((prev) => new Set(prev).add(id));
  };

  const handleDismissToday = (id: string) => {
    setCookie(`popup_dismiss_${id}`, '1', 24);
    setDismissed((prev) => new Set(prev).add(id));
  };

  const visiblePopups = popups.filter((p) => !dismissed.has(p._id || ''));

  if (visiblePopups.length === 0) return null;

  return (
    <>
      {visiblePopups.map((popup) => (
        <div
          key={popup._id}
          className="fixed z-[9999]"
        >
          {/* Desktop positioning */}
          <div
            className="hidden lg:block fixed z-[9999]"
            style={{
              top: popup.top,
              left: popup.left,
              width: popup.width,
            }}
          >
            <PopupContent
              popup={popup}
              onClose={() => handleClose(popup._id!)}
              onDismissToday={() => handleDismissToday(popup._id!)}
            />
          </div>
          {/* Mobile: centered overlay */}
          <div className="lg:hidden fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
            <div className="max-w-[90vw] max-h-[80vh] overflow-auto">
              <PopupContent
                popup={popup}
                onClose={() => handleClose(popup._id!)}
                onDismissToday={() => handleDismissToday(popup._id!)}
              />
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

function PopupContent({
  popup,
  onClose,
  onDismissToday,
}: {
  popup: PopupData;
  onClose: () => void;
  onDismissToday: () => void;
}) {
  return (
    <div className="bg-white shadow-2xl rounded-lg overflow-hidden">
      {/* Content */}
      <div className="relative">
        {popup.type === 'image' ? (
          popup.linkUrl ? (
            <a href={popup.linkUrl} target={popup.linkTarget} rel="noopener noreferrer">
              <Image
                src={popup.imageUrl}
                alt={popup.title}
                width={popup.width}
                height={popup.height}
                className="w-full h-auto"
                unoptimized
              />
            </a>
          ) : (
            <Image
              src={popup.imageUrl}
              alt={popup.title}
              width={popup.width}
              height={popup.height}
              className="w-full h-auto"
              unoptimized
            />
          )
        ) : (
          <div className="aspect-video">
            <iframe
              src={popup.youtubeUrl.replace('watch?v=', 'embed/')}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={popup.title}
            />
          </div>
        )}
      </div>
      {/* Controls */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-100 text-sm">
        <button
          onClick={onDismissToday}
          className="text-gray-600 hover:text-gray-800 transition-colors"
        >
          오늘 하루 보지 않기
        </button>
        <button
          onClick={onClose}
          className="text-gray-600 hover:text-gray-800 font-medium transition-colors"
        >
          닫기
        </button>
      </div>
    </div>
  );
}
