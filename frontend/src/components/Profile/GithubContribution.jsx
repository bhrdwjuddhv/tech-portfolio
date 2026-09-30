import { site, links } from "@/data/site";
import GitHubActivity from "@/components/ui/github-activity";

// "https://github.com/bhrdwjuddhv" -> "bhrdwjuddhv"
const githubUsername = new URL(links.github).pathname.split("/")[1];

export default function GithubContribution() {
  return (
    <div className="w-full overflow-hidden ">
      <div className="flex flex-col mx-auto overflow-hidden w-full max-w-2xl relative flex-1 items-center justify-center bg-zinc-50 dark:bg-neutral-900">
        <main className="flex flex-1   w-full max-w-3xl flex-col items-center justify-center py-4 px-2 bg-white dark:bg-[#09090B] sm:items-start">
          <GitHubActivity
            showMonths={true}
            year={site.githubYear}
            username={githubUsername}
          />
        </main>
      </div>
    </div>
  );
}
