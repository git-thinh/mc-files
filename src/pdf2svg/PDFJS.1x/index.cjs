/*
* ONLY CONVERT FILE PDF DRAW VECTER (draw paths)
*/

// HACK few hacks to let PDF.js be loaded not as a module in global space.
global.window = global;
global.navigator = { userAgent: 'node' };
global.PDFJS = {};

PDFJS.workerSrc = true;
//PDFJS.disableWorker = true;
//PDFJS.verbosity = 0;

require('./pdf.combined.1.0.693.cjs');
require('./domstubs.cjs');

module.exports = function (bytes) {
    return PDFJS.getDocument({ data: bytes }).then(function (doc) {
        var numPages = doc.numPages;
        //console.log('numPages =', numPages);

        return doc.getPage(1).then(function (page) {
            var viewport = page.getViewport(1.0);
            return page.getOperatorList().then(function (opList) {
                //console.log('opList =', opList);
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
