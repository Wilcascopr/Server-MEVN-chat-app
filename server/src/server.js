const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const registerRoute = require('./routes/registerRoute');
const loginRoute = require('./controllers/loginController')
const logoutRoute = require('./routes/logoutRoute');
const refreshRoute = require('./routes/refreshRoute');
const userRoute = require('./routes/userRoute')
const verifyJWT = require('./middleware/verifyJWT');



const app = express();

const PORT = process.env.PORT || 8000;

 /*app.use((req, res, next) => {
    console.log(req.headers)
    next()
})*/

app.use(cors({
    origin: 'http://localhost:8080',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());


// router
app.use('/register', registerRoute);
app.use('/login', loginRoute);
app.use('/logout', logoutRoute);
app.use('/refresh', refreshRoute);

app.use(verifyJWT);

app.use('/getuser', userRoute)

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})

