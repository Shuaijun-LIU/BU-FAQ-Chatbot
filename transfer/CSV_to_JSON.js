const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

// Set the directory where the files are located (one level up)
const dataDir = path.join(__dirname, '../data');

// Define the path for the CSV file and the output JSON file
const csvFilePath = path.join(dataDir, 'BU_MET_FAQs.csv');
const jsonFilePath = path.join(dataDir, 'BU_MET_FAQs.json');

// Check if the JSON file already exists and delete it if it does
if (fs.existsSync(jsonFilePath)) {
    fs.unlinkSync(jsonFilePath);  // Delete the existing file
    console.log('Existing BU_MET_FAQs.json file deleted.');
}

// Array to hold CSV data
const results = [];

// Read the CSV file and convert it to JSON
fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', (data) => {
        // Directly push the data without altering the 'answer' field
        results.push(data);
    })
    .on('end', () => {
        // Write the JSON file
        fs.writeFileSync(jsonFilePath, JSON.stringify(results, null, 4), 'utf8');
        console.log('JSON file successfully created:', jsonFilePath);
    });