import { Link } from "react-router";

// Element overrides for react-markdown (blog body styling).
export const markdownComponents = {
  h1: ({ node: _node, children, ...props }) => (
    <h1
      className="mt-10 mb-4 text-2xl sm:text-3xl font-normal font-['Instrument_Serif',Georgia,serif] text-neutral-900 dark:text-neutral-100 tracking-tight"
      {...props}
    >
      {children}
    </h1>
  ),
  h2: ({ node: _node, children, ...props }) => (
    <h2
      className="mt-8 mb-3 text-xl sm:text-2xl font-semibold text-neutral-900 dark:text-neutral-100 tracking-tight"
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({ node: _node, children, ...props }) => (
    <h3
      className="mt-6 mb-2 text-lg sm:text-xl font-semibold text-neutral-900 dark:text-neutral-100 tracking-tight"
      {...props}
    >
      {children}
    </h3>
  ),
  p: ({ node: _node, children, ...props }) => (
    <p
      className="text-neutral-700 dark:text-neutral-300 mb-5 leading-7 text-[16px]"
      {...props}
    >
      {children}
    </p>
  ),
  ul: ({ node: _node, children, ...props }) => (
    <ul
      className="mb-5 ml-6 list-disc space-y-2 text-neutral-700 dark:text-neutral-300 leading-7"
      {...props}
    >
      {children}
    </ul>
  ),
  ol: ({ node: _node, children, ...props }) => (
    <ol
      className="mb-5 ml-6 list-decimal space-y-2 text-neutral-700 dark:text-neutral-300 leading-7"
      {...props}
    >
      {children}
    </ol>
  ),
  li: ({ node: _node, children, ...props }) => (
    <li className="text-neutral-700 dark:text-neutral-300 leading-7" {...props}>
      {children}
    </li>
  ),
  strong: ({ node: _node, children, ...props }) => (
    <strong
      className="font-semibold text-neutral-900 dark:text-neutral-100"
      {...props}
    >
      {children}
    </strong>
  ),
  a: ({ node: _node, children, href = "", ...props }) => (
    <Link
      to={href}
      className="text-neutral-900 dark:text-neutral-100 underline underline-offset-4 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
      {...props}
    >
      {children}
    </Link>
  ),
  blockquote: ({ node: _node, children, ...props }) => (
    <blockquote
      className=" -l-2  -neutral-300  -700 pl-4 py-1 italic text-neutral-600 dark:text-neutral-400 my-5"
      {...props}
    >
      {children}
    </blockquote>
  ),
  code: ({ node: _node, children, ...props }) => (
    <code
      className="font-mono text-[13px] bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 px-1.5 py-0.5 rounded      -800"
      {...props}
    >
      {children}
    </code>
  ),
  // Fenced code blocks: the inner <code> drops its inline-pill styling.
  pre: ({ node: _node, children, ...props }) => (
    <pre
      className="my-6 overflow-x-auto rounded-xl bg-neutral-100 dark:bg-neutral-900 p-4 text-[13px] leading-6 text-neutral-800 dark:text-neutral-200 [&>code]:bg-transparent [&>code]:p-0 [&>code]:rounded-none"
      {...props}
    >
      {children}
    </pre>
  ),
  hr: ({ node: _node, ...props }) => (
    <hr className=" -0  -t    -800 my-8" {...props} />
  ),
  img: ({ node: _node, src = "", alt = "", ...props }) => (
    <span className="block my-6 overflow-hidden rounded-xl      -800">
      <img
        src={src}
        alt={alt}
        className="w-full h-auto object-cover"
        {...props}
      />
    </span>
  ),
};
