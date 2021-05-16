export default class Peer {
  constructor(id, roomId, socket) {
    this._id = id;
    this._roomId = roomId;
    this._socket = socket;
    this._rtcPeer = null;
    this._dataChannel = null;
    this._receiveChannel = null;

    this._socket.on("offer", this.handleRecieveCall.bind(this));

    this._socket.on("answer", this.handleAnswer.bind(this));

    this._socket.on("ice-candidate", this.handleNewICECandidateMsg.bind(this));
  }

  get id() {
    return this._id;
  }

  call() {
    this._rtcPeer = this.createRTCPeer(true);
  }

  createRTCPeer(caller = false) {
    const peer = new RTCPeerConnection({
      iceServers: [
        {
          urls: "stun:stun.stunprotocol.org",
        },
        {
          urls: "turn:numb.viagenie.ca",
          credential: "muazkh",
          username: "webrtc@live.com",
        },
      ],
    });

    if (caller) {
      this._dataChannel = peer.createDataChannel("channel");
      this._dataChannel.onmessage = (e) => this.handleMessageReceived(e);
    } else {
      peer.ondatachannel = (e) => {
        this._receiveChannel = e.channel;
        this._receiveChannel.onmessage = (e) => this.handleMessageReceived(e);
        console.log("receive channel created>>>>", this);
      };
    }

    peer.onicecandidate = (e) => this.handleICECandidateEvent(e);
    // peer.ontrack = handleTrackEvent;
    peer.onnegotiationneeded = () => this.handleNegotiationNeededEvent(peer);

    return peer;
  }

  handleICECandidateEvent(e) {
    if (e.candidate) {
      const payload = {
        target: this._id,
        candidate: e.candidate,
      };
      this._socket.emit("ice-candidate", payload);
    }
  }

  handleNegotiationNeededEvent(peer) {
    this._rtcPeer
      .createOffer()
      .then((offer) => {
        return this._rtcPeer.setLocalDescription(offer);
      })
      .then(() => {
        const payload = {
          target: this._id,
          caller: this._socket.id,
          sdp: this._rtcPeer.localDescription,
        };
        this._socket.emit("offer", payload);
        console.log("offer emitted>>>>", payload);
      })
      .catch((e) => console.log(e));
  }

  handleRecieveCall(incoming) {
    if (incoming.caller === this._id) {
      console.log("handle receive call fired>>>", incoming);
      console.log("handle receive call fired for>>>", this);
      this._rtcPeer = this.createRTCPeer();
      const desc = new RTCSessionDescription(incoming.sdp);
      this._rtcPeer
        .setRemoteDescription(desc)
        .then(() => {
          return this._rtcPeer.createAnswer();
        })
        .then((answer) => {
          return this._rtcPeer.setLocalDescription(answer);
        })
        .then(() => {
          const payload = {
            target: incoming.caller,
            caller: incoming.target,
            sdp: this._rtcPeer.localDescription,
          };
          console.log("answer emitted", payload);
          this._socket.emit("answer", payload);
        });
    }
  }

  handleAnswer(message) {
    console.log("Answer>>>", message);
    console.log("Answer for this>>>>", this);
    if (message.caller === this._id) {
      console.log("inside if");
      const desc = new RTCSessionDescription(message.sdp);
      this._rtcPeer.setRemoteDescription(desc).catch((e) => console.log(e));
    }
  }

  handleNewICECandidateMsg(incoming) {
    if (incoming.caller === this._id) {
      const candidate = new RTCIceCandidate(incoming);

      this._rtcPeer.addIceCandidate(candidate).catch((e) => console.log(e));
    }
  }

  handleMessageReceived(e) {
    console.log("Got this message>>> ", e.data);
  }

  sendMessage(msg) {
    //if there is this._socket I am the caller else I am callee
    console.log("in send Message>>>", this);
    if (this._receiveChannel) {
      this._receiveChannel.send(msg);
    } else {
      this._dataChannel.send(msg);
    }
  }
}
