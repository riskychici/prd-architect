import { useEffect, useRef, useState, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWandMagicSparkles, faSpinner, faTrash, faRobot } from '@fortawesome/free-solid-svg-icons';
import ReactMarkdown from 'react-markdown';
import { usePrdStore } from '../../store/usePrdStore';
import { useToast } from '../../hooks/useToast';
import { useAutoSave } from '../../hooks/useAutoSave';
import { useAutoResize } from '../../hooks/useAutoResize';
import ModeBanner from './ModeBanner';
import ExtrasPicker from './ExtrasPicker';
import ProjectInfo from './sections/ProjectInfo';
import ProblemGoal from './sections/ProblemGoal';
import PersonaSection from './sections/PersonaSection';
import BrandingSection from './sections/BrandingSection';
import RolesSection from './sections/RolesSection';
import FeaturesList from './sections/FeaturesList';
import AcSection from './sections/AcSection';
import TechStack from './sections/TechStack';
import SchemaSection from './sections/SchemaSection';
import NfrSection from './sections/NfrSection';
import OutOfScope from './sections/OutOfScope';

// ============================================================
// Kecepatan animasi: 3 karakter per 15ms = 0.2 char/ms
// Dengan timestamp-based, meskipun browser throttle interval
// di background tab, posisi karakter tetap dihitung berdasarkan
// waktu yang sudah berlalu, bukan jumlah tick.
// ============================================================
const CHARS_PER_MS = 0.2;

function AiAnalysisCard() {
  const analyzeWithAi = usePrdStore((s) => s.analyzeWithAi);
  const applyAiDraft = usePrdStore((s) => s.applyAiDraft);
  const rawAiFeedback = usePrdStore((s) => s.aiFeedback);
  const aiDraft = usePrdStore((s) => s.aiDraft);
  const isAnalyzing = usePrdStore((s) => s.isAnalyzing);
  const aiError = usePrdStore((s) => s.aiError);
  const clearAiFeedback = usePrdStore((s) => s.clearAiFeedback);
  const showToast = useToast();

  const feedbackBoxRef = useRef(null);
  const typewriterStartRef = useRef(null);

  const [displayedText, setDisplayedText] = useState('');
  const [isTypingFinished, setIsTypingFinished] = useState(true);
  const [isUserScrolledUp, setIsUserScrolledUp] = useState(false);

  // ============================================================
  // TIMESTAMP-BASED TYPEWRITER ENGINE
  //
  // Cara kerja:
  // 1. Catat waktu mulai saat streaming pertama kali menghasilkan teks
  // 2. Setiap tick interval, hitung: elapsed * CHARS_PER_MS = posisi karakter
  // 3. Meskipun browser throttle interval di background (1x/detik),
  //    begitu tick terjadi, posisi langsung "lompat" sesuai waktu.
  // 4. Saat user kembali ke tab, animasi lanjut smooth dari posisi terakhir.
  // ============================================================
  useEffect(() => {
    if (!rawAiFeedback) {
      setDisplayedText('');
      setIsTypingFinished(true);
      typewriterStartRef.current = null;
      return;
    }

    // Set start time hanya sekali per sesi analisis
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
  // AUTO-SCROLL: hanya aktif jika user berada di bagian bawah
  // ============================================================
  useEffect(() => {
    if ((isAnalyzing || !isTypingFinished) && feedbackBoxRef.current && !isUserScrolledUp) {
      feedbackBoxRef.current.scrollTo({
        top: feedbackBoxRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [displayedText, isAnalyzing, isTypingFinished, isUserScrolledUp]);

  const handleScroll = useCallback(() => {
    const el = feedbackBoxRef.current;
    if (!el) return;
    const threshold = 50;
    const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    setIsUserScrolledUp(distFromBottom > threshold);
  }, []);

  const handleAnalyze = async () => {
    try {
      setDisplayedText('');
      setIsUserScrolledUp(false);
      typewriterStartRef.current = null;
      await analyzeWithAi();
      showToast('Analisis AI selesai!', 'success');
    } catch (err) {
      showToast(err.message || 'Gagal menganalisis PRD', 'error');
    }
  };

  const handleApplyDraft = () => {
    const ok = applyAiDraft();
    if (ok) {
      showToast('Saran AI diterapkan', 'success');
    } else {
      showToast('Tidak ada draf AI', 'info');
    }
  };

  const isBusy = isAnalyzing || !isTypingFinished;
  const hasDraft = !!aiDraft;

  return (
    <div className="bg-gradient-to-br from-purple-950/40 via-slate-900 to-indigo-950/40 p-5 rounded-xl border border-purple-500/40 shadow-lg space-y-4">
      <div className="flex justify-between items-center gap-2">
        <div className="flex items-center space-x-2">
          <FontAwesomeIcon icon={faRobot} className="text-purple-400 text-base" />
          <div>
            <h2 className="text-sm font-bold text-purple-300 uppercase tracking-wider flex items-center gap-2">
              Analisis PRD Berbasis AI
              <span className="text-[9px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-1.5 py-0.5 rounded font-mono">
                Gemini Flash Lite
              </span>
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">Evaluasi kelengkapan, risiko teknis, & perbaikan spesifikasi</p>
          </div>
        </div>
        <button
          onClick={handleAnalyze}
          disabled={isBusy}
          className="flex items-center space-x-1.5 px-3 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-lg shadow-md transition-all duration-200 disabled:opacity-50 shrink-0 cursor-pointer"
        >
          {isBusy ? (
            <>
              <FontAwesomeIcon icon={faSpinner} className="animate-spin text-xs" />
              <span>{isAnalyzing && !displayedText ? 'Memproses...' : 'Menulis...'}</span>
            </>
          ) : (
            <>
              <FontAwesomeIcon icon={faWandMagicSparkles} className="text-amber-300 text-xs" />
              <span>Analisis PRD</span>
            </>
          )}
        </button>
      </div>

      {aiError && (
        <div className="p-3 bg-rose-950/50 border border-rose-800 rounded-lg text-xs text-rose-300">
          ⚠️ {aiError}
        </div>
      )}

      {(displayedText || isAnalyzing) && (
        <div className="space-y-3 pt-1 border-t border-purple-900/40">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-2">
              Hasil Rekomendasi AI:
              {isBusy && (
                <span className="inline-flex items-center gap-1.5 text-[11px] font-normal text-purple-300">
                  <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
                  {displayedText ? 'Sedang mengetik masukan...' : 'AI sedang membaca dokumen PRD...'}
                </span>
              )}
            </span>
            <div className="flex items-center gap-2">
              {!isBusy && (
                <button
                  onClick={handleApplyDraft}
                  disabled={!hasDraft}
                  className={`text-xs font-semibold px-2.5 py-1 rounded transition-all duration-200 flex items-center gap-1 shadow-md ${
                    hasDraft
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer hover:shadow-emerald-500/20'
                      : 'bg-slate-700 text-slate-400 cursor-not-allowed opacity-60'
                  }`}
                  title={hasDraft ? 'Isi otomatis bagian form dengan saran AI' : 'Tidak ada draf JSON dari AI'}
                >
                  <FontAwesomeIcon icon={faWandMagicSparkles} /> Terapkan ke Form
                </button>
              )}
              {!isBusy && (
                <button
                  onClick={clearAiFeedback}
                  className="text-[10px] text-slate-400 hover:text-rose-400 transition flex items-center gap-1 cursor-pointer"
                  title="Hapus hasil analisis"
                >
                  <FontAwesomeIcon icon={faTrash} /> Hapus
                </button>
              )}
            </div>
          </div>

          {/* Info saat user scroll manual */}
          {isUserScrolledUp && !isTypingFinished && (
            <div className="text-[10px] text-purple-300 bg-purple-950/50 border border-purple-800/50 rounded px-2 py-1 flex items-center gap-1.5">
              <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
              AI masih mengetik di bawah. Scroll ke bawah untuk lanjut auto-scroll.
            </div>
          )}

          <div
            ref={feedbackBoxRef}
            onScroll={handleScroll}
            className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-lg text-xs text-slate-200 space-y-2 font-sans leading-relaxed max-h-96 overflow-y-auto relative min-h-[90px]"
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
        </div>
      )}
    </div>
  );
}

export default function EditorPanel() {
  useAutoSave();
  const ra = useAutoResize();

  useEffect(function () {
    const t = setTimeout(ra.resizeAll, 100);
    function onInput(e) {
      if (e.target.tagName === 'TEXTAREA') ra.resize(e.target);
    }
    document.addEventListener('input', onInput);
    return function () {
      clearTimeout(t);
      document.removeEventListener('input', onInput);
    };
  }, [ra]);

  return (
    <section id="editorPanel" className="p-4 md:p-6 overflow-y-auto no-print space-y-6 border-r border-slate-800 bg-slate-900" style={{ height: '100%' }}>
      <ModeBanner />
      <ExtrasPicker />
      <AiAnalysisCard />
      <ProjectInfo />
      <ProblemGoal />
      <PersonaSection />
      <BrandingSection />
      <RolesSection />
      <FeaturesList />
      <AcSection />
      <TechStack />
      <SchemaSection />
      <NfrSection />
      <OutOfScope />
    </section>
  );
}