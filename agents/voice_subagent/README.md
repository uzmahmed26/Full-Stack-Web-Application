# Voice Subagent

## Role & Capabilities

Specialized AI agent responsible for implementing voice command features for task creation and management in the Todo Application.

**Core Capabilities:**
- Implement Web Speech API for voice recognition
- Create voice-activated task creation flow
- Handle voice input parsing and validation
- Implement push-to-talk or continuous listening modes
- Provide visual feedback during voice capture
- Handle speech recognition errors gracefully
- Support both English and Urdu voice commands (optional)
- Implement voice command permissions and browser compatibility checks
- Add accessibility features for voice interaction
- Test voice features across different browsers and devices

## Technology Stack

- **API:** Web Speech API (SpeechRecognition)
- **Fallback:** Third-party service (Google Cloud Speech, Azure Speech) for unsupported browsers
- **Language Support:** English (en-US), Urdu (ur-PK) optional
- **Permissions:** Browser microphone access

## Reusable Behavior

**Voice Recognition Setup Pattern:**
1. Check browser support for Web Speech API
2. Request microphone permissions from user
3. Initialize SpeechRecognition with appropriate language
4. Configure continuous vs interim results
5. Add event listeners for results, errors, end

**Voice Command Pattern:**
1. User clicks voice input button
2. Start speech recognition
3. Show visual indicator (recording animation)
4. Capture speech and convert to text
5. Parse text for task title and description
6. Pre-fill task form with recognized text
7. User confirms or edits before submission

**Error Handling Pattern:**
1. No browser support → Show error message, disable feature
2. Permission denied → Show instructions to enable microphone
3. No speech detected → Timeout and prompt user to try again
4. Unclear speech → Show confidence score, allow retry
5. Network error → Fallback to manual input

**Multi-Language Pattern:**
1. Detect current UI language (English or Urdu)
2. Set SpeechRecognition language accordingly
3. Handle language-specific parsing
4. Provide language-specific prompts

## Implementation Notes

- Use `webkitSpeechRecognition` for Chrome/Edge compatibility
- Set `continuous: false` for single-command mode
- Set `interimResults: true` for real-time feedback
- Implement timeout (5-10 seconds) for speech capture
- Show microphone icon with visual feedback during recording
- Provide clear instructions for first-time users
- Handle ambient noise gracefully (confidence thresholds)
- Store voice preferences in localStorage
- Add keyboard shortcuts for voice activation (e.g., Ctrl+Shift+V)
- Test in quiet and noisy environments
- Implement voice command help/tutorial
- Consider privacy implications (don't store audio)

## Reference Files

- Architecture: `specs/001-todo-app-spec/plan.md` (Bonus Features section)
- Tasks: `specs/001-todo-app-spec/tasks.md` (Bonus tasks B019-B027)

## Success Criteria

- Voice input button visible on task creation form
- Clicking button requests microphone permission
- User can speak task title and see text transcribed in real-time
- Voice input auto-fills task form fields
- User can edit transcribed text before submission
- Visual indicator shows when microphone is active
- Error messages display for unsupported browsers
- Permission denied shows clear instructions to user
- Voice feature works in Chrome, Edge, Safari (latest versions)
- Timeout occurs if no speech detected within 10 seconds
- Multiple attempts allowed (retry button)
- Voice input accessible via keyboard shortcut

## Browser Compatibility

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome 25+ | ✅ Full | webkitSpeechRecognition |
| Edge 79+ | ✅ Full | webkitSpeechRecognition |
| Safari 14.1+ | ✅ Full | webkitSpeechRecognition |
| Firefox | ❌ Limited | No native support, requires fallback |
| Mobile Chrome | ✅ Full | Requires HTTPS |
| Mobile Safari | ✅ Full | Requires user gesture |

## Voice Command Examples

**English:**
- "Buy groceries" → Title: "Buy groceries"
- "Call mom tomorrow" → Title: "Call mom tomorrow"
- "Finish project report by Friday" → Title: "Finish project report by Friday"

**Urdu (Optional):**
- "گروسری خریدنا" → Title: "گروسری خریدنا"
- "ماں کو کال کرنا" → Title: "ماں کو کال کرنا"

## Implementation Phases

1. **Phase 1 - Basic Voice Input:** Simple voice-to-text for task title (English only)
2. **Phase 2 - Enhanced Parsing:** Extract title vs description from voice input
3. **Phase 3 - Multi-Language:** Add Urdu voice recognition support
4. **Phase 4 - Advanced Commands:** Voice commands for actions (e.g., "complete task number 3")
