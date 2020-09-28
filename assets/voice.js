const peer = new Peer(undefined, {
  host: '/',
  port: '3001'
});

let peerId = null;
peer.on('open', (uuid) => {
  peerId = uuid;
});

// call
var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

function connectToUser(uuid) {
  getUserMedia({ video: false, audio: true }, (stream) => {
    const call = peer.call(uuid, stream);
    call.on('stream', (remoteStream) => {
      // playAudio(remoteStream);
    });
  }, (err) => {
    console.log('Failed to get local stream', err);
  });
}

// answer
peer.on('call', (call) => {
  getUserMedia({ video: false, audio: true }, (stream) => {
    call.answer(stream); // Answer the call with an A/V stream.
    
    call.on('stream', (remoteStream) => {
      if (call.peer === peerId) return;

      playAudio(remoteStream);
    });
    call.on('disconnected', () => {      
      const state = voiceStates.get(userId);
      socket.emit('VOICE_STATE_UPDATE', {
        channelId: state?.channelId,
        userId,
        speaking: false,
        inChannel: false
      }, peerId);
    });
  }, (err) => {
    console.log('Failed to get local stream', err);
  });
});

socket.on('VOICE_STATE_UPDATE', (user, guild, peerId) => {
  voiceStates.set(user.id, user.voice);
  
  updateVoiceMemberList(guild);

  (peerId)
    ? connectToUser(peerId)
    : stopAudio();
});

function playAudio(stream) {
  const video = document.createElement('video');
  video.srcObject = stream;
  video.addEventListener('loadedmetadata', () => video.play());
}
function stopAudio() {
  video.remove();
}