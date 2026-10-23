import React, { useState, useEffect } from 'react';
import Lenis from 'lenis';
import { LuxePlatform } from './components/LuxePlatform';
import { useSwarmSSE } from './hooks/useSwarmSSE';
import { API_BASE_URL } from './config/api';
import type { DemoProfile } from './types/swarm';

export function App() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [selectedDemoProfile, setSelectedDemoProfile] = useState<DemoProfile | null>(null);
  const [demoProfiles, setDemoProfiles] = useState<DemoProfile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  // SSE streaming hook
  const { events, swarmState, isRunning, isCompleted } = useSwarmSSE(sessionId);

  // Initialize Lenis Smooth Scroll
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  // Ensure clean white theme
  useEffect(() => {
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.remove('light');
  }, []);

  // Load demo profiles on mount
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/demo/profiles`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        setDemoProfiles(data);
        if (data.length > 0 && !selectedDemoProfile) {
          setSelectedDemoProfile(data[0]);
        }
      })
      .catch((err) => console.warn('Could not fetch demo profiles:', err));
  }, []);

  const handleSelectProfile = (profile: DemoProfile) => {
    setSelectedDemoProfile(profile);
  };

  const handleSubmitSearch = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      const resp = await fetch(`${API_BASE_URL}/api/swarm/start`, {
        method: 'POST',
        body: formData,
      });
      if (resp.ok) {
        const data = await resp.json();
        setSessionId(data.session_id);
      } else {
        alert('Failed to initialize research search.');
      }
    } catch (err) {
      console.error(err);
      alert(`Error connecting to backend API at ${API_BASE_URL || 'host'}. Please ensure backend is running.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegenerateSOP = async (opportunityId: string) => {
    if (!sessionId) return;
    setIsRegenerating(true);
    try {
      await fetch(`${API_BASE_URL}/api/swarm/regenerate_sop`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, opportunity_id: opportunityId }),
      });
    } catch (err) {
      console.error('Failed to regenerate SOP:', err);
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <LuxePlatform
      demoProfiles={demoProfiles}
      selectedProfile={selectedDemoProfile}
      onSelectProfile={handleSelectProfile}
      onSubmitSearch={handleSubmitSearch}
      isLoading={isSubmitting}
      swarmState={swarmState}
      events={events}
      isRunning={isRunning}
      isCompleted={isCompleted}
      onRegenerateSOP={handleRegenerateSOP}
      isRegenerating={isRegenerating}
    />
  );
}

export default App;
