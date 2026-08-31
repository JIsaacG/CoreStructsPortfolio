/**
 * Which panel it is your turn to use.
 *
 * The console shows three numbered zones at once — complete the request,
 * resolve it, read what it produced — and only one of them is ever the thing to
 * do next. This lights that one and lets the other two recede, so a visitor who
 * has never seen the page never has to work out where to look.
 *
 * It owns no workflow logic and the engine does not report to it. It watches
 * one attribute instead: the decision panel hides itself when there is nothing
 * left to authorise and shows itself when there is, which is precisely the
 * signal a person reads off the screen. Watching it rather than being told
 * means every path arrives correctly — a submitted request, an authorisation,
 * a rejection, the guided tour, and a session restored from storage — without
 * any of them having to remember to say so.
 */

const ORDER = ["form", "decide", "result"];

export function initStages(root = document) {
  const zones = new Map(
    [...root.querySelectorAll("[data-gw-zone]")].map((node) => [node.dataset.gwZone, node]),
  );
  if (!zones.size) return { set: () => {}, sync: () => {}, stop: () => {} };

  const approval = root.querySelector("[data-wf-approval]");

  const set = (name) => {
    if (!ORDER.includes(name)) return;
    for (const [key, zone] of zones) zone.classList.toggle("is-active", key === name);
    document.body.dataset.wfStage = name;
  };

  set("form");

  /* Before anything is submitted the decision panel is hidden and the stage is
     `form`, so the observer is only allowed to start choosing between the other
     two once the panel has been shown at least once. Without that, the first
     `hidden = true` of a rejected request and the page's own opening state look
     identical. */
  let started = false;

  const observer = approval
    ? new MutationObserver(() => {
        if (!approval.hidden) started = true;
        if (!started) return;
        set(approval.hidden ? "result" : "decide");
      })
    : null;

  observer?.observe(approval, { attributes: true, attributeFilter: ["hidden"] });

  return {
    set,
    /* The one case the observer cannot see: a session restored from storage
       into a finished request never changes `hidden`, because the panel was
       already hidden in the markup. The page has to say so out loud. */
    sync() {
      started = true;
      set(approval && !approval.hidden ? "decide" : "result");
    },
    stop: () => observer?.disconnect(),
  };
}
