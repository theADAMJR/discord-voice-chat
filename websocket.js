const { server } = require('./server');
const { members, voiceChannels, getGuild } = require('./mock-api');

const io = require('socket.io').listen(server);

const socketUsers = new Map();

io.on('connection', (socket) => {
  socket.on('READY', (userId) => {
    socket.emit('READY', getGuild());

    socketUsers.set(socket.id, userId);
  });

  socket.on('VOICE_STATE_UPDATE', (state) => {
    const member = members.get(state.userId);
    member.voice = state;

    const channel = voiceChannels
      .find(vc => vc.id === state.channelId);
    if (state.inChannel) {
      channel.add(member)
      socket.join(channel.id);
    } else {
      channel.remove(member);
      socket.leave(channel.id);
    }

    io.sockets.emit('VOICE_STATE_UPDATE', member, getGuild());
  });

  socket.on('disconnect', () => {
    const userId = socketUsers.get(socket.id);
    const member = members.get(userId);
    if (!member) return;
    
    const channel = voiceChannels
      .find(vc => vc.id === member.voice.channelId);
    channel.remove(member);
    
    io.sockets.emit('VOICE_STATE_UPDATE', member, getGuild());
  });
});