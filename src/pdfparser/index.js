import fs from "fs";
import PDFParser from "./pdfparser.cjs";

const pdfParser = new PDFParser();

export default function (file) {
    return new Promise((ret, jet) => {

        pdfParser.on("pdfParser_dataError", (errData) =>
            //console.error(errData.parserError)
            ret({ error: errData.parserError })
        );

        pdfParser.on("pdfParser_dataReady", (pdfData) => {
            ret(pdfData)
        });

        pdfParser.loadPDF(file);
    })
}
