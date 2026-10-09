/* =============================================================================
   CoreStruct · Reels — motor compartido de las 5 plantillas.

   Lee el plan del bloque <script type="application/json" id="reel-data">,
   que escribe `scripts/build.mjs` a partir de videos/<ID>/reel.json, y arma
   todo el texto del video y UNA sola línea de tiempo GSAP en pausa. El HTML
   la registra en window.__timelines["main"] (el lint exige verlo inline).

   Reglas de HyperFrames que se respetan aquí:
   - nada de Math.random sin semilla (el fondo usa mulberry32 con semilla);
   - nada de repeat:-1, ni relojes, ni red;
   - nunca se anima un elemento .clip (los <video> los maneja el framework);
   - los textos son spans dentro de contenedores con tamaño fijo.
   ========================================================================== */
window.CoreStructReel = { build: function () {
  "use strict";

  var P = JSON.parse(document.getElementById("reel-data").textContent);
  var D = P.duration;
  var CYAN = "#3898d4";
  var tl = gsap.timeline({ paused: true });
  var $ = function (sel) { return document.querySelector(sel); };

  function el(tag, cls, parent) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (parent) parent.appendChild(n);
    return n;
  }

  /** "Si diriges un *colegio*" → [{t:"Si"},…,{t:"colegio",em:true}] */
  function tokens(text) {
    return String(text).split(/\s+/).filter(Boolean).map(function (w) {
      var em = /^\*.*\*[.,;:!?…]*$/.test(w);
      return { t: w.replace(/\*/g, ""), em: em };
    });
  }

  function writeWords(target, text) {
    var spans = [];
    tokens(text).forEach(function (tok, i) {
      if (i) target.appendChild(document.createTextNode(" "));
      var s = el("span", "w" + (tok.em ? " em" : ""), target);
      s.textContent = tok.t;
      spans.push(s);
    });
    return spans;
  }

  /* ------------------------------------------------ Fondo: estrellas */
  // Versión determinista del starfield del sitio (src/scripts/modules/starfield.js):
  // misma paleta y misma idea (motas que suben, se mecen y titilan), pero cada
  // posición es función pura del tiempo, para que cualquier fotograma se
  // pueda reproducir.
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  var canvas = $("#stars");
  var ctx = canvas.getContext("2d");
  canvas.width = 1080; canvas.height = 1920;
  ctx.globalCompositeOperation = "lighter";
  function sprite(rgb) {
    var c = document.createElement("canvas"); c.width = c.height = 64;
    var g = c.getContext("2d");
    var lift = function (k) { return rgb.map(function (v) { return Math.round(v + (255 - v) * k); }).join(","); };
    var grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, "rgba(" + lift(0.72) + ",1)");
    grad.addColorStop(0.15, "rgba(" + lift(0.12) + ",0.88)");
    grad.addColorStop(0.42, "rgba(" + rgb.join(",") + ",0.26)");
    grad.addColorStop(1, "rgba(" + rgb.join(",") + ",0)");
    g.fillStyle = grad; g.fillRect(0, 0, 64, 64);
    return c;
  }
  var palette = [
    { s: sprite([56, 152, 212]), share: 0.5 },
    { s: sprite([129, 141, 186]), share: 0.32 },
    { s: sprite([255, 255, 255]), share: 0.18 },
  ];
  var rnd = mulberry32(P.seed || 20261);
  var span = 1920 + 30;
  var motes = [];
  for (var i = 0; i < 90; i++) {
    var depth = Math.pow(rnd(), 2);
    var roll = rnd(), pick = palette[2].s;
    for (var k = 0; k < palette.length; k++) { roll -= palette[k].share; if (roll <= 0) { pick = palette[k].s; break; } }
    motes.push({
      x: rnd() * 1080, y: rnd() * span, depth: depth, s: pick,
      size: 7 + depth * 20, speed: 18 + depth * 46,
      alpha: (0.22 + depth * 0.5) * (0.7 + rnd() * 0.3),
      sway: (6 + rnd() * 16) * (0.4 + depth * 0.6), swayRate: (Math.PI * 2) / (6 + rnd() * 9), swayPhase: rnd() * Math.PI * 2,
      twRate: (Math.PI * 2) / (2.6 + rnd() * 4.9), twPhase: rnd() * Math.PI * 2,
    });
  }
  var clock = { t: 0 };
  function drawStars() {
    var t = clock.t;
    ctx.clearRect(0, 0, 1080, 1920);
    for (var j = 0; j < motes.length; j++) {
      var m = motes[j];
      var y = (((m.y - m.speed * t) % span) + span) % span - 15;
      var x = m.x + Math.sin(m.swayPhase + m.swayRate * t) * m.sway;
      var a = m.alpha * (1 - 0.45 * (0.5 + 0.5 * Math.sin(m.twPhase + m.twRate * t)));
      ctx.globalAlpha = a * 0.75;
      ctx.drawImage(m.s, x - m.size / 2, y - m.size / 2, m.size, m.size);
    }
    ctx.globalAlpha = 1;
  }
  drawStars();
  tl.to(clock, { t: D, duration: D, ease: "none", onUpdate: drawStars }, 0);

  /* ------------------------------------------------------- Teléfono */
  var phoneWrap = $("#phone-wrap");
  var phone = $("#phone");
  var zoom = $("#screen-zoom");
  var phoneScenes = P.scenes.filter(function (s) { return s.phone; });
  if (phoneScenes.length) {
    var first = P.scenes[0];
    if (first.phone) {
      // Movimiento desde el fotograma 0: el teléfono ya está entrando.
      tl.fromTo(phoneWrap, { y: 240, scale: 0.9, opacity: 1 }, { y: 0, scale: 1, opacity: 1, duration: 1.2, ease: "power3.out" }, 0);
    } else {
      tl.set(phoneWrap, { opacity: 0, y: 160 }, 0);
    }
  } else {
    tl.set(phoneWrap, { opacity: 0 }, 0);
  }

  var wasPhone = P.scenes.length ? P.scenes[0].phone : false;
  P.scenes.forEach(function (s, idx) {
    var dur = s.end - s.start;
    if (idx > 0 && s.phone !== wasPhone) {
      if (s.phone) {
        tl.fromTo(phoneWrap, { opacity: 0, y: 160, scale: 0.94 }, { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: "power3.out", immediateRender: false }, s.start);
      } else {
        tl.to(phoneWrap, { opacity: 0, y: 160, duration: 0.35, ease: "power2.in" }, s.start - 0.05);
      }
    }
    wasPhone = s.phone;

    if (s.phone) {
      // Zoom suave dentro de la pantalla (1.0 → 1.08 por defecto) y un leve
      // empuje del teléfono en cada corte.
      var z = s.zoom || [1, 1.06];
      tl.fromTo(zoom, { scale: z[0], transformOrigin: s.origin || "50% 30%" },
        { scale: z[1], duration: dur, ease: "sine.inOut", immediateRender: idx === 0 }, s.start);
      if (idx > 0) {
        tl.fromTo(phone, { scale: 0.975 }, { scale: 1, duration: 0.45, ease: "power3.out", immediateRender: false }, s.start);
      }
    }

    if (s.type === "wipe") buildWipe(s);
    if (s.type === "text" || s.type === "cards") buildStage(s);
    if (s.type === "face") {
      tl.set("#face", { opacity: 1 }, s.start);
      tl.set("#face", { opacity: 0 }, s.end);
    }
  });

  /* ----------------------------------------- Antes / después (formato C) */
  function buildWipe(s) {
    var mock = el("div", "before-mock", zoom);
    mock.id = "bm-" + s.id;
    var top = el("div", "bm-top", mock); el("div", "bm-logo", top); el("div", "bm-nav", top);
    var banner = el("div", "bm-banner", mock);
    var spin = el("div", "bm-spinner", banner);
    var b = s.before || {};
    el("div", "bm-title", mock).textContent = b.title || "Bienvenidos a nuestro sitio web";
    for (var n = 0; n < 9; n++) {
      var line = el("div", "bm-line", mock);
      line.style.width = (60 + ((n * 37) % 35)) + "%";
    }
    var pop = el("div", "bm-pop", mock);
    el("b", "", pop).textContent = b.popTitle || "Aviso";
    pop.appendChild(document.createTextNode(b.popText || "Este sitio usa cookies. Para continuar, acepte las condiciones."));
    // El "antes" se queda cargando: el spinner gira hasta que llega el barrido.
    if (mock.parentNode.firstChild !== mock) mock.parentNode.insertBefore(mock, mock.parentNode.firstChild);
    tl.set(mock, { opacity: 1 }, s.start);
    tl.fromTo(spin, { rotation: 0 }, { rotation: 360 * Math.max(1, Math.round((s.wipeAt - s.start) * 1.2)), duration: s.wipeAt - s.start, ease: "none", immediateRender: false }, s.start);
    tl.set(mock, { opacity: 0 }, s.end);
    var after = document.getElementById("wa-" + s.id);
    if (after) {
      tl.set(after, { opacity: 1, clipPath: "inset(0% 0% 0% 100%)" }, s.start);
      tl.to(after, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.7, ease: "power3.inOut" }, s.wipeAt);
      tl.set(after, { opacity: 0 }, s.end);
    }
  }

  /* --------------------------------------- Texto cinético y tarjetas */
  function buildStage(s) {
    var scene = el("div", "stage-scene", $("#stage"));
    scene.id = "st-" + s.id;
    var all = [];
    if (s.kicker) { var kick = el("span", "kicker", scene); kick.textContent = s.kicker; all.push(kick); }
    (s.lines || []).forEach(function (txt) {
      var line = el("span", "line", scene);
      all = all.concat(writeWords(line, txt));
    });
    var cards = [];
    if (s.items && s.items.length) {
      var wrap = el("div", "cards", scene);
      s.items.forEach(function (it) { var c = el("span", "card", wrap); c.textContent = it; cards.push(c); });
    }
    // Si la escena arranca debajo del gancho, su texto espera a que el gancho salga.
    var t0 = P.hook && !P.hook.hold && s.start < P.hook.end ? P.hook.end : s.start;
    tl.set(scene, { opacity: 1 }, t0);
    tl.fromTo(all, { opacity: 0, y: 46 }, { opacity: 1, y: 0, duration: 0.32, ease: "power3.out", stagger: 0.07, immediateRender: false }, t0 + 0.05);
    if (cards.length) {
      var gap = Math.min(0.45, Math.max(0.18, (s.end - s.start - 1.2) / cards.length));
      tl.fromTo(cards, { opacity: 0, y: 40, scale: 0.92 }, { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: "back.out(1.6)", stagger: gap, immediateRender: false }, t0 + 0.45);
    }
    tl.to(scene, { opacity: 0, duration: 0.2, ease: "power1.in" }, s.end - 0.2);
  }

  /* ----------------------------------------------------- Rótulos */
  var KEY_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="#253880" stroke-width="2.6" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5 21 21"/></svg>';
  P.labels.forEach(function (lb, idx) {
    var slot = el("div", "", $("#label"));
    slot.style.cssText = "position:absolute;inset:0;display:flex;justify-content:center";
    var chip = el("span", "chip" + (lb.key ? " chip--key" : ""), slot);
    chip.id = "label-" + idx;
    if (lb.key) chip.innerHTML = KEY_ICON;
    var txt = el("span", "", chip); txt.textContent = lb.text;
    tl.fromTo(chip, { opacity: 0, y: -18 }, { opacity: 1, y: 0, duration: 0.3, ease: "power3.out", immediateRender: false }, lb.start);
    tl.to(chip, { opacity: 0, duration: 0.2, ease: "power1.in" }, lb.end - 0.2);
  });

  /* ------------------------------------------------------ Gancho */
  if (P.hook) {
    var hookBig = el("div", "big", $("#hook"));
    var hw = writeWords(hookBig, P.hook.text);
    tl.fromTo("#scrim", { opacity: 0.55 }, { opacity: 1, duration: 0.25, ease: "none" }, 0);
    tl.fromTo(hw, { opacity: 0.25, y: 60, scale: 0.86 }, { opacity: 1, y: 0, scale: 1, duration: 0.32, ease: "back.out(1.7)", stagger: Math.min(0.1, 0.9 / hw.length) }, 0);
    if (!P.hook.hold) {
      tl.to(hookBig, { opacity: 0, y: -50, duration: 0.25, ease: "power2.in" }, P.hook.end - 0.25);
      tl.to("#scrim", { opacity: 0, duration: 0.3, ease: "power1.in" }, P.hook.end - 0.25);
    }
  }

  /* ---------------------------------------------------- Subtítulos */
  P.captions.forEach(function (c, idx) {
    var cap = el("div", "cap", $("#captions"));
    cap.id = "cap-" + idx;
    var box = el("span", "cap-box", cap);
    var spans = writeWords(box, c.words.map(function (w) { return w.text; }).join(" "));
    tl.set(cap, { opacity: 1 }, c.start);
    tl.fromTo(box, { y: 26, scale: 0.94 }, { y: 0, scale: 1, duration: 0.18, ease: "power3.out", immediateRender: false }, c.start);
    c.words.forEach(function (w, j) {
      tl.set(spans[j], { color: CYAN }, w.start);
      if (j < c.words.length - 1) tl.set(spans[j], { color: "#ffffff" }, w.end);
    });
    tl.set(cap, { opacity: 0 }, c.end);
  });

  /* --------------------------------------------------------- Cierre */
  if (P.cta) {
    var ctaBig = el("div", "big", $("#cta"));
    var cw = writeWords(ctaBig, P.cta.text);
    var ctaScene = P.scenes.filter(function (s) { return s.type === "cta"; })[0];
    if (ctaScene && ctaScene.phone) {
      tl.to(phoneWrap, { opacity: 0.22, scale: 0.9, y: 120, duration: 0.45, ease: "power2.inOut" }, P.cta.start);
    }
    tl.to("#scrim", { opacity: 1, duration: 0.4, ease: "power1.out" }, P.cta.start);
    tl.fromTo(cw, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.32, ease: "power3.out", stagger: 0.07, immediateRender: false }, P.cta.start + 0.1);
  }

  /* --------------------------------------------- Barra de progreso */
  tl.fromTo("#progress-fill", { scaleX: 0 }, { scaleX: 1, duration: P.endcard.start, ease: "none" }, 0);

  /* --------------------------------------------- Tarjeta final 1.5 s */
  var E = P.endcard;
  $("#ec-wa").innerHTML = "Escríbenos al <b>" + E.whatsapp + "</b>";
  $("#ec-url").textContent = E.url;
  $("#ec-handle").textContent = E.handle;
  if (P.cta) tl.to("#cta", { opacity: 0, duration: 0.2, ease: "power1.in" }, E.start);
  tl.fromTo("#endcard", { opacity: 0 }, { opacity: 1, duration: 0.22, ease: "power1.out", immediateRender: false }, E.start);
  tl.fromTo("#endcard-logo", { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, duration: 0.4, ease: "power3.out", immediateRender: false }, E.start + 0.05);
  tl.fromTo(".ec-anim", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.3, ease: "power3.out", stagger: 0.08, immediateRender: false }, E.start + 0.18);

  window.__reel = { plan: P, timeline: tl };
  return tl;
} };
