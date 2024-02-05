# Voice Input Test

The purpose of this repo is to demo WEB API 
speech recognition.

The features:
- [x] Activate/deactivate voice input on a specific input
- [x] Show interim recognition result
- [x] Recognize punctuation marks
  (`full stop`, `comma`, `dash`, `exclamation mark`, `question mark`)
- [x] Recognize `new line`
- [x] Recognize commands
  - [x] `backspace` - remove previous word (token) from latest active voice input 
  - [x] `undo` - discard latest active voice input
  - [ ] `redo` - redo latest undo effect
  - [ ] `capitalize` - capitalize sentences
  - [ ] `trim spaces` - remove excessive spaces
- [x] Insert new input at current cursor position
- [x] Replace selected fragment of text with new input
- [x] Put final result into targeted input
- [x] Blur input field on recognition idle
- [ ] Keep input history

## CHANGELOG

### 2024-02-05 v1.0

16h20m

- Activate/deactivate voice input on a specific input
- Show interim recognition result
- Recognize punctuation marks
  (`full stop`, `comma`, `dash`, `exclamation mark`, `question mark`)
- Recognize `new line`
- Recognize commands (`backspace`, `undo`) within latest active voice input
- Insert new input at current cursor position
- Replace selected fragment of text with new input
- Put final result into targeted input
- Blur input field on recognition idle
