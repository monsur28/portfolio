'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SyncButton() {
  const [syncing, setSyncing] = useState(false);
  const router = useRouter();

  const handleSync = async () => {
    setSyncing(true);
    try {
      const res = await fetch('/api/admin/sync', { method: 'POST' });
      const data = await res.json();
      
      if (res.ok) {
        alert(`Sync complete! Added: ${data.added}, Updated: ${data.updated}`);
        router.refresh();
      } else {
        alert(`Sync failed: ${data.error}`);
      }
    } catch (err) {
      alert('An error occurred during sync');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <button 
      onClick={handleSync}
      disabled={syncing}
      className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded text-sm tracking-wider transition-colors disabled:opacity-50"
    >
      {syncing ? 'SYNCING...' : 'SYNC GITHUB'}
    </button>
  );
}
