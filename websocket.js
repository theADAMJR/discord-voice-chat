const { server } = require('./server');
const { users, voiceChannels, getGuild } = require('./mock-api');

const io = require('socket.io').listen(server);

io.on('connection', (socket) => {
  socket.on('VIEW_GUILD',
    () => socket.emit('VIEW_GUILD', getGuild()));

  socket.on('VOICE_STATE_UPDATE', (state) => {
    const user = users.get(state.userId);
    user.voice = state;

    const channel = voiceChannels
      .find(vc => vc.id === state.channelId);
    (state.inChannel)
      ? channel.add(user)
      : channel.remove(user);

    socket.join(channel?.id);
    io.sockets.emit('VOICE_STATE_UPDATE', user, getGuild());
  });
});