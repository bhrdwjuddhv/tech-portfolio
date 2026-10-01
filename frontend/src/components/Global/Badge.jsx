// Dashed tech chip used for the home page skills and a project's stack.
const Badge = ({ name, icon }) => (
  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md border border-dashed border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 text-sm font-medium hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors cursor-default select-none whitespace-nowrap">
    <span className="text-xs leading-none">{icon}</span>
    {name}
  </div>
);

export default Badge;
