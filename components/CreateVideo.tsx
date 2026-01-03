
import React, { useState, useEffect } from 'react';
import { generateVideo, generateThumbnail } from '../services/geminiService';
import { GeneratedAsset } from '../types';

interface CreateVideoProps {
  onAssetCreated: (asset: GeneratedAsset) => void;
}

// Fixed: Removed the manual declare global block for window.aistudio.
// The environment already provides a pre-configured AIStudio type, and re-declaring it 
// here caused conflicts with property modifiers and type definitions.

const CreateVideo: React.FC<CreateVideoProps> = ({ onAssetCreated }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [hasKey, setHasKey] = useState(false);

  useEffect(() => {
    checkApiKey();
  }, []);

  const checkApiKey = async () => {
    try {
      // Accessing aistudio which is assumed to be globally available and pre-configured
      const selected = await window.aistudio.hasSelectedApiKey();
      setHasKey(selected);
    } catch (e) {
      console.error("API check error", e);
    }
  };

  const handleSelectKey = async () => {
    await window.aistudio.openSelectKey();
    // Mitigating race condition by assuming success after opening dialog
    setHasKey(true);
  };

  const handleGenerate = async (type: 'video' | 'image') => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);
    setProgress(`Starting ${type} generation...`);

    try {
      if (type === 'video') {
        const url = await generateVideo(prompt, setProgress);
        onAssetCreated({
          id: Math.random().toString(36).substr(2, 9),
          type: 'video',
          url,
          prompt,
          timestamp: Date.now()
        });
      } else {
        const url = await generateThumbnail(prompt);
        onAssetCreated({
          id: Math.random().toString(36).substr(2, 9),
          type: 'image',
          url,
          prompt,
          timestamp: Date.now()
        });
      }
      setPrompt('');
    } catch (err: any) {
      console.error(err);
      // Resetting key selection state if session expired or key is invalid
      if (err.message?.includes("Requested entity was not found")) {
        setHasKey(false);
        setError("API Key session expired. Please re-select your key.");
      } else {
        setError(err.message || "Failed to generate asset. Please try again.");
      }
    } finally {
      setLoading(false);
      setProgress('');
    }
  };

  if (!hasKey) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center h-full space-y-6">
        <div className="w-20 h-20 bg-pink-500/20 rounded-full flex items-center justify-center">
          <i className="fa-solid fa-key text-3xl text-pink-500"></i>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-2">Unlock Creation</h2>
          <p className="text-gray-400 max-w-sm">
            Video generation requires a Google Cloud API Key with billing enabled.
            Check the <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="text-pink-400 underline">billing docs</a> for details.
          </p>
        </div>
        <button 
          onClick={handleSelectKey}
          className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition"
        >
          Select API Key
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 h-full flex flex-col space-y-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold gradient-text">Create Magic</h2>
        <p className="text-gray-400">Describe what you want to see, and let Gemini build it.</p>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="A neon cyberpunk cat flying through Tokyo at night..."
            className="w-full h-32 bg-zinc-900 border border-white/10 rounded-2xl p-4 text-white placeholder-gray-600 focus:outline-none focus:border-pink-500 transition resize-none"
            disabled={loading}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleGenerate('video')}
            disabled={loading || !prompt}
            className="flex items-center justify-center gap-2 py-4 bg-white text-black font-bold rounded-xl disabled:opacity-50 hover:bg-gray-200 transition shadow-xl shadow-white/5"
          >
            {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-video"></i>}
            Generate Video
          </button>
          <button
            onClick={() => handleGenerate('image')}
            disabled={loading || !prompt}
            className="flex items-center justify-center gap-2 py-4 glass border-white/20 text-white font-bold rounded-xl disabled:opacity-50 hover:bg-white/10 transition"
          >
            {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-image"></i>}
            Thumbnail
          </button>
        </div>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-10 space-y-4 animate-pulse">
          <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-pink-400 font-medium text-center">{progress}</p>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 text-red-400 text-sm">
          <i className="fa-solid fa-circle-exclamation mt-0.5"></i>
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="flex-1 border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-gray-500 space-y-2">
          <i className="fa-solid fa-sparkles text-2xl"></i>
          <p className="text-sm">Your new masterpiece will appear here</p>
        </div>
      )}
    </div>
  );
};

export default CreateVideo;
