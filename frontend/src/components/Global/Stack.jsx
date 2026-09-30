import { skills } from "@/data/skills";

const Badge = ({ name, icon }) => (
  <div className="inline-flex  items-center gap-1.5 px-3 py-1 rounded-md bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 text-sm font-medium hover:border-neutral-400  transition-colors border-neutral-200 border-dashed cursor-default select-none border  whitespace-nowrap">
    <span className="text-xs leading-none">{icon}</span>
    {name}
  </div>
);
const Stack = () => {
  return (
    <div className=" -b w-full  -900  ">
      <div className="max-w-2xl  gap-3 flex flex-col w-full mx-auto mt-3">
        <div>
          <p className="text-md text-neutral-500 font-mono   uppercase">
            Skills
          </p>
        </div>
        <div className="flex justify-baseline flex-wrap  gap-2">
          {skills.map((item, index) => (
            <Badge key={index} name={item.name} icon={item.icon} />
          ))}
        </div>
      </div>
    </div>
  );
};
export default Stack;
