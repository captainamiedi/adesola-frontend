import React from "react";
import Message from "./Message";
import ChatInput from "./ChatInput";

const ChatUI = ({
  messages,
  inputMessage,
  setInputMessage,
  sendMessage,
  formatMessageContent,
  isAssistantTyping,
  messagesEndRef,
  chatText,
  mode,
  file,
  handleFileChange,
  sendFile,
  type
}) => {
  return (
    <div className="chat-ui">
      <div className="chat-messages">
        {messages.map((message, index) => (
          <Message
            key={index}
            message={message}
            formatMessageContent={formatMessageContent}
            chatText={chatText}
          />
        ))}
        {isAssistantTyping && (
          <div className="message assistant">
            <div className="typing-indicator">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef}></div>
      </div>
      <ChatInput
        inputMessage={inputMessage}
        setInputMessage={setInputMessage}
        sendMessage={sendMessage}
        mode={mode}
        file={file}
        sendFile={sendFile}
        handleFileChange={handleFileChange}
        type={type}
      />
    </div>
  );
};

export default ChatUI;