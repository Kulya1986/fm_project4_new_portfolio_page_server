import express from 'express';
import cors from 'cors';
import fs from 'fs';
import nodemailer from 'nodemailer';
import  { google } from 'googleapis';

const OAuth2 = google.auth.OAuth2;

const OAuth2_client = new OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET);
OAuth2_client.setCredentials({ refresh_token : process.env.REFRESH_TOKEN});


const app = express();
app.use(express.json()); //middleware to parse JSON format of the frontend, from latest versions built-in the express library, no need to import bodyParser library
app.use(cors());


app.post('/send-msg', (req, res) => {
    const {senderName, senderEmail, senderMsg} = req.body;
    const strToWrite = senderName+';\t'+senderEmail+';\t'+senderMsg+'\n';
    //writing message info to file
    fs.writeFile('messages.txt', strToWrite, {'flag':'a'}, 
        (err) => { 
            if (err)
            {
                console.log(strToWrite);
                res.status(400).json('was not sent'); 
            }
            else {
                res.status(200).json('message sent');
            }
            });
    //sending email with message
    const accessToken = OAuth2_client.getAccessToken();

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: process.env.USER_EMAIL,
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            refreshToken: process.env.REFRESH_TOKEN,
            accessToken: accessToken
        }
    })

    const mailOptions = {
        from: 'Portfolio page <${configData.user}>',
        to: 'kulychka@ukr.net',
        subject: 'Portfolio page - from '+ senderName + '<'+senderEmail+'>',
        text: senderMsg
    }

    transporter.sendMail(mailOptions, function(error, result){
        if (error){
            console.log ('Error: ' , error)
        }else{
            console.log('Success: ', result)
        }
        transporter.close();  
    })
})

app.listen(3000, ()=>{
    console.log('App is running on port 3000');
})
