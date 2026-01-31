import { Sparkles, Clock3, Wand2 } from "lucide-react";

const items = [
  {
    title: "Two-pass AI pipeline",
    description:
      "Outline first, then slide content with bullets, speaker notes, and image queries validated via zod.",
    icon: Sparkles,
  },
  {
    title: "Editor built for speed",
    description:
      "Inline editing, drag-and-drop with dnd-kit, autosave every few seconds, and recovery on refresh.",
    icon: Wand2,
  },
  {
    title: "Panic Mode",
    description:
      "Ultra plan shortcut for a deck in ~20 seconds. Prefers speed, uses simpler layouts and placeholders as needed.",
    icon: Clock3,
  },
];

export function FeatureHighlights() {
  return (
    <section className="border-y border-neutral-200 bg-neutral-50/60">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 px-4 py-12 sm:px-6 sm:py-16 md:grid-cols-3 lg:px-8">
        {items.map((item) => (
          <div
            key={item.title}
            className="flex flex-col gap-3 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm"
          >
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-900 text-white">
              <item.icon className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-900">{item.title}</h3>
            <p className="text-sm text-neutral-600">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

