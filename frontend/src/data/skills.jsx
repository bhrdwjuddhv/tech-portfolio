import {
  SiHtml5,
  SiCss,
  SiJavascript,
  SiC,
  SiCplusplus,
  SiReact,
  SiVite,
  SiTailwindcss,
  SiNodedotjs,
  SiExpress,
  SiMongodb,
  SiGooglegemini,
  SiAnthropic,
  SiQdrant,
  SiGit,
  SiGithub,
  SiLinux,
  SiDocker,
  SiVercel,
  SiRender,
} from "react-icons/si";
import { RiOpenaiFill } from "react-icons/ri";

// Skills shown on the home page, in resume order.
// Icons without a colour use the badge's text colour, so black logos stay visible in dark mode.
const icon = (Icon, color) => <Icon size={16} color={color} />;

export const skills = [
  // Languages
  { name: "HTML", icon: icon(SiHtml5, "#E34F26") },
  { name: "CSS", icon: icon(SiCss, "#1572B6") },
  { name: "JavaScript", icon: icon(SiJavascript, "#F7DF1E") },
  { name: "C", icon: icon(SiC, "#A8B9CC") },
  { name: "C++", icon: icon(SiCplusplus, "#00599C") },
  // Frontend
  { name: "React", icon: icon(SiReact, "#61DAFB") },
  { name: "Vite", icon: icon(SiVite, "#646CFF") },
  { name: "Tailwind CSS", icon: icon(SiTailwindcss, "#06B6D4") },
  // Backend & databases
  { name: "Node.js", icon: icon(SiNodedotjs, "#5FA04E") },
  { name: "Express.js", icon: icon(SiExpress) },
  { name: "MongoDB", icon: icon(SiMongodb, "#47A248") },
  // AI & generative AI
  { name: "OpenAI API", icon: icon(RiOpenaiFill) },
  { name: "Gemini API", icon: icon(SiGooglegemini, "#8E75B2") },
  { name: "Anthropic API", icon: icon(SiAnthropic) },
  { name: "Qdrant", icon: icon(SiQdrant, "#DC244C") },
  // Tools & platforms
  { name: "Git", icon: icon(SiGit, "#F05032") },
  { name: "GitHub", icon: icon(SiGithub) },
  { name: "Linux", icon: icon(SiLinux) },
  { name: "Docker", icon: icon(SiDocker, "#2496ED") },
  { name: "Vercel", icon: icon(SiVercel) },
  { name: "Render", icon: icon(SiRender) },
];

export const certifications = [
  { name: "GenAI with JavaScript Cohort 2026", issuer: "ChaiCode" },
];
