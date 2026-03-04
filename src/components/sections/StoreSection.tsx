'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import type { StoreData } from '@/types';

/* ─── Kakao Maps Type Declarations ─── */
declare global {
  interface Window {
    kakao: KakaoNamespace;
  }
}

interface KakaoNamespace {
  maps: {
    load: (cb: () => void) => void;
    Map: new (container: HTMLElement, options: { center: KakaoLatLng; level: number }) => KakaoMap;
    LatLng: new (lat: number, lng: number) => KakaoLatLng;
    LatLngBounds: new () => KakaoLatLngBounds;
    Marker: new (options: { position: KakaoLatLng; map: KakaoMap; image?: KakaoMarkerImage }) => KakaoMarker;
    MarkerImage: new (src: string, size: KakaoSize, options?: { offset: KakaoPoint }) => KakaoMarkerImage;
    Size: new (w: number, h: number) => KakaoSize;
    Point: new (x: number, y: number) => KakaoPoint;
    CustomOverlay: new (options: {
      content: string;
      position: KakaoLatLng;
      map?: KakaoMap;
      yAnchor: number;
    }) => KakaoCustomOverlay;
    event: {
      addListener: (target: KakaoMarker, type: string, handler: () => void) => void;
    };
    services: {
      Geocoder: new () => KakaoGeocoder;
      Status: { OK: string; ZERO_RESULT: string; ERROR: string };
    };
  };
}

interface KakaoMap {
  setBounds: (bounds: KakaoLatLngBounds) => void;
  setCenter: (latlng: KakaoLatLng) => void;
  setLevel: (level: number) => void;
  panTo: (latlng: KakaoLatLng) => void;
  relayout: () => void;
}
interface KakaoLatLng { getLat: () => number; getLng: () => number }
interface KakaoLatLngBounds { extend: (latlng: KakaoLatLng) => void }
interface KakaoMarker { setMap: (map: KakaoMap | null) => void }
interface KakaoMarkerImage {}
interface KakaoSize {}
interface KakaoPoint {}
interface KakaoCustomOverlay { setMap: (map: KakaoMap | null) => void }
interface KakaoGeocoder {
  addressSearch: (
    address: string,
    callback: (result: Array<{ x: string; y: string }>, status: string) => void,
  ) => void;
}

/* ─── Store with resolved coordinates ─── */
interface StoreWithCoords extends StoreData {
  resolvedLat: number;
  resolvedLng: number;
}

export default function StoreSection() {
  const [stores, setStores] = useState<StoreData[]>([]);
  const [regions, setRegions] = useState<string[]>([]);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [searchText, setSearchText] = useState('');
  const [viewMode, setViewMode] = useState<'map' | 'list'>('list');
  const [loading, setLoading] = useState(true);
  const [mapReady, setMapReady] = useState(false);
  const [kakaoKey, setKakaoKey] = useState('');

  // Resolved stores (with geocoded coords)
  const [resolvedStores, setResolvedStores] = useState<StoreWithCoords[]>([]);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<KakaoMap | null>(null);
  const markersRef = useRef<KakaoMarker[]>([]);
  const overlaysRef = useRef<KakaoCustomOverlay[]>([]);
  const activeOverlayRef = useRef<KakaoCustomOverlay | null>(null);

  /* ─── 1. Fetch kakao key from settings ─── */
  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.data.kakaoMapKey) {
          setKakaoKey(data.data.kakaoMapKey);
        }
      })
      .catch(() => {});
  }, []);

  /* ─── 2. Load Kakao Maps SDK (with services library for Geocoder) ─── */
  useEffect(() => {
    if (!kakaoKey) return;

    const initKakao = () => {
      if (window.kakao?.maps?.load) {
        window.kakao.maps.load(() => setMapReady(true));
        return true;
      }
      return false;
    };

    // Already loaded
    if (initKakao()) return;

    // Check if script already exists (e.g. from hot reload)
    const existing = document.querySelector('script[src*="dapi.kakao.com"]');
    if (existing) {
      const check = setInterval(() => {
        if (initKakao()) clearInterval(check);
      }, 100);
      return () => clearInterval(check);
    }

    const script = document.createElement('script');
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoKey}&autoload=false&libraries=services&_=${Date.now()}`;
    script.async = true;
    // Use both onload and polling as fallback (Kakao SDK returns 404 status but valid JS)
    script.onload = () => initKakao();
    script.onerror = () => {
      // Kakao SDK may return HTTP 404 but still deliver valid JS
      // Some browsers treat 404 as error for scripts - poll as fallback
      const poll = setInterval(() => {
        if (initKakao()) clearInterval(poll);
      }, 200);
      setTimeout(() => clearInterval(poll), 10000);
    };
    document.head.appendChild(script);
  }, [kakaoKey]);

  /* ─── 3. Fetch stores ─── */
  const fetchStores = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedRegion) params.set('region', selectedRegion);
      if (searchText) params.set('search', searchText);
      params.set('limit', '100');

      const res = await fetch(`/api/stores?${params}`);
      const data = await res.json();
      if (data.success) {
        setStores(data.data);
        if (regions.length === 0) {
          const uniqueRegions = [...new Set(data.data.map((s: StoreData) => s.region))].sort() as string[];
          setRegions(uniqueRegions);
        }
      }
    } catch (err) {
      console.error('Failed to fetch stores:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedRegion, searchText, regions.length]);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  /* ─── 4. Geocode stores that lack coordinates ─── */
  useEffect(() => {
    if (!mapReady || stores.length === 0) return;

    const geocoder = new window.kakao.maps.services.Geocoder();
    const OK = window.kakao.maps.services.Status.OK;

    const geocodeAddress = (address: string): Promise<{ lat: number; lng: number } | null> => {
      return new Promise((resolve) => {
        geocoder.addressSearch(address, (result, status) => {
          if (status === OK && result.length > 0) {
            resolve({ lat: parseFloat(result[0].y), lng: parseFloat(result[0].x) });
          } else {
            resolve(null);
          }
        });
      });
    };

    const resolveAll = async () => {
      const resolved: StoreWithCoords[] = [];

      for (const store of stores) {
        const hasCoords = store.latitude && store.longitude && store.latitude !== 0 && store.longitude !== 0;

        if (hasCoords) {
          resolved.push({ ...store, resolvedLat: store.latitude, resolvedLng: store.longitude });
        } else if (store.address) {
          const coords = await geocodeAddress(store.address);
          if (coords) {
            resolved.push({ ...store, resolvedLat: coords.lat, resolvedLng: coords.lng });
          }
        }
      }

      setResolvedStores(resolved);
    };

    resolveAll();
  }, [stores, mapReady]);

  /* ─── 5. Initialize map ─── */
  useEffect(() => {
    if (!mapReady || !mapContainerRef.current) return;
    if (mapRef.current) return;

    const center = new window.kakao.maps.LatLng(36.5, 127.5);
    mapRef.current = new window.kakao.maps.Map(mapContainerRef.current, {
      center,
      level: 13,
    });
  }, [mapReady]);

  /* ─── 6. Update markers when resolved stores change ─── */
  useEffect(() => {
    if (!mapRef.current || !mapReady) return;
    const map = mapRef.current;
    const kakao = window.kakao.maps;

    // Clear existing markers & overlays
    markersRef.current.forEach((m) => m.setMap(null));
    overlaysRef.current.forEach((o) => o.setMap(null));
    markersRef.current = [];
    overlaysRef.current = [];
    activeOverlayRef.current = null;

    if (resolvedStores.length === 0) return;

    // Custom marker image
    const markerSize = new kakao.Size(36, 48);
    const markerOffset = new kakao.Point(18, 48);
    const markerImage = new kakao.MarkerImage('/marker.svg', markerSize, { offset: markerOffset });

    const bounds = new kakao.LatLngBounds();

    resolvedStores.forEach((store) => {
      const position = new kakao.LatLng(store.resolvedLat, store.resolvedLng);
      bounds.extend(position);

      const marker = new kakao.Marker({ position, map, image: markerImage });

      const overlayContent = `
        <div style="padding:12px 16px;background:#fff;border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,.15);min-width:200px;max-width:280px;font-family:'Noto Sans KR',sans-serif;position:relative;">
          <button onclick="this.parentElement.parentElement.style.display='none'" style="position:absolute;top:8px;right:10px;background:none;border:none;font-size:16px;cursor:pointer;color:#999;line-height:1;">&times;</button>
          <div style="font-weight:700;font-size:14px;color:#8B0000;margin-bottom:6px;padding-right:20px;">${store.name}</div>
          <div style="font-size:12px;color:#555;margin-bottom:4px;">${store.address}</div>
          ${store.phone ? `<a href="tel:${store.phone}" style="font-size:12px;color:#8B0000;text-decoration:none;font-weight:500;">${store.phone}</a>` : ''}
          ${store.businessHours ? `<div style="font-size:11px;color:#888;margin-top:4px;">${store.businessHours}</div>` : ''}
        </div>
      `;

      const overlay = new kakao.CustomOverlay({
        content: overlayContent,
        position,
        yAnchor: 1.4,
      });

      kakao.event.addListener(marker, 'click', () => {
        if (activeOverlayRef.current) activeOverlayRef.current.setMap(null);
        overlay.setMap(map);
        activeOverlayRef.current = overlay;
        map.panTo(position);
      });

      markersRef.current.push(marker);
      overlaysRef.current.push(overlay);
    });

    map.setBounds(bounds);
  }, [resolvedStores, mapReady]);

  /* ─── 7. Handle store click (list → map) ─── */
  const handleStoreClick = (store: StoreData) => {
    if (!mapRef.current) return;

    const resolved = resolvedStores.find((s) => s._id === store._id);
    if (!resolved) return;

    setViewMode('map');

    const position = new window.kakao.maps.LatLng(resolved.resolvedLat, resolved.resolvedLng);

    setTimeout(() => {
      if (!mapRef.current) return;
      mapRef.current.relayout();
      mapRef.current.setLevel(3);
      mapRef.current.panTo(position);

      // Open overlay
      overlaysRef.current.forEach((o) => o.setMap(null));
      const idx = resolvedStores.findIndex((s) => s._id === store._id);
      if (idx >= 0 && overlaysRef.current[idx]) {
        overlaysRef.current[idx].setMap(mapRef.current);
        activeOverlayRef.current = overlaysRef.current[idx];
      }
    }, 150);
  };

  /* ─── Render ─── */
  return (
    <section id="store" className="py-16 lg:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-black text-[var(--color-primary)] mb-4">매장 안내</h2>
          <div className="w-16 h-1 bg-[var(--color-accent)] mx-auto" />
        </div>

        {/* Mobile: View Toggle */}
        <div className="flex lg:hidden justify-center mb-6">
          <div className="inline-flex bg-gray-200 rounded-full p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                viewMode === 'list' ? 'bg-white shadow text-gray-900' : 'text-gray-600'
              }`}
            >
              목록보기
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                viewMode === 'map' ? 'bg-white shadow text-gray-900' : 'text-gray-600'
              }`}
            >
              지도보기
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
          >
            <option value="">전체 지역</option>
            {regions.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
          <div className="flex-1 flex gap-2">
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="매장명 또는 주소 검색"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
            />
          </div>
        </div>

        {/* Map */}
        <div className={`mb-8 ${viewMode === 'list' ? 'hidden lg:block' : ''}`}>
          {kakaoKey ? (
            <div
              ref={mapContainerRef}
              className="w-full h-[300px] lg:h-[450px] rounded-xl overflow-hidden shadow-sm"
            />
          ) : (
            <div className="w-full h-[300px] lg:h-[450px] bg-gray-200 rounded-xl flex items-center justify-center text-gray-500">
              <div className="text-center">
                <svg className="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="text-sm">카카오맵 API 키를 설정해주세요</p>
                <p className="text-xs text-gray-400 mt-1">관리자 &gt; 사이트 설정 &gt; 카카오맵 JavaScript 키</p>
              </div>
            </div>
          )}
        </div>

        {/* Store List */}
        <div className={`${viewMode === 'map' ? 'hidden lg:block' : ''}`}>
          {loading ? (
            <div className="text-center py-12 text-gray-400">로딩 중...</div>
          ) : stores.length === 0 ? (
            <div className="text-center py-12 text-gray-400">매장을 찾을 수 없습니다.</div>
          ) : (
            <>
              {/* Desktop: Table */}
              <div className="hidden lg:block">
                <table className="w-full bg-white rounded-xl overflow-hidden shadow-sm">
                  <thead>
                    <tr className="bg-gray-100 text-sm text-gray-600">
                      <th className="px-4 py-3 text-left">지역</th>
                      <th className="px-4 py-3 text-left">매장명</th>
                      <th className="px-4 py-3 text-left">주소</th>
                      <th className="px-4 py-3 text-left">전화번호</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stores.map((store) => (
                      <tr
                        key={store._id}
                        className="border-t border-gray-100 hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleStoreClick(store)}
                      >
                        <td className="px-4 py-3 text-sm">
                          <span className="inline-block px-2 py-1 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded text-xs font-medium">
                            {store.region}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm font-medium">{store.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{store.address}</td>
                        <td className="px-4 py-3 text-sm">
                          {store.phone ? (
                            <a
                              href={`tel:${store.phone}`}
                              className="text-[var(--color-primary)] hover:underline"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {store.phone}
                            </a>
                          ) : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile: Cards */}
              <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
                {stores.map((store) => (
                  <div
                    key={store._id}
                    className="bg-white rounded-xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleStoreClick(store)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-bold text-base">{store.name}</h4>
                      <span className="inline-block px-2 py-1 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded text-xs font-medium flex-shrink-0">
                        {store.region}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{store.address}</p>
                    {store.phone && (
                      <a
                        href={`tel:${store.phone}`}
                        className="inline-flex items-center space-x-1 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                        </svg>
                        <span>{store.phone}</span>
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
