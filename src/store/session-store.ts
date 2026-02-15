'use client';

import { create } from 'zustand';

export type CallState = 'idle' | 'otp' | 'ringing' | 'live' | 'ended';

type ChatMessage = {
  id: string;
  sender: 'client' | 'lawyer';
  content: string;
  timestamp: string;
};

interface SessionStore {
  sessionId: string | null;
  bookingId: string | null;
  callState: CallState;
  otpVerified: boolean;
  muted: boolean;
  cameraOff: boolean;
  chatMessages: ChatMessage[];
  // WebRTC state
  peerConnection: RTCPeerConnection | null;
  socket: any | null;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  callId: string | null;
  setSession: (sessionId: string, bookingId: string) => void;
  setCallState: (state: CallState) => void;
  verifyOtp: (code: string) => boolean;
  toggleMute: () => void;
  toggleCamera: () => void;
  addMessage: (message: ChatMessage) => void;
  endCall: () => void;
  // WebRTC methods
  setPeerConnection: (pc: RTCPeerConnection | null) => void;
  setSocket: (socket: any | null) => void;
  setLocalStream: (stream: MediaStream | null) => void;
  setRemoteStream: (stream: MediaStream | null) => void;
  setCallId: (callId: string | null) => void;
  updateCallStatus: (status: 'live' | 'ended') => Promise<void>;
  cleanup: () => void;
}

export const useSessionStore = create<SessionStore>((set, get) => ({
  sessionId: null,
  bookingId: null,
  callState: 'idle',
  otpVerified: false,
  muted: false,
  cameraOff: false,
  chatMessages: [],
  // WebRTC state
  peerConnection: null,
  socket: null,
  localStream: null,
  remoteStream: null,
  callId: null,
  setSession: (sessionId, bookingId) => set({ sessionId, bookingId, callState: 'otp', otpVerified: false }),
  setCallState: (state) => set({ callState: state }),
  verifyOtp: (code) => {
    const isValid = code === '123456';
    if (isValid) {
      set({ otpVerified: true, callState: 'ringing' });
    }
    return isValid;
  },
  toggleMute: () => {
    const { localStream, muted } = get();
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        // Toggle actual track state
        audioTrack.enabled = !audioTrack.enabled;
        // Update state to reflect the new track state
        set({ muted: !audioTrack.enabled });
      }
    }
  },
  toggleCamera: () => {
    const { localStream, cameraOff } = get();
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        // Toggle actual track state
        videoTrack.enabled = !videoTrack.enabled;
        // Update state to reflect the new track state
        set({ cameraOff: !videoTrack.enabled });
      }
    }
  },
  addMessage: (message) => set((state) => ({ chatMessages: [...state.chatMessages, message] })),
  endCall: async () => {
    const { peerConnection, socket, localStream, remoteStream, callId } = get();
    if (peerConnection) {
      peerConnection.close();
    }
    if (socket) {
      socket.disconnect();
    }
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    if (remoteStream) {
      remoteStream.getTracks().forEach(track => track.stop());
    }
    if (callId) {
      // Call API to end call
      try {
        await fetch(`/api/calls/${callId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: 'ended' }),
        });
      } catch (error) {
        console.error('Error ending call:', error);
      }
    }
    set({
      callState: 'ended',
      peerConnection: null,
      socket: null,
      localStream: null,
      remoteStream: null,
      callId: null
    });
  },
  // WebRTC methods
  setPeerConnection: (pc) => set({ peerConnection: pc }),
  setSocket: (socket) => set({ socket }),
  setLocalStream: (stream) => set({ localStream: stream }),
  setRemoteStream: (stream) => set({ remoteStream: stream }),
  setCallId: (callId) => set({ callId }),
  updateCallStatus: async (status: 'live' | 'ended') => {
    const { callId } = get();
    if (callId) {
      try {
        await fetch(`/api/calls/${callId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status }),
        });
      } catch (error) {
        console.error('Error updating call status:', error);
      }
    }
  },
  cleanup: () => {
    const { peerConnection, socket, localStream, remoteStream } = get();
    if (peerConnection) {
      peerConnection.close();
    }
    if (socket) {
      socket.disconnect();
    }
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    if (remoteStream) {
      remoteStream.getTracks().forEach(track => track.stop());
    }
    set({
      peerConnection: null,
      socket: null,
      localStream: null,
      remoteStream: null,
      callId: null
    });
  },
}));
