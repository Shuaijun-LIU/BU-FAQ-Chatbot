const express = require('express');
const path = require('path');
const router = express.Router();

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/login.html'));
});

router.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/register.html'));
});

router.get('/file-qa', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/file-qa.html'));
});

router.get('/gpt-qa', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/gpt-qa.html'));
});

router.get('/download', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/download.html'));
});

module.exports = router;




function yetAnotherFunction() {
    // |--202407-MacOS--|
    // |--Another:Shuaijun Liu--|
    console.log("Another:Shuaijun Liu");
}