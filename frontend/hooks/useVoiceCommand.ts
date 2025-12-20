import { useState, useEffect, useCallback, useRef } from 'react';
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask } from './useTasks';

// TypeScript definitions for Web Speech API
interface SpeechRecognitionErrorEvent extends Event {
  error: 'no-speech' | 'aborted' | 'audio-capture' | 'network' | 'not-allowed' | 'service-not-allowed' | 'bad-grammar' | 'language-not-supported';
  message?: string;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

// Define the shape of a voice command
interface VoiceCommand {
  command: string | string[];
  callback: (...args: any[]) => void;
}

// Custom hook for handling voice commands
export const useVoiceCommand = () => {
  const [isListening, setIsListening] = useState(false);
  const [hasSpeechRecognition, setHasSpeechRecognition] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const { tasks } = useTasks();
  const { createTask } = useCreateTask();
  const { updateTask } = useUpdateTask();
  const { deleteTask } = useDeleteTask();

  // Define the voice commands
  const commands: VoiceCommand[] = [
    {
      command: 'create todo *',
      callback: (taskName: string) => {
        if (taskName) {
          createTask({ title: taskName, description: 'Created via voice command' });
        }
      },
    },
    {
      command: ['delete todo *', 'remove todo *'],
      callback: (taskName: string) => {
        if (taskName) {
          const taskToDelete = tasks.find(task => task.title.toLowerCase() === taskName.toLowerCase());
          if (taskToDelete) {
            deleteTask(taskToDelete.id);
          }
        }
      },
    },
    {
      command: ['complete todo *', 'mark todo * as complete'],
      callback: (taskName: string) => {
        if (taskName) {
          const taskToComplete = tasks.find(task => task.title.toLowerCase() === taskName.toLowerCase());
          if (taskToComplete) {
            updateTask(taskToComplete.id, { status: 'completed' });
          }
        }
      },
    },
  ];

  const handleResult = useCallback(
    (event: SpeechRecognitionEvent) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join('');

      // Check if the transcript matches any of the commands
      for (const { command, callback } of commands) {
        const commandList = Array.isArray(command) ? command : [command];
        for (const cmd of commandList) {
          if (cmd.endsWith('*')) {
            const prefix = cmd.slice(0, -1).trim();
            if (transcript.toLowerCase().startsWith(prefix.toLowerCase())) {
              const arg = transcript.substring(prefix.length).trim();
              callback(arg);
              return;
            }
          } else if (transcript.toLowerCase() === cmd.toLowerCase()) {
            callback();
            return;
          }
        }
      }
    },
    [commands]
  );

  // Initialize SpeechRecognition on the client-side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition() as SpeechRecognition;
        recognitionRef.current = recognition;
        setHasSpeechRecognition(true);
        recognition.continuous = false; // Set to false to stop after each command
        recognition.interimResults = false; // We only care about final results
      } else {
        setHasSpeechRecognition(false);
      }
    }
  }, []);

  // Effect to handle starting and stopping recognition
  useEffect(() => {
    const recognition = recognitionRef.current;
    if (!recognition || !hasSpeechRecognition) {
      return;
    }

    recognition.onresult = handleResult;
    recognition.onend = () => {
      // If we are still listening, restart recognition
      if (isListening) {
        recognition.start();
      }
    };

    /**
     * Production-ready error handler for Web Speech API
     * Safely handles "no-speech" errors which are normal when user doesn't speak
     */
    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      // "no-speech" is a normal occurrence - user didn't speak within the timeout
      // We safely ignore this and keep the UI responsive
      if (event.error === 'no-speech') {
        console.log('[Voice Command] No speech detected - waiting for input');
        // Don't stop listening - this is expected behavior
        return;
      }

      // "aborted" happens when recognition is manually stopped - also normal
      if (event.error === 'aborted') {
        console.log('[Voice Command] Recognition aborted by user');
        return;
      }

      // Handle actual errors that require user attention
      const errorMessages: Record<string, string> = {
        'audio-capture': 'Microphone access failed. Please check your microphone.',
        'not-allowed': 'Microphone permission denied. Please allow microphone access.',
        'network': 'Network error. Please check your internet connection.',
        'service-not-allowed': 'Speech recognition service is not allowed.',
        'bad-grammar': 'Speech grammar error.',
        'language-not-supported': 'Language not supported.',
      };

      const errorMessage = errorMessages[event.error] || `Speech recognition error: ${event.error}`;
      console.error('[Voice Command]', errorMessage, event.message || '');

      // Only stop listening for critical errors
      if (['not-allowed', 'service-not-allowed', 'audio-capture'].includes(event.error)) {
        setIsListening(false);
      }
    };


    if (isListening) {
      recognition.start();
    } else {
      recognition.stop();
    }

    return () => {
      recognition.stop();
      recognition.onend = null;
      recognition.onresult = null;
      recognition.onerror = null;
    };
  }, [isListening, hasSpeechRecognition, handleResult]);

  const toggleListening = () => {
    setIsListening((prevState) => !prevState);
  };

  return { isListening, toggleListening, hasSpeechRecognition };
};
