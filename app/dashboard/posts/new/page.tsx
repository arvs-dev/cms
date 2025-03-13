"use client";

import type React from "react";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
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
import DashboardLayout from "@/components/dashboard-layout";
import { useToast } from "@/hooks/use-toast";
import { CalendarIcon, Eye, Save, Upload, X } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

// In a real app, these would be fetched from your API
const categories = [
  { id: 1, name: "News" },
  { id: 2, name: "Events" },
  { id: 3, name: "Projects" },
];

export default function NewPostPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [postData, setPostData] = useState({
    title: "",
    content: "",
    category: "",
    status: "draft",
    publishDate: null as Date | null,
    imageUrl: null as string | null,
    imagePath: null as string | null, // Store the path in Supabase storage
  });
  const [isUploading, setIsUploading] = useState(false);

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
    setPostData((prev) => ({ ...prev, publishDate: date ?? null }));
    if (date) {
      setPostData((prev) => ({ ...prev, status: "scheduled" }));
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

      // Create a unique file name
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()
        .toString(36)
        .substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

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
      const { error } = await supabase.from("contents").insert({
        title: postData.title,
        body: postData.content,
        category: postData.category || null,
        published_date:
          postData.publishDate || new Date().toISOString() || null,
        image_url: postData.imageUrl || null,
        image_path: postData.imagePath || null,
        created_at: new Date().toISOString(),
        publication_status: postData.status,
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Post created",
        description:
          postData.status === "published"
            ? "Your post has been published successfully."
            : postData.status === "scheduled"
            ? "Your post has been scheduled for publication."
            : "Your post has been saved as a draft.",
      });
      router.push("/dashboard/posts");
    } catch (error) {
      console.error("Error saving post:", error);
      toast({
        title: "Error",
        description: "There was an error saving your post",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-bold">Create New Post</h1>
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
                    {postData.content ? (
                      <div className="whitespace-pre-wrap">
                        {postData.content}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No content yet.</p>
                    )}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Button type="submit" form="post-form">
              <Save className="mr-2 h-4 w-4" />
              {isSubmitting ? "Saving..." : "Save Post"}
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
                    Write your blog post content here
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
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                      id="content"
                      name="content"
                      placeholder="Write your post content here..."
                      value={postData.content}
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
                      defaultValue="draft"
                      value={postData.status}
                      onValueChange={(value) =>
                        handleSelectChange("status", value)
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
                                {postData.publishDate ? (
                                  format(postData.publishDate, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                required={false}
                                selected={postData.publishDate || undefined}
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
                      : postData.status === "published"
                      ? "Publish Post"
                      : postData.status === "scheduled"
                      ? "Schedule Post"
                      : "Save Draft"}
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
