import { useParams } from "react-router";
import Markdown from "react-markdown";
import BlogLayout from "@/components/BlogPage/BlogLayout";
import { markdownComponents } from "@/components/BlogPage/markdown-components";
import NotFound from "@/pages/NotFound";
import { blogs } from "@/data/blogs";
import { site } from "@/data/site";

export default function BlogPostPage() {
  const { blog } = useParams();
  const post = blogs.find((b) => b.slug === blog);
  if (!post) return <NotFound />;
  return (
    <BlogLayout
      title={post.title}
      description={post.description}
      date={post.date}
      coverImage={post.coverImage}
    >
      <title>{`${post.title} | ${site.name}`}</title>
      <meta name="description" content={post.description ?? ""} />
      <meta property="og:title" content={post.title} />
      <meta property="og:description" content={post.description ?? ""} />
      <Markdown components={markdownComponents}>{post.content}</Markdown>
    </BlogLayout>
  );
}
