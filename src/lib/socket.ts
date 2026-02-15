import { io, type Socket } from 'socket.io-client';

type SignalEvents = {
  'call:offer': (payload: unknown) => void;
  'call:answer': (payload: unknown) => void;
  'call:ice': (payload: unknown) => void;
  'call:hangup': () => void;
  'chat:message': (payload: unknown) => void;
  'user:joined': (payload: { userId: string; role: string }) => void;
};

type GenericSocket = Socket<SignalEvents> & {
  connect?: () => void;
  disconnect?: () => void;
};

const SIGNAL_URL = process.env.NEXT_PUBLIC_SIGNALING_URL;

// Return a new socket instance for each caller. Using a singleton caused
// auth/query mismatches when multiple pages/profiles tried to connect with
// different tokens or bookingIds.
export const getSocket = (opts?: { token?: string; bookingId?: string }) => {
  if (!SIGNAL_URL) {
    // Provide a no-op socket to avoid runtime checks in environments without signaling
    const noop: Partial<GenericSocket> = {
      on: () => noop as GenericSocket,
      off: () => noop as GenericSocket,
      emit: () => noop as GenericSocket,
      connect: () => noop as GenericSocket,
      disconnect: () => noop as GenericSocket,
    };
    return noop as GenericSocket;
  }

  try {
    const socket = io(SIGNAL_URL, {
      autoConnect: false,
      transports: ['websocket'],
      auth: opts?.token ? { token: opts.token } : undefined,
      query: opts?.bookingId ? { bookingId: opts.bookingId } : undefined,
    }) as GenericSocket;
    return socket;
  } catch (error) {
    const noop: Partial<GenericSocket> = {
      on: () => noop as GenericSocket,
      off: () => noop as GenericSocket,
      emit: () => noop as GenericSocket,
      connect: () => noop as GenericSocket,
      disconnect: () => noop as GenericSocket,
    };
    return noop as GenericSocket;
  }
};
