import { Link } from "react-router";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center font-sans bg-white selection:bg-blue-100 selection:text-blue-600">
      <main className="w-full relative min-h-screen flex flex-col justify-between max-w-[85rem]  -x  ">
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 sm:py-24 text-center">
          {/* Big Stylish 404 Number */}
          <div className="relative flex flex-col gap-2 select-none">
            <p className="text-md  font-extrabold text-neutral-700 tracking-tighter leading-none">
              4<span className="text-orange-500">0</span>4
            </p>
            <h2 className="lg:text-3xl text-2xl text-neutral-900 font-semibold tracking-tighter">
              Page went out for snacks.
              <br />
              I am not mad. We just <br /> hope it brings back chips.{" "}
            </h2>

            <Link
              to="/"
              className="p-2   w-fit mx-auto   mt-4 rounded-md text-sm font-medium text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 transition-colors duration-200"
            >
              <HugeiconsIcon icon={ArrowRight01Icon} />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
