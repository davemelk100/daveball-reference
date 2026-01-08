import { ThemeToggle } from "@/components/theme-toggle"

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30 mt-auto">
      <div className="container py-6">
        <div className="flex flex-col items-center gap-4 mb-4">
          <p className="text-xs text-muted-foreground max-w-2xl text-center">
            Major League Numbers is not affiliated with, endorsed by, or sponsored by Major League Baseball (MLB) or its
            teams. All MLB logos, trademarks, and data are the property of MLB and its respective teams. This site is an
            independent fan project for informational purposes only.
          </p>
          <ThemeToggle />
        </div>
        <p className="text-center text-xs text-muted-foreground/60">
          Powered by{" "}
          <a
            href="https://github.com/jldbc/pybaseball"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground transition-colors"
          >
            pybaseball
          </a>{" "}
          &middot; &copy; {new Date().getFullYear()} Major League Numbers &middot; Manufactured by{" "}
          <a
            href="https://davemelk.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground transition-colors"
          >
            Melkonian Industries
          </a>
        </p>
      </div>
    </footer>
  )
}
