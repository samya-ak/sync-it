class SFUPeer {
  constructor(isBroadcaster, videoStream, self) {
    this._isBroadcaster = isBroadcaster;
    this._stream = videoStream;
    this._self = self;
    this._sfuPeer = new RTCPeerConnection({
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

    self.socket.on("sfu-ice-candidate", this.handleSfuIceCandidate.bind(this));
    this._sfuPeer.onicecandidate = (e) => this.handleICECandidateEvent(e);
    this._sfuPeer.onnegotiationneeded = () =>
      this.handleNegotiationNeededEvent();

    if (!this._isBroadcaster) {
      this._sfuPeer.addTransceiver("video", { direction: "recvonly" });
      this._sfuPeer.addTransceiver("audio", { direction: "recvonly" });
      this._sfuPeer.ontrack = (e) => this.handleTrackEvent(e);
    } else {
      console.log(
        "adding stream to broadcaster.------->",
        this._stream.getTracks()
      );
      this._stream
        .getTracks()
        .forEach((track) => this._sfuPeer.addTrack(track, this._stream));
    }
    console.log("creating sfu peer ----->", this);
  }

  set stream(videoStream) {
    this._stream = videoStream;
    // this._stream
    //   .getTracks()
    //   .forEach((track) => this._sfuPeer.addTrack(track, this._stream));
  }

  handleSfuIceCandidate = (incoming) => {
    const candidate = new RTCIceCandidate(incoming.candidate);
    this._sfuPeer.addIceCandidate(candidate).catch((e) => console.log(e));
    console.log("Sfu ice candidate added>>>>>");
  };

  handleNegotiationNeededEvent = async () => {
    console.log("inside handleNegotiationNeededEvent");
    const offer = await this._sfuPeer.createOffer();
    await this._sfuPeer.setLocalDescription(offer);
    const payload = {
      id: this._self.id,
      room: this._self.room,
      sdp: this._sfuPeer.localDescription,
      username: this._self.name,
    };

    let response;
    try {
      if (this._isBroadcaster) {
        console.log("broadcasting>>>>", payload);
        response = await fetch("/broadcast", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }).then((response) => {
          return response.json();
        });
        this._self.socket.emit("broadcasting", { room: this._self.room });
      } else {
        console.log("consuming>>>>", payload);
        response = await fetch("/consume", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }).then((response) => {
          return response.json();
        });
      }
      console.log(
        "Response for broadcasting or consuming-----------",
        response
      );
      const desc = new RTCSessionDescription(response.sdp);
      this._sfuPeer.setRemoteDescription(desc).catch((e) => console.log(e));
    } catch (e) {
      console.error("Error in consuming stream: ", e);
    }
  };

  handleICECandidateEvent = async (e) => {
    if (e.candidate) {
      const payload = {
        id: this._self.id,
        room: this._self.room,
        candidate: e.candidate,
        username: this._self.name,
      };
      let response = await fetch("/ice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }).then((response) => {
        return response.json();
      });
      console.log("ice candidate emitting for video streaming...", e, response);
    }
  };

  handleTrackEvent(e) {
    const media = e.streams[0];
    console.log("Received video stream >>>>>>>>", media.getTracks());
    console.log("Media is active?>>>", media.active);
    if (!document.getElementById("video-consumer")) {
      const container = document.getElementById("video-stream-container");
      const selector = document.getElementById("video-selector");
      let videoElement = document.createElement("video");
      videoElement.id = "video-consumer";
      videoElement.controls = true;
      videoElement.autoplay = false;
      videoElement.style.width = "100%";
      videoElement.style.maxHeight = "403px";
      videoElement.srcObject = e.streams[0];
      selector.remove();
      container.append(videoElement);
    }
  }
}

export default SFUPeer;
