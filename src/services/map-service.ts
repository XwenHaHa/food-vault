const AMAP_KEY = process.env.NEXT_PUBLIC_AMAP_KEY;

export function getAMapScriptUrl(): string {
  return `https://webapi.amap.com/maps?v=2.0&key=${AMAP_KEY}`;
}

export function calculateUserDistance(
  userLat: number,
  userLng: number,
  storeLat: number,
  storeLng: number
): number {
  const R = 6371;
  const dLat = toRad(storeLat - userLat);
  const dLng = toRad(storeLng - userLng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(userLat)) * Math.cos(toRad(storeLat)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

export async function getCurrentPosition(): Promise<{ lat: number; lng: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => reject(err),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  });
}
