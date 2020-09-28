const myPeer = new Peer(undefined, {
  host: '/',
  port: '3001'
});

myPeer.on('open', (uuid) => {});

myPeer.on('close', (uuid) => {
  socket.emit('LEAVE_VOICE', voiceChannelId, uuid);
});

navigator.mediaDevices.getUserMedia({
  video: false,
  audio: true
})
.then(stream => {
  myPeer.on('call', call => {
    call.answer(stream);
  });

  socket.on('USER_CONNECTED', (userId) => {
    connectToNewUser(userId, stream);
  });
});

function connectToNewUser(userId, stream) {
  const call = myPeer.call(userId, stream);
  
  const audio = new Audio().srcObject = stream;
  
  call.on('stream', otherUserStream => {
    new Audio().srcObject = otherUserStream;
  });
  call.on('close', () => audio.srcObject = null);
} 