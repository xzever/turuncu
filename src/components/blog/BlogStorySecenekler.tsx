import { staticBlog } from "@/lib/staticBlog";
import BlogStoryShell from "./BlogStoryShell";

export default async function BlogStorySecenekler() {
  const posts = await staticBlog.list("tr", false);

  return (
    <div className="bs-secenekler">
      <BlogStoryShell posts={posts} basePath="/blog" />
    </div>
  );
}
