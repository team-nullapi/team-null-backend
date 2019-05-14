'use strict';

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
const multer = require('multer');
const upload = multer({ dest: 'uploads/'});
const pg = require('pg');
const bodyParser = require('body-parser')
const app = express();

const PORT = process.env.PORT || 3000;
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('./public'));

const client = new pg.Client(process.env.DATABASE_URL);
client.connect();

function Fortune (username, fortune, lotto, dominant_attribute, score, created_on) {
  this.username = username;
  this.fortune = fortune;
  this.lotto = lotto;
  this.dominant_attribute = dominant_attribute;
  this.score = score;
  this.created_on = created_on;
}


app.get('/', (request, response) => response.send('Server works'));
app.post('/pic',upload.single('image'), (request, response) => sendPic(request, response));

function sendPic(req, res) {
  const queryData = req.body.imageObj; //this should be the base64string
  facePlusAPICall(queryData);
}

function facePlusAPICall (imgData) {
  try {
    let facePlusQueryString =`https://api-us.faceplusplus.com/facepp/v3/detect?api_key=${process.env.FACEPLUS_API_KEY}&api_secret=${process.env.FACEPLUS_API_SECRET}`;
    return superagent
      .post(facePlusQueryString)
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send({image_base64: imgData, return_attributes: 'emotion'})
      .then((faceAPIRes) => {
        console.log(faceAPIRes.body.faces[0]);
        let faceAPIInstance = new Fortune ('adminTest', 'This is a dummy fortune', '43, 2, 5, 23, 45, 21', 'dummy', 'dummy', Date.now());
        console.log(faceAPIInstance);
        return faceAPIInstance;
      })
      .catch(err => console.log(err))
    
  } catch(error) {
    response.status(500).send('Sorry all berries');
  }
}



app.use('*', (request, response) => response.send('Oops'));
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));