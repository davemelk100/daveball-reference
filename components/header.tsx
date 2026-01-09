"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { HeaderSearch } from "@/components/header-search";

const navigation = [
  { name: "Dashboard", href: "/" },
  { name: "Players", href: "/players" },
  { name: "Teams", href: "/teams" },
  { name: "Standings", href: "/standings" },
  { name: "All Stars", href: "/all-star" },
  { name: "HOF", href: "/hof" },
];

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-[80px] lg:h-[116px] items-center gap-4">
        <Link href="/" className="flex-shrink-0 border-0">
          <Image
            src="/mln-header.png"
            alt="Major League Numbers Logo"
            width={161}
            height={100}
            className="w-[65px] h-auto object-contain border-0"
          />
        </Link>

        <div className="flex-1 flex justify-center">
          <HeaderSearch />
        </div>

        <div className="flex items-center gap-2 lg:gap-4 shrink-0">
          <nav className="hidden xl:flex items-center gap-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap",
                  pathname === item.href
                    ? "bg-secondary/50 text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>
          <Button
            variant="ghost"
            size="icon"
            className="xl:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav className="xl:hidden border-t border-border bg-background animate-in slide-in-from-top duration-200">
          <div className="container py-4 space-y-4">
            <div className="space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "block px-3 py-3 text-base font-medium rounded-md transition-colors",
                    pathname === item.href
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
