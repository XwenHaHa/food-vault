'use client';

import { useEffect, useRef, useState } from 'react';

interface MapViewProps {
  center?: { lat: number; lng: number };
  markers?: { id: string; name: string; lat: number; lng: number }[];
  onMarkerClick?: (id: string) => void;
}

declare global {
  interface Window {
    AMap: unknown;
  }
}

export function MapView({ center, markers = [], onMarkerClick }: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<unknown>(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  // Load AMap script
  useEffect(() => {
    if (window.AMap) {
      setLoaded(true);
      return;
    }

    const key = process.env.NEXT_PUBLIC_AMAP_KEY;
    if (!key || key === 'your_amap_key_here') {
      setError(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://webapi.amap.com/maps?v=2.0&key=${key}`;
    script.onload = () => setLoaded(true);
    script.onerror = () => setError(true);
    document.head.appendChild(script);
  }, []);

  // Init map
  useEffect(() => {
    if (!loaded || !containerRef.current || !window.AMap) return;

    const AMap = window.AMap as {
      Map: new (el: HTMLElement, opts: Record<string, unknown>) => unknown;
      Marker: new (opts: Record<string, unknown>) => { on: (event: string, cb: () => void) => void };
      LngLat: new (lng: number, lat: number) => unknown;
    };

    const mapCenter = center
      ? new AMap.LngLat(center.lng, center.lat)
      : new AMap.LngLat(114.05, 22.55); // Default: Shenzhen

    const map = new AMap.Map(containerRef.current, {
      zoom: 12,
      center: mapCenter,
      viewMode: '2D',
    });

    mapRef.current = map;

    // Add markers
    markers.forEach((m) => {
      const AMapMod = window.AMap as {
        Marker: new (opts: Record<string, unknown>) => { on: (event: string, cb: () => void) => void };
        LngLat: new (lng: number, lat: number) => unknown;
      };
      const marker = new AMapMod.Marker({
        position: new AMapMod.LngLat(m.lng, m.lat),
        title: m.name,
      });
      if (onMarkerClick) {
        marker.on('click', () => onMarkerClick(m.id));
      }
      (map as { add: (overlay: unknown) => void }).add(marker);
    });
  }, [loaded, center, markers, onMarkerClick]);

  if (error) {
    return (
      <div className="bg-gray-200 rounded-2xl h-40 mb-3 flex flex-col items-center justify-center">
        <p className="text-xs text-gray-500">地图未配置</p>
        <p className="text-[10px] text-gray-400 mt-1">请在 .env.local 中设置 NEXT_PUBLIC_AMAP_KEY</p>
      </div>
    );
  }

  if (!loaded) {
    return (
      <div className="bg-gray-200 rounded-2xl h-40 mb-3 flex items-center justify-center">
        <p className="text-xs text-gray-500">地图加载中...</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="rounded-2xl h-40 mb-3 overflow-hidden"
      style={{ width: '100%' }}
    />
  );
}
