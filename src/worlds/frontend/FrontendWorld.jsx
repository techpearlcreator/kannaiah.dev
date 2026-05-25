import Hero from './components/Hero';
import PinnedProjectsSection from './components/PinnedProjectsSection';
import FloatingGlassSkillsSection from './components/FloatingGlassSkillsSection';
import FloatingJourneyCardCloud from './components/FloatingJourneyCardCloud';
import ContactCommandCenter from './components/ContactCommandCenter';
import AdaptiveCursor from '../shared/CustomCursor';

/**
 * FrontendWorld
 * ──────────────────────────────────────────────────────────────
 * Orchestrates the full "Vibe Code Developer" portfolio experience.
 * Focused exclusively on high-performance animations and cinematic design.
 */
const FrontendWorld = () => {
  return (
    <div className="portfolio-cursor-scope bg-[#fdfaf5] selection:bg-black selection:text-white min-h-screen">
      <AdaptiveCursor />
      {/* Header */}
      <header className="portfolio-header fixed top-0 left-0 z-50 w-full py-4 text-white mix-blend-difference pointer-events-none sm:py-0">
        <div className="portfolio-header-inner flex flex-col items-center gap-3 sm:h-24 sm:flex-row sm:justify-between">
          <a href="#home" className="portfolio-logo inline-flex items-baseline gap-1 font-sans font-black lowercase opacity-90 transition-opacity pointer-events-auto hover:opacity-100">
            <span>kannaiah</span>
            <span aria-hidden="true" className="mx-0.5 inline-block h-1.5 w-1.5 translate-y-[-1px] rounded-full bg-current sm:h-2 sm:w-2" />
            <span>dev</span>
          </a>
          <nav className="portfolio-nav flex max-w-full flex-wrap items-center justify-center gap-1 font-bold uppercase pointer-events-auto sm:justify-end sm:gap-2 md:gap-4">
            {[
              ['#work', 'Work'],
              ['#skills', 'Skills'],
              ['#journey', 'Journey'],
              ['#contact', 'Contact'],
            ].map(([href, label]) => (
              <a
                key={href}
                href={href}
                data-cursor-type="lens"
                className="relative rounded-full px-2.5 py-2 opacity-70 transition duration-300 hover:-translate-y-0.5 hover:bg-white/15 hover:text-white hover:opacity-100 hover:shadow-[0_0_22px_rgba(255,255,255,0.2)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:px-3 sm:opacity-55"
              >
                {label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main>
        <div id="home"><Hero /></div>
        <div id="work"><PinnedProjectsSection /></div>
        <div id="skills"><FloatingGlassSkillsSection /></div>
        <div id="journey"><FloatingJourneyCardCloud /></div>
        <div data-cursor="light"><ContactCommandCenter /></div>
      </main>
      
      <footer className="py-5 px-10 border-t border-black/5 flex justify-center items-center">
        <div className="text-[10px] tracking-[0.35em] uppercase font-bold text-black opacity-60 text-center md:text-xs md:tracking-[0.45em]">
          Crafted with Vibe Code // 2026
        </div>
      </footer>
    </div>
  );
};

export default FrontendWorld;
