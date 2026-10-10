import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sliders, Eye, ChevronUp, ChevronDown, Video, Plus, Handshake, Users, Image as ImageIcon, Palette, Sparkles } from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { LiveEditorTab } from './LiveEditorDrawer';

interface AdminFloatingShieldProps {
  onToggleEditor: () => void;
  isEditorOpen: boolean;
  onOpenEditorWithTab?: (tab: LiveEditorTab) => void;
}

export const AdminFloatingShield: React.FC<AdminFloatingShieldProps> = ({
  onToggleEditor,
  isEditorOpen,
  onOpenEditorWithTab,
}) => {
  const { isAdmin, disableAdmin } = useAdminAuth();
  const [isMinimized, setIsMinimized] = useState(false);

  // When not in admin edit mode, completely hidden from viewers
  if (!isAdmin) return null;

  return (
    <div className="fixed bottom-6 left-6 z-40">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="bg-neutral-950/95 border border-[#F9CE00]/40 rounded-2xl shadow-2xl shadow-black/80 backdrop-blur-md p-2.5 flex items-center gap-2 text-white"
      >
        {/* Status Indicator */}
        <div className="flex items-center gap-2 px-2 py-1 rounded-xl bg-neutral-900 border border-neutral-800">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400">
            Studio Edit Mode
          </span>
        </div>

        {!isMinimized && (
          <div className="flex items-center gap-1.5">
            {/* Quick Logo & Image */}
            <button
              onClick={() => onOpenEditorWithTab?.('branding')}
              id="admin-quick-add-logo-btn"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-neutral-900 hover:bg-[#F9CE00] hover:text-black border border-neutral-800 text-neutral-200 text-xs font-syne font-bold transition-all"
              title="Add agency logo & hero banner image"
            >
              <Palette className="w-3.5 h-3.5 text-[#F9CE00] group-hover:text-black" />
              <span>+ Logo</span>
            </button>

            {/* Quick Media Gallery */}
            <button
              onClick={() => onOpenEditorWithTab?.('media')}
              id="admin-quick-add-media-btn"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-neutral-900 hover:bg-[#F9CE00] hover:text-black border border-neutral-800 text-neutral-200 text-xs font-syne font-bold transition-all"
              title="Upload & manage portfolio gallery images"
            >
              <ImageIcon className="w-3.5 h-3.5 text-[#F9CE00] group-hover:text-black" />
              <span>+ Media</span>
            </button>

            {/* Quick Add Video */}
            <button
              onClick={() => onOpenEditorWithTab?.('cases')}
              id="admin-quick-add-video-btn"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-neutral-900 hover:bg-[#F9CE00] hover:text-black border border-neutral-800 text-neutral-200 text-xs font-syne font-bold transition-all"
              title="Add video to portfolio"
            >
              <Video className="w-3.5 h-3.5 text-[#F9CE00] group-hover:text-black" />
              <span>+ Video</span>
            </button>

            {/* Quick Add Brand */}
            <button
              onClick={() => onOpenEditorWithTab?.('clients')}
              id="admin-quick-add-brand-btn"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-neutral-900 hover:bg-[#F9CE00] hover:text-black border border-neutral-800 text-neutral-200 text-xs font-syne font-bold transition-all"
              title="Add brand partner"
            >
              <Handshake className="w-3.5 h-3.5 text-[#F9CE00] group-hover:text-black" />
              <span>+ Brand</span>
            </button>

            {/* Quick Add Influencer */}
            <button
              onClick={() => onOpenEditorWithTab?.('influencers')}
              id="admin-quick-add-inf-btn"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-neutral-900 hover:bg-[#F9CE00] hover:text-black border border-neutral-800 text-neutral-200 text-xs font-syne font-bold transition-all"
              title="Add creator / influencer"
            >
              <Users className="w-3.5 h-3.5 text-[#F9CE00] group-hover:text-black" />
              <span>+ Influencer</span>
            </button>

            {/* Logo Theme Studio */}
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('open-logo-theme-studio'))}
              id="admin-logo-studio-btn"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-neutral-900 hover:bg-[#F9CE00] hover:text-black border border-neutral-800 text-neutral-200 text-xs font-syne font-bold transition-all group cursor-pointer"
              title="Open Akaar Logo Theme Studio"
            >
              <Palette className="w-3.5 h-3.5 text-[#F9CE00] group-hover:text-black transition-colors" />
              <span>Theme Logo</span>
            </button>

            {/* Replay Start Animation */}
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('replay-start-animation'))}
              id="admin-replay-start-animation-btn"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-neutral-900 hover:bg-[#F9CE00] hover:text-black border border-neutral-800 text-neutral-200 text-xs font-syne font-bold transition-all"
              title="Replay website start animation with logo"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#F9CE00] group-hover:text-black" />
              <span>Intro</span>
            </button>

            {/* Toggle Live Editor */}
            <button
              onClick={onToggleEditor}
              id="admin-floating-toggle-editor-btn"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-syne font-bold transition-all ${
                isEditorOpen
                  ? 'bg-[#F9CE00] text-black shadow-md shadow-[#F9CE00]/20'
                  : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-800'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>{isEditorOpen ? 'Close' : 'Editor'}</span>
            </button>

            {/* Switch to Viewer Mode (No Password) */}
            <button
              onClick={disableAdmin}
              id="admin-floating-view-as-visitor-btn"
              title="Switch to Public Viewer View (Editing disabled)"
              className="flex items-center gap-1 px-2 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-white text-xs font-syne font-bold transition-colors"
            >
              <Eye className="w-3.5 h-3.5 text-[#F9CE00]" />
              <span className="hidden md:inline">View as Viewer</span>
            </button>
          </div>
        )}

        {/* Minimize / Maximize toggle */}
        <button
          onClick={() => setIsMinimized(!isMinimized)}
          className="p-1 text-neutral-400 hover:text-white"
          title={isMinimized ? 'Expand' : 'Collapse'}
        >
          {isMinimized ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </motion.div>
    </div>
  );
};
