const { server } = require('./server');
const { users, voiceChannels, getGuild } = require('./mock-api');

const io = require('socket.io').listen(server);

io.on('connection', (socket) => {
  socket.on('VOICE_STATE_UPDATE', (state, peerId) => {
    console.log('VOICE_STATE_UPDATE');
    const user = users.get(state.userId);
    user.voice = state;

    const channel = voiceChannels
      .find(vc => vc.id === state.channelId);
    if (state.inChannel) {
      channel.add(user)
      socket.join(channel.id);
    } else {
      channel.remove(user);
      socket.leave(channel.id);
    }

    io.sockets.emit('VOICE_STATE_UPDATE', user, getGuild(), peerId);
  });
});