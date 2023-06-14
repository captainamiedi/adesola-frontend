import React from 'react'

export default function ChatMode({ setMode, mode, setType }) {
  const handleChange = (e) => {
    setMode(e.target.value)
    setType('question')
  }
  return (
    <div className='chat-mode-sub-container'>
    <div className="select-wrapper">
    <label for="select-choice">Chat Mode:</label>
    <div className="styled-select" for="select-choice">
      <select name="select-choice" id="select-choice" onChange={handleChange}>
        <option value="lawChat">Law Chat</option>
        <option value="summarizeDoc">Summarize Document</option>
        <option value="audio">Translate Audio</option>
        <option value="question">Question</option>
        <option value="Q/A">Q/A Document</option>
      </select>
    </div>
    
  </div>
    {/* {mode === 'Q/A' && <div className="select-wrapper type">
    <label for="select-choice">Type:</label>
    <div className="styled-select" for="select-choice">
      <select name="select-choice" id="select-choice" onChange={(e) => setType(e.target.value)}>
        <option value="question">Questions</option>
        <option value="answer">Answers</option>
      </select>
    </div>
    
  </div>} */}

    </div>
  )
}
