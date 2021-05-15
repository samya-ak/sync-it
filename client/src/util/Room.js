class Room {
  constructor(id) {
    this._id = id;
    this._peers = new Map();
  }

  set peers(peer) {
    this._peers.set(peer.id, peer);
  }

  get peers() {
    return this._peers;
  }

  get id() {
    return this._id;
  }
}

export default Room;
