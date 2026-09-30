import NAVBAR from "@/components/NAVBAR";
import { Link } from "react-router";
import { components } from "@/data/components";
const Blogs = () => {
  return (
    <div className="flex flex-col  ">
      <NAVBAR />
      <div className="flex items-center  mt-10 gap-2 ">
        <h2 className="relative  text-2xl inline-block font-bold tracking-tighter font-sans text-neutral-900 dark:text-neutral-100 ">
          Components
        </h2>
      </div>
      <p className="font-sans text-sm mt-1 mb-4  text-neutral-400">
        A curated collection of modern, reusable React components.
        <br /> Copy, paste, and customize.
      </p>
      {components.map((c) => {
        return (
          <Link
            to={`/component/${c.fileName}`}
            key={c.label}
            className="flex mb-3 relative flex-col items-center gap-4"
          >
            <ComponentBlockShowCase label={c.label} Component={c.component} />
          </Link>
        );
      })}
    </div>
  );
};

export default Blogs;

const ComponentBlockShowCase = ({ label, Component }) => {
  return (
    <div className="w-full border  relative bg-neutral-50 transition hover:ring-4 hover:ring-blue-50/30 rounded-lg flex items-center justify-center  border-neutral-100 min-h-45">
      <div className="absolute bg-white text-sm px-3 shadow-inset[5px_3px_12px-7px_#FAFAFF] py-1 rounded-lg border border-neutral-100 text-neutral-700 top-2 left-2 font-sans">
        {label}
      </div>
      <Component />
    </div>
  );
};
