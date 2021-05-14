export default class Peer {
  constructor(id, roomId, socket) {
    this._id = id;
    this._roomId = roomId;
    this._socket = socket;
  }

  get id() {
    return this._id;
  }
}
