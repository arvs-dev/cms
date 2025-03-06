"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-provider";
import { MainNav } from "@/components/main-nav";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, Users, FileText, Settings } from "lucide-react";
import { ContentSubmissionForm } from "@/components/content-submission-form";
import { ContentForm } from "@/components/content/content-form";
import { supabase } from "@/lib/supabase";
import { Content } from "@/types/content";
import Image from "next/image";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const [content, setContent] = useState<Content[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    async function fetchContent() {
      const { data, error } = await supabase.from("contents").select("*");

      if (error) {
        console.error("Error fetching content:", error.message);
        return;
      }

      if (data) {
        setContent(data); // Update the state with fetched data
      }
    }

    fetchContent(); // Fetch content when the component mounts
  }, []); // Empty dependency array ensures it runs only once

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <MainNav />
      <div className="flex-1 container mx-auto p-4 md:p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user.name}</p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-2">
            {/* <ContentSubmissionForm /> */}
            <ContentForm />
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            {/* <TabsTrigger value="News">Events</TabsTrigger> */}
            {/* <TabsTrigger value="Events">Reports</TabsTrigger> */}
            {/* <TabsTrigger value="Projects">Content</TabsTrigger> */}
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Forums</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,248</div>
                  <p className="text-xs text-muted-foreground">
                    +12% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Events</CardTitle>
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">8</div>
                  <p className="text-xs text-muted-foreground">
                    Next: Sunday Service
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">News</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">
                    3 with upcoming news
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Projects
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24</div>
                  <p className="text-xs text-muted-foreground">
                    +8% from last month
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Upcoming Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Event {i}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(
                              Date.now() + i * 86400000
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Recent Activities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {content.map((stat) => (
                      <div
                        key={stat.id}
                        className="bg-white overflow-hidden shadow rounded-lg"
                      >
                        <div className="p-5">
                          <div className="flex items-center">
                            <div className={`flex-shrink-0 rounded-md p-3`}>
                              {stat.images && stat.images.length > 0 && (
                                <div className="relative w-[150px]">
                                  {stat.images.length > 1 ? (
                                    <div className="relative overflow-hidden">
                                      {stat.images.map((image, index) => (
                                        <Image
                                          key={index}
                                          src={image}
                                          alt={`Content image ${index + 1}`}
                                          width={350}
                                          height={350}
                                          data-image={stat.id}
                                          className={`text-white absolute transition-opacity duration-500 ${
                                            index === 0
                                              ? "opacity-100"
                                              : "opacity-0"
                                          }`}
                                        />
                                      ))}
                                      <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                                        {stat.images.map((_, index) => (
                                          <button
                                            key={index}
                                            className="w-2 h-2 rounded-full bg-white/50"
                                            onClick={() => {
                                              const images =
                                                document.querySelectorAll(
                                                  `[data-image-${stat.id}]`
                                                );
                                              images.forEach((img, i) => {
                                                img.classList.toggle(
                                                  "opacity-0",
                                                  i !== index
                                                );
                                                img.classList.toggle(
                                                  "opacity-100",
                                                  i === index
                                                );
                                              });
                                            }}
                                          />
                                        ))}
                                      </div>
                                    </div>
                                  ) : (
                                    <Image
                                      src={stat.images[0]}
                                      alt="Content image"
                                      width={350}
                                      height={350}
                                      className="text-white rounded-sm"
                                    />
                                  )}
                                </div>
                              )}
                            </div>
                            <div className="ml-5 w-0 flex-1">
                              <dl>
                                <dt className="text-sm font-medium text-gray-500 truncate">
                                  {stat.title}
                                </dt>
                                <dd>
                                  <div className="text-lg font-medium text-gray-900">
                                    <div
                                      dangerouslySetInnerHTML={{
                                        __html: stat.body,
                                      }}
                                    />
                                  </div>
                                </dd>
                              </dl>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="content" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Content Submissions</CardTitle>
                  <CardDescription>
                    Manage content submitted by church members
                  </CardDescription>
                </div>
                <ContentSubmissionForm />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-md border">
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Youth Camp Testimony</h3>
                          <p className="text-sm text-muted-foreground">
                            Testimony • Submitted by John Doe
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Review
                          </Button>
                          <Button variant="outline" size="sm">
                            Approve
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-md border">
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">
                            Prayer Request for Healing
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Prayer Request • Submitted by Mary Smith
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Review
                          </Button>
                          <Button variant="outline" size="sm">
                            Approve
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-md border">
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">
                            Community Outreach Announcement
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Announcement • Submitted by Pastor James
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Review
                          </Button>
                          <Button variant="outline" size="sm">
                            Approve
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="events" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Events Calendar</CardTitle>
                <CardDescription>
                  View and manage upcoming church events
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Events calendar content will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="members" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Church Members</CardTitle>
                <CardDescription>
                  View and manage church membership
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Member directory content will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Reports</CardTitle>
                <CardDescription>
                  View church reports and analytics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Reports content will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
