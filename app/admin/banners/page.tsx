'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Trash2, Plus, ToggleLeft, ToggleRight, ImageIcon } from 'lucide-react';

interface Banner {
  id: string;
  imageUrl: string;
  active: boolean;
  createdAt: string;
}

export default function BannersAdmin() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newUrl, setNewUrl] = useState('');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      // Fetch all banners (active + inactive) for admin view
      const res = await fetch('/api/banners/all');
      const result = await res.json();
      if (result.success) setBanners(result.data);
      else setError('Failed to load banners');
    } catch {
      setError('Error fetching banners');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl.trim()) return;
    setAdding(true);
    try {
      const res = await fetch('/api/banners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: newUrl.trim(), active: true }),
      });
      const result = await res.json();
      if (result.success) {
        setNewUrl('');
        fetchBanners();
      } else {
        setError(result.message || 'Failed to add banner');
      }
    } catch {
      setError('Error adding banner');
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this banner?')) return;
    try {
      const res = await fetch(`/api/banners/${id}`, { method: 'DELETE' });
      const result = await res.json();
      if (result.success) setBanners(banners.filter((b) => b.id !== id));
      else setError('Failed to delete banner');
    } catch {
      setError('Error deleting banner');
    }
  };

  const toggleActive = async (id: string, active: boolean) => {
    try {
      const res = await fetch(`/api/banners/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !active }),
      });
      const result = await res.json();
      if (result.success) fetchBanners();
    } catch {
      console.error('Error toggling banner');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800">Banners</h1>
          <p className="text-sm text-slate-500 mt-1">Manage homepage banner images</p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
            {error}
          </div>
        )}

        {/* Add form */}
        <form onSubmit={handleAdd} className="mb-6 bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add New Banner
          </p>
          <div className="flex gap-2">
            <input
              type="url"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="https://example.com/banner.jpg"
              required
              className="flex-1 px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 bg-slate-50"
            />
            <button
              type="submit"
              disabled={adding}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition disabled:opacity-60"
            >
              {adding ? 'Adding…' : 'Add'}
            </button>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Paste a direct image URL. Recommended size: 1200×375 px (16:5 ratio).</p>
        </form>

        {/* Banner list */}
        {loading ? (
          <div className="text-center py-12 text-slate-400 text-sm">Loading…</div>
        ) : banners.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
            <ImageIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">No banners yet</p>
            <p className="text-slate-400 text-sm mt-1">Add your first banner image above</p>
          </div>
        ) : (
          <div className="space-y-3">
            {banners.map((banner) => (
              <div key={banner.id} className={`bg-white border rounded-xl overflow-hidden shadow-sm ${banner.active ? 'border-slate-200' : 'border-dashed border-slate-300 opacity-60'}`}>
                {/* Preview */}
                <div className="relative w-full bg-slate-100" style={{ aspectRatio: '16 / 5' }}>
                  <Image
                    src={banner.imageUrl}
                    alt="Banner preview"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                {/* Controls */}
                <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 bg-slate-50">
                  <div className="text-xs text-slate-400 truncate max-w-[60%]">{banner.imageUrl}</div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleActive(banner.id, banner.active)}
                      className={`flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full transition ${banner.active ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                    >
                      {banner.active ? <ToggleRight className="w-3.5 h-3.5" /> : <ToggleLeft className="w-3.5 h-3.5" />}
                      {banner.active ? 'Active' : 'Inactive'}
                    </button>
                    <button
                      onClick={() => handleDelete(banner.id)}
                      className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
