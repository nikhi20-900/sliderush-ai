"use client";

import { Button } from "@/components/ui/button";
import type { ProjectTheme } from "@/types/project";
import type { Slide } from "@/types/slide";
import { ImageIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface SlideCanvasProps {
  slide: Slide | null;
  templateId: string;
  theme?: ProjectTheme;
}

// Template color schemes
const TEMPLATES: Record<string, { colors: { primary: string; secondary: string; background: string; text: string }; fonts: { heading: string; body: string } }> = {
  "modern-minimal": {
    colors: { primary: "#2563eb", secondary: "#3b82f6", background: "#ffffff", text: "#1e293b" },
    fonts: { heading: "Inter", body: "Inter" },
  },
  "bold-corporate": {
    colors: { primary: "#1e3a5f", secondary: "#f97316", background: "#ffffff", text: "#1e293b" },
    fonts: { heading: "Roboto", body: "Roboto" },
  },
  "creative-gradient": {
    colors: { primary: "#7c3aed", secondary: "#ec4899", background: "#ffffff", text: "#1e293b" },
    fonts: { heading: "Poppins", body: "Poppins" },
  },
  "classic-professional": {
    colors: { primary: "#000000", secondary: "#4b5563", background: "#ffffff", text: "#000000" },
    fonts: { heading: "Merriweather", body: "Merriweather" },
  },
  "tech-startup": {
    colors: { primary: "#00d4aa", secondary: "#0ea5e9", background: "#0f172a", text: "#f1f5f9" },
    fonts: { heading: "Space Grotesk", body: "Inter" },
  },
};

export function SlideCanvas({ slide, templateId, theme }: SlideCanvasProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedBullets, setEditedBullets] = useState<string[]>([]);
  
  const template = TEMPLATES[templateId] || TEMPLATES["modern-minimal"];
  const colors = theme?.colorScheme ? JSON.parse(theme.colorScheme) : template.colors;
  const fonts = theme?.fontPairing ? JSON.parse(theme.fontPairing) : template.fonts;

  useEffect(() => {
    if (slide) {
      setEditedTitle(slide.title);
      setEditedBullets([...slide.bullets]);
    }
  }, [slide]);

  if (!slide) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-200 rounded-lg">
        <p className="text-gray-500">Select a slide to edit</p>
      </div>
    );
  }

  const handleSave = async () => {
    // Save changes to API
    try {
      await fetch(`/api/projects/${slide.projectId}/slides/${slide.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editedTitle,
          bullets: editedBullets,
        }),
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving slide:", error);
    }
  };

  const handleCancel = () => {
    setEditedTitle(slide.title);
    setEditedBullets([...slide.bullets]);
    setIsEditing(false);
  };

  const addBullet = () => {
    setEditedBullets([...editedBullets, ""]);
  };

  const updateBullet = (index: number, value: string) => {
    const newBullets = [...editedBullets];
    newBullets[index] = value;
    setEditedBullets(newBullets);
  };

  const removeBullet = (index: number) => {
    setEditedBullets(editedBullets.filter((_, i) => i !== index));
  };

  // Render different layouts based on slide.layout
  const renderLayout = () => {
    switch (slide.layout) {
      case "title":
        return (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-8">
            {isEditing ? (
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="text-4xl font-bold text-center bg-transparent border-b-2 border-dashed border-gray-300 focus:border-blue-500 outline-none"
                style={{ color: colors.text, fontFamily: fonts.heading }}
              />
            ) : (
              <h1
                className="text-4xl font-bold cursor-pointer hover:opacity-80"
                onClick={() => setIsEditing(true)}
                style={{ color: colors.text, fontFamily: fonts.heading }}
              >
                {slide.title}
              </h1>
            )}
            <div className="flex items-center gap-4">
              {slide.imageAssetId && (
                <div className="w-64 h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-gray-400" />
                </div>
              )}
            </div>
          </div>
        );

      case "agenda":
      case "content_image_left":
      case "content_image_right":
      case "two_column":
      case "timeline":
      case "summary":
      default:
        return (
          <div className="flex flex-col h-full space-y-6">
            {/* Title */}
            {isEditing ? (
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="text-3xl font-bold bg-transparent border-b-2 border-dashed border-gray-300 focus:border-blue-500 outline-none"
                style={{ color: colors.text, fontFamily: fonts.heading }}
              />
            ) : (
              <h2
                className="text-3xl font-bold cursor-pointer hover:opacity-80"
                onClick={() => setIsEditing(true)}
                style={{ color: colors.text, fontFamily: fonts.heading }}
              >
                {slide.title}
              </h2>
            )}

            {/* Image if present */}
            {slide.imageAssetId && (
              <div className="flex-shrink-0 h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                <ImageIcon className="w-8 h-8 text-gray-400" />
              </div>
            )}

            {/* Bullets */}
            <div className="flex-1 space-y-3">
              {editedBullets.map((bullet, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div
                    className="w-2 h-2 mt-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: colors.primary }}
                  />
                  {isEditing ? (
                    <input
                      type="text"
                      value={bullet}
                      onChange={(e) => updateBullet(index, e.target.value)}
                      className="flex-1 bg-transparent border-b border-gray-200 focus:border-blue-500 outline-none"
                      style={{ color: colors.text, fontFamily: fonts.body }}
                    />
                  ) : (
                    <p
                      className="flex-1 cursor-pointer hover:opacity-80"
                      onClick={() => setIsEditing(true)}
                      style={{ color: colors.text, fontFamily: fonts.body }}
                    >
                      {bullet}
                    </p>
                  )}
                  {isEditing && (
                    <button
                      onClick={() => removeBullet(index)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Add bullet button */}
            {isEditing && (
              <button
                onClick={addBullet}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                + Add bullet point
              </button>
            )}
          </div>
        );
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Slide Preview Container */}
      <div
        className="flex-1 bg-white rounded-lg shadow-lg p-8 overflow-hidden"
        style={{
          backgroundColor: colors.background,
          aspectRatio: "16/9",
        }}
      >
        {renderLayout()}
      </div>

      {/* Edit Controls */}
      {isEditing && (
        <div className="flex items-center justify-end gap-2 mt-4 p-4 bg-white rounded-lg shadow">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      )}
    </div>
  );
}

