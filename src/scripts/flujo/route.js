/**
 * The rule, live.
 *
 * The amount field decides how many people have to authorise a purchase and
 * which people they are. That used to be explained by a section of three cards
 * lower down the page; here it is the panel next to the field, re-rendered on
 * every keystroke.
 *
 * It computes nothing of its own. `ruleFor` and `approvalsFor` from the
 * module's data decide the circuit, exactly as they do for the build's first
 * paint and for the engine that runs the request afterwards — so the route a
 * visitor watches assemble under their typing is provably the route the request
 * will take when they submit it.
 */

import { approvalsFor, duration, roleName, ruleFor, userFor } from "../../data/flujo/workflows.js";
import { parseAmount } from "./form.js";

const stopRow = (stop) => {
  const user = userFor(stop.role);
  return (
    `<li class="gw-stop">` +
    `<span class="gw-stop__avatar" aria-hidden="true">${user.initials}</span>` +
    `<span><span class="gw-stop__name">${user.name}</span>` +
    `<span class="gw-stop__role">${roleName(stop.role)} · ${duration(stop.sla ?? 24)}</span>` +
    `</span></li>`
  );
};

/**
 * Wire the amount field, its presets and the route panel together.
 *
 * Returns `hide`, which the page calls once a request has actually been
 * submitted: at that point the panel beside the form stops being a preview of
 * what will happen and would be contradicting the decision panel that replaces
 * it.
 */
export function initRoute(root = document) {
  const input = root.querySelector("#monto");
  const panel = root.querySelector("[data-wf-preview]");
  if (!input || !panel) return { sync: () => {}, hide: () => {} };

  const count = panel.querySelector("[data-wf-route-n]");
  const word = panel.querySelector("[data-wf-route-word]");
  const sentence = panel.querySelector("[data-wf-route-rule]");
  const list = panel.querySelector("[data-wf-route-list]");
  const presets = [...root.querySelectorAll("[data-wf-preset]")];

  const sync = () => {
    const parsed = parseAmount(input.value);
    const amount = Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
    const rule = ruleFor(amount);

    count.textContent = String(rule.approvals);
    word.textContent = rule.approvals === 1 ? "aprobación requerida" : "aprobaciones requeridas";
    sentence.textContent = rule.text;

    /* Only redrawn when the band actually changed. Rewriting three list items
       on every keystroke would restart their entrance animation while someone
       is still typing the number that caused it. */
    if (list.dataset.band !== rule.band.id) {
      list.dataset.band = rule.band.id;
      list.innerHTML = approvalsFor("compra", { amount }).map(stopRow).join("");
    }

    for (const preset of presets) {
      preset.setAttribute("aria-pressed", String(Number(preset.dataset.wfPreset) === amount));
    }
  };

  input.addEventListener("input", sync);

  for (const preset of presets) {
    preset.addEventListener("click", () => {
      input.value = preset.dataset.wfPreset;
      /* Dispatched rather than called: the form's own validation listens for
         the same event, so a preset clears a pending error the way typing does. */
      input.dispatchEvent(new Event("input", { bubbles: true }));
    });
  }

  sync();

  return {
    sync,
    hide() {
      panel.hidden = true;
    },
  };
}
