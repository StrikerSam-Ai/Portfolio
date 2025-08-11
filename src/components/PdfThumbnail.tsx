import React, { useEffect, useState } from 'react';
import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist';
import type { PDFDocumentProxy, PDFPageProxy, RenderTask } from 'pdfjs-dist';
// Vite: import worker as URL so pdf.js can load it
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - pdfjs-dist provides this asset, Vite handles ?url imports
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

GlobalWorkerOptions.workerSrc = pdfjsWorker as string;

interface PdfThumbnailProps {
  pdfUrl: string;
  width?: number; // desired CSS width of the thumbnail in pixels
  pageNumber?: number;
  alt?: string;
  className?: string;
}

const PdfThumbnail: React.FC<PdfThumbnailProps> = ({
  pdfUrl,
  width = 420,
  pageNumber = 1,
  alt = 'PDF thumbnail',
  className
}) => {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;
    let renderTask: RenderTask | null = null;
    let pdfDoc: PDFDocumentProxy | null = null;

    const render = async () => {
      try {
        setError(null);
        setDataUrl(null);

        const loadingTask = getDocument({ url: pdfUrl });
        pdfDoc = await loadingTask.promise;
        const page: PDFPageProxy = await pdfDoc.getPage(pageNumber);

        const unscaledViewport = page.getViewport({ scale: 1 });
        const targetWidth = width;
        const scale = targetWidth / unscaledViewport.width;
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) {
          throw new Error('Canvas 2D context not available');
        }

        // Improve clarity on high-DPI screens
        const devicePixelRatio = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.floor(viewport.width * devicePixelRatio);
        canvas.height = Math.floor(viewport.height * devicePixelRatio);
        canvas.style.width = `${Math.floor(viewport.width)}px`;
        canvas.style.height = `${Math.floor(viewport.height)}px`;
        context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);

        renderTask = page.render({ canvasContext: context, viewport });
        await renderTask.promise;

        if (!isCancelled) {
          const url = canvas.toDataURL('image/png');
          setDataUrl(url);
        }
      } catch (err) {
        if (!isCancelled) {
          setError((err as Error)?.message || 'Failed to render PDF');
        }
      } finally {
        try {
          if (renderTask) {
            // no-op: renderTask finished
          }
          if (pdfDoc) {
            await pdfDoc.destroy();
          }
        } catch {
          // ignore
        }
      }
    };

    render();

    return () => {
      isCancelled = true;
      try {
        if (renderTask) {
          renderTask.cancel();
        }
        if (pdfDoc) {
          void pdfDoc.destroy();
        }
      } catch {
        // ignore
      }
    };
  }, [pdfUrl, pageNumber, width]);

  if (error) {
    return (
      // Fallback to a generic certificate icon if rendering fails
      // Keeping an <img> to preserve layout expectations
      <img
        src={'https://img.icons8.com/color/96/000000/certificate.png'}
        alt={alt}
        className={className}
        loading="lazy"
      />
    );
  }

  if (!dataUrl) {
    // Skeleton placeholder while rendering
    return (
      <div
        className={className}
        style={{
          width: `${width}px`,
          aspectRatio: '1.414', // approx A-series paper ratio (sqrt(2))
          background: 'var(--skeleton-bg, #f3f4f6)'
        }}
      />
    );
  }

  return <img src={dataUrl} alt={alt} className={className} loading="lazy" />;
};

export default PdfThumbnail;


