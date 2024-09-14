const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Path to user.txt
const filePath = './user.txt';

// Helper function to save data to user.txt
const saveToTextFile = (user) => {
    const userData = `Name: ${user.name}, Email: ${user.email}, Password: ${user.password}\n`;
    fs.appendFile(filePath, userData, (err) => {
        if (err) throw err;
        console.log('User data saved to user.txt');
    });
};

// Signup route
app.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;

    // Basic validation
    if (!name || !email || !password) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user data to the text file
    const user = {
        name,
        email,
        password: hashedPassword
    };
    saveToTextFile(user);

    res.status(200).json({ msg: 'User registered successfully' });
});

// Login route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Read the user.txt file and find the user
    fs.readFile(filePath, 'utf8', async (err, data) => {
        if (err) {
            return res.status(500).json({ msg: 'Server error' });
        }

        const users = data.split('\n').filter(user => user);
        let foundUser = null;

        users.forEach(userString => {
            const userArray = userString.split(', ');
            const userEmail = userArray[1].split(': ')[1];
            const userPassword = userArray[2].split(': ')[1];

            if (userEmail === email) {
                foundUser = {
                    email: userEmail,
                    password: userPassword
                };
            }
        });

        if (!foundUser) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Compare the password
        const isMatch = await bcrypt.compare(password, foundUser.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        res.status(200).json({ msg: 'Login successful' });
    });
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
