import { FaReact } from "react-icons/fa";
import { BiLogoJavascript } from "react-icons/bi";
import {
  SiNodedotjs,
  SiExpress,
  SiMongodb,
  SiTailwindcss,
  SiPython,
  SiFastapi,
  SiLangchain,
  SiPostgresql,
  SiRedis,
} from "react-icons/si";
import { links } from "./site";

// MOCK DATA — placeholder projects until the real ones are ready.
// For each project, replace:
//   github / link   -> real repo + live URL (link is only clickable when isActive is true)
//   projectImage    -> a real screenshot in /public/Project/ProjectImages
//   video           -> optional demo video path, e.g. "/Project/ProjectVideos/<slug>.mp4"
//                      (the project page shows "No video available" without one)
// backgroundImage is the decorative card background shown on hover.
export const projects = [
  {
    id: 1,
    name: "RecallAI",
    slug: "recall-ai",
    type: "AI Agent",
    description:
      "A chat assistant with long-term memory that remembers your preferences and past conversations across sessions.",
    isActive: true,
    backgroundImage: "/Project/ProjectSection-BGS/image.png",
    projectImage: "/Project/ProjectImages/recall-ai.svg",
    stack: [
      { icon: <FaReact size={18} color="#61DAFB" />, label: "React" },
      { icon: <SiNodedotjs size={18} color="#3fd600" />, label: "Node.js" },
      { icon: <SiExpress size={18} />, label: "Express.js" },
      { icon: <SiMongodb size={18} color="#47A248" />, label: "MongoDB" },
      { icon: <SiTailwindcss size={18} color="#06B6D4" />, label: "Tailwind" },
    ],
    github: links.github,
    link: "https://example.com",
  },
  {
    id: 2,
    name: "DocuMind",
    slug: "documind",
    type: "RAG App",
    description:
      "Upload PDFs and ask questions about them. Answers are grounded in the retrieved passages, with sources shown.",
    isActive: true,
    backgroundImage: "/Project/ProjectSection-BGS/Im1.png",
    projectImage: "/Project/ProjectImages/documind.svg",
    stack: [
      { icon: <FaReact size={18} color="#61DAFB" />, label: "React" },
      { icon: <SiPython size={18} color="#3776AB" />, label: "Python" },
      { icon: <SiFastapi size={18} color="#009688" />, label: "FastAPI" },
      { icon: <SiLangchain size={18} />, label: "LangChain" },
    ],
    github: links.github,
    link: "https://example.com",
  },
  {
    id: 3,
    name: "TreeIndex",
    slug: "treeindex",
    type: "Research",
    description:
      "An experiment in vectorless RAG: builds a table-of-contents tree for each document and navigates it to answer questions.",
    isActive: false,
    backgroundImage: "/Project/ProjectSection-BGS/Im3.png",
    projectImage: "/Project/ProjectImages/treeindex.svg",
    stack: [
      { icon: <SiPython size={18} color="#3776AB" />, label: "Python" },
      { icon: <SiFastapi size={18} color="#009688" />, label: "FastAPI" },
      { icon: <SiRedis size={18} color="#DC382D" />, label: "Redis" },
    ],
    github: links.github,
    link: "",
  },
  {
    id: 4,
    name: "Ledgerly",
    slug: "ledgerly",
    type: "Tracker",
    description:
      "A personal finance tracker for logging expenses, setting budgets and seeing where the money actually goes.",
    isActive: false,
    backgroundImage: "/Project/ProjectSection-BGS/Im2.png",
    projectImage: "/Project/ProjectImages/ledgerly.svg",
    stack: [
      {
        icon: <BiLogoJavascript size={18} color="#F7DF1E" />,
        label: "JavaScript",
      },
      { icon: <FaReact size={18} color="#61DAFB" />, label: "React" },
      { icon: <SiNodedotjs size={18} color="#3fd600" />, label: "Node.js" },
      { icon: <SiPostgresql size={18} color="#4169E1" />, label: "PostgreSQL" },
    ],
    github: links.github,
    link: "",
  },
];
