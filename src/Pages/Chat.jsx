import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FaGithub } from "react-icons/fa";
import { createClient } from '@supabase/supabase-js'

import ChatHistory from "../components/ChatHistory";
import ChatUI from "../components/ChatUI";
import ChatMode from "../components/ChatMode";

const supabaseClient = createClient(process.env.REACT_APP_Project_URL, process.env.REACT_APP_Public_Anon_Key)

const baseURL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080/";

function Chat() {
  const [chats, setChats] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef(null);
  const [isAssistantTyping, setIsAssistantTyping] = useState(false);
  const [chatResponse, setChatResponse] = useState('')
  const [mode, setMode] = useState('lawChat')
  const [type, setType] = useState('question')
  const [file, setFile] = useState(null)

  // useEffect(() => {
  //   fetchChats();
  // }, []);

  // useEffect(() => {
  //   if (selectedChatId) {
  //     fetchMessages(selectedChatId);
  //   } else {
  //     setMessages([]);
  //   }
  // }, [selectedChatId]);

  useEffect(() => {
    if (file) {

      var reader = new FileReader()
      reader.onload = function(event) {
        const fileContent = event.target.result;
        // console.log(fileContent, 'file content');
        localStorage.setItem('storedFile', fileContent);
        localStorage.setItem('storedFileName', file.name)
      }
      reader.readAsDataURL(file);
    }
  },  [file])

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "auto" });
    }
  };

  const fetchChats = async () => {
    try {
      const response = await axios.get(`${baseURL}/chats/`);
      setChats(response.data);
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  };

  const fetchMessages = async (chatId) => {
    try {
      const response = await axios.get(`${baseURL}/chats/${chatId}/`);
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  // console.log(file, 'file');

  const sendFile =async () => {

    const storedFile = localStorage.getItem('storedFile');
    const storedFileName = localStorage.getItem('storedFileName')
    const base64WithoutPrefix = storedFile.replace(/^data:[^;]+;base64,/, '');
    const byteCharacters = atob(base64WithoutPrefix);
    const byteArrays = [];
    for (let i = 0; i < byteCharacters.length; i++) {
      byteArrays.push(byteCharacters.charCodeAt(i));
    }
    const byteArray = new Uint8Array(byteArrays);
    const blob = new Blob([byteArray], { type: 'application/pdf' });

    // Create a file from the Blob
    const file = new File([blob], storedFileName, { type: 'application/pdf' });

    if (type === 'answer') {
      setMessages([
        ...messages,
        {
          content: inputMessage,
          role: "user",
        },
      ]);
    } else {
      setMessages([
        ...messages,
        {
          content: storedFileName,
          role: "user",
        },
      ]);

    }
    const config = {
      headers:{
        'Authorization': localStorage.getItem('userToken'),
      }
    }
  
    let formData = new FormData()
    formData.append('file', file)
    setIsAssistantTyping(true);
    if (mode === 'audio') {
      const response = await axios.post(`${baseURL}api/upload_media/`, formData, config)
      const payload = {
        role: 'assistant',
        content: response.data.data
      }

      setMessages(prev => [...prev, payload])
      
      setIsAssistantTyping(false);
      setFile(null)
    }
    if (mode === 'summarizeDoc') {
      const response = await axios.post(`${baseURL}api/upload_file/`, formData, config)
      const payload = {
        role: 'assistant',
        content: response.data.data.output_text
      }
      console.log(response.data.data);
      setMessages(prev => [...prev, payload])
      
      setIsAssistantTyping(false);
      setFile(null)
      
    }
    if (mode === 'question') {
      try {
        formData.append('type', 'question')
        // if (type === 'answer') {
        //   formData.append('question', inputMessage)
        // }
        const response = await axios.post(`${baseURL}api/question_answer`, formData, config)
        const payload = {
          role: 'assistant',
          content: response.data.data
        }
        if (type === 'answer') {
          payload.content = response.data.data.data.answer
        }

        setMessages(prev => [...prev, payload])
        
        setIsAssistantTyping(false);
        setFile(null)
      } 
      catch (error) {
        
      }
    }
    if (mode === 'Q/A') {
      try {
        if (type === 'answer') {
          formData.append('question', inputMessage)
          const response  = await axios.post(`${baseURL}api/query/doc`, formData, {
            headers: {
              'Authorization': localStorage.getItem('userToken'),
            }
          })

          const payload = {
            role: 'assistant',
            content: response.data.data.answer + response.data.data.sources
          }
          setMessages(prev => [...prev, payload])
          setIsAssistantTyping(false);
          // setFile(null)
          return response.data
        }
        // console.log(localStorage.getItem('userToken'));
        const response =await fetch(`${baseURL}api/embedding/doc`, {
          method: 'POST',
          // mode: "cors", // no-cors, *cors, same-origin
          // cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
          // credentials: "same-origin", // include, *same-origin, omit
          headers: {
            // "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': localStorage.getItem('userToken')
          },
          body: formData
        })
        alert('upload successful. you can start asking Adesola questions based on the document uploaded.')
        // setMessages(prev => [...prev, payload])
        
        setIsAssistantTyping(false);
        setFile(null)
        setType('answer')
      } 
      catch (error) {
        
      }
    }
  }

  const sendMessage = async () => {
    // Update the local state before sending the message to the backend
    setMessages([
      ...messages,
      {
        content: inputMessage,
        role: "user",
      },
    ]);
    setInputMessage("");
    if (['summarizeDoc', 'audio', 'Q/A'].includes(mode)) {
      return sendFile()
    }

    setIsAssistantTyping(true);
    if (type !== 'answer') {
        try {
          // Simulate a delay for the typewriting effect
          const delay = 1000 + Math.random() * 1000; // Random delay between 1-2 seconds
          // setTimeout(async () => {
            try {
              const { data, error } = await supabaseClient.functions.invoke('law-custom-data', {
                body: JSON.stringify({ query: inputMessage}),
              })
              // const response = await axios.post(`${baseURL}/chats/`, {
              //   chat_id: selectedChatId || undefined,
              //   message: inputMessage,
              // });
              // console.log(data.text);
              setChatResponse(data.text)
              const payload = {
                role: 'assistant',
                content: data.text
              }
              setMessages(prev => [...prev, payload])
              // setMessages()
              // If there was no selected chat, set the selected chat to the newly created one
              if (!selectedChatId) {
                setSelectedChatId(data.id);
                setChats([{ id: data.id }, ...chats]);
              } else {
                // fetchMessages(selectedChatId);
              }
            } catch (error) {
              console.error("Error sending message:", error);
              setMessages([
                ...messages,
                {
                  content:
                    "⚠️ An error occurred while sending the message. Please make sure the backend is running and OPENAI_API_KEY is set in the .env file.",
                  role: "assistant",
                },
              ]);
            } finally {
              setIsAssistantTyping(false);
            }
          // }, delay);
        } catch (error) {
          console.error("Error sending message:", error);
        }
    }else {

    }
  };

  const createNewChat = async () => {
    try {
      const response = await axios.post(`${baseURL}/chats/`);
      const newChat = response.data;

      setChats([newChat, ...chats]);
      setSelectedChatId(newChat.id);
    } catch (error) {
      console.error("Error creating a new chat:", error);
    }
  };

  function formatMessageContent(content) {
    const sections = content.split(/(```[\s\S]*?```|`[\s\S]*?`)/g);
    return sections
      .map((section) => {
        if (section.startsWith("```") && section.endsWith("```")) {
          section = section.split("\n").slice(1).join("\n");
          const code = section.substring(0, section.length - 3);
          return `<pre><code class="code-block">${code}</code></pre>`;
        } else if (section.startsWith("`") && section.endsWith("`")) {
          const code = section.substring(1, section.length - 1);
          return `<code class="inline-code">${code}</code>`;
        } else {
          return section.replace(/\n/g, "<br>");
        }
      })
      .join("");
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFile(file)
  }

  return (
    <div className="App">
      <div className="headline">
        <h1>⚡ Adesola Chat ⚡</h1>
      </div>
      <div className="chat-container">
        {/* <div className="chat-history-container">
          <button className="new-chat-button" onClick={createNewChat}>
            <strong>+ New Chat</strong>
          </button>
          <ChatHistory
            chats={chats}
            selectedChatId={selectedChatId}
            setSelectedChatId={setSelectedChatId}
          />
        </div> */}
        <ChatUI
          messages={messages}
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          sendMessage={sendMessage}
          formatMessageContent={formatMessageContent}
          isAssistantTyping={isAssistantTyping}
          messagesEndRef={messagesEndRef}
          chatText={chatResponse}
          mode={mode}
          file={file}
          handleFileChange={handleFileChange}
          sendFile={sendFile}
          type={type}
        />
        <div className="chat-option-container">
          <ChatMode setMode={setMode} mode={mode} setType={setType} />
        </div>
      </div>
      {/* <div className="footer">
        <a
          href="https://github.com/fatihbaltaci/chatgpt-clone"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaGithub className="icon" />
          View on GitHub
        </a>
      </div> */}
    </div>
  );
}

export default Chat;