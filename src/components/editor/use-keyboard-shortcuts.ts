"use client";

import { useEffect } from "react";

interface KeyboardShortcut {
    key: string;
    ctrl?: boolean;
    meta?: boolean; // Cmd on Mac
    shift?: boolean;
    handler: () => void;
    description: string;
}

/**
 * Hook for editor keyboard shortcuts.
 * Supports Ctrl/Cmd modifiers for cross-platform compatibility.
 */
export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Don't trigger shortcuts when typing in inputs
            const target = e.target as HTMLElement;
            if (
                target.tagName === "INPUT" ||
                target.tagName === "TEXTAREA" ||
                target.isContentEditable
            ) {
                // Still allow Ctrl+S and Ctrl+E in inputs
                const isSpecialShortcut = (e.ctrlKey || e.metaKey) && (e.key === "s" || e.key === "e");
                if (!isSpecialShortcut) return;
            }

            for (const shortcut of shortcuts) {
                const ctrlOrMeta = shortcut.ctrl || shortcut.meta;
                const hasModifier = ctrlOrMeta ? (e.ctrlKey || e.metaKey) : true;
                const hasShift = shortcut.shift ? e.shiftKey : !e.shiftKey;
                const keyMatch = e.key.toLowerCase() === shortcut.key.toLowerCase();

                if (keyMatch && hasModifier && hasShift) {
                    e.preventDefault();
                    shortcut.handler();
                    return;
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [shortcuts]);
}

/**
 * Default editor shortcuts creator.
 * Pass in handlers for common actions.
 */
export function createEditorShortcuts(handlers: {
    onSave: () => void;
    onExport?: () => void;
    onUndo?: () => void;
    onRedo?: () => void;
    onDelete?: () => void;
    onDuplicate?: () => void;
}): KeyboardShortcut[] {
    const shortcuts: KeyboardShortcut[] = [
        {
            key: "s",
            ctrl: true,
            handler: handlers.onSave,
            description: "Save",
        },
    ];

    if (handlers.onExport) {
        shortcuts.push({
            key: "e",
            ctrl: true,
            handler: handlers.onExport,
            description: "Export",
        });
    }

    if (handlers.onUndo) {
        shortcuts.push({
            key: "z",
            ctrl: true,
            handler: handlers.onUndo,
            description: "Undo",
        });
    }

    if (handlers.onRedo) {
        shortcuts.push({
            key: "z",
            ctrl: true,
            shift: true,
            handler: handlers.onRedo,
            description: "Redo",
        });
    }

    if (handlers.onDelete) {
        shortcuts.push({
            key: "Delete",
            handler: handlers.onDelete,
            description: "Delete slide",
        });
    }

    if (handlers.onDuplicate) {
        shortcuts.push({
            key: "d",
            ctrl: true,
            handler: handlers.onDuplicate,
            description: "Duplicate slide",
        });
    }

    return shortcuts;
}
