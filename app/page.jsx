"use client";

import { useState, useEffect, useRef } from "react";

const NAV_LINKS = ["Home", "Services", "Usage", "Gallery", "Contact", "Privacy"];
const SECTION_IDS = ["hero", "services", "usage", "gallery", "contact", "privacy"];

const SERVICES = [
  {
    type: "SALE",
    icon: "✦",
    tag: "Own It Forever",
    items: ["LED Pixel Panels", "RGB Strip Systems", "Smart Controllers", "Neon Flex Signs", "Facade Lighting Kits", "Ambient Light Fixtures"],
    accent: "#FFD700",
    desc: "Premium lighting products crafted for permanence. Invest once, illuminate always.",
  },
  {
    type: "RENT",
    icon: "◈",
    tag: "Event Ready",
    items: ["Stage Wash Lights", "Moving Head Rigs", "Laser Systems", "LED Video Walls", "Uplighter Sets", "DJ Booth Lighting"],
    accent: "#00E5FF",
    desc: "Transform any event with professional-grade lighting setups, fully managed by our team.",
  },
];

const USAGES = [
  { label: "Events & Celebrations", icon: "🎆", desc: "Weddings, concerts, product launches, award ceremonies — we make every moment unforgettable.", bg: "linear-gradient(135deg,#1a0533,#3d0d6b)" },
  { label: "Residential & Homes", icon: "🏠", desc: "Ambient mood lighting, architectural accents, smart home integrations for modern living.", bg: "linear-gradient(135deg,#0a1a2a,#0d3d5c)" },
  { label: "Corporate & Offices", icon: "🏢", desc: "Branded lobbies, boardroom ambience, commercial exteriors — illuminate your identity.", bg: "linear-gradient(135deg,#0d1f0d,#1a4d1a)" },
  { label: "Retail & Showrooms", icon: "🛍️", desc: "Highlight products, guide customers, and build brand atmosphere with precision lighting.", bg: "linear-gradient(135deg,#2a1a00,#5c3d00)" },
  { label: "Hospitality & Hotels", icon: "🌙", desc: "Luxury atmospheres for lobbies, restaurants, rooftops, and suites.", bg: "linear-gradient(135deg,#1a0a1a,#4d1a4d)" },
  { label: "Outdoor & Facades", icon: "✨", desc: "Architectural washes, garden lighting, billboard illumination for dramatic exterior presence.", bg: "linear-gradient(135deg,#001a2a,#003d5c)" },
];

const GALLERY_ITEMS = [
  { label: "Wedding Reception", cat: "Event", color: "#FFD700", h: 300 },
  { label: "Concert Stage", cat: "Event", color: "#FF6B35", h: 240 },
  { label: "Luxury Villa", cat: "Home", color: "#00E5FF", h: 260 },
  { label: "Corporate Lobby", cat: "Office", color: "#7B68EE", h: 300 },
  { label: "Hotel Rooftop", cat: "Hospitality", color: "#FF69B4", h: 240 },
  { label: "Retail Showroom", cat: "Retail", color: "#39FF14", h: 260 },
  { label: "Outdoor Facade", cat: "Outdoor", color: "#FFD700", h: 240 },
  { label: "DJ Setup", cat: "Event", color: "#00E5FF", h: 300 },
];

// Static particle data — defined outside component to avoid regenerating on render
const PARTICLES = Array.from({ length: 28 }, (_, i) => ({
  size: 1 + (i * 0.37) % 3,
  left: ((i * 37.3) % 100).toFixed(1),
  top: ((i * 53.7) % 100).toFixed(1),
  color: i % 3 === 0 ? "#FFD700" : i % 3 === 1 ? "#00E5FF" : "#ffffff",
  opacity: (0.1 + (i * 0.023) % 0.6).toFixed(2),
  duration: (3 + (i * 0.27) % 4).toFixed(1),
  delay: ((i * 0.19) % 5).toFixed(1),
}));

// ── Hooks ──────────────────────────────────────────────────────────────────

function useInView(threshold = 0.15) {
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

// ── Sub-components ─────────────────────────────────────────────────────────

function AnimSection({ children, style = {}, delay = 0 }) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(40px)",
        transition: `opacity 0.75s ${delay}s ease, transform 0.75s ${delay}s ease`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function SectionTag({ children }) {
  return (
    <div style={{
      fontFamily: "'Rajdhani', sans-serif",
      fontSize: 11,
      letterSpacing: 4,
      textTransform: "uppercase",
      color: "#FFD700",
      display: "flex",
      alignItems: "center",
      gap: 12,
      marginBottom: 16,
    }}>
      <span style={{ display: "inline-block", width: 28, height: 1, background: "#FFD700" }} />
      {children}
    </div>
  );
}

function Divider() {
  return <div style={{ width: 56, height: 2, background: "linear-gradient(90deg,#FFD700,#00E5FF)", margin: "18px 0 48px" }} />;
}

function PrimaryBtn({ children, onClick, style = {} }) {
  return (
    <button onClick={onClick} style={{
      fontFamily: "'Rajdhani', sans-serif",
      fontWeight: 600,
      letterSpacing: 2,
      textTransform: "uppercase",
      fontSize: 12,
      padding: "12px 32px",
      background: "linear-gradient(135deg,#FFD700,#FFA500)",
      color: "#000",
      border: "none",
      cursor: "pointer",
      clipPath: "polygon(7px 0%,100% 0%,calc(100% - 7px) 100%,0% 100%)",
      transition: "transform 0.3s, box-shadow 0.3s",
      ...style,
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 28px #FFD70055"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
    >
      {children}
    </button>
  );
}

function OutlineBtn({ children, onClick, style = {} }) {
  return (
    <button onClick={onClick} style={{
      fontFamily: "'Rajdhani', sans-serif",
      fontWeight: 600,
      letterSpacing: 2,
      textTransform: "uppercase",
      fontSize: 12,
      padding: "11px 32px",
      background: "transparent",
      color: "#00E5FF",
      border: "1px solid #00E5FF44",
      cursor: "pointer",
      clipPath: "polygon(7px 0%,100% 0%,calc(100% - 7px) 100%,0% 100%)",
      transition: "background 0.3s, border-color 0.3s, box-shadow 0.3s",
      ...style,
    }}
      onMouseEnter={e => { e.currentTarget.style.background = "#00E5FF11"; e.currentTarget.style.borderColor = "#00E5FF"; e.currentTarget.style.boxShadow = "0 0 18px #00E5FF22"; }}
      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "#00E5FF44"; e.currentTarget.style.boxShadow = "none"; }}
    >
      {children}
    </button>
  );
}

// ── Sections ───────────────────────────────────────────────────────────────

function HeroSection({ scrollTo }) {
  return (
    <section id="hero" style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      overflow: "hidden",
      background: "radial-gradient(ellipse 80% 60% at 50% 40%,#1c0f00,#050508 70%)",
    }}>
      {/* Particles */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        {PARTICLES.map((p, i) => (
          <div key={i} style={{
            position: "absolute",
            borderRadius: "50%",
            width: p.size,
            height: p.size,
            left: `${p.left}%`,
            top: `${p.top}%`,
            background: p.color,
            opacity: p.opacity,
            animation: `sdFloat ${p.duration}s ease-in-out ${p.delay}s infinite`,
          }} />
        ))}
      </div>

      {/* Glow orbs */}
      <div style={{ position: "absolute", width: 550, height: 550, borderRadius: "50%", background: "radial-gradient(circle,#FFD70012 0%,transparent 70%)", top: -80, left: -80, pointerEvents: "none" }} />
      <div style={{ position: "absolute", width: 460, height: 460, borderRadius: "50%", background: "radial-gradient(circle,#00E5FF0b 0%,transparent 70%)", bottom: 0, right: -40, pointerEvents: "none" }} />

      <div style={{ textAlign: "center", position: "relative", zIndex: 1, padding: "120px 20px 80px", animation: "sdFadeUp 0.9s ease forwards" }}>
        <SectionTag>Premium Lighting Solutions · Est. 2024</SectionTag>

        <div style={{ fontSize: "clamp(58px,11vw,120px)", fontWeight: 300, lineHeight: 0.9, letterSpacing: -2, background: "linear-gradient(135deg,#fff 30%,#FFD700 70%,#FFA500 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", backgroundSize: "800px 100%", animation: "sdShimmer 6s linear infinite" }}>
          SKYDIGI
        </div>
        <div style={{ fontSize: "clamp(58px,11vw,120px)", fontWeight: 700, lineHeight: 0.9, letterSpacing: -2, background: "linear-gradient(135deg,#00E5FF,#0099cc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", marginBottom: 24 }}>
          LIGHTS
        </div>

        <p style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: "clamp(15px,2.2vw,20px)", fontWeight: 300, color: "#999", maxWidth: 520, margin: "0 auto 12px", lineHeight: 1.7 }}>
          We illuminate spaces, events, and emotions. From elegant residential lighting to breathtaking event spectacles — your vision, illuminated.
        </p>
        <p style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 12, letterSpacing: 3, color: "#FFD700", marginBottom: 44, textTransform: "uppercase" }}>
          Mumbai, India · Sale &amp; Rental Services
        </p>

        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <PrimaryBtn onClick={() => scrollTo("services")}>Explore Services</PrimaryBtn>
          <OutlineBtn onClick={() => scrollTo("contact")}>Get in Touch</OutlineBtn>
        </div>

        <div style={{ marginTop: 72, display: "flex", justifyContent: "center", gap: 48, flexWrap: "wrap" }}>
          {[["500+", "Projects Done"], ["8+", "Years Experience"], ["100%", "Client Satisfaction"]].map(([num, lbl]) => (
            <div key={lbl} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "clamp(26px,4vw,42px)", fontWeight: 600, fontFamily: "'Rajdhani',sans-serif", letterSpacing: 2, background: "linear-gradient(135deg,#FFD700,#FFA500)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{num}</div>
              <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 10, letterSpacing: 3, color: "#555", textTransform: "uppercase" }}>{lbl}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ position: "absolute", bottom: 28, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, opacity: 0.4 }}>
        <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 9, letterSpacing: 4, color: "#fff" }}>SCROLL</div>
        <div style={{ width: 1, height: 36, background: "linear-gradient(to bottom,#FFD700,transparent)", animation: "sdFloat 2s ease-in-out infinite" }} />
      </div>
    </section>
  );
}

function ServicesSection({ scrollTo }) {
  return (
    <section id="services" style={{ padding: "110px 5vw", background: "#070710" }}>
      <AnimSection>
        <SectionTag>What We Offer</SectionTag>
        <h2 style={{ fontSize: "clamp(32px,5.5vw,68px)", fontWeight: 300, lineHeight: 1.05, marginBottom: 10 }}>
          Sale &amp; <span style={{ color: "#FFD700" }}>Rental</span>
        </h2>
        <Divider />
        <p style={{ color: "#888", fontSize: 17, maxWidth: 480, lineHeight: 1.75, marginBottom: 56, fontWeight: 300 }}>
          Whether you need a permanent installation or a one-time spectacular event setup — we have you covered.
        </p>
      </AnimSection>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 2 }}>
        {SERVICES.map((svc, i) => (
          <AnimSection key={svc.type} delay={i * 0.15}>
            <div style={{
              padding: "44px 36px",
              background: "linear-gradient(135deg,#0d0d16,#0a0a13)",
              border: "1px solid #ffffff0e",
              position: "relative",
              overflow: "hidden",
              transition: "transform 0.4s, border-color 0.4s",
              height: "100%",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.borderColor = "#ffffff22"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "#ffffff0e"; }}
            >
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,transparent,${svc.accent},transparent)` }} />
              <div style={{ position: "absolute", top: -10, right: -20, opacity: 0.03, fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: 160, lineHeight: 1, pointerEvents: "none", color: "#fff" }}>{svc.type}</div>

              <div style={{ width: 46, height: 46, borderRadius: "50%", border: `1px solid ${svc.accent}33`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, color: svc.accent, marginBottom: 16 }}>{svc.icon}</div>
              <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 26, fontWeight: 700, letterSpacing: 3, color: svc.accent }}>{svc.type}</div>
              <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 10, letterSpacing: 3, color: "#555", textTransform: "uppercase", marginBottom: 16 }}>{svc.tag}</div>
              <p style={{ color: "#888", fontSize: 14, lineHeight: 1.75, fontWeight: 300, marginBottom: 28 }}>{svc.desc}</p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 32 }}>
                {svc.items.map(item => (
                  <div key={item} style={{ display: "flex", alignItems: "center", gap: 8, color: "#bbb", fontSize: 13 }}>
                    <div style={{ width: 4, height: 4, borderRadius: "50%", background: svc.accent, flexShrink: 0 }} />
                    {item}
                  </div>
                ))}
              </div>

              {i === 0
                ? <PrimaryBtn onClick={() => scrollTo("contact")} style={{ padding: "11px 26px" }}>Buy Now →</PrimaryBtn>
                : <OutlineBtn onClick={() => scrollTo("contact")} style={{ padding: "11px 26px" }}>Rent for Event →</OutlineBtn>
              }
            </div>
          </AnimSection>
        ))}
      </div>
    </section>
  );
}

function UsageSection() {
  return (
    <section id="usage" style={{ padding: "110px 5vw", background: "#050508" }}>
      <AnimSection>
        <SectionTag>Applications</SectionTag>
        <h2 style={{ fontSize: "clamp(32px,5.5vw,68px)", fontWeight: 300, lineHeight: 1.05, marginBottom: 10 }}>
          Where We <span style={{ color: "#00E5FF" }}>Illuminate</span>
        </h2>
        <Divider />
        <p style={{ color: "#888", fontSize: 17, maxWidth: 480, lineHeight: 1.75, marginBottom: 56, fontWeight: 300 }}>
          From intimate homes to grand corporate facades, our lighting transforms every environment.
        </p>
      </AnimSection>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(270px,1fr))", gap: 14 }}>
        {USAGES.map((u, i) => (
          <AnimSection key={u.label} delay={i * 0.08}>
            <div style={{
              padding: "36px 28px",
              background: u.bg,
              position: "relative",
              overflow: "hidden",
              border: "1px solid #ffffff0a",
              transition: "transform 0.4s, border-color 0.4s, box-shadow 0.4s",
              cursor: "default",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-5px) scale(1.015)"; e.currentTarget.style.borderColor = "#ffffff22"; e.currentTarget.style.boxShadow = "0 20px 50px #00000055"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0) scale(1)"; e.currentTarget.style.borderColor = "#ffffff0a"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.52)" }} />
              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ fontSize: 32, marginBottom: 14 }}>{u.icon}</div>
                <h3 style={{ fontSize: 19, fontWeight: 500, marginBottom: 10 }}>{u.label}</h3>
                <p style={{ color: "#aaa", fontSize: 13, lineHeight: 1.7, fontWeight: 300 }}>{u.desc}</p>
              </div>
            </div>
          </AnimSection>
        ))}
      </div>
    </section>
  );
}

function GallerySection({ scrollTo }) {
  return (
    <section id="gallery" style={{ padding: "110px 5vw", background: "#070710" }}>
      <AnimSection>
        <SectionTag>Portfolio</SectionTag>
        <h2 style={{ fontSize: "clamp(32px,5.5vw,68px)", fontWeight: 300, lineHeight: 1.05, marginBottom: 10 }}>
          Our <span style={{ color: "#FFD700" }}>Work</span>
        </h2>
        <Divider />
        <p style={{ color: "#888", fontSize: 17, maxWidth: 480, lineHeight: 1.75, marginBottom: 56, fontWeight: 300 }}>
          A glimpse into the worlds we've illuminated.
        </p>
      </AnimSection>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(250px,1fr))", gap: 10 }}>
        {GALLERY_ITEMS.map((item, i) => (
          <AnimSection key={item.label} delay={i * 0.06}>
            <div style={{
              height: item.h,
              position: "relative",
              overflow: "hidden",
              border: "1px solid #ffffff07",
              cursor: "pointer",
            }}
              onMouseEnter={e => {
                e.currentTarget.querySelector(".gi-img").style.transform = "scale(1.07)";
                e.currentTarget.querySelector(".gi-ov").style.opacity = "1";
              }}
              onMouseLeave={e => {
                e.currentTarget.querySelector(".gi-img").style.transform = "scale(1)";
                e.currentTarget.querySelector(".gi-ov").style.opacity = "0";
              }}
            >
              <div className="gi-img" style={{
                width: "100%", height: "100%", transition: "transform 0.55s",
                background: `radial-gradient(ellipse at ${30 + i * 11}% ${20 + i * 8}%,${item.color}2e 0%,transparent 55%),radial-gradient(ellipse at ${100 - (30 + i * 11)}% ${100 - (20 + i * 8)}%,${item.color}1a 0%,transparent 50%),linear-gradient(135deg,#0a0a16,#14141f)`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <div style={{ textAlign: "center", opacity: 0.25 }}>
                  <div style={{ fontSize: 36, color: item.color, marginBottom: 8 }}>◈</div>
                  <div style={{ fontFamily: "'Rajdhani',sans-serif", letterSpacing: 3, fontSize: 9, color: item.color }}>ADD PHOTO</div>
                </div>
              </div>
              <div className="gi-ov" style={{
                position: "absolute", inset: 0, opacity: 0, transition: "opacity 0.35s",
                background: "linear-gradient(to top,rgba(0,0,0,.88) 0%,transparent 100%)",
                display: "flex", alignItems: "flex-end", padding: 18,
              }}>
                <div>
                  <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 9, letterSpacing: 3, color: item.color, textTransform: "uppercase", marginBottom: 4 }}>{item.cat}</div>
                  <div style={{ fontWeight: 500, fontSize: 15 }}>{item.label}</div>
                </div>
              </div>
            </div>
          </AnimSection>
        ))}
      </div>

      <AnimSection delay={0.2} style={{ textAlign: "center", marginTop: 50 }}>
        <p style={{ color: "#555", fontFamily: "'Rajdhani',sans-serif", fontSize: 12, letterSpacing: 2, marginBottom: 20 }}>YOUR PHOTOS WILL BE DISPLAYED IN THIS GALLERY</p>
        <OutlineBtn onClick={() => scrollTo("contact")}>Request Portfolio PDF</OutlineBtn>
      </AnimSection>
    </section>
  );
}

function ContactSection() {
  const [sent, setSent] = useState(false);
  return (
    <section id="contact" style={{ padding: "110px 5vw", background: "#050508" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 72, alignItems: "start" }}>
        <AnimSection>
          <SectionTag>Get In Touch</SectionTag>
          <h2 style={{ fontSize: "clamp(32px,5vw,60px)", fontWeight: 300, lineHeight: 1.05, marginBottom: 10 }}>
            Let&apos;s Create <br /><span style={{ color: "#FFD700" }}>Something</span><br />Brilliant
          </h2>
          <Divider />
          <p style={{ color: "#888", fontSize: 16, lineHeight: 1.8, marginBottom: 44, fontWeight: 300 }}>
            Have a project in mind? An event to illuminate? We&apos;d love to hear from you.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 36 }}>
            {[
              { icon: "📍", label: "Location", value: "Mumbai, Maharashtra, India" },
              { icon: "📞", label: "Phone", value: "+91 98765 43210" },
              { icon: "✉️", label: "Email", value: "hello@skydigilights.com" },
              { icon: "⏰", label: "Hours", value: "Mon–Sat: 9AM – 7PM IST" },
            ].map(({ icon, label, value }) => (
              <div key={label} style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                <div style={{ width: 38, height: 38, borderRadius: "50%", border: "1px solid #FFD70022", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 15 }}>{icon}</div>
                <div>
                  <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 10, letterSpacing: 3, color: "#FFD700", marginBottom: 2 }}>{label}</div>
                  <div style={{ color: "#ddd", fontSize: 14 }}>{value}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {["Instagram", "Facebook", "WhatsApp", "YouTube"].map(s => (
              <button key={s} style={{
                fontFamily: "'Rajdhani',sans-serif", fontSize: 10, letterSpacing: 2,
                padding: "7px 14px", border: "1px solid #ffffff11", color: "#777",
                cursor: "pointer", transition: "all 0.3s", textTransform: "uppercase", background: "none",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#FFD70033"; e.currentTarget.style.color = "#FFD700"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#ffffff11"; e.currentTarget.style.color = "#777"; }}
              >{s}</button>
            ))}
          </div>
        </AnimSection>

        <AnimSection delay={0.2}>
          <div style={{ background: "#0a0a13", border: "1px solid #ffffff09", padding: "44px 36px" }}>
            <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 16, letterSpacing: 3, marginBottom: 28 }}>SEND A MESSAGE</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {["Your Name", "Phone / WhatsApp", "Email Address"].map(ph => (
                <input key={ph} placeholder={ph} style={inputStyle} onFocus={e => { e.currentTarget.style.borderColor = "#FFD70044"; }} onBlur={e => { e.currentTarget.style.borderColor = "#ffffff0e"; }} />
              ))}
              <select style={inputStyle} onFocus={e => { e.currentTarget.style.borderColor = "#FFD70044"; }} onBlur={e => { e.currentTarget.style.borderColor = "#ffffff0e"; }}>
                <option value="">Select Inquiry Type</option>
                <option>Purchase Lighting Products</option>
                <option>Rent for Event</option>
                <option>Home / Office Installation</option>
                <option>Corporate Project</option>
                <option>Custom Quote</option>
              </select>
              <textarea placeholder="Describe your project..." rows={4} style={{ ...inputStyle, resize: "vertical" }} onFocus={e => { e.currentTarget.style.borderColor = "#FFD70044"; }} onBlur={e => { e.currentTarget.style.borderColor = "#ffffff0e"; }} />
              <PrimaryBtn onClick={() => setSent(true)} style={{ width: "100%", padding: 15 }}>
                {sent ? "Message Sent ✓" : "Send Enquiry →"}
              </PrimaryBtn>
            </div>
            <p style={{ color: "#383838", fontSize: 11, marginTop: 14, fontFamily: "'Rajdhani',sans-serif", letterSpacing: 1, lineHeight: 1.6 }}>
              We typically respond within 24 hours. For urgent requirements, please call or WhatsApp directly.
            </p>
          </div>
        </AnimSection>
      </div>
    </section>
  );
}

const PP_ITEMS = [
  { title: "01. Information We Collect", text: "When you interact with our website, contact forms, or advertisements, we may collect your name, phone number, email address, and general location. This data is used solely to respond to your inquiries and provide relevant services." },
  { title: "02. How We Use Your Data", text: "Your information is used to process service requests, send quotes, follow up on inquiries, and improve our services. We do not sell, trade, or transfer your personal information to third parties without your explicit consent." },
  { title: "03. Advertising & Cookies", text: "We may use advertising platforms such as Google Ads and Meta (Facebook/Instagram) to show relevant promotions. These platforms may use cookies and similar tracking technologies to personalize ad content. You can opt out via your browser settings or the respective platform's privacy controls." },
  { title: "04. Google Ads Compliance", text: "Our advertising complies with Google's advertising policies. We participate in remarketing to show relevant ads to previous visitors. Google's use of advertising cookies enables it and its partners to serve ads based on past visits to our site." },
  { title: "05. Data Security", text: "We implement industry-standard security measures to protect your personal information. Our website uses SSL encryption for all data transmissions. However, no method of internet transmission is 100% secure." },
  { title: "06. Your Rights", text: "You have the right to access, correct, or delete your personal data at any time. Contact us at privacy@skydigilights.com. We will respond within 30 days." },
  { title: "07. Contact & Updates", text: "This policy is effective as of January 2024 and may be updated periodically. For privacy enquiries: Skydigi Lights, Mumbai, Maharashtra, India · privacy@skydigilights.com" },
];

function PrivacySection() {
  return (
    <section id="privacy" style={{ padding: "90px 5vw", background: "#070710", borderTop: "1px solid #ffffff07" }}>
      <AnimSection>
        <SectionTag>Legal</SectionTag>
        <h2 style={{ fontSize: "clamp(28px,4vw,52px)", fontWeight: 300, marginBottom: 10 }}>
          Privacy <span style={{ color: "#FFD700" }}>Policy</span>
        </h2>
        <Divider />
      </AnimSection>
      <div style={{ maxWidth: 780, marginTop: 8, display: "flex", flexDirection: "column", gap: 26 }}>
        {PP_ITEMS.map((item, i) => (
          <AnimSection key={item.title} delay={i * 0.05}>
            <div style={{ borderLeft: "2px solid #FFD70020", paddingLeft: 24 }}>
              <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 12, letterSpacing: 3, color: "#FFD700", marginBottom: 8, textTransform: "uppercase" }}>{item.title}</div>
              <p style={{ color: "#777", fontSize: 14, lineHeight: 1.8, fontWeight: 300 }}>{item.text}</p>
            </div>
          </AnimSection>
        ))}
      </div>
    </section>
  );
}

// Shared input style object
const inputStyle = {
  background: "#0d0d16",
  border: "1px solid #ffffff0e",
  color: "#fff",
  padding: "13px 16px",
  fontFamily: "'Rajdhani', sans-serif",
  fontSize: 14,
  width: "100%",
  outline: "none",
  transition: "border-color 0.3s",
  letterSpacing: "0.5px",
};

// ── Main Export ────────────────────────────────────────────────────────────

export default function SkydigiLights() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
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
        @keyframes sdFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        @keyframes sdShimmer { 0%{background-position:-600px 0} 100%{background-position:600px 0} }
        @keyframes sdFadeUp { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }
        @keyframes sdGlowPulse { 0%,100%{box-shadow:0 0 18px #FFD70055,0 0 36px #FFD70022} 50%{box-shadow:0 0 36px #FFD700aa,0 0 70px #FFD70044} }
        * { margin:0; padding:0; box-sizing:border-box; }
        html { scroll-behavior:smooth; }
        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-track { background:#0a0a0f; }
        ::-webkit-scrollbar-thumb { background:#FFD700; border-radius:2px; }
      `}</style>

      {/* NAV */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? "rgba(5,5,8,0.96)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid #ffffff0a" : "none",
        transition: "all 0.4s",
        padding: "0 5vw",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: 64,
      }}>
        <div onClick={() => scrollTo("hero")} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
          <div style={{ width: 34, height: 34, background: "linear-gradient(135deg,#FFD700,#FFA500)", clipPath: "polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: "#000", animation: "sdGlowPulse 3s infinite" }}>✦</div>
          <div>
            <div style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: 17, letterSpacing: 3, lineHeight: 1 }}>SKYDIGI</div>
            <div style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 300, fontSize: 8, letterSpacing: 5, color: "#FFD700", lineHeight: 1 }}>LIGHTS</div>
          </div>
        </div>

        {/* Desktop links */}
        <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
          {NAV_LINKS.map((l, i) => (
            <button key={l} onClick={() => scrollTo(SECTION_IDS[i])} style={{
              fontFamily: "'Rajdhani',sans-serif", fontWeight: 500, fontSize: 12,
              letterSpacing: 2, textTransform: "uppercase", color: "#bbb",
              cursor: "pointer", padding: "4px 0", background: "none", border: "none",
              transition: "color 0.3s",
            }}
              onMouseEnter={e => { e.currentTarget.style.color = "#FFD700"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "#bbb"; }}
            >{l}</button>
          ))}
        </div>
      </nav>

      {/* Mobile overlay menu */}
      {menuOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 99, background: "#050508ee", backdropFilter: "blur(20px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 32 }}>
          {NAV_LINKS.map((l, i) => (
            <button key={l} onClick={() => scrollTo(SECTION_IDS[i])} style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 22, letterSpacing: 4, color: "#bbb", background: "none", border: "none", cursor: "pointer" }}>{l}</button>
          ))}
        </div>
      )}

      <HeroSection scrollTo={scrollTo} />
      <ServicesSection scrollTo={scrollTo} />
      <UsageSection />
      <GallerySection scrollTo={scrollTo} />
      <ContactSection />
      <PrivacySection />

      {/* FOOTER */}
      <footer style={{ background: "#020205", borderTop: "1px solid #ffffff07", padding: "40px 5vw", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
        <div onClick={() => scrollTo("hero")} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
          <div style={{ width: 26, height: 26, background: "linear-gradient(135deg,#FFD700,#FFA500)", clipPath: "polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#000" }}>✦</div>
          <div>
            <div style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: 14, letterSpacing: 3, lineHeight: 1 }}>SKYDIGI LIGHTS</div>
            <div style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 300, fontSize: 7, letterSpacing: 3, color: "#FFD700" }}>ILLUMINATE YOUR WORLD</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
          {NAV_LINKS.map((l, i) => (
            <button key={l} onClick={() => scrollTo(SECTION_IDS[i])} style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 10, letterSpacing: 2, color: "#555", background: "none", border: "none", cursor: "pointer", textTransform: "uppercase" }}
              onMouseEnter={e => { e.currentTarget.style.color = "#FFD700"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "#555"; }}
            >{l}</button>
          ))}
        </div>
        <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 11, color: "#333", letterSpacing: 1 }}>© 2024 Skydigi Lights · Mumbai, India</div>
      </footer>
    </div>
  );
}
