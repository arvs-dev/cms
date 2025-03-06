"use client";

import { useEffect } from "react";
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

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

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
            <Button>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Members
                  </CardTitle>
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
                  <CardTitle className="text-sm font-medium">
                    Upcoming Events
                  </CardTitle>
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
                  <CardTitle className="text-sm font-medium">
                    Active Ministries
                  </CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">
                    3 with upcoming activities
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    New Visitors
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
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Recent Activities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Activity {i}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date().toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Upcoming Events</CardTitle>
                  <CardDescription>Next 7 days</CardDescription>
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
