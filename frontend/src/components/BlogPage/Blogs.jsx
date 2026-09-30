import { BlogList } from "@/components/Blogs";

const Blogs = () => {
  return (
    <div className="w-full  font-mono tracking-tight ">
      <div className="mx-auto  flex items-center justify-center flex-col relative   w-full max-w-2xl">
        <div className="w-full flex items-center justify-center ">
          {" "}
          <div className="w-full flex flex-col">
            <h2 className="text-md  uppercase font-mono text-neutral-500 dark:text-neutral-100 ">
              Blogs
            </h2>
            <div className="w-full flex flex-col mt-1 items-center gap-4">
              <BlogList />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blogs;
