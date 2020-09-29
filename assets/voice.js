const peer = new Peer(userId, {
  host: '/',
  port: '3001',
  debug: 1
});

let guild = {};
const connections = [];

var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

function connectToUser(userId) {
  getUserMedia({ video: false, audio: true }, (stream) => {
    const call = peer.call(userId, stream);
    call.on('stream', (theirStream) => audio.play(userId, theirStream));
    call.on('close', () => audio.stop(userId))
  });
}

// receive call
peer.on('call', (call) => {
  getUserMedia({ video: false, audio: true }, (stream) => {
    connections.push(call.answer(stream));
    
    call.on('stream', (remoteStream) => audio.play(call.peer, remoteStream));
    call.on('close', () => {
      const state = guild.members.cache
        .find(m => m.id === call.peer)?.state;

      socket.emit('VOICE_STATE_UPDATE', {
        channelId: state?.channelId,
        userId: call.peer,
        speaking: false,
        inChannel: false
      });
      audio.stop(call.peer);
    });
  });
});

const socket = io('/');

socket.on('READY', (newGuild) => {
  console.log(newGuild);
  guild = newGuild;
});

socket.on('VOICE_STATE_UPDATE', (user, newGuild) => {
  guild = newGuild;
  updateVoiceMemberList(newGuild);
});

let currentChannelId = null;

function setChannel(channelId = null) {
  socket.emit('VOICE_STATE_UPDATE', {
    channelId: channelId ?? currentChannelId,
    userId,
    speaking: false,
    inChannel: Boolean(channelId)
  });

  if (channelId) {
    $('#leaveButton').removeClass('disabled');

    for (const member of guild.members.cache)
      connectToUser(member.id);
  }
  else {
    $('#leaveButton').addClass('disabled');
    audio.removeAll();

    for (const con of connections)
      con.close();
  }

  currentChannelId = channelId;
}

function updateVoiceMemberList(guild) {
  for (const channel of guild.channels.values()) {
    $(`#${channel.id} li`).remove();
    for (const member of channel.members.values())
      $(`#${channel.id}`).append(memberLi(member)); 
  }   
}
function memberLi(user) {
  return `<li id="${user.id}">
    <img src="${user.avatarURL}">
    <span>${user.username}</span>
  </li>`;
}

socket.emit('READY');