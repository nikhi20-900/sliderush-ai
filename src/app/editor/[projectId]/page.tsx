"use client";

import { AuthGate } from "@/components/auth/auth-gate";
import { EditorShell } from "@/components/editor/editor-shell";
import { useEditorStore } from "@/store/editor.store";
import { useProjectsStore } from "@/store/projects.store";
import type { Project } from "@/types/project";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditorPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.projectId as string;
  
  const { project, setProject, slides, setSlides, selectedSlideId, selectSlide } = useEditorStore();
  const { upsertProject } = useProjectsStore();
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProject() {
      if (!projectId) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch project
        const projectRes = await fetch(`/api/projects/${projectId}`);
        if (!projectRes.ok) {
          throw new Error("Project not found");
        }
        const projectData = await projectRes.json();
        setProject(projectData as Project);
        upsertProject(projectData as Project);
        
        // Fetch slides
        const slidesRes = await fetch(`/api/projects/${projectId}/slides`);
        if (slidesRes.ok) {
          const slidesData = await slidesRes.json();
          setSlides(slidesData.slides || []);
          
          // Select first slide if none selected
          if (slidesData.slides?.length > 0 && !selectedSlideId) {
            selectSlide(slidesData.slides[0].id);
          }
        }
      } catch (err) {
        console.error("Error loading project:", err);
        setError(err instanceof Error ? err.message : "Failed to load project");
      } finally {
        setIsLoading(false);
      }
    }
    
    loadProject();
  }, [projectId, setProject, upsertProject, setSlides, selectSlide, selectedSlideId]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto" />
          <p className="mt-4 text-gray-600">Loading editor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => router.push("/dashboard")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-gray-600">Project not found</p>
          <button
            onClick={() => router.push("/dashboard")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <AuthGate>
      <EditorShell
        project={project}
        slides={slides}
        selectedSlideId={selectedSlideId}
        onSelectSlide={selectSlide}
      />
    </AuthGate>
  );
}

