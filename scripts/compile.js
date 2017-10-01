#!/usr/bin/env node

/**
 * Script for Less compilation of my theme with uikit
 */

var fs = require('fs');
var less = require('less');
var path = require('path');

// Get root path
const pathRoot = path.join(__dirname, '../');

// Set input and output path
const inputPath = path.join(pathRoot, "src", "custom", "theme.less");
const outputPath = path.join(pathRoot, "public", "assets", "dist", "uikit", "css", "uikit-theme.css");

console.log(Object.keys(less))

// Read my less theme content  
fs.readFile(inputPath, 'utf-8', (err, input) => {
    handleError(err)

    // Processing the less input content to css
    less.render(input,(err, output) => {
    	handleError(err);

        // Write the css output to the file at outputPath
        fs.writeFile(outputPath, output.css, err => {
            handleError(err)

            console.log("Less compilation completed successfully.\n\t~ input: " + inputPath + "\n\t~ output: " + outputPath)
        });
    });
});

// Simple function to throw error if present
function handleError(err) {
    if (err) throw err;
}