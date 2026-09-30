import Footer from "@/components/Footer/Footer";
import { site } from "@/data/site";
import Blogs from "@/components/Blogs";

const BlogsPage = () => {
  return (
    <div className="w-full max-w-2xl flex flex-col  px-3 items-center justify-between h-screen mx-auto">
      <title>{`Blog - ${site.name}`}</title>
      <div className="w-full relative  font-mono tracking-tight">
        <div className="w-full max-w-2xl mx-auto gap-3 flex flex-col relative">
          <Blogs />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BlogsPage;
