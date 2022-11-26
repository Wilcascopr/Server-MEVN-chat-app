const usersDB = {
    users: require('../models/users.json'),
    set: function (data) { this.users = data}
}

const fspromises = require('fs/promises');
const path = require('path');

const handleLogout = async (req, res) => {

    const cookies = req.cookies;

    if (!cookies?.jwt) return res.sendStatus(204);

    const refreshToken = cookies.jwt;

    const user = usersDB.users.find(person => person.refreshToken === refreshToken);

    if (!user) {
        res.clearCookie('jwt', {httpOnly: true, sameSite: 'None', secure: true})
        return res.sendStauts(204)
    }
    console.log(user)
    const otherUsers = usersDB.users.filter(person => person.refreshToken !== refreshToken);
    const currentUser = { ...user, refreshToken: '' };
    usersDB.set([...otherUsers, currentUser])

    await fspromises.writeFile(
        path.join(__dirname, '..', 'models', 'users.json'),
        JSON.stringify(usersDB.users)
    )

    res.clearCookie('jwt', {httpOnly: true, sameSite: 'None', secure: true});
    res.sendStatus(204);

}

module.exports = handleLogout;