/**
 * IndexedDB Video Storage Utility
 * Allows users to upload and store high-definition video files (.mp4, .webm, .mov)
 * directly in browser local database (supports large files up to several GBs).
 */

const DB_NAME = 'akaar_entertainments_media_db';
const DB_VERSION = 1;
const STORE_NAME = 'videos';
const HERO_VIDEO_KEY = 'hero_background_video_blob';

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Saves a user-uploaded video file into IndexedDB
 */
export async function saveLocalHeroVideo(file: Blob | File): Promise<string> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.put(file, HERO_VIDEO_KEY);
    request.onsuccess = () => {
      const blobUrl = URL.createObjectURL(file);
      resolve(blobUrl);
    };
    request.onerror = () => reject(request.error);
  });
}

/**
 * Retrieves the stored local video blob URL from IndexedDB
 */
export async function getLocalHeroVideo(): Promise<string | null> {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.get(HERO_VIDEO_KEY);
      request.onsuccess = () => {
        const result = request.result;
        if (result instanceof Blob) {
          const blobUrl = URL.createObjectURL(result);
          resolve(blobUrl);
        } else {
          resolve(null);
        }
      };
      request.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

/**
 * Clears the stored local video
 */
export async function clearLocalHeroVideo(): Promise<void> {
  try {
    const db = await openDatabase();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.delete(HERO_VIDEO_KEY);
      request.onsuccess = () => resolve();
      request.onerror = () => resolve();
    });
  } catch {
    // ignore
  }
}
