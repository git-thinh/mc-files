
# [1]. convert the pdf.worker.min.js content to a json, you can use the following command as an example.

cd src/
node -e "const fs = require('fs'); fs.writeFileSync('pdf.worker.min.json', JSON.stringify(fs.readFileSync('../node_modules/pdfjs-dist/build/pdf.worker.min.js', 'utf-8')))"

# [2] import the pdf.worker.min.json content, which is a string, then build a blob on it, supply the blob object url to workerSrc.

import workerContent from "./pdf.worker.min.json";
var workerBlob = new Blob([workerContent],{type : 'text/javascript'});
var workerBlobURL = URL.createObjectURL(workerBlob);
pdfjsLib.GlobalWorkerOptions.workerSrc = workerBlobURL;