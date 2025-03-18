"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { CheckCircle, Cloud, Lock, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import AuthButton from '@/components/AuthButton'

const scrollToSection = (id) => {
  const element = document.getElementById(id);
  if (!element) return;

  const offset = 80;
  const bodyRect = document.body.getBoundingClientRect().top;
  const elementRect = element.getBoundingClientRect().top;
  const elementPosition = elementRect - bodyRect;
  const offsetPosition = elementPosition - offset;

  window.scrollTo({
    top: offsetPosition,
    behavior: "smooth",
  });
};

export default function LandingPage() {
  const [isMounted, setIsMounted] = useState(false);

  // Prevent hydration errors with useEffect
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-100">
      <header className="sticky top-0 z-40 w-full border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-zinc-300" />
            <span className="text-lg sm:text-xl font-bold">Remindify</span>
          </div>
          <nav className="hidden md:flex gap-4 lg:gap-6">
            <Link
              href="#features"
              className="text-sm font-medium text-zinc-400 hover:text-zinc-100"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("features");
              }}
            >
              Features
            </Link>
            <Link
              href="#testimonials"
              className="text-sm font-medium text-zinc-400 hover:text-zinc-100"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("testimonials");
              }}
            >
              Testimonials
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium text-zinc-400 hover:text-zinc-100"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("pricing");
              }}
            >
              Pricing
            </Link>
          </nav>
          <MobileNav />
          <div className="hidden md:flex gap-2 lg:gap-4">
              <AuthButton></AuthButton>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="container py-12 md:py-16 lg:py-24 xl:py-32">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-16 items-center">
            <div className="space-y-4 sm:space-y-6">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter">
                Organize your life with{" "}
                <span className="text-zinc-300">Remindify</span>
              </h1>
              <p className="max-w-[600px] text-sm sm:text-base md:text-lg lg:text-xl text-zinc-400">
                The state-of-the-art to-do list app that helps you stay
                organized across all your devices. Simple, powerful, and
                beautifully designed.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button className="bg-zinc-200 text-zinc-900 hover:bg-zinc-100">
                  Get Started
                </Button>
                <Button
                  variant="outline"
                  className="border-zinc-700 text-zinc-300 hover:border-zinc-600 hover:text-zinc-100"
                >
                  Learn more
                </Button>
              </div>
            </div>
            <div className="relative aspect-video overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
              <Image
                src="/placeholder.svg?height=720&width=1280"
                alt="Remindify app screenshot"
                width={1280}
                height={720}
                className="object-cover w-full h-full"
                priority
              />
            </div>
          </div>
        </section>

        <section
          id="features"
          className="container py-12 md:py-16 lg:py-24 border-t border-zinc-800"
        >
          <div className="text-center mb-8 md:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter">
              Powerful Features
            </h2>
            <p className="mt-3 md:mt-4 text-sm sm:text-base md:text-lg lg:text-xl text-zinc-400">
              Everything you need to stay organized and productive
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            <div className="flex flex-col items-center text-center p-4 sm:p-6 rounded-lg border border-zinc-800 bg-zinc-900">
              <div className="rounded-full bg-zinc-800 p-3 sm:p-4">
                <Cloud className="h-5 w-5 sm:h-6 sm:w-6 text-zinc-300" />
              </div>
              <h3 className="mt-4 text-lg sm:text-xl font-bold">
                Persistent Storage
              </h3>
              <p className="mt-2 text-sm sm:text-base text-zinc-400">
                Access your tasks anywhere with local storage for offline use
                and cloud sync across all your devices.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-4 sm:p-6 rounded-lg border border-zinc-800 bg-zinc-900">
              <div className="rounded-full bg-zinc-800 p-3 sm:p-4">
                <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-zinc-300" />
              </div>
              <h3 className="mt-4 text-lg sm:text-xl font-bold">
                Task Management
              </h3>
              <p className="mt-2 text-sm sm:text-base text-zinc-400">
                Prioritize tasks, set due dates, and organize with categories
                for maximum productivity.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-4 sm:p-6 rounded-lg border border-zinc-800 bg-zinc-900">
              <div className="rounded-full bg-zinc-800 p-3 sm:p-4">
                <Lock className="h-5 w-5 sm:h-6 sm:w-6 text-zinc-300" />
              </div>
              <h3 className="mt-4 text-lg sm:text-xl font-bold">
                Secure Authentication
              </h3>
              <p className="mt-2 text-sm sm:text-base text-zinc-400">
                Keep your data private with secure login options including OAuth
                and email/password authentication.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-zinc-900 py-12 md:py-16 lg:py-24">
          <div className="container">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-16 items-center">
              <div className="order-2 lg:order-1">
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="aspect-square overflow-hidden rounded-lg sm:rounded-xl border border-zinc-800 bg-zinc-950">
                    <Image
                      src="/placeholder.svg?height=600&width=600"
                      alt="App screenshot 1"
                      width={600}
                      height={600}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="aspect-square overflow-hidden rounded-lg sm:rounded-xl border border-zinc-800 bg-zinc-950">
                    <Image
                      src="/placeholder.svg?height=600&width=600"
                      alt="App screenshot 2"
                      width={600}
                      height={600}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="aspect-square overflow-hidden rounded-lg sm:rounded-xl border border-zinc-800 bg-zinc-950">
                    <Image
                      src="/placeholder.svg?height=600&width=600"
                      alt="App screenshot 3"
                      width={600}
                      height={600}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="aspect-square overflow-hidden rounded-lg sm:rounded-xl border border-zinc-800 bg-zinc-950">
                    <Image
                      src="/placeholder.svg?height=600&width=600"
                      alt="App screenshot 4"
                      width={600}
                      height={600}
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-4 sm:space-y-6 order-1 lg:order-2">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter">
                  Beautiful Design, Intuitive Interface
                </h2>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-zinc-400">
                  Inspired by Apple's clean aesthetic, Remindify combines
                  beautiful design with powerful functionality. The intuitive
                  interface makes managing tasks a pleasure, not a chore.
                </p>
                <ul className="space-y-2 sm:space-y-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-zinc-300" />
                    <span>Minimalist design focused on your content</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-zinc-300" />
                    <span>Customizable views to match your workflow</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-zinc-300" />
                    <span>Dark and light mode for any environment</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-zinc-300" />
                    <span>Responsive design for all your devices</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section
          id="testimonials"
          className="container py-12 md:py-16 lg:py-24 border-t border-zinc-800"
        >
          <div className="text-center mb-8 md:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter">
              What Our Users Say
            </h2>
            <p className="mt-3 md:mt-4 text-sm sm:text-base md:text-lg lg:text-xl text-zinc-400">
              Join thousands of satisfied users who have transformed their
              productivity
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            <div className="p-4 sm:p-6 rounded-lg border border-zinc-800 bg-zinc-900">
              <div className="flex items-center gap-4 mb-4">
                {/* <Image
                  src="/placeholder.svg?height=100&width=100"
                  alt="User avatar"
                  width={48}
                  height={48}
                  className="rounded-full"
                /> */}
                <div>
                  <h4 className="font-bold">Sarah Johnson</h4>
                  <p className="text-sm text-zinc-400">Product Manager</p>
                </div>
              </div>
              <p className="text-zinc-300">
                "Remindify has completely changed how I manage my tasks. The
                cloud sync means I never lose track of what I need to do,
                whether I'm at my desk or on the go."
              </p>
            </div>

            <div className="p-4 sm:p-6 rounded-lg border border-zinc-800 bg-zinc-900">
              <div className="flex items-center gap-4 mb-4">
                {/* <Image
                  src="/placeholder.svg?height=100&width=100"
                  alt="User avatar"
                  width={48}
                  height={48}
                  className="rounded-full"
                /> */}
                <div>
                  <h4 className="font-bold">Michael Chen</h4>
                  <p className="text-sm text-zinc-400">Software Developer</p>
                </div>
              </div>
              <p className="text-zinc-300">
                "The categorization and priority features help me stay focused
                on what matters most. It's like having a personal assistant
                keeping me on track."
              </p>
            </div>

            <div className="p-4 sm:p-6 rounded-lg border border-zinc-800 bg-zinc-900">
              <div className="flex items-center gap-4 mb-4">
                {/* <Image
                  src="/placeholder.svg?height=100&width=100"
                  alt="User avatar"
                  width={48}
                  height={48}
                  className="rounded-full"
                /> */}
                <div>
                  <h4 className="font-bold">Emily Rodriguez</h4>
                  <p className="text-sm text-zinc-400">Freelance Designer</p>
                </div>
              </div>
              <p className="text-zinc-300">
                "As someone who works across multiple devices, the seamless sync
                is a game-changer. Plus, the design is beautiful - it makes me
                want to use it every day!"
              </p>
            </div>
          </div>
        </section>

        <section
          id="pricing"
          className="bg-zinc-800 text-white py-12 md:py-16 lg:py-24"
        >
          <div className="container text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter mb-4 sm:mb-6">
              Ready to transform your productivity?
            </h2>
            <p className="max-w-[600px] mx-auto text-sm sm:text-base md:text-lg lg:text-xl text-zinc-300 mb-6 sm:mb-8">
              Join thousands of users who have revolutionized how they manage
              tasks with Remindify.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Button className="bg-zinc-200 text-zinc-900 hover:bg-zinc-100">
                Get Started for Free
              </Button>
              <Button
                variant="outline"
                className="border-zinc-600 text-zinc-300 hover:border-zinc-500 hover:text-zinc-100"
              >
                View Pricing
              </Button>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t border-zinc-800 bg-zinc-950">
        <div className="container py-8 md:py-12">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-zinc-300" />
                <span className="text-lg sm:text-xl font-bold">Remindify</span>
              </div>
              <p className="text-sm sm:text-base text-zinc-400">
                The state-of-the-art to-do list app that helps you stay
                organized across all your devices.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="#features"
                    className="text-zinc-400 hover:text-zinc-100"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection("features");
                    }}
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="#pricing"
                    className="text-zinc-400 hover:text-zinc-100"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection("pricing");
                    }}
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="#testimonials"
                    className="text-zinc-400 hover:text-zinc-100"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection("testimonials");
                    }}
                  >
                    Testimonials
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-zinc-400 hover:text-zinc-100">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-zinc-400 hover:text-zinc-100">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-zinc-400 hover:text-zinc-100">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-zinc-400 hover:text-zinc-100">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-zinc-400 hover:text-zinc-100">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-zinc-400 hover:text-zinc-100">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-zinc-400 hover:text-zinc-100">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-zinc-400 hover:text-zinc-100">
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-zinc-800 text-center text-xs sm:text-sm text-zinc-400">
            <p>© {new Date().getFullYear()} Remindify. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const handleNavClick = (id) => {
    setIsOpen(false);
    setTimeout(() => {
      scrollToSection(id);
    }, 300);
  };

  return (
    <div className="md:hidden">
      <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)}>
        <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
        <span className="sr-only">Open menu</span>
      </Button>
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-zinc-950/80 backdrop-blur-sm">
          <div className="fixed right-0 top-0 h-full w-full sm:w-3/4 max-w-sm bg-zinc-950 p-4 sm:p-6">
            <div className="flex justify-end">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-5 w-5 sm:h-6 sm:w-6" />
                <span className="sr-only">Close menu</span>
              </Button>
            </div>
            <nav className="mt-6 sm:mt-8 flex flex-col gap-4 sm:gap-6">
              <Link
                href="#features"
                className="text-base sm:text-lg font-medium text-zinc-400 hover:text-zinc-100"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick("features");
                }}
              >
                Features
              </Link>
              <Link
                href="#testimonials"
                className="text-base sm:text-lg font-medium text-zinc-400 hover:text-zinc-100"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick("testimonials");
                }}
              >
                Testimonials
              </Link>
              <Link
                href="#pricing"
                className="text-base sm:text-lg font-medium text-zinc-400 hover:text-zinc-100"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick("pricing");
                }}
              >
                Pricing
              </Link>
              <div className="flex flex-col gap-3 sm:gap-4 mt-4">
                <Button
                  variant="outline"
                  className="w-full border-zinc-700 text-zinc-300 hover:border-zinc-600 hover:text-zinc-100"
                >
                  Log in
                </Button>
                <Button className="w-full bg-zinc-200 text-zinc-900 hover:bg-zinc-100">
                  Sign up
                </Button>
              </div>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
