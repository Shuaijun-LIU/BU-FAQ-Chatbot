const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Check if JWT_SECRET is properly set
console.log('JWT_SECRET:', process.env.JWT_SECRET || 'JWT_SECRET not set');

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Set the upload directory
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Save files with unique names
    }
});

const upload = multer({ storage: storage });

// Register route
router.post('/register', upload.single('profile_image'), async (req, res) => {
    try {
        const { username, first_name, last_name, email, nickname, website, telephone, mobile, bio, password } = req.body;
        const profile_image = req.file ? req.file.filename : null;

        // Create a new user with the plain text password
        const user = new User({
            username,
            first_name,
            last_name,
            email,
            nickname,
            website,
            telephone,
            mobile,
            bio,
            profile_image,
            password // Pass the plain text password
        });

        // Save the user to the database
        await user.save();
        console.log('User registered successfully with the following data:', user);

        // Respond with success message
        res.status(201).send({ message: 'User registered successfully' });
    } catch (err) {
        console.error('Error during user registration:', err);
        res.status(400).send({ message: err.message });
    }
});

// Login route
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log('Login attempt with username:', username);

        // Find the user by username
        const user = await User.findOne({ username });
        if (!user) {
            console.warn('User not found:', username);
            return res.status(401).send({ message: 'Invalid credentials' });
        }
        console.log('User found:', user);

        // Compare the provided password with the stored hash
        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Password match result:', isMatch);
        if (!isMatch) {
            return res.status(401).send({ message: 'Invalid credentials' });
        }

        // Generate a JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log('JWT token generated:', token);

        // Respond with the token
        res.send({ token });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(400).send({ message: err.message });
    }
});

// Profile route to get the current user's information
router.get('/profile', async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select('-password'); // Exclude the password field
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }
        res.send(user);
    } catch (err) {
        console.error('Error retrieving user profile:', err);
        res.status(500).send({ message: 'Failed to retrieve user profile' });
    }
});

module.exports = router;

function yetAnotherFunction() {
    // |--202407-MacOS--|
    // |--Another:Shuaijun Liu--|
    console.log("Another:Shuaijun Liu");
}