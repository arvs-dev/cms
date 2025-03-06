"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, ImageIcon, Loader2, X } from "lucide-react";
import { format } from "date-fns";
import * as z from "zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { RichTextEditor } from "@/components/content/rich-text-editor";
import { supabase } from "@/lib/supabase";

// ✅ Schema Validation with Zod
const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  category: z.enum(["News", "Events", "Projects"]),
  date: z.date({ required_error: "Please select a date" }),
  content: z.string().min(1, "Content is required"),
  images: z.array(z.string()).optional(),
});

type FormData = z.infer<typeof formSchema>;

export function ContentForm() {
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: "News",
      images: [],
    },
  });

  // ✅ Submit Form Data
  const onSubmit = async (data: FormData) => {
    try {
      console.log("Form data:", data);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

      const { error } = await supabase.from("contents").insert([
        {
          title: data.title,
          category: data.category,
          date: data.date,
          body: data.content,
          images: data.images,
        },
      ]);

      if (error) throw error;

      toast({
        className: "bg-success text-accent-foreground",
        title: "Content created",
        description: "Your content has been successfully created.",
      });

      setOpen(false);
      form.reset();
    } catch (error) {
      console.error("Submission error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again.",
      });
    }
  };

  // ✅ Handle Image Upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    setUploading(true);
    try {
      const uploadedUrls: string[] = [];

      for (const file of files) {
        const filePath = `uploads/${Date.now()}-${file.name}`;

        const { error } = await supabase.storage
          .from("content-image") // Replace with actual bucket name
          .upload(filePath, file);

        if (error) throw error;

        const { data } = supabase.storage
          .from("content-image")
          .getPublicUrl(filePath);

        if (data?.publicUrl) uploadedUrls.push(data.publicUrl);
      }

      form.setValue("images", [
        ...(form.getValues("images") || []),
        ...uploadedUrls,
      ]);

      toast({
        title: "Files uploaded",
        description: `Successfully uploaded ${files.length} file(s).`,
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to upload files. Please try again.",
      });
    } finally {
      setUploading(false);
    }
  };

  // ✅ Handle Image Removal
  const removeImage = (index: number) => {
    const updatedImages =
      form.getValues("images")?.filter((_, i) => i !== index) || [];
    form.setValue("images", updatedImages);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="w-full sm:w-auto">
          Create New
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[725px]">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-bold">
            Create New Content
          </DialogTitle>
          <DialogDescription className="mx-auto max-w-md">
            Create and publish new content to your website. Fill out the form
            below to get started.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Title Input */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter content title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category & Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="News">News</SelectItem>
                        <SelectItem value="Events">Events</SelectItem>
                        <SelectItem value="Projects">Projects</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Content Editor */}
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <RichTextEditor
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Image Upload */}
            <FormLabel>Images</FormLabel>
            <Button
              type="button"
              variant="outline"
              disabled={uploading}
              onClick={() => document.getElementById("image-upload")?.click()}
            >
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ImageIcon className="h-4 w-4 mr-2" />
              )}
              {uploading ? "Uploading..." : "Add Images"}
            </Button>
            <Input
              id="image-upload"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleImageUpload}
            />

            {/* Display Uploaded Images */}
            <div className="grid grid-cols-3 gap-4 mt-4">
              {form.watch("images")?.map((url, index) => (
                <div key={index} className="relative">
                  <img
                    src={url}
                    alt={`Uploaded ${index + 1}`}
                    className="rounded-md w-full aspect-video object-cover"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1"
                  >
                    <X className="text-white h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            <Button type="submit">Create Content</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
