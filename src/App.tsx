import { KanbanBoard } from './components/KanbanBoard';
import { Film } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950">
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-2">
          <div className="p-1.5 bg-blue-600 rounded-lg">
            <Film size={18} className="text-white" />
          </div>
          <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100 tracking-tight">
            Watchlist
          </h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <KanbanBoard />
      </main>
    </div>
  );
}
