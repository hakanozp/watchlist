import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { TMDBSearch } from './TMDBSearch';
import { posterUrl } from '../lib/tmdb';
import type { MediaItem, MediaStatus, MediaType, MediaRating, TMDBSearchResult } from '../types/media';
import { COLUMN_CONFIG, RATING_CONFIG } from '../types/media';

interface Props {
  defaultStatus: MediaStatus;
  editItem?: MediaItem | null;
  onSave: (data: Omit<MediaItem, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  onClose: () => void;
}

const STATUSES = Object.entries(COLUMN_CONFIG) as [MediaStatus, (typeof COLUMN_CONFIG)[MediaStatus]][];
const RATINGS = Object.entries(RATING_CONFIG) as [MediaRating, (typeof RATING_CONFIG)[MediaRating]][];

export function AddMediaModal({ defaultStatus, editItem, onSave, onClose }: Props) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<MediaType>('movie');
  const [status, setStatus] = useState<MediaStatus>(defaultStatus);
  const [currentSeason, setCurrentSeason] = useState('');
  const [currentEpisode, setCurrentEpisode] = useState('');
  const [totalSeasons, setTotalSeasons] = useState('');
  const [notes, setNotes] = useState('');
  const [posterUrlState, setPosterUrl] = useState('');
  const [tmdbId, setTmdbId] = useState<number | null>(null);
  const [rating, setRating] = useState<MediaRating | null>(null);
  const [saving, setSaving] = useState(false);

  const showRating = status === 'watching' || status === 'watched';

  useEffect(() => {
    if (editItem) {
      setTitle(editItem.title);
      setType(editItem.type);
      setStatus(editItem.status);
      setCurrentSeason(editItem.current_season?.toString() ?? '');
      setCurrentEpisode(editItem.current_episode?.toString() ?? '');
      setTotalSeasons(editItem.total_seasons?.toString() ?? '');
      setNotes(editItem.notes ?? '');
      setPosterUrl(editItem.poster_url ?? '');
      setTmdbId(editItem.tmdb_id ?? null);
      setRating(editItem.rating ?? null);
    }
  }, [editItem]);

  const handleTMDBSelect = (r: TMDBSearchResult) => {
    setTitle(r.title ?? r.name ?? '');
    setType(r.media_type === 'tv' ? 'series' : 'movie');
    setPosterUrl(posterUrl(r.poster_path) ?? '');
    setTmdbId(r.id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSaving(true);
    await onSave({
      title: title.trim(),
      type,
      status,
      current_season: currentSeason ? parseInt(currentSeason) : null,
      current_episode: currentEpisode ? parseInt(currentEpisode) : null,
      total_seasons: totalSeasons ? parseInt(totalSeasons) : null,
      notes: notes.trim() || null,
      poster_url: posterUrlState || null,
      tmdb_id: tmdbId,
      rating: showRating ? rating : null,
      order_index: editItem?.order_index ?? 0,
    });
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            {editItem ? 'Düzenle' : 'Yeni Ekle'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <TMDBSearch onSelect={handleTMDBSelect} />

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Başlık <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Dizi veya film adı"
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Type + Status row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tür</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as MediaType)}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="movie">Film</option>
                <option value="series">Dizi</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Durum</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as MediaStatus)}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {STATUSES.map(([key, cfg]) => (
                  <option key={key} value={key}>{cfg.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Series fields — only when actively watching */}
          {type === 'series' && status === 'watching' && (
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sezon</label>
                <input
                  type="number"
                  min="1"
                  value={currentSeason}
                  onChange={(e) => setCurrentSeason(e.target.value)}
                  placeholder="1"
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bölüm</label>
                <input
                  type="number"
                  min="1"
                  value={currentEpisode}
                  onChange={(e) => setCurrentEpisode(e.target.value)}
                  placeholder="1"
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Top. Sezon</label>
                <input
                  type="number"
                  min="1"
                  value={totalSeasons}
                  onChange={(e) => setTotalSeasons(e.target.value)}
                  placeholder="?"
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {/* Rating — only for watching/watched */}
          {showRating && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nasıl buldun?
              </label>
              <div className="flex gap-2">
                {RATINGS.map(([key, cfg]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setRating(rating === key ? null : key)}
                    className={`flex-1 flex flex-col items-center gap-1 py-2 px-1 rounded-xl border-2 text-xs font-medium transition-all ${
                      rating === key
                        ? `border-current ${cfg.color}`
                        : 'border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    <span className="text-lg">{cfg.emoji}</span>
                    <span>{cfg.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Not (opsiyonel)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="Kısa bir not..."
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Poster preview */}
          {posterUrlState && (
            <div className="flex items-center gap-3">
              <img src={posterUrlState} alt="poster" className="w-12 h-16 object-cover rounded-lg" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{posterUrlState}</p>
                <button
                  type="button"
                  onClick={() => setPosterUrl('')}
                  className="text-xs text-red-500 hover:underline mt-0.5"
                >
                  Kaldır
                </button>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={saving || !title.trim()}
              className="flex-1 py-2 px-4 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
            >
              {saving ? 'Kaydediliyor...' : editItem ? 'Güncelle' : 'Ekle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
