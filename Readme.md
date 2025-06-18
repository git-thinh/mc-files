

- https://github.com/ffalt/pdf.js-extract

# pdf-lib
// Create and manipulate your PDF document
var pdfDoc = await PDFDocument.create() // or `PDFDocument.load(...)`
...

// Read the PDF file into a typed array so PDF.js can load it.
var rawData = await pdfDoc.save()