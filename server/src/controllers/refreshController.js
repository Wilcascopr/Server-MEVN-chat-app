const usersDB = {
    users: require('../models/users.json'),
    set: function (data) { this.users = data}
}

const jwt = require('jsonwebtoken');
require('dotenv').config()

const handleRefreshToken = (req, res) => {
    
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);

    const refreshToken = cookies.jwt;
    const user = usersDB.users.find(person => person.refreshToken === refreshToken);

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
                if (err || decoded.email !== user.email) return res.sendStatus(403);
                const accessToken = jwt.sign(
                    { "username": decoded.username },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn:  '15m'}
                );

                res.json( { accessToken } )
            })

}

module.exports = handleRefreshToken;