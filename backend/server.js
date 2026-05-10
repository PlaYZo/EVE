const express = require('express');
const { SerialPort } = require('serialport');

const app = express();
const port = 3000;
const arduinoPort = 'COM4'; 


const cors = require('cors');
app.use(cors());

// 1. Set up the connection to the Arduino
const serialPort = new SerialPort({
    path: arduinoPort,
    baudRate: 9600, 
    autoOpen: true
});

serialPort.on('open', () => {
    console.log(`Successfully connected to Arduino on ${arduinoPort}`);
});

serialPort.on('error', (err) => {
    console.log('Error connecting to Arduino: ', err.message);
    console.log('Make sure the Arduino IDE is closed and the port is correct!');
});

// 2. Configure Express to serve our HTML/CSS/JS files
app.use(express.static('public'));
app.use(express.json()); // Allow server to read JSON data from the website

// 3. Create the API endpoint to receive messages from the website
app.post('/api/send', (req, res) => {
    const textToSend = req.body.text;
    
    if (textToSend) {
        // Send the text to the Arduino, adding a newline character at the end
        // so the Arduino knows the message is finished.
        serialPort.write(textToSend + '\n', (err) => {
            if (err) {
                console.log('Error writing to serial port: ', err.message);
                res.status(500).send('Failed to send');
            } else {
                console.log(`Sent to LCD: ${textToSend}`);
                res.status(200).send('Sent successfully');
            }
        });
    } else {
        res.status(400).send('No text provided');
    }
});

app.post('/api/data', (req, res) => {
    const dataArray = req.body; 
    const textToSend = Object.values(dataArray).join(' | ');
    
    serialPort.write(textToSend + '\n', (err) => {
        if (err) {
            console.log('Error writing to serial port: ', err.message);
            res.status(500).send('Failed to send');
        } else {
            console.log(`Sent to LCD: ${textToSend}`);
            res.status(200).send('Sent successfully');
        }
    });
});

// 4. Start the server
app.listen(port, () => {
    console.log(`Server is running! Open your browser to http://localhost:${port}`);
});