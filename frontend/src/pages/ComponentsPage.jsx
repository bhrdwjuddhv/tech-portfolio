import Footer from "@/components/Footer/Footer";
import Components from "@/components/component-page/Components";
const ComponentsPage = () => {
  return (
    <div className="w-full  px-3 max-w-2xl flex flex-col items-center justify-between h-screen mx-auto">
      <div className="w-full relative  font-mono tracking-tight    ">
        <div className="w-full max-w-2xl mx-auto gap-3 flex flex-col relative">
          <Components />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ComponentsPage;
