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

class Member {
  username = `User${members.cache.length + 1}`;
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

class Members {
  cache = [];

  get(id) {
    let member = this.cache.find(m => m.id === id);
    if (!member) {
      member = new Member(id);
      this.cache.push(member);
    }
    return member;
  }
}


const voiceChannels = [];
voiceChannels.push(new VoiceChannel());

const members = new Members();

module.exports.voiceChannels = voiceChannels;
module.exports.members = members;
module.exports.getGuild = () => ({
  name: 'Some Guild',
  channels: voiceChannels,
  members
});