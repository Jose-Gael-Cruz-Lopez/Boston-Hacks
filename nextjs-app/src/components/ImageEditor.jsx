import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";

/**
 * ImageEditor Component
 * Provides controls to edit the selected image's prompt
 * - Editable prompt textarea
 * - Filter dropdown selector
 * - Intensity slider (0-100)
 * - Re-Generate button triggers PATCH API call
 */

interface Change {
  title: string;
  filterOptions: string[];
  intensity: number;
  previewUrl: string;
}

interface ImageEditorProps {
  change: Change;
  index: number;
  onRegenerate: (index: number, newPrompt: string, filter: string, intensity: number) => void;
  isLoading: boolean;
}

export function ImageEditor({ change, index, onRegenerate, isLoading }: ImageEditorProps) {
  const [prompt, setPrompt] = useState(change.title);
  const [selectedFilter, setSelectedFilter] = useState(change.filterOptions[0] || "none");
  const [intensity, setIntensity] = useState(change.intensity);

  // Reset form when selected change updates
  useEffect(() => {
    setPrompt(change.title);
    setSelectedFilter(change.filterOptions[0] || "none");
    setIntensity(change.intensity);
  }, [change]);

  const handleRegenerate = () => {
    onRegenerate(index, prompt, selectedFilter, intensity);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-4xl mx-auto px-4 py-6"
    >
      {/* Editor Card */}
      <div className="bg-card border-2 border-primary/50 p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-primary animate-pixel-pulse" />
          <h2 className="font-pixel text-sm uppercase tracking-wider text-primary">
            Refine '{change.title}'
          </h2>
        </div>

        {/* Prompt Textarea */}
        <div className="space-y-2">
          <label className="font-arcade text-lg text-foreground">
            PROMPT
          </label>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your vision..."
            className="
              min-h-[120px] font-mono text-sm
              bg-input border-2 border-secondary
              focus:border-primary focus-visible:ring-primary
              resize-none
            "
            disabled={isLoading}
          />
        </div>

        {/* Filter Dropdown */}
        <div className="space-y-2">
          <label className="font-arcade text-lg text-foreground">
            FILTER
          </label>
          <div className="relative">
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              disabled={isLoading}
              className="
                w-full px-4 py-3 font-mono text-sm
                bg-input border-2 border-secondary
                focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50
                appearance-none cursor-pointer
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              {change.filterOptions.map((filter) => (
                <option key={filter} value={filter}>
                  {filter.toUpperCase()}
                </option>
              ))}
            </select>
            {/* Custom dropdown arrow */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-primary" />
            </div>
          </div>
        </div>

        {/* Intensity Slider */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="font-arcade text-lg text-foreground">
              INTENSITY
            </label>
            <span className="font-pixel text-xs text-primary">
              {intensity}%
            </span>
          </div>
          <Slider
            value={[intensity]}
            onValueChange={(values) => setIntensity(values[0])}
            max={100}
            step={1}
            disabled={isLoading}
            className="w-full"
          />
          {/* Visual intensity bar */}
          <div className="h-2 bg-secondary border border-secondary relative overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: "0%" }}
              animate={{ width: `${intensity}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Re-Generate Button */}
        <motion.button
          onClick={handleRegenerate}
          disabled={isLoading}
          whileHover={{ scale: isLoading ? 1 : 1.02 }}
          whileTap={{ scale: isLoading ? 1 : 0.98 }}
          className="
            arcade-btn w-full
            disabled:opacity-50 disabled:cursor-not-allowed
            relative overflow-hidden
          "
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-3">
              <motion.span
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                GENERATING
              </motion.span>
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="inline-block w-4 h-4 border-2 border-t-primary-foreground border-r-transparent border-b-transparent border-l-transparent"
              />
            </span>
          ) : (
            "RE-GENERATE"
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}