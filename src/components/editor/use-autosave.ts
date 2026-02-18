"use client";

import { useEffect, useRef, useCallback } from "react";
import { useEditorStore } from "@/store/editor.store";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { firestore } from "@/lib/firebase/client";

const AUTOSAVE_DELAY_MS = 2000; // 2 seconds debounce

/**
 * Hook that watches the editor store's dirty flag and auto-saves
 * slide changes to Firestore with a debounced delay.
 */
export function useAutosave() {
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isMountedRef = useRef(true);

    const project = useEditorStore((s) => s.project);
    const slides = useEditorStore((s) => s.slides);
    const isDirty = useEditorStore((s) => s.isDirty);
    const setSaveStatus = useEditorStore((s) => s.setSaveStatus);
    const markSaved = useEditorStore((s) => s.markSaved);

    const saveSlides = useCallback(async () => {
        const db = firestore();
        if (!db || !project) return;

        setSaveStatus("saving");

        try {
            // Save each slide that exists
            const savePromises = slides.map((slide) => {
                const slideRef = doc(db, "projects", project.id, "slides", slide.id);
                return updateDoc(slideRef, {
                    title: slide.title,
                    bullets: slide.bullets,
                    speakerNotes: slide.speakerNotes,
                    order: slide.order,
                    layout: slide.layout,
                    updatedAt: serverTimestamp(),
                }).catch((err) => {
                    // If slide doesn't exist yet (newly added), we'd need setDoc.
                    // For now, log and continue — the addSlide API route handles creation.
                    console.warn(`Failed to save slide ${slide.id}:`, err);
                });
            });

            await Promise.all(savePromises);

            // Update project's updatedAt
            const projectRef = doc(db, "projects", project.id);
            await updateDoc(projectRef, { updatedAt: serverTimestamp() });

            if (isMountedRef.current) {
                markSaved();

                // Reset to "idle" after 3s so indicator fades
                setTimeout(() => {
                    if (isMountedRef.current) {
                        setSaveStatus("idle");
                    }
                }, 3000);
            }
        } catch (err) {
            console.error("Autosave failed:", err);
            if (isMountedRef.current) {
                setSaveStatus("error");
            }
        }
    }, [project, slides, setSaveStatus, markSaved]);

    // Watch dirty flag and trigger debounced save
    useEffect(() => {
        if (!isDirty) return;

        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        timerRef.current = setTimeout(() => {
            saveSlides();
        }, AUTOSAVE_DELAY_MS);

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [isDirty, slides, saveSlides]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            isMountedRef.current = false;
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, []);

    // Force save (for manual "Save" button)
    const forceSave = useCallback(() => {
        if (timerRef.current) clearTimeout(timerRef.current);
        saveSlides();
    }, [saveSlides]);

    return { forceSave };
}
