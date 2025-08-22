// src/MessageListener.js
import React, { useEffect, useState } from 'react';

const MessageListener = () => {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:4000'); 
        setSocket(ws);
        ws.onmessage = (event) => {
            const newMessage = event.data;
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        };

        return () => {
            ws.close();
        };
    }, []);

    const sendMessage = () => {
        try{
        if (socket && inputMessage) {
            socket.send(inputMessage);
            setInputMessage(''); 
        }
    }catch(err){
        console.log("error is ",err)
    }
    };

    return (
        <div>
            <h1>Message Listener</h1>
            <div style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px', height: '200px', overflowY: 'auto' }}>
                <h2>Received Messages:</h2>
                {messages.map((msg, index) => (
                    <div key={index}>{msg}</div>
                ))}
            </div>
            <input 
                type="text" 
                value={inputMessage} 
                onChange={(e) => setInputMessage(e.target.value)} 
                placeholder="Type a message..."
                className='p-10 m-10'
            />
            <button onClick={sendMessage}>Send Message</button>
        </div>
    );
};

export default MessageListener;
