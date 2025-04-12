// server.js
const express = require('express');
const http = require('http');
const axios = require('axios');
const { Server } = require('socket.io');
const cors = require('cors');
require("dotenv").config();
const PORT = process.env.PORT;

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

const WEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
console.log("weather api",WEATHER_API_KEY);

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('getWeather', async (city) => {
    try {
        console.log("call function");
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${WEATHER_API_KEY}`
        // `http://api.weatherstack.com/current?access_key=${WEATHER_API_KEY}&query=${city}`
      );
      console.log("after call function",res.data);
      socket.emit('weatherUpdate', res.data);
    } catch (err) {
      socket.emit('weatherError', 'City not found');
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});
server.listen(PORT, () => {
  console.log('Server is running on 5000');
});
