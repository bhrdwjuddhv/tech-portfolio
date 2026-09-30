import { Link, useParams } from "react-router";
import { projects } from "@/data/projects";
import { links } from "@/data/site";
import NotFound from "@/pages/NotFound";
import { ChevronLeft } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import ProjectVideoPlayer from "@/components/Project/ProjectVideoPlayer";
import Footer from "@/components/Footer/Footer";

const ProjectDetail = () => {
  const { slug } = useParams();
  const project = projects.find((p) => p.slug === slug);
  if (!project) return <NotFound />;
  return (
    <div className="flex flex-col flex-1 items-center justify-center font-sans  mt-2">
      <div className="w-full relative -b -t font-mono tracking-tight  -neutral-200">
        <div className="mx-auto gap-1  flex flex-col max-w-2xl -x  -neutral-200    relative">
          <div className="p-2 items-center flex gap-2 mt-2">
            <Link to={"/"}>
              <div className="text-neutral-700 w-fit hover::bg-neutral-900 hover::-neutral-800 rounded-md  -transparent hover:-neutral-200 hover:bg-neutral-50">
                <HugeiconsIcon icon={ChevronLeft} />
              </div>
            </Link>
            <p className="text-lg font-sans font-semibold">{project?.name}</p>
          </div>
          {/* Video Block */}
          <div className="h-70  m-2 rounded-lg p-2 border border-neutral-200 :-neutral-800">
            <ProjectVideoPlayer src={project?.video} />
          </div>
          {/* Links Block */}
          <div className="w-full p-2 grid  m-2 grid-cols-2 divide-x divide-neutral-200 :divide-neutral-900  rounded-lg overflow-hidden text-sm">
            <Link
              to={`${project?.github}`}
              target="_blank"
              className="flex items-center justify-center gap-1.5 py-2.5 text-neutral-600 :text-neutral-400 hover:bg-neutral-50 :hover:bg-neutral-900 transition-colors cursor-pointer"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              Github
            </Link>

            <Link
              to={project.isActive ? project.link : "#"}
              target="_blank"
              className={`flex items-center  justify-center gap-1.5 py-2.5   ${project?.isActive ? "hover:bg-neutral-50 text-neutral-600 :text-neutral-400  :hover:bg-neutral-900 cursor-pointer" : "hover:bg-none text-neutral-300 :text-neutral-900 cursor-not-allowed  :hover:bg-none"}  transition-colors`}
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
              </svg>
              Live Link
            </Link>
          </div>
          <div className="flex items-start mx-5 justify-center flex-col">
            <div className="flex items-center w-full justify-between">
              <h3 className="text-xl font-sans font-semibold">
                {project?.name}
              </h3>
              <span
                className={`text-[11px] flex items-center gap-1 justify-center  rounded-full ${project?.isActive ? " text-emerald-700  :text-emerald-400" : "text-orange-500"}`}
              >
                <div className="w-3 h-3 relative">
                  <div
                    className={`w-3 h-3 animate-ping rounded-full  ${project?.isActive ? "bg-green-300" : "bg-orange-200"}`}
                  ></div>{" "}
                  <div
                    className={`absolute w-2 h-2 -translate-y-1/2 left-1/2 top-1/2 ${project?.isActive ? "bg-green-500 " : "bg-orange-400"} rounded-full   -translate-x-1/2`}
                  />
                </div>
                {project?.isActive ? "Live" : "Building.."}
              </span>
            </div>
            <div>
              <p className="text-wrap text-neutral-800 :text-neutral-200  py-3 ">
                {project?.description}
              </p>
            </div>
          </div>
          <div className="px-5 py-3  ">
            <p className="text-lg font-sans font-semibold text-neutral-800 :text-neutral-300 mb-2.5 tracking-wide ">
              Stack used
            </p>
            <div className="flex flex-wrap gap-2 pb-2">
              {project?.stack.map((item, i) => (
                <Badge key={i} name={item.label} icon={item.icon} />
              ))}
            </div>
          </div>
          <div className="p-4 mb-8 -mt-1 font-sans -neutral-200 :-neutral-900 items-center justify-center flex ">
            <p className="text-sm text-neutral-600">
              For more cool projects, visit my{" "}
              <Link
                to={links.github}
                target={"_blank"}
                className="text-neutral-900 :text-neutral-300 font-semibold"
              >
                Github.
              </Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProjectDetail;

const Badge = ({ name, icon }) => (
  <div className="inline-flex  items-center gap-1.5 px-3 py-1 rounded-md border border-dashed border-neutral-300 hover:border-neutral-700  bg-white   text-sm font-medium   transition-colors cursor-default select-none whitespace-nowrap">
    <span className="text-xs leading-none">{icon}</span>
    {name}
  </div>
);
