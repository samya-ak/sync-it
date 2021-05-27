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

    this._sfuPeer.onnegotiationneeded = () =>
      this.handleNegotiationNeededEvent();
    if (!this._isBroadcaster) {
      this._sfuPeer.ontrack = (e) => this.handleTrackEvent(e);
      this._sfuPeer.addTransceiver("video", { direction: "recvonly" });
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

  handleNegotiationNeededEvent = async () => {
    console.log("inside handleNegotiationNeededEvent");
    const offer = await this._sfuPeer.createOffer();
    await this._sfuPeer.setLocalDescription(offer);
    const payload = {
      sdp: this._sfuPeer.localDescription,
      username: this._self.name,
      room: this._self.room,
    };

    let response;
    try {
      if (this._isBroadcaster) {
        console.log("broadcasting>>>>", this);
        response = await fetch("/broadcast", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }).then((response) => {
          return response.json();
        });
      } else {
        console.log("consuming>>>>", this);
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
      console.error(e);
    }
  };

  handleTrackEvent(e) {
    console.log("Received video stream >>>>>>>>", e.streams[0]);
    const container = document.getElementById("video-stream-container");
    let videoElement = document.createElement("video");
    videoElement.controls = false;
    videoElement.autoplay = true;
    videoElement.style.width = "inherit";
    videoElement.srcObject = e.streams[0];
    container.append(videoElement);
  }
}

export default SFUPeer;
