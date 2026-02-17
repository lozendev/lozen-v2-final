import { useState, useEffect, useRef } from 'react';

// --- Icon Components ---
const Icon = ({ children, size = 24, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {children}
  </svg>
);

const Play = (props) => (
  <Icon {...props}>
    <polygon points="5 3 19 12 5 21 5 3" />
  </Icon>
);

const Pause = (props) => (
  <Icon {...props}>
    <rect x="6" y="4" width="4" height="16" />
    <rect x="14" y="4" width="4" height="16" />
  </Icon>
);

const ArrowRight = (props) => (
  <Icon {...props}>
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </Icon>
);

const CloseIcon = (props) => (
  <Icon {...props}>
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </Icon>
);

// X Logo (Twitter) - Using simple Path
const XLogo = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.size || 24}
    height={props.size || 24}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={props.className}
  >
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
  </svg>
);

const Twitch = (props) => (
  <Icon {...props}>
    <path d="M21 2H3v16h5v4l4-4h5l4-4V2zm-10 9V7m5 4V7" />
  </Icon>
);

const Send = (props) => (
  <Icon {...props}>
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </Icon>
);

const Copy = (props) => (
  <Icon {...props}>
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </Icon>
);

// --- App Code ---

const SLIDES = [
  { id: 'home', video: '/finaldesk.webm', navLabel: 'home' },
  { id: 'about', video: '/FinalStand.webm', navLabel: 'about' },
  { id: 'success', video: '/FinalBed.webm', navLabel: 'success' },
  { id: 'sale', video: '/FinalStretch.webm', navLabel: 'sale' }
];

const SOCIALS = [
  { icon: XLogo, link: 'https://x.com/lozendev' },
  { icon: Twitch, link: 'https://twitch.tv/lozendev' },
  { icon: Send, link: 'https://t.me/lozendev' }
];

const SUCCESS_PROJECTS = [
  { name: 'Baby Shina Inu', img: '/bsi.png' },
  { name: 'Baby Floki', img: '/bf.png' },
  { name: 'WAGMI', img: '/wagmi.png' }
];

const App = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showLatestModal, setShowLatestModal] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const audioRef = useRef(null);

  useEffect(() => {
    const playAudio = async () => {
      if (audioRef.current) {
        try {
          await audioRef.current.play();
          setIsPlaying(true);
        } catch (e) {
          console.log("Autoplay blocked");
        }
      }
    };
    // Auto-play might be blocked by browsers until interaction
    playAudio();
  }, []);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const changeSlide = (index) => {
    if (index === currentSlide || isTransitioning) return;
    setIsTransitioning(true);

    // Optimized Transition Logic
    // 1. Wait for opacity to reach 0 (500ms duration)
    setTimeout(() => {
      // 2. Change content while hidden
      setCurrentSlide(index);
      // 3. Short pause for stability/glitch effect, then fade back in
      setTimeout(() => {
        setIsTransitioning(false);
      }, 100);
    }, 500);
  };

  const nextSlide = () => {
    changeSlide((currentSlide + 1) % SLIDES.length);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // In a real app, show a toast notification here
  };

  const shortenAddress = (addr) => {
    if (!addr) return '';
    return `${addr.slice(0, 5)}...${addr.slice(-4)}`;
  };

  // Navigation filtering: Show all except current
  const bottomNavItems = SLIDES.map((s, i) => ({ ...s, index: i })).filter(s => s.index !== currentSlide);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black text-white selection:bg-[#f6dd9a] selection:text-black">
      <audio ref={audioRef} src="/hs.mp3" loop />

      {/* Background Layer */}
      <div className="absolute inset-0 z-0 bg-black">
        {/* Video Container with Glitch Effect */}
        <div className={`relative w-full h-full transition-transform duration-200 ${isTransitioning ? 'glitch-active' : ''}`}>
          <div className="absolute inset-0 bg-black/50 z-10 pointer-events-none"></div>
          <video
            key={SLIDES[currentSlide].video}
            className="w-full h-full object-cover opacity-60"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src={SLIDES[currentSlide].video} type="video/webm" />
          </video>
        </div>
      </div>

      {/* Top Navigation */}
      <nav className="absolute top-0 left-0 w-full z-50 p-8 flex justify-between items-center mix-blend-difference">
        <div className="font-bold text-sm tracking-[0.2em] uppercase">LOZEN v2</div>

        <button
          onClick={toggleMusic}
          className="flex items-center gap-3 text-xs tracking-[0.2em] hover:text-[#f6dd9a] transition-colors group uppercase font-bold"
        >
          <span className="opacity-70 group-hover:opacity-100 transition-opacity">hiroi sekai - the link</span>
          {isPlaying ? <Pause size={14} className="fill-current" /> : <Play size={14} className="fill-current" />}
        </button>

        <button
          onClick={nextSlide}
          className="bg-zinc-800/80 hover:bg-zinc-700 p-2 rounded-lg transition-colors border border-zinc-700 group"
        >
          <ArrowRight size={18} className="text-zinc-400 group-hover:text-white" />
        </button>
      </nav>

      {/* Content Container */}
      <main className={`relative z-20 w-full h-full flex flex-col justify-center px-8 md:px-24 transition-opacity duration-500 ease-in-out ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>

        {/* Slide 0: Home */}
        {currentSlide === 0 && (
          <div className="w-full h-full relative flex items-center">
            {/* Main Hero Content */}
            <div className="flex flex-col items-start max-w-5xl z-30">
              <h2 className="text-xs md:text-sm font-bold uppercase mb-4 tracking-[0.2em] text-white/80">designer, dev, failed trencher</h2>
              <h1 className="text-[80px] md:text-[140px] font-bold leading-none -ml-1 md:-ml-2 mb-8 tracking-tighter">lozen.dev</h1>

              <button
                onClick={() => setShowLatestModal(true)}
                className="group relative overflow-hidden flex items-center gap-3 text-[#f6dd9a] font-bold uppercase tracking-wider text-sm pl-4 pr-6 py-3 border-l-2 border-[#f6dd9a] hover:bg-[#f6dd9a]/10 transition-all"
              >
                latest success
                <ArrowRight size={16} className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>

            {/* Right Socials - Horizontal and offset higher */}
            <div className="absolute right-24 top-[40%] -translate-y-1/2 flex flex-row gap-4 z-30">
              {SOCIALS.map((social, idx) => (
                <a key={idx} href={social.link} target="_blank" rel="noopener noreferrer" className="p-3 border border-zinc-700 text-zinc-400 hover:border-[#f6dd9a] hover:text-[#f6dd9a] hover:bg-[#f6dd9a]/5 transition-all rounded-sm">
                  <social.icon size={20} />
                </a>
              ))}
            </div>

            {/* Bottom Info Bar */}
            <div className="absolute bottom-32 left-0 right-0 flex justify-between items-end">
              {/* Bottom Left: Wallet - Shortened with Copy Icon */}
              <div className="flex flex-col gap-1 text-[10px] md:text-xs font-mono text-zinc-500 opacity-50 hover:opacity-100 transition-opacity">
                <div className="flex items-center gap-2">
                  <span>{'{ '}</span>
                  <button
                    onClick={() => copyToClipboard('6QUbbx1yk9btVR64hVbQGDAU4o5Tn8V8L8jZuxCHqdjn')}
                    className="cursor-pointer flex items-center gap-2 hover:text-white transition-colors group"
                  >
                    <span>{shortenAddress('6QUbbx1yk9btVR64hVbQGDAU4o5Tn8V8L8jZuxCHqdjn')}</span>
                    <Copy size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                  <span>, </span>
                  <a href="https://www.axiom.trade" target="_blank" className="hover:text-white transition-all">!axiom</a>
                  <span>{' }'}</span>
                </div>
              </div>

              {/* Bottom Right: Bio - Unified paragraph, justified */}
              <div className="max-w-md text-right text-xs font-bold leading-relaxed uppercase tracking-wide text-zinc-300 text-justify">
                <p>
                  a <span className="bg-gradient-to-r from-cyan-300 to-blue-500 bg-clip-text text-transparent">designer</span> and <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">dev</span> launching, selling and designing random meme coin projects. Occasionally trenching. Aiming to release more thought out projects than slop. If you’re interested in working with me message me via <a href="https://t.me/lozendev" target="_blank" className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent border-b border-blue-500/30 hover:border-blue-400 transition-colors">telegram</a>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Slide 1: About */}
        {currentSlide === 1 && (
          <div className="w-full h-full flex flex-col items-center justify-center text-center relative z-30 pt-10">
            <h2 className="text-sm font-bold uppercase mb-6 tracking-[0.3em] text-zinc-400">about</h2>
            <h1 className="text-[100px] md:text-[150px] font-bold leading-none mb-10 tracking-tighter">deets</h1>
            <p className="max-w-2xl text-sm md:text-base font-bold uppercase leading-loose text-zinc-300 mb-12 tracking-wide">
              a designer, dev and somewhat terrible trencher. Here to launch some planned meme coins where they hopefully make everyone that follows rich. I design for fun and am open to work with other devs. My crypto journey started with <span className="text-[#f6dd9a]">BNB</span> where I helped multiple projects breach the 10 mil mc, some even to 30 mil mc.
            </p>
            <button
              onClick={() => copyToClipboard('6QUbbx1yk9btVR64hVbQGDAU4o5Tn8V8L8jZuxCHqdjn')}
              className="group font-mono text-xs text-[#f6dd9a] border border-[#f6dd9a]/30 px-8 py-4 bg-black/60 backdrop-blur-sm rounded-full hover:border-[#f6dd9a] hover:text-[#f6dd9a] transition-all duration-300"
            >
              Dev wallet: 6QUbbx1yk9btVR64hVbQGDAU4o5Tn8V8L8jZuxCHqdjn
            </button>
          </div>
        )}

        {/* Slide 2: Successful Projects */}
        {currentSlide === 2 && (
          <div className="w-full h-full relative flex items-center z-30 pl-0 md:pl-10">
            <div className="absolute top-32 left-0 w-full">
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-400 mb-16">successful projects</h2>

              <div className="flex flex-col w-full md:w-1/2">
                {SUCCESS_PROJECTS.map((project, idx) => (
                  <div
                    key={idx}
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    className="group relative py-6 border-b border-zinc-800 hover:border-[#f6dd9a] transition-colors cursor-default"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#f6dd9a]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <span className="relative text-xl md:text-2xl font-bold uppercase tracking-tighter group-hover:translate-x-6 transition-transform duration-300 inline-block text-zinc-300 group-hover:text-white">
                      {project.name}
                    </span>

                    {/* Image aligned with row */}
                    {hoveredIndex === idx && (
                      <div className="hidden md:block absolute left-[100%] top-1/2 -translate-y-1/2 ml-20 w-[400px] h-[400px] z-50 animate-fade-in pointer-events-none">
                        <div className="w-full h-full bg-zinc-900 border border-zinc-800 shadow-2xl shadow-black/50 rotate-3 transition-all p-1">
                          <img src={project.img} alt={project.name} className="w-full h-full object-cover opacity-90" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Slide 3: Sale */}
        {currentSlide === 3 && (
          <div className="w-full h-full relative flex flex-col md:flex-row items-center justify-between gap-12 z-30 py-24">
            {/* Left Project */}
            <div className="flex-1 w-full flex flex-col items-start border-r border-zinc-800/50 pr-0 md:pr-12 h-full justify-center relative">
              <h3 className="text-xs font-bold uppercase text-zinc-500 mb-4 tracking-[0.2em]">project #1 for sale</h3>
              <h2 className="text-7xl md:text-9xl font-bold uppercase mb-6 tracking-tighter text-white">SOON</h2>
              <p className="text-xs font-bold uppercase text-zinc-500 mb-8 tracking-widest">More info to come</p>
              <div className="w-full max-w-md h-64 bg-zinc-900/30 border border-zinc-800/50 flex items-center justify-center backdrop-blur-sm">
                <span className="text-zinc-700 font-mono text-[10px] uppercase">[Image Block]</span>
              </div>
            </div>

            {/* Right Project */}
            <div className="flex-1 w-full flex flex-col items-end border-l border-zinc-800/50 pl-0 md:pl-12 h-full justify-center text-right relative">
              <h3 className="text-xs font-bold uppercase text-zinc-500 mb-4 tracking-[0.2em]">project #2 for sale</h3>
              <h2 className="text-7xl md:text-9xl font-bold uppercase mb-6 tracking-tighter text-white">SOON</h2>
              <p className="text-xs font-bold uppercase text-zinc-500 mb-8 tracking-widest">More info to come</p>
              <div className="w-full max-w-md h-64 bg-zinc-900/30 border border-zinc-800/50 flex items-center justify-center backdrop-blur-sm">
                <span className="text-zinc-700 font-mono text-[10px] uppercase">[Image Block]</span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <div className="absolute bottom-8 left-0 w-full flex justify-center gap-16 z-40">
        {bottomNavItems.map((item) => (
          <button
            key={item.id}
            onClick={() => changeSlide(item.index)}
            className="text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-zinc-600 hover:text-[#f6dd9a] transition-colors nav-hover"
          >
            {item.navLabel}
          </button>
        ))}
      </div>

      {/* Modal Overlay */}
      {showLatestModal && currentSlide === 0 && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm animate-fade-in" onClick={() => setShowLatestModal(false)}></div>
          <div className="relative bg-zinc-900 border border-zinc-800 w-full max-w-5xl aspect-video shadow-2xl animate-scale-up overflow-hidden">
            <button
              onClick={() => setShowLatestModal(false)}
              className="absolute top-4 right-4 text-white hover:text-[#f6dd9a] z-50 bg-black/50 p-2 rounded-full backdrop-blur-md"
            >
              <CloseIcon size={24} />
            </button>
            <div className="w-full h-full flex items-center justify-center bg-zinc-950">
              <img src="/Latestproject.png" alt="Latest Project" className="max-w-full max-h-full object-contain" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
