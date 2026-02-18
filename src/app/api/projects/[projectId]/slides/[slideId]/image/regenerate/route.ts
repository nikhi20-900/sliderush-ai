import { NextResponse } from "next/server";
import { firebaseAuth, firestore } from "@/lib/firebase/client";
import { canAccessFeature } from "@/lib/features/gating";
import { incrementUsage } from "@/lib/usage/quota";
import { searchPhotos } from "@/lib/unsplash/client";
import { doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";

export async function POST(
    request: Request,
    { params }: { params: Promise<{ projectId: string; slideId: string }> }
) {
    try {
        const { projectId, slideId } = await params;
        const auth = firebaseAuth();
        const user = auth?.currentUser;

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Check feature access (Ultra plan required)
        const hasAccess = await canAccessFeature(user.uid, "image_regen");
        if (!hasAccess) {
            return NextResponse.json({
                error: "Image regeneration requires an Ultra plan.",
                upgradeRequired: true,
                feature: "image_regen",
            }, { status: 403 });
        }

        const body = await request.json();
        const { query: imageQuery } = body;

        if (!imageQuery || typeof imageQuery !== "string") {
            return NextResponse.json({ error: "imageQuery is required" }, { status: 400 });
        }

        const db = firestore();
        if (!db) {
            return NextResponse.json({ error: "Database not available" }, { status: 503 });
        }

        // Verify project ownership
        const projectRef = doc(db, "projects", projectId);
        const projectSnap = await getDoc(projectRef);
        if (!projectSnap.exists() || projectSnap.data().userId !== user.uid) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        // Verify slide exists
        const slideRef = doc(db, "projects", projectId, "slides", slideId);
        const slideSnap = await getDoc(slideRef);
        if (!slideSnap.exists()) {
            return NextResponse.json({ error: "Slide not found" }, { status: 404 });
        }

        // Search Unsplash for new images
        const searchResult = await searchPhotos(imageQuery, {
            perPage: 6,
            orientation: "landscape",
        });

        if (!searchResult.results || searchResult.results.length === 0) {
            return NextResponse.json({
                error: "No images found for the given query. Try a different search term.",
            }, { status: 404 });
        }

        // Return the top result applied, plus alternatives
        const topImage = searchResult.results[0];
        const alternatives = searchResult.results.slice(1);

        // Update slide with new image
        await updateDoc(slideRef, {
            imageUrl: topImage.urls.regular,
            imageQuery: imageQuery,
            imageAttribution: {
                provider: "unsplash",
                authorName: topImage.user.name,
                authorUrl: topImage.user.links.html,
                photoUrl: topImage.links.download,
            },
            updatedAt: serverTimestamp(),
        });

        // Track usage
        try {
            await incrementUsage(user.uid, "imageRegens", {
                projectId,
                slideId,
                query: imageQuery,
            });
        } catch (usageErr) {
            console.error("Failed to track image regen usage:", usageErr);
        }

        return NextResponse.json({
            success: true,
            image: {
                url: topImage.urls.regular,
                thumbUrl: topImage.urls.small,
                attribution: `Photo by ${topImage.user.name} on Unsplash`,
            },
            alternatives: alternatives.map((photo) => ({
                id: photo.id,
                url: photo.urls.regular,
                thumbUrl: photo.urls.small,
                attribution: `Photo by ${photo.user.name} on Unsplash`,
            })),
        });

    } catch (error) {
        console.error("Error regenerating image:", error);
        return NextResponse.json(
            { error: "Failed to regenerate image" },
            { status: 500 }
        );
    }
}
