const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const router = express.Router();

const upload = multer({ dest: 'uploads/' });

// Read JSON
router.get('/', (req, res) => {
    const filePath = path.join(__dirname, '../data/BU_MET_FAQs.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
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
    const filePath = path.join(__dirname, '../data/BU_MET_FAQs.json');
    
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            res.status(500).send({ error: 'Failed to read questions data' });
            return;
        }

        const questions = JSON.parse(data);
        for (let item of questions) {
            if (item.question.toLowerCase() === userQuestion) {
                res.send({ answer: item.answer, urls: item.urls });
                return;
            }
        }

        res.status(404).send({ error: 'Question not found' });
    });
});

// Add new FAQ
router.post('/', (req, res) => {
    const newFAQ = req.body;
    const filePath = path.join(__dirname, '../data/BU_MET_FAQs.json');
    
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            res.status(500).send({ error: 'Failed to read questions data' });
            return;
        }

        const questions = JSON.parse(data);
        questions.push(newFAQ);

        fs.writeFile(filePath, JSON.stringify(questions, null, 2), (err) => {
            if (err) {
                console.error('Error writing file:', err);
                res.status(500).send({ error: 'Failed to save the new FAQ' });
                return;
            }

            res.status(201).send(newFAQ);
        });
    });
});

// Update FAQ
router.put('/:index', (req, res) => {
    const index = req.params.index;
    const updatedFAQ = req.body;
    const filePath = path.join(__dirname, '../data/BU_MET_FAQs.json');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            res.status(500).send({ error: 'Failed to read questions data' });
            return;
        }

        const questions = JSON.parse(data);

        if (index >= 0 && index < questions.length) {
            questions[index] = updatedFAQ;

            fs.writeFile(filePath, JSON.stringify(questions, null, 2), (err) => {
                if (err) {
                    console.error('Error writing file:', err);
                    res.status(500).send({ error: 'Failed to update the FAQ' });
                    return;
                }

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
    const filePath = path.join(__dirname, '../data/BU_MET_FAQs.json');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            res.status(500).send({ error: 'Failed to read questions data' });
            return;
        }

        const questions = JSON.parse(data);

        if (index >= 0 && index < questions.length) {
            questions.splice(index, 1);

            fs.writeFile(filePath, JSON.stringify(questions, null, 2), (err) => {
                if (err) {
                    console.error('Error writing file:', err);
                    res.status(500).send({ error: 'Failed to delete the FAQ' });
                    return;
                }

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
    const targetPath = path.join(__dirname, '../data/BU_MET_FAQs.json');

    fs.rename(tempPath, targetPath, (err) => {
        if (err) {
            console.error('Error moving file:', err);
            res.status(500).send({ error: 'Failed to upload the file' });
            return;
        }

        res.send({ success: true });
    });
});

// Download FAQs
router.get('/download', (req, res) => {
    const filePath = path.join(__dirname, '../data/BU_MET_FAQs.json');
    res.download(filePath, 'BU_MET_FAQs.json', (err) => {
        if (err) {
            console.error('Error downloading file:', err);
            res.status(500).send({ error: 'Failed to download the file' });
        }
    });
});

module.exports = router;

function yetAnotherFunction() {
    // |--202407-MacOS--|
    // |--Another:Shuaijun Liu--|
    console.log("Another:Shuaijun Liu");
}