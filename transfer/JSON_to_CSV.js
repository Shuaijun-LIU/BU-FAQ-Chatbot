const fs = require('fs');
const path = require('path');
const { Parser } = require('json2csv');

// Set the directory where the files are located (one level up)
const dataDir = path.join(__dirname, '../data');

// Read the JSON file from the data directory
const jsonFilePath = path.join(dataDir, 'BU_MET_FAQs.json');
const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));

// Define the fields to be converted
const fields = ['module', 'question', 'answer'];
const opts = { fields };

// Function to convert Markdown links to HTML links
function convertMarkdownToHtml(text) {
    return text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
}

// Convert JSON data
jsonData.forEach(entry => {
    entry.answer = convertMarkdownToHtml(entry.answer);
});

// Define the path for the CSV file in the data directory
const csvFilePath = path.join(dataDir, 'BU_MET_FAQs.csv');

// Check if the CSV file already exists and delete it if it does
if (fs.existsSync(csvFilePath)) {
    fs.unlinkSync(csvFilePath);  // Delete the existing file
    console.log('Existing BU_MET_FAQs.csv file deleted.');
}

// Use json2csv to convert JSON to CSV
try {
    const parser = new Parser(opts);
    const csv = parser.parse(jsonData);

    // Write the CSV to a file in the data directory
    fs.writeFileSync(csvFilePath, csv, 'utf8');
    console.log('CSV file successfully created:', csvFilePath);
} catch (err) {
    console.error('Error generating CSV file:', err);
}