export default class Peer {
  constructor(id, roomId, socket, dispatch) {
    this._id = id;
    this._roomId = roomId;
    this._socket = socket;
    this._rtcPeer = null;
    this._dataChannel = null;
    this._receiveChannel = null;
    this._dispatch = dispatch;

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

    peer.onicecandidate = (e) => this.handleICECandidateEvent(e);
    // peer.ontrack = handleTrackEvent;
    peer.onnegotiationneeded = () => this.handleNegotiationNeededEvent(peer);

    if (caller) {
      this._dataChannel = peer.createDataChannel(this._id);
      this._dataChannel.onmessage = (e) => this.handleMessageReceived(e);

      this._dataChannel.onopen = () => {
        console.log("Caller datachannel opened", this);
      };

      this._dataChannel.onclose = () => {
        console.log("Caller datachannel closed", this);
      };
    } else {
      console.log("waiting for datachannel to open>>>", this);
      peer.ondatachannel = (e) => {
        console.log("datachannel opened>>>", this);
        this._receiveChannel = e.channel;
        this._receiveChannel.onmessage = (e) => this.handleMessageReceived(e);
        console.log("receive channel created>>>>", this);
      };
    }

    return peer;
  }

  handleICECandidateEvent(e) {
    if (e.candidate) {
      const payload = {
        target: this._id,
        caller: this._socket.id,
        candidate: e.candidate,
      };
      console.log("ice candidate emitting...", e);
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
    console.log("new ice candidate", incoming);
    console.log("new ice candidate for", this);
    if (incoming.caller === this._id) {
      console.log("handling new ice candidate...");
      const candidate = new RTCIceCandidate(incoming.candidate);

      this._rtcPeer.addIceCandidate(candidate).catch((e) => console.log(e));
    }
  }

  handleMessageReceived(e) {
    const message = {
      value: e.data,
      yours: false,
      from: this._id,
      time: new Date(),
    };

    console.log(this._dispatch);
    console.log("Got this message>>> ", message);
    this._dispatch({ type: "UPDATE_MESSAGES", payload: message });
  }

  sendMessage(msg) {
    console.log("in send Message>>>", this);
    if (this._receiveChannel) {
      this._receiveChannel.send(msg);
    } else {
      this._dataChannel.send(msg);
    }
  }
}
