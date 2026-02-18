/**
 * Shared in-memory storage for demo mode.
 *
 * In demo mode (no Firebase configured), all API routes need to share
 * the same data maps. We attach them to globalThis so they persist
 * across module boundaries in the same Node.js process — different
 * Next.js route modules each import their own copy of module-level
 * variables, but globalThis is shared.
 */

import { firebaseAuth, firestore } from "@/lib/firebase/client";

/* eslint-disable @typescript-eslint/no-explicit-any */
interface DemoStore {
    projects: Map<string, any>;
    slides: Map<string, any[]>;
    slideCounters: Map<string, number>;
    projectCounter: number;
}

const STORE_KEY = "__sliderush_demo_store__";

function getStore(): DemoStore {
    const g = globalThis as any;
    if (!g[STORE_KEY]) {
        g[STORE_KEY] = {
            projects: new Map<string, any>(),
            slides: new Map<string, any[]>(),
            slideCounters: new Map<string, number>(),
            projectCounter: 1000,
        } satisfies DemoStore;
    }
    return g[STORE_KEY] as DemoStore;
}
/* eslint-enable @typescript-eslint/no-explicit-any */

/** Shared map of demo projects (projectId → project data) */
export const demoProjects = {
    get: (key: string) => getStore().projects.get(key),
    set: (key: string, value: unknown) => getStore().projects.set(key, value),
    has: (key: string) => getStore().projects.has(key),
    values: () => getStore().projects.values(),
    delete: (key: string) => getStore().projects.delete(key),
};

/** Shared map of demo slides (projectId → slide array) */
export const demoSlides = {
    get: (key: string) => getStore().slides.get(key),
    set: (key: string, value: unknown[]) => getStore().slides.set(key, value),
    has: (key: string) => getStore().slides.has(key),
    values: () => getStore().slides.values(),
    delete: (key: string) => getStore().slides.delete(key),
};

/** Shared map of demo slide counters */
export const demoSlideCounters = {
    get: (key: string) => getStore().slideCounters.get(key),
    set: (key: string, value: number) => getStore().slideCounters.set(key, value),
    has: (key: string) => getStore().slideCounters.has(key),
};

export function nextDemoProjectId(): string {
    const store = getStore();
    store.projectCounter += 1;
    return `demo-${store.projectCounter}`;
}

export function isDemoMode(): boolean {
    return !firestore() || !firebaseAuth();
}
