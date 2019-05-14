'use strict';

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
const multer = require('multer');
const upload = multer({ dest: 'uploads/'});
const pg = require('pg');
const app = express();

const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(cors());
app.use(express.static('./public'));

const client = new pg.Client(process.env.DATABASE_URL);
client.connect();

app.get('/', (request, response) => response.send('Server works'));
app.post('/pic',upload.single('image'), (request, response) => sendPic(request, response));

function sendPic(req, res) {
  const queryData = req.body.imageObj; //this should be the base64string
  // console.log('works', req.body);
  //Todo make request to face++
superagent.post('https://api-us.faceplusplus.com/facepp/v3/detect')
        .send({ api_key: process.env.FACE_PLUS_API_KEY, api_secret: process.env.FACE_PLUE_API_SECRET,image_base64: queryData })
        .then(result => {
          console.log(result)
          res.send('works')
        })
        .catch(err => console.error(err))

}


app.use('*', (request, response) => response.send('Oops'));
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));