"use client";

import { useAuth } from "@/components/auth/auth-provider";
import DashboardLayout from "@/components/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { FileText, Clock, Tag, Eye } from "lucide-react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

interface Post {
  id: number;
  title: string;
  body: string;
  category: string;
  published_status: string;
  published_date: string;
  excerpt: string;
  status: string;
  date: string;
  views: number;
}
export default function DashboardPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);

  if (!user) {
    redirect("/login"); // or wherever you want to redirect unauthenticated users
  }

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase.from("contents").select("*");

        if (error) {
          console.error("Error fetching posts:", error.message);
          return;
        }

        if (data) {
          setPosts(data);
        }
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    };

    fetchPosts();
  }, []);

  const stats = [
    {
      name: "Total Posts",
      value: "24",
      icon: FileText,
      change: "+2 from last week",
    },
    { name: "Categories", value: "8", icon: Tag, change: "No change" },
    {
      name: "Engagements",
      value: "12.5K",
      icon: Eye,
      change: "+8% from last month",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => (
            <Card key={stat.name}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.name}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Posts</CardTitle>
            <CardDescription>
              Your most recent blog posts and their status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="table-auto w-full">
                <thead>
                  <tr className="border-b text-left">
                    <th className="p-2 font-medium">Title</th>
                    <th className="p-2 font-medium">Date</th>
                    <th className="p-2 font-medium text-right">Views</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post) => (
                    <tr
                      key={post.id}
                      className="border-b last:border-0 hover:bg-gray-50"
                    >
                      <td className="p-2">{post.title}</td>
                      <td className="p-2 text-muted-foreground">
                        {post.published_date}
                      </td>
                      <td className="p-2 text-right">
                        {post.views > 0 ? post.views.toLocaleString() : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
