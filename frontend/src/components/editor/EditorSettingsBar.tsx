import React from 'react';
import {
  Settings,
  Minus,
  Plus,
  RotateCcw,
  Maximize2,
  Minimize2,
  Map,
} from 'lucide-react';

interface EditorSettingsBarProps {
  fontSize: number;
  onFontSizeChange: (size: number) => void;
  showMinimap: boolean;
  onMinimapToggle: () => void;
  isFullscreen: boolean;
  onFullscreenToggle: () => void;
  onReset: () => void;
}

const EditorSettingsBar: React.FC<EditorSettingsBarProps> = ({
  fontSize,
  onFontSizeChange,
  showMinimap,
  onMinimapToggle,
  isFullscreen,
  onFullscreenToggle,
  onReset,
}) => {
  const increaseFontSize = () => onFontSizeChange(Math.min(fontSize + 1, 24));
  const decreaseFontSize = () => onFontSizeChange(Math.max(fontSize - 1, 10));

  return (
    <div className="flex items-center gap-1 text-gray-400">
      {/* Font size controls */}
      <div className="flex items-center bg-[#2d2d2d] border border-[#404040] rounded-lg overflow-hidden">
        <button
          id="font-decrease-btn"
          onClick={decreaseFontSize}
          title="Decrease font size"
          className="px-2 py-1.5 hover:bg-[#404040] hover:text-white transition-colors"
        >
          <Minus size={12} />
        </button>
        <span className="px-2 text-xs text-gray-300 select-none border-x border-[#404040] min-w-[32px] text-center">
          {fontSize}
        </span>
        <button
          id="font-increase-btn"
          onClick={increaseFontSize}
          title="Increase font size"
          className="px-2 py-1.5 hover:bg-[#404040] hover:text-white transition-colors"
        >
          <Plus size={12} />
        </button>
      </div>

      {/* Minimap toggle */}
      <button
        id="minimap-toggle-btn"
        onClick={onMinimapToggle}
        title={showMinimap ? 'Hide minimap' : 'Show minimap'}
        className={`
          p-1.5 rounded-lg border transition-colors
          ${showMinimap
            ? 'bg-blue-600/20 border-blue-500/40 text-blue-400'
            : 'bg-[#2d2d2d] border-[#404040] hover:bg-[#3a3a3a] hover:text-white'
          }
        `}
      >
        <Map size={13} />
      </button>

      {/* Reset code */}
      <button
        id="reset-code-btn"
        onClick={onReset}
        title="Reset to boilerplate"
        className="p-1.5 rounded-lg bg-[#2d2d2d] border border-[#404040] hover:bg-[#3a3a3a] hover:text-white transition-colors"
      >
        <RotateCcw size={13} />
      </button>

      {/* Settings icon (decorative / future use) */}
      <button
        id="settings-btn"
        title="Editor settings"
        className="p-1.5 rounded-lg bg-[#2d2d2d] border border-[#404040] hover:bg-[#3a3a3a] hover:text-white transition-colors"
      >
        <Settings size={13} />
      </button>

      {/* Fullscreen toggle */}
      <button
        id="fullscreen-toggle-btn"
        onClick={onFullscreenToggle}
        title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen editor'}
        className="p-1.5 rounded-lg bg-[#2d2d2d] border border-[#404040] hover:bg-[#3a3a3a] hover:text-white transition-colors"
      >
        {isFullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
      </button>
    </div>
  );
};

export default EditorSettingsBar;
