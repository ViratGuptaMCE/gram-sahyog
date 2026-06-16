import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

export const performClientSideOCR = async (file, onProgress) => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    
    // Process up to 10 pages to match backend limits and prevent browser timeouts
    const numPages = Math.min(pdf.numPages, 10);
    let combinedText = "";

    const { createWorker } = await import('tesseract.js');
    // Initialize the worker with both English and Hindi support
    const worker = await createWorker('eng+hin');

    for (let i = 1; i <= numPages; i++) {
      if (onProgress) {
        onProgress(i, numPages);
      }
      
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 1.5 }); 
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      // Render the PDF page page to canvas context
      await page.render({
        canvasContext: context,
        viewport: viewport
      }).promise;

      // Run OCR recognition on the page image canvas
      const { data: { text } } = await worker.recognize(canvas);
      combinedText += text + "\n";
    }

    await worker.terminate();
    return combinedText;
  } catch (error) {
    console.error("Client-side OCR processing failed:", error);
    throw error;
  }
};
