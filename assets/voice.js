const peer = new Peer(userId);
const socket = io('/');

let guild = {};
let currentChannelId = null;
let calls = [];

// peer calls

var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

function connectToVC(channelId) {
  const channelMembers = guild.channels
    .find(c => c.id === channelId).members;

  for (const member of channelMembers) {
    if (member.id === userId) continue;

    getUserMedia({ video: false, audio: true },
      (stream) => peer.call(member.id, stream));
    }
}

function disconnectFromVC() {
  audio.stopAll();

  for (const call of calls)
    call.close();

  calls = [];
}

peer.on('call', (call) => {
  calls.push(call);

  getUserMedia({ video: false, audio: true }, (stream) => {
    call.answer(stream);
    
    call.on('stream', (remoteStream) => audio.play(call.peer, remoteStream));
    call.on('close', () => audio.stop(call.peer));
  });
});

// socket events

socket.on('READY', (newGuild) => guild = newGuild);

socket.on('VOICE_STATE_UPDATE', (user, newGuild) => {
  guild = newGuild;
  updateVoiceMemberList(newGuild);
});

socket.emit('READY', userId);

// html events

function updateVoiceMemberList(guild) {
  for (const channel of guild.channels) {
    $(`#${channel.id} li`).remove();
    for (const member of channel.members)
      $(`#${channel.id}`).append(memberLi(member)); 
  }   
}
function memberLi(member) {
  return `<li id="${member.id}"><img src="${member.avatarURL}"><span class="pl-1">${member.username}</span></li>`;
}

function setChannel(channelId = null) {
  socket.emit('VOICE_STATE_UPDATE',
    { channelId: channelId ?? currentChannelId, userId, inChannel: Boolean(channelId) });

  if (channelId) {
    connectToVC(channelId);
    $('#leaveButton').removeClass('disabled');
  }
  else {
    disconnectFromVC();
    $('#leaveButton').addClass('disabled');
  }
  currentChannelId = channelId;
}