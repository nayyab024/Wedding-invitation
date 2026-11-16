/* ==========================================================
   Nayyab's Barat Invitation
   ========================================================== */

/* ---- Couple details (as printed on the invitation card) ----
   title + given: shown on the main invitation
   short:   shown on the envelope screen and footer ("___ & Nayyab")
   initial: used on the monogram and wax seal                      */
const GROOM = {
  title: "Syed",
  given: "Abu Turab Haider Naqvi",
  short: "Abu Turab",
  initial: "A"
};
GROOM.full = `${GROOM.title} ${GROOM.given}`; // Syed Abu Turab Haider Naqvi
const BRIDE = "Syeda Nayyab Fatima";
const VENUE = "Al-Siddique Banquet Hall, F753, 754, Sidiqqui Chowk 6th Rd, Block F, New Katarlan, Satellite Town, Rawalpindi";

/* Barat: Monday 30 November 2026, Night (Pakistan time).
   Per the card: Arrival of Barat 7:00 pm … Rukhsati 9:00 pm.
   The countdown runs to the arrival of the Barat. */
const BARAT_DAY = new Date("2026-11-30T19:00:00+05:00");
const DAY_MS = 864e5;

const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---- Apply names ---- */
(function applyNames() {
  const fill = (sel, val) => { if (val) document.querySelectorAll(sel).forEach(el => el.textContent = val); };
  fill("[data-groom-title]", GROOM.title);
  fill("[data-groom-given]", GROOM.given);
  fill("[data-groom-short]", GROOM.short);
  fill("[data-groom-initial]", GROOM.initial);
  document.title = `${GROOM.short} & Nayyab | Barat Invitation`;
})();

/* ---- Opening envelope ---- */
const intro = document.getElementById("intro");
const page = document.getElementById("invitation");
const openBtn = document.getElementById("openInvite");
document.body.style.overflow = "hidden";

function openInvitation() {
  if (openBtn.disabled) return;
  openBtn.disabled = true;
  intro.classList.add("opening");
  const seal = document.querySelector(".seal").getBoundingClientRect();
  burst(seal.left + seal.width / 2, seal.top + seal.height / 2);
  // seal lifts → flaps unfold (top, sides, bottom) → card rises, envelope slides away → reveal
  setTimeout(() => {
    intro.classList.add("open");
    page.inert = false;
    page.classList.add("live");
    document.body.style.overflow = "";
    document.querySelector("h1").focus({ preventScroll: true });
  }, reduceMotion ? 0 : 3100);
}
openBtn.addEventListener("click", openInvitation);
document.getElementById("envelope").addEventListener("click", openInvitation);

/* ---- Falling petals ---- */
(function petals() {
  if (reduceMotion) return;
  const box = document.getElementById("petals");
  const glyphs = ["❀", "✿", "❀", "❁", "✾"];
  const count = innerWidth < 600 ? 9 : 16;
  for (let i = 0; i < count; i++) {
    const s = document.createElement("span");
    s.className = "petal";
    s.textContent = glyphs[i % glyphs.length];
    const dur = 11 + Math.random() * 10;
    s.style.left = Math.random() * 100 + "%";
    s.style.fontSize = 12 + Math.random() * 12 + "px";
    s.style.opacity = (0.35 + Math.random() * 0.5).toFixed(2);
    s.style.animationDuration = dur + "s";
    s.style.animationDelay = -Math.random() * dur + "s";
    s.style.setProperty("--drift", (Math.random() * 160 - 80) + "px");
    s.style.setProperty("--spin", (240 + Math.random() * 360) * (Math.random() < .5 ? -1 : 1) + "deg");
    box.appendChild(s);
  }
})();

/* ---- Sparkle particles (ambient + bursts) ---- */
const sparkCanvas = document.getElementById("sparkles");
const sctx = sparkCanvas.getContext("2d");
const sparkRGB = getComputedStyle(document.documentElement).getPropertyValue("--spark").trim() || "181,146,203";
let sparks = [];
function sizeSparks() {
  const dpr = Math.min(devicePixelRatio || 1, 2);
  sparkCanvas.width = innerWidth * dpr;
  sparkCanvas.height = innerHeight * dpr;
  sctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
function ambientSpark() {
  return { x: Math.random() * innerWidth, y: innerHeight + 10, vx: (Math.random() - .5) * .2, vy: -(.2 + Math.random() * .45),
           r: .6 + Math.random() * 1.8, life: 1, decay: .0012 + Math.random() * .002, tw: Math.random() * 6.28, gold: Math.random() < .35 };
}
function burst(x, y) {
  if (reduceMotion) return;
  for (let i = 0; i < 70; i++) {
    const a = Math.random() * Math.PI * 2, sp = 1 + Math.random() * 4.5;
    sparks.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 1, r: 1 + Math.random() * 2.4, life: 1,
                  decay: .012 + Math.random() * .015, tw: Math.random() * 6.28, gold: Math.random() < .5, grav: .05 });
  }
}
function drawSparks() {
  sctx.clearRect(0, 0, innerWidth, innerHeight);
  const ambientMax = innerWidth < 600 ? 22 : 40;
  if (sparks.filter(p => !p.grav).length < ambientMax && Math.random() < .25) sparks.push(ambientSpark());
  sparks = sparks.filter(p => p.life > 0 && p.y > -20);
  for (const p of sparks) {
    p.x += p.vx; p.y += p.vy; if (p.grav) p.vy += p.grav;
    p.life -= p.decay; p.tw += .08;
    const alpha = Math.max(0, p.life) * (.55 + .45 * Math.sin(p.tw));
    sctx.beginPath();
    sctx.fillStyle = p.gold ? `rgba(226,190,110,${alpha})` : `rgba(${sparkRGB},${alpha})`;
    sctx.shadowColor = sctx.fillStyle; sctx.shadowBlur = 6;
    sctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); sctx.fill();
  }
  requestAnimationFrame(drawSparks);
}
if (!reduceMotion) { sizeSparks(); addEventListener("resize", sizeSparks); drawSparks(); }

/* ---- Scroll reveal ---- */
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
}, { threshold: .15, rootMargin: "0px 0px -40px 0px" });
document.querySelectorAll(".reveal-up").forEach((el, i) => {
  el.style.transitionDelay = (i % 3) * 0.12 + "s";
  io.observe(el);
});

/* ---- Gentle parallax on botanicals ---- */
if (!reduceMotion) {
  const bots = document.querySelectorAll(".hero .botanical");
  addEventListener("scroll", () => {
    const y = scrollY;
    bots.forEach((b, i) => b.style.translate = `0 ${y * (i ? -0.12 : 0.18)}px`);
  }, { passive: true });
}

/* ---- Countdown ---- */
const cd = { days: 0, hours: 0, minutes: 0, seconds: 0 };
const label = document.getElementById("countdownLabel");
function tick() {
  const now = Date.now();
  let t = Math.max(0, BARAT_DAY - now);
  if (t === 0) {
    label.textContent = now - BARAT_DAY < DAY_MS / 4 ? "Tonight is the night!" : "Alhamdulillah, our journey has begun";
  }
  const vals = { days: Math.floor(t / DAY_MS), hours: Math.floor(t % DAY_MS / 36e5), minutes: Math.floor(t % 36e5 / 6e4), seconds: Math.floor(t % 6e4 / 1000) };
  for (const [id, v] of Object.entries(vals)) {
    const el = document.getElementById(id);
    const txt = String(v).padStart(2, "0");
    if (el.textContent !== txt) {
      el.textContent = txt;
      if (cd[id] !== v && !reduceMotion) { el.classList.remove("tick"); void el.offsetWidth; el.classList.add("tick"); }
      cd[id] = v;
    }
  }
}
tick(); setInterval(tick, 1000);

/* ---- Scratch to reveal ---- */
(function scratchCard() {
  const canvas = document.getElementById("scratch"), wrap = document.getElementById("scratchWrap");
  const ctx = canvas.getContext("2d"), btn = document.getElementById("revealDate");
  const W = 500, H = 260;
  let active = null, last = null, revealed = false;
  canvas.width = W * 2; canvas.height = H * 2;

  function reveal() {
    if (revealed) return;
    revealed = true; active = null; last = null;
    canvas.classList.add("gone"); wrap.style.touchAction = "auto";
    btn.textContent = "We look forward to celebrating with you!";
    btn.classList.add("done"); btn.disabled = true;
    const r = wrap.getBoundingClientRect();
    burst(r.left + r.width / 2, r.top + r.height / 2);
  }
  btn.addEventListener("click", reveal);
  if (!ctx) { reveal(); return; }

  function paint() {
    ctx.setTransform(2, 0, 0, 2, 0, 0);
    ctx.globalCompositeOperation = "source-over";
    const g = ctx.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, "#b8903c"); g.addColorStop(.5, "#f5e2a6"); g.addColorStop(1, "#a37a2c");
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = "#7a5a1f"; ctx.lineWidth = 1; ctx.strokeRect(12, 12, W - 24, H - 24);
    ctx.strokeStyle = "#fff4d0aa"; ctx.strokeRect(17, 17, W - 34, H - 34);
    ctx.fillStyle = "#4a1520"; ctx.textAlign = "center";
    ctx.font = "34px serif"; ctx.fillText("❦  ✿  ❦", W / 2, 92);
    ctx.font = "600 24px 'Cormorant Garamond', serif"; ctx.fillText("Scratch to reveal the date", W / 2, 140);
    ctx.font = "italic 18px 'Cormorant Garamond', serif"; ctx.fillText("of our Barat", W / 2, 170);
  }
  paint();
  document.fonts && document.fonts.ready.then(() => { if (!revealed) paint(); });

  const pt = e => { const r = canvas.getBoundingClientRect(); return { x: (e.clientX - r.left) * W / r.width, y: (e.clientY - r.top) * H / r.height }; };
  function scratch(e) {
    if (revealed || e.pointerId !== active) return;
    if (e.cancelable) e.preventDefault();
    const p = pt(e);
    ctx.globalCompositeOperation = "destination-out";
    ctx.lineWidth = 48; ctx.lineCap = "round"; ctx.lineJoin = "round";
    if (last) { ctx.beginPath(); ctx.moveTo(last.x, last.y); ctx.lineTo(p.x, p.y); ctx.stroke(); }
    ctx.beginPath(); ctx.arc(p.x, p.y, 24, 0, Math.PI * 2); ctx.fill();
    last = p;
  }
  function stop(e) {
    if (e && e.pointerId !== undefined && e.pointerId !== active) return;
    if (!revealed && active !== null) {
      const px = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let clear = 0, total = 0;
      for (let i = 3; i < px.length; i += 64) { total++; if (px[i] < 100) clear++; }
      if (clear / total > .38) reveal();
    }
    const id = active; active = null; last = null;
    if (id !== null && canvas.hasPointerCapture && canvas.hasPointerCapture(id)) canvas.releasePointerCapture(id);
  }
  canvas.addEventListener("pointerdown", e => {
    if (revealed || active !== null || e.isPrimary === false || (e.pointerType === "mouse" && e.button !== 0)) return;
    active = e.pointerId; last = null;
    try { canvas.setPointerCapture(e.pointerId); } catch {}
    scratch(e);
  }, { passive: false });
  addEventListener("pointermove", scratch, { passive: false });
  addEventListener("pointerup", stop);
  addEventListener("pointercancel", stop);
  canvas.addEventListener("lostpointercapture", stop);
  canvas.addEventListener("contextmenu", e => e.preventDefault());
  addEventListener("blur", () => stop());
})();

/* ---- Save the date (.ics) — 7:00 pm to 9:00 pm PKT, per the card ---- */
document.getElementById("calendar").addEventListener("click", () => {
  const groom = GROOM.full;
  const esc = s => s.replace(/,/g, "\\,");
  const ics = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Nayyab Wedding//Barat//EN",
    "BEGIN:VEVENT", "UID:nayyab-barat-20261130@wedding", "DTSTAMP:20261116T000000Z",
    "DTSTART:20261130T140000Z", "DTEND:20261130T160000Z",
    `SUMMARY:Barat · ${groom} & ${BRIDE}`,
    `LOCATION:${esc(VENUE)}`,
    `DESCRIPTION:${esc(`Barat of ${BRIDE} with ${groom}. Monday, 30 November 2026. Arrival of Barat 7:00 pm, Nikkah 7:30 pm, Dinner 8:30 pm, Rukhsati 9:00 pm.`)}`,
    "END:VEVENT", "END:VCALENDAR"
  ].join("\r\n");
  const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url; a.download = "Nayyab-Barat.ics"; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});
