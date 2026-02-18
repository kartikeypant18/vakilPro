'use client';
import React, { useEffect, useRef, use, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { createPeerConnection } from '@/lib/webrtc';
import { getSocket } from '@/lib/socket';
import { VideoPlayer } from '@/components/video/VideoPlayer';
import { ChatBox } from '@/components/video/ChatBox';
import { useNotificationStore } from '@/store/notification-store';
import { useSessionStore } from '@/store/session-store';
import { MicOff, Mic, VideoIcon, VideoOff, PhoneOff, Clock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';

interface PageProps {
  params: Promise<{ sessionId: string }>;
}

export default function UserCallPage({ params }: PageProps) {
  const { sessionId } = use(params);
  const search = useSearchParams();
  const token = search?.get('token') || '';
  
  // State for participant names - decode from JWT token
  const [clientName, setClientName] = useState<string>('Client');
  const [lawyerName, setLawyerName] = useState<string>('Lawyer');
  
  // Decode names from JWT token
  useEffect(() => {
    if (token) {
      try {
        // Decode JWT payload (base64)
        const payloadBase64 = token.split('.')[1];
        const payload = JSON.parse(atob(payloadBase64));
        console.log('JWT Payload:', payload);
        if (payload.clientName) setClientName(payload.clientName);
        if (payload.lawyerName) setLawyerName(payload.lawyerName);
      } catch (err) {
        console.error('Error decoding token:', err);
      }
    }
  }, [token]);
  
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

  // Timer state
  const [slot, setSlot] = useState<string | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0); // seconds
  const [timerActive, setTimerActive] = useState(false);

  // Fetch booking info for slot
  useEffect(() => {
    if (!bookingId) return;
    fetch(`/api/bookings/${bookingId}`)
      .then(res => res.json())
      .then(data => {
        const booking = data?.data || data;
        if (booking?.slot && booking?.date) {
          setSlot(booking.slot);
          setDate(booking.date);
        }
      });
  }, [bookingId]);

  // Parse slot and start timer (use today's date for countdown)
  useEffect(() => {
    if (!slot) return;
    // slot format: "18:34 - 19:37"
    const [, end] = slot.split(' - ');
    const [endHour, endMin] = end.split(':');
    const now = new Date();
    const endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), parseInt(endHour), parseInt(endMin), 0);
    const diff = Math.max(0, Math.floor((endDate.getTime() - now.getTime()) / 1000));
    setTimeLeft(diff);
    setTimerActive(diff > 0);
  }, [slot]);

  // Countdown effect
  useEffect(() => {
    if (!timerActive || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          setTimerActive(false);
          // Optionally auto-end call
          // endCall();
          pushToast({ variant: 'error', title: 'Call time ended', description: 'Your slot has expired.' });
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  // Format timer
  function formatTime(sec: number) {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    if (h === 0) {
      // Show mm:ss
      return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    } else {
      // Show hh:mm
      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    }
  }

  // Setup socket and peer connection
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
    <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-5rem)]">
      {/* Main video section */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Status bar */}
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-3">
            <div className={`w-2.5 h-2.5 rounded-full ${
              callState === 'live' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 
              callState === 'ringing' ? 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.6)] animate-pulse' : 'bg-gray-400'
            }`} />
            <div>
              <h2 className="font-semibold text-gray-800 text-sm">
                {callState === 'live' ? 'Call Connected' : 
                 callState === 'ringing' ? 'Connecting...' : 'Waiting for connection'}
              </h2>
              <p className="text-xs text-gray-400">Encrypted WebRTC &bull; {sessionId.slice(0, 8)}&hellip;</p>
            </div>
          </div>
          {timerActive && (
            <div className={`flex items-center gap-2.5 rounded-full px-4 py-2 border transition-colors ${
              timeLeft < 300 ? 'bg-red-50 border-red-200' : 
              timeLeft < 900 ? 'bg-amber-50 border-amber-200' : 'bg-emerald-50 border-emerald-200'
            }`}>
              <Clock className={`h-4 w-4 ${
                timeLeft < 300 ? 'text-red-500' : 
                timeLeft < 900 ? 'text-amber-500' : 'text-emerald-500'
              }`} />
              <span className={`font-mono font-bold text-lg tracking-tight ${
                timeLeft < 300 ? 'text-red-600' : 
                timeLeft < 900 ? 'text-amber-600' : 'text-emerald-600'
              }`}>{formatTime(timeLeft)}</span>
            </div>
          )}
        </div>

        {/* Video container */}
        <div className="flex-1 bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl overflow-hidden relative min-h-0">
          <div className="grid grid-rows-2 gap-2 p-2.5 h-full">
            <div className="min-h-0 rounded-xl overflow-hidden">
              <VideoPlayer ref={remoteVideoRef} name={lawyerName} />
            </div>
            <div className="min-h-0 rounded-xl overflow-hidden">
              <VideoPlayer ref={localVideoRef} muted name={clientName} />
            </div>
          </div>
          {callState === 'ringing' && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-20 rounded-2xl">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full border-[3px] border-white/20 border-t-white animate-spin mx-auto mb-3" />
                <p className="text-white/90 font-medium text-sm">Waiting for lawyer to join&hellip;</p>
              </div>
            </div>
          )}
        </div>

        {/* Control bar */}
        <div className="flex justify-center py-3">
          <div className="inline-flex items-center gap-1.5 bg-slate-800 rounded-full px-4 py-2.5 shadow-xl shadow-slate-900/20">
            <button onClick={toggleMute} className={`p-3 rounded-full transition-all duration-200 ${
              muted ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' : 'text-white/80 hover:bg-white/10 hover:text-white'
            }`} aria-label="Toggle microphone">
              {muted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </button>
            <button onClick={toggleCamera} className={`p-3 rounded-full transition-all duration-200 ${
              cameraOff ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' : 'text-white/80 hover:bg-white/10 hover:text-white'
            }`} aria-label="Toggle camera">
              {cameraOff ? <VideoOff className="h-5 w-5" /> : <VideoIcon className="h-5 w-5" />}
            </button>
            <div className="w-px h-6 bg-slate-600 mx-1.5" />
            <button onClick={endCall} className="p-3 rounded-full bg-red-500 hover:bg-red-600 text-white transition-all duration-200 shadow-lg shadow-red-500/30" aria-label="End call">
              <PhoneOff className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-full lg:w-80 flex flex-col gap-3 min-h-0">
        <Card className="shadow-none border-slate-100">
          <CardHeader>
            <CardTitle>Live chat</CardTitle>
            <CardDescription>Share links and notes during the call.</CardDescription>
          </CardHeader>
        </Card>
        <div className="flex-1 min-h-0">
          <ChatBox role="client" />
        </div>
      </div>
    </div>
  );
}
