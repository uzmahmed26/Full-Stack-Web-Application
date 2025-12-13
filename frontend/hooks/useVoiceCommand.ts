import { useState, useEffect, useCallback, useRef } from 'react';
import { useTasks } from './useTasks';

// Define the shape of a voice command
interface VoiceCommand {
  command: string | string[];
  callback: (...args: any[]) => void;
}

// Custom hook for handling voice commands
export const useVoiceCommand = () => {
  const [isListening, setIsListening] = useState(false);
  const [hasSpeechRecognition, setHasSpeechRecognition] = useState(false);
  const recognitionRef = useRef<any>(null); // Use useRef to hold the recognition object

  const { tasks, addTask, deleteTask, updateTask } = useTasks();

  // Define the voice commands
  const commands: VoiceCommand[] = [
    {
      command: 'create todo *',
      callback: (taskName: string) => {
        if (taskName) {
          addTask({ title: taskName, description: 'Created via voice command', completed: false });
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
            updateTask(taskToComplete.id, { completed: true });
          }
        }
      },
    },
  ];

  const handleResult = useCallback(
    (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0])
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
        recognitionRef.current = new SpeechRecognition();
        setHasSpeechRecognition(true);
        recognitionRef.current.continuous = false; // Set to false to stop after each command
        recognitionRef.current.interimResults = false; // We only care about final results
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
    recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
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
