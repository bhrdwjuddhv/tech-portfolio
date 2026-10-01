import { FaReact } from "react-icons/fa";
import { BiLogoJavascript } from "react-icons/bi";
import {
  SiNodedotjs,
  SiMongodb,
  SiPython,
  SiFastapi,
  SiLangchain,
  SiPostgresql,
  SiRedis,
  SiQdrant,
  SiZod,
  SiGooglemaps,
} from "react-icons/si";
import { RiOpenaiFill } from "react-icons/ri";
import { links } from "./site";

// Travel AI is real; the rest are MOCK placeholders until the real projects are ready.
// For each project, replace:
//   github / link   -> real repo + live URL (link is only clickable when isActive is true)
//   projectImage    -> a real screenshot in /public/Project/ProjectImages
//   video           -> demo video shown at the top of the project page. Put the file in
//                      /public/Project/ProjectVideos/ and set e.g. "/Project/ProjectVideos/<slug>.mp4"
//                      (MP4/H.264 plays everywhere; it autoplays muted on loop). Empty or missing
//                      file -> the page shows "Demo video coming soon" with the screenshot.
// backgroundImage is the decorative card background shown on hover.
// highlights (optional) are listed as bullets on the project's own page.
export const projects = [
  {
    id: 1,
    name: "Travel AI",
    slug: "travel-ai",
    type: "AI Agent",
    description:
      "An agentic AI trip planner that builds multi-city India itineraries (transport, stays, day-by-day activities and budgets) from live data.",
    highlights: [
      "Built an agentic AI trip-planning system using the OpenAI Agents SDK. It creates multi-city India itineraries covering transport, stays, day-by-day activities and budgets from live data (Google Maps and Places APIs, RailRadar train data).",
      "Redesigned the LLM pipeline from a ~20-turn serial tool-calling loop into a parallel pipeline: API lookups run at the same time, then a single structured-output LLM call picks the options. This cut the model's selection step from ~20s to ~2s by routing it to a smaller model (GPT-4o-mini).",
      "Stopped the model from inventing prices or distances (hallucinations) by limiting it to choosing IDs from pre-researched shortlists, checked against Zod schemas. All costs, distances and budgets are calculated by ordinary code, and the model is re-prompted automatically when its output fails validation.",
      'Built a RAG knowledge layer on the Qdrant vector database with OpenAI embeddings. It stores "hidden gems" found by web search, tagged by city, with a 14-day freshness window. Fresh entries are reused, which avoids repeating slow web searches, and planning falls back gracefully if Qdrant is down.',
      "Built a conversational itinerary-editing agent that tells questions apart from edit requests and makes changes through 5 tool-based edit operations (swap a leg, stay or activity, and so on), keeping the rest of the plan unchanged. Each edit saves a new version of the trip in MongoDB.",
      "Added an LLM input guardrail that runs alongside the editing agent. It blocks prompt-injection and off-topic requests before any change is applied, and lets requests through if the screening check itself fails, so users can still edit their own plans.",
      "Streamed live generation progress to the React frontend with Server-Sent Events (SSE): a route skeleton appears first and results fill in as they arrive. Each external call has its own timeout and falls back to an estimate, so one slow API can't stall the whole generation.",
      "Built 3 planning modes (fully automatic, semi-automatic, and step-by-step with user decisions), budget tiers with hard spending caps, and train-schedule-aware day pacing (a late-night arrival is automatically planned as a travel-only day).",
    ],
    isActive: true,
    backgroundImage: "/Project/ProjectSection-BGS/image.png",
    projectImage: "/Project/ProjectImages/travel-ai.webp",
    video: "/Project/ProjectVideos/travel-ai.mp4", // add this file to show the demo
    stack: [
      { icon: <RiOpenaiFill size={18} />, label: "OpenAI Agents SDK" },
      { icon: <FaReact size={18} color="#61DAFB" />, label: "React" },
      { icon: <SiMongodb size={18} color="#47A248" />, label: "MongoDB" },
      { icon: <SiQdrant size={18} color="#DC244C" />, label: "Qdrant" },
      { icon: <SiZod size={18} color="#3E67B1" />, label: "Zod" },
      {
        icon: <SiGooglemaps size={18} color="#4285F4" />,
        label: "Google Maps API",
      },
    ],
    github: "https://github.com/bhrdwjuddhv/Travel-companion",
    link: "https://travelcompanion-seven.vercel.app/",
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
    video: "",
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
    video: "",
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
    video: "",
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
