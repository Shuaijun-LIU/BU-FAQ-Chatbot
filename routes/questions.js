const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { exec } = require('child_process');
const archiver = require('archiver');
const router = express.Router();

const upload = multer({ dest: 'uploads/' });
const jsonFilePath = path.join(__dirname, '../data/BU_MET_FAQs.json');

// Read JSON
router.get('/', (req, res) => {
    fs.readFile(jsonFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            res.status(500).send({ error: 'Failed to read questions data' });
            return;
        }
        const questions = JSON.parse(data);
        res.send(questions);
    });
});

// Return answers
router.post('/ask', (req, res) => {
    const userQuestion = req.body.question.toLowerCase();
    
    fs.readFile(jsonFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            res.status(500).send({ error: 'Failed to read questions data' });
            return;
        }

        const questions = JSON.parse(data);
        for (let item of questions) {
            if (item.question.toLowerCase() === userQuestion) {
                res.send({ answer: item.answer });
                return;
            }
        }

        res.status(404).send({ error: 'Question not found' });
    });
});

// Function to run JSON to CSV script
function runJsonToCsvScript() {
    exec(`node ${path.join(__dirname, '../transfer/JSON_to_CSV.js')}`, (err, stdout, stderr) => {
        if (err) {
            console.error('Error executing JSON to CSV script:', err);
            console.error(stderr);
            return;
        }
        console.log(stdout);
    });
}

// Add new FAQ
router.post('/', (req, res) => {
    const newFAQ = req.body;
    
    fs.readFile(jsonFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            res.status(500).send({ error: 'Failed to read questions data' });
            return;
        }

        const questions = JSON.parse(data);
        questions.push(newFAQ);

        fs.writeFile(jsonFilePath, JSON.stringify(questions, null, 2), (err) => {
            if (err) {
                console.error('Error writing file:', err);
                res.status(500).send({ error: 'Failed to save the new FAQ' });
                return;
            }

            // Run the JSON to CSV script
            runJsonToCsvScript();

            res.status(201).send(newFAQ);
        });
    });
});

// Update FAQ
router.put('/:index', (req, res) => {
    const index = req.params.index;
    const updatedFAQ = req.body;

    fs.readFile(jsonFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            res.status(500).send({ error: 'Failed to read questions data' });
            return;
        }

        const questions = JSON.parse(data);

        if (index >= 0 && index < questions.length) {
            questions[index] = updatedFAQ;

            fs.writeFile(jsonFilePath, JSON.stringify(questions, null, 2), (err) => {
                if (err) {
                    console.error('Error writing file:', err);
                    res.status(500).send({ error: 'Failed to update the FAQ' });
                    return;
                }

                // Run the JSON to CSV script
                runJsonToCsvScript();

                res.send(updatedFAQ);
            });
        } else {
            res.status(404).send({ error: 'FAQ not found' });
        }
    });
});

// Delete FAQ
router.delete('/:index', (req, res) => {
    const index = req.params.index;

    fs.readFile(jsonFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            res.status(500).send({ error: 'Failed to read questions data' });
            return;
        }

        const questions = JSON.parse(data);

        if (index >= 0 && index < questions.length) {
            questions.splice(index, 1);

            fs.writeFile(jsonFilePath, JSON.stringify(questions, null, 2), (err) => {
                if (err) {
                    console.error('Error writing file:', err);
                    res.status(500).send({ error: 'Failed to delete the FAQ' });
                    return;
                }

                // Run the JSON to CSV script
                runJsonToCsvScript();

                res.status(204).send();
            });
        } else {
            res.status(404).send({ error: 'FAQ not found' });
        }
    });
});

// Upload and replace FAQs
router.post('/upload', upload.single('file'), (req, res) => {
    const tempPath = req.file.path;
    const ext = path.extname(req.file.originalname).toLowerCase();
    const jsonTargetPath = path.join(__dirname, '../data/BU_MET_FAQs.json');

    if (ext === '.json') {
        // If the uploaded file is a JSON file, replace the existing JSON file
        fs.rename(tempPath, jsonTargetPath, (err) => {
            if (err) {
                console.error('Error moving JSON file:', err);
                res.status(500).send({ error: 'Failed to upload the JSON file' });
                return;
            }

            res.send({ success: true, message: 'JSON file uploaded and replaced successfully.' });
        });
    } else if (ext === '.csv') {
        // If the uploaded file is a CSV file, convert it to JSON using the script
        const csvTargetPath = path.join(__dirname, '../data/BU_MET_FAQs.csv');
        
        // Move the uploaded CSV file to the data directory
        fs.rename(tempPath, csvTargetPath, (err) => {
            if (err) {
                console.error('Error moving CSV file:', err);
                res.status(500).send({ error: 'Failed to upload the CSV file' });
                return;
            }

            // Run the CSV_to_JSON.js script to convert CSV to JSON
            exec(`node ${path.join(__dirname, '../transfer/CSV_to_JSON.js')}`, (err, stdout, stderr) => {
                if (err) {
                    console.error('Error executing CSV to JSON script:', err);
                    console.error(stderr);
                    res.status(500).send({ error: 'Failed to convert CSV to JSON' });
                    return;
                }

                console.log(stdout);
                res.send({ success: true, message: 'CSV file uploaded, converted to JSON, and replaced successfully.' });
            });
        });
    } else {
        // If the file is neither JSON nor CSV, return an error
        fs.unlink(tempPath, (err) => {
            if (err) {
                console.error('Error deleting file:', err);
            }
            res.status(400).send({ error: 'Only JSON or CSV files are allowed.' });
        });
    }
});

// Download FAQs
router.get('/download', (req, res) => {
    const zipFilePath = path.join(__dirname, '../data/BU_MET_FAQs.zip');
    const csvFilePath = path.join(__dirname, '../data/BU_MET_FAQs.csv');
    const jsonFilePath = path.join(__dirname, '../data/BU_MET_FAQs.json');

    // Create a file to stream archive data to.
    const output = fs.createWriteStream(zipFilePath);
    const archive = archiver('zip', {
        zlib: { level: 9 } // Sets the compression level.
    });

    // Handle stream events
    output.on('close', () => {
        console.log(archive.pointer() + ' total bytes');
        console.log('Archiver has been finalized and the output file descriptor has closed.');

        // Send the ZIP file for download
        res.download(zipFilePath, 'BU_MET_FAQs.zip', (err) => {
            if (err) {
                console.error('Error downloading file:', err);
                res.status(500).send({ error: 'Failed to download the file' });
            }
        });
    });

    output.on('end', () => {
        console.log('Data has been drained');
    });

    archive.on('warning', (err) => {
        if (err.code === 'ENOENT') {
            console.warn('File not found:', err);
        } else {
            throw err;
        }
    });

    archive.on('error', (err) => {
        throw err;
    });

    // Pipe archive data to the file
    archive.pipe(output);

    // Append files to the archive
    archive.file(csvFilePath, { name: 'BU_MET_FAQs.csv' });
    archive.file(jsonFilePath, { name: 'BU_MET_FAQs.json' });

    // Finalize the archive (i.e. we are done appending files but streams have to finish yet)
    archive.finalize();
});


module.exports = router;