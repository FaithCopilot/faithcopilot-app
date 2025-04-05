import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Send } from 'lucide-react';

const VoiceChat = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const recognition = useRef(null);
  const audioContext = useRef(null);
  const speechSynthesis = useRef(null);

  useEffect(() => {
    // Initialize Web Speech API
    if ('webkitSpeechRecognition' in window) {
      recognition.current = new window.webkitSpeechRecognition();
      recognition.current.continuous = true;
      recognition.current.interimResults = true;

      recognition.current.onresult = (event) => {
        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript;
        setTranscript(transcript);
      };

      recognition.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
    }

    // Initialize Audio Context
    audioContext.current = new (window.AudioContext || window.webkitAudioContext)();

    // Initialize Speech Synthesis
    speechSynthesis.current = window.speechSynthesis;

    return () => {
      if (recognition.current) {
        recognition.current.stop();
      }
    };
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognition.current.stop();
      setIsListening(false);
    } else {
      recognition.current.start();
      setIsListening(true);
      setTranscript('');
    }
  };

  const sendMessage = async () => {
    if (!transcript.trim()) return;

    const userMessage = transcript;
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setTranscript('');
    setIsLoading(true);

    try {
      // Replace with your OpenAI API endpoint and authentication
      const response = await fetch('YOUR_API_ENDPOINT', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer YOUR_API_KEY'
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [...messages, { role: 'user', content: userMessage }]
        })
      });

      const data = await response.json();
      const aiMessage = data.choices[0].message.content;
      
      setMessages(prev => [...prev, { role: 'assistant', content: aiMessage }]);
      
      // Speak the AI's response
      const utterance = new SpeechSynthesisUtterance(aiMessage);
      speechSynthesis.current.speak(utterance);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto p-4 py-24">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg ${
              message.role === 'user' 
                ? 'bg-blue-100 ml-auto max-w-[80%]' 
                : 'bg-gray-100 mr-auto max-w-[80%]'
            }`}
          >
            {message.content}
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="border-t pt-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleListening}
            className={`p-3 rounded-full ${
              isListening ? 'bg-red-500' : 'bg-blue-500'
            } text-white`}
          >
            {isListening ? <MicOff size={24} /> : <Mic size={24} />}
          </button>
          
          <div className="flex-1 p-4 bg-gray-100 rounded-lg min-h-[60px]">
            {transcript || 'Speak to start chatting...'}
          </div>

          <button
            onClick={sendMessage}
            disabled={!transcript || isLoading}
            className={`p-3 rounded-full ${
              !transcript || isLoading ? 'bg-gray-300' : 'bg-green-500'
            } text-white`}
          >
            <Send size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoiceChat;