import { Link } from "react-router";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  Calendar01FreeIcons,
} from "@hugeicons/core-free-icons";
import ShareButton from "@/components/BlogPage/ShareBtn";
import { formatBlogDate } from "@/lib/utils";
import Footer from "@/components/Footer/Footer";

export default function BlogLayout({
  title,
  description,
  date,
  coverImage,
  children,
}) {
  const formattedDate = formatBlogDate(date);
  const shareUrl = window.location.href;

  return (
    <div className="flex flex-col min-h-screen font-sans dark:bg-[#09090B] bg-white text-neutral-900 dark:text-neutral-100">
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 sm:px-6 pt-10 pb-28">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/blogs"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={18} />
            <span>Back to Blogs</span>
          </Link>
        </div>

        {/* Blog Header Component matching design */}
        <header className="mb-8">
          <h1 className="font-['Instrument_Serif',Georgia,serif] text-3xl sm:text-4xl md:text-[42px] font-normal leading-[1.15] text-neutral-900 dark:text-neutral-100 tracking-tight">
            {title}
          </h1>

          {description && (
            <p className="text-neutral-600 dark:text-neutral-400 text-base sm:text-lg mt-2.5 font-normal leading-relaxed">
              {description}
            </p>
          )}

          <div className="flex items-center justify-between mt-5 pb-5  -b    -800">
            {formattedDate && (
              <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400 text-sm">
                <HugeiconsIcon
                  icon={Calendar01FreeIcons}
                  size={16}
                  className="text-neutral-400 dark:text-neutral-500 shrink-0"
                />
                <span>{formattedDate}</span>
              </div>
            )}
            <div className="ml-auto">
              <ShareButton title={title} url={shareUrl} showIcon={false} />
            </div>
          </div>
        </header>

        {/* Optional Cover Image */}
        {coverImage && (
          <div className="my-6 overflow-hidden rounded-xl      -800">
            <img
              src={coverImage}
              alt={title}
              width={1200}
              height={630}
              className="w-full h-auto object-cover"
            />
          </div>
        )}
        {/* Content */}
        <article className="prose dark:prose-invert max-w-none text-neutral-800 dark:text-neutral-200">
          {children}
        </article>
      </main>
      <Footer />
    </div>
  );
}
