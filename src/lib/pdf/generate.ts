// PDF Generation utilities
// This module provides functions to generate PDF documents from slide content

export interface SlideData {
  id: string;
  order: number;
  layout: string;
  title: string;
  bullets: string[];
  speakerNotes?: string;
  imageAssetId?: string;
}

export interface ProjectData {
  id: string;
  title: string;
  topic: string;
  templateId: string;
}

// Generate HTML content for PDF
export function generateHTMLContent(
  project: ProjectData,
  slides: SlideData[],
  isFreeTier: boolean
): string {
  const theme = getThemeForTemplate(project.templateId);
  
  const slidesHTML = slides.map((slide) => `
    <div class="slide">
      <div class="slide-header" style="background: linear-gradient(135deg, ${theme.primary}, ${theme.secondary});">
        <h1 class="slide-title">${escapeHtml(slide.title)}</h1>
      </div>
      <div class="slide-content">
        <ul class="bullet-list">
          ${slide.bullets.map((bullet) => `<li>${escapeHtml(bullet)}</li>`).join('')}
        </ul>
      </div>
      ${slide.imageAssetId ? `<div class="slide-image-placeholder">[Image: ${slide.imageAssetId.substring(0, 10)}]</div>` : ''}
      ${slide.speakerNotes ? `<div class="speaker-notes">${escapeHtml(slide.speakerNotes)}</div>` : ''}
    </div>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${escapeHtml(project.title || project.topic)}</title>
      <style>
        @page {
          size: A4;
          margin: 0;
        }
        
        body {
          font-family: ${theme.fonts.body}, Arial, sans-serif;
          margin: 0;
          padding: 0;
          background: #f0f0f0;
        }
        
        .slide {
          width: 210mm;
          height: 297mm;
          page-break-after: always;
          background: ${theme.background};
          position: relative;
          overflow: hidden;
        }
        
        .slide:last-child {
          page-break-after: avoid;
        }
        
        .slide-header {
          height: 60mm;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 20mm;
        }
        
        .slide-title {
          color: white;
          font-family: ${theme.fonts.heading}, Arial, sans-serif;
          font-size: 36pt;
          text-align: center;
          margin: 0;
        }
        
        .slide-content {
          padding: 20mm 30mm;
        }
        
        .bullet-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .bullet-list li {
          font-size: 18pt;
          color: ${theme.text};
          padding: 8pt 0;
          padding-left: 20pt;
          position: relative;
        }
        
        .bullet-list li::before {
          content: "•";
          color: ${theme.primary};
          font-size: 24pt;
          position: absolute;
          left: 0;
          top: -4pt;
        }
        
        .slide-image-placeholder {
          position: absolute;
          bottom: 40mm;
          left: 30mm;
          right: 30mm;
          height: 60mm;
          border: 2px dashed #ccc;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #999;
          font-size: 14pt;
          background: #f9f9f9;
        }
        
        .speaker-notes {
          position: absolute;
          bottom: 10mm;
          left: 30mm;
          right: 30mm;
          font-size: 10pt;
          color: #666;
          font-style: italic;
        }
        
        .watermark {
          position: fixed;
          bottom: 10mm;
          left: 0;
          right: 0;
          text-align: center;
          font-size: 10pt;
          color: #999;
          z-index: 1000;
        }
        
        .title-slide {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          background: linear-gradient(135deg, ${theme.primary}, ${theme.secondary});
        }
        
        .title-slide .main-title {
          color: white;
          font-family: ${theme.fonts.heading}, Arial, sans-serif;
          font-size: 48pt;
          text-align: center;
          margin-bottom: 20mm;
        }
        
        .title-slide .subtitle {
          color: rgba(255, 255, 255, 0.9);
          font-size: 24pt;
        }
      </style>
    </head>
    <body>
      ${isFreeTier ? '<div class="watermark">Created with SlideRush AI</div>' : ''}
      
      <!-- Title Slide -->
      <div class="slide title-slide">
        <h1 class="main-title">${escapeHtml(project.title || project.topic)}</h1>
        <p class="subtitle">Created with SlideRush AI</p>
      </div>
      
      <!-- Content Slides -->
      ${slidesHTML}
    </body>
    </html>
  `;
}

// Helper function to escape HTML
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '<',
    '>': '>',
    '"': '"',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

// Get theme colors for template
function getThemeForTemplate(templateId: string) {
  const themes: Record<string, { primary: string; secondary: string; background: string; text: string; fonts: { heading: string; body: string } }> = {
    modern: {
      primary: "#2563EB",
      secondary: "#3B82F6",
      background: "#FFFFFF",
      text: "#1F2937",
      fonts: { heading: "Inter", body: "Inter" },
    },
    corporate: {
      primary: "#1E3A5F",
      secondary: "#F97316",
      background: "#FFFFFF",
      text: "#1F2937",
      fonts: { heading: "Arial", body: "Arial" },
    },
    creative: {
      primary: "#9333EA",
      secondary: "#EC4899",
      background: "#FAFAFA",
      text: "#1F2937",
      fonts: { heading: "Poppins", body: "Poppins" },
    },
    minimal: {
      primary: "#374151",
      secondary: "#6B7280",
      background: "#FFFFFF",
      text: "#1F2937",
      fonts: { heading: "Helvetica", body: "Helvetica" },
    },
  };
  
  return themes[templateId] || themes.modern;
}

// Generate print-friendly HTML (simpler alternative to puppeteer)
export function generatePrintHTML(
  project: ProjectData,
  slides: SlideData[],
  isFreeTier: boolean
): string {
  return generateHTMLContent(project, slides, isFreeTier);
}

