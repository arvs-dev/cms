import {
  Calendar,
  Clock,
  ExternalLink,
  MapPin,
  Newspaper,
  TrendingUp,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface NewsItem {
  id: number;
  type: "news" | "event";
  title: string;
  description: string;
  image?: string;
  date: string;
  location?: string;
  time?: string;
  category: string;
  author?: {
    name: string;
    avatar?: string;
  };
  featured?: boolean;
  attendees?: number;
}

export default function NewsEventsBento() {
  const items: NewsItem[] = [
    {
      id: 1,
      type: "news",
      title: "Company Announces New Product Line",
      description:
        "Our latest innovation is set to disrupt the market with advanced features and improved performance.",
      image: "/images/slide2.jpg",
      date: "March 5, 2025",
      category: "Announcement",
      author: {
        name: "Sarah Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      featured: true,
    },
    {
      id: 2,
      type: "event",
      title: "Annual Conference 2025",
      description:
        "Join us for the biggest industry event of the year with keynote speakers and networking opportunities.",
      image: "/images/slide3.jpg",
      date: "April 12-15, 2025",
      category: "Events",
      attendees: 1200,
    },
    {
      id: 3,
      type: "news",
      title: "Q1 Financial Results Exceed Expectations",
      description:
        "Our first quarter results show a 24% increase in revenue compared to the same period last year.",
      date: "March 1, 2025",
      category: "Financial",
      author: {
        name: "Michael Chen",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    },
    {
      id: 4,
      type: "event",
      title: "Product Workshop",
      description:
        "Learn how to maximize your productivity with our new tools.",
      date: "March 20, 2025",
      location: "Online",
      time: "2:00 PM - 4:00 PM",
      category: "Workshop",
      attendees: 250,
    },
    {
      id: 5,
      type: "news",
      title: "New Office Opening in Singapore",
      description:
        "We're expanding our global presence with a new headquarters in Southeast Asia.",
      image: "/placeholder.svg?height=300&width=400",
      date: "February 28, 2025",
      category: "Expansion",
    },
    {
      id: 6,
      type: "event",
      title: "Charity Fundraiser",
      description:
        "Join us in supporting local education initiatives through our annual charity event.",
      date: "April 5, 2025",
      location: "Central Park, Downtown",
      time: "5:00 PM - 9:00 PM",
      category: "Community",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12 ">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-extrabold bg-primary inline-block px-4 py-2 text-white border-l-8 border-red-500">
          Latest News & Events
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 auto-rows-auto">
        {items.map((item) => {
          if (item.id === 1) {
            // Featured large news card
            return (
              <Card
                key={item.id}
                className="col-span-1 md:col-span-4 row-span-2 overflow-hidden group"
              >
                <div className="relative h-[500px] transition-transform duration-300 group-hover:scale-105">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    className="h-full w-full object-cover "
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-0 p-6 text-white">
                    <Badge variant="secondary" className="mb-2">
                      {item.category}
                    </Badge>
                    <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                    <p className="mb-4 text-white/80">{item.description}</p>
                    <div className="flex items-center">
                      <Newspaper className="h-4 w-4 mr-2" />
                      <span className="text-sm mr-4">{item.date}</span>
                      {item.author && (
                        <div className="flex items-center">
                          <Avatar className="h-6 w-6 mr-2">
                            <AvatarImage
                              src={item.author.avatar}
                              alt={item.author.name}
                            />
                            <AvatarFallback>
                              {item.author.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{item.author.name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          }

          if (item.id === 2) {
            // Featured event card
            return (
              <Card
                key={item.id}
                className="col-span-1 md:col-span-2 row-span-2 overflow-hidden "
              >
                <CardHeader className="pb-2">
                  <Badge className="w-fit mb-2 bg-orange-100 text-orange-700 hover:bg-orange-100 hover:text-orange-700">
                    {item.category}
                  </Badge>
                  <CardTitle className="text-xl">{item.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {item.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2 transition-transform duration-300 group-hover:scale-105">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    className="rounded-md w-full h-[280px] object-cover mb-4"
                  />
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{item.date}</span>
                    </div>
                    <p className="font-light italic text-[12px]">
                      Join us for the biggest industry event of the year with
                      keynote speakers and networking opportunities.
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          }

          // if (item.id === 3) {
          //   // Financial news card
          //   return (
          //     <Card
          //       key={item.id}
          //       className="col-span-1 md:col-span-2 row-span-1"
          //     >
          //       <CardHeader className="pb-2">
          //         <Badge variant="outline" className="w-fit mb-1">
          //           {item.category}
          //         </Badge>
          //         <CardTitle className="text-lg">{item.title}</CardTitle>
          //       </CardHeader>
          //       <CardContent>
          //         <div className="flex items-center mb-2">
          //           <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
          //           <span className="text-green-500 font-medium">
          //             +24% growth
          //           </span>
          //         </div>
          //         <CardDescription>{item.description}</CardDescription>
          //       </CardContent>
          //       <CardFooter className="flex justify-between pt-0">
          //         <div className="flex items-center text-xs text-muted-foreground">
          //           <Calendar className="h-3 w-3 mr-1" />
          //           {item.date}
          //         </div>
          //         {item.author && (
          //           <div className="flex items-center">
          //             <Avatar className="h-5 w-5 mr-1">
          //               <AvatarImage src={item.author.avatar} />
          //               <AvatarFallback>
          //                 {item.author.name.charAt(0)}
          //               </AvatarFallback>
          //             </Avatar>
          //             <span className="text-xs">{item.author.name}</span>
          //           </div>
          //         )}
          //       </CardFooter>
          //     </Card>
          //   );
          // }

          // Standard cards for remaining items
          // return (
          //   <Card
          //     key={item.id}
          //     className={`col-span-1 ${
          //       item.id === 5 ? "md:col-span-2" : "md:col-span-1"
          //     } row-span-1`}
          //   >
          //     <CardHeader className="pb-2">
          //       <Badge variant="outline" className="w-fit mb-1">
          //         {item.category}
          //       </Badge>
          //       <CardTitle className="text-base">{item.title}</CardTitle>
          //     </CardHeader>
          //     <CardContent className="pb-2">
          //       <CardDescription className="line-clamp-2">
          //         {item.description}
          //       </CardDescription>
          //       {item.image && item.id === 5 && (
          //         <img
          //           src={item.image || "/placeholder.svg"}
          //           alt={item.title}
          //           className="mt-2 rounded-md w-full h-20 object-cover"
          //         />
          //       )}
          //     </CardContent>
          //     <CardFooter className="pt-0">
          //       <div className="flex items-center text-xs text-muted-foreground">
          //         {item.type === "event" ? (
          //           <>
          //             <Calendar className="h-3 w-3 mr-1" />
          //             {item.date} {item.time && `· ${item.time}`}
          //           </>
          //         ) : (
          //           <>
          //             <Newspaper className="h-3 w-3 mr-1" />
          //             {item.date}
          //           </>
          //         )}
          //       </div>
          //     </CardFooter>
          //   </Card>
          // );
        })}
      </div>
    </div>
  );
}
