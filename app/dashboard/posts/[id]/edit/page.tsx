"use client";

import type React from "react";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import DashboardLayout from "@/components/dashboard-layout";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, CalendarIcon, Eye, Save, Upload, X } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { supabase } from "@/lib/supabase";

// In a real app, these would be fetched from your API
const categories = [
  { id: 1, name: "News" },
  { id: 2, name: "Events" },
  { id: 3, name: "Projects" },
];

interface Post {
  id: number;
  title: string;
  content: string;
  body: string;
  excerpt: string;
  category: string;
  publication_status: string;
  status: string;
  published_date: string | null;
  date: string;
  image_url: string | null;
  image_path: string | null;
}

export default function EditPostPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [postData, setPostData] = useState({
    title: "",
    body: "",
    category: "",
    publication_status: "draft",
    published_date: null as Date | null,
    imageUrl: null as string | null,
    imagePath: null as string | null,
  });

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setIsLoading(true);

        // Extract and parse the ID from params
        const postId =
          typeof params.id === "string" ? Number.parseInt(params.id, 10) : null;

        if (!postId || isNaN(postId)) {
          throw new Error("Invalid post ID");
        }

        const { data, error } = await supabase
          .from("contents")
          .select("*")
          .eq("id", postId)
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          setPostData({
            title: data.title || "",
            body: data.content || data.body || "",
            category: data.category || "",
            publication_status:
              data.publication_status || data.status || "draft",
            published_date: data.published_date
              ? new Date(data.published_date)
              : null,
            imageUrl: data.image_url || null,
            imagePath: data.image_path || null,
          });
        }
      } catch (err: any) {
        console.error("Error fetching post:", err);
        setError(err.message || "Failed to load post");
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchPost();
    }
  }, [params.id]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setPostData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setPostData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: Date | undefined) => {
    setPostData((prev) => ({ ...prev, published_date: date ?? null }));
    if (date) {
      setPostData((prev) => ({ ...prev, status: "publication_status" }));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Image size should be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploading(true);

      // Remove old image if exists
      if (postData.imagePath) {
        await supabase.storage
          .from("content-image")
          .remove([postData.imagePath]);
      }

      // Create a unique file name
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()
        .toString(36)
        .substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `post-images/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("content-image")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get the public URL
      const { data } = supabase.storage
        .from("content-image")
        .getPublicUrl(filePath);

      // Update state with the image URL and path
      setPostData((prev) => ({
        ...prev,
        imageUrl: data.publicUrl,
        imagePath: filePath,
      }));

      toast({
        title: "Image uploaded",
        description: "Your image has been uploaded successfully",
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your image",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = async () => {
    if (postData.imagePath) {
      try {
        const { error } = await supabase.storage
          .from("content-image")
          .remove([postData.imagePath]);

        if (error) {
          throw error;
        }
      } catch (error) {
        console.error("Error removing image:", error);
        // Continue anyway to remove from UI
      }
    }

    setPostData((prev) => ({ ...prev, imageUrl: null, imagePath: null }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Extract and parse the ID from params
      const postId =
        typeof params.id === "string" ? Number.parseInt(params.id, 10) : null;

      if (!postId || isNaN(postId)) {
        throw new Error("Invalid post ID");
      }

      const { error } = await supabase
        .from("contents")
        .update({
          title: postData.title,
          body: postData.body,
          category: postData.category,
          publication_status: postData.publication_status,
          published_date: postData.published_date?.toISOString() || null,
          image_url: postData.imageUrl,
          image_path: postData.imagePath,
          updated_at: new Date().toISOString(),
        })
        .eq("id", postId);

      if (error) {
        throw error;
      }

      toast({
        title: "Post updated",
        description:
          postData.publication_status === "published"
            ? "Your post has been published successfully."
            : postData.publication_status === "scheduled"
            ? "Your post has been scheduled for publication."
            : "Your post has been saved as a draft.",
      });

      router.push("/dashboard/posts");
    } catch (error: any) {
      console.error("Error updating post:", error);
      toast({
        title: "Error",
        description: error.message || "There was an error updating your post",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Skeleton className="h-8 w-40" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-48" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-64 w-full" />
                </CardContent>
              </Card>
            </div>
            <div>
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-10 w-full" />
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Error</CardTitle>
              <CardDescription>{error}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                We couldn't load this post. It may have been deleted or you may
                not have permission to edit it.
              </p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => router.push("/dashboard/posts")}>
                Return to Posts
              </Button>
            </CardFooter>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <h1 className="text-3xl font-bold">Edit Post</h1>
          </div>
          <div className="flex items-center gap-2">
            <Dialog open={showPreview} onOpenChange={setShowPreview}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Eye className="mr-2 h-4 w-4" />
                  Preview
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[800px]">
                <DialogHeader>
                  <DialogTitle>Post Preview</DialogTitle>
                  <DialogDescription>
                    This is how your post will look when published
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <h1 className="text-3xl font-bold">
                    {postData.title || "Untitled Post"}
                  </h1>
                  {postData.imageUrl && (
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg mb-4">
                      <Image
                        src={postData.imageUrl || "/placeholder.svg"}
                        alt="Featured image"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  {postData.category && (
                    <div className="text-sm text-muted-foreground">
                      Category: {postData.category}
                    </div>
                  )}
                  <div className="prose max-w-none">
                    {postData.body ? (
                      <div className="whitespace-pre-wrap">{postData.body}</div>
                    ) : (
                      <p className="text-muted-foreground">No content yet.</p>
                    )}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Button type="submit" form="post-form">
              <Save className="mr-2 h-4 w-4" />
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>

        <form id="post-form" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Post Content</CardTitle>
                  <CardDescription>
                    Edit your blog post content here
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="Enter post title"
                      value={postData.title}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Featured Image</Label>
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
                      {postData.imageUrl ? (
                        <div className="relative">
                          <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                            <Image
                              src={postData.imageUrl || "/placeholder.svg"}
                              alt="Featured image preview"
                              fill
                              className="object-cover"
                            />
                          </div>
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2"
                            onClick={removeImage}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-4">
                          <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground mb-2">
                            Drag and drop an image, or click to browse
                          </p>
                          <Button
                            type="button"
                            variant="secondary"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                          >
                            {isUploading ? "Uploading..." : "Select Image"}
                          </Button>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageUpload}
                            disabled={isUploading}
                          />
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Recommended: 1200×630px, JPEG or PNG, max 5MB
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="body">Content</Label>
                    <Textarea
                      id="body"
                      name="body"
                      placeholder="Write your post content here..."
                      value={postData.body}
                      onChange={handleInputChange}
                      rows={15}
                      required
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Post Settings</CardTitle>
                  <CardDescription>
                    Configure your post settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={postData.category}
                      onValueChange={(value) =>
                        handleSelectChange("category", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.name}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Publication Status</Label>
                    <Tabs
                      value={postData.publication_status}
                      onValueChange={(value) =>
                        handleSelectChange("publication_status", value)
                      }
                      className="w-full"
                    >
                      <TabsList className="grid grid-cols-3 w-full">
                        <TabsTrigger value="draft">Draft</TabsTrigger>
                        <TabsTrigger value="published">Publish</TabsTrigger>
                        <TabsTrigger value="scheduled">Schedule</TabsTrigger>
                      </TabsList>
                      <TabsContent value="draft" className="pt-4">
                        <p className="text-sm text-muted-foreground">
                          Save as a draft to continue editing later.
                        </p>
                      </TabsContent>
                      <TabsContent value="published" className="pt-4">
                        <p className="text-sm text-muted-foreground">
                          Publish immediately for all to see.
                        </p>
                      </TabsContent>
                      <TabsContent value="scheduled" className="pt-4">
                        <div className="space-y-2">
                          <Label>Publication Date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full justify-start text-left font-normal"
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {postData.published_date ? (
                                  format(postData.published_date, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                required={false}
                                selected={postData.published_date || undefined}
                                onSelect={handleDateChange}
                                initialFocus
                                disabled={(date) => date < new Date()}
                              />
                            </PopoverContent>
                          </Popover>
                          <p className="text-sm text-muted-foreground">
                            Schedule your post to be published at a future date.
                          </p>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full">
                    {isSubmitting
                      ? "Saving..."
                      : postData.publication_status === "published"
                      ? "Update & Publish"
                      : postData.publication_status === "scheduled"
                      ? "Update & Schedule"
                      : "Update Draft"}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
