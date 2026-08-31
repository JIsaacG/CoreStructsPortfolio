/**
 * The four numbers the run left behind.
 *
 * The console argues by demonstration, and this is the arithmetic of that
 * demonstration: how many authorisations carry a written record, how many
 * documents were produced, how many entries the log holds — and, the one that
 * matters most, how many emails anybody had to chase, which is zero and stays
 * zero.
 *
 * Every figure is counted off the page rather than tracked alongside it. The
 * approvals list, the log and the document are what a visitor is looking at, so
 * counting exactly those means the strip cannot claim something the screen
 * behind it does not show.
 */

export function initTally(root = document) {
  const strip = root.querySelector("[data-wf-tally]");
  if (!strip) return { update: () => {} };

  const slots = {
    approvals: strip.querySelector("[data-wf-tally-approvals]"),
    docs: strip.querySelector("[data-wf-tally-docs]"),
    audit: strip.querySelector("[data-wf-tally-audit]"),
    mail: strip.querySelector("[data-wf-tally-mail]"),
  };

  const records = root.querySelector("[data-wf-records]");
  const audit = root.querySelector("[data-wf-audit]");
  const docEmpty = root.querySelector("[data-wf-doc-empty]");

  /* The label agrees with its own number. "1 Documentos generados" is a small
     thing and it is the kind of small thing that makes a screen look generated
     rather than written, which is the opposite of what this strip is for. */
  const set = (slot, value) => {
    if (!slot) return;
    slot.textContent = String(value);

    const label = slot.previousElementSibling;
    if (!label?.dataset.one) return;
    label.textContent = value === 1 ? label.dataset.one : label.dataset.many;
  };

  const update = () => {
    const approvals = records ? records.children.length : 0;
    /* `data-when-static` rows are the complete trail a reader without
       JavaScript gets; the stylesheet hides them here, so counting them would
       report ten entries into an empty log. */
    const entries = audit
      ? audit.querySelectorAll(".wf-audit__row:not([data-when-static])").length
      : 0;
    /* `hidden` on the empty-state notice is how the engine says the document
       exists; there is never more than one. */
    const documents = docEmpty && docEmpty.hidden ? 1 : 0;

    set(slots.approvals, approvals);
    set(slots.docs, documents);
    set(slots.audit, entries);
    set(slots.mail, 0);

    /* Shown only once there is something to count. A strip of zeroes above an
       empty drawer is a claim about nothing. */
    strip.hidden = approvals === 0 && entries === 0 && documents === 0;
  };

  update();

  /* The engine rewrites the approvals list and the log wholesale and does not
     announce it, so both are watched. Counting on a mutation is cheap — these
     lists are never longer than a dozen rows. */
  const observer = new MutationObserver(update);
  for (const node of [records, audit, docEmpty]) {
    if (!node) continue;
    observer.observe(node, {
      childList: true,
      attributes: node === docEmpty,
      attributeFilter: node === docEmpty ? ["hidden"] : undefined,
    });
  }

  return { update, stop: () => observer.disconnect() };
}
