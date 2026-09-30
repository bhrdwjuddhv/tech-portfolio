// Registry for the /component showcase. `code` is the component's own source,
// pulled in as a string by Vite's ?raw import.
import AnimatedTab from "@/components/showcase/AnimatedTabs";
import AnimatedTabCode from "@/components/showcase/AnimatedTabs.jsx?raw";
import AnimatedNumber from "@/components/showcase/SlidingNumber";
import SlidingNumberCode from "@/components/showcase/SlidingNumber.jsx?raw";
import GooeyTooltip from "@/components/showcase/GooeyTooltip";
import GooeyTooltipCode from "@/components/showcase/GooeyTooltip.jsx?raw";
import GooeySearch from "@/components/showcase/GooeySearch";
import GooeySearchCode from "@/components/showcase/GooeySearch.jsx?raw";
import DragableStickers from "@/components/showcase/PaperScrumbled";
import DragableCode from "@/components/showcase/PaperScrumbled.jsx?raw";
import BentoCard from "@/components/showcase/BentoCard";
import MagneticCardCode from "@/components/showcase/MagneticCard.jsx?raw";
import MacosNavbar from "@/components/showcase/SectionNav";
import MacosCode from "@/components/showcase/SectionNav.jsx?raw";
import LinkPreview from "@/components/showcase/LinkPreview";
import LinkPreviewCode from "@/components/showcase/LinkPreview.jsx?raw";

// `deps` is the package list passed to `<pm> add`.
export const components = [
  {
    label: "Animated Tabs",
    fileName: "animated-tabs",
    code: AnimatedTabCode,
    component: AnimatedTab,
    deps: "motion",
  },
  {
    label: "Gooey Tooltip",
    fileName: "gooey-tooltip",
    code: GooeyTooltipCode,
    component: GooeyTooltip,
    deps: "lucide-react motion",
  },
  {
    label: "Gooey Search",
    fileName: "gooey-search",
    code: GooeySearchCode,
    component: GooeySearch,
    deps: "lucide-react motion",
  },
  {
    label: "Paper Sticker",
    fileName: "paper-sticker",
    code: DragableCode,
    component: DragableStickers,
    deps: "three motion",
  },
  {
    label: "Sliding Number",
    fileName: "sliding-number",
    code: SlidingNumberCode,
    component: AnimatedNumber,
    deps: "lucide-react motion",
  },
  {
    label: "Magnetic Card",
    fileName: "magnetic-card",
    code: MagneticCardCode,
    component: BentoCard,
    deps: "motion",
  },
  {
    label: "Smooth Scrool Nav",
    fileName: "smooth-scrool-nav",
    code: MacosCode,
    component: MacosNavbar,
    deps: "motion",
  },
  {
    label: "Link Preview",
    fileName: "link-preview",
    code: LinkPreviewCode,
    component: LinkPreview,
    deps: "motion",
  },
];
