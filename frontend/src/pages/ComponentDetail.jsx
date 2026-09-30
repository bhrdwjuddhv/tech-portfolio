import CopyButton from "@/components/CopyBtn";
import Footer from "@/components/Footer/Footer";
import PackageManagerCommand from "@/components/PackageManagerCommand";
import { components } from "@/data/components";
import NotFound from "@/pages/NotFound";
import { Cancel, ReactFreeIcons } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link, useParams } from "react-router";

const ComponentDetail = () => {
  const { component } = useParams();
  const activePageComponent = components.find((c) => c.fileName === component);
  if (!activePageComponent) return <NotFound />;
  const Component = activePageComponent.component;
  return (
    <div className="max-w-2xl px-3 flex flex-col w-full mx-auto">
      <div className="flex items-center justify-between mt-30">
        <p className="font-semibold">{activePageComponent?.label}</p>
        <Link to="/component">
          {" "}
          <HugeiconsIcon
            className="active:scale-75 transition-all"
            icon={Cancel}
          />
        </Link>
      </div>
      {/* Component Preview */}
      <div className="w-full overflow-hidden relative mt-4 bg-neutral-50 p-1 rounded-lg border grid  border-neutral-200 min-h-45">
        <div className="rounded-md  w-full h-full border flex items-center justify-center border-neutral-100 bg-white">
          {" "}
          <Component />
        </div>
      </div>
      <div className="flex flex-col mt-8 gap-2">
        <p className="font-medium font-neutral-800">
          Install the following dependencies
        </p>
        <PackageManagerCommand deps={activePageComponent.deps} />
      </div>
      {/* Code */}
      <div className="flex flex-col mt-8 gap-2">
        <p className="font-medium font-neutral-800">Code</p>
        <div className="bg-neutral-100 mb-8 p-1.5 w-full rounded-xl">
          <div className="flex  justify-between  mt-1">
            <p className="gap-1 text-neutral-400 flex items-center">
              {" "}
              <HugeiconsIcon
                className="ml-1.5"
                icon={ReactFreeIcons}
                size={18}
              />{" "}
              <span>components/{activePageComponent.fileName}.jsx</span>
            </p>
            {/* Top Header */}
            <CopyButton code={activePageComponent.code} />
          </div>
          {/* Actual Code */}
          <div className="bg-white rounded-lg p-2 mt-2 w-full">
            <pre className=" overflow-x-auto text-neutral-600 text-sm leading-6">
              <code>{activePageComponent.code}</code>
            </pre>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
export default ComponentDetail;
