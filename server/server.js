const express=require('express');
const cookieParser=require('cookie-parser');
const bodyParser=require('body-parser');
const dotenv=require('dotenv').config();
const cors=require('cors');
const http=require('http');

const app=express();

app.use(bodyParser.json());
app.use(cookieParser());

const connectToDB = require('./DatabaseConfig');
const authRoutes=require('./routes/auth.route');
const journalRoutes=require('./routes/journal.route');
const surveyRoutes=require('./routes/survey.route');
const chatRoutes = require('./routes/chat.route');

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use('/auth', authRoutes);
app.use('/journal', journalRoutes);
app.use('/survey', surveyRoutes);
app.use('/api/chat', chatRoutes);

connectToDB().then(() => {
    app.listen(5050, () => {
        console.log('Server is running on port 5050');
    });
}).catch((err) => {
    console.log(err);
});