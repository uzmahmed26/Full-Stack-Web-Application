# Voice Skill

## Skill Name

Voice Command Integration using Web Speech API

## Role & Capabilities

This skill enables voice-based actions within the Smart Todo App using the browser's native Web Speech API. It allows users to create, delete, and complete tasks using voice commands.

**Capabilities:**
- Implements voice recognition using the Web Speech API.
- Provides a `useVoiceCommand` hook for easy integration into components.
- Recognizes specific commands for task management.
- Calls existing `useTasks` hook functions to perform CRUD operations.
- Provides a simple UI component to toggle voice listening.

## How it Works

The core of this skill is the `frontend/hooks/useVoiceCommand.ts` hook. This hook manages the `SpeechRecognition` instance, defines the available voice commands, and handles the logic for parsing and executing those commands.

A `frontend/components/VoiceCommand.tsx` component provides a simple microphone button to the user to start and stop listening for commands.

## Available Commands

The following voice commands are currently supported:

- **Create a task:**
  - "create todo [task name]"
  - *Example: "create todo Buy groceries"*

- **Delete a task:**
  - "delete todo [task name]"
  - "remove todo [task name]"
  - *Example: "delete todo Walk the dog"*

- **Complete a task:**
  - "complete todo [task name]"
  - "mark todo [task name] as complete"
  - *Example: "complete todo Finish the report"*

## How to Add New Commands

To add a new voice command, you need to update the `commands` array in `frontend/hooks/useVoiceCommand.ts`.

1.  **Open `frontend/hooks/useVoiceCommand.ts`**.
2.  **Add a new object to the `commands` array.**

Each command object has two properties:
- `command`: A string or an array of strings representing the voice command(s). Use a `*` as a wildcard to capture the rest of the phrase as an argument.
- `callback`: A function that will be executed when the command is recognized. The captured wildcard value will be passed as an argument to this function.

### Example: Adding a command to set a task's priority

```typescript
// In frontend/hooks/useVoiceCommand.ts

const commands: VoiceCommand[] = [
  // ... existing commands
  {
    command: 'set priority for * to *',
    callback: (taskName: string, priority: string) => {
      const task = tasks.find(t => t.title.toLowerCase() === taskName.toLowerCase());
      if (task) {
        // Assuming you have a way to update the priority
        console.log(`Setting priority for ${taskName} to ${priority}`);
        // updateTask(task.id, { priority });
      }
    },
  },
];
```

## Browser Compatibility

The Web Speech API is not supported in all browsers. This skill will gracefully degrade and show a message to the user if their browser is not compatible.

- **Chrome:** Supported
- **Edge:** Supported
- **Safari:** Supported
- **Firefox:** Not supported

**Note:** The Web Speech API requires a secure connection (HTTPS) to function in most browsers.