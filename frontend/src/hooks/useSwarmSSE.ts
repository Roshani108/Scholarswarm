import { useState, useEffect, useRef, useCallback } from 'react';
import { AgentEvent, SwarmState } from '../types/swarm';
import { API_BASE_URL } from '../config/api';

export function useSwarmSSE(sessionId: string | null) {
  const [events, setEvents] = useState<AgentEvent[]>([]);
  const [swarmState, setSwarmState] = useState<SwarmState | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  const fetchFullState = useCallback(async (sid: string) => {
    try {
      const resp = await fetch(`${API_BASE_URL}/api/swarm/state/${sid}`);
      if (resp.ok) {
        const data = await resp.json();
        setSwarmState(data);
      }
    } catch (err) {
      console.error('Error fetching final swarm state:', err);
    }
  }, []);

  useEffect(() => {
    if (!sessionId) {
      setEvents([]);
      setSwarmState(null);
      setIsRunning(false);
      setIsCompleted(false);
      setError(null);
      return;
    }

    setIsRunning(true);
    setIsCompleted(false);
    setError(null);

    const es = new EventSource(`${API_BASE_URL}/api/swarm/stream/${sessionId}`);
    eventSourceRef.current = es;

    es.addEventListener('agent_event', (e: MessageEvent) => {
      try {
        const parsed: AgentEvent = JSON.parse(e.data);
        setEvents((prev) => [...prev, parsed]);
      } catch (err) {
        console.error('Failed to parse SSE event:', err);
      }
    });

    es.addEventListener('end', async () => {
      setIsRunning(false);
      setIsCompleted(true);
      es.close();
      await fetchFullState(sessionId);
    });

    es.onerror = async (err) => {
      console.warn('SSE stream closed or completed:', err);
      es.close();
      setIsRunning(false);
      await fetchFullState(sessionId);
    };

    return () => {
      es.close();
    };
  }, [sessionId, fetchFullState]);

  return {
    events,
    swarmState,
    isRunning,
    isCompleted,
    error,
    refreshState: () => sessionId && fetchFullState(sessionId)
  };
}
