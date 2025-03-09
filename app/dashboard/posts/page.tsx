"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DashboardLayout from "@/components/dashboard-layout";
import {
  PlusCircle,
  Search,
  MoreVertical,
  Eye,
  Pencil,
  Filter,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// In a real app, this would be fetched from your API
const initialPosts = [
  {
    id: 1,
    title: "Getting Started with Next.js",
    excerpt:
      "Learn the basics of Next.js and how to build your first application.",
    status: "published",
    category: "Development",
    date: "Mar 8, 2025",
    views: 1240,
  },
  {
    id: 2,
    title: "Understanding React Hooks",
    excerpt:
      "A comprehensive guide to React Hooks and how to use them effectively.",
    status: "draft",
    category: "React",
    date: "Mar 7, 2025",
    views: 0,
  },
  {
    id: 3,
    title: "CSS Grid Layout Tutorial",
    excerpt: "Master CSS Grid Layout with this step-by-step tutorial.",
    status: "scheduled",
    category: "CSS",
    date: "Mar 12, 2025",
    views: 0,
  },
  {
    id: 4,
    title: "JavaScript Best Practices",
    excerpt:
      "Learn the best practices for writing clean and efficient JavaScript code.",
    status: "published",
    category: "JavaScript",
    date: "Mar 5, 2025",
    views: 856,
  },
  {
    id: 5,
    title: "Introduction to TypeScript",
    excerpt:
      "Get started with TypeScript and learn how it improves your JavaScript code.",
    status: "published",
    category: "TypeScript",
    date: "Mar 3, 2025",
    views: 1120,
  },
  {
    id: 6,
    title: "Building a REST API with Node.js",
    excerpt: "Learn how to build a RESTful API using Node.js and Express.",
    status: "draft",
    category: "Backend",
    date: "Mar 2, 2025",
    views: 0,
  },
  {
    id: 7,
    title: "Responsive Web Design Principles",
    excerpt:
      "Master the principles of responsive web design for modern websites.",
    status: "scheduled",
    category: "Design",
    date: "Mar 15, 2025",
    views: 0,
  },
];

export default function PostsPage() {
  const [posts, setPosts] = useState(initialPosts);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || post.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleDeletePost = (id: number) => {
    setPosts(posts.filter((post) => post.id !== id));
    toast({
      title: "Post deleted",
      description: "The post has been deleted successfully.",
    });
  };

  const getStatusBadgeClasses = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-bold">Posts</h1>
          <Link href="/dashboard/posts/new">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Post
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Posts</CardTitle>
            <CardDescription>
              Manage your blog posts, drafts, and scheduled content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search posts..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Posts</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Drafts</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {filteredPosts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No posts found. Try adjusting your search or filters.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredPosts.map((post) => (
                  <div
                    key={post.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="space-y-1 mb-4 sm:mb-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{post.title}</h3>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeClasses(
                            post.status
                          )}`}
                        >
                          {post.status.charAt(0).toUpperCase() +
                            post.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{post.category}</span>
                        <span>{post.date}</span>
                        {post.views > 0 && (
                          <span>{post.views.toLocaleString()} views</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/dashboard/posts/${post.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          Preview
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/dashboard/posts/${post.id}/edit`}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/posts/${post.id}`}>
                              Preview
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/posts/${post.id}/edit`}>
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDeletePost(post.id)}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
