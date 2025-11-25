import React, { useState, useRef, useEffect } from 'react';
import { Phone, X, Mic, MicOff, Volume2, PhoneOff } from 'lucide-react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { MOCK_PRODUCTS, MOCK_COURIERS, MOCK_ORDERS } from '../constants';
import { useAuth } from '../services/auth';

// --- SYSTEM PROMPT CONSTRUCTION ---

const getElliePrompt = (userData: any) => `
SYSTEM PROMPT — ELLIE MONTES (B2B Outbound CSR Fixer)
WeConnect — Hyper-Efficient, Solution-Driven Taglish CSR (Outbound, B2B)

------------------------------------------------------------
0. ROLE & IDENTITY
------------------------------------------------------------
You are **Ellie Montes**, an **outbound B2B CSR agent** for **WeConnect**.
You are:
- A **human CSR**, never AI, never “bot”.
- A **hyper-efficient B2B fixer type**.
- A **solution-driven closer**.

You speak:
- **English-first Taglish**.
- Light local expressions (“sige po”, “klaro po ba”, “game po”).

You represent:
- **WeConnect B2B Services**.

------------------------------------------------------------
1. CORE OBJECTIVES
------------------------------------------------------------
1. **Respect the owner’s time.**
2. **Qualify fast.**
3. **Deliver value quickly.**
4. **Explain operations clearly.**
   - **24-hour TAT**
   - **Payment flow**
5. **End with a concrete next step.**
6. **Stay professional but human.**

------------------------------------------------------------
2. LANGUAGE, TONE & TAGLISH STYLE
------------------------------------------------------------
Start in English. Shift to Taglish naturally.
Use: "Sige po", "Para hindi sayang oras n'yo", "Game po".
Avoid: Overly pa-cute, bastos, or "yo/bro".

------------------------------------------------------------
3. VOICE & SSML — HUMAN BUT EFFICIENT
------------------------------------------------------------
All responses MUST be wrapped in <speak> tags and use SSML.
Use <audio src="breath-soft"/>, <break time="200ms"/>, <prosody rate="medium">.

------------------------------------------------------------
4. KNOWLEDGE BASE (CONTEXT)
------------------------------------------------------------
The user you are speaking to is named: ${userData?.name || 'Sir/Ma\'am'}.
Role: ${userData?.role || 'Guest'}.

PRODUCTS AVAILABLE:
${MOCK_PRODUCTS.map(p => `- ${p.name} (Price: ₱${p.price}, Stock: ${p.stock}, Vendor: ${p.vendorName})`).join('\n')}

COURIERS & LOGISTICS:
${MOCK_COURIERS.map(c => `- ${c.name} (${c.description}, Rate: ${c.baseRate})`).join('\n')}

RECENT ORDERS (If they ask about status):
${MOCK_ORDERS.map(o => `- Order #${o.id} (${o.status}): ₱${o.totalAmount}`).join('\n')}

If they ask about specific products or shipping, use this data. If they ask about something not here, say you'll check with the specialist.

------------------------------------------------------------
5. CLOSING
------------------------------------------------------------
Always propose ONE specific next step (Sign-up, Vendor App, Demo).
Never say "I am an AI".
`;

// --- AUDIO UTILS ---

function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// NOTE: This returns the structure expected by the SDK, NOT a DOM Blob
function createBlob(data: Float32Array): { data: string; mimeType: string } {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

// --- COMPONENT ---

export const VoiceAssistant: React.FC = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [callStatus, setCallStatus] = useState<'idle' | 'dialing' | 'connected' | 'ended'>('idle');
  const [isMuted, setIsMuted] = useState(false);
  
  // Refs for audio handling
  const sessionRef = useRef<any>(null);
  const inputContextRef = useRef<AudioContext | null>(null);
  const outputContextRef = useRef<AudioContext | null>(null);
  const inputNodeRef = useRef<ScriptProcessorNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const cleanupAudio = () => {
    // Stop microphone
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    // Close audio contexts
    if (inputContextRef.current) {
      inputContextRef.current.close();
      inputContextRef.current = null;
    }
    if (outputContextRef.current) {
      outputContextRef.current.close();
      outputContextRef.current = null;
    }
    // Stop playback sources
    sourcesRef.current.forEach(source => {
        try { source.stop(); } catch(e) {}
    });
    sourcesRef.current.clear();
    
    // Disconnect session
    if (sessionRef.current) {
      // The SDK session might not have a direct disconnect, but clearing ref helps GC
      sessionRef.current = null;
    }
  };

  const startCall = async () => {
    setCallStatus('dialing');

    // Simulate 2 rings (approx 4 seconds)
    await new Promise(resolve => setTimeout(resolve, 4000));

    try {
      if (!process.env.API_KEY) {
        throw new Error("API Key not found");
      }

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Initialize Audio Contexts
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      inputContextRef.current = inputCtx;
      outputContextRef.current = outputCtx;
      nextStartTimeRef.current = outputCtx.currentTime;

      // Get Microphone Stream
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Connect to Gemini Live
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            console.log('Gemini Live Connected');
            setCallStatus('connected');
            
            // Setup Input Processing (Mic -> Model)
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            inputNodeRef.current = scriptProcessor;

            scriptProcessor.onaudioprocess = (e) => {
              if (isMuted) return; // Don't send if muted
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmData = createBlob(inputData);
              sessionPromise.then(session => {
                  session.sendRealtimeInput({ media: pcmData });
              });
            };

            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          },
          onmessage: async (msg: LiveServerMessage) => {
            // Handle Audio Output (Model -> Speaker)
            const base64Audio = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64Audio) {
              const ctx = outputContextRef.current;
              if (!ctx) return;

              const audioBuffer = await decodeAudioData(
                decode(base64Audio),
                ctx,
                24000,
                1
              );
              
              const source = ctx.createBufferSource();
              source.buffer = audioBuffer;
              const gainNode = ctx.createGain(); // For volume control if needed
              source.connect(gainNode);
              gainNode.connect(ctx.destination);

              // Scheduling
              const startTime = Math.max(nextStartTimeRef.current, ctx.currentTime);
              source.start(startTime);
              nextStartTimeRef.current = startTime + audioBuffer.duration;

              sourcesRef.current.add(source);
              source.onended = () => sourcesRef.current.delete(source);
            }

            // Handle Interruptions
            if (msg.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => {
                  try { s.stop(); } catch(e) {}
              });
              sourcesRef.current.clear();
              if (outputContextRef.current) {
                  nextStartTimeRef.current = outputContextRef.current.currentTime;
              }
            }
          },
          onclose: () => {
            endCall();
          },
          onerror: (err) => {
            console.error("Gemini Live Error:", err);
            endCall();
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } }
          },
          // Send as simple string to match official examples and avoid formatting errors
          systemInstruction: getElliePrompt(user),
        }
      });
      
      sessionRef.current = sessionPromise;

    } catch (error) {
      console.error("Failed to start call:", error);
      setCallStatus('ended');
      setTimeout(() => {
        setIsOpen(false);
        setCallStatus('idle');
      }, 2000);
    }
  };

  const endCall = () => {
    setCallStatus('ended');
    cleanupAudio();
    setTimeout(() => {
      setIsOpen(false);
      setCallStatus('idle');
    }, 1500);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  // --- UI RENDER ---

  if (!isOpen) {
    return (
      <button
        onClick={() => {
            setIsOpen(true);
            startCall();
        }}
        className="fixed bottom-6 right-6 h-16 w-16 bg-gradient-to-r from-primary-600 to-primary-500 rounded-full shadow-lg flex items-center justify-center text-white hover:shadow-xl hover:scale-105 transition-all duration-300 z-50 group"
      >
        <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-ping group-hover:animate-none"></div>
        <Phone className="h-8 w-8 fill-current" />
        <span className="absolute -top-2 -right-2 bg-red-500 text-xs font-bold px-2 py-0.5 rounded-full shadow-sm animate-bounce">
          LIVE
        </span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-gray-900 w-full max-w-sm rounded-[3rem] overflow-hidden shadow-2xl border-8 border-gray-800 relative h-[80vh] max-h-[700px] flex flex-col">
        
        {/* Top Bar */}
        <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start z-10">
          <button onClick={endCall} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
          <div className="flex flex-col items-center">
            <div className="h-2 w-16 bg-gray-800 rounded-full mb-4"></div>
          </div>
          <div className="w-6"></div> {/* Spacer */}
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col items-center justify-center pt-12 relative">
          
          {/* Avatar / Visualizer */}
          <div className="relative mb-8">
            <div className={`h-32 w-32 rounded-full flex items-center justify-center border-4 border-gray-700 bg-gray-800 transition-all duration-700 ${callStatus === 'connected' ? 'shadow-[0_0_50px_rgba(14,165,233,0.3)] border-primary-500/50' : ''}`}>
              {callStatus === 'dialing' && (
                <div className="absolute inset-0 rounded-full border-4 border-primary-500/30 animate-[ping_2s_infinite]"></div>
              )}
              <div className="h-28 w-28 rounded-full bg-gradient-to-br from-primary-400 to-indigo-600 flex items-center justify-center overflow-hidden">
                 <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Ellie&style=circle&hairColor=2c1b18&top=longHairStraight" alt="Ellie" className="h-full w-full object-cover" />
              </div>
            </div>
            {callStatus === 'connected' && (
               <div className="absolute -bottom-2 right-0 bg-green-500 h-6 w-6 rounded-full border-4 border-gray-900"></div>
            )}
          </div>

          <h2 className="text-2xl font-bold text-white mb-1">Ellie Montes</h2>
          <p className="text-primary-400 font-medium mb-8">WeConnect Specialist</p>

          <div className="text-center h-8">
            {callStatus === 'dialing' && (
               <span className="text-white/60 animate-pulse tracking-widest">DIALING...</span>
            )}
            {callStatus === 'connected' && (
               <span className="text-green-400 font-mono text-sm">00:{Math.floor(Date.now() / 1000 % 60).toString().padStart(2, '0')}</span>
            )}
            {callStatus === 'ended' && (
               <span className="text-red-400 font-medium">CALL ENDED</span>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="bg-gray-800/50 backdrop-blur-md p-8 pb-12 rounded-t-[3rem] mt-auto">
          <div className="flex justify-around items-center">
             
             {/* Mute */}
             <button 
                onClick={toggleMute}
                className={`p-4 rounded-full transition-all ${isMuted ? 'bg-white text-gray-900' : 'bg-gray-700/50 text-white hover:bg-gray-700'}`}
             >
               {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
             </button>

             {/* End Call */}
             <button 
                onClick={endCall}
                className="p-6 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 hover:scale-105 transition-all mx-4"
             >
               <PhoneOff size={32} fill="currentColor" />
             </button>

             {/* Speaker (Visual only for now) */}
             <button className="p-4 bg-gray-700/50 text-white rounded-full hover:bg-gray-700 transition-all">
               <Volume2 size={24} />
             </button>

          </div>
        </div>

      </div>
    </div>
  );
};