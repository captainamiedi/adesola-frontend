import React from "react";

// import send icon from react-icons/fa
import { FaPaperPlane } from "react-icons/fa";


const ChatInput = ({ inputMessage, setInputMessage, sendMessage, mode, handleFileChange, sendFile, file, type }) => {
  return (
    <div className="chat-input">
      {(mode === 'lawChat' || (mode === 'Q/A' && type ==='answer')) && <textarea
        placeholder="Type a message"
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (inputMessage) {
              sendMessage();
            }
          }          
        }}
      />}
      {fileMode.includes(mode) && type !== 'answer' && <input 
        type="file" 
        onChange={handleFileChange}  
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            if (file) {
              sendFile()
            }
          }
        }}
      />}

      {mode !== 'Q/A'&& type !== 'answer' && <button onClick={sendMessage} disabled={(mode ==='lawChat' && !inputMessage) || (mode !== 'lawChat' &&!file) || (mode === 'Q/A' && !inputMessage)}>
        <FaPaperPlane/>
      </button>}
      {mode === 'Q/A' && <button onClick={sendMessage} disabled={(type === 'question' && !file) || (type === 'answer' && !inputMessage)}>
        <FaPaperPlane/>
      </button>}
    </div>
  );
};

export default ChatInput;

const fileMode = ['Q/A', 'audio', 'summarizeDoc', 'question']