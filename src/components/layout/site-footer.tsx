export function SiteFooter() {
  return (
    <footer className="border-t border-neutral-200 bg-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-neutral-600 sm:px-6 lg:px-8 sm:flex-row sm:items-center sm:justify-between">
        <span>© {new Date().getFullYear()} SlideRush AI. All rights reserved.</span>
        <div className="flex gap-4">
          <a href="/pricing" className="hover:text-neutral-900">
            Pricing
          </a>
          <a href="/templates" className="hover:text-neutral-900">
            Templates
          </a>
          <a href="/auth" className="hover:text-neutral-900">
            Sign in
          </a>
        </div>
      </div>
    </footer>
  );
}

