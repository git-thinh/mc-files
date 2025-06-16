/*
* APPLY FOR ALL TYPE IMAGES: VECTOR SVG, PNG, JPG ...
* 
*/

// HACK few hacks to let PDF.js be loaded not as a module in global space.
require("./domstubs.cjs").setStubs(global);
globalThis.DOMMatrix = require("./dommatrix.js");

//const pdfjsLib = require("./legacy/pdf.js");
//const CMAP_URL = "./legacy/web/cmaps/";
//const CMAP_PACKED = true;

const pdfjsLib = require("./js/pdf.js");

module.exports = async function (bytes) {
    let svg = '';
    const doc = await pdfjsLib.getDocument({
        data: bytes,

        //cMapUrl: CMAP_URL,
        //cMapPacked: CMAP_PACKED,

        // [ FOR ALL PDF VECTOR AMD OTHER(TEXT, PNG, ...) ]
        fontExtraProperties: true,

        // [ ONLY FOR PDF VECTOR IMAGE ]
        //fontExtraProperties: false,
    }).promise;

    const numPages = doc.numPages;
    console.log(`Number of Pages = ${numPages}`);
    const pageNum = 1;

    try {
        const page = await doc.getPage(pageNum);
        //console.log(`# Page ${pageNum}`);
        const viewport = page.getViewport({
            scale: 1.0
        });
        //console.log(`Size: ${viewport.width}x${viewport.height}`);
        //console.log();

        const opList = await page.getOperatorList();
        const svgGfx = new pdfjsLib.SVGGraphics(
            page.commonObjs,
            page.objs,
            /* forceDataSchema = */
            true
        );
        svgGfx.embedFonts = true;

        svg = await svgGfx.getSVG(opList, viewport);
        //await writeSvgToFile(svg, getFilePathForPage(pageNum));
        // Release page resources.
        page.cleanup();

    } catch (err) {
        console.log(`Error: ${err}`);
    }
    return svg;
};
