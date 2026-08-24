import { useState, useEffect, MouseEvent, FormEvent } from 'react';
import {
  Menu, X, Phone, Mail, MapPin, UserPlus, Sparkles, ChevronRight,
  ArrowDown, ArrowRight, ArrowLeft, BookOpen, Award, GraduationCap,
  CheckCircle, CheckCircle2, FileText, MessageCircle, History,
  Calendar, User, Building, Compass, Target, Globe2, BookMarked,
  ZoomIn, Camera, Trophy, Newspaper, Loader2, MessageSquareQuote,
  Send, Clock, Navigation, Share2, Image as ImageIcon, ChevronUp
} from 'lucide-react';
import {
  PESANTREN_INFO, LEMBAGA_LIST, PROGRAM_LIST,
  GALLERY_LIST, PRESTASI_LIST, INITIAL_BERITA,
  Berita, Testimoni
} from './pesantrenData';

// Helper format tanggal Indonesia
function formatTanggal(tgl: string | undefined): string {
  if (!tgl) return '';
  if (typeof tgl === 'string' && !tgl.includes('T') && !tgl.includes('-') && isNaN(Date.parse(tgl))) {
    return tgl;
  }
  const d = new Date(tgl);
  if (isNaN(d.getTime())) return tgl;
  const namaBulan = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  return `${d.getDate()} ${namaBulan[d.getMonth()]} ${d.getFullYear()}`;
}

const NAV_LINKS = [
  { href: '#tentang', label: 'Tentang' },
  { href: '#sejarah', label: 'Sejarah' },
  { href: '#visi-misi', label: 'Visi & Misi' },
  { href: '#lembaga', label: 'Lembaga' },
  { href: '#program', label: 'Program' },
  { href: '#galeri', label: 'Galeri' },
  { href: '#prestasi', label: 'Prestasi' },
  { href: '#berita', label: 'Berita' },
  { href: '#testimoni', label: 'Testimoni' },
  { href: '#lokasi', label: 'Kontak' },
];

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Lightbox Modal state
  const [lightbox, setLightbox] = useState<{ isOpen: boolean; imageUrl: string; title: string }>({
    isOpen: false,
    imageUrl: '',
    title: '',
  });

  // News State & Modal
  const [beritaList, setBeritaList] = useState<Berita[]>(INITIAL_BERITA);
  const [loadingBerita, setLoadingBerita] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<Berita | null>(null);

  // Testimoni State & Form
  const [testimoniList, setTestimoniList] = useState<Testimoni[]>([]);
  const [loadingTesti, setLoadingTesti] = useState(true);
  const [submittingTesti, setSubmittingTesti] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [nama, setNama] = useState('');
  const [komentar, setKomentar] = useState('');

  // Gallery Filter State
  const [galleryFilter, setGalleryFilter] = useState<'semua' | 'akademik' | 'ibadah' | 'ekskul' | 'kegiatan'>('semua');

  // Handle Scroll Spy & Navbar Blur
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
      setShowBackToTop(window.scrollY > 400);

      const sections = NAV_LINKS.map(link => link.href.substring(1));
      const scrollPosition = window.scrollY + 120;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch Berita from GAS
  const fetchBerita = async () => {
    setLoadingBerita(true);
    try {
      const res = await fetch(`${PESANTREN_INFO.gasUrl}?action=getBerita`);
      const result = await res.json();
      if (result.result === 'success' && Array.isArray(result.data) && result.data.length > 0) {
        const sorted = [...result.data].reverse().slice(0, 7);
        setBeritaList(sorted);
      }
    } catch (err) {
      console.warn('Menggunakan data cadangan berita', err);
    } finally {
      setLoadingBerita(false);
    }
  };

  // Fetch Testimoni from GAS
  const fetchTestimoni = async () => {
    setLoadingTesti(true);
    try {
      const res = await fetch(PESANTREN_INFO.gasUrl);
      const result = await res.json();
      if (result.result === 'success' && Array.isArray(result.data)) {
        setTestimoniList(result.data);
      }
    } catch (err) {
      console.warn('Gagal memuat testimoni', err);
    } finally {
      setLoadingTesti(false);
    }
  };

  useEffect(() => {
    fetchBerita();
    fetchTestimoni();

    // Check direct article link in URL (e.g., ?id=101)
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('id');
    if (articleId) {
      fetch(`${PESANTREN_INFO.gasUrl}?action=getBerita`)
        .then(r => r.json())
        .then(res => {
          if (res.result === 'success' && Array.isArray(res.data)) {
            const found = res.data.find((b: any) => String(b.id) === String(articleId));
            if (found) setSelectedArticle(found);
          }
        })
        .catch(() => {});
    }
  }, []);

  // Smooth scroll handler
  const handleNavClick = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const targetEl = document.querySelector(href);
    if (targetEl) {
      const topOffset = targetEl.getBoundingClientRect().top + window.scrollY - 76;
      window.scrollTo({ top: topOffset, behavior: 'smooth' });
    }
  };

  // Handle submit buku tamu / testimoni
  const handleTestimoniSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!nama.trim() || !komentar.trim()) return;
    setSubmittingTesti(true);
    setSubmitSuccess(false);

    try {
      await fetch(PESANTREN_INFO.gasUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ nama: nama.trim(), komentar: komentar.trim() }),
      });

      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      const newEntry: Testimoni = {
        nama: nama.trim(),
        komentar: komentar.trim(),
        waktu: `Hari ini, ${timeStr}`
      };
      setTestimoniList([newEntry, ...testimoniList]);
      setNama('');
      setKomentar('');
      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        fetchTestimoni();
      }, 3500);
    } catch {
      alert('Gagal mengirim kesan. Mohon periksa koneksi internet Anda.');
    } finally {
      setSubmittingTesti(false);
    }
  };

  const filteredGallery = galleryFilter === 'semua'
    ? GALLERY_LIST
    : GALLERY_LIST.filter(item => item.category === galleryFilter);

  const featuredNews = beritaList[0];
  const secondaryNews = beritaList.slice(1);

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 font-sans text-stone-800 antialiased selection:bg-emerald-800 selection:text-white pb-16 lg:pb-0">
      
      {/* ========================================================================= */}
      {/* 1. NAVBAR HEADER */}
      {/* ========================================================================= */}
      <header
        id="navbar-header"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'glass-nav-scrolled py-2.5 border-b border-emerald-800/40 shadow-lg'
            : 'bg-emerald-950/75 backdrop-blur-md py-3.5 border-b border-white/10'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <a
              id="brand-logo-link"
              href="#hero"
              onClick={(e) => handleNavClick(e, '#hero')}
              className="flex items-center gap-3 group"
            >
              <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white p-1 flex items-center justify-center shadow-md transition-transform duration-300 group-hover:scale-105">
                <img src={PESANTREN_INFO.logoUrl} alt="Logo PP DFI" className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="text-white font-bold text-sm sm:text-base tracking-tight leading-tight group-hover:text-amber-300 transition-colors">
                  PP Darul Fawaid Ilmiyah
                </span>
                <span className="text-emerald-300/80 text-[10px] sm:text-xs font-medium tracking-wide">
                  Randujalak • Besuk • Probolinggo
                </span>
              </div>
            </a>

            {/* Desktop Menu */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5" aria-label="Main Navigation">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  id={`nav-${link.href.substring(1)}`}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                    activeSection === link.href.substring(1)
                      ? 'text-amber-300 bg-emerald-900/80 shadow-inner'
                      : 'text-white/80 hover:text-amber-200 hover:bg-white/10'
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* PSB Top Button */}
            <div className="hidden sm:flex items-center gap-3">
              <a
                id="btn-psb-header"
                href={PESANTREN_INFO.registrationFormUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold uppercase tracking-wider shadow-sm transition-all duration-200 hover:scale-105 active:scale-95"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>PSB 2027</span>
              </a>
            </div>

            {/* Mobile Hamburger Button */}
            <button
              id="mobile-menu-toggle"
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-white hover:bg-white/10 focus:outline-none transition-colors"
              aria-label="Buka Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-drawer-backdrop"
          className="fixed inset-0 bg-stone-950/70 z-50 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            id="mobile-drawer-panel"
            className="fixed inset-y-0 right-0 w-[82vw] max-w-sm bg-stone-900 text-white shadow-2xl flex flex-col justify-between p-6 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between pb-5 border-b border-stone-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-white p-1 flex items-center justify-center">
                    <img src={PESANTREN_INFO.logoUrl} alt="Logo PP DFI" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">Menu Navigasi</h3>
                    <p className="text-[11px] text-emerald-400">PP Darul Fawaid Ilmiyah</p>
                  </div>
                </div>
                <button
                  id="mobile-drawer-close"
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="mt-4 flex flex-col divide-y divide-stone-800/60">
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.href}
                    id={`mobile-nav-${link.href.substring(1)}`}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className={`flex items-center justify-between py-3 px-2 text-sm font-medium transition-colors ${
                      activeSection === link.href.substring(1) ? 'text-amber-400 font-semibold' : 'text-stone-300 hover:text-white'
                    }`}
                  >
                    <span>{link.label}</span>
                    <ChevronRight className="w-4 h-4 text-stone-500" />
                  </a>
                ))}
              </nav>
            </div>

            <div className="pt-6 border-t border-stone-800 flex flex-col gap-3">
              <a
                id="drawer-psb-link"
                href={PESANTREN_INFO.registrationFormUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-center text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md"
              >
                <Sparkles className="w-4 h-4" />
                Daftar PSB 2027 Sekarang
              </a>
              <a
                id="drawer-wa-link"
                href={PESANTREN_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-medium text-center text-xs flex items-center justify-center gap-2"
              >
                <Phone className="w-3.5 h-3.5" />
                Hubungi Humas via WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. MAIN CONTENT */}
      {/* ========================================================================= */}
      <main className="flex-grow">
        
        {/* HERO SECTION */}
        <section
          id="hero"
          className="relative min-h-[92vh] lg:min-h-screen flex items-center justify-center pt-24 pb-16 lg:py-28 overflow-hidden"
        >
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
            style={{ backgroundImage: `url(${PESANTREN_INFO.heroBackground})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/92 via-emerald-900/88 to-emerald-950/96" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none" />

          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white flex flex-col items-center">
            <div className="relative mb-6 group">
              <div className="absolute -inset-1.5 bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full blur-md opacity-50 group-hover:opacity-80 transition duration-500" />
              <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-white p-3 flex items-center justify-center shadow-2xl border-2 border-white/90">
                <img
                  src={PESANTREN_INFO.heroLogoUrl}
                  alt="Logo PP Darul Fawaid Ilmiyah"
                  className="w-full h-full object-contain -translate-y-1 transform transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-amber-300 text-xs sm:text-sm font-semibold tracking-wide mb-4">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>Berjiwa Islami, Modern, dan Unggul</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight mb-2">
              Pondok Pesantren
            </h1>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-amber-300 leading-tight mb-6">
              Darul Fawaid Ilmiyah
            </h2>

            <p className="max-w-2xl text-base sm:text-lg lg:text-xl text-emerald-100/90 font-normal leading-relaxed mb-8 sm:mb-10 text-center">
              {PESANTREN_INFO.tagline}
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3.5 sm:gap-4 w-full sm:w-auto mb-12 sm:mb-16">
              <a
                id="hero-cta-explore"
                href="#tentang"
                onClick={(e) => handleNavClick(e, '#tentang')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-sm sm:text-base tracking-wide shadow-lg shadow-amber-900/30 transition-all duration-200 hover:-translate-y-0.5"
              >
                <span>Welcome to Our Islamic Boarding School</span>
                <ArrowDown className="w-4 h-4 animate-bounce" />
              </a>

              <a
                id="hero-cta-psb"
                href={PESANTREN_INFO.registrationFormUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-sm sm:text-base tracking-wide border border-white/25 backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5"
              >
                <FileText className="w-4 h-4 text-amber-300" />
                <span>Pendaftaran Santri Baru</span>
              </a>
            </div>

            {/* Quick Strip */}
            <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 pt-6 border-t border-white/15">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-3.5 border border-white/10 text-center">
                <div className="text-amber-300 text-xl sm:text-2xl font-bold">1444 H</div>
                <div className="text-emerald-200/80 text-xs font-medium mt-0.5">Tahun Berdiri (2022 M)</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-3.5 border border-white/10 text-center">
                <div className="text-amber-300 text-xl sm:text-2xl font-bold">3 Jenjang</div>
                <div className="text-emerald-200/80 text-xs font-medium mt-0.5">Formal & Diniyah</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-3.5 border border-white/10 text-center">
                <div className="text-amber-300 text-xl sm:text-2xl font-bold">5 Program</div>
                <div className="text-emerald-200/80 text-xs font-medium mt-0.5">Kurikulum Unggulan</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-3.5 border border-white/10 text-center">
                <div className="text-amber-300 text-xl sm:text-2xl font-bold">Resmi</div>
                <div className="text-emerald-200/80 text-xs font-medium mt-0.5">Berizin & Berlegalitas</div>
              </div>
            </div>
          </div>
        </section>

        {/* TENTANG PESANTREN */}
        <section id="tentang" className="py-20 sm:py-28 bg-white relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
              
              <div className="lg:col-span-5 relative">
                <div className="relative mx-auto max-w-md lg:max-w-none">
                  <div className="absolute -inset-3 sm:-inset-4 bg-emerald-100/60 rounded-3xl -rotate-1" />
                  <div className="relative rounded-2xl overflow-hidden shadow-xl border border-emerald-900/10 aspect-[4/5] sm:aspect-[4/4.8] bg-stone-100">
                    <img
                      src="https://i.ibb.co.com/zzqMMFq/DSC5150.jpg"
                      alt="Kegiatan Santri PP Darul Fawaid Ilmiyah"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-emerald-950/85 backdrop-blur-md text-white border border-white/15">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-lg bg-amber-400 text-stone-950">
                          <Sparkles className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-white">Integrasi Salaf & Modern</h4>
                          <p className="text-xs text-emerald-200/90">Kajian Kitab Kuning & Kurikulum Nasional</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 flex flex-col items-start">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100/80 text-emerald-900 text-xs font-bold uppercase tracking-wider mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-700" />
                  Mengenal Lebih Dekat
                </div>

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 tracking-tight mb-6 leading-tight">
                  Profil Singkat Pesantren
                </h2>

                <div className="space-y-4 text-stone-600 text-sm sm:text-base leading-relaxed text-justify">
                  <p>
                    Pondok Pesantren Darul Fawaid Ilmiyah merupakan lembaga pendidikan Islam yang berorientasi pada masa depan dengan tetap berpegang teguh pada nilai-nilai keilmuan klasik. Melalui pembelajaran Kitab Kuning yang dipadukan dengan sistem pendidikan modern, santri dibekali wawasan keislaman yang kuat sekaligus kompetensi akademik yang relevan dengan perkembangan zaman.
                  </p>
                  <p>
                    Proses pembelajaran didampingi oleh para pembimbing yang kompeten, berpengalaman, dan profesional sehingga tercipta lingkungan belajar yang kondusif. Dengan bimbingan yang intensif, setiap santri memperoleh kesempatan untuk mengembangkan potensi, minat, dan bakatnya secara optimal, termasuk dalam penguasaan sains, teknologi, serta kemampuan berbahasa Arab dan Inggris secara aktif.
                  </p>
                  <p>
                    Kami berkomitmen mencetak generasi muslim yang berakhlak mulia, berilmu luas, dan berdaya saing global. Pondok Pesantren Darul Fawaid Ilmiyah berupaya melahirkan kader ulama kontemporer yang kokoh dalam spiritualitas, tajam dalam intelektualitas, serta adaptif dan responsif dalam menghadapi tantangan dan dinamika kehidupan modern.
                  </p>
                </div>

                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full">
                  {[
                    { title: "Lingkungan Asri & Kondusif", desc: "Suasana belajar tenang dan sejuk mendukung ketenangan santri" },
                    { title: "Asatidz Profesional & Berkompeten", desc: "Dididik oleh para pengajar lulusan pesantren terkemuka" },
                    { title: "Pembinaan Karakter & Akhlaqul Karimah", desc: "Penanaman adab dan akhlakul karimah setiap waktu" },
                    { title: "Pembiasaan Life Skill & Sikap Disiplin", desc: "Melatih kemandirian santri untuk bekal bermasyarakat" }
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3.5 rounded-xl bg-stone-50 hover:bg-emerald-50/70 border border-stone-200/80 hover:border-emerald-200 transition-colors"
                    >
                      <div className="p-1.5 rounded-lg bg-emerald-700 text-white shrink-0 mt-0.5">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-sm font-bold text-stone-900 block leading-tight">{item.title}</span>
                        <span className="text-xs text-stone-500 leading-tight mt-0.5 block">{item.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* SEJARAH */}
        <section id="sejarah" className="py-20 sm:py-28 bg-stone-50 border-y border-stone-200/70 relative">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider mb-3">
                <History className="w-3.5 h-3.5" />
                Perjalanan Kami
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 tracking-tight">
                Sejarah Berdirinya Pesantren
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              {[
                { icon: Calendar, title: "Tahun 1444 H / 2022 M", desc: "Didirikan oleh KH. Zaky Ayamany & disahkan resmi oleh negara pada 25 November 2022." },
                { icon: Building, title: "Tanah Wakaf & Cangkrok", desc: "Bermula dari masjid dan kamar sederhana (cangkrok) sebagai pusat awal dakwah & tarbiyah." },
                { icon: User, title: "Generasi Awal", desc: "Dimulai dengan 3 pengurus ikhlas dan 5 santri mukim sebagai bibit pertama pesantren." },
                { icon: Compass, title: "Tumbuh Berkelanjutan", desc: "Terus berkembang meningkatkan sarana, mutu diniyah, dan kompetensi global santri." }
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex flex-col justify-between">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-3">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-stone-900 text-sm mb-1">{item.title}</h4>
                      <p className="text-xs text-stone-600 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-white p-6 sm:p-10 rounded-3xl border border-stone-200 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-700 via-emerald-600 to-amber-500" />
              <div className="space-y-4 text-stone-700 text-sm sm:text-base leading-relaxed text-justify">
                <p>
                  Pondok Pesantren Darul Fawaid Ilmiyah didirikan pada tahun 1444 Hijriyah oleh <strong className="text-stone-900 font-bold">KH. Zaky Ayamany</strong> dan memperoleh pengesahan resmi dari negara pada <strong className="text-stone-900 font-bold">25 November 2022</strong>. Berawal dari sebuah masjid dan kamar sederhana (madura: <em>cangkrok</em>) yang berdiri di atas tanah wakaf, pesantren ini memulai langkahnya dengan tiga orang pengurus dan lima santri mukim sebagai generasi pertama.
                </p>
                <p>
                  Meskipun usianya masih tergolong muda, Pondok Pesantren Darul Fawaid Ilmiyah terus menunjukkan perkembangan yang positif. Dengan semangat membangun pendidikan Islam yang berkualitas, pesantren senantiasa berupaya meningkatkan mutu pembelajaran, sarana pendukung, serta pembinaan karakter santri agar mampu menghadapi tantangan zaman.
                </p>
                <p className="mb-0">
                  Berpijak pada nilai-nilai keikhlasan, kesederhanaan, dan semangat menuntut ilmu, pesantren berkomitmen melahirkan generasi muslim yang berakhlak mulia, berwawasan luas, dan siap memberikan manfaat bagi agama, bangsa, dan masyarakat. Setiap langkah pengembangan dilakukan tanpa meninggalkan jati diri dan tradisi luhur kepesantrenan.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* VISI & MISI */}
        <section id="visi-misi" className="py-20 sm:py-28 bg-white relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-16">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider mb-3">
                <Compass className="w-3.5 h-3.5" />
                Arah & Komitmen
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 tracking-tight">
                Visi dan Misi Pesantren
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              <div className="lg:col-span-5 flex flex-col">
                <div className="h-full bg-gradient-to-br from-emerald-900 via-emerald-950 to-stone-950 text-white rounded-3xl p-8 sm:p-10 shadow-lg border border-emerald-800/40 relative overflow-hidden flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400/30 text-amber-300 flex items-center justify-center mb-6">
                      <Target className="w-6 h-6" />
                    </div>
                    <span className="text-amber-400 text-xs font-bold uppercase tracking-widest block mb-2">
                      Komitmen Utama
                    </span>
                    <h3 className="text-2xl font-bold text-white mb-6">
                      Visi Pesantren
                    </h3>
                    <blockquote className="text-emerald-100/95 text-base sm:text-lg leading-relaxed italic border-l-2 border-amber-400/80 pl-4 py-1">
                      "Menjadi pusat keunggulan pendidikan Islam integratif yang mencetak pemimpin umat bertaraf global, berakhlak mulia, serta berkomitmen tinggi pada kemaslahatan masyarakat."
                    </blockquote>
                  </div>

                  <div className="mt-8 pt-6 border-t border-white/10 flex items-center gap-3 text-xs text-emerald-300/80">
                    <Award className="w-4 h-4 text-amber-400" />
                    <span>Mencetak Generasi Berakhlak & Berprestasi</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
                <div className="p-4 sm:p-6 bg-stone-50 rounded-2xl border border-stone-200/80 mb-2">
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block mb-1">Langkah Strategis</span>
                  <h3 className="text-xl sm:text-2xl font-bold text-stone-900">Misi Pesantren</h3>
                </div>

                <div className="space-y-4 flex-grow flex flex-col justify-between">
                  {[
                    { icon: BookOpen, title: "Pendidikan Integratif", desc: "Menyelenggarakan pendidikan baca tulis Al-Qur'an dan penguasaan kitab kuning yang terintegrasi dengan IPTAQ dan IPTEK." },
                    { icon: Globe2, title: "Komunikasi Global", desc: "Membiasakan penggunaan bahasa Arab dan Inggris secara aktif sebagai pengantar harian komunikasi pesantren." },
                    { icon: Sparkles, title: "Karakter Unggul", desc: "Menanamkan nilai akhlakul karimah, kepemimpinan, kemandirian, dan jiwa kewirausahaan sosial." }
                  ].map((misi, idx) => {
                    const Icon = misi.icon;
                    return (
                      <div key={idx} className="p-5 sm:p-6 rounded-2xl bg-white border border-stone-200 shadow-sm hover:border-emerald-300 hover:shadow-md transition-all flex items-start gap-4 sm:gap-5">
                        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0 border border-emerald-100">
                          <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="w-5 h-5 rounded-full bg-amber-400 text-stone-950 text-xs font-bold flex items-center justify-center">{idx + 1}</span>
                            <h4 className="font-bold text-stone-900 text-base sm:text-lg">{misi.title}</h4>
                          </div>
                          <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">{misi.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* LEMBAGA PENDIDIKAN */}
        <section id="lembaga" className="py-20 sm:py-28 bg-stone-50 border-y border-stone-200/70 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-16">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider mb-3">
                <GraduationCap className="w-3.5 h-3.5" />
                Jenjang Formal & Diniyah
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 tracking-tight">
                Lembaga Pendidikan
              </h2>
              <p className="mt-3 text-sm sm:text-base text-stone-600">
                Pendidikan berjenjang terpadu yang memadukan kurikulum kepesantrenan salaf dengan kurikulum pendidikan nasional.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {LEMBAGA_LIST.map((item, index) => (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex justify-center mb-6">
                      <div className="w-24 h-24 sm:w-28 sm:h-28 p-3 rounded-2xl bg-stone-50 border border-stone-100 flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm">
                        <img src={item.logo} alt={item.name} className="max-h-full max-w-full object-contain" />
                      </div>
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-stone-900 mb-3 group-hover:text-emerald-800 transition-colors text-center">
                      {item.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed text-justify">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-400">
                    <span className="font-medium text-emerald-800/80 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full border-2 border-emerald-600 flex items-center justify-center text-emerald-600 text-[10px] font-bold">
                        ✓
                      </span>
                      {item.abbr}
                    </span>
                    <span className="font-mono text-stone-400">0{index + 1}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PROGRAM UNGGULAN */}
        <section id="program" className="py-20 sm:py-28 bg-white relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-16">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider mb-3">
                <BookMarked className="w-3.5 h-3.5" />
                Kurikulum & Program
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 tracking-tight">
                Program Unggulan Pendidikan
              </h2>
              <p className="mt-3 text-sm sm:text-base text-stone-600">
                Membentuk santri yang mutafaqqih fiddin, fasih berbahasa, mandiri, dan berkarakter akhlaqul karimah.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {PROGRAM_LIST.map((prog, index) => (
                <div
                  key={prog.id}
                  className="bg-white rounded-3xl border border-stone-200 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all duration-300 overflow-hidden flex flex-col group"
                >
                  <div
                    className="relative aspect-[16/10] overflow-hidden bg-stone-100 cursor-pointer"
                    onClick={() => setLightbox({ isOpen: true, imageUrl: prog.image, title: prog.title })}
                  >
                    <img src={prog.image} alt={prog.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108" />
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-stone-950/70 backdrop-blur-md text-amber-300 text-[11px] font-semibold tracking-wide border border-white/10">
                      {prog.category}
                    </div>
                    <div className="absolute inset-0 bg-emerald-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="p-2.5 rounded-full bg-white/90 text-emerald-900 shadow-lg">
                        <ZoomIn className="w-5 h-5" />
                      </div>
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-grow justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-stone-900 mb-2.5 group-hover:text-emerald-800 transition-colors">
                        {prog.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-stone-600 leading-relaxed text-justify">
                        {prog.description}
                      </p>
                    </div>
                    <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-400">
                      <span className="text-emerald-800 font-medium">{prog.category}</span>
                      <span>0{index + 1}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* GALERI KEGIATAN */}
        <section id="galeri" className="py-20 sm:py-28 bg-stone-50 border-y border-stone-200/70 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider mb-3">
                <Camera className="w-3.5 h-3.5" />
                Aktivitas Visual
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 tracking-tight">
                Galeri Foto Kegiatan
              </h2>
              <p className="mt-3 text-sm sm:text-base text-stone-600">
                Dokumentasi keseharian, rutinitas ibadah, pembelajaran formal, dan kreativitas santri.
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 flex-wrap mb-10">
              {[
                { key: 'semua', label: 'Semua Kegiatan' },
                { key: 'akademik', label: 'KBM & Akademik' },
                { key: 'ibadah', label: 'Ibadah & Pengajian' },
                { key: 'ekskul', label: 'Ekstrakurikuler' },
                { key: 'kegiatan', label: 'Agenda & Yayasan' }
              ].map(tab => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setGalleryFilter(tab.key as any)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all ${
                    galleryFilter === tab.key
                      ? 'bg-emerald-800 text-white shadow-md scale-105'
                      : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
              {filteredGallery.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setLightbox({ isOpen: true, imageUrl: item.image, title: item.title })}
                  className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-stone-200 cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-200/80"
                >
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                  <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 bg-gradient-to-t from-stone-950/90 via-stone-950/50 to-transparent">
                    <span className="text-white text-xs sm:text-sm font-semibold block leading-tight truncate">
                      {item.title}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-emerald-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-3 text-center">
                    <div className="flex flex-col items-center gap-1.5 text-white">
                      <div className="p-2.5 rounded-full bg-amber-400 text-stone-950 shadow-md">
                        <ZoomIn className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-medium text-amber-200 mt-1">Perbesar Foto</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRESTASI SANTRI */}
        <section id="prestasi" className="py-20 sm:py-28 bg-white relative overflow-hidden">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-16">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider mb-3">
                <Trophy className="w-3.5 h-3.5" />
                Apresiasi & Karya
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 tracking-tight">
                Prestasi Santri
              </h2>
              <p className="mt-3 text-sm sm:text-base text-stone-600">
                Bukti nyata dedikasi dan kesungguhan santri PP DFI dalam mengasah potensi serta meraih keunggulan.
              </p>
            </div>

            <div className="space-y-6">
              {PRESTASI_LIST.map((item) => {
                const isJuara1 = item.peringkat.includes('Juara 1');
                const isJuara3 = item.peringkat.includes('Juara 3');
                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm hover:border-emerald-400 hover:shadow-lg transition-all duration-300 flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6 relative overflow-hidden"
                  >
                    <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl ${isJuara1 ? 'bg-amber-100 text-amber-900' : isJuara3 ? 'bg-emerald-100 text-emerald-900' : 'bg-stone-100 text-stone-900'} flex items-center justify-center shrink-0 shadow-sm`}>
                      <Trophy className="w-7 h-7 sm:w-8 sm:h-8" />
                    </div>

                    <div className="flex-grow">
                      <div className="flex items-center gap-3 flex-wrap mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-extrabold tracking-wide uppercase shadow-sm ${isJuara1 ? 'bg-amber-400 text-stone-950' : isJuara3 ? 'bg-emerald-700 text-white' : 'bg-stone-800 text-white'}`}>
                          {item.peringkat}
                        </span>
                        <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                          {item.santri}
                        </span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-stone-900 mb-2">{item.lomba}</h3>
                      <p className="text-xs sm:text-sm text-stone-600 leading-relaxed text-justify">{item.keterangan}</p>
                    </div>

                    <div className="shrink-0 pt-3 sm:pt-0 sm:pl-4 sm:border-l border-stone-100 flex items-center gap-1.5 text-xs text-stone-500 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                      <span>{item.tanggal}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* BERITA TERKINI */}
        <section id="berita" className="py-20 sm:py-28 bg-stone-50 border-y border-stone-200/70 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider mb-3">
                <Newspaper className="w-3.5 h-3.5" />
                Informasi & Update
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 tracking-tight">
                Berita Terkini
              </h2>
              <p className="mt-3 text-sm sm:text-base text-stone-600">
                Klik gambar atau judul berita untuk membaca warta & informasi secara lengkap.
              </p>
            </div>

            {loadingBerita ? (
              <div className="py-16 text-center flex flex-col items-center justify-center">
                <Loader2 className="w-8 h-8 text-emerald-700 animate-spin mb-3" />
                <p className="text-sm text-stone-500 font-medium">Memuat warta dan informasi terbaru...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
                {featuredNews && (
                  <div
                    className="lg:col-span-6 bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all duration-300 group cursor-pointer flex flex-col h-full"
                    onClick={() => setSelectedArticle(featuredNews)}
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
                      <img src={featuredNews.cover || PESANTREN_INFO.heroBackground} alt={featuredNews.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 rounded-full bg-emerald-800 text-white text-xs font-bold tracking-wide shadow-sm">
                          {featuredNews.category || 'Berita Utama'}
                        </span>
                      </div>
                    </div>

                    <div className="p-6 sm:p-8 flex flex-col flex-grow justify-between">
                      <div>
                        <div className="flex items-center gap-2 text-xs text-stone-500 mb-3">
                          <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                          <span>{formatTanggal(featuredNews.date)}</span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold text-stone-900 mb-3 group-hover:text-emerald-800 transition-colors line-clamp-2">
                          {featuredNews.title}
                        </h3>
                        <p className="text-stone-600 text-xs sm:text-sm leading-relaxed line-clamp-3 mb-4">
                          {featuredNews.content}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-stone-100 flex items-center gap-2 text-emerald-800 text-xs sm:text-sm font-bold group-hover:text-emerald-600 transition-colors">
                        <span>Baca Selengkapnya</span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                )}

                <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {secondaryNews.map((b) => (
                    <div
                      key={b.id}
                      onClick={() => setSelectedArticle(b)}
                      className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-lg hover:border-emerald-300 transition-all duration-300 group cursor-pointer flex flex-col"
                    >
                      <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
                        <img src={b.cover || PESANTREN_INFO.heroBackground} alt={b.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                        <div className="absolute top-2.5 left-2.5">
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-800/90 text-white text-[10px] font-bold">
                            {b.category || 'Warta'}
                          </span>
                        </div>
                      </div>
                      <div className="p-4 flex flex-col flex-grow justify-between">
                        <div>
                          <h4 className="text-sm font-bold text-stone-900 mb-2 line-clamp-2 group-hover:text-emerald-800 transition-colors">
                            {b.title}
                          </h4>
                        </div>
                        <div className="mt-2 pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-emerald-700" />
                            {formatTanggal(b.date)}
                          </span>
                          <span className="text-emerald-700 font-semibold group-hover:underline">Baca</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* TESTIMONI / BUKU TAMU */}
        <section id="testimoni" className="py-20 sm:py-28 bg-white relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-16">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider mb-3">
                <MessageSquareQuote className="w-3.5 h-3.5" />
                Suara Mereka
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 tracking-tight">
                Menurutmu, Bagaimana PP DFI itu?
              </h2>
              <p className="mt-3 text-sm sm:text-base text-stone-600">
                Bagikan pengalaman dan kesan pesan Anda bersama Pondok Pesantren Darul Fawaid Ilmiyah.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Form Testimoni */}
              <div className="lg:col-span-5 bg-stone-50 rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-emerald-700" />
                <h3 className="text-lg sm:text-xl font-bold text-stone-900 mb-1">Tulis Kesanmu</h3>
                <p className="text-xs text-stone-500 mb-6">Pendapat dan doa Anda sangat berarti bagi kemajuan pesantren kami.</p>

                <form onSubmit={handleTestimoniSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wide mb-1.5">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      required
                      value={nama}
                      onChange={(e) => setNama(e.target.value)}
                      placeholder="Masukkan nama Anda..."
                      className="w-full px-4 py-3 rounded-xl bg-white border border-stone-300 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20 text-sm text-stone-900 placeholder:text-stone-400 outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wide mb-1.5">
                      Komentar & Kesan
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={komentar}
                      onChange={(e) => setKomentar(e.target.value)}
                      placeholder="Tuliskan pengalaman luar biasamu di sini..."
                      className="w-full px-4 py-3 rounded-xl bg-white border border-stone-300 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20 text-sm text-stone-900 placeholder:text-stone-400 outline-none transition resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingTesti}
                    className="w-full py-3.5 px-6 rounded-full bg-emerald-800 hover:bg-emerald-700 disabled:bg-emerald-800/60 text-white font-bold text-sm tracking-wide shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    {submittingTesti ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Mengirim Kesan...</span>
                      </>
                    ) : submitSuccess ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-amber-300" />
                        <span>Berhasil Terkirim!</span>
                      </>
                    ) : (
                      <>
                        <span>Kirim Komentar</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Feed Testimoni */}
              <div className="lg:col-span-7 bg-stone-50 rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm flex flex-col h-full max-h-[580px]">
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-stone-200">
                  <span className="text-xs font-bold text-stone-700 uppercase tracking-wide">Daftar Kesan & Testimoni</span>
                  <span className="text-xs text-emerald-800 font-semibold">{testimoniList.length} Pesan Masuk</span>
                </div>

                <div className="overflow-y-auto space-y-3.5 pr-1 flex-grow">
                  {loadingTesti ? (
                    <div className="py-16 text-center flex flex-col items-center justify-center">
                      <Loader2 className="w-6 h-6 text-emerald-700 animate-spin mb-2" />
                      <p className="text-xs text-stone-500">Memuat testimoni...</p>
                    </div>
                  ) : testimoniList.length === 0 ? (
                    <div className="py-16 text-center text-stone-400 text-sm">
                      Belum ada testimoni. Jadilah yang pertama menuliskan kesan!
                    </div>
                  ) : (
                    testimoniList.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-4 sm:p-5 rounded-2xl bg-white border-l-4 border-emerald-700 border-t border-r border-b border-stone-200/80 shadow-sm"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                              {item.nama.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-bold text-sm text-stone-900">{item.nama}</span>
                          </div>
                          {item.waktu && (
                            <div className="flex items-center gap-1 text-[11px] text-stone-400">
                              <Clock className="w-3 h-3" />
                              <span>{item.waktu}</span>
                            </div>
                          )}
                        </div>
                        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed italic">
                          "{item.komentar}"
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* LOKASI PESANTREN */}
        <section id="lokasi" className="py-20 sm:py-28 bg-stone-50 border-y border-stone-200/70 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-16">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider mb-3">
                <MapPin className="w-3.5 h-3.5" />
                Kunjungi Kami
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 tracking-tight">
                Lokasi Pesantren
              </h2>
              <p className="mt-3 text-sm sm:text-base text-stone-600">
                Akses strategis dan mudah dijangkau di wilayah Besuk, Probolinggo, Jawa Timur.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm flex flex-col justify-between">
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-2.5 text-emerald-800 font-bold text-lg mb-2">
                      <MapPin className="w-5 h-5 text-emerald-700 shrink-0" />
                      <span>{PESANTREN_INFO.yayasanName}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed text-justify pl-7">
                      {PESANTREN_INFO.alamat}
                    </p>
                  </div>

                  <hr className="border-stone-100" />

                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-amber-50 text-amber-700 shrink-0 mt-0.5">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-stone-900 mb-1.5">Jam Operasional Kantor</h4>
                      <ul className="text-xs sm:text-sm text-stone-600 space-y-1">
                        <li><strong className="text-stone-800">Senin - Kamis:</strong> 08.00 WIB - 13.00 WIB</li>
                        <li><strong className="text-stone-800">Jum'at:</strong> 09.00 WIB - 15.00 WIB</li>
                        <li><strong className="text-stone-800">Sabtu & Ahad:</strong> 08.00 WIB - 12.00 WIB</li>
                      </ul>
                    </div>
                  </div>

                  <hr className="border-stone-100" />

                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 shrink-0 mt-0.5">
                      <Compass className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-stone-900 mb-1">Rute Transportasi</h4>
                      <p className="text-xs sm:text-sm text-stone-600 leading-relaxed text-justify">
                        {PESANTREN_INFO.ruteTransportasi}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-stone-100 flex flex-wrap gap-3">
                  <a
                    href="https://maps.app.goo.gl/YayasanDarulGhiranAlyamany"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Buka Rute di Google Maps</span>
                  </a>
                </div>
              </div>

              <div className="lg:col-span-6 bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-sm relative min-h-[350px] lg:min-h-[420px]">
                <iframe
                  src={PESANTREN_INFO.mapsIframeUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: '380px' }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Peta Lokasi PP Darul Fawaid Ilmiyah"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* ========================================================================= */}
      {/* 3. FOOTER */}
      {/* ========================================================================= */}
      <footer id="kontak" className="bg-emerald-950 text-white pt-16 pb-24 lg:pb-12 border-t border-emerald-900/60 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-14 border-b border-white/10">
            
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-white p-1 flex items-center justify-center">
                  <img src={PESANTREN_INFO.logoUrl} alt="Logo PP DFI" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">PP Darul Fawaid Ilmiyah</h3>
                  <p className="text-xs text-amber-300">Let's Join Us!</p>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-emerald-200/80 leading-relaxed text-justify">
                Yuk, ikuti perjalanan dan berbagai aktivitas kami! Dapatkan informasi terbaru seputar kegiatan pesantren, prestasi santri, serta berbagai konten inspiratif dengan mengikuti media sosial resmi kami.
              </p>

              <div className="flex items-center gap-3 pt-2">
                <a href={PESANTREN_INFO.socials.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 hover:bg-amber-400 hover:text-stone-950 text-white flex items-center justify-center transition-all duration-200 hover:-translate-y-1" aria-label="Facebook">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                </a>
                <a href={PESANTREN_INFO.socials.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 hover:bg-amber-400 hover:text-stone-950 text-white flex items-center justify-center transition-all duration-200 hover:-translate-y-1" aria-label="Instagram">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                </a>
                <a href={PESANTREN_INFO.socials.youtube} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 hover:bg-amber-400 hover:text-stone-950 text-white flex items-center justify-center transition-all duration-200 hover:-translate-y-1" aria-label="YouTube">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
                </a>
                <a href={PESANTREN_INFO.socials.tiktok} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 hover:bg-amber-400 hover:text-stone-950 text-white flex items-center justify-center transition-all duration-200 hover:-translate-y-1" aria-label="TikTok">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12.525.02c1.31 0 2.6.45 3.63 1.25.99.77 1.69 1.85 1.98 3.07.72-.05 1.44.02 2.14.21V8.5c-.75-.12-1.52-.08-2.26.11-.7.19-1.34.58-1.85 1.11-.53.54-.88 1.23-1.02 1.98a4.93 4.93 0 0 0-.08 1.64v5.39a6.34 6.34 0 0 1-1.86 4.49 6.36 6.36 0 0 1-4.5 1.86 6.37 6.37 0 0 1-4.51-1.86 6.34 6.34 0 0 1-1.86-4.5 6.34 6.34 0 0 1 1.86-4.49 6.36 6.36 0 0 1 4.5-1.86c.32 0 .64.03.95.08v3.91a2.45 2.45 0 0 0-.95-.19 2.46 2.46 0 0 0-1.74.72 2.46 2.46 0 0 0-.72 1.74c0 .65.25 1.28.72 1.74.46.47 1.09.72 1.74.72.65 0 1.28-.25 1.74-.72.47-.46.72-1.09.72-1.74V0h3.69z" /></svg>
                </a>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-4">
              <h3 className="font-bold text-base text-white">Hubungi Kami</h3>
              <ul className="space-y-3 text-xs sm:text-sm text-emerald-200/90">
                <li className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-white/10 text-amber-400 shrink-0 mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-white font-semibold block">{PESANTREN_INFO.whatsappPhone}</span>
                    <span className="text-[11px] text-emerald-300/80">Layanan Informasi & Humas</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-white/10 text-amber-400 shrink-0 mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-white font-semibold block">{PESANTREN_INFO.email}</span>
                    <span className="text-[11px] text-emerald-300/80">Surat & Korespondensi Resmi</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-white/10 text-amber-400 shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-white font-semibold block">Randujalak, Besuk, Probolinggo</span>
                    <span className="text-[11px] text-emerald-300/80">Jawa Timur, Indonesia (67283)</span>
                  </div>
                </li>
              </ul>
            </div>

            <div className="lg:col-span-4 space-y-4">
              <h3 className="font-bold text-base text-white">Pendaftaran & Layanan</h3>
              <p className="text-xs sm:text-sm text-emerald-200/80 leading-relaxed text-justify">
                Kami siap memberikan layanan informasi dan konsultasi bagi calon wali santri melalui media komunikasi yang mudah diakses, responsif, dan ramah.
              </p>

              <div className="flex flex-col gap-2.5 pt-2">
                <a
                  href={PESANTREN_INFO.registrationFormUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs uppercase tracking-wider shadow-md transition-all duration-200"
                >
                  <FileText className="w-4 h-4" />
                  <span>DAFTAR SEKARANG (PSB 2027)</span>
                </a>
                <a
                  href={PESANTREN_INFO.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all duration-200"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>HUBUNGI VIA WHATSAPP</span>
                </a>
              </div>
            </div>

          </div>

          <div className="pt-8 text-center text-xs text-emerald-300/70 space-y-1">
            <p className="font-medium text-emerald-200">
              Website Pondok Pesantren Darul Fawaid Ilmiyah
            </p>
            <p>
              Crafted with dedication by <strong className="text-white">Bintang Project</strong>
            </p>
            <p className="text-[11px] text-emerald-400/60">
              &copy; 2026 · Last updated: September 2026
            </p>
          </div>
        </div>
      </footer>

      {/* ========================================================================= */}
      {/* 4. FLOATING UTILITIES (Mobile Bar, Back to top, Lightbox, News Modal) */}
      {/* ========================================================================= */}
      
      {/* Mobile Sticky Bottom Bar */}
      <div
        id="mobile-bottom-bar"
        className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white/95 backdrop-blur-md border-t border-stone-200 shadow-2xl p-2.5 px-4"
      >
        <div className="grid grid-cols-2 gap-2.5 max-w-md mx-auto">
          <a
            id="mobile-btn-psb"
            href={PESANTREN_INFO.registrationFormUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-full bg-emerald-800 active:bg-emerald-900 text-white font-bold text-xs shadow-sm transition-transform active:scale-95"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>PSB 2027</span>
          </a>

          <a
            id="mobile-btn-wa"
            href={PESANTREN_INFO.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-full bg-emerald-600 active:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-transform active:scale-95"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Narahubung</span>
          </a>
        </div>
      </div>

      {/* Back to Top */}
      {showBackToTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-20 lg:bottom-8 right-5 z-40 p-3 rounded-full bg-emerald-800 hover:bg-emerald-700 text-white shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 border border-emerald-600/30"
          aria-label="Kembali ke atas"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}

      {/* Image Lightbox Modal */}
      {lightbox.isOpen && (
        <div
          className="fixed inset-0 z-50 bg-stone-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
          onClick={() => setLightbox({ isOpen: false, imageUrl: '', title: '' })}
        >
          <div
            className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full flex items-center justify-between text-white pb-3 px-2">
              <span className="text-sm font-semibold truncate max-w-xs sm:max-w-md text-stone-200">
                {lightbox.title || 'Dokumentasi'}
              </span>
              <button
                type="button"
                onClick={() => setLightbox({ isOpen: false, imageUrl: '', title: '' })}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-stone-900 border border-white/10 max-h-[80vh] flex items-center justify-center">
              <img src={lightbox.imageUrl} alt={lightbox.title} className="max-h-[78vh] w-auto object-contain select-none" />
            </div>
          </div>
        </div>
      )}

      {/* News Article Reader Modal */}
      {selectedArticle && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
          onClick={() => setSelectedArticle(null)}
        >
          <div
            className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-auto max-h-[92vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/80 backdrop-blur-md">
              <button
                type="button"
                onClick={() => setSelectedArticle(null)}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 text-xs sm:text-sm font-semibold transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali ke Beranda</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: selectedArticle.title,
                        text: selectedArticle.content.substring(0, 100) + '...',
                        url: window.location.href
                      }).catch(() => {});
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                      alert('Tautan berita berhasil disalin!');
                    }
                  }}
                  className="p-2 rounded-xl text-stone-600 hover:text-emerald-800 hover:bg-emerald-50 transition-colors"
                  title="Bagikan Berita"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedArticle(null)}
                  className="p-2 rounded-xl text-stone-400 hover:text-stone-900 hover:bg-stone-200/60"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 sm:p-10 overflow-y-auto space-y-6">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="px-3.5 py-1 rounded-full bg-emerald-800 text-white text-xs font-bold uppercase tracking-wider">
                  {selectedArticle.category || 'Berita'}
                </span>
                <span className="flex items-center gap-1.5 text-xs sm:text-sm text-stone-500 font-medium">
                  <Calendar className="w-4 h-4 text-emerald-700" />
                  {formatTanggal(selectedArticle.date)}
                </span>
              </div>

              <h1 className="text-xl sm:text-3xl font-extrabold text-stone-900 leading-tight">
                {selectedArticle.title}
              </h1>

              {selectedArticle.cover && (
                <div className="rounded-2xl overflow-hidden shadow-md aspect-[16/9] bg-stone-100 border border-stone-200/60">
                  <img src={selectedArticle.cover} alt={selectedArticle.title} className="w-full h-full object-cover" />
                </div>
              )}

              <div className="prose prose-stone max-w-none text-stone-700 text-sm sm:text-base leading-relaxed text-justify space-y-4">
                {selectedArticle.content.split('\n\n').map((para, i) => (
                  <p key={i} className="mb-4">{para}</p>
                ))}
              </div>

              {(selectedArticle.photo1 || selectedArticle.photo2 || selectedArticle.photo3) && (
                <div className="pt-6 border-t border-stone-200">
                  <div className="flex items-center gap-2 mb-4">
                    <ImageIcon className="w-5 h-5 text-emerald-700" />
                    <h4 className="font-bold text-stone-900 text-base">Dokumentasi Terkait</h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {selectedArticle.photo1 && (
                      <div className="rounded-xl overflow-hidden border border-stone-200 bg-stone-50 shadow-sm">
                        <img src={selectedArticle.photo1} alt={selectedArticle.caption1 || 'Foto 1'} className="w-full aspect-[4/3] object-cover" />
                        {selectedArticle.caption1 && (
                          <p className="p-2 text-center text-xs font-medium text-emerald-900 bg-emerald-50">{selectedArticle.caption1}</p>
                        )}
                      </div>
                    )}
                    {selectedArticle.photo2 && (
                      <div className="rounded-xl overflow-hidden border border-stone-200 bg-stone-50 shadow-sm">
                        <img src={selectedArticle.photo2} alt={selectedArticle.caption2 || 'Foto 2'} className="w-full aspect-[4/3] object-cover" />
                        {selectedArticle.caption2 && (
                          <p className="p-2 text-center text-xs font-medium text-emerald-900 bg-emerald-50">{selectedArticle.caption2}</p>
                        )}
                      </div>
                    )}
                    {selectedArticle.photo3 && (
                      <div className="rounded-xl overflow-hidden border border-stone-200 bg-stone-50 shadow-sm">
                        <img src={selectedArticle.photo3} alt={selectedArticle.caption3 || 'Foto 3'} className="w-full aspect-[4/3] object-cover" />
                        {selectedArticle.caption3 && (
                          <p className="p-2 text-center text-xs font-medium text-emerald-900 bg-emerald-50">{selectedArticle.caption3}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
