// Ex: node parse-cmd.js samples/pta_10229_131308_94274.pdf

var fs = require('fs');
Image = function () { };

// HACK few hacks to let PDF.js be loaded not as a module in global space.
require('./pdf.js/examples/node/domstubs.js');
require('./pdf-table-extractor.js');

// Run `gulp dist` to generate 'pdfjs-dist' npm package files.
PDFJS = require('./pdf.js/build/generic/build/pdf.js');
PDFJS.cMapUrl = './pdf.js/build/generic/web/cmaps/';
PDFJS.cMapPacked = true;


// Parse the format
var parse_format = require("./parse_format.js");


// Loading file from file system into typed array
var pdfPath = process.argv[2];
var data = new Uint8Array(fs.readFileSync(pdfPath));        // a Buffer


// Will be using promises to load document, pages and misc data instead of callback.
PDFJS.getDocument(data).promise.then(pdf_table_extractor).then(function (result) {
    // Parse the result into right formats
    var {jsonResult, htmlResult, csvResult} = parse_format.parse_format(result)
    
    // Write into files
    fs.writeFileSync('outputs/output.json', jsonResult);
    fs.writeFileSync('outputs/output.html', htmlResult);
    fs.writeFileSync('outputs/output.csv', csvResult);
}, function (err) {
    console.error('Error: ' + err, err.stack);
});




