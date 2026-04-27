"use client";

import type { BlogPost } from "@/lib/blogTypes";
import BlogStoryShell from "./BlogStoryShell";

export type BlogRouterProps = {
  posts: BlogPost[];
  basePath: string;
};

export default function BlogRouter(props: BlogRouterProps) {
  return <BlogStoryShell {...props} />;
}
