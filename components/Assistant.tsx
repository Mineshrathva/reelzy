
import React, { useState } from 'react';
import { generateScript } from '../services/geminiService';

const Assistant: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [script, setScript] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    try {
      const res = await generateScript(topic);
      setScript(res || 'Failed to generate script.');
    } catch (err) {
      setScript('Error generating script. Try a different topic.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 h-full flex flex-col space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <i className="fa-solid fa-wand-magic-sparkles text-pink-500"></i>
          Script Assistant
        </h2>
        <p className="text-gray-400 text-sm">Let Gemini help you draft your next viral script.</p>
      </div>

      <div className="flex gap-2">
        <input 
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Topic: 5 tips for morning productivity..."
          className="flex-1 bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-pink-500 transition"
        />
        <button 
          onClick={handleGenerate}
          disabled={loading || !topic}
          className="px-6 py-3 bg-pink-500 text-white font-bold rounded-xl disabled:opacity-50 hover:bg-pink-600 transition"
        >
          {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : 'Draft'}
        </button>
      </div>

      <div className="flex-1 bg-zinc-900 border border-white/5 rounded-2xl p-6 overflow-y-auto relative">
        {script ? (
          <div className="prose prose-invert text-sm whitespace-pre-wrap text-gray-300">
            {script}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-600 space-y-4 text-center">
            <i className="fa-solid fa-feather text-4xl"></i>
            <p className="max-w-[200px]">Enter a topic above to generate a professional video script.</p>
          </div>
        )}
        
        {script && (
          <button 
            onClick={() => navigator.clipboard.writeText(script)}
            className="absolute top-4 right-4 w-10 h-10 glass rounded-lg flex items-center justify-center text-gray-400 hover:text-white"
          >
            <i className="fa-solid fa-copy"></i>
          </button>
        )}
      </div>
    </div>
  );
};

export default Assistant;
