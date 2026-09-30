import WorkExperience from "@/components/work-experience";
import { experience } from "@/data/experience";

const Experience = () => {
  return (
    <div className="w-full mt-6 max-w-2xl flex flex-col gap-1   mx-auto">
      <p className="text-md text-neutral-500  uppercase">Experience</p>
      <WorkExperience experience={experience} />
    </div>
  );
};

export default Experience;
