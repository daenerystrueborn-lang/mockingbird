import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { useSiteData, SiteData, readFileAsDataURL } from "../hooks/useSiteData";

const VISIT_KEY = "mockingbird_visits";

const PINK     = "#db2777";
const PINK_MID = "#ec4899";
const PINK_LT  = "#fce7f3";
const PINK_PAL = "#fff0f6";
const ADMIN_PASSWORD = "Mockinbird>12121";

const card: React.CSSProperties = {
  background: "rgba(255,255,255,0.9)", borderRadius: "22px",
  border: "1.5px solid #fce7f3", backdropFilter: "blur(10px)",
  boxShadow: "0 4px 24px rgba(236,72,153,0.09)",
  padding: "22px",
};

const inputStyle: React.CSSProperties = {
  width: "100%", background: PINK_PAL, border: `1.5px solid ${PINK_LT}`,
  borderRadius: "12px", padding: "9px 14px",
  fontFamily: "'Nunito', sans-serif", fontSize: "0.88rem", color: "#831843",
  outline: "none",
};

const labelStyle: React.CSSProperties = {
  fontSize: "9px", letterSpacing: "1.8px", textTransform: "uppercase",
  fontFamily: "'Nunito', sans-serif", fontWeight: 700, color: "#be185d",
  marginBottom: "5px", display: "block",
};

const sectionTitle: React.CSSProperties = {
  fontFamily: "'Dancing Script', cursive", fontSize: "1.3rem",
  color: PINK, marginBottom: "14px",
};

function UploadButton({ label, preview, onUpload, shape = "circle" }: {
  label: string;
  preview: string;
  onUpload: (dataUrl: string) => void;
  shape?: "circle" | "banner";
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    try {
      const url = await readFileAsDataURL(file);
      onUpload(url);
    } finally {
      setLoading(false);
      e.target.value = "";
    }
  }

  const isBanner = shape === "banner";
  return (
    <div className="flex flex-col items-center gap-2" style={{ width: isBanner ? "100%" : "auto" }}>
      <input ref={ref} type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} />
      <motion.div
        whileHover={{ scale: 1.03 }}
        onClick={() => ref.current?.click()}
        style={{
          width: isBanner ? "100%" : "72px",
          height: isBanner ? "100px" : "72px",
          borderRadius: isBanner ? "14px" : "50%",
          overflow: "hidden",
          border: `2px dashed ${PINK_LT}`,
          cursor: "pointer",
          background: PINK_PAL,
          display: "flex", alignItems: "center", justifyContent: "center",
          position: "relative",
          flexShrink: 0,
        }}>
        {preview ? (
          <>
            <img src={preview} alt={label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <div style={{ position: "absolute", inset: 0, background: "rgba(219,39,119,0.25)", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0, transition: "opacity 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "0")}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
                <polyline points="17 8 12 3 7 8" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="12" y1="3" x2="12" y2="15" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "8px" }}>
            {loading ? (
              <div style={{ fontSize: "10px", color: PINK, fontFamily: "'Nunito', sans-serif" }}>...</div>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ margin: "0 auto 4px" }}>
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" stroke={PINK_MID} strokeWidth="1.8" strokeLinecap="round"/>
                  <polyline points="17 8 12 3 7 8" stroke={PINK_MID} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="12" y1="3" x2="12" y2="15" stroke={PINK_MID} strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
                <div style={{ fontSize: "9px", color: PINK, fontFamily: "'Nunito', sans-serif", fontWeight: 600 }}>upload</div>
              </>
            )}
          </div>
        )}
      </motion.div>
      <span style={{ fontSize: "9px", color: "#be185d", fontFamily: "'Nunito', sans-serif", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase" }}>{label}</span>
    </div>
  );
}

function LockScreen({ onUnlock }: { onUnlock: () => void }) {
  const [pw, setPw] = useState("");
  const [shake, setShake] = useState(false);
  const [wrong, setWrong] = useState(false);

  function attempt() {
    if (pw === ADMIN_PASSWORD) { onUnlock(); }
    else {
      setShake(true); setWrong(true);
      setPw("");
      setTimeout(() => setShake(false), 500);
      setTimeout(() => setWrong(false), 2000);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: "linear-gradient(155deg,#fff0f6 0%,#fce7f3 40%,#fdf2f8 70%,#fff5f7 100%)" }}>
      {[...Array(8)].map((_, i) => (
        <div key={i} style={{
          position: "fixed", left: `${8 + i * 12}%`, bottom: "-20px",
          width: `${10 + (i * 3) % 10}px`, height: `${10 + (i * 3) % 10}px`,
          opacity: 0.4, pointerEvents: "none",
          animation: `float-up ${9 + (i * 1.3) % 9}s ${(i * 1.1) % 8}s linear infinite`,
        }}>
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M12 2C8 2 4 6 4 10C4 14 8 18 12 22C16 18 20 14 20 10C20 6 16 2 12 2Z" fill="#f9a8d4" opacity="0.7"/>
          </svg>
        </div>
      ))}

      <motion.div initial={{ opacity: 0, y: 24, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{ ...card, maxWidth: "360px", width: "90%", textAlign: "center", position: "relative", zIndex: 10 }}>

        <motion.div animate={shake ? { x: [-8, 8, -6, 6, -4, 4, 0] } : {}}
          transition={{ duration: 0.45 }}
          style={{ width: "58px", height: "58px", borderRadius: "50%", background: PINK_PAL, border: `2px solid ${PINK_LT}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px" }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <rect x="4" y="11" width="16" height="11" rx="3" stroke={PINK} strokeWidth="1.8"/>
            <path d="M8 11V7a4 4 0 018 0v4" stroke={PINK} strokeWidth="1.8" strokeLinecap="round"/>
            <circle cx="12" cy="16.5" r="1.5" fill={PINK}/>
          </svg>
        </motion.div>

        <div style={{ fontFamily: "'Pinyon Script', cursive", fontSize: "2.2rem", color: PINK, lineHeight: 1, marginBottom: "6px" }}>
          my little corner
        </div>
        <p style={{ fontFamily: "'Dancing Script', cursive", fontSize: "1rem", color: "#be185d", marginBottom: "22px" }}>
          type the secret word to enter ~
        </p>

        <div style={{ marginBottom: "14px", textAlign: "left" }}>
          <label style={labelStyle}>password</label>
          <input
            type="password"
            value={pw}
            onChange={e => setPw(e.target.value)}
            onKeyDown={e => e.key === "Enter" && attempt()}
            placeholder="✦ ✦ ✦ ✦ ✦ ✦"
            style={{ ...inputStyle, borderColor: wrong ? "#fb7185" : PINK_LT, textAlign: "center", letterSpacing: "3px" }}
            autoFocus
          />
          <AnimatePresence>
            {wrong && (
              <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                style={{ fontSize: "11px", color: "#fb7185", fontFamily: "'Dancing Script', cursive", marginTop: "6px", textAlign: "center" }}>
                hmm that's not right :(
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
          onClick={attempt}
          style={{ width: "100%", background: `linear-gradient(135deg, ${PINK}, ${PINK_MID})`, color: "#fff", border: "none", borderRadius: "99px", padding: "11px", fontFamily: "'Dancing Script', cursive", fontSize: "1.15rem", cursor: "pointer", boxShadow: "0 4px 16px rgba(219,39,119,0.3)" }}>
          enter ✦
        </motion.button>

        <div style={{ marginTop: "16px" }}>
          <Link href="/">
            <span style={{ fontSize: "11px", color: "#be185d", fontFamily: "'Nunito', sans-serif", fontWeight: 600, cursor: "pointer", textDecoration: "none", opacity: 0.7 }}>
              ← back to profile
            </span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function Admin() {
  const [unlocked, setUnlocked] = useState(false);
  const { data, save } = useSiteData();
  const [form, setForm] = useState<SiteData>({ ...data });
  const [saved, setSaved] = useState(false);

  function handleSave() {
    save(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  }

  function updateField<K extends keyof SiteData>(key: K, val: SiteData[K]) {
    setForm(f => ({ ...f, [key]: val }));
  }

  function updateArrayField(key: "tags" | "obsessions", raw: string) {
    updateField(key, raw.split(",").map(s => s.trim()).filter(Boolean));
  }

  function updateSocial(i: number, field: "name" | "url", val: string) {
    const next = form.socials.map((s, idx) => idx === i ? { ...s, [field]: val } : s);
    updateField("socials", next);
  }

  function updateFriend(i: number, field: "name" | "img", val: string) {
    const next = form.friends.map((f, idx) => idx === i ? { ...f, [field]: val } : f);
    updateField("friends", next);
  }

  const [visits, setVisits] = useState(0);
  useEffect(() => {
    try { setVisits(parseInt(localStorage.getItem(VISIT_KEY) || "0", 10)); } catch {}
  }, [unlocked]);

  if (!unlocked) return <LockScreen onUnlock={() => { setUnlocked(true); setForm({ ...data }); }} />;

  return (
    <div className="min-h-screen relative overflow-x-hidden"
      style={{ background: "linear-gradient(155deg,#fff0f6 0%,#fce7f3 40%,#fdf2f8 70%,#fff5f7 100%)" }}>

      <div className="relative z-10 max-w-2xl mx-auto px-4 pt-6 pb-24">

        {/* header */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6">
          <div>
            <div style={{ fontFamily: "'Pinyon Script', cursive", fontSize: "2.4rem", color: PINK, lineHeight: 1 }}>
              my little corner
            </div>
            <div style={{ fontFamily: "'Dancing Script', cursive", fontSize: "0.95rem", color: "#be185d", opacity: 0.8 }}>
              edit ur space ✦
            </div>
          </div>
          <div className="flex gap-2 items-center flex-wrap justify-end">
            <Link href="/">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}
                style={{ background: PINK_PAL, border: `1.5px solid ${PINK_LT}`, borderRadius: "99px", padding: "7px 16px", fontFamily: "'Dancing Script', cursive", fontSize: "0.95rem", color: PINK, cursor: "pointer" }}>
                ← view site
              </motion.button>
            </Link>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}
              onClick={handleSave}
              style={{ background: saved ? "#4ade80" : `linear-gradient(135deg, ${PINK}, ${PINK_MID})`, color: "#fff", border: "none", borderRadius: "99px", padding: "7px 20px", fontFamily: "'Dancing Script', cursive", fontSize: "0.95rem", cursor: "pointer", boxShadow: "0 4px 14px rgba(219,39,119,0.25)", transition: "background 0.3s" }}>
              {saved ? "saved! ✓" : "save changes ✦"}
            </motion.button>
          </div>
        </motion.div>

        {/* visitor counter */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.02 }}
          style={{ ...card, marginBottom: "14px", display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ width: "52px", height: "52px", borderRadius: "50%", background: "linear-gradient(135deg,#fce7f3,#fff0f6)", border: "1.5px solid #fce7f3", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke={PINK} strokeWidth="1.7" strokeLinecap="round"/>
              <circle cx="9" cy="7" r="4" stroke={PINK} strokeWidth="1.7"/>
              <path d="M23 21v-2a4 4 0 00-3-3.87" stroke={PINK_MID} strokeWidth="1.7" strokeLinecap="round"/>
              <path d="M16 3.13a4 4 0 010 7.75" stroke={PINK_MID} strokeWidth="1.7" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: "9px", letterSpacing: "1.8px", textTransform: "uppercase", fontFamily: "'Nunito',sans-serif", fontWeight: 700, color: "#be185d", marginBottom: "3px" }}>
              total visits
            </div>
            <div style={{ fontFamily: "'Pinyon Script', cursive", fontSize: "2rem", color: PINK, lineHeight: 1 }}>
              {visits.toLocaleString()}
            </div>
            <div style={{ fontSize: "10px", color: "#be185d", fontFamily: "'Dancing Script',cursive", opacity: 0.7 }}>
              ppl who visited ur page ✦
            </div>
          </div>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => { try { setVisits(parseInt(localStorage.getItem(VISIT_KEY) || "0", 10)); } catch {} }}
            style={{ marginLeft: "auto", background: PINK_PAL, border: `1.5px solid ${PINK_LT}`, borderRadius: "99px", padding: "5px 12px", fontSize: "10px", fontFamily: "'Nunito',sans-serif", fontWeight: 700, color: PINK, cursor: "pointer", flexShrink: 0 }}>
            refresh
          </motion.button>
        </motion.div>

        {/* images */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          style={{ ...card, marginBottom: "14px" }}>
          <div style={sectionTitle}>images ✦</div>

          {/* banner */}
          <div style={{ marginBottom: "18px" }}>
            <label style={labelStyle}>banner</label>
            <UploadButton
              label="click to upload banner"
              preview={form.bannerImg || "/banner.gif"}
              onUpload={url => updateField("bannerImg", url)}
              shape="banner"
            />
            {form.bannerImg && (
              <button onClick={() => updateField("bannerImg", "")}
                style={{ marginTop: "6px", background: "none", border: "none", fontSize: "11px", color: "#fb7185", fontFamily: "'Nunito', sans-serif", cursor: "pointer", fontWeight: 600 }}>
                ✕ remove (use default)
              </button>
            )}
          </div>

          {/* avatar */}
          <div>
            <label style={labelStyle}>profile picture</label>
            <div className="flex items-center gap-4">
              <UploadButton
                label="avatar"
                preview={form.avatarImg || "/avatar.jpg"}
                onUpload={url => updateField("avatarImg", url)}
                shape="circle"
              />
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: "11px", color: "#be185d", fontFamily: "'Nunito', sans-serif", lineHeight: 1.5 }}>
                  click the image to upload a new one from your device ✦
                </p>
                {form.avatarImg && (
                  <button onClick={() => updateField("avatarImg", "")}
                    style={{ marginTop: "6px", background: "none", border: "none", fontSize: "11px", color: "#fb7185", fontFamily: "'Nunito', sans-serif", cursor: "pointer", fontWeight: 600 }}>
                    ✕ remove (use default)
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* identity */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
          style={{ ...card, marginBottom: "14px" }}>
          <div style={sectionTitle}>identity ✦</div>
          <div className="flex flex-col gap-4">
            <div>
              <label style={labelStyle}>display name</label>
              <input style={inputStyle} value={form.name} onChange={e => updateField("name", e.target.value)} placeholder="Mockingbird" />
            </div>
            <div>
              <label style={labelStyle}>bio</label>
              <textarea rows={3} style={{ ...inputStyle, resize: "vertical" }} value={form.bio} onChange={e => updateField("bio", e.target.value)} placeholder="just a girl living in her own little world..." />
            </div>
            <div>
              <label style={labelStyle}>tags (comma separated)</label>
              <input style={inputStyle} value={form.tags.join(", ")} onChange={e => updateArrayField("tags", e.target.value)} placeholder="she/her, dreamer, soft life" />
            </div>
            <div>
              <label style={labelStyle}>obsessed with (comma separated)</label>
              <input style={inputStyle} value={form.obsessions.join(", ")} onChange={e => updateArrayField("obsessions", e.target.value)} placeholder="chess, anime, matcha..." />
            </div>
          </div>
        </motion.div>

        {/* socials */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }}
          style={{ ...card, marginBottom: "14px" }}>
          <div style={sectionTitle}>socials ✦</div>
          <div className="flex flex-col gap-3">
            {form.socials.map((s, i) => (
              <div key={i} className="flex gap-2 items-center">
                <div style={{ flexShrink: 0, width: "90px" }}>
                  <input style={{ ...inputStyle, fontSize: "0.82rem", textAlign: "center" }}
                    value={s.name} onChange={e => updateSocial(i, "name", e.target.value)}
                    placeholder="Platform" />
                </div>
                <div style={{ flex: 1 }}>
                  <input style={{ ...inputStyle, fontSize: "0.82rem" }}
                    value={s.url} onChange={e => updateSocial(i, "url", e.target.value)}
                    placeholder="https://..." />
                </div>
                <button onClick={() => updateField("socials", form.socials.filter((_, idx) => idx !== i))}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#fb7185", fontSize: "1rem", padding: "4px", flexShrink: 0 }}>✕</button>
              </div>
            ))}
            <button onClick={() => updateField("socials", [...form.socials, { name: "", url: "" }])}
              style={{ background: PINK_PAL, border: `1.5px dashed ${PINK_LT}`, borderRadius: "12px", padding: "8px", fontFamily: "'Dancing Script', cursive", fontSize: "1rem", color: PINK, cursor: "pointer", width: "100%", marginTop: "4px" }}>
              + add social
            </button>
          </div>
        </motion.div>

        {/* friends */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          style={{ ...card, marginBottom: "14px" }}>
          <div style={sectionTitle}>besties ✦</div>
          <div className="flex flex-col gap-4">
            {form.friends.map((f, i) => (
              <div key={i} className="flex gap-3 items-center">
                {/* friend photo upload */}
                <UploadButton
                  label={f.name || `friend ${i + 1}`}
                  preview={f.img}
                  onUpload={url => updateFriend(i, "img", url)}
                  shape="circle"
                />
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
                  <input style={{ ...inputStyle, fontSize: "0.82rem" }}
                    value={f.name} onChange={e => updateFriend(i, "name", e.target.value)}
                    placeholder="name" />
                  <input style={{ ...inputStyle, fontSize: "0.78rem", color: "#be185d", opacity: 0.7 }}
                    value={f.img} onChange={e => updateFriend(i, "img", e.target.value)}
                    placeholder="/friend-name.jpg or https://..." />
                </div>
                <button onClick={() => updateField("friends", form.friends.filter((_, idx) => idx !== i))}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#fb7185", fontSize: "1rem", padding: "4px", flexShrink: 0, alignSelf: "flex-start" }}>✕</button>
              </div>
            ))}
            <button onClick={() => updateField("friends", [...form.friends, { name: "", img: "" }])}
              style={{ background: PINK_PAL, border: `1.5px dashed ${PINK_LT}`, borderRadius: "12px", padding: "8px", fontFamily: "'Dancing Script', cursive", fontSize: "1rem", color: PINK, cursor: "pointer", width: "100%" }}>
              + add bestie
            </button>
          </div>
        </motion.div>

        {/* save */}
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onClick={handleSave}
          style={{ width: "100%", background: saved ? "#4ade80" : `linear-gradient(135deg, ${PINK}, ${PINK_MID})`, color: "#fff", border: "none", borderRadius: "99px", padding: "14px", fontFamily: "'Dancing Script', cursive", fontSize: "1.3rem", cursor: "pointer", boxShadow: "0 6px 20px rgba(219,39,119,0.28)", transition: "background 0.3s" }}>
          {saved ? "saved! ✓" : "save all changes ✦"}
        </motion.button>
      </div>
    </div>
  );
}
