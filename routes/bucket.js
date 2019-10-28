const express = require('express');
const router = express.Router();


router.get('/', async (req, res, next) => {
  const {Storage} = require('@google-cloud/storage');

  // Creates a client
  const storage = new Storage();

  const [files] = await storage.bucket('cloud-speech-to-text-257015.appspot.com').getFiles();

  const array = [];

  files.forEach(file => {
    // console.log(file.name);
    const object = {
      name: file.name,
      uri: `gs://cloud-speech-to-text-257015.appspot.com/${file.name}`,
      url: `https://storage.cloud.google.com/cloud-speech-to-text-257015.appspot.com/${file.name}`
    }
    array.push(object);

  });

  res.status(200).json({
    code: 200,
    bucket: 'cloud-speech-to-text-257015.appspot.com',
    files: array
  })


});

module.exports = router;
