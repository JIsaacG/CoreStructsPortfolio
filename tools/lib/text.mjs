/**
 * Small text helpers shared by the site generators.
 */

/**
 * A meta description, cut to length at a word boundary.
 *
 * A hard `slice` lands mid-word about as often as not, and a search result that
 * ends "…seguimiento de la inserción labor" reads as a broken page rather than
 * a truncated one. Backing up to the last space and closing with an ellipsis
 * costs a few characters and looks deliberate.
 *
 * The backstop is the `limit * 0.6` test: a string with no space in its last
 * 40 % is a single very long token, and cutting it at the last space would
 * throw away most of the description to avoid a broken word. In that case the
 * hard cut is the lesser problem.
 */
export function clamp(text, limit) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= limit) return clean;

  const cut = clean.slice(0, limit - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > limit * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[.,;:]$/, "")}…`;
}
