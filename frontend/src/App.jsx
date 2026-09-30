import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router";
import { useLenis } from "lenis/react";
import LenisProvider from "@/components/lenis-provider";
import GradualBlur from "@/components/Global/BelowBlur";
import Home from "@/pages/Home";
import Blogs from "@/pages/Blogs";
import BlogPost from "@/pages/BlogPost";
import GetInTouch from "@/pages/GetInTouch";
import ProjectDetail from "@/pages/ProjectDetail";
import NotFound from "@/pages/NotFound";
import CursorPet from "@/components/Pet/CursorPet";

// Showcase pages pull in three.js; keep them out of the main bundle.
const ComponentsPage = lazy(() => import("@/pages/ComponentsPage"));
const ComponentDetail = lazy(() => import("@/pages/ComponentDetail"));

// Next.js resets scroll on navigation; a SPA doesn't, so do it here.
function ScrollToTop() {
  const { pathname } = useLocation();
  const lenis = useLenis();
  useEffect(() => {
    lenis ? lenis.scrollTo(0, { immediate: true }) : window.scrollTo(0, 0);
  }, [pathname, lenis]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <LenisProvider>
        <ScrollToTop />
        <Suspense>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/blogs/:blog" element={<BlogPost />} />
            <Route path="/component" element={<ComponentsPage />} />
            <Route path="/component/:component" element={<ComponentDetail />} />
            <Route path="/get-in-touch" element={<GetInTouch />} />
            <Route path="/projects/:slug" element={<ProjectDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        <GradualBlur
          target="page"
          position="bottom"
          height="3rem"
          strength={2.5}
          divCount={2}
          curve="bezier"
          exponential
          opacity={0.5}
          className="z-99"
        />
        <CursorPet />
      </LenisProvider>
    </BrowserRouter>
  );
}
