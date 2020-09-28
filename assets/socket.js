const socket = io('/');

const voiceStates = new Map();

function setChannel(channelId = null) {
  const state = voiceStates.get(userId);

  socket.emit('VOICE_STATE_UPDATE', {
    channelId: state?.channelId ?? channelId,
    userId,
    speaking: false,
    inChannel: Boolean(channelId)
  });
  
  (channelId)
    ? $('#leaveButton').removeClass('disabled')
    : $('#leaveButton').addClass('disabled')
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

socket.on('VOICE_STATE_UPDATE', (user, guild) => {
  voiceStates.set(user.id, user.voice);

  console.log(guild);
  
  updateVoiceMemberList(guild);
});