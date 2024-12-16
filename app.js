const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const PORT = 5000;

app.use(bodyParser.json());

let users = {};

// Add a user
app.post('/add_user', (req, res) => {
    const { email, age } = req.body;
    if (users[email]) {
        return res.status(400).json({ message: 'User already exists' });
    }
    users[email] = { email, age };
    fs.appendFileSync('users.txt', JSON.stringify({ email, age }) + '\n');
    res.status(201).json({ message: 'User added successfully' });
});

// Get user information
app.get('/get_user/:email', (req, res) => {
    const user = users[req.params.email];
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
});

// Update user information
app.put('/update_user/:email', (req, res) => {
    const { age } = req.body;
    if (!users[req.params.email]) {
        return res.status(404).json({ message: 'User not found' });
    }
    users[req.params.email].age = age;
    fs.writeFileSync('users.txt', Object.values(users).map(user => JSON.stringify(user)).join('\n'));
    res.status(200).json({ message: 'User updated successfully' });
});

// Delete user information
app.delete('/delete_user/:email', (req, res) => {
    if (!users[req.params.email]) {
        return res.status(404).json({ message: 'User not found' });
    }
    delete users[req.params.email];
    fs.writeFileSync('users.txt', Object.values(users).map(user => JSON.stringify(user)).join('\n'));
    res.status(200).json({ message: 'User deleted successfully' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
