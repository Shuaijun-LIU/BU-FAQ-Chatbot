require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// 使用环境变量中的 MongoDB 连接字符串
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const authRoutes = require('./routes/auth');
const questionRoutes = require('./routes/questions');

app.use('/auth', authRoutes);
app.use('/questions', questionRoutes);

// 页面路由处理
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.get('/file-qa', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'file-qa.html'));
});

app.get('/gpt-qa', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'gpt-qa.html'));
});

app.get('/download', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'download.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});