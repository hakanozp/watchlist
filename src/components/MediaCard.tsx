import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Pencil, Trash2, Tv, Film, Play, CheckCheck, ChevronDown, ChevronRight } from 'lucide-react';
import type { MediaItem, MediaStatus } from '../types/media';
import { RATING_CONFIG } from '../types/media';

interface Props {
  item: MediaItem;
  onEdit: (item: MediaItem) => void;
  onDelete: (id: string) => void;
  onMove?: (id: string, newStatus: MediaStatus) => void;
}

export function MediaCard({ item, onEdit, onDelete, onMove }: Props) {
  const [expanded, setExpanded] = useState(true);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const showSeasonInfo = item.status === 'watching' && item.type === 'series' &&
    (item.current_season || item.current_episode);
  const showRating = (item.status === 'watching' || item.status === 'watched') && item.rating;
  const ratingCfg = item.rating ? RATING_CONFIG[item.rating] : null;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden group"
    >
      {/* Collapsed view */}
      {!expanded && (
        <div className="flex items-center gap-2 px-2.5 py-2">
          <button
            {...attributes}
            {...listeners}
            className="text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing flex-shrink-0"
            aria-label="Sürükle"
          >
            <GripVertical size={14} />
          </button>

          <button
            onClick={() => setExpanded(true)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 flex-shrink-0"
            aria-label="Genişlet"
          >
            <ChevronRight size={14} />
          </button>

          <span
            className="flex-1 text-sm font-semibold text-gray-900 dark:text-gray-100 truncate cursor-pointer"
            onClick={() => setExpanded(true)}
          >
            {item.title}
          </span>

          <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(item)}
              className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-blue-500 transition-colors"
              aria-label="Düzenle"
            >
              <Pencil size={13} />
            </button>
            <button
              onClick={() => onDelete(item.id)}
              className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-red-500 transition-colors"
              aria-label="Sil"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>
      )}

      {/* Expanded view */}
      {expanded && (
        <div className="flex gap-2">
          {/* Poster — clickable to edit */}
          <div
            className="w-16 flex-shrink-0 bg-gray-100 dark:bg-gray-700 cursor-pointer hover:brightness-90 transition-all"
            onClick={() => onEdit(item)}
            title="Düzenlemek için tıkla"
          >
            {item.poster_url ? (
              <img
                src={item.poster_url}
                alt={item.title}
                className="w-full h-full object-cover min-h-[88px]"
              />
            ) : (
              <div className="w-full min-h-[88px] flex items-center justify-center text-gray-400">
                {item.type === 'series' ? <Tv size={22} /> : <Film size={22} />}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 p-2.5 min-w-0">
            <div className="flex items-start gap-1">
              {/* Drag handle */}
              <button
                {...attributes}
                {...listeners}
                className="mt-0.5 text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing flex-shrink-0"
                aria-label="Sürükle"
              >
                <GripVertical size={14} />
              </button>

              {/* Collapse toggle */}
              <button
                onClick={() => setExpanded(false)}
                className="mt-0.5 text-gray-300 hover:text-gray-500 flex-shrink-0 transition-colors"
                aria-label="Daralt"
              >
                <ChevronDown size={14} />
              </button>

              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 leading-tight line-clamp-2">
                  {item.title}
                </h3>

                <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                  <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                    item.type === 'series'
                      ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
                      : 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
                  }`}>
                    {item.type === 'series' ? 'Dizi' : 'Film'}
                  </span>

                  {showSeasonInfo && (
                    <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">
                      {item.current_season ? `S${item.current_season}` : ''}
                      {item.current_season && item.current_episode ? ' ' : ''}
                      {item.current_episode ? `B${item.current_episode}` : ''}
                      {item.total_seasons ? ` / ${item.total_seasons} sez.` : ''}
                    </span>
                  )}

                  {showRating && ratingCfg && (
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${ratingCfg.color}`}>
                      {ratingCfg.emoji} {ratingCfg.label}
                    </span>
                  )}
                </div>

                {item.notes && (
                  <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1 line-clamp-1">
                    {item.notes}
                  </p>
                )}
              </div>

              {/* Edit / Delete */}
              <div className="flex flex-col gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => onEdit(item)}
                  className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-blue-500 transition-colors"
                  aria-label="Düzenle"
                >
                  <Pencil size={13} />
                </button>
                <button
                  onClick={() => onDelete(item.id)}
                  className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-red-500 transition-colors"
                  aria-label="Sil"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>

            {/* Quick action buttons */}
            {onMove && item.status === 'want_to_watch' && (
              <button
                onClick={() => onMove(item.id, 'watching')}
                className="mt-2 w-full flex items-center justify-center gap-1.5 py-1 px-2 text-[11px] font-medium text-yellow-700 bg-yellow-50 hover:bg-yellow-100 dark:text-yellow-300 dark:bg-yellow-900/30 dark:hover:bg-yellow-900/50 rounded-lg border border-yellow-200 dark:border-yellow-800 transition-colors"
              >
                <Play size={11} />
                İzlemeye Başla
              </button>
            )}

            {onMove && item.status === 'watching' && (
              <button
                onClick={() => onMove(item.id, 'watched')}
                className="mt-2 w-full flex items-center justify-center gap-1.5 py-1 px-2 text-[11px] font-medium text-green-700 bg-green-50 hover:bg-green-100 dark:text-green-300 dark:bg-green-900/30 dark:hover:bg-green-900/50 rounded-lg border border-green-200 dark:border-green-800 transition-colors"
              >
                <CheckCheck size={11} />
                İzledim
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
