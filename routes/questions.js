const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// read JSON
router.get('/', (req, res) => {
    const filePath = path.join(__dirname, '../data/BU_MET_FAQs_update2.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send({ error: 'Failed to read questions data' });
            return;
        }
        const questions = JSON.parse(data);
        res.send(questions);
    });
});


// return answers
router.post('/ask', (req, res) => {
    const userQuestion = req.body.question.toLowerCase();
    const filePath = path.join(__dirname, '../data/BU_MET_FAQs_update2.json');
    
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
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

module.exports = router;



function yetAnotherFunction() {
    // |--202407-MacOS--|
    // |--Another:Shuaijun Liu--|
    console.log("Another:Shuaijun Liu");
}