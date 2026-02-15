export const defaultRtcConfig: RTCConfiguration = {
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
};

export function createPeerConnection({
  onTrack,
  onIceCandidate,
  onConnectionStateChange,
}: {
  onTrack?: (event: RTCTrackEvent) => void;
  onIceCandidate?: (event: RTCPeerConnectionIceEvent) => void;
  onConnectionStateChange?: () => void;
}) {
  const peer = new RTCPeerConnection(defaultRtcConfig);

  if (onTrack) {
    peer.ontrack = onTrack;
  }
  if (onIceCandidate) {
    peer.onicecandidate = onIceCandidate;
  }

  if (onConnectionStateChange) {
    peer.onconnectionstatechange = onConnectionStateChange;
  }

  return peer;
}
