// add Requires 
const keys = require("./keys")
const { IamAuthenticator } = require('ibm-watson/auth');
const SpeechToTextV1 = require('ibm-watson/speech-to-text/v1');
const stream = require("stream");
const fs = require("fs");

// Instantiate speechToText object of Ibm-watson
const speechToText = new SpeechToTextV1({
    authenticator: new IamAuthenticator({
        apikey: keys.IBM_API_KEY,
    }),
    url: 'https://api.eu-gb.speech-to-text.watson.cloud.ibm.com/instances/3c49ad12-596b-46e8-b3a1-6d309c03b305',
});

/**
 * Configure our SpeechToText object to match the type
 * of audio to be transcripted
 * 
 * 
 */
var params = {
    objectMode: true,
    content_type: 'audio/x-float-array',
    model: 'en-US_BroadbandModel',
    keywords: ['colorado', 'tornado', 'tornadoes'],
    keywordsThreshold: 0.5,
    maxAlternatives: 3,
    language: "en-US",
    url: "https://stream.watsonplatform.net/speech-to-text/api/v1/models/en-US_BroadbandModel",
    rate: 16000,
    supported_features: {
        "custom_language_model": true,
        "speaker_labels": true
    },
    description: "US English broadband model."
};

//Read the header of the audio from headerDefault.txt file asynchronously
function readFileAsPromise(){
    return new Promise((resolve, reject) => {
        fs.readFile("headerDefault.txt",((err, data) => {
            if(err) reject(err);
            data = data + "" ;
            resolve(data)
        }))
    })

}
isFirstBuffer = true;

// Exported function used in our server that represent the Api to send data and get the transcript.
module.exports = async function(buffer, callback){

    const recognizeStream = speechToText.recognizeUsingWebSocket(params);
    const bufferStream = new stream.PassThrough();

    //prepare the buffer to be send to Ibm
    if(isFirstBuffer){
        console.log(buffer.binaryData)
        bufferStream.end(buffer.binaryData);
        bufferStream.pipe(recognizeStream);
        isFirstBuffer = false;
    }else {
        var defaultHeader = await readFileAsPromise();
        defaultHeader = JSON.parse(defaultHeader);
        defaultHeader = defaultHeader.binaryData.data;
        defaultHeader = Buffer.from(defaultHeader)
        bufferStream.end(Buffer.concat([defaultHeader,buffer.binaryData]));
        bufferStream.pipe(recognizeStream);
    }

    // the states function of recognizeStream object that will treat the result according to the type of response ( success ,error, close)
    recognizeStream.on('data', function(event) {
        console.log(event)
        callback(event);
    });
    recognizeStream.on('error', function(event) {
        callback(event);
    });
    recognizeStream.on('close', function(event) {
        callback(event);
    });
}

