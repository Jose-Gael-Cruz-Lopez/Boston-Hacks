import { motion, AnimatePresence } from "framer-motion";
import { History, X } from "lucide-react";
import { useState } from "react";

/**
 * HistorySidebar Component
 * Displays version history with thumbnails and timestamps
 * - Shows snapshots of previous workflow states
 * - Click thumbnail to restore that version
 * - Collapsible on mobile for better UX
 */

interface HistorySnapshot {
  id: string;
  timestamp: Date;
  thumbnails: string[];
  changeCount: number;
}

interface HistorySidebarProps {
  history: HistorySnapshot[];
  onRestore: (snapshot: HistorySnapshot) => void;
}

export function HistorySidebar({ history, onRestore }: HistorySidebarProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      {/* Mobile Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="
          md:hidden fixed top-4 right-4 z-50
          w-12 h-12 bg-primary text-primary-foreground
          border-2 border-primary
          flex items-center justify-center
          pixel-glow
        "
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? <X size={20} /> : <History size={20} />}
      </motion.button>

      {/* Sidebar Container */}
      <AnimatePresence mode="wait">
        {(isOpen || (typeof window !== 'undefined' && window.innerWidth >= 768)) && (
          <motion.aside
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="
              fixed md:sticky top-0 right-0 h-screen
              w-80 bg-card border-l-4 border-primary/50
              overflow-y-auto z-40
              flex flex-col
            "
          >
            {/* Header */}
            <div className="sticky top-0 bg-card border-b-2 border-primary/50 p-4 z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <History className="w-5 h-5 text-primary" />
                  <h2 className="font-pixel text-xs uppercase text-primary">
                    History
                  </h2>
                </div>
                <span className="font-arcade text-sm text-muted-foreground">
                  {history.length} snapshots
                </span>
              </div>
            </div>

            {/* History List */}
            <div className="flex-1 p-4 space-y-4">
              {history.length === 0 ? (
                <div className="text-center py-12">
                  <History className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="font-arcade text-sm text-muted-foreground">
                    No history yet
                  </p>
                  <p className="font-mono text-xs text-muted-foreground mt-1">
                    Regenerate images to create snapshots
                  </p>
                </div>
              ) : (
                history.map((snapshot, index) => (
                  <motion.button
                    key={snapshot.id}
                    onClick={() => onRestore(snapshot)}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02, x: -4 }}
                    whileTap={{ scale: 0.98 }}
                    className="
                      w-full text-left
                      bg-secondary/50 hover:bg-secondary
                      border-2 border-secondary hover:border-primary/50
                      p-3 transition-all duration-200
                      group
                    "
                  >
                    {/* Timestamp */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-pixel text-[8px] text-primary uppercase">
                        Version {history.length - index}
                      </span>
                      <span className="font-mono text-xs text-muted-foreground">
                        {formatTimestamp(snapshot.timestamp)}
                      </span>
                    </div>

                    {/* Thumbnail Grid */}
                    <div className="grid grid-cols-4 gap-1 mb-2">
                      {snapshot.thumbnails.slice(0, 4).map((thumb, thumbIndex) => (
                        <div
                          key={thumbIndex}
                          className="
                            aspect-square border border-primary/30
                            group-hover:border-primary/60
                            transition-colors overflow-hidden
                          "
                        >
                          <img
                            src={thumb}
                            alt={`Thumbnail ${thumbIndex + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>

                    {/* Change Count */}
                    <p className="font-arcade text-xs text-muted-foreground">
                      {snapshot.changeCount} changes
                    </p>
                  </motion.button>
                ))
              )}
            </div>

            {/* Footer Info */}
            <div className="sticky bottom-0 bg-card border-t-2 border-primary/50 p-3">
              <p className="font-mono text-[10px] text-muted-foreground text-center">
                Click any snapshot to restore
              </p>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}

/**
 * Format timestamp for display
 * Shows relative time (e.g., "2m ago") or absolute time
 */
function formatTimestamp(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}