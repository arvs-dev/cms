"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

interface PostData {
  title: string;
  content: string;
  excerpt?: string;
  category?: string;
  status: "draft" | "published" | "scheduled";
  publishDate?: Date | null;
  imageUrl?: string | null;
  imagePath?: string | null;
}

export async function createPost(data: PostData) {
  try {
    const { error } = await supabase.from("posts").insert({
      title: data.title,
      content: data.content,
      excerpt: data.excerpt || null,
      category: data.category || null,
      status: data.status,
      publish_date: data.publishDate || null,
      image_url: data.imageUrl || null,
      image_path: data.imagePath || null,
      created_at: new Date().toISOString(),
    });

    if (error) throw error;

    // Revalidate the posts page to show the new post
    revalidatePath("/dashboard/posts");
    return { success: true };
  } catch (error) {
    console.error("Error creating post:", error);
    return { success: false, error: "Failed to create post" };
  }
}

export async function getPosts() {
  try {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching posts:", error);
    return { success: false, error: "Failed to fetch posts" };
  }
}
