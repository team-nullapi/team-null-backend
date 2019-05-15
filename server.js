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
    let facePlusQueryString = `https://api-us.faceplusplus.com/facepp/v3/detect?api_key=jkbjMP6Jl9y3rdGU-6F86EAS3PbheD6w&api_secret=5_Yq5fGE9sPfdjjYRlaHpmXIqVVwa8lK&image_url=https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Waldemar_Ritter_2015.jpg/325px-Waldemar_Ritter_2015.jpg&return_attributes=emotion`
    return superagent
      .post(facePlusQueryString)
      // .set('Content-Type', 'application/x-www-form-urlencoded')
      // .send({image_base64: imgData, return_attributes: 'emotion'})
      .then((faceAPIRes) => {
        let totalScoreString = `sadness: ${faceAPIRes.body.faces[0].attributes.emotion.sadness}, neutral: ${faceAPIRes.body.faces[0].attributes.emotion.neutral}, disgust: ${faceAPIRes.body.faces[0].attributes.emotion.disgust}, anger: ${faceAPIRes.body.faces[0].attributes.emotion.anger}, surprise: ${faceAPIRes.body.faces[0].attributes.emotion.surprise}, fear: ${faceAPIRes.body.faces[0].attributes.emotion.surprise}, happiness: ${faceAPIRes.body.faces[0].attributes.emotion.happiness}`
        console.log(totalScoreString);
        let faceAPIInstance = new Fortune ('adminTest', 'This is a dummy fortune', '43, 2, 5, 23, 45, 21', 'Anger', 'sadness: 0.06, neutral: 6.842, disgust: 0.06, anger: 91.787, surprise: 0.93, fear: 0.06, happiness: 0.261', Date.now());
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