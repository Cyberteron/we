import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Send,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Bot,
  User,
  ChevronDown,
  Compass,
  MapPin,
  Play,
  FileText,
  Tag,
  ExternalLink
} from 'lucide-react';
import {
  analyzeUserQuery,
  ChatMessage,
  NavigationTarget,
  PackageSuggestion
} from '../utils/chatbotEngine';

interface AkaarChatbotProps {
  onOpenBriefUs: (options?: { service?: string; budget?: string; message?: string }) => void;
  onOpenReel?: () => void;
  onOpenOffices?: () => void;
  onOpenPartnerPage?: () => void;
}

const STORAGE_KEY = 'akaar_chatbot_messages_v2';

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'welcome-1',
    sender: 'bot',
    text: `Hello! Welcome to **Akaar Agency**. 👋

I’m your **AI Creative Consultant**. Ask me any question about our **Pune & Mumbai studios**, turnaround timelines, capabilities, or past client campaigns.

I will analyze your query, provide a simple answer, and guide you directly to the **related section on our website**. If relevant, I can also suggest a tailored package at the end when you're ready to brief us.`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    quickReplies: [
      'Show me past work (#work)',
      'Where are your studios?',
      'What services do you offer?',
      'Turnaround times & process'
    ]
  }
];

export const AkaarChatbot: React.FC<AkaarChatbotProps> = ({
  onOpenBriefUs,
  onOpenReel,
  onOpenOffices,
  onOpenPartnerPage,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [showTeaser, setShowTeaser] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Load chat messages from localStorage if available
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return INITIAL_MESSAGES;
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Listen for external trigger to open chat
  useEffect(() => {
    const handleOpenChat = () => {
      setIsOpen(true);
      setIsMinimized(false);
      setHasUnread(false);
      setShowTeaser(false);
    };
    window.addEventListener('open-akaar-chat', handleOpenChat);
    return () => window.removeEventListener('open-akaar-chat', handleOpenChat);
  }, []);

  // Auto-scroll to latest message
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized, isTyping]);

  // Persist messages
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // ignore
    }
  }, [messages]);

  // Auto-focus input when expanded
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setHasUnread(false);
      setShowTeaser(false);
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [isOpen, isMinimized]);

  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || inputValue).trim();
    if (!query || isTyping) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Advanced analysis with slight natural pacing
    setTimeout(() => {
      const result = analyzeUserQuery(query);

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: result.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        analysis: result.analysis,
        pageRedirect: result.pageRedirect,
        suggestedPackage: result.suggestedPackage,
        quickReplies: result.quickReplies
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);

      if (!isOpen) {
        setHasUnread(true);
      }
    }, 450);
  };

  const handleClearHistory = () => {
    setMessages(INITIAL_MESSAGES);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  // Dedicated handler to navigate ONLY to the related page/section
  const handleNavigateToRelated = (target: NavigationTarget) => {
    if (target.type === 'section') {
      const el = document.getElementById(target.sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Subtle visual highlight pulse on target section
        el.classList.add('ring-2', 'ring-[#F9CE00]', 'ring-offset-4', 'ring-offset-black');
        setTimeout(() => {
          el.classList.remove('ring-2', 'ring-[#F9CE00]', 'ring-offset-4', 'ring-offset-black');
        }, 2200);

        // Auto-minimize on mobile so user sees the section
        if (window.innerWidth < 768) {
          setIsMinimized(true);
        }
      }
    } else if (target.type === 'page') {
      if (target.page === 'partner') {
        onOpenPartnerPage?.();
        setIsMinimized(true);
      }
    } else if (target.type === 'modal') {
      if (target.modal === 'showreel') {
        onOpenReel?.();
      } else if (target.modal === 'offices') {
        onOpenOffices?.();
      } else if (target.modal === 'brief-us') {
        onOpenBriefUs({
          service: target.service,
          budget: target.budget,
          message: target.message
        });
      }
    }
  };

  // Only at the end: user chooses to lock in / inspect the suggested package
  const handleOpenPackageInBriefUs = (pkg: PackageSuggestion) => {
    onOpenBriefUs({
      service: pkg.service,
      budget: pkg.budgetTier,
      message: `Inquiry for ${pkg.title} (${pkg.priceRange}) initiated via Akaar AI Assistant.`
    });
  };

  return (
    <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end pointer-events-none">
      {/* Teaser Bubble (Dismissible) */}
      <AnimatePresence>
        {!isOpen && showTeaser && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="pointer-events-auto mb-3 max-w-xs bg-neutral-950 border border-neutral-800 text-white p-3.5 rounded-2xl shadow-2xl relative flex items-start gap-3 backdrop-blur-md"
          >
            <div className="w-8 h-8 rounded-full bg-[#F9CE00] flex items-center justify-center text-black shrink-0 font-syne font-black text-xs shadow-md">
              AI
            </div>
            <div className="text-xs space-y-1 pr-4">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-white font-syne">Akaar AI Assistant</span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              </div>
              <p className="text-neutral-400 text-[11px] leading-relaxed">
                Have questions about our work, studios, or turnaround times? Ask here for instant guidance!
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowTeaser(false);
              }}
              className="absolute top-2 right-2 text-neutral-500 hover:text-neutral-300 p-1"
              aria-label="Dismiss teaser"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expanded Chatbot Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2 }}
            className={`pointer-events-auto w-[92vw] sm:w-[420px] bg-[#0d0d0d] border border-neutral-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden mb-3 backdrop-blur-xl ${
              isMinimized ? 'h-16' : 'h-[600px] max-h-[82vh]'
            }`}
          >
            {/* Header */}
            <div className="p-4 bg-neutral-950 border-b border-neutral-800/90 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-9 h-9 rounded-xl bg-neutral-900 border border-[#F9CE00]/40 flex items-center justify-center text-[#F9CE00] shadow-sm">
                    <Bot className="w-4 h-4 text-[#F9CE00]" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-neutral-950" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs sm:text-sm font-syne font-black uppercase text-white tracking-wide">
                      Akaar AI Consultant
                    </h3>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#F9CE00]/10 text-[#F9CE00] border border-[#F9CE00]/20 font-semibold">
                      INTELLIGENT
                    </span>
                  </div>
                  <p className="text-[10px] text-neutral-400 font-mono flex items-center gap-1 mt-0.5">
                    <span>Pune & Mumbai Studios</span>
                    <span>•</span>
                    <span className="text-neutral-400">Contextual Guide</span>
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1 text-neutral-400">
                <button
                  onClick={handleClearHistory}
                  title="Reset conversation"
                  className="p-1.5 rounded-lg hover:bg-neutral-800 hover:text-white transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  title={isMinimized ? 'Expand' : 'Minimize'}
                  className="p-1.5 rounded-lg hover:bg-neutral-800 hover:text-white transition-colors"
                >
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${isMinimized ? 'rotate-180' : ''}`}
                  />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  title="Close chat"
                  className="p-1.5 rounded-lg hover:bg-neutral-800 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chatbot Body */}
            {!isMinimized && (
              <>
                {/* Messages Feed */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
                  {messages.map((msg) => {
                    const isBot = msg.sender === 'bot';
                    return (
                      <div
                        key={msg.id}
                        className={`flex gap-2.5 ${isBot ? 'justify-start' : 'justify-end'}`}
                      >
                        {isBot && (
                          <div className="w-7 h-7 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-[#F9CE00] shrink-0 mt-0.5">
                            <Bot className="w-3.5 h-3.5" />
                          </div>
                        )}

                        <div className={`max-w-[88%] space-y-2.5 ${isBot ? 'text-neutral-200' : 'text-black'}`}>
                          {/* Query Analysis Header Tag (Only for bot messages with analysis) */}
                          {isBot && msg.analysis && (
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-[10px] text-neutral-400 font-mono">
                              <span>
                                Analyzed:{' '}
                                <strong className="text-white font-medium">
                                  {msg.analysis.detectedTopic}
                                </strong>
                              </span>
                              <span>•</span>
                              <span className="text-[#F9CE00]">{msg.analysis.intent}</span>
                            </div>
                          )}

                          {/* Chat Bubble with Simple Form Answer */}
                          <div
                            className={`p-3.5 rounded-2xl leading-relaxed ${
                              isBot
                                ? 'bg-neutral-900 border border-neutral-800/90 text-neutral-200 shadow-sm'
                                : 'bg-[#F9CE00] text-black font-medium ml-auto shadow-md rounded-br-none'
                            }`}
                          >
                            <div className="whitespace-pre-wrap text-xs leading-relaxed space-y-2">
                              {renderFormattedText(msg.text)}
                            </div>
                            <div
                              className={`text-[9px] mt-2 font-mono ${
                                isBot ? 'text-neutral-500' : 'text-black/60'
                              }`}
                            >
                              {msg.timestamp}
                            </div>
                          </div>

                          {/* Primary Contextual Action: Redirect for Related Page ONLY */}
                          {msg.pageRedirect && (
                            <motion.button
                              type="button"
                              initial={{ opacity: 0, y: 4 }}
                              animate={{ opacity: 1, y: 0 }}
                              onClick={() => handleNavigateToRelated(msg.pageRedirect!)}
                              className="w-full py-2.5 px-3.5 rounded-xl bg-neutral-950 border border-neutral-700 hover:border-[#F9CE00] text-white hover:text-[#F9CE00] transition-all flex items-center justify-between text-left group shadow-sm"
                            >
                              <div className="flex items-center gap-2 text-xs font-syne font-bold">
                                <Compass className="w-3.5 h-3.5 text-[#F9CE00] group-hover:rotate-45 transition-transform" />
                                <span>{msg.pageRedirect.label}</span>
                              </div>
                              <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-[#F9CE00] group-hover:translate-x-0.5 transition-transform" />
                            </motion.button>
                          )}

                          {/* ONLY SUGGEST PACKAGE AT THE VERY END (Refined & Contextual) */}
                          {msg.suggestedPackage && (
                            <motion.div
                              initial={{ opacity: 0, y: 6 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="p-3.5 rounded-2xl bg-neutral-950/90 border border-neutral-800 text-white space-y-2"
                            >
                              <div className="flex items-center justify-between text-[10px] font-mono">
                                <span className="text-neutral-400 flex items-center gap-1">
                                  <Tag className="w-3 h-3 text-[#F9CE00]" />
                                  Suggested Scope:
                                </span>
                                <span className="text-[#F9CE00] font-bold">
                                  {msg.suggestedPackage.priceRange}
                                </span>
                              </div>

                              <div className="space-y-1">
                                <h4 className="font-syne font-bold text-white text-xs">
                                  {msg.suggestedPackage.title}
                                </h4>
                                <p className="text-[11px] text-neutral-400 leading-snug">
                                  {msg.suggestedPackage.summary}
                                </p>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleOpenPackageInBriefUs(msg.suggestedPackage!)}
                                className="w-full mt-1 py-2 px-3 rounded-xl bg-[#F9CE00] text-black font-syne font-black text-[11px] uppercase tracking-wider hover:bg-white transition-all flex items-center justify-center gap-1.5 shadow"
                              >
                                <span>
                                  {msg.suggestedPackage.ctaLabel || 'Lock In Package (Give Akaar Tab)'}
                                </span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            </motion.div>
                          )}

                          {/* Quick Replies chips */}
                          {msg.quickReplies && msg.quickReplies.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {msg.quickReplies.map((reply, i) => (
                                <button
                                  key={i}
                                  type="button"
                                  onClick={() => handleSendMessage(reply)}
                                  className="px-2.5 py-1 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 text-neutral-300 hover:text-white text-[10px] font-mono transition-colors"
                                >
                                  {reply}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        {!isBot && (
                          <div className="w-7 h-7 rounded-lg bg-[#F9CE00] text-black flex items-center justify-center shrink-0 mt-0.5">
                            <User className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Animated Typing Indicator */}
                  {isTyping && (
                    <div className="flex gap-2.5 justify-start">
                      <div className="w-7 h-7 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-[#F9CE00] shrink-0 mt-0.5">
                        <Bot className="w-3.5 h-3.5" />
                      </div>
                      <div className="p-3 rounded-2xl bg-neutral-900 border border-neutral-800 text-neutral-400 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#F9CE00] animate-bounce" />
                        <span
                          className="w-1.5 h-1.5 rounded-full bg-[#F9CE00] animate-bounce"
                          style={{ animationDelay: '0.15s' }}
                        />
                        <span
                          className="w-1.5 h-1.5 rounded-full bg-[#F9CE00] animate-bounce"
                          style={{ animationDelay: '0.3s' }}
                        />
                        <span className="text-[10px] font-mono ml-2 text-neutral-500">
                          Analyzing query & finding relevant section...
                        </span>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-3 bg-neutral-950 border-t border-neutral-800/90 shrink-0">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendMessage();
                    }}
                    className="flex items-center gap-2"
                  >
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Ask about studios, past work, turnaround, or services..."
                      className="flex-1 bg-neutral-900 border border-neutral-800 rounded-full px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#F9CE00] transition-colors"
                    />
                    <button
                      type="submit"
                      disabled={!inputValue.trim() || isTyping}
                      className="w-9 h-9 rounded-full bg-[#F9CE00] text-black flex items-center justify-center hover:bg-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0 shadow-md"
                      title="Send message"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                  <div className="mt-2 flex items-center justify-between text-[10px] text-neutral-500 px-1 font-mono">
                    <span>💡 Ask anything, get redirected to related page</span>
                    <button
                      type="button"
                      onClick={() =>
                        handleNavigateToRelated({
                          type: 'modal',
                          modal: 'brief-us',
                          service: 'Creative Strategy',
                          label: 'Give Akaar Brief Us'
                        })
                      }
                      className="text-neutral-400 hover:text-[#F9CE00] underline"
                    >
                      Give Akaar Tab
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Launcher Button */}
      <motion.button
        type="button"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          setIsOpen(!isOpen);
          setIsMinimized(false);
          setHasUnread(false);
          setShowTeaser(false);
        }}
        className="pointer-events-auto relative group flex items-center gap-3 px-4 py-3 rounded-full bg-neutral-950 border-2 border-[#F9CE00] text-white shadow-2xl hover:border-white transition-all"
        aria-label="Open Akaar Chatbot"
      >
        <div className="w-7 h-7 rounded-full bg-[#F9CE00] flex items-center justify-center text-black font-syne font-black text-xs shadow-md">
          {isOpen ? <X className="w-4 h-4" /> : <Bot className="w-4 h-4 text-black" />}
        </div>
        <div className="text-left">
          <div className="text-xs font-syne font-black uppercase tracking-wider text-white group-hover:text-[#F9CE00] transition-colors flex items-center gap-1.5">
            <span>Akaar Assistant</span>
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          </div>
          <div className="text-[10px] text-neutral-400 font-mono">
            {isOpen ? 'Close Assistant' : 'Query Analysis & Guide'}
          </div>
        </div>

        {/* Unread Alert Indicator */}
        {hasUnread && !isOpen && (
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-rose-500 border-2 border-black animate-ping" />
        )}
      </motion.button>
    </div>
  );
};

/**
 * Clean markdown formatter for bolding, bullet points and numbered lists
 */
function renderFormattedText(content: string) {
  const lines = content.split('\n');
  return lines.map((line, idx) => {
    // Bullet point
    if (line.startsWith('* ') || line.startsWith('- ') || line.startsWith('• ')) {
      const cleanLine = line.replace(/^[\*\-•]\s+/, '');
      return (
        <div key={idx} className="flex items-start gap-1.5 pl-1">
          <span className="text-[#F9CE00] font-bold">•</span>
          <span>{renderInlineStyles(cleanLine)}</span>
        </div>
      );
    }
    // Numbered list
    if (/^\d+\.\s+/.test(line)) {
      return (
        <div key={idx} className="flex items-start gap-1.5 pl-1">
          <span className="text-[#F9CE00] font-mono text-[10px] font-bold">
            {line.match(/^\d+\./)?.[0]}
          </span>
          <span>{renderInlineStyles(line.replace(/^\d+\.\s+/, ''))}</span>
        </div>
      );
    }
    // Blank line
    if (!line.trim()) {
      return <div key={idx} className="h-1" />;
    }
    return <p key={idx}>{renderInlineStyles(line)}</p>;
  });
}

function renderInlineStyles(text: string) {
  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="text-white font-bold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={i} className="px-1.5 py-0.5 rounded bg-neutral-800 text-[#F9CE00] font-mono text-[11px]">
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}
