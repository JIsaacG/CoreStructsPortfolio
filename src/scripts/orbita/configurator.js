/**
 * Orbita — the B2B configurator.
 *
 * Answers three questions — what you are equipping, for how many people, and
 * which lines you need — and turns them into a bill of materials with an
 * estimate. It is the piece that shows a catalogue site can carry a small
 * business rule and not just a product grid.
 *
 * The arithmetic lives on the checkboxes themselves (`data-per`, `data-each`,
 * `data-fixed`, `data-price`), written from the data file at build time, so
 * changing what a line costs or how many of it a person needs is a content
 * edit, never a code edit.
 */

const money = new Intl.NumberFormat("es-HN", {
  style: "currency",
  currency: "HNL",
  maximumFractionDigits: 0,
});

/** How many units of one line a headcount needs. */
function quantity(need, people) {
  if (need.dataset.fixed) return Number(need.dataset.fixed);
  if (need.dataset.each) return Math.max(1, Math.ceil(people / Number(need.dataset.each)));
  return people * Number(need.dataset.per || 1);
}

export function initConfigurator(root = document) {
  const form = root.querySelector("[data-configurator]");
  if (!form) return;

  const people = form.querySelector("[data-cfg-people]");
  const needs = [...form.querySelectorAll("[data-cfg-need]")];
  const result = root.querySelector("[data-cfg-result]");
  const lines = root.querySelector("[data-cfg-lines]");
  const total = root.querySelector("[data-cfg-total]");
  const forLabel = root.querySelector("[data-cfg-for]");

  const clampPeople = () => {
    const min = Number(people.min) || 1;
    const max = Number(people.max) || 999;
    const value = Number(people.value) || min;
    people.value = String(Math.min(max, Math.max(min, Math.round(value))));
    return Number(people.value);
  };

  for (const button of form.querySelectorAll("[data-cfg-step]")) {
    button.addEventListener("click", () => {
      people.value = String(Number(people.value || 0) + Number(button.dataset.cfgStep));
      clampPeople();
    });
  }

  people.addEventListener("change", clampPeople);

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const headcount = clampPeople();
    const space = form.querySelector("[data-cfg-space]:checked")?.value ?? "";
    const chosen = needs.filter((need) => need.checked);

    lines.replaceChildren();
    let sum = 0;

    for (const need of chosen) {
      const units = quantity(need, headcount);
      sum += units * Number(need.dataset.price || 0);

      const item = document.createElement("li");
      const label = document.createElement("span");
      label.textContent = `${units} ${need.dataset.unit}`;
      const name = document.createElement("b");
      name.textContent = need.dataset.name;
      item.append(label, name);
      lines.append(item);
    }

    if (!chosen.length) {
      const item = document.createElement("li");
      item.textContent = "Elige al menos una línea para preparar la configuración.";
      lines.append(item);
    }

    forLabel.textContent = `${space} · ${headcount} ${headcount === 1 ? "persona" : "personas"}`;
    total.textContent = sum ? money.format(sum) : "—";

    result.hidden = false;
    result.setAttribute("tabindex", "-1");
    result.focus({ preventScroll: true });
    result.scrollIntoView({ block: "nearest", behavior: "smooth" });
  });
}
