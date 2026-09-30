// ponytail: joins truthy class names; no tailwind-merge conflict resolution (none of the callers need it).
export const cn = (...classes) => classes.filter(Boolean).join(" ");

export function formatBlogDate(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
