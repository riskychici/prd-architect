import { useEffect, useRef, useState, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWandMagicSparkles, faSpinner, faTrash, faRobot, faArrowDown, faCircleQuestion, faLightbulb } from '@fortawesome/free-solid-svg-icons';
import ReactMarkdown from 'react-markdown';
import { usePrdStore } from '../../store/usePrdStore';
import { useToast } from '../../hooks/useToast';

const CHARS_PER_MS = 0.2;

const BRIEF_EXAMPLES = [
  'Aplikasi kasir untuk warung kopi',
  'Sistem inventaris gudang UMKM',
  'Aplikasi booking barbershop',
  'Dashboard monitoring penjualan online shop',
];

export default function AiAnalysisCard() {
  const analyzeWithAi = usePrdStore((s) => s.analyzeWithAi);
  const applyAiDraft = usePrdStore((s) => s.applyAiDraft);
  const rawAiFeedback = usePrdStore((s) => s.aiFeedback);
  const aiDraft = usePrdStore((s) => s.aiDraft);
  const isAnalyzing = usePrdStore((s) => s.isAnalyzing);
  const aiError = usePrdStore((s) => s.aiError);
  const clearAiFeedback = usePrdStore((s) => s.clearAiFeedback);

  const isPrdEmpty = usePrdStore((s) => {
    const f = s.fields;
    return !(f.projectName || '').trim() &&
      !(f.problemStatement || '').trim() &&
      !(f.productGoal || '').trim() &&
      s.features.length === 0;
  });

  const showToast = useToast();

  const feedbackBoxRef = useRef(null);
  const briefRef = useRef(null);
  const typewriterStartRef = useRef(null);
  const userScrolledUpRef = useRef(false);
  const rafScrollRef = useRef(null);

  const [displayedText, setDisplayedText] = useState('');
  const [isTypingFinished, setIsTypingFinished] = useState(true);
  const [showJumpButton, setShowJumpButton] = useState(false);
  const [briefText, setBriefText] = useState('');

  // ============================================================
  // TYPEWRITER ENGINE (timestamp-based, tetap jalan di background)
  // ============================================================
  useEffect(() => {
    if (!rawAiFeedback) {
      setDisplayedText('');
      setIsTypingFinished(true);
      typewriterStartRef.current = null;
      return;
    }

    if (typewriterStartRef.current === null) {
      typewriterStartRef.current = performance.now();
    }

    setIsTypingFinished(false);

    const timer = setInterval(() => {
      const elapsed = performance.now() - typewriterStartRef.current;
      const expectedChars = Math.floor(elapsed * CHARS_PER_MS);
      const targetLength = Math.min(expectedChars, rawAiFeedback.length);

      setDisplayedText((prev) => {
        if (prev.length === targetLength) return prev;
        return rawAiFeedback.slice(0, targetLength);
      });

      if (targetLength >= rawAiFeedback.length && !isAnalyzing) {
        setIsTypingFinished(true);
        clearInterval(timer);
      }
    }, 15);

    return () => clearInterval(timer);
  }, [rawAiFeedback, isAnalyzing]);

  // ============================================================
  // AUTO-SCROLL: instant, hanya jika user di bottom
  // ============================================================
  useEffect(() => {
    if ((isAnalyzing || !isTypingFinished) && feedbackBoxRef.current && !userScrolledUpRef.current) {
      if (rafScrollRef.current) cancelAnimationFrame(rafScrollRef.current);
      rafScrollRef.current = requestAnimationFrame(() => {
        const el = feedbackBoxRef.current;
        if (el && !userScrolledUpRef.current) {
          el.scrollTop = el.scrollHeight;
        }
      });
    }
  }, [displayedText, isAnalyzing, isTypingFinished]);

  useEffect(() => {
    return () => {
      if (rafScrollRef.current) cancelAnimationFrame(rafScrollRef.current);
    };
  }, []);

  const handleUserScrollIntent = useCallback(() => {
    if (!userScrolledUpRef.current) {
      userScrolledUpRef.current = true;
      setShowJumpButton(true);
    }
  }, []);

  const handleScroll = useCallback(() => {
    const el = feedbackBoxRef.current;
    if (!el) return;
    const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    if (distFromBottom < 15) {
      if (userScrolledUpRef.current) {
        userScrolledUpRef.current = false;
        setShowJumpButton(false);
      }
    } else {
      if (!userScrolledUpRef.current) {
        userScrolledUpRef.current = true;
        setShowJumpButton(true);
      }
    }
  }, []);

  useEffect(() => {
    const el = feedbackBoxRef.current;
    if (!el) return;
    el.addEventListener('wheel', handleUserScrollIntent, { passive: true });
    el.addEventListener('touchmove', handleUserScrollIntent, { passive: true });
    el.addEventListener('pointerdown', handleUserScrollIntent, { passive: true });
    return () => {
      el.removeEventListener('wheel', handleUserScrollIntent);
      el.removeEventListener('touchmove', handleUserScrollIntent);
      el.removeEventListener('pointerdown', handleUserScrollIntent);
    };
  }, [handleUserScrollIntent, displayedText]);

  useEffect(() => {
    if (isAnalyzing && displayedText === '') {
      userScrolledUpRef.current = false;
      setShowJumpButton(false);
    }
  }, [isAnalyzing, displayedText]);

  const jumpToBottom = useCallback(() => {
    const el = feedbackBoxRef.current;
    if (!el) return;
    userScrolledUpRef.current = false;
    setShowJumpButton(false);
    el.scrollTop = el.scrollHeight;
  }, []);

  // ============================================================
  // ANALISIS: jika PRD kosong dan deskripsi kosong, arahkan ke brief
  // ============================================================
  const handleAnalyze = async () => {
    if (isPrdEmpty && !briefText.trim()) {
      showToast('Ceritakan dulu aplikasi yang ingin kamu buat', 'info');
      if (briefRef.current) briefRef.current.focus();
      return;
    }
    try {
      setDisplayedText('');
      userScrolledUpRef.current = false;
      setShowJumpButton(false);
      typewriterStartRef.current = null;
      await analyzeWithAi(briefText.trim() || null);
      showToast('Analisis AI selesai!', 'success');
    } catch (err) {
      showToast(err.message || 'Gagal menganalisis PRD', 'error');
    }
  };

  const handleApplyDraft = () => {
    const ok = applyAiDraft();
    if (ok) {
      showToast('Saran AI diterapkan ✓', 'success');
    } else {
      showToast('Tidak ada draf AI', 'info');
    }
  };

  const isBusy = isAnalyzing || !isTypingFinished;
  const hasDraft = !!aiDraft;

  return (
    <div className="bg-gradient-to-br from-purple-950/40 via-slate-900 to-indigo-950/40 p-4 md:p-5 rounded-xl border border-purple-500/40 shadow-lg space-y-4">

      {/* HEADER CARD: vertikal di mobile, horizontal di desktop */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
        <div className="flex items-start space-x-2.5 min-w-0">
          <FontAwesomeIcon icon={faRobot} className="text-purple-400 text-base mt-1 shrink-0" />
          <div className="min-w-0">
            <h2 className="text-sm font-bold text-purple-300 uppercase tracking-wider flex items-center gap-x-2 gap-y-1 flex-wrap">
              <span>Analisis PRD Berbasis AI</span>
              <span className="text-[9px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-1.5 py-0.5 rounded font-mono whitespace-nowrap">
                Gemini Flash Lite
              </span>
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">Evaluasi kelengkapan, risiko teknis, & perbaikan spesifikasi</p>
          </div>
        </div>

        <button
          onClick={handleAnalyze}
          disabled={isBusy}
          className="flex items-center justify-center space-x-1.5 px-3 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-lg shadow-md transition-all duration-200 disabled:opacity-50 w-full md:w-auto md:shrink-0 cursor-pointer"
        >
          {isBusy ? (
            <>
              <FontAwesomeIcon icon={faSpinner} className="animate-spin text-xs" />
              <span className="whitespace-nowrap">{isAnalyzing && !displayedText ? 'Memproses...' : 'Menulis...'}</span>
            </>
          ) : (
            <>
              <FontAwesomeIcon icon={faWandMagicSparkles} className="text-amber-300 text-xs" />
              <span className="whitespace-nowrap">Analisis PRD</span>
            </>
          )}
        </button>
      </div>

      {/* EMPTY STATE: muncul otomatis saat PRD masih kosong */}
      {isPrdEmpty && (
        <div className="space-y-2.5 pt-3 border-t border-purple-900/40">
          <div className="flex items-start gap-2">
            <FontAwesomeIcon icon={faCircleQuestion} className="text-amber-300 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-purple-200">PRD-mu masih kosong. Aplikasi seperti apa yang ingin kamu buat?</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Ceritakan singkat, AI akan menyusun analisis & draf PRD lengkap dari deskripsimu.</p>
            </div>
          </div>
          <textarea
            ref={briefRef}
            value={briefText}
            onChange={function (e) { setBriefText(e.target.value); }}
            rows="3"
            placeholder="Contoh: Aplikasi kasir untuk warung kopi dengan laporan penjualan harian dan manajemen stok bahan baku..."
            className="w-full bg-slate-950/80 border border-purple-700/50 rounded-lg p-3 text-xs text-slate-100 focus:border-purple-500 focus:outline-none resize-none"
          />
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] text-slate-500 inline-flex items-center gap-1">
              <FontAwesomeIcon icon={faLightbulb} className="text-amber-400" />
              Contoh:
            </span>
            {BRIEF_EXAMPLES.map(function (ex) {
              return (
                <button
                  key={ex}
                  onClick={function () { setBriefText(ex); }}
                  className="text-[10px] px-2 py-1 rounded-full border border-purple-700/50 text-purple-300 hover:bg-purple-600/20 transition cursor-pointer"
                >
                  {ex}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {aiError && (
        <div className="p-3 bg-rose-950/50 border border-rose-800 rounded-lg text-xs text-rose-300">
          ⚠️ {aiError}
        </div>
      )}

      {(displayedText || isAnalyzing) && (
        <div className="space-y-3 pt-1 border-t border-purple-900/40">

          {/* BARIS AKSI: vertikal di mobile, horizontal di desktop */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-2 flex-wrap min-w-0">
              Hasil Rekomendasi AI:
              {isBusy && (
                <span className="inline-flex items-center gap-1.5 text-[11px] font-normal text-purple-300">
                  <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping shrink-0" />
                  {displayedText ? 'Sedang mengetik masukan...' : 'AI sedang membaca dokumen PRD...'}
                </span>
              )}
            </span>

            <div className="flex items-center gap-2 flex-wrap">
              {!isBusy && (
                <button
                  onClick={handleApplyDraft}
                  disabled={!hasDraft}
                  className={`text-xs font-semibold px-2.5 py-1.5 rounded transition-all duration-200 inline-flex items-center gap-1.5 shadow-md whitespace-nowrap ${
                    hasDraft
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer hover:shadow-emerald-500/20'
                      : 'bg-slate-700 text-slate-400 cursor-not-allowed opacity-60'
                  }`}
                  title={hasDraft ? 'Isi otomatis bagian form dengan saran AI' : 'Tidak ada draf JSON dari AI'}
                >
                  <FontAwesomeIcon icon={faWandMagicSparkles} />
                  <span>Terapkan ke Form</span>
                </button>
              )}
              {!isBusy && (
                <button
                  onClick={clearAiFeedback}
                  className="text-[10px] text-slate-400 hover:text-rose-400 transition inline-flex items-center gap-1 cursor-pointer whitespace-nowrap px-1 py-1.5"
                  title="Hapus hasil analisis"
                >
                  <FontAwesomeIcon icon={faTrash} />
                  <span>Hapus</span>
                </button>
              )}
            </div>
          </div>

          <div className="relative">
            <div
              ref={feedbackBoxRef}
              onScroll={handleScroll}
              className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-lg text-xs text-slate-200 space-y-2 font-sans leading-relaxed max-h-96 overflow-y-auto relative min-h-[90px]"
              style={{ overscrollBehavior: 'contain' }}
            >
              {isAnalyzing && !displayedText ? (
                <div className="space-y-2.5 animate-pulse py-1">
                  <div className="h-3.5 bg-purple-900/40 rounded w-1/3" />
                  <div className="h-3 bg-slate-800/80 rounded w-full" />
                  <div className="h-3 bg-slate-800/80 rounded w-5/6" />
                  <div className="h-3 bg-slate-800/80 rounded w-4/6" />
                  <div className="flex items-center gap-2 pt-1">
                    <FontAwesomeIcon icon={faSpinner} className="animate-spin text-purple-400 text-xs" />
                    <span className="text-[11px] text-purple-300/80 font-mono">Menyiapkan ulasan spesifikasi produk...</span>
                  </div>
                </div>
              ) : (
                <>
                  <ReactMarkdown
                    components={{
                      h1: ({node, ...props}) => <h1 className="font-extrabold text-base text-purple-200 border-b border-purple-800/60 pb-1 mt-4 mb-2 tracking-wide uppercase" {...props} />,
                      h2: ({node, ...props}) => <h2 className="font-bold text-sm text-purple-300 mt-4 mb-2 flex items-center gap-1.5" {...props} />,
                      h3: ({node, ...props}) => <h3 className="font-semibold text-xs text-indigo-300 mt-3 mb-1 pl-2 border-l-2 border-indigo-500/60" {...props} />,
                      h4: ({node, ...props}) => <h4 className="font-medium text-xs text-slate-300 mt-2 mb-1 italic" {...props} />,
                      p: ({node, ...props}) => <p className="text-xs text-slate-200 leading-relaxed my-1" {...props} />,
                      ul: ({node, ...props}) => <ul className="list-disc pl-5 space-y-1 my-1.5 text-slate-300" {...props} />,
                      ol: ({node, ...props}) => <ol className="list-decimal pl-5 space-y-1 my-1.5 text-slate-300" {...props} />,
                      li: ({node, ...props}) => <li className="text-slate-300 text-xs" {...props} />,
                      strong: ({node, ...props}) => <strong className="font-bold text-white" {...props} />,
                      code: ({node, ...props}) => <code className="bg-slate-800 text-amber-300 px-1 py-0.5 rounded font-mono text-[11px]" {...props} />,
                      hr: ({node, ...props}) => <hr className="border-purple-900/50 my-3" {...props} />,
                    }}
                  >
                    {displayedText}
                  </ReactMarkdown>
                  {isBusy && (
                    <span className="inline-block w-1.5 h-4 bg-purple-400 animate-pulse ml-1 align-middle" />
                  )}
                </>
              )}
            </div>

            {/* Tombol "Ikuti AI" muncul saat user scroll ke atas */}
            {showJumpButton && !isTypingFinished && (
              <button
                onClick={jumpToBottom}
                className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-semibold rounded-full shadow-lg transition-all duration-200 cursor-pointer z-10 whitespace-nowrap"
                title="Kembali ke bawah dan lanjut auto-scroll"
              >
                <FontAwesomeIcon icon={faArrowDown} />
                <span>Ikuti AI</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}