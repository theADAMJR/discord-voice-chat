class VoiceChannel {
  id = 'vc_1';
  members = [];
  type = 'VOICE';

  add(member) {
    const inChannel = this.members.some(m => m.id === member.id);
    if (inChannel) return;

    this.members.push({
      id: member.id,
      username: member.username,
      avatarURL: member.avatarURL
    });
  }
  remove(member) {
    const index = this.members.findIndex(m => m.id === member.id);
    this.members.splice(index, 1);
  }
}

class User {
  username = `User${users.users.size + 1}`;
  voice = new UserVoiceState();
  avatarURL = 'https://cdn.discordapp.com/embed/avatars/0.png';

  constructor(id) { this.id = id; }
}

class UserVoiceState {
  channelId = null;
  speaking = false;
  userId = null;
  inChannel = false;
}

class Users {
  users = new Map();

  get(id) {
    return this.users.get(id)
      ?? this.users
        .set(id, new User(id))
        .get(id);
  }
}


const voiceChannels = [];
voiceChannels.push(new VoiceChannel());

const users = new Users();

module.exports.voiceChannels = voiceChannels;
module.exports.users = users;
module.exports.getGuild = () => ({
  name: 'Some Guild',
  channels: voiceChannels
});