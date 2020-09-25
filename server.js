const express = require('express');
const app = express();

const server = require('http').Server(app);
const io = require('socket.io')(server);

app.set('view engine', 'pug');

app.use(express.static(__dirname + '/assets'));

const voiceChannels = new Map();
getVoice('1');
getVoice('2');

const user = {
  id: '218459216145285121',
  username: 'ADAMJR',
  voice: {
    channelId: null,
    join: (channelId) => {
      user.voice.leave();
      
      getVoice(channelId).memberIds.push(user.id);
      user.voice.channelId = channelId;
    },
    leave: () => {
      if (!user.voice.channelId) return; // FIXME: throw error

      const memberIds = getVoice(user.voice.channelId).memberIds;
      const index = memberIds.indexOf(user.id);
      memberIds.splice(index, 1);
    
      user.voice.channelId = null;
    }
  }
}

app.get('/', (req, res) => res.render('index'));

// VOICE
app.get('/join-voice/:channelId', (req, res) => {
  if (user.voice.channelId)
    user.voice.leave();

  user.voice.join(req.params.channelId);

  res.redirect('/');
});

app.get('/leave-voice', (req, res) => {
  user.voice.leave();

  res.redirect('/');
});

app.listen(3000, () => console.log('Server is live on port 3000'));

app.locals.getVoice = getVoice;
app.locals.getUser = (id) => user;
app.locals.voiceChannels = voiceChannels;

function getVoice(channelId) {
  return voiceChannels.get(channelId)
    ?? voiceChannels
      .set(channelId, { memberIds: [] })
      .get(channelId);
}

// VOICE CONNECTIONS
io.on('connection', (socket) => {
  socket.on('join-room', (roomId, userId) => {
    console.log(roomId, userId);
  });
});