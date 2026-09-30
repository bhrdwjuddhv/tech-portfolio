import NAVBAR from "@/components/NAVBAR";
import Profile from "@/components/Profile/Profile";
import About from "@/components/HeroPage/About";
import GithubContribution from "@/components/Profile/GithubContribution";
import Stack from "@/components/Global/Stack";
import Experience from "@/components/Experience";
import Projects from "@/components/Project/Projects";
import Blogs from "@/components/BlogPage/Blogs";
import QuoteSection from "@/components/Quote/QuoteSection";
import Footer from "@/components/Footer/Footer";

export default function Home() {
  return (
    <div className="flex flex-col px-3 overflow-hidden flex-1 relative items-center justify-center font-sans ">
      <NAVBAR />
      <Profile />
      <About />
      <GithubContribution />
      <Stack />
      <Experience />
      <Projects />
      <Blogs />
      <QuoteSection />
      <Footer />
    </div>
  );
}
