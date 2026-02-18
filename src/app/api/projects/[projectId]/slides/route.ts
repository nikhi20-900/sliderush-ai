import { firebaseAuth, firestore } from "@/lib/firebase/client";
import { demoSlides, demoSlideCounters, isDemoMode } from "@/lib/demo-store";
import { addDoc, collection, getDocs, serverTimestamp } from "firebase/firestore";
import { NextResponse } from "next/server";

interface SlideData {
  id: string;
  order: number;
  layout: string;
  title: string;
  bullets: string[];
  speakerNotes: string | null;
  imageAssetId: string | null;
  imageQuery?: string | null;
  createdAt: string;
  updatedAt: string;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params;
    const auth = firebaseAuth();
    const user = auth?.currentUser;

    // Demo mode - allow without auth
    if (isDemoMode() || !user) {
      const slides = demoSlides.get(projectId) || [];
      return NextResponse.json({ slides, demoMode: true });
    }

    const db = firestore();
    if (!db) {
      return NextResponse.json({ error: "Database not available" }, { status: 503 });
    }

    const slidesRef = collection(db, "projects", projectId, "slides");
    const snapshot = await getDocs(slidesRef);

    const slides = snapshot.docs
      .map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          order: data.order || 0,
          layout: data.layout || "content",
          title: data.title || "",
          bullets: data.bullets || [],
          speakerNotes: data.speakerNotes || null,
          imageAssetId: data.imageAssetId || null,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        };
      })
      .sort((a, b) => (a.order || 0) - (b.order || 0));

    return NextResponse.json({ slides });

  } catch (error) {
    console.error("Error fetching slides:", error);
    return NextResponse.json(
      { error: "Failed to fetch slides" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params;
    const auth = firebaseAuth();
    const user = auth?.currentUser;

    const body = await request.json();
    const { layout = "content", title = "", bullets = [] } = body;

    // Demo mode - allow without auth
    if (isDemoMode() || !user) {
      if (!demoSlides.has(projectId)) {
        demoSlides.set(projectId, []);
        demoSlideCounters.set(projectId, 0);
      }

      const slides = demoSlides.get(projectId)!;
      const counter = demoSlideCounters.get(projectId)!;
      const slideId = `demo-slide-${counter + 1}`;
      demoSlideCounters.set(projectId, counter + 1);

      const slide = {
        id: slideId,
        order: slides.length,
        layout,
        title,
        bullets,
        speakerNotes: null,
        imageAssetId: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      slides.push(slide);
      return NextResponse.json({ slideId, demoMode: true }, { status: 201 });
    }

    const db = firestore();
    if (!db) {
      return NextResponse.json({ error: "Database not available" }, { status: 503 });
    }

    // Get current slide count to determine order
    const slidesRef = collection(db, "projects", projectId, "slides");
    const snapshot = await getDocs(slidesRef);
    const newOrder = snapshot.size;

    const slideRef = await addDoc(slidesRef, {
      order: newOrder,
      layout,
      title,
      bullets,
      speakerNotes: null,
      imageAssetId: null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return NextResponse.json(
      { slideId: slideRef.id },
      { status: 201 }
    );

  } catch (error) {
    console.error("Error creating slide:", error);
    return NextResponse.json(
      { error: "Failed to create slide" },
      { status: 500 }
    );
  }
}

// Helper function to add multiple slides (used by generation)
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params;
    const auth = firebaseAuth();
    const user = auth?.currentUser;

    const body = await request.json();
    const { slides = [] } = body;

    if (!Array.isArray(slides) || slides.length === 0) {
      return NextResponse.json({ error: "No slides provided" }, { status: 400 });
    }

    // Demo mode - allow without auth
    if (isDemoMode() || !user) {
      if (!demoSlides.has(projectId)) {
        demoSlides.set(projectId, []);
        demoSlideCounters.set(projectId, 0);
      }

      const existingSlides = demoSlides.get(projectId) || [];
      const counter = demoSlideCounters.get(projectId) || 0;

      const newSlides: SlideData[] = slides.map((slide: SlideData, index: number) => ({
        id: `demo-slide-${counter + index + 1}`,
        order: existingSlides.length + index,
        layout: slide.layout || "content",
        title: slide.title || "",
        bullets: slide.bullets || [],
        speakerNotes: slide.speakerNotes || null,
        imageAssetId: slide.imageAssetId || null,
        imageQuery: slide.imageQuery || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));

      demoSlides.set(projectId, [...existingSlides, ...newSlides]);
      demoSlideCounters.set(projectId, counter + slides.length);

      return NextResponse.json({
        slideIds: newSlides.map(s => s.id),
        demoMode: true
      }, { status: 201 });
    }

    const db = firestore();
    if (!db) {
      return NextResponse.json({ error: "Database not available" }, { status: 503 });
    }

    const slidesRef = collection(db, "projects", projectId, "slides");
    const slideIds: string[] = [];

    for (let i = 0; i < slides.length; i++) {
      const slide = slides[i];
      const docRef = await addDoc(slidesRef, {
        order: i,
        layout: slide.layout || "content",
        title: slide.title || "",
        bullets: slide.bullets || [],
        speakerNotes: slide.speakerNotes || null,
        imageAssetId: slide.imageAssetId || null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      slideIds.push(docRef.id);
    }

    return NextResponse.json({ slideIds }, { status: 201 });

  } catch (error) {
    console.error("Error creating slides:", error);
    return NextResponse.json(
      { error: "Failed to create slides" },
      { status: 500 }
    );
  }
}
