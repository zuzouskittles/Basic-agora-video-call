let remoteContainer = document.getElementById("remote-container");

var channelName = localStorage.getItem("channelname");

document.getElementById('disconnect_call').onclick = () =>  {
    disconnectCall();
}

function disconnectCall(){
    client.leave();
    if (client.leave()) {
        console.log("client left");
        window.location.href = '../index.html'
    }
}

var isMuted = false;
document.getElementById('mute_mic').onclick = () =>  {
    toggleMic();
}

function toggleMic() {
    if (isMuted) {
        globalstream.enableaudio();
        isMuted = false;
    } 
    else {
        globalstream.muteAudio();
        isMuted = true;
    }
}

function removeVideoStream (evt) {
    let stream = evt.stream;
    stream.stop();
    let removeDiv = document.getElementById('remote-container');
    removeDiv.parentNode.removeChild(removeDiv);
    console.log("Remote stream removed!");
}

var isCameraOn = true;
document.getElementById('disable_camera').onclick = () =>  {
    togglecamera();
}

function toggleCamera() {
    if (isCameraOn) {
        isCameraOn = false;
        globalstream.muteVideo();
    } else {
        ismuted = true;
        globalstream.enableVideo();
    }
}

let client = AgoraRTC.createClient({
    mode : 'live',
    codec : "h264",
});

var stream = AgoraRTC.createStream({
  streamID : 0,
  audio:true,
  video:true,
  screen:false
});

//Initializing client
client.init("84dfd1d8d100466599e730c46f7e741d",function ()  {                                            
    console.log("success! ");
});

client.join(null, channelName, null, function(uid){

    let localstream = AgoraRTC.createStream({
        streamID : uid,
        audio : true,
        video : true,
        screen : false
    });

    globalstream = localstream

    localstream.init(function(params){
        localstream.play('me');
        client.publish(localstream, handleFail);

        client.on('stream-added', (evt)=>{
            client.subscribe(evt.stream, handleFail);
        });

        client.on('stream-subscribed', (evt)=>{
            let stream = evt.stream;
            stream.play('remote-container');
        });
        client.on('stream-removed', removeVideoStream);
    },handleFail);

},handleFail); 
