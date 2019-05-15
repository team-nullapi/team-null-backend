'use strict';

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
const multer = require('multer');
const upload = multer({ dest: 'uploads/'});
const pg = require('pg');
const bodyParser = require('body-parser');
const app = express();

const PORT = process.env.PORT || 3000;
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('./public'));

const client = new pg.Client(process.env.DATABASE_URL);
client.connect();

function Fortune (username, fortune, lotto, dominant_attribute, sadness, neutral, disgust, anger, surprise, fear, happiness, created_on) {
  this.username = username;
  this.fortune = fortune;
  this.lotto = lotto;
  this.dominant_attribute = dominant_attribute;
  this.sadness = sadness;
  this.neutral = neutral;
  this.disgust = disgust;
  this.anger = anger;
  this.surprise = surprise;
  this.fear = fear;
  this.happiness = happiness;
  this.created_on = created_on;
}


app.get('/', (request, response) => response.send('Server works'));
app.post('/pic',upload.single('image'), (request, response) => facePlusAPICall(request, response));
app.get('/fortunes', (request, response) => grabFortunes(request, response));
// ToDo insert get all items request


function grabFortunes(req, res){
  // query sql table for data based on username
  let sqlStatement = 'SELECT * FROM users WHERE username=$1';
  let values = [req.query.data.username];
  return client.query(sqlStatement, values)
    // send back data 
    .then(result => {
      let fortuneArr = [];
      if(result.rowCount > 0) {
        fortuneArr = result.rows[0].map(fortune => {
          new Fortune(fortune.username, fortune.fortune, fortune.lotto, fortune.dominant_attribute, fortune.score, fortune.created_on)
        })
        return res.send(fortuneArr)
      } else {
        return res.send('You do not have any fortunes');
      }
    })
    .catch(err => res.status(500).send('Sorry an error ocurred trying to grab your fortunes'))
}

function facePlusAPICall (req, res) {
  try {
    let imgData = req.body.imageObj;
    let facePlusQueryString =`https://api-us.faceplusplus.com/facepp/v3/detect?api_key=${process.env.FACEPLUS_API_KEY}&api_secret=${process.env.FACEPLUS_API_SECRET}`;
    return superagent
      .post(facePlusQueryString)
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send({image_base64: imgData, return_attributes: 'emotion'})
      .then((faceAPIRes) => {
        let emotionsObj = faceAPIRes.body.faces[0].attributes.emotion;
        let lotto = lottoGen();
        let dominant_attribute = dominantAttribute(emotionsObj);
        let fortune = fortunePicker(dominant_attribute);
        let username = req.body.username;
        let created_on = Date.now();
        let faceAPIInstance = new Fortune (username, fortune, lotto, dominant_attribute, emotionsObj.sadness, emotionsObj.neutral, emotionsObj.disgust, emotionsObj.anger, emotionsObj.surprise, emotionsObj.fear, emotionsObj.happiness, created_on);
        let insertStatement = `INSERT INTO users (username, fortune, lotto, dominant_attribute, sadness, neutral, disgust, anger, surprise, fear, happiness, created_on) VALUES ( $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) ON CONFLICT DO NOTHING;`;
        let insertValues = [
          username,
          fortune,
          lotto,
          dominant_attribute,
          emotionsObj.sadness,
          emotionsObj.neutral,
          emotionsObj.disgust,
          emotionsObj.anger,
          emotionsObj.surprise,
          emotionsObj.fear,
          emotionsObj.happiness,
          created_on
        ];
        client.query(insertStatement, insertValues);
        return res.send(faceAPIInstance);
      })
      .catch(err => console.log(err));

  } catch(error) {
    res.status(500).send('Sorry all berries');
  }
}

function dominantAttribute(obj) {
  let emotionArr = Object.entries(obj);
  let final = emotionArr.reduce((previousValue, currentValue) => {
    if (previousValue[1] > currentValue[1]) {
      return previousValue;
    } else {
      return currentValue;
    }
  })[0];
  return final;
}

function lottoGen() {
  let arr = [];
  for (let i = 0; i < 6; i++) {
    arr.push(Math.floor(Math.random() * (64 - 1)) + 1);
  }
  return arr.join(', ');
}

function fortunePicker(dominant_attribute) {
  //to do flesh out fortune picker to pick fortunes from a db
  if (dominant_attribute === 'anger') {
    return 'This is an angry fortune';
  } else {
    return 'This is not an angry fortune';
  }
}

app.use('*', (request, response) => response.send('Oops'));
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
