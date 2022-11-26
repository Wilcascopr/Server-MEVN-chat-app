const usersDB = {
    users: require('../models/users.json'),
    set: function (data) { this.users = data}
}

const handleUserData = (req, res) => {
    
    const cookies = req.cookies;
    
    if (!cookies?.jwt) return res.sendStatus(401);

    const refreshToken = cookies.jwt;

    const user = usersDB.users.find(person => person.refreshToken === refreshToken);

    res.json({ name: user.name, email: user.email })

}

module.exports = handleUserData;