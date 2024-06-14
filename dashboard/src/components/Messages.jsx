import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Context } from "../main";
import { Navigate } from "react-router-dom";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const { isAuthenticated } = useContext(Context);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/getAll",
          { withCredentials: true }
        );
        setMessages(data.message); // Assuming 'message' is the correct key for the array of messages
        console.log(data);
      } catch (error) {
        console.log(error.response.data.message);
      }
    };
    fetchMessages();
  }, []);

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  return (
    <section className="page messages">
      <h1>MESSAGE</h1>
      <div className="banner">
        {messages && messages.length > 0 ? (
          messages.map((message) => ( 
            <div className="card" key={message._id}>
              <div className="details">
                <p>
                  First Name: <span>{message.firstName}</span>
                </p>
                <p>
                  Last Name: <span>{message.lastName}</span>
                </p>
                <p>
                  Email: <span>{message.email}</span>
                </p>
                <p>
                  Phone: <span>{message.phone}</span>
                </p>
                <p>
                  Message: <span>{message.message}</span>
                </p>
              </div>
            </div>
          ))
        ) : (
          <h1>No Messages!</h1>
        )}
      </div>
    </section>
  );
};

export default Messages;
