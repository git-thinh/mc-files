//import fs from "fs";

import Canvas from "../canvas/index.cjs";
import * as pdfjsLib from "./pdf.min.mjs";

class NodeCanvasFactory {
    create(width, height) {
        //assert(width > 0 && height > 0, "Invalid canvas size");
        const canvas = Canvas.createCanvas(width, height);
        const context = canvas.getContext("2d");
        return {
            canvas,
            context,
        };
    }

    reset(canvasAndContext, width, height) {
        //assert(canvasAndContext.canvas, "Canvas is not specified");
        //assert(width > 0 && height > 0, "Invalid canvas size");
        canvasAndContext.canvas.width = width;
        canvasAndContext.canvas.height = height;
    }

    destroy(canvasAndContext) {
        //assert(canvasAndContext.canvas, "Canvas is not specified");

        // Zeroing the width and height cause Firefox to release graphics
        // resources immediately, which can greatly reduce memory consumption.
        canvasAndContext.canvas.width = 0;
        canvasAndContext.canvas.height = 0;
        canvasAndContext.canvas = null;
        canvasAndContext.context = null;
    }
}

// Set the path to the worker script
//pdfjsLib.GlobalWorkerOptions.workerSrc = './pdf.worker.min.mjs';

// Some PDFs need external cmaps.
const CMAP_URL = "./cmaps/";
const CMAP_PACKED = true;

// Where the standard fonts are located.
const STANDARD_FONT_DATA_URL = "./standard_fonts/";

const canvasFactory = new NodeCanvasFactory();

// Loading file from file system into typed array.
//const pdfPath = `D:/mc-files/pdf/vector-01.pdf`;
//const pdfPath = `C:/_test/pdf/LS4614_KolindAuto_LPA.pdf`;
//`C:/_test/pdf/_boxs.pdf`;
//process.argv[2] || "../../../web/compressed.tracemonkey-pldi-09.pdf";
//const bytes = new Uint8Array(fs.readFileSync(pdfPath));

export default async function (bytes) {
    // Load the PDF file.
    const loadingTask = pdfjsLib.getDocument({
        data: bytes,
        cMapUrl: CMAP_URL,
        cMapPacked: CMAP_PACKED,
        standardFontDataUrl: STANDARD_FONT_DATA_URL,
        canvasFactory,
    });

    try {
        const pdfDocument = await loadingTask.promise;
        console.log("# PDF document loaded.");
        // Get the first page.
        const page = await pdfDocument.getPage(1);
        // Render the page on a Node canvas with 100% scale.
        const viewport = page.getViewport({ scale: 1.0 });
        const canvasAndContext = canvasFactory.create(
            viewport.width,
            viewport.height
        );
        const renderContext = {
            canvasContext: canvasAndContext.context,
            viewport,
            // Use transparent background!
            background: 'rgba(0,0,0,0)',
        };

        const renderTask = page.render(renderContext);
        await renderTask.promise;

        // Convert the canvas to an image buffer.
        const buf = canvasAndContext.canvas.toBuffer();
        //fs.writeFile("output.png", buf, function (error) {
        //    if (error) {
        //        console.error("Error: " + error);
        //    } else {
        //        console.log("Finished converting first page of PDF file to a PNG image.");
        //    }
        //});

        // Release page resources.
        page.cleanup();

        return buf;
    } catch (reason) {
        console.log(reason);
    }

    return null;
};