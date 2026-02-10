'use client'

import { useEffect } from 'react';

export default function HeaderHydrator() {
  useEffect(() => {
    function onUpdate(e: Event) {
      try {
        // @ts-ignore
        const d = e.detail || {};
        const img = document.getElementById('site-profile-img') as HTMLImageElement | null;
        const desc = document.getElementById('site-profile-desc') as HTMLElement | null;
        if (img && d.photoUrl) {
          // append timestamp to bypass browser cache
          img.src = d.photoUrl + (d.photoUrl.includes('?') ? '&' : '?') + 'ts=' + Date.now();
        }
        if (desc && typeof d.description === 'string') {
          desc.textContent = d.description;
        }
      } catch (err) {
        console.error('HeaderHydrator error', err);
      }
    }

    // BroadcastChannel listener
    let bc: BroadcastChannel | null = null;
    function onMessage(ev: MessageEvent) {
      try {
        const d = ev.data || {};
        const img = document.getElementById('site-profile-img') as HTMLImageElement | null;
        const desc = document.getElementById('site-profile-desc') as HTMLElement | null;
        if (img && d.photoUrl) {
          img.src = d.photoUrl + (d.photoUrl.includes('?') ? '&' : '?') + 'ts=' + Date.now();
        }
        if (desc && typeof d.description === 'string') {
          desc.textContent = d.description;
        }
      } catch (err) {
        console.error('HeaderHydrator message error', err);
      }
    }

    window.addEventListener('profile:update', onUpdate as EventListener);
    try {
      if (typeof BroadcastChannel !== 'undefined') {
        bc = new BroadcastChannel('profile');
        bc.addEventListener('message', onMessage);
      }
    } catch (err) {
      console.warn('BroadcastChannel not available in HeaderHydrator', err);
    }

    return () => {
      window.removeEventListener('profile:update', onUpdate as EventListener);
      if (bc) {
        try {
          bc.removeEventListener('message', onMessage);
          bc.close();
        } catch (err) {
          /* ignore cleanup errors */
        }
      }
    };
  }, []);

  return null;
}
