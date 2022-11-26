const usersDB = {
    users: require('../models/users.json'),
    set: function (data) { this.users = data}
}

const bcrypt = require('bcrypt');
const fspromises = require('fs/promises');
const path = require('path');

const handleRegister = async (req, res) => {
    
    const { name, email, password } = req.body;

    if (!name || !email || !password ) return res.sendStatus(400);

    const duplicate = usersDB.users.find(person => person.email === email);

    if (duplicate) return res.status(409).json({'message': 'This user is already registered'});

    try {

        const hashedPswd = await bcrypt.hash(password, 10);

        const newUser = {
            name: name,
            email: email,
            password: hashedPswd
        }

        usersDB.set([...usersDB.users, newUser])

        await fspromises.writeFile(
            path.join(__dirname, '..', 'models', 'users.json'),
            JSON.stringify(usersDB.users)
        )

        res.status(201).json({ 'message': `Welcome ${name}`})

    } catch(err) {
        res.status(500).json({ 'message': err.message })
    }

}

module.exports = handleRegister;