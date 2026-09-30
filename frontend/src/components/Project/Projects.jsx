import ProjectCard from "./ProjectCard";
import { projects } from "@/data/projects";
import { links } from "@/data/site";

const Projects = () => {
  return (
    <div className="w-full max-w-2xl mx-auto py-6">
      <div className="flex items-baseline justify-between mb-1">
        <h2 className="text-md  uppercase text-neutral-500 dark:text-neutral-100 ">
          Projects
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {projects.map((p, i) => {
          return (
            <ProjectCard
              key={i}
              name={p.name}
              description={p.description}
              isActive={p.isActive}
              type={p.type}
              bgImage={p.backgroundImage}
              projectImage={p.projectImage}
              stack={p.stack}
              link={p.link || links.github}
              slug={p.slug}
            />
          );
        })}
      </div>
    </div>
  );
};
export default Projects;
