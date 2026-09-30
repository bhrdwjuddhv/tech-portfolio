import { Link } from "react-router";
import { useLocation } from "react-router";
import { navItems } from "@/data/site";

const NAVBAR = () => {
  const { pathname } = useLocation();

  return (
    <div className="w-full text-[14px] font-sans mx-auto flex items-center mt-3 justify-between max-w-2xl">
      <div className="w-1"></div>
      <div className="flex items-center gap-4">
        {navItems.map(({ href, label }) => {
          const isActive =
            href === "/" ? pathname === "/" : pathname.startsWith(href);

          return (
            <Link
              key={href}
              to={href}
              aria-current={isActive ? "page" : undefined}
              className="group inline-flex flex-col items-center"
            >
              <span
                className={
                  isActive
                    ? "text-neutral-800 relative transition-colors  "
                    : "text-neutral-600 relative transition-colors hover:text-neutral-800"
                }
              >
                {label}
                <span
                  className={`${isActive && "border border-neutral-400 w-full  border-dashed left-1/2 bottom-0.5 -translate-x-1/2 "}  absolute `}
                />
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default NAVBAR;
