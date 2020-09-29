class AudioSources {
  #sources = new Map();

  play(id, stream) {
    if (id === userId) return;

    const video = document.createElement('video');
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => video.play());

    this.#sources.set(id, video);
  }

  stop(id) {
    const video = this.#sources.get(id);
    if (!video) return;

    const stream = video.srcObject;
    stream
      .getTracks()
      .forEach(track => track.stop());
    video.srcObject = null;

    this.#sources.delete(id);
  }

  stopAll() {
    for (const key of this.#sources.keys())
      this.stop(key);
  }
}

const audio = new AudioSources();