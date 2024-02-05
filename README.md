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
