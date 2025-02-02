const express=require('express');
const cookieParser=require('cookie-parser');
const bodyParser=require('body-parser');
const dotenv=require('dotenv').config();
const cors=require('cors');
const http=require('http');

const connectToDB = require('./DatabaseConfig');
const authRoutes=require('./routes/auth.route');
const journalRoutes=require('./routes/journal.route')

const app=express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(bodyParser.json());
app.use(cookieParser());

app.use('/auth', authRoutes);
app.use('/journal', journalRoutes)

connectToDB().then(() => {
    app.listen(5050, () => {
        console.log('Server is running on port 5050');
    });
}).catch((err) => {
    console.log(err);
});