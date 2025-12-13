'use client';

import { useVoiceCommand } from '@/hooks/useVoiceCommand';

const VoiceCommand = () => {
  const { isListening, toggleListening, hasSpeechRecognition } = useVoiceCommand();

  if (!hasSpeechRecognition) {
    return (
      <div className="fixed bottom-4 right-4 bg-red-100 text-red-700 p-3 rounded-lg shadow-lg">
        <p>Your browser does not support Speech Recognition.</p>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4">
      <button
        onClick={toggleListening}
        className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg transition-colors ${
          isListening ? 'bg-red-500' : 'bg-blue-500'
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
          />
        </svg>
      </button>
    </div>
  );
};

export default VoiceCommand;
