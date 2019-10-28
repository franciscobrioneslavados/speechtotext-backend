const express = require('express');
const router = express.Router();

const speech = require('@google-cloud/speech');
const fs = require('fs');

const client = new speech.SpeechClient();
const Base64 = require('js-base64').Base64;

router.post('/', async (req, res, next) => {

  const method = req.body.method;
  const config = req.body.config;

  if (method === 'postUri') {
    const uri = req.body.uri;
    // console.log(audioBytes);
    const audio = {
      uri: uri
    };
    const config = {
      encoding: config.encoding,
      sampleRateHertz: 16000,
      languageCode: config.languageCode,
    };
    const request = {
      audio: audio,
      config: config,
    };

    const [operation] = await client.longRunningRecognize(request);
    const [response] = await operation.promise();
    const transcription = response.results
      .map(result => result.alternatives[0].transcript)
      .join('\n');

    if (transcription) {
      console.log(`Transcription: ${transcription}`);
      res.status(200).json({
        code: 200,
        transcription: transcription
      })
    } else {
      res.status(404).json({
        code: 404,
        message: 'No transcription!'
      })
    }
  }

  if (method === 'postBase64') {
    const base64Data = await new Buffer.from(req.body.audio.replace(/^data:video\/\w+;base64,/, ""), 'base64');

    const config = {
      encoding: config.encoding,
      sampleRateHertz: 16000,
      languageCode: config.languageCode
    };
    const audio = {
      content: base64Data,
    };

    const request = {
      config: config,
      audio: audio,
    };



    const [response] = await client.recognize(request);
    const transcription = response.results
      .map(result => result.alternatives[0].transcript)
      .join('\n');
    console.log(`Transcription: `, transcription);
    if (transcription) {
      console.log(`Transcription: ${transcription}`);
      res.status(200).json({
        code: 200,
        transcription: transcription
      })
    } else {
      res.status(404).json({
        code: 404,
        message: 'No transcription!'
      })
    }
  }






});

module.exports = router;
