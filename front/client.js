//import connection from "./WebSocketCLient";
window.WebSocket = window.WebSocket || window.MozWebSocket;
var connection = new WebSocket('ws://127.0.0.1:5000');



//Websocket methods object Config.
connection.onopen = function () {
    console.log("CONNECTING FROM CLIENT WEB APP");
}
connection.onopen = function () {
    console.log("CONNECTION OPENED");
}
connection.onerror = function () {
    console.log("CONNECTION ERROR");
}
connection.onclose = function () {
    console.log("CONNECTION CLOSED");
}

// Variable Declaration
mediaRecorder : null
recordingData : []
audioUrl : ""
transcripts : []

// Methods Declaration
const onStartRecording = async function() {
    
    const options = {mimeType: 'audio/webm'};
    let stream = await navigator.mediaDevices.getUserMedia({audio: true});
    this.mediaRecorder = new MediaRecorder(stream,options);
    this.mediaRecorder.start(2000);
    this.transcripts = [];

    //send data to the server
    this.mediaRecorder.ondataavailable = async event => {
        connection.send(event.data)
    };

    //Save the context
    const self = this
    //Recieve transcripts from server
    connection.onmessage = function (message) {
        let data = JSON.parse(message.data);
        let results = data.results;
        if(results != undefined && results.length>0){
            if( self.transcripts != undefined) {
                console.log(results[0].alternatives);
                self.transcripts.push(results[0].alternatives[0].transcript);
                document.getElementById("transcript").append(results[0].alternatives[0].transcript);
            }
        }
    }
}

onStopRecording= function(){
    if(this.mediaRecorder === null) return;
    this.mediaRecorder.stop();
    connection.close();
}


