"use client";

import { useState, useEffect, useRef } from "react";

// ── Constants ──────────────────────────────────────────────────────────────

const NAV_LINKS = ["Home", "Services", "Usage", "Gallery", "Contact", "Privacy"];
const SECTION_IDS = ["hero", "services", "usage", "gallery", "contact", "privacy"];

const SERVICES = [
  {
    type: "SALE", icon: "✦", tag: "Own It Forever", accent: "#FFD700",
    desc: "Premium lighting products crafted for permanence. Invest once, illuminate always.",
    items: ["LED Pixel Panels", "RGB Strip Systems", "Smart Controllers", "Neon Flex Signs", "Facade Lighting Kits", "Ambient Fixtures"],
  },
  {
    type: "RENT", icon: "◈", tag: "Event Ready", accent: "#00E5FF",
    desc: "Transform any event with professional-grade lighting, fully managed by our team.",
    items: ["Stage Wash Lights", "Moving Head Rigs", "Laser Systems", "LED Video Walls", "Uplighter Sets", "DJ Booth Lighting"],
  },
];

const USAGES = [
  { label: "Events & Celebrations", icon: "🎆", desc: "Weddings, concerts, product launches, award ceremonies.", bg: "linear-gradient(135deg,#1a0533,#3d0d6b)" },
  { label: "Residential & Homes",   icon: "🏠", desc: "Ambient mood lighting, architectural accents, smart home integrations.", bg: "linear-gradient(135deg,#0a1a2a,#0d3d5c)" },
  { label: "Corporate & Offices",   icon: "🏢", desc: "Branded lobbies, boardroom ambience, commercial exteriors.", bg: "linear-gradient(135deg,#0d1f0d,#1a4d1a)" },
  { label: "Retail & Showrooms",    icon: "🛍️", desc: "Highlight products and build brand atmosphere with precision lighting.", bg: "linear-gradient(135deg,#2a1a00,#5c3d00)" },
  { label: "Hospitality & Hotels",  icon: "🌙", desc: "Luxury atmospheres for lobbies, restaurants, rooftops and suites.", bg: "linear-gradient(135deg,#1a0a1a,#4d1a4d)" },
  { label: "Outdoor & Facades",     icon: "✨", desc: "Architectural washes, garden lighting, billboard illumination.", bg: "linear-gradient(135deg,#001a2a,#003d5c)" },
];

// ─────────────────────────────────────────────────────────────────────
// GALLERY IMAGES — edit this list to add/remove/rename your photos
// 1. Put image files inside the  public/gallery/  folder in your project
// 2. Each entry: src = filename, label = caption, cat = category tag
// ─────────────────────────────────────────────────────────────────────
const GALLERY_ITEMS = [
  { src: "wedding.jpg",  label: "Wedding Reception", cat: "Event"       },
  { src: "concert.jpg",  label: "Concert Stage",     cat: "Event"       },
  { src: "villa.jpg",    label: "Luxury Villa",      cat: "Home"        },
  { src: "lobby.jpg",    label: "Corporate Lobby",   cat: "Office"      },
  { src: "rooftop.jpg",  label: "Hotel Rooftop",     cat: "Hospitality" },
  { src: "retail.jpg",   label: "Retail Showroom",   cat: "Retail"      },
  { src: "facade.jpg",   label: "Outdoor Facade",    cat: "Outdoor"     },
  { src: "dj.jpg",       label: "DJ Setup",          cat: "Event"       },
];

const PP_ITEMS = [
  { title: "01. Information We Collect",  text: "When you interact with our website, contact forms, or advertisements, we may collect your name, phone number, email address, and general location. This data is used solely to respond to your inquiries and provide relevant services." },
  { title: "02. How We Use Your Data",    text: "Your information is used to process service requests, send quotes, follow up on inquiries, and improve our services. We do not sell, trade, or transfer your personal information to third parties without your explicit consent." },
  { title: "03. Advertising & Cookies",  text: "We may use Google Ads and Meta (Facebook/Instagram) to show relevant promotions. These platforms may use cookies to personalise ad content. You can opt out via your browser settings or the respective platform's privacy controls." },
  { title: "04. Google Ads Compliance",  text: "Our advertising complies with Google's advertising policies. We participate in remarketing to show relevant ads to previous visitors based on their visits to our site and other sites on the Internet." },
  { title: "05. Data Security",          text: "We implement industry-standard security measures including SSL encryption for all data transmissions. However, no method of internet transmission is 100% secure." },
  { title: "06. Your Rights",            text: "You have the right to access, correct, or delete your personal data at any time. Contact us at privacy@skydigilights.com and we will respond within 30 days." },
  { title: "07. Contact & Updates",      text: "This policy is effective as of January 2024 and may be updated periodically. For privacy enquiries: Skydigi Lights, Mumbai, Maharashtra, India · privacy@skydigilights.com" },
];

// Deterministic particles — no Math.random() to avoid SSR mismatch
const PARTICLES = Array.from({ length: 24 }, (_, i) => ({
  size: 1 + (i * 0.37) % 3,
  left: ((i * 37.3) % 100).toFixed(1),
  top:  ((i * 53.7) % 100).toFixed(1),
  color: i % 3 === 0 ? "#FFD700" : i % 3 === 1 ? "#00E5FF" : "#ffffff",
  opacity: (0.1 + (i * 0.023) % 0.6).toFixed(2),
  duration: (3 + (i * 0.27) % 4).toFixed(1),
  delay: ((i * 0.19) % 5).toFixed(1),
}));

const inputStyle = {
  background: "#0d0d16", border: "1px solid #ffffff0e", color: "#fff",
  padding: "13px 16px", fontFamily: "'Rajdhani',sans-serif", fontSize: 14,
  width: "100%", outline: "none", transition: "border-color 0.3s", letterSpacing: "0.5px",
};

// ── Hooks ──────────────────────────────────────────────────────────────────

function useBreakpoint(onResize) {
  const [w, setW] = useState(1200);
  const onResizeRef = useRef(onResize);
  useEffect(() => {
    onResizeRef.current = onResize;
  });
  useEffect(() => {
    const update = () => {
      const next = window.innerWidth;
      setW(next);
      onResizeRef.current?.(next);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return { isMobile: w < 640, isTablet: w < 1024, w };
}

function useInView(threshold = 0.12) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

// ── Primitives ─────────────────────────────────────────────────────────────

function AnimSection({ children, style = {}, delay = 0 }) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? "translateY(0)" : "translateY(36px)",
      transition: `opacity 0.75s ${delay}s ease, transform 0.75s ${delay}s ease`,
      ...style,
    }}>
      {children}
    </div>
  );
}

function SectionTag({ children }) {
  return (
    <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 11, letterSpacing: 4, textTransform: "uppercase", color: "#FFD700", display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
      <span style={{ display: "inline-block", width: 24, height: 1, background: "#FFD700", flexShrink: 0 }} />
      {children}
    </div>
  );
}

function Divider() {
  return <div style={{ width: 52, height: 2, background: "linear-gradient(90deg,#FFD700,#00E5FF)", margin: "16px 0 40px" }} />;
}

function PrimaryBtn({ children, onClick, style = {} }) {
  return (
    <button onClick={onClick} style={{
      fontFamily: "'Rajdhani',sans-serif", fontWeight: 600, letterSpacing: 2,
      textTransform: "uppercase", fontSize: 12, padding: "12px 28px",
      background: "linear-gradient(135deg,#FFD700,#FFA500)", color: "#000",
      border: "none", cursor: "pointer",
      clipPath: "polygon(7px 0%,100% 0%,calc(100% - 7px) 100%,0% 100%)",
      transition: "transform 0.3s, box-shadow 0.3s", ...style,
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 28px #FFD70055"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
    >{children}</button>
  );
}

function OutlineBtn({ children, onClick, style = {} }) {
  return (
    <button onClick={onClick} style={{
      fontFamily: "'Rajdhani',sans-serif", fontWeight: 600, letterSpacing: 2,
      textTransform: "uppercase", fontSize: 12, padding: "11px 28px",
      background: "transparent", color: "#00E5FF", border: "1px solid #00E5FF44",
      cursor: "pointer", clipPath: "polygon(7px 0%,100% 0%,calc(100% - 7px) 100%,0% 100%)",
      transition: "all 0.3s", ...style,
    }}
      onMouseEnter={e => { e.currentTarget.style.background = "#00E5FF11"; e.currentTarget.style.borderColor = "#00E5FF"; e.currentTarget.style.boxShadow = "0 0 18px #00E5FF22"; }}
      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "#00E5FF44"; e.currentTarget.style.boxShadow = "none"; }}
    >{children}</button>
  );
}

// ── Sections ───────────────────────────────────────────────────────────────

function HeroSection({ scrollTo, isMobile }) {
  const pad = isMobile ? "100px 24px 70px" : "130px 24px 90px";
  return (
    <section id="hero" style={{ minHeight: "100svh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", background: "radial-gradient(ellipse 80% 60% at 50% 40%,#1c0f00,#050508 70%)" }}>
      {/* Particles */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        {PARTICLES.map((p, i) => (
          <div key={i} style={{ position: "absolute", borderRadius: "50%", width: p.size, height: p.size, left: `${p.left}%`, top: `${p.top}%`, background: p.color, opacity: p.opacity, animation: `sdFloat ${p.duration}s ease-in-out ${p.delay}s infinite` }} />
        ))}
      </div>
      <div style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle,#FFD70012 0%,transparent 70%)", top: -80, left: -80, pointerEvents: "none" }} />
      <div style={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,#00E5FF0b 0%,transparent 70%)", bottom: 0, right: -40, pointerEvents: "none" }} />

      <div style={{ textAlign: "center", position: "relative", zIndex: 1, padding: pad, width: "100%", maxWidth: 800, margin: "0 auto", animation: "sdFadeUp 0.9s ease forwards" }}>
        <SectionTag>Premium Lighting Solutions · Est. 2024</SectionTag>

        <div style={{ fontSize: "clamp(48px,12vw,120px)", fontWeight: 300, lineHeight: 0.9, letterSpacing: -2, background: "linear-gradient(135deg,#fff 30%,#FFD700 70%,#FFA500 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", backgroundSize: "800px 100%", animation: "sdShimmer 6s linear infinite" }}>
          SKYDIGI
        </div>
        <div style={{ fontSize: "clamp(48px,12vw,120px)", fontWeight: 700, lineHeight: 0.9, letterSpacing: -2, background: "linear-gradient(135deg,#00E5FF,#0099cc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", marginBottom: 24 }}>
          LIGHTS
        </div>

        <p style={{ fontSize: "clamp(15px,2.5vw,19px)", fontWeight: 300, color: "#999", maxWidth: 500, margin: "0 auto 12px", lineHeight: 1.7 }}>
          We illuminate spaces, events, and emotions. From elegant residential lighting to breathtaking event spectacles — your vision, illuminated.
        </p>
        <p style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 11, letterSpacing: 3, color: "#FFD700", marginBottom: 40, textTransform: "uppercase" }}>
          Mumbai, India · Sale &amp; Rental Services
        </p>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <PrimaryBtn onClick={() => scrollTo("services")}>Explore Services</PrimaryBtn>
          <OutlineBtn onClick={() => scrollTo("contact")}>Get in Touch</OutlineBtn>
        </div>

        <div style={{ marginTop: 60, display: "flex", justifyContent: "center", gap: isMobile ? 28 : 52, flexWrap: "wrap" }}>
          {[["500+", "Projects Done"], ["8+", "Years Exp."], ["100%", "Satisfaction"]].map(([num, lbl]) => (
            <div key={lbl} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "clamp(24px,5vw,40px)", fontWeight: 600, fontFamily: "'Rajdhani',sans-serif", letterSpacing: 2, background: "linear-gradient(135deg,#FFD700,#FFA500)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{num}</div>
              <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 9, letterSpacing: 3, color: "#555", textTransform: "uppercase" }}>{lbl}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ position: "absolute", bottom: 24, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, opacity: 0.35 }}>
        <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 9, letterSpacing: 4 }}>SCROLL</div>
        <div style={{ width: 1, height: 32, background: "linear-gradient(to bottom,#FFD700,transparent)", animation: "sdFloat 2s ease-in-out infinite" }} />
      </div>
    </section>
  );
}

function ServicesSection({ scrollTo, isMobile }) {
  const pad = isMobile ? "72px 20px" : "110px 5vw";
  return (
    <section id="services" style={{ padding: pad, background: "#070710" }}>
      <AnimSection>
        <SectionTag>What We Offer</SectionTag>
        <h2 style={{ fontSize: "clamp(28px,6vw,64px)", fontWeight: 300, lineHeight: 1.05, marginBottom: 10 }}>
          Sale &amp; <span style={{ color: "#FFD700" }}>Rental</span>
        </h2>
        <Divider />
        <p style={{ color: "#888", fontSize: isMobile ? 15 : 17, maxWidth: 480, lineHeight: 1.75, marginBottom: 44, fontWeight: 300 }}>
          Whether you need a permanent installation or a one-time spectacular event setup — we have you covered.
        </p>
      </AnimSection>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2,1fr)", gap: isMobile ? 16 : 2 }}>
        {SERVICES.map((svc, i) => (
          <AnimSection key={svc.type} delay={i * 0.15}>
            <div style={{ padding: isMobile ? "32px 24px" : "44px 36px", background: "linear-gradient(135deg,#0d0d16,#0a0a13)", border: "1px solid #ffffff0e", position: "relative", overflow: "hidden", transition: "transform 0.4s,border-color 0.4s", height: "100%" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.borderColor = "#ffffff22"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "#ffffff0e"; }}
            >
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,transparent,${svc.accent},transparent)` }} />
              <div style={{ position: "absolute", top: -10, right: -20, opacity: 0.03, fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: 140, lineHeight: 1, pointerEvents: "none", color: "#fff" }}>{svc.type}</div>

              <div style={{ width: 44, height: 44, borderRadius: "50%", border: `1px solid ${svc.accent}33`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: svc.accent, marginBottom: 14 }}>{svc.icon}</div>
              <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 24, fontWeight: 700, letterSpacing: 3, color: svc.accent }}>{svc.type}</div>
              <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 10, letterSpacing: 3, color: "#555", textTransform: "uppercase", marginBottom: 14 }}>{svc.tag}</div>
              <p style={{ color: "#888", fontSize: 14, lineHeight: 1.75, fontWeight: 300, marginBottom: 24 }}>{svc.desc}</p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 28 }}>
                {svc.items.map(item => (
                  <div key={item} style={{ display: "flex", alignItems: "center", gap: 8, color: "#bbb", fontSize: 13 }}>
                    <div style={{ width: 4, height: 4, borderRadius: "50%", background: svc.accent, flexShrink: 0 }} />
                    {item}
                  </div>
                ))}
              </div>

              {i === 0
                ? <PrimaryBtn onClick={() => scrollTo("contact")}>Buy Now →</PrimaryBtn>
                : <OutlineBtn onClick={() => scrollTo("contact")}>Rent for Event →</OutlineBtn>
              }
            </div>
          </AnimSection>
        ))}
      </div>
    </section>
  );
}

function UsageSection({ isMobile }) {
  const pad = isMobile ? "72px 20px" : "110px 5vw";
  const cols = isMobile ? "1fr 1fr" : "repeat(auto-fill,minmax(260px,1fr))";
  return (
    <section id="usage" style={{ padding: pad, background: "#050508" }}>
      <AnimSection>
        <SectionTag>Applications</SectionTag>
        <h2 style={{ fontSize: "clamp(28px,6vw,64px)", fontWeight: 300, lineHeight: 1.05, marginBottom: 10 }}>
          Where We <span style={{ color: "#00E5FF" }}>Illuminate</span>
        </h2>
        <Divider />
        <p style={{ color: "#888", fontSize: isMobile ? 15 : 17, maxWidth: 480, lineHeight: 1.75, marginBottom: 44, fontWeight: 300 }}>
          From intimate homes to grand corporate facades, our lighting transforms every environment.
        </p>
      </AnimSection>

      <div style={{ display: "grid", gridTemplateColumns: cols, gap: isMobile ? 10 : 14 }}>
        {USAGES.map((u, i) => (
          <AnimSection key={u.label} delay={i * 0.07}>
            <div style={{ padding: isMobile ? "24px 18px" : "34px 26px", background: u.bg, position: "relative", overflow: "hidden", border: "1px solid #ffffff0a", transition: "transform 0.4s,border-color 0.4s,box-shadow 0.4s", cursor: "default" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.borderColor = "#ffffff22"; e.currentTarget.style.boxShadow = "0 16px 40px #00000055"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "#ffffff0a"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.52)" }} />
              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ fontSize: isMobile ? 24 : 30, marginBottom: 10 }}>{u.icon}</div>
                <h3 style={{ fontSize: isMobile ? 14 : 18, fontWeight: 500, marginBottom: 8, lineHeight: 1.3 }}>{u.label}</h3>
                {!isMobile && <p style={{ color: "#aaa", fontSize: 13, lineHeight: 1.65, fontWeight: 300 }}>{u.desc}</p>}
              </div>
            </div>
          </AnimSection>
        ))}
      </div>
    </section>
  );
}

function GallerySection({ scrollTo, isMobile }) {
  const pad = isMobile ? "72px 20px" : "110px 5vw";
  const cols = isMobile ? "repeat(2,1fr)" : "repeat(auto-fill,minmax(260px,1fr))";

  // Category filter
  const allCats = ["All", ...Array.from(new Set(GALLERY_ITEMS.map(g => g.cat)))];
  const [activeCat, setActiveCat] = useState("All");
  const filtered = activeCat === "All" ? GALLERY_ITEMS : GALLERY_ITEMS.filter(g => g.cat === activeCat);

  // Lightbox
  const [lightbox, setLightbox] = useState(null); // index or null

  // Close lightbox on Escape key
  useEffect(() => {
    if (lightbox === null) return;
    const handler = (e) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") setLightbox(i => (i + 1) % filtered.length);
      if (e.key === "ArrowLeft")  setLightbox(i => (i - 1 + filtered.length) % filtered.length);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightbox, filtered.length]);

  return (
    <section id="gallery" style={{ padding: pad, background: "#070710" }}>
      <AnimSection>
        <SectionTag>Portfolio</SectionTag>
        <h2 style={{ fontSize: "clamp(28px,6vw,64px)", fontWeight: 300, lineHeight: 1.05, marginBottom: 10 }}>
          Our <span style={{ color: "#FFD700" }}>Work</span>
        </h2>
        <Divider />
        <p style={{ color: "#888", fontSize: isMobile ? 15 : 17, maxWidth: 480, lineHeight: 1.75, marginBottom: 32, fontWeight: 300 }}>
          A glimpse into the worlds we&apos;ve illuminated.
        </p>
      </AnimSection>

      {/* Category filter pills */}
      <AnimSection style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {allCats.map(cat => (
            <button key={cat} onClick={() => setActiveCat(cat)} style={{
              fontFamily: "'Rajdhani',sans-serif", fontSize: 11, letterSpacing: 2,
              textTransform: "uppercase", padding: "7px 16px", cursor: "pointer",
              border: `1px solid ${activeCat === cat ? "#FFD700" : "#ffffff18"}`,
              background: activeCat === cat ? "#FFD70015" : "transparent",
              color: activeCat === cat ? "#FFD700" : "#666",
              transition: "all 0.25s",
            }}
              onMouseEnter={e => { if (activeCat !== cat) { e.currentTarget.style.borderColor = "#ffffff33"; e.currentTarget.style.color = "#aaa"; }}}
              onMouseLeave={e => { if (activeCat !== cat) { e.currentTarget.style.borderColor = "#ffffff18"; e.currentTarget.style.color = "#666"; }}}
            >{cat}</button>
          ))}
        </div>
      </AnimSection>

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: cols, gap: isMobile ? 8 : 10 }}>
        {filtered.map((item, i) => (
          <AnimSection key={item.src} delay={i * 0.04}>
            <div
              onClick={() => setLightbox(i)}
              style={{ height: isMobile ? 160 : 240, position: "relative", overflow: "hidden", border: "1px solid #ffffff07", cursor: "zoom-in" }}
              onMouseEnter={e => {
                e.currentTarget.querySelector(".gi-img").style.transform = "scale(1.06)";
                e.currentTarget.querySelector(".gi-ov").style.opacity = "1";
              }}
              onMouseLeave={e => {
                e.currentTarget.querySelector(".gi-img").style.transform = "scale(1)";
                e.currentTarget.querySelector(".gi-ov").style.opacity = "0";
              }}
            >
              {/* Real image — falls back to placeholder if file missing */}
              <img
                className="gi-img"
                src={`/gallery/${item.src}`}
                alt={item.label}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.55s" }}
                onError={e => {
                  // If image missing, show a styled placeholder div instead
                  e.currentTarget.style.display = "none";
                  e.currentTarget.nextSibling.style.display = "flex";
                }}
              />
              {/* Placeholder shown only when image fails to load */}
              <div className="gi-img" style={{ display: "none", width: "100%", height: "100%", position: "absolute", top: 0, left: 0, background: "linear-gradient(135deg,#0a0a16,#14141f)", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 8, transition: "transform 0.55s" }}>
                <div style={{ fontSize: 28, opacity: 0.3 }}>🖼️</div>
                <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 9, letterSpacing: 3, color: "#444" }}>{item.src}</div>
              </div>

              {/* Hover overlay */}
              <div className="gi-ov" style={{ position: "absolute", inset: 0, opacity: 0, transition: "opacity 0.35s", background: "linear-gradient(to top,rgba(0,0,0,.88) 0%,transparent 60%)", display: "flex", alignItems: "flex-end", padding: isMobile ? 10 : 14, pointerEvents: "none" }}>
                <div>
                  <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 9, letterSpacing: 3, color: "#FFD700", textTransform: "uppercase", marginBottom: 3 }}>{item.cat}</div>
                  <div style={{ fontWeight: 500, fontSize: isMobile ? 12 : 14 }}>{item.label}</div>
                </div>
              </div>
            </div>
          </AnimSection>
        ))}
      </div>

      <AnimSection delay={0.1} style={{ textAlign: "center", marginTop: 44 }}>
        <OutlineBtn onClick={() => scrollTo("contact")}>Request Portfolio PDF</OutlineBtn>
      </AnimSection>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          onClick={() => setLightbox(null)}
          style={{ position: "fixed", inset: 0, zIndex: 999, background: "rgba(0,0,0,0.95)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
        >
          {/* Close */}
          <button onClick={() => setLightbox(null)} style={{ position: "absolute", top: 20, right: 24, background: "none", border: "1px solid #ffffff22", color: "#fff", fontSize: 18, width: 40, height: 40, cursor: "pointer", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>

          {/* Prev */}
          <button
            onClick={e => { e.stopPropagation(); setLightbox(i => (i - 1 + filtered.length) % filtered.length); }}
            style={{ position: "absolute", left: isMobile ? 8 : 24, background: "none", border: "1px solid #ffffff22", color: "#fff", fontSize: 20, width: 44, height: 44, cursor: "pointer", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", transition: "border-color 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#FFD700"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#ffffff22"; }}
          >‹</button>

          {/* Image */}
          <div onClick={e => e.stopPropagation()} style={{ maxWidth: "90vw", maxHeight: "85vh", position: "relative" }}>
            <img
              src={`/gallery/${filtered[lightbox].src}`}
              alt={filtered[lightbox].label}
              style={{ maxWidth: "90vw", maxHeight: "80vh", objectFit: "contain", display: "block", border: "1px solid #ffffff11" }}
            />
            <div style={{ marginTop: 14, textAlign: "center" }}>
              <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 10, letterSpacing: 3, color: "#FFD700", textTransform: "uppercase", marginBottom: 4 }}>{filtered[lightbox].cat}</div>
              <div style={{ fontSize: 18, fontWeight: 400 }}>{filtered[lightbox].label}</div>
              <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 10, color: "#444", marginTop: 6, letterSpacing: 2 }}>{lightbox + 1} / {filtered.length}</div>
            </div>
          </div>

          {/* Next */}
          <button
            onClick={e => { e.stopPropagation(); setLightbox(i => (i + 1) % filtered.length); }}
            style={{ position: "absolute", right: isMobile ? 8 : 24, background: "none", border: "1px solid #ffffff22", color: "#fff", fontSize: 20, width: 44, height: 44, cursor: "pointer", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", transition: "border-color 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#FFD700"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#ffffff22"; }}
          >›</button>
        </div>
      )}
    </section>
  );
}

function ContactSection({ isMobile }) {
  const pad = isMobile ? "72px 20px" : "110px 5vw";

  const [form, setForm] = useState({
    from_name: "", phone: "", from_email: "", inquiry_type: "", message: "",
  });
  // status: "idle" | "sending" | "success" | "error"
  const [status, setStatus] = useState("idle");
  const [errMsg, setErrMsg] = useState("");

  const update = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.from_name.trim() || !form.phone.trim()) {
      alert("Please enter your name and phone number.");
      return;
    }
    setStatus("sending");
    try {
      // Use full absolute URL — works regardless of subfolder or CDN setup
      const url = "https://skydigi-lights.vercel.app/contact.php";
      
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      let data = {};
      try {
        data = await res.json();
      } catch {
        // Response wasn't JSON — likely PHP error page or 404
        const text = await res.text().catch(() => "");
        setErrMsg("Server returned non-JSON response. Make sure contact.php is in public_html. Got: " + text.slice(0, 120));
        setStatus("error");
        return;
      }

      if (res.ok && data.success) {
        setStatus("success");
        setForm({ from_name: "", phone: "", from_email: "", inquiry_type: "", message: "" });
      } else {
        setErrMsg(data.message || "Unknown error");
        setStatus("error");
      }
    } catch (err) {
      setErrMsg("Network error: " + err.message);
      setStatus("error");
    }
  };

  const focusStyle = (e) => { e.currentTarget.style.borderColor = "#FFD70044"; };
  const blurStyle  = (e) => { e.currentTarget.style.borderColor = "#ffffff0e"; };

  return (
    <section id="contact" style={{ padding: pad, background: "#050508" }}>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit,minmax(280px,1fr))", gap: isMobile ? 48 : 72, alignItems: "start" }}>

        {/* Left — info */}
        <AnimSection>
          <SectionTag>Get In Touch</SectionTag>
          <h2 style={{ fontSize: "clamp(28px,6vw,58px)", fontWeight: 300, lineHeight: 1.05, marginBottom: 10 }}>
            Let&apos;s Create <br /><span style={{ color: "#FFD700" }}>Something</span><br />Brilliant
          </h2>
          <Divider />
          <p style={{ color: "#888", fontSize: isMobile ? 15 : 16, lineHeight: 1.8, marginBottom: 36, fontWeight: 300 }}>
            Have a project in mind? An event to illuminate? We&apos;d love to hear from you.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 18, marginBottom: 32 }}>
            {[
              { icon: "📍", label: "Location", value: "Mumbai, Maharashtra, India" },
              { icon: "📞", label: "Phone",    value: "+91 98765 43210" },
              { icon: "✉️", label: "Email",    value: "hello@skydigilights.com" },
              { icon: "⏰", label: "Hours",    value: "Mon–Sat: 9AM – 7PM IST" },
            ].map(({ icon, label, value }) => (
              <div key={label} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", border: "1px solid #FFD70022", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 14 }}>{icon}</div>
                <div>
                  <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 10, letterSpacing: 3, color: "#FFD700", marginBottom: 2 }}>{label}</div>
                  <div style={{ color: "#ddd", fontSize: 14 }}>{value}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {["Instagram", "Facebook", "WhatsApp", "YouTube"].map(s => (
              <button key={s} style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 10, letterSpacing: 2, padding: "7px 12px", border: "1px solid #ffffff11", color: "#777", cursor: "pointer", transition: "all 0.3s", textTransform: "uppercase", background: "none" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#FFD70033"; e.currentTarget.style.color = "#FFD700"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#ffffff11"; e.currentTarget.style.color = "#777"; }}
              >{s}</button>
            ))}
          </div>
        </AnimSection>

        {/* Right — form */}
        <AnimSection delay={0.15}>
          <div style={{ background: "#0a0a13", border: "1px solid #ffffff09", padding: isMobile ? "28px 20px" : "42px 34px" }}>
            <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 15, letterSpacing: 3, marginBottom: 24 }}>SEND A MESSAGE</div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <input
                placeholder="Your Name *"
                value={form.from_name}
                onChange={update("from_name")}
                style={inputStyle}
                onFocus={focusStyle} onBlur={blurStyle}
              />
              <input
                placeholder="Phone / WhatsApp *"
                value={form.phone}
                onChange={update("phone")}
                style={inputStyle}
                onFocus={focusStyle} onBlur={blurStyle}
              />
              <input
                placeholder="Email Address"
                value={form.from_email}
                onChange={update("from_email")}
                style={inputStyle}
                onFocus={focusStyle} onBlur={blurStyle}
              />
              <select
                value={form.inquiry_type}
                onChange={update("inquiry_type")}
                style={{ ...inputStyle, cursor: "pointer" }}
                onFocus={focusStyle} onBlur={blurStyle}
              >
                <option value="">Select Inquiry Type</option>
                <option>Purchase Lighting Products</option>
                <option>Rent for Event</option>
                <option>Home / Office Installation</option>
                <option>Corporate Project</option>
                <option>Custom Quote</option>
              </select>
              <textarea
                placeholder="Describe your project..."
                value={form.message}
                onChange={update("message")}
                rows={4}
                style={{ ...inputStyle, resize: "vertical" }}
                onFocus={focusStyle} onBlur={blurStyle}
              />

              {/* Submit button */}
              <PrimaryBtn
                onClick={handleSubmit}
                style={{ width: "100%", padding: 14, opacity: status === "sending" ? 0.7 : 1 }}
              >
                {status === "sending" ? "Sending..." : status === "success" ? "Message Sent ✓" : "Send Enquiry →"}
              </PrimaryBtn>
            </div>

            {/* Status messages */}
            {status === "success" && (
              <div style={{ marginTop: 16, padding: "12px 16px", background: "#0a2a0a", border: "1px solid #FFD70033", fontFamily: "'Rajdhani',sans-serif", fontSize: 13, color: "#FFD700", letterSpacing: 1 }}>
                ✓ Your enquiry has been sent! We will contact you within 24 hours.
              </div>
            )}
            {status === "error" && (
              <div style={{ marginTop: 16, padding: "12px 16px", background: "#2a0a0a", border: "1px solid #ff444433", fontFamily: "'Rajdhani',sans-serif", fontSize: 12, color: "#ff6666", letterSpacing: 1, lineHeight: 1.6 }}>
                ✕ {errMsg || "Something went wrong. Please call us directly or try again."}
              </div>
            )}

            <p style={{ color: "#383838", fontSize: 11, marginTop: 14, fontFamily: "'Rajdhani',sans-serif", letterSpacing: 1, lineHeight: 1.6 }}>
              * Required fields. We typically respond within 24 hours.
            </p>
          </div>
        </AnimSection>

      </div>
    </section>
  );
}

function PrivacySection({ isMobile }) {
  const pad = isMobile ? "64px 20px" : "90px 5vw";
  return (
    <section id="privacy" style={{ padding: pad, background: "#070710", borderTop: "1px solid #ffffff07" }}>
      <AnimSection>
        <SectionTag>Legal</SectionTag>
        <h2 style={{ fontSize: "clamp(24px,4vw,48px)", fontWeight: 300, marginBottom: 10 }}>
          Privacy <span style={{ color: "#FFD700" }}>Policy</span>
        </h2>
        <Divider />
      </AnimSection>
      <div style={{ maxWidth: 760, display: "flex", flexDirection: "column", gap: 22 }}>
        {PP_ITEMS.map((item, i) => (
          <AnimSection key={item.title} delay={i * 0.04}>
            <div style={{ borderLeft: "2px solid #FFD70020", paddingLeft: 20 }}>
              <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 11, letterSpacing: 3, color: "#FFD700", marginBottom: 6, textTransform: "uppercase" }}>{item.title}</div>
              <p style={{ color: "#777", fontSize: isMobile ? 13 : 14, lineHeight: 1.8, fontWeight: 300 }}>{item.text}</p>
            </div>
          </AnimSection>
        ))}
      </div>
    </section>
  );
}

// ── Nav ────────────────────────────────────────────────────────────────────

function Nav({ scrollTo, scrolled, isMobile, menuOpen, setMenuOpen }) {
  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? "rgba(5,5,8,0.97)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid #ffffff0a" : "none",
        transition: "all 0.4s", padding: "0 5vw",
        display: "flex", alignItems: "center", justifyContent: "space-between", height: 60,
      }}>
        {/* Logo */}
        <div onClick={() => scrollTo("hero")} style={{ display: "flex", alignItems: "center", gap: 9, cursor: "pointer", flexShrink: 0 }}>
          <div style={{ width: 32, height: 32, background: "linear-gradient(135deg,#FFD700,#FFA500)", clipPath: "polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#000", animation: "sdGlowPulse 3s infinite" }}>✦</div>
          <div>
            <div style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: 16, letterSpacing: 3, lineHeight: 1 }}>SKYDIGI</div>
            <div style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 300, fontSize: 7, letterSpacing: 5, color: "#FFD700", lineHeight: 1 }}>LIGHTS</div>
          </div>
        </div>

        {/* Desktop nav */}
        {!isMobile && (
          <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
            {NAV_LINKS.map((l, i) => (
              <button key={l} onClick={() => scrollTo(SECTION_IDS[i])} style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 500, fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "#bbb", cursor: "pointer", padding: "4px 0", background: "none", border: "none", transition: "color 0.3s" }}
                onMouseEnter={e => { e.currentTarget.style.color = "#FFD700"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "#bbb"; }}
              >{l}</button>
            ))}
          </div>
        )}

        {/* Hamburger */}
        {isMobile && (
          <button onClick={() => setMenuOpen(o => !o)} style={{ background: "none", border: "1px solid #ffffff18", color: "#fff", padding: "7px 12px", cursor: "pointer", fontFamily: "'Rajdhani',sans-serif", letterSpacing: 2, fontSize: 11 }}>
            {menuOpen ? "✕ CLOSE" : "☰ MENU"}
          </button>
        )}
      </nav>

      {/* Mobile full-screen menu */}
      {isMobile && menuOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 99, background: "rgba(5,5,8,0.97)", backdropFilter: "blur(24px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 36 }}>
          {NAV_LINKS.map((l, i) => (
            <button key={l} onClick={() => { scrollTo(SECTION_IDS[i]); setMenuOpen(false); }} style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 24, letterSpacing: 5, color: "#bbb", background: "none", border: "none", cursor: "pointer", transition: "color 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.color = "#FFD700"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "#bbb"; }}
            >{l}</button>
          ))}
        </div>
      )}
    </>
  );
}

// ── Root ───────────────────────────────────────────────────────────────────

export default function SkydigiLights() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { isMobile } = useBreakpoint((w) => {
    if (w >= 640) setMenuOpen(false);
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <div style={{ background: "#050508", color: "#fff", fontFamily: "'Cormorant Garamond',Georgia,serif", overflowX: "hidden", minHeight: "100vh" }}>
      <style>{`
        @keyframes sdFloat    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes sdShimmer  { 0%{background-position:-600px 0} 100%{background-position:600px 0} }
        @keyframes sdFadeUp   { from{opacity:0;transform:translateY(36px)} to{opacity:1;transform:translateY(0)} }
        @keyframes sdGlowPulse{ 0%,100%{box-shadow:0 0 16px #FFD70055,0 0 32px #FFD70022} 50%{box-shadow:0 0 32px #FFD700aa,0 0 64px #FFD70044} }
        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
        html { scroll-behavior:smooth; }
        body { overflow-x:hidden; }
        ::-webkit-scrollbar { width:3px; }
        ::-webkit-scrollbar-track { background:#0a0a0f; }
        ::-webkit-scrollbar-thumb { background:#FFD700; border-radius:2px; }
        select option { background:#0d0d16; color:#fff; }
        @media (max-width:640px) {
          .sd-section-tag { font-size:10px !important; }
        }
      `}</style>

      <Nav scrollTo={scrollTo} scrolled={scrolled} isMobile={isMobile} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <HeroSection    scrollTo={scrollTo} isMobile={isMobile} />
      <ServicesSection scrollTo={scrollTo} isMobile={isMobile} />
      <UsageSection   isMobile={isMobile} />
      <GallerySection scrollTo={scrollTo} isMobile={isMobile} />
      <ContactSection isMobile={isMobile} />
      <PrivacySection isMobile={isMobile} />

      {/* Footer */}
      <footer style={{ background: "#020205", borderTop: "1px solid #ffffff07", padding: isMobile ? "32px 20px" : "36px 5vw" }}>
        <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", justifyContent: "space-between", alignItems: isMobile ? "flex-start" : "center", gap: isMobile ? 20 : 16, flexWrap: "wrap" }}>
          <div onClick={() => scrollTo("hero")} style={{ display: "flex", alignItems: "center", gap: 9, cursor: "pointer" }}>
            <div style={{ width: 24, height: 24, background: "linear-gradient(135deg,#FFD700,#FFA500)", clipPath: "polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#000" }}>✦</div>
            <div>
              <div style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: 3, lineHeight: 1 }}>SKYDIGI LIGHTS</div>
              <div style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 300, fontSize: 7, letterSpacing: 3, color: "#FFD700" }}>ILLUMINATE YOUR WORLD</div>
            </div>
          </div>

          <div style={{ display: "flex", gap: isMobile ? 16 : 22, flexWrap: "wrap" }}>
            {NAV_LINKS.map((l, i) => (
              <button key={l} onClick={() => scrollTo(SECTION_IDS[i])} style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 10, letterSpacing: 2, color: "#444", background: "none", border: "none", cursor: "pointer", textTransform: "uppercase", transition: "color 0.3s" }}
                onMouseEnter={e => { e.currentTarget.style.color = "#FFD700"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "#444"; }}
              >{l}</button>
            ))}
          </div>

          <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 10, color: "#2a2a2a", letterSpacing: 1 }}>© 2024 Skydigi Lights · Mumbai, India</div>
        </div>
      </footer>

      {/* Floating WhatsApp button */}
      <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" style={{
        position: "fixed", bottom: 24, right: 20, zIndex: 200,
        width: 52, height: 52, borderRadius: "50%",
        background: "linear-gradient(135deg,#25D366,#128C7E)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 24, boxShadow: "0 4px 20px #25D36655",
        transition: "transform 0.3s, box-shadow 0.3s", textDecoration: "none",
      }}
        onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.1)"; e.currentTarget.style.boxShadow = "0 6px 28px #25D36688"; }}
        onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 4px 20px #25D36655"; }}
        title="Chat on WhatsApp"
      >💬</a>
    </div>
  );
}
