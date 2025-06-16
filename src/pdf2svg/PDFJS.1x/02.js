const { serve } = require('@hono/node-server')
const { Hono } = require('hono');
const fs = require('fs');

// HACK few hacks to let PDF.js be loaded not as a module in global space.
global.window = global;
global.navigator = { userAgent: 'node' };
global.PDFJS = {};
PDFJS.verbosity = 0;
PDFJS.workerSrc = true;
//PDFJS.disableWorker = true;

require('./pdf.combined.1.0.693.js');
require('./domstubs.js');

const genSvg = (bytes) => {
    return PDFJS.getDocument({ data: bytes }).then(function (doc) {
        var numPages = doc.numPages;
        return doc.getPage(1).then(function (page) {
            var viewport = page.getViewport(1.0);
            return page.getOperatorList().then(function (opList) {
                var svgGfx = new PDFJS.SVGGraphics(page.commonObjs, page.objs);
                svgGfx.embedFonts = true;
                return svgGfx.getSVG(opList, viewport).then(function (svg) {
                    var s = svg.toString();
                    //writeToFile(svgDump, pageNum);
                    return s;
                });
            });
        })
    })
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