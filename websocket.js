const { server } = require('./server');
const { members, voiceChannels, getGuild } = require('./mock-api');

const io = require('socket.io').listen(server);

io.on('connection', (socket) => {
  socket.on('READY', () => socket.emit('READY', getGuild()));

  socket.on('VOICE_STATE_UPDATE', (state) => {
    const user = members.get(state.userId);
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

    io.sockets.emit('VOICE_STATE_UPDATE', user, getGuild());
  });
});