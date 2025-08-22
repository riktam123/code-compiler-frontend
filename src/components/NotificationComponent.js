import React, { useEffect, useState } from "react";

const NotificationComponent = () => {
  const [message, setMessage] = useState("");
  const [permission, setPermission] = useState(Notification.permission);

  useEffect(() => {
    
    const requestPermission = async () => {
      try {
        const permission = await Notification.requestPermission();
        setPermission(permission);
        if (permission === "granted") {
          console.log("Notification permission granted.");
        } else if (permission === "denied") {
          console.log("Notification permission denied.");
        } else {
          console.log("Notification permission default.");
        }
      } catch (error) {
        console.error("Error requesting notification permission:", error);
      }
    };

    requestPermission();
    
    const fetchNotification = async () => {
      try {
        const response = await fetch("http://localhost:8800/notify");
        const data = await response.json();
        setMessage(data.message);
      } catch (error) {
        console.error("Error fetching notification data:", error);
      }
    };

    fetchNotification();
  }, []);

  const showNotification = () => {
    if (permission === "granted" && message) {
      new Notification("Interview Dropped!", {
        body: message,
        icon: imageUrl, 
            image: imageUrl, 
            badge: imageUrl, 
            requireInteraction: true, 
            tag: 'interview-drop', 
            timestamp: Date.now(),
      });
    } else if (permission === "denied") {
      alert("Please enable notifications in your system/browser settings.");
    }
  };

  return (
    <div>
      <h1>Desktop Notifications</h1>
      <button onClick={showNotification}>Show Notification</button>
    </div>
  );
};

export default NotificationComponent;
