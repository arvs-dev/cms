"use client";

import type React from "react";

import { useState } from "react";
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
import { CalendarIcon, Eye, Save } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";

// In a real app, these would be fetched from your API
const categories = [
  { id: 1, name: "Development" },
  { id: 2, name: "React" },
  { id: 3, name: "JavaScript" },
  { id: 4, name: "CSS" },
  { id: 5, name: "TypeScript" },
  { id: 6, name: "Backend" },
  { id: 7, name: "Design" },
];

export default function NewPostPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [postData, setPostData] = useState({
    title: "",
    content: "",
    excerpt: "",
    category: "",
    status: "draft",
    publishDate: null as Date | null,
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // In a real app, you would save the post to your database here
    setTimeout(() => {
      setIsSubmitting(false);
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
    }, 1000);
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
                  {postData.category && (
                    <div className="text-sm text-muted-foreground">
                      Category: {postData.category}
                    </div>
                  )}
                  {postData.excerpt && (
                    <p className="text-lg font-medium">{postData.excerpt}</p>
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
                    <Label htmlFor="excerpt">Excerpt</Label>
                    <Textarea
                      id="excerpt"
                      name="excerpt"
                      placeholder="Brief summary of your post"
                      value={postData.excerpt}
                      onChange={handleInputChange}
                      rows={3}
                    />
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
