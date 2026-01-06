export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30 mt-auto">
      <div className="container py-6">
        <p className="text-center text-sm text-muted-foreground">
          Major League Numbers is not affiliated with, endorsed by, or sponsored by Major League Baseball (MLB) or its
          teams. All MLB logos, trademarks, and data are the property of MLB and its respective teams. This site is an
          independent fan project for informational purposes only.
        </p>
        <p className="text-center text-xs text-muted-foreground/60 mt-2">
          Powered by{" "}
          <a
            href="https://github.com/jldbc/pybaseball"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground transition-colors"
          >
            pybaseball
          </a>{" "}
          &middot; &copy; {new Date().getFullYear()} Major League Numbers
        </p>
      </div>
    </footer>
  )
}
