'use strict';

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
const pg = require('pg');
const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static('./public'));

const client = new pg.Client(process.env.DATABASE_URL);
client.connect();

app.get('/', (request, response) => response.send('Server works'));
app.get('/pic', (request, response) => response.send('Send pic'));

function sendPic(request, response) {
  const queryData = request.query.data;
}

app.get


app.use('*', (request, response) => response.send('Oops'));
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));