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
app.get('/pic', (request, response) => {
  try {
    facePlusAPICall(request)
      .then( FaceObj => {
        return response.status(200).send(FaceObj);
      });
  } catch (error) {
    console.log('error line 37');
    response.status(500).send('hello');
  }
});

function facePlusAPICall (imgData) {
  try {
    // let facePlusQueryString =`https://api-us.faceplusplus.com/facepp/v3/detect?api_key=${process.env.FACEPLUS_API_KEY}&api_secret=${process.env.FACEPLUS_API_SECRET}`;
    let facePlusQueryString = `https://api-us.faceplusplus.com/facepp/v3/detect?api_key=jkbjMP6Jl9y3rdGU-6F86EAS3PbheD6w&api_secret=5_Yq5fGE9sPfdjjYRlaHpmXIqVVwa8lK&image_url=https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Waldemar_Ritter_2015.jpg/325px-Waldemar_Ritter_2015.jpg&return_attributes=emotion`;
    return superagent
      .post(facePlusQueryString)
      // .set('Content-Type', 'application/x-www-form-urlencoded')
      // .send({image_base64: imgData, return_attributes: 'emotion'})
      .then((faceAPIRes) => {
        let emotionsObj = faceAPIRes.body.faces[0].attributes.emotion;
        let faceAPIInstance = new Fortune ('adminTest', fortunePicker('anger'), lotto(), dominantAttribute(faceAPIRes.body), emotionsObj.sadness, emotionsObj.neutral, emotionsObj.disgust, emotionsObj.anger, emotionsObj.surprise, emotionsObj.fear, emotionsObj.happiness, Date.now());
        console.log(faceAPIInstance);
        return faceAPIInstance;
      })
      .catch(err => console.log(err));

  } catch(error) {
    response.status(500).send('Sorry all berries');
  }
}

function dominantAttribute(data) {
  let emotionObj = data.faces[0].attributes.emotion;
  let emotionArr = Object.entries(emotionObj);
  let final = emotionArr.reduce((previousValue, currentValue) => {
    if (previousValue[1] > currentValue[1]) {
      return previousValue;
    } else {
      return currentValue;
    }
  })[0];
  return final;
}

function lotto() {
  let arr = [];
  for (let i = 0; i < 6; i++) {
    arr.push(Math.floor(Math.random() * (64 - 1)) + 1);
  }
  return arr.join(', ');
}

function fortunePicker(dominant_attribute) {
  if (dominant_attribute === 'anger') {
    return 'This is an angry fortune';
  } else {
    return 'This is not an angry fortune';
  }
}

app.use('*', (request, response) => response.send('Oops'));
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
