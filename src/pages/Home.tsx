import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SiInstagram, SiYoutube, SiDiscord, SiWhatsapp, SiPinterest } from "react-icons/si";
import { Link } from "wouter";
import { useSiteData } from "../hooks/useSiteData";

const VISIT_KEY = "mockingbird_visits";

function trackVisit() {
  try {
    const prev = parseInt(localStorage.getItem(VISIT_KEY) || "0", 10);
    localStorage.setItem(VISIT_KEY, String(prev + 1));
  } catch {}
}

function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.loop = true;
    audio.volume = 0.55;
    const tryPlay = () => {
      audio.play().then(() => { setPlaying(true); setStarted(true); }).catch(() => {});
    };
    tryPlay();
    const onFirstClick = () => { if (!started) tryPlay(); };
    document.addEventListener("click", onFirstClick, { once: true });
    return () => document.removeEventListener("click", onFirstClick);
  }, []);

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) { audio.pause(); setPlaying(false); }
    else { audio.play().then(() => { setPlaying(true); setStarted(true); }).catch(() => {}); }
  }

  return (
    <div style={{
      background: "rgba(255,240,246,0.85)",
      border: "1.5px solid #fce7f3",
      borderRadius: "16px",
      padding: "8px 12px",
      display: "flex", alignItems: "center", gap: "8px",
      marginBottom: "12px",
    }}>
      <audio ref={audioRef} src="/bg-music.mpeg" preload="auto" />

      {/* play/pause button */}
      <motion.button
        whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.9 }}
        onClick={toggle}
        style={{
          width: "30px", height: "30px", borderRadius: "50%",
          background: "linear-gradient(135deg,#db2777,#ec4899)",
          border: "none", cursor: "pointer", flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 3px 10px rgba(219,39,119,0.3)",
        }}>
        {playing ? (
          <svg width="11" height="11" viewBox="0 0 24 24" fill="#fff">
            <rect x="5" y="4" width="4" height="16" rx="1"/><rect x="15" y="4" width="4" height="16" rx="1"/>
          </svg>
        ) : (
          <svg width="11" height="11" viewBox="0 0 24 24" fill="#fff">
            <polygon points="6,4 20,12 6,20"/>
          </svg>
        )}
      </motion.button>

      {/* label + bars */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: "8.5px", color: "#be185d", fontFamily: "'Nunito',sans-serif", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "3px" }}>
          now playing ♪
        </div>
        <div style={{ fontSize: "8px", color: "#db2777", fontFamily: "'Dancing Script',cursive", fontSize: "0.78rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          bg melody ~
        </div>
      </div>

      {/* equalizer bars */}
      <div style={{ display: "flex", gap: "2px", alignItems: "flex-end", height: "16px", flexShrink: 0 }}>
        {[0.6, 1, 0.75, 0.9, 0.5].map((h, i) => (
          <motion.div key={i}
            animate={playing ? { scaleY: [h, 1, h * 0.6, 1, h] } : { scaleY: 0.2 }}
            transition={{ duration: 0.8 + i * 0.15, repeat: Infinity, ease: "easeInOut" }}
            style={{
              width: "3px", height: "14px", borderRadius: "2px",
              background: "linear-gradient(to top,#db2777,#f9a8d4)",
              transformOrigin: "bottom",
            }}
          />
        ))}
      </div>
    </div>
  );
}

const PINK     = "#db2777";
const PINK_MID = "#ec4899";
const PINK_LT  = "#fce7f3";
const PINK_PAL = "#fff0f6";

function ChessIcon({ size = 22, color = PINK_MID }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M9 4h6M12 4v3M8 7h8l1 5H7L8 7z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M7 12l-1 5h12l-1-5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="6" y="17" width="12" height="3" rx="1.5" stroke={color} strokeWidth="1.5"/>
    </svg>
  );
}

const defaultSocials = [
  { name: "Instagram", icon: <SiInstagram size={22} style={{ color: PINK_MID }} />, url: "https://www.instagram.com/skyhigh_bird1/" },
  { name: "WhatsApp",  icon: <SiWhatsapp  size={22} style={{ color: PINK_MID }} />, url: "https://wa.me/23462301848?text=Hi!" },
  { name: "YouTube",   icon: <SiYoutube   size={22} style={{ color: PINK_MID }} />, url: "https://www.youtube.com/channel/UCR2ho6g89WPviPPJLaGvnaQ" },
  { name: "Discord",   icon: <SiDiscord   size={22} style={{ color: PINK_MID }} />, url: "https://discord.com/users/1074712637650243597" },
  { name: "Pinterest", icon: <SiPinterest size={22} style={{ color: PINK_MID }} />, url: "https://www.pinterest.com/gmtrueborn/" },
  { name: "Chess",     icon: <ChessIcon />,                                          url: "https://www.chess.com/member/mockingbirdgm" },
];

const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  Instagram: <SiInstagram size={22} style={{ color: PINK_MID }} />,
  WhatsApp:  <SiWhatsapp  size={22} style={{ color: PINK_MID }} />,
  YouTube:   <SiYoutube   size={22} style={{ color: PINK_MID }} />,
  Discord:   <SiDiscord   size={22} style={{ color: PINK_MID }} />,
  Pinterest: <SiPinterest size={22} style={{ color: PINK_MID }} />,
  Chess:     <ChessIcon />,
};

const gameCubes: { label: string; svg: React.ReactNode }[] = [
  { label: "Minecraft", svg: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="8" height="8" rx="1" stroke={PINK_MID} strokeWidth="1.4"/><rect x="13" y="3" width="8" height="8" rx="1" stroke={PINK_MID} strokeWidth="1.4"/><rect x="3" y="13" width="8" height="8" rx="1" stroke={PINK_MID} strokeWidth="1.4"/><rect x="13" y="13" width="8" height="8" rx="1" stroke={PINK_MID} strokeWidth="1.4"/><rect x="6" y="6" width="2" height="2" fill={PINK_MID}/><rect x="16" y="6" width="2" height="2" fill={PINK_MID}/><rect x="6" y="16" width="2" height="2" fill={PINK_MID}/><rect x="16" y="16" width="2" height="2" fill={PINK_MID}/></svg> },
  { label: "Among Us", svg: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 3C8.5 3 6 6 6 9v9a2 2 0 002 2h8a2 2 0 002-2V9c0-3-2.5-6-6-6z" stroke={PINK_MID} strokeWidth="1.4"/><rect x="8" y="6" width="8" height="4" rx="2" stroke={PINK_MID} strokeWidth="1.3"/><line x1="8" y1="16" x2="10" y2="16" stroke={PINK_MID} strokeWidth="1.5" strokeLinecap="round"/><line x1="14" y1="16" x2="16" y2="16" stroke={PINK_MID} strokeWidth="1.5" strokeLinecap="round"/></svg> },
  { label: "Chess", svg: <ChessIcon size={22} /> },
  { label: "God", svg: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 2L8 8H4l3.5 3-1.5 5 6-4 6 4-1.5-5L20 8h-4z" stroke={PINK_MID} strokeWidth="1.4" strokeLinejoin="round"/><circle cx="12" cy="20" r="2" stroke={PINK_MID} strokeWidth="1.3"/><line x1="12" y1="14" x2="12" y2="18" stroke={PINK_MID} strokeWidth="1.3"/></svg> },
];

const hobbies: { label: string; svg: React.ReactNode }[] = [
  { label: "Art",        svg: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="8" cy="8" r="3" stroke={PINK_MID} strokeWidth="1.4"/><path d="M2 20l4-4 10 10" stroke={PINK_MID} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M14 10l6-6 2 2-6 6-2-2z" stroke={PINK_MID} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  { label: "Reading",    svg: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="8" height="16" rx="2" stroke={PINK_MID} strokeWidth="1.4"/><rect x="13" y="4" width="8" height="16" rx="2" stroke={PINK_MID} strokeWidth="1.4"/><line x1="6" y1="11" x2="9" y2="11" stroke={PINK} strokeWidth="1.2" strokeLinecap="round"/><line x1="15" y1="8" x2="19" y2="8" stroke={PINK} strokeWidth="1.2" strokeLinecap="round"/><line x1="15" y1="11" x2="19" y2="11" stroke={PINK} strokeWidth="1.2" strokeLinecap="round"/></svg> },
  { label: "Music",      svg: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M9 18V6l12-2v12" stroke={PINK_MID} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><circle cx="6" cy="18" r="3" stroke={PINK_MID} strokeWidth="1.4"/><circle cx="18" cy="16" r="3" stroke={PINK_MID} strokeWidth="1.4"/></svg> },
  { label: "Aesthetic",  svg: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" stroke={PINK_MID} strokeWidth="1.4" strokeLinejoin="round"/></svg> },
  { label: "Shopping",   svg: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke={PINK_MID} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><line x1="3" y1="6" x2="21" y2="6" stroke={PINK} strokeWidth="1.4"/><path d="M16 10a4 4 0 01-8 0" stroke={PINK} strokeWidth="1.4" strokeLinecap="round"/></svg> },
  { label: "Anime",      svg: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="2" y="3" width="20" height="14" rx="2" stroke={PINK_MID} strokeWidth="1.4"/><path d="M8 21h8M12 17v4" stroke={PINK} strokeWidth="1.4" strokeLinecap="round"/><path d="M7 8l2.5 3L7 14" stroke={PINK_MID} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/><line x1="13" y1="8" x2="17" y2="8" stroke={PINK} strokeWidth="1.2" strokeLinecap="round"/><line x1="13" y1="11" x2="17" y2="11" stroke={PINK} strokeWidth="1.2" strokeLinecap="round"/></svg> },
  { label: "Night Walks",svg: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke={PINK_MID} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  { label: "Matcha",     svg: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M4 9h16l-2 9H6L4 9z" stroke={PINK_MID} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M8 9V7a4 4 0 018 0v2" stroke={PINK} strokeWidth="1.4" strokeLinecap="round"/></svg> },
];

const PETALS = Array.from({ length: 14 }, (_, i) => ({
  id: i, left: `${5 + (i * 7) % 85}%`,
  size: `${10 + (i * 3) % 12}px`,
  delay: `${(i * 1.1) % 12}s`,
  duration: `${9 + (i * 1.3) % 9}s`,
}));

function Petals() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {PETALS.map((p) => (
        <div key={p.id} className="petal" style={{ left: p.left, bottom: "-20px", width: p.size, height: p.size, animationDuration: p.duration, animationDelay: p.delay }}>
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M12 2C8 2 4 6 4 10C4 14 8 18 12 22C16 18 20 14 20 10C20 6 16 2 12 2Z" fill="#f9a8d4" opacity="0.7"/>
            <path d="M12 2C10 6 10 10 12 22C14 10 14 6 12 2Z" fill="#fce7f3" opacity="0.5"/>
          </svg>
        </div>
      ))}
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
        {[...Array(5)].map((_, i) => (
          <path key={i} d={`M0 ${180 + i * 130} Q 300 ${130 + i * 130} 700 ${180 + i * 130} T 1400 ${180 + i * 130}`} fill="none" stroke="#f9a8d4" strokeWidth="1" opacity="0.12"/>
        ))}
      </svg>
    </div>
  );
}

function SocialPopup({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <motion.div key="overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(219,39,119,0.18)", backdropFilter: "blur(6px)" }}
      onClick={onCancel}>
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 20 }} transition={{ type: "spring", stiffness: 320, damping: 22 }}
        onClick={(e) => e.stopPropagation()}
        style={{ background: "#fff", borderRadius: "28px", border: "2px solid #fce7f3", boxShadow: "0 12px 48px rgba(219,39,119,0.18)", padding: "28px 28px 24px", maxWidth: "300px", width: "90%", textAlign: "center" }}>
        <img src="/popup.gif" alt="" style={{ width: "140px", height: "140px", objectFit: "contain", margin: "0 auto 16px", display: "block" }} />
        <p style={{ fontFamily: "'Dancing Script', cursive", fontSize: "1.45rem", color: PINK, margin: "0 0 20px", lineHeight: 1.3 }}>
          do u really wanna meet me?
        </p>
        <div className="flex gap-3 justify-center">
          <button onClick={onConfirm} style={{ background: PINK, color: "#fff", border: "none", borderRadius: "99px", padding: "8px 24px", fontFamily: "'Dancing Script', cursive", fontSize: "1.1rem", cursor: "pointer", boxShadow: "0 4px 12px rgba(219,39,119,0.3)" }}>yes!!</button>
          <button onClick={onCancel} style={{ background: PINK_PAL, color: PINK, border: `1.5px solid ${PINK_LT}`, borderRadius: "99px", padding: "8px 24px", fontFamily: "'Dancing Script', cursive", fontSize: "1.1rem", cursor: "pointer" }}>nope</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

const card: React.CSSProperties = {
  background: "rgba(255,255,255,0.84)", borderRadius: "22px",
  border: "1.5px solid #fce7f3", backdropFilter: "blur(10px)",
  boxShadow: "0 4px 24px rgba(236,72,153,0.07)",
};
const pill = (filled = true): React.CSSProperties => ({
  background: filled ? PINK : PINK_PAL, color: filled ? "#fff" : PINK,
  fontSize: "10px", letterSpacing: "1.8px", padding: "3px 14px",
  borderRadius: "99px", fontFamily: "'Nunito',sans-serif", fontWeight: 700,
  textTransform: "uppercase", border: filled ? "none" : `1px solid ${PINK_LT}`,
  display: "inline-block",
});
const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: "easeOut" },
});

export default function Home() {
  const [popup, setPopup] = useState<string | null>(null);
  const { data } = useSiteData();

  useEffect(() => { trackVisit(); }, []);

  const name = data.name || "Mockingbird";
  const bio = data.bio || "just a girl living in her own little world, collecting soft moments & pretty things";
  const tags = data.tags?.length ? data.tags : ["she/her", "dreamer", "soft life"];
  const obsessions = data.obsessions?.length ? data.obsessions : ["chess", "anime", "matcha", "soft music", "night sky"];
  const friends = data.friends?.length ? data.friends : [
    { name: "soap",   img: "/friend-soap.jpg" },
    { name: "akaza",  img: "/friend-akaza.jpg" },
    { name: "luffy",  img: "/friend-luffy.jpg" },
    { name: "mikasa", img: "/friend-mikasa.png" },
  ];
  const socials = data.socials?.length ? data.socials.map(s => ({
    ...s,
    icon: SOCIAL_ICONS[s.name] ?? <SiInstagram size={22} style={{ color: PINK_MID }} />,
  })) : defaultSocials;

  function handleSocialClick(e: React.MouseEvent, url: string) {
    e.preventDefault();
    setPopup(url);
  }
  function handleConfirm() {
    if (popup) window.open(popup, "_blank", "noopener,noreferrer");
    setPopup(null);
  }

  return (
    <div className="min-h-screen relative overflow-x-hidden"
      style={{ background: "linear-gradient(155deg,#fff0f6 0%,#fce7f3 40%,#fdf2f8 70%,#fff5f7 100%)" }}>
      <Petals />

      <AnimatePresence>
        {popup && <SocialPopup onConfirm={handleConfirm} onCancel={() => setPopup(null)} />}
      </AnimatePresence>

      {/* ── cute admin button ── */}
      <Link href="/admin">
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          title="admin ✦"
          style={{
            position: "fixed", top: "16px", right: "16px", zIndex: 40,
            background: "rgba(255,255,255,0.85)",
            border: "1.5px solid #fce7f3",
            borderRadius: "99px",
            padding: "7px 14px",
            display: "flex", alignItems: "center", gap: "6px",
            cursor: "pointer",
            boxShadow: "0 4px 16px rgba(219,39,119,0.14)",
            backdropFilter: "blur(8px)",
            fontFamily: "'Dancing Script', cursive",
            fontSize: "0.95rem",
            color: PINK,
          }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <rect x="5" y="11" width="14" height="11" rx="3" stroke={PINK} strokeWidth="1.8"/>
            <path d="M8 11V7a4 4 0 018 0v4" stroke={PINK} strokeWidth="1.8" strokeLinecap="round"/>
            <circle cx="12" cy="16" r="1.5" fill={PINK}/>
          </svg>
          <span>my space</span>
        </motion.button>
      </Link>

      <div className="relative z-10 max-w-2xl mx-auto px-4 pt-5 pb-20">
        {/* banner */}
        <motion.div {...fade(0)} style={{ borderRadius: "22px", overflow: "hidden", position: "relative" }}>
          <img src={data.bannerImg || "/banner.gif"} alt="Banner" className="w-full object-cover"
            style={{ height: "170px", objectPosition: "center top" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(219,39,119,0.45) 0%,transparent 55%)" }} />
          <div style={{ position: "absolute", top: "12px", left: "14px", fontSize: "9px", letterSpacing: "3px", color: "#fce7f3", fontFamily: "'Nunito',sans-serif", fontWeight: 700, textTransform: "uppercase" }}>Profile</div>
        </motion.div>

        {/* profile row */}
        <motion.div {...fade(0.1)} className="flex flex-col md:flex-row gap-3 mt-3">
          {/* avatar card */}
          <div style={{ ...card, padding: "18px", flexShrink: 0, textAlign: "center" }} className="md:min-w-[152px] md:max-w-[170px]">
            <div style={{ width: "82px", height: "82px", borderRadius: "50%", overflow: "hidden", border: "3px solid #fbcfe8", margin: "0 auto 10px" }}>
              <img src={data.avatarImg || "/avatar.jpg"} alt={name} className="w-full h-full object-cover" />
            </div>
            <div style={{ fontFamily: "'Pinyon Script', cursive", fontSize: "1.9rem", color: PINK, lineHeight: 1.1, marginBottom: "10px" }}>
              {name}
            </div>
            <div style={{ fontSize: "9px", color: "#be185d", fontFamily: "'Nunito',sans-serif", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "5px" }}>obsessed w/</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", justifyContent: "center", marginBottom: "12px" }}>
              {obsessions.map(o => (
                <span key={o} style={{ fontSize: "9px", padding: "1px 7px", borderRadius: "99px", background: PINK_PAL, color: PINK, fontFamily: "'Nunito',sans-serif", fontWeight: 600, border: `1px solid ${PINK_LT}` }}>{o}</span>
              ))}
            </div>
            <MusicPlayer />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
              {gameCubes.map((g) => (
                <div key={g.label} style={{ background: PINK_PAL, borderRadius: "14px", border: `1.5px solid ${PINK_LT}`, padding: "8px 4px", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                  {g.svg}
                  <span style={{ fontSize: "8.5px", color: PINK, fontFamily: "'Nunito',sans-serif", fontWeight: 600, textAlign: "center" }}>{g.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* about card */}
          <div style={{ ...card, padding: "16px 18px", flex: 1 }}>
            <span style={pill()}>About Me</span>
            <p style={{ fontFamily: "'Dancing Script', cursive", fontSize: "1.1rem", color: "#831843", lineHeight: 1.6, margin: "10px 0" }}>
              {bio}
            </p>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {tags.map(tag => (
                <span key={tag} style={{ fontSize: "10px", padding: "2px 9px", borderRadius: "99px", background: PINK_PAL, color: PINK, fontFamily: "'Nunito',sans-serif", fontWeight: 600, border: `1px solid ${PINK_LT}` }}>{tag}</span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* hobbies */}
        <motion.div {...fade(0.2)} style={{ ...card, padding: "18px", marginTop: "12px" }}>
          <div className="flex items-center gap-2 mb-3">
            <span style={pill()}>Hobbies</span>
            <span style={{ fontSize: "10px", color: "#be185d", fontFamily: "'Nunito',sans-serif" }}>& Interests</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {hobbies.map((h, i) => (
              <motion.div key={h.label} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.25 + i * 0.04, duration: 0.32 }}
                className="flex flex-col items-center gap-1.5 py-3"
                style={{ background: PINK_PAL, borderRadius: "16px", border: `1.5px solid ${PINK_LT}` }}>
                {h.svg}
                <span style={{ fontSize: "9px", color: PINK, fontFamily: "'Nunito',sans-serif", fontWeight: 600, textAlign: "center", lineHeight: 1.2 }}>{h.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* friends */}
        <motion.div {...fade(0.3)} style={{ ...card, padding: "18px", marginTop: "12px" }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span style={pill(false)}>Friends</span>
              <span style={{ fontSize: "10px", color: "#be185d", fontFamily: "'Nunito',sans-serif" }}>besties</span>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill={PINK_MID} opacity="0.7">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </div>
          <div className="flex gap-4 flex-wrap">
            {friends.map((f, i) => (
              <motion.div key={f.name} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 + i * 0.07 }} className="flex flex-col items-center gap-1.5">
                <div style={{ width: "56px", height: "56px", borderRadius: "50%", overflow: "hidden", border: "2.5px solid #fbcfe8", boxShadow: "0 2px 8px rgba(219,39,119,0.12)" }}>
                  <img src={f.img} alt={f.name} className="w-full h-full object-cover" />
                </div>
                <span style={{ fontSize: "10px", color: PINK, fontFamily: "'Nunito',sans-serif", fontWeight: 600, textTransform: "capitalize" }}>{f.name}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* socials */}
        <motion.div {...fade(0.4)} style={{ ...card, padding: "18px", marginTop: "12px" }}>
          <div className="flex items-center gap-2 mb-3">
            <span style={pill()}>Socials</span>
            <span style={{ fontSize: "10px", color: "#be185d", fontFamily: "'Nunito',sans-serif" }}>find me here</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {socials.map((s, i) => (
              <motion.a key={s.name} href={s.url}
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 + i * 0.06 }}
                whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.96 }}
                onClick={(e) => handleSocialClick(e, s.url)}
                className="flex flex-col items-center gap-2 py-4"
                style={{ background: PINK_PAL, borderRadius: "18px", border: `1.5px solid ${PINK_LT}`, textDecoration: "none", cursor: "pointer" }}>
                {s.icon}
                <span style={{ fontSize: "10px", color: PINK, fontFamily: "'Nunito',sans-serif", fontWeight: 600 }}>{s.name}</span>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
