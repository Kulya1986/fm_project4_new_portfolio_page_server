import express from 'express';
import cors from 'cors';
import fs from 'fs';

const app = express();
app.use(express.json()); //middleware to parse JSON format of the frontend, from latest versions built-in the express library, no need to import bodyParser library
app.use(cors());


app.post('/send-msg', (req, res) => {
    const {senderName, senderEmail, senderMsg} = req.body;
    const strToWrite = senderName+';\t'+senderEmail+';\t'+senderMsg+'\n';
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
})

app.listen(3000, ()=>{
    console.log('App is running on port 3000');
})
