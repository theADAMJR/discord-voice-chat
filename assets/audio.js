class AudioSources {
  sources = new Map();

  play(id, stream) {
    if (id === userId) return;

    const video = document.createElement('video');
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => video.play());

    this.sources.set(id, video);
  }

  stop(id) {
    const source = this.sources.get(id);
    source?.remove();

    this.sources.delete(id);
  }

  stopAll() {
    for (const entry of this.sources.entries()) {
      const video = entry[1];
      video.remove();

      const id = entry[0];
      this.sources.delete(id);
    }
  }
}

const audio = new AudioSources();