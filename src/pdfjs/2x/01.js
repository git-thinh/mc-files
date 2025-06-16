const { serve } = require('@hono/node-server')
const { Hono } = require('hono');

const fs = require("fs");
const util = require("util");
const path = require("path");
const stream = require("stream");

// HACK few hacks to let PDF.js be loaded not as a module in global space.
require("./domstubs.js").setStubs(global);

const pdfjsLib = require("./legacy/pdf.js");


// Some PDFs need external cmaps.
const CMAP_URL = "./legacy/web/cmaps/";
const CMAP_PACKED = true;

const genSvg = async (bytes) => {
    let svg = '';
    const doc = await pdfjsLib.getDocument({
        data: bytes,
        cMapUrl: CMAP_URL,
        cMapPacked: CMAP_PACKED,
        fontExtraProperties: true,
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

//var pdfPath = `c:/_test/pdf/Testing.pdf`;
//var data = new Uint8Array(fs.readFileSync(pdfPath));
//(async function () { await genSvg(data); })();

//////////////////////////////////////////////////////////////////////////////
const app = new Hono()
app.get('/', (c) => c.json({ isSuccess: true }));

app.post('/test', async (c) => {
    const body = await c.req.parseBody();
    const blob = body['file'];
    if (blob) {
        let buf = Buffer.from(await blob.arrayBuffer());
        const bytes = new Uint8Array(buf);
        let s = '';

        try {
            s = await genSvg(bytes);
        } catch (e) { }

        //c.header('Content-Type', 'application/svg+xml');
        //return c.text(s);
        return new Response(s, {
            headers: { 'Content-Type': 'application/svg+xml' }
        })
    }
    return c.json({ isSuccess: true });
})

//app.get('/*.pdf', (c) => {
//    let file = `./files` + c.req.path;
//    let bytes = new Uint8Array(fs.readFileSync(file));
//    c.header('Content-Type', 'application/octet-stream');
//    return stream(c, async (stream) => {
//        stream.onAbort(() => console.log('Aborted!'))
//        await stream.write(bytes)
//    })
//})
//app.get('/proxy', cache({ cacheName: 'foo' }),
//    async (c) => {
//        const targetUrl = 'https://raw.githubusercontent.com/honojs/hono/main/docs/images/hono-logo.png'
//        const response = await fetch(targetUrl)
//        c.status(response.status as StatusCode)
//        c.header('Content-Type', response.headers.get('Content-Type') || 'application/octet-stream')
//        return c.body(response.body)
//    })

serve({ fetch: app.fetch, port: 5050, });