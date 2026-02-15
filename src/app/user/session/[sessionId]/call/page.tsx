'use client';
import React, { useEffect, useRef, use } from 'react';
import { useSearchParams } from 'next/navigation';
import { createPeerConnection } from '@/lib/webrtc';
import { getSocket } from '@/lib/socket';
import { VideoPlayer } from '@/components/video/VideoPlayer';
import { ChatBox } from '@/components/video/ChatBox';
import { useNotificationStore } from '@/store/notification-store';
import { useSessionStore } from '@/store/session-store';
import { MicOff, Mic, VideoIcon, VideoOff, PhoneOff } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';

interface PageProps {
  params: Promise<{ sessionId: string }>;
}

export default function UserCallPage({ params }: PageProps) {
  const { sessionId } = use(params);
  const search = useSearchParams();
  const token = search?.get('token') || '';
  const bookingId = sessionId;
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const pushToast = useNotificationStore((state) => state.pushToast);
  const {
    callState,
    muted,
    cameraOff,
    peerConnection,
    socket,
    localStream,
    remoteStream,
    callId,
    setCallState,
    setPeerConnection,
    setSocket,
    setLocalStream,
    setRemoteStream,
    setCallId,
    toggleMute,
    toggleCamera,
    endCall,
    cleanup,
    updateCallStatus
  } = useSessionStore();

  useEffect(() => {
    if (!token) {
      pushToast({ variant: 'error', title: 'No token provided' });
      return;
    }

    const socketInstance = getSocket({ token, bookingId });
    socketInstance.connect();
    setSocket(socketInstance);

    socketInstance.on('connect', async () => {
      setCallState('ringing');
      pushToast({ variant: 'success', title: 'Connected to call' });
      
      // Create call document when user joins (if it doesn't exist)
      if (!callId) {
        try {
          const response = await fetch('/api/calls', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              bookingId: sessionId,
              roomId: `booking:${sessionId}`,
            }),
          });
          if (response.ok) {
            const { data } = await response.json();
            setCallId(data._id);
          }
        } catch (err) {
          console.error('Error creating call:', err);
        }
      }
    });

    socketInstance.on('user:joined', ({ userId, role }) => {
      pushToast({ variant: 'info', title: `${role === 'lawyer' ? 'Lawyer' : 'Client'} joined the call` });
    });

    socketInstance.on('connect_error', (err) => {
      console.error('Socket connect_error (client):', err);
      pushToast({ variant: 'error', title: 'Connection failed', description: err?.message || String(err) });
    });

    // Create peer connection
    const pc = createPeerConnection({
      onTrack: (event) => {
        // Some browsers deliver MediaStream in event.streams, others only provide event.track
        let stream: MediaStream | undefined = event.streams && event.streams[0];
        if (!stream && event.track) {
          stream = new MediaStream([event.track]);
        }
        if (stream) {
          setRemoteStream(stream);
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = stream;
          }
        }
      },
      onIceCandidate: (event) => {
        if (event.candidate) {
          socketInstance.emit('call:ice', { candidate: event.candidate });
        }
      },
      onConnectionStateChange: async () => {
        console.log('Connection state:', pc.connectionState);
        if (pc.connectionState === 'failed') {
          pushToast({ variant: 'error', title: 'Connection failed', description: 'Attempting to reconnect...' });
        } else if (pc.connectionState === 'connected') {
          setCallState('live');
          pushToast({ variant: 'success', title: 'Connection established' });
          
          // Update call status in database
          if (callId) {
            try {
              await fetch(`/api/calls/${callId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'active' }),
              });
            } catch (err) {
              console.error('Error updating call status:', err);
            }
          }
        }
      },
    });
    setPeerConnection(pc);

    // Get user media
    navigator.mediaDevices.getUserMedia({ audio: true, video: true })
      .then((stream) => {
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        // Add tracks defensively: the pc may be closed if a connect_error occurred.
        stream.getTracks().forEach((track) => {
          try {
            if (pc && pc.signalingState !== 'closed') {
              pc.addTrack(track, stream);
            }
          } catch (err) {
            console.warn('Failed to add track to peer connection:', err);
          }
        });
      })
      .catch((err) => {
        pushToast({ variant: 'error', title: 'Media access denied', description: err.message });
      });

    socketInstance.on('call:offer', async (payload) => {
      try {
        console.log('Client received offer');
        await pc.setRemoteDescription(payload as RTCSessionDescriptionInit);
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socketInstance.emit('call:answer', pc.localDescription);
        console.log('Client sent answer');
        pushToast({ variant: 'success', title: 'Call incoming...' });
      } catch (err) {
        console.error('Error handling offer:', err);
      }
    });

    socketInstance.on('call:answer', async (payload) => {
      try {
        await pc.setRemoteDescription(payload as RTCSessionDescriptionInit);
        setCallState('live');
        
        // Update call status in database to mark it as active
        if (callId) {
          await fetch(`/api/calls/${callId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'active' }),
          });
        }
        
        await updateCallStatus('live');
        pushToast({ variant: 'success', title: 'Call connected' });
      } catch (err) {
        console.error('Error handling answer:', err);
      }
    });

    socketInstance.on('call:ice', async (payload: any) => {
      try {
        await pc.addIceCandidate(payload.candidate);
      } catch (err) {
        console.warn('Failed to add ICE candidate:', err);
      }
    });

    socketInstance.on('call:hangup', () => {
      endCall();
    });

    return () => {
      cleanup();
    };
  }, [token, bookingId, pushToast, setCallState, setPeerConnection, setSocket, setLocalStream, setRemoteStream, endCall, cleanup]);

  // Add participant when callId is set
  useEffect(() => {
    if (callId) {
      fetch(`/api/calls/${callId}/participants`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }, [callId]);

  return (
    <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
      <div className="space-y-4">
        <header>
          <p className="text-sm uppercase text-primary">Secure call</p>
          <h1 className="font-display text-3xl text-accent">Session {sessionId}</h1>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              callState === 'live' ? 'bg-green-500' : 
              callState === 'ringing' ? 'bg-yellow-500' : 'bg-gray-400'
            }`} />
            <p className="text-slate-500">
              {callState === 'live' ? 'Connected - Encrypted WebRTC call' : 
               callState === 'ringing' ? 'Connecting...' : 'Waiting for connection'}
            </p>
          </div>
        </header>
        <div className="space-y-4">
          <VideoPlayer ref={remoteVideoRef} />
          <VideoPlayer ref={localVideoRef} muted />
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button variant="ghost" size="icon" onClick={toggleMute} aria-label="Toggle microphone">
            {muted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={toggleCamera} aria-label="Toggle camera">
            {cameraOff ? <VideoOff className="h-5 w-5" /> : <VideoIcon className="h-5 w-5" />}
          </Button>
          <Button variant="outline" className="bg-rose-500 text-white" size="icon" onClick={endCall} aria-label="End call">
            <PhoneOff className="h-5 w-5" />
          </Button>
          {callState === 'ringing' && (
            <div className="text-center">
              <div className="text-sm text-slate-600 mb-2">Waiting for lawyer to start the call...</div>
              <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse mx-auto"></div>
            </div>
          )}
        </div>
      </div>
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Live chat</CardTitle>
            <CardDescription>Share links and notes during the call.</CardDescription>
          </CardHeader>
        </Card>
        <ChatBox role="client" />
      </div>
    </section>
  );
}
