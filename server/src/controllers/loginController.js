const usersDB = {
    users: require('../models/users.json'),
    set: function (data) { this.users = data}
}

const bcrypt = require('bcrypt');
const fspromises = require('fs/promises');
const path = require('path');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const handleRegister = async (req, res) => {
    
    const { email, password } = req.body;

    if (!email || !password ) return res.sendStatus(400);

    const foundUser = usersDB.users.find(person => person.email === email);

    if (!foundUser ) return res.sendStatus(400);

    const match = await bcrypt.compare(password, foundUser.password);

    if ( foundUser && match ) {

        const accessToken = jwt.sign(
            { "email": foundUser.email },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '15m' }
        )

        const refreshToken = jwt.sign(
            { "email": foundUser.email },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        )

        const otherUsers = usersDB.users.filter(person => person.email !== foundUser.email);
        const currentUser = { ...foundUser, refreshToken};

        usersDB.set([...otherUsers, currentUser])

        await fspromises.writeFile(
            path.join(__dirname, '..', 'models', 'users.json'),
            JSON.stringify(usersDB.users)
        )

        res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'none', maxAge: 24*60*60*1000, secure: true})

        res.json({ accessToken })

    } else {
        res.status(401).json({ 'message': 'Either username or password is incorrect' })
    }

}

module.exports = handleRegister;