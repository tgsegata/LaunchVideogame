import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
if (typeof window !== 'undefined' && gsap && !gsap.core.globals().ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
}

// Utility: clamp
const clamp = (min, val, max) => Math.max(min, Math.min(val, max));

// Sticky Nav
function Nav({ sections }) {
  const navRef = useRef(null);
  useEffect(() => {
    const el = navRef.current;
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const down = y > lastY;
      lastY = y;
      el.style.transform = down && y > 80 ? 'translateY(-100%)' : 'translateY(0)';
      el.classList.toggle('backdrop-blur', y > 10);
      el.classList.toggle('bg-white/5', y > 10);
      el.classList.toggle('shadow-lg', y > 10);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToId = (id) => {
    const target = document.getElementById(id);
    if (!target) return;
    const y = target.getBoundingClientRect().top + window.scrollY - 72;
    window.scrollTo({ top: y, behavior: 'smooth' });
  };

  return (
    <nav ref={navRef} className="fixed top-0 inset-x-0 z-50 transition-transform duration-300">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        <button onClick={() => scrollToId('home')} className="text-xl font-black tracking-tight">NOYA</button>
        <ul className="hidden md:flex items-center gap-6 text-sm">
          {sections.map((s) => (
            <li key={s.id}>
              <button onClick={() => scrollToId(s.id)} className="hover:opacity-80 transition-opacity">{s.label}</button>
            </li>
          ))}
        </ul>
        <a href="#" className="rounded-full border px-4 py-2 text-xs">Wishlist</a>
      </div>
    </nav>
  );
}

// Hero Section with faux parallax background
function Hero() {
  const root = useRef(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-stagger="hero"]', { opacity: 0, y: 24, duration: 1.2, ease: 'power3.out', stagger: 0.12, delay: 0.2 });
      gsap.to('[data-parallax="bg"]', {
        yPercent: 10,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true }
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="home" ref={root} className="relative min-h-[110svh] flex items-center overflow-hidden">
      {/* Gradient/Noise backdrop */}
      <div data-parallax="bg" className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(80%_60%_at_50%_0%,rgba(99,102,241,0.25),transparent),linear-gradient(180deg,rgba(15,23,42,0.9),rgba(2,6,23,1))]">
        <div className="absolute inset-0 mix-blend-soft-light opacity-40" style={{backgroundImage:'url(https://upload.wikimedia.org/wikipedia/commons/5/5f/Noise_texture.jpg)', backgroundSize:'300px'}}/>
      </div>

      <div className="mx-auto max-w-7xl px-4 pt-24 pb-16">
        <p data-stagger="hero" className="uppercase tracking-[0.35em] text-xs text-white/70 mb-4">Interactive Teaser</p>
        <h1 data-stagger="hero" className="text-5xl md:text-7xl font-black leading-tight max-w-3xl">
          Enter the <span className="bg-gradient-to-r from-indigo-400 via-cyan-300 to-emerald-300 bg-clip-text text-transparent">Unfinished World</span>
        </h1>
        <p data-stagger="hero" className="mt-5 max-w-xl text-white/80">
          NOYA is a psychological exploration game where the world bends with your emotions. Step in, breathe, and see if you can find the exit—or yourself.
        </p>
        <div data-stagger="hero" className="mt-8 flex gap-3">
          <a href="#story" className="rounded-full bg-white/10 hover:bg-white/20 border border-white/20 px-5 py-3 text-sm">Learn More</a>
          <a href="#wishlist" className="rounded-full bg-white text-slate-900 px-5 py-3 text-sm font-semibold">Join Wishlist</a>
        </div>
      </div>

      {/* Floating badges */}
      <div className="pointer-events-none absolute right-6 bottom-10 md:right-10 md:bottom-16 flex flex-col gap-3">
        <div className="backdrop-blur bg-white/10 border border-white/20 px-3 py-2 rounded-2xl text-xs">GSAP + React + Tailwind</div>
        <div className="backdrop-blur bg-white/10 border border-white/20 px-3 py-2 rounded-2xl text-xs">Scroll-triggered effects</div>
      </div>
    </section>
  );
}

function Section({ id, eyebrow, title, children, align = 'left', className = '' }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    const q = gsap.utils.selector(el);
    const ctx = gsap.context(() => {
      gsap.from(q('[data-animate="fade-up"]'), {
        opacity: 0,
        y: 24,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.08,
        scrollTrigger: { trigger: el, start: 'top 80%' }
      });
    }, el);
    return () => ctx.revert();
  }, []);
  return (
    <section id={id} ref={ref} className={`relative py-24 md:py-36 ${className}`}>
      <div className="mx-auto max-w-7xl px-4">
        <div className={`grid md:grid-cols-12 gap-10 items-start`}>
          <div className={`md:col-span-5 ${align==='right' ? 'md:col-start-8' : ''}`}>
            <p data-animate="fade-up" className="uppercase tracking-[0.25em] text-[11px] text-white/60">{eyebrow}</p>
            <h2 data-animate="fade-up" className="text-3xl md:text-5xl font-black mt-3">{title}</h2>
          </div>
          <div className={`md:col-span-6 ${align==='right' ? 'md:col-start-2' : ''}`}>
            <div data-animate="fade-up" className="prose prose-invert prose-sm md:prose-base max-w-none">
              {children}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureGrid() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    const cards = el.querySelectorAll('[data-card]');
    const ctx = gsap.context(() => {
      cards.forEach((card, i) => {
        gsap.from(card, {
          opacity: 0,
          y: 24,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: card, start: 'top 90%' }
        });
      });
    }, el);
    return () => ctx.revert();
  }, []);

  const items = [
    { title: 'Emotion-Reactive UI', copy: 'The world shifts with your calm, fear, or focus. Subtle color and audio cues mirror how you feel.' },
    { title: 'Symbolic Puzzles', copy: 'Lightweight puzzles reveal meaning—less about winning, more about understanding.' },
    { title: 'Echo Versions of You', copy: 'Encounter fragments of self. Speak with them. Or don’t. Choices ripple quietly.' },
    { title: 'Hidden Third Path', copy: 'Some binaries are illusions. Freedom comes from stepping outside the options.' },
  ];

  return (
    <section id="features" ref={ref} className="py-24 md:py-36 bg-white/[0.02]">
      <div className="mx-auto max-w-7xl px-4">
        <h3 className="text-2xl md:text-4xl font-black mb-10">Core Features</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((it, idx) => (
            <article key={idx} data-card className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-5">
              <h4 className="font-semibold mb-2">{it.title}</h4>
              <p className="text-white/80 text-sm">{it.copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function GalleryMarquee() {
  const track = useRef(null);
  useEffect(() => {
    const el = track.current;
    const ctx = gsap.context(() => {
      const tween = gsap.to(el, { xPercent: -50, repeat: -1, ease: 'none', duration: 20 });
      return () => tween.kill();
    }, el);
    return () => ctx.revert();
  }, []);

  const tile = (i) => (
    <div key={i} className="h-44 w-[280px] shrink-0 rounded-xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5" />
  );

  return (
    <section id="gallery" className="py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-4">
        <h3 className="text-2xl md:text-4xl font-black mb-8">World Glimpses</h3>
      </div>
      <div className="overflow-hidden">
        <div ref={track} className="flex gap-4 px-4">
          {Array.from({ length: 14 }).map((_, i) => tile(i))}
          {Array.from({ length: 14 }).map((_, i) => tile(100 + i))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    const ctx = gsap.context(() => {
      gsap.from(el, { opacity: 0, y: 20, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 85%' } });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section id="wishlist" ref={ref} className="py-24 md:py-36">
      <div className="mx-auto max-w-3xl px-4 text-center">
        <h3 className="text-3xl md:text-5xl font-black">Be first to explore NOYA</h3>
        <p className="mt-4 text-white/80">Drop your email and get early access news, concept art, and behind-the-scenes dev logs.</p>
        <form className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <input className="w-full sm:w-80 rounded-full border border-white/20 bg-white/5 px-5 py-3 outline-none focus:ring-2 focus:ring-white/30" placeholder="you@domain.com" />
          <button className="rounded-full bg-white text-slate-900 px-6 py-3 font-semibold">Join</button>
        </form>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-10 text-center text-xs text-white/60">
      <div className="mx-auto max-w-7xl px-4">
        <p>© {new Date().getFullYear()} NOYA — A self-learning project by Tamires G. Segata</p>
      </div>
    </footer>
  );
}

export default function KPRStyleLanding() {
  const sections = [
    { id: 'story', label: 'Story' },
    { id: 'features', label: 'Features' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'wishlist', label: 'Wishlist' },
  ];

  // Global scroll-based hue shift for subtle dynamism
  useEffect(() => {
    const onScroll = () => {
      const p = clamp(0, window.scrollY / (document.body.scrollHeight - window.innerHeight), 1);
      document.documentElement.style.setProperty('--tw-hue', String(180 * p));
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen text-white bg-slate-950 selection:bg-indigo-500/40">
      <Nav sections={sections} />
      <Hero />

      <Section id="story" eyebrow="Lore" title="What is NOYA?">
        <p>
          NOYA is a first-person psychological exploration. There are no enemies, no timers—only your own
          responses to an unfinished world that changes with you. It’s a study in mood: color palettes shift,
          ambient audio breathes, and paths appear or vanish depending on how you move and pause.
        </p>
        <p>
          This site is my self-learning project: React for components, Tailwind for styling, and GSAP for animation
          and scroll-triggered storytelling. It’s inspired by kprverse.com—rebuilt with my own theme and content.
        </p>
      </Section>

      <FeatureGrid />
      <GalleryMarquee />
      <CTA />
      <Footer />
    </div>
  );
}
