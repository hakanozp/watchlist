import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import { MediaCard } from './MediaCard';
import type { MediaItem, MediaStatus } from '../types/media';
import { COLUMN_CONFIG } from '../types/media';

interface Props {
  status: MediaStatus;
  items: MediaItem[];
  onAdd: (status: MediaStatus) => void;
  onEdit: (item: MediaItem) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, newStatus: MediaStatus) => void;
}

export function KanbanColumn({ status, items, onAdd, onEdit, onDelete, onMove }: Props) {
  const cfg = COLUMN_CONFIG[status];
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div className="flex flex-col min-w-0 w-full">
      {/* Header */}
      <div className={`${cfg.headerColor} rounded-t-xl px-4 py-3 flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-white">{cfg.label}</h2>
          <span className="text-[11px] bg-white/25 text-white font-medium px-1.5 py-0.5 rounded-full">
            {items.length}
          </span>
        </div>
        <button
          onClick={() => onAdd(status)}
          className="p-1 rounded-lg bg-white/20 hover:bg-white/35 text-white transition-colors"
          aria-label={`${cfg.label} kolonuna ekle`}
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Drop zone */}
      <div
        ref={setNodeRef}
        className={`flex-1 rounded-b-xl border-2 ${cfg.color} bg-gray-50 dark:bg-gray-900 p-2 space-y-2 min-h-[200px] transition-colors ${
          isOver ? 'bg-blue-50 dark:bg-blue-950' : ''
        }`}
      >
        <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
          {items.map((item) => (
            <MediaCard key={item.id} item={item} onEdit={onEdit} onDelete={onDelete} onMove={onMove} />
          ))}
        </SortableContext>

        {items.length === 0 && (
          <div className="flex flex-col items-center justify-center h-24 text-gray-400 dark:text-gray-600">
            <p className="text-xs">Henüz içerik yok</p>
            <button
              onClick={() => onAdd(status)}
              className="mt-2 text-xs text-blue-500 hover:underline"
            >
              + Ekle
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
