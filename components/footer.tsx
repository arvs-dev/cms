import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-primary w-full py-12 px-4 md:px-6 border-t text-white">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Northern Luzon Mission</h3>
            <p className="text-sm text-white">
              Seventh-day Adventists accept the Bible as their only creed and
              hold certain fundamental beliefs to be the teaching of the Holy
              Scriptures. These beliefs, as set forth here, constitute the
              church&apos;s understanding and expression of the teaching of
              Scripture.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-white hover:text-gray-200">
                <Facebook size={20} />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-white hover:text-gray-200">
                <Instagram size={20} />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-white hover:text-gray-200">
                <Twitter size={20} />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-white hover:text-gray-200">
                <Linkedin size={20} />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <nav className="flex flex-col space-y-2">
              <Link href="#" className="text-sm text-white hover:text-gray-200">
                Home
              </Link>
              <Link href="#" className="text-sm text-white hover:text-gray-200">
                About Us
              </Link>
              {/* <Link href="#" className="text-sm text-white hover:text-gray-200">
                Services
              </Link>
              <Link href="#" className="text-sm text-white hover:text-gray-200">
                Products
              </Link>
              <Link href="#" className="text-sm text-white hover:text-gray-200">
                Blog
              </Link>
              <Link href="#" className="text-sm text-white hover:text-gray-200">
                Contact
              </Link> */}
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin size={18} className="text-white mt-0.5" />
                <span className="text-sm text-white">
                  123 Business Street, Suite 100, City, State 12345
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={18} className="text-white" />
                <span className="text-sm text-white">(123) 456-7890</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={18} className="text-white" />
                <span className="text-sm text-white">info@companyname.com</span>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              Subscribe to Our Newsletter
            </h3>
            <p className="text-sm text-white">
              Stay updated with our latest news and offers.
            </p>
            <div className="flex flex-col space-y-2">
              <Input
                type="email"
                placeholder="Your email address"
                className="bg-background"
              />
              <Button className="bg-transparent border-white border hover:bg-white hover:text-primary">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-6 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-white">
              © {new Date().getFullYear()} Northern Luzon Mission. All rights
              reserved.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link href="#" className="text-xs text-white hover:text-primary">
                Privacy Policy
              </Link>
              <Link href="#" className="text-xs text-white hover:text-primary">
                Terms of Service
              </Link>
              <Link href="#" className="text-xs text-white hover:text-primary">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
