// Vite plugin: writes robots.txt, sitemap.xml and llms.txt into the build from src/data,
// so they never drift from the site content (e.g. a new blog lands in the sitemap automatically).
import { site, about, links } from "./src/data/site.js";
import { blogs } from "./src/data/blogs.js";
import { experience } from "./src/data/experience.js";

const url = (path) => `${site.url.replace(/\/$/, "")}${path}`;
const xmlEscape = (s) =>
  s.replace(/[<>&'"]/g, (c) => `&${{ "<": "lt", ">": "gt", "&": "amp", "'": "apos", '"': "quot" }[c]};`);

function sitemap() {
  const pages = [
    { loc: url("/"), freq: "weekly", priority: "1.0" },
    { loc: url("/blogs"), freq: "weekly", priority: "0.9" },
    { loc: url("/get-in-touch"), freq: "monthly", priority: "0.8" },
    ...blogs.map((b) => ({ loc: url(`/blogs/${b.slug}`), lastmod: b.date, priority: "0.8" })),
  ];
  const entries = pages.map(
    (p) =>
      `  <url><loc>${xmlEscape(p.loc)}</loc>` +
      (p.lastmod ? `<lastmod>${p.lastmod}</lastmod>` : "") +
      (p.freq ? `<changefreq>${p.freq}</changefreq>` : "") +
      `<priority>${p.priority}</priority></url>`,
  );
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join("\n")}
</urlset>
`;
}

const robots = () => `User-agent: *
Allow: /

Sitemap: ${url("/sitemap.xml")}
`;

// https://llmstxt.org — a plain summary of the site for AI assistants.
function llms() {
  const jobs = experience.flatMap((job) =>
    job.positions.map(
      (p) =>
        `- ${p.title} at ${job.companyName} (${p.employmentPeriod.start} – ${job.isCurrentEmployer ? "Present" : p.employmentPeriod.end}): ${job.companyWebsite}`,
    ),
  );
  const posts = blogs.map((b) => `- [${b.title}](${url(`/blogs/${b.slug}`)}): ${b.description}`);
  return `# ${site.name}

> ${about.intro}

## Experience

${jobs.join("\n")}

## Blog

${posts.join("\n")}

## Contact

- Website: ${site.url}
- Contact form: ${url("/get-in-touch")}
- GitHub: ${links.github}
- X: ${links.x}
- LinkedIn: ${links.linkedin}
- Medium: ${links.medium}
`;
}

export default function seoFiles() {
  return {
    name: "seo-files",
    generateBundle() {
      for (const [fileName, source] of [
        ["robots.txt", robots()],
        ["sitemap.xml", sitemap()],
        ["llms.txt", llms()],
      ])
        this.emitFile({ type: "asset", fileName, source });
    },
  };
}
