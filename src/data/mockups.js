/**
 * Card visuals.
 *
 * Each mockup is the *inside* of an SVG drawn on a shared 400x250 canvas; the
 * renderer supplies the wrapper. They are built from the primitives defined in
 * `src/styles/components/mockup.css`, which is what keeps eight different
 * interfaces looking like one family — and keeps stock photography out.
 *
 * One exception proves the rule: the menu card is a product shot, not an
 * interface, so it borrows the demo's bottle instead of the primitives.
 */

import { SILHOUETTE } from "./bottle.js";

/** Repeat a row of placeholder text bars. */
const textLines = (x, y, widths, { gap = 11, height = 5, className = "mk-text" } = {}) =>
  widths
    .map(
      (width, i) =>
        `<rect class="${className}" x="${x}" y="${y + i * gap}" width="${width}" height="${height}" rx="${height / 2}"/>`,
    )
    .join("");

/** The browser/app chrome most of the mockups sit inside. */
const window_ = (x, y, w, h, inner) => `
  <rect class="mk-window" x="${x}" y="${y}" width="${w}" height="${h}" rx="9"/>
  <path class="mk-line" d="M${x} ${y + 24}h${w}"/>
  <circle class="mk-text" cx="${x + 16}" cy="${y + 12}" r="3"/>
  <circle class="mk-text" cx="${x + 27}" cy="${y + 12}" r="3"/>
  <circle class="mk-text" cx="${x + 38}" cy="${y + 12}" r="3"/>
  ${inner}
`;

export const mockups = {
  /* 01 — Corporate site: hero band, headline, call to action, three teasers. */
  corporate: `
    <g class="mk-float">
      ${window_(
        40, 28, 320, 194,
        `
        <rect class="mk-surface" x="196" y="34" width="60" height="9" rx="4.5"/>
        <rect class="mk-surface" x="262" y="34" width="40" height="9" rx="4.5"/>
        <rect class="mk-accent-soft" x="308" y="34" width="36" height="9" rx="4.5"/>

        <rect class="mk-navy" x="56" y="66" width="288" height="76" rx="6"/>
        <rect class="mk-gradient" x="56" y="66" width="288" height="2.5" rx="1.25"/>
        ${textLines(72, 84, [148, 104], { gap: 15, height: 9 })}
        <rect class="mk-accent" x="72" y="116" width="52" height="14" rx="7"/>
        <rect class="mk-surface-strong" x="132" y="116" width="52" height="14" rx="7"/>

        <rect class="mk-surface" x="56" y="156" width="88" height="52" rx="5"/>
        <rect class="mk-surface" x="156" y="156" width="88" height="52" rx="5"/>
        <rect class="mk-surface" x="256" y="156" width="88" height="52" rx="5"/>
        ${textLines(66, 170, [46], { height: 5 })}
        ${textLines(166, 170, [52], { height: 5 })}
        ${textLines(266, 170, [40], { height: 5 })}
        ${textLines(66, 184, [62, 44], { gap: 9, height: 4 })}
        ${textLines(166, 184, [58, 50], { gap: 9, height: 4 })}
        ${textLines(266, 184, [64, 38], { gap: 9, height: 4 })}
      `,
      )}
    </g>
  `,

  /* 02 — Platform: an app shell with a second window layered behind it. */
  platform: `
    <g class="mk-float mk-float--delayed" opacity="0.45">
      <rect class="mk-window" x="96" y="18" width="272" height="160" rx="9"/>
      <path class="mk-line" d="M96 42h272"/>
    </g>
    <g class="mk-float">
      ${window_(
        32, 56, 300, 172,
        `
        <path class="mk-line" d="M110 80v148"/>
        <rect class="mk-accent-soft" x="44" y="92" width="52" height="9" rx="4.5"/>
        ${textLines(44, 110, [46, 54, 40, 50], { gap: 15, height: 6 })}
        <rect class="mk-surface" x="40" y="196" width="60" height="20" rx="6"/>

        <rect class="mk-surface" x="124" y="92" width="92" height="46" rx="5"/>
        <rect class="mk-surface" x="226" y="92" width="92" height="46" rx="5"/>
        <rect class="mk-gradient" x="124" y="92" width="92" height="2.5" rx="1.25"/>
        ${textLines(134, 104, [40, 58], { gap: 12, height: 5 })}
        ${textLines(236, 104, [46, 50], { gap: 12, height: 5 })}

        <rect class="mk-surface" x="124" y="150" width="194" height="66" rx="5"/>
        <path class="mk-line-accent" d="M136 200l24-16 22 10 26-26 24 14 26-22 24 12"/>
        <circle class="mk-accent" cx="282" cy="172" r="3"/>
      `,
      )}
    </g>
  `,

  /* 03 — Business system: a records table with one row selected. */
  system: `
    <g class="mk-float">
      ${window_(
        36, 30, 328, 190,
        `
        <path class="mk-line" d="M78 54v166"/>
        <rect class="mk-accent-soft" x="50" y="66" width="14" height="14" rx="4"/>
        <rect class="mk-surface-strong" x="50" y="90" width="14" height="14" rx="4"/>
        <rect class="mk-surface-strong" x="50" y="114" width="14" height="14" rx="4"/>
        <rect class="mk-surface-strong" x="50" y="138" width="14" height="14" rx="4"/>

        <rect class="mk-surface" x="92" y="64" width="258" height="18" rx="4"/>
        ${textLines(102, 71, [40], { height: 4, className: "mk-text-strong" })}
        ${textLines(178, 71, [46], { height: 4, className: "mk-text-strong" })}
        ${textLines(254, 71, [34], { height: 4, className: "mk-text-strong" })}
        ${textLines(310, 71, [28], { height: 4, className: "mk-text-strong" })}

        <rect class="mk-accent-soft" x="92" y="112" width="258" height="22" rx="4"/>
        <rect class="mk-accent" x="92" y="112" width="2.5" height="22" rx="1.25"/>
        ${[92, 118, 146, 174].map((y, i) => `
          ${textLines(102, y + 3, [52], { height: 5 })}
          ${textLines(178, y + 3, [58], { height: 5 })}
          ${textLines(254, y + 3, [42], { height: 5 })}
          <rect class="${i === 1 ? "mk-accent" : "mk-surface-strong"}" x="310" y="${y + 1}" width="30" height="9" rx="4.5"/>
        `).join("")}
        <path class="mk-line" d="M92 108h258M92 142h258M92 170h258"/>
      `,
      )}
    </g>
  `,

  /* 04 — Landing page: one long scroll, ending in a single action. */
  landing: `
    <g class="mk-float">
      <rect class="mk-window" x="122" y="16" width="156" height="218" rx="10"/>
      <clipPath id="mk-landing-clip">
        <rect x="122" y="16" width="156" height="218" rx="10"/>
      </clipPath>
      <g clip-path="url(#mk-landing-clip)">
        <rect class="mk-navy" x="122" y="16" width="156" height="86"/>
        <rect class="mk-gradient" x="122" y="100" width="156" height="2"/>
        ${textLines(140, 40, [110, 76], { gap: 14, height: 8 })}
        <rect class="mk-accent" x="140" y="74" width="58" height="15" rx="7.5"/>

        ${textLines(140, 116, [64], { height: 6, className: "mk-text-strong" })}
        <rect class="mk-surface" x="140" y="132" width="54" height="34" rx="4"/>
        <rect class="mk-surface" x="202" y="132" width="54" height="34" rx="4"/>
        ${textLines(140, 178, [120, 96, 108], { gap: 11, height: 5 })}

        <rect class="mk-surface-strong" x="122" y="218" width="156" height="16"/>
      </g>
      <rect class="mk-text" x="286" y="40" width="3" height="64" rx="1.5"/>
      <rect class="mk-accent" x="286" y="40" width="3" height="34" rx="1.5"/>
    </g>
  `,

  /* 05 — Education portal: an admissions flow, step two of three. */
  education: `
    <g class="mk-float">
      ${window_(
        30, 28, 340, 194,
        `
        <path class="mk-line-soft" d="M70 74h220"/>
        <circle class="mk-accent" cx="70" cy="74" r="9"/>
        <circle class="mk-accent" cx="180" cy="74" r="9"/>
        <circle class="mk-surface-strong" cx="290" cy="74" r="9"/>
        <path class="mk-line-accent" d="M70 74h110"/>
        ${textLines(52, 92, [36], { height: 4 })}
        ${textLines(160, 92, [42], { height: 4, className: "mk-text-strong" })}
        ${textLines(272, 92, [38], { height: 4 })}

        <rect class="mk-surface" x="52" y="118" width="180" height="20" rx="5"/>
        <rect class="mk-surface" x="52" y="146" width="180" height="20" rx="5"/>
        <rect class="mk-surface" x="52" y="174" width="86" height="20" rx="5"/>
        <rect class="mk-surface" x="146" y="174" width="86" height="20" rx="5"/>
        ${textLines(62, 125, [58], { height: 5 })}
        ${textLines(62, 153, [72], { height: 5 })}
        ${textLines(62, 181, [40], { height: 5 })}
        ${textLines(156, 181, [44], { height: 5 })}
        <rect class="mk-accent" x="52" y="118" width="2.5" height="20" rx="1.25"/>

        <rect class="mk-surface" x="252" y="118" width="96" height="76" rx="6"/>
        <rect class="mk-gradient" x="252" y="118" width="96" height="2.5" rx="1.25"/>
        <circle class="mk-accent-soft" cx="300" cy="146" r="16"/>
        <path class="mk-line-accent" d="M293 146l5 5 11-11" stroke-width="2"/>
        ${textLines(268, 172, [64, 44], { gap: 10, height: 4 })}
      `,
      )}
    </g>
  `,

  /* 06 — Menu: the only card that shows a product instead of an interface.
     It is the same bottle the Verbena demo pins to its viewport, shrunk onto a
     warm shelf, beside the brand and three lines of a card. The strokes inside
     the scaled group are sized for that 0.315 scale, so they land at the same
     hairline weight as every other mockup. */
  menu: `
    <defs>
      <radialGradient id="mk-shelf" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0%" stop-color="var(--mk-accent)" stop-opacity="0.3"/>
        <stop offset="100%" stop-color="var(--mk-accent)" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="mk-plinth" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0%" stop-color="var(--mk-shadow)" stop-opacity="0.6"/>
        <stop offset="62%" stop-color="var(--mk-shadow)" stop-opacity="0.26"/>
        <stop offset="100%" stop-color="var(--mk-shadow)" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="mk-drink" gradientUnits="userSpaceOnUse" x1="0" y1="176" x2="0" y2="646">
        <stop offset="0%" stop-color="var(--mk-accent)"/>
        <stop offset="100%" stop-color="var(--mk-accent-deep)"/>
      </linearGradient>
    </defs>

    <ellipse cx="98" cy="126" rx="92" ry="112" fill="url(#mk-shelf)"/>
    <ellipse cx="98" cy="229" rx="54" ry="9" fill="url(#mk-plinth)"/>

    <g class="mk-float"><g transform="translate(57 22) scale(0.315)">
      <path class="mk-glass" d="${SILHOUETTE}"/>
      <path fill="url(#mk-drink)" d="M112 176C112 206 52 232 52 300L52 618Q52 646 80 646L180 646Q208 646 208 618L208 300C208 232 148 206 148 176Z"/>
      <rect class="mk-cap" x="104" y="12" width="52" height="52" rx="7"/>
      <rect class="mk-collar" x="100" y="60" width="60" height="20" rx="5"/>
      <path class="mk-outline" d="${SILHOUETTE}"/>
      <rect class="mk-label" x="54" y="366" width="152" height="192" rx="9"/>
      <text class="mk-label-mark" x="130" y="452" text-anchor="middle">V</text>
      <path class="mk-label-rule" d="M84 480h92M84 506h60"/>
    </g></g>

    <text class="mk-kicker" x="196" y="72">BEBIDAS DE AUTOR</text>
    <text class="mk-wordmark" x="196" y="104">VERBENA</text>
    <rect class="mk-accent" x="196" y="116" width="32" height="2.5" rx="1.25"/>

    ${[
      [148, 82, 20],
      [172, 100, 22],
      [196, 68, 18],
    ].map(([y, name, price]) => `
      <rect class="mk-text-strong" x="196" y="${y}" width="${name}" height="5" rx="2.5"/>
      <path class="mk-line-soft" d="M${200 + name} ${y + 2.5}h${162 - name - price}"/>
      <rect class="mk-text" x="${366 - price}" y="${y}" width="${price}" height="5" rx="2.5"/>
    `).join("")}
  `,

  /* 06 — Dashboard: three indicators, a trend and a breakdown. */
  dashboard: `
    <g class="mk-float">
      ${window_(
        34, 26, 332, 198,
        `
        <linearGradient id="mk-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#3898d4" stop-opacity="0.38"/>
          <stop offset="100%" stop-color="#3898d4" stop-opacity="0"/>
        </linearGradient>

        ${[50, 152, 254].map((x, i) => `
          <rect class="mk-surface" x="${x}" y="${64}" width="96" height="42" rx="5"/>
          ${textLines(x + 12, 74, [30], { height: 4 })}
          <rect class="${i === 0 ? "mk-accent" : "mk-text-strong"}" x="${x + 12}" y="${86}" width="${i === 0 ? 44 : 36}" height="9" rx="4.5"/>
        `).join("")}

        <rect class="mk-surface" x="50" y="120" width="196" height="86" rx="5"/>
        <path fill="url(#mk-area)" d="M64 190l26-18 24 8 26-24 24 10 26-28 24 14v34H64z"/>
        <path class="mk-line-accent" d="M64 190l26-18 24 8 26-24 24 10 26-28 24 14"/>
        <circle class="mk-accent" cx="214" cy="152" r="3.5"/>
        <path class="mk-line-soft" d="M64 138h168M64 164h168"/>

        <rect class="mk-surface" x="258" y="120" width="92" height="86" rx="5"/>
        ${[
          [270, 46], [288, 30], [306, 62], [324, 38],
        ].map(([x, h]) => `<rect class="${h === 62 ? "mk-accent" : "mk-surface-strong"}" x="${x}" y="${194 - h}" width="10" height="${h}" rx="3"/>`).join("")}
        ${textLines(270, 132, [40], { height: 4 })}
      `,
      )}
    </g>
  `,

  /* 07 — Automation: a trigger fanning out into branching work. */
  automation: `
    <g class="mk-float">
      <path class="mk-line-soft" d="M118 125h44M232 96h40M232 154h40"/>
      <path class="mk-line-accent" d="M162 125h20v-29h50M162 125h20v29h50"/>

      <rect class="mk-window" x="34" y="102" width="84" height="46" rx="8"/>
      <circle class="mk-accent" cx="54" cy="125" r="6"/>
      ${textLines(68, 116, [36, 24], { gap: 10, height: 4 })}

      <rect class="mk-window" x="182" y="74" width="90" height="44" rx="8"/>
      <rect class="mk-gradient" x="182" y="74" width="90" height="2.5" rx="1.25"/>
      ${textLines(196, 88, [42, 28], { gap: 10, height: 4 })}

      <rect class="mk-window" x="182" y="132" width="90" height="44" rx="8"/>
      <rect class="mk-accent-soft" x="182" y="132" width="90" height="2.5" rx="1.25"/>
      ${textLines(196, 146, [38, 34], { gap: 10, height: 4 })}

      <rect class="mk-window" x="286" y="74" width="80" height="44" rx="8"/>
      ${textLines(300, 88, [34, 22], { gap: 10, height: 4 })}
      <rect class="mk-window" x="286" y="132" width="80" height="44" rx="8"/>
      ${textLines(300, 146, [30, 26], { gap: 10, height: 4 })}

      <circle class="mk-accent" cx="182" cy="96" r="3"/>
      <circle class="mk-accent" cx="182" cy="154" r="3"/>
      <circle class="mk-text-strong" cx="286" cy="96" r="3"/>
      <circle class="mk-text-strong" cx="286" cy="154" r="3"/>
    </g>
  `,

  /* 08 — Bespoke build: the isotype's own geometry, taken apart. */
  custom: `
    <g class="mk-float">
      <path class="mk-line-soft" d="M200 62v26M138 152l-18 10M262 152l18 10"/>

      <path class="mk-gradient" d="M200 18l72 42-72 42-72-42z" opacity="0.9"/>
      <path class="mk-line" d="M200 18l72 42-72 42-72-42z"/>

      <path class="mk-navy" d="M124 106l70 40v82l-70-40z"/>
      <path class="mk-line" d="M124 106l70 40v82l-70-40z"/>

      <path class="mk-accent-soft" d="M276 106l-70 40v82l70-40z"/>
      <path class="mk-line" d="M276 106l-70 40v82l70-40z"/>

      <circle class="mk-accent" cx="200" cy="102" r="5"/>
      <circle class="mk-text-strong" cx="124" cy="106" r="3.5"/>
      <circle class="mk-text-strong" cx="276" cy="106" r="3.5"/>

      ${textLines(96, 232, [56], { height: 4 })}
      ${textLines(180, 232, [40], { height: 4, className: "mk-text-strong" })}
      ${textLines(252, 232, [52], { height: 4 })}
    </g>
  `,
};
