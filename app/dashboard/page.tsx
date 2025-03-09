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
import { FileText, Clock, Tag, Eye } from "lucide-react";
import { redirect } from "next/navigation";

export default function DashboardPage() {
  const { user } = useAuth();

  if (!user) {
    redirect("/login"); // or wherever you want to redirect unauthenticated users
  }
  const stats = [
    {
      name: "Total Posts",
      value: "24",
      icon: FileText,
      change: "+2 from last week",
    },
    { name: "Categories", value: "8", icon: Tag, change: "No change" },
    {
      name: "Total Views",
      value: "12.5K",
      icon: Eye,
      change: "+8% from last month",
    },
  ];

  const recentPosts = [
    {
      id: 1,
      title: "Getting Started with Next.js",
      status: "Published",
      date: "Mar 8, 2025",
      views: 1240,
    },
    {
      id: 2,
      title: "Understanding React Hooks",
      status: "Draft",
      date: "Mar 7, 2025",
      views: 0,
    },
    {
      id: 3,
      title: "CSS Grid Layout Tutorial",
      status: "Scheduled",
      date: "Mar 12, 2025",
      views: 0,
    },
    {
      id: 4,
      title: "JavaScript Best Practices",
      status: "Published",
      date: "Mar 5, 2025",
      views: 856,
    },
    {
      id: 5,
      title: "Introduction to TypeScript",
      status: "Published",
      date: "Mar 3, 2025",
      views: 1120,
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
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left">
                    <th className="p-2 font-medium">Title</th>
                    <th className="p-2 font-medium">Status</th>
                    <th className="p-2 font-medium">Date</th>
                    <th className="p-2 font-medium text-right">Views</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPosts.map((post) => (
                    <tr key={post.id} className="border-b last:border-0">
                      <td className="p-2">{post.title}</td>
                      <td className="p-2">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            post.status === "Published"
                              ? "bg-green-100 text-green-800"
                              : post.status === "Draft"
                              ? "bg-gray-100 text-gray-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {post.status}
                        </span>
                      </td>
                      <td className="p-2 text-muted-foreground">{post.date}</td>
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
