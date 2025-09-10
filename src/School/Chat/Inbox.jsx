import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { SocketProvider } from "./SocketContext";
import useSocket from "./hooks/useSocket";
import { Menu } from "lucide-react";

import MessageInput from "./MessageInput";
import ChatWindow from "./ChatWindow";
import ChatSidebar from "./ChatSidebar";
import ChatTopBar from "./ChatTopbar";
import formatLastSeen from './FormatedLastSeen'

const Inbox = () => {
  return (
    <SocketProvider>
      <InboxContent />
    </SocketProvider>
  );
};

const InboxContent = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const [receiverId, setReceiverId] = useState(null);
  const [receiver, setReceiver] = useState(null);
  const [chatMessages, setChatMessages] = useState({}); // Store messages per chatId
  const [activeChatId, setActiveChatId] = useState(null);
  const [userStatuses, setUserStatuses] = useState({});
    const [receiverProfile, setReceiverProfile] = useState(null);
  


  const locationState = location.state;
  console.log("[Inbox] Location State:", locationState);

  const socket = useSocket({});



  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!receiverId) return;
  
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found in localStorage");
          return;
        }
  
        const res = await fetch(
          `https://fieldtriplinkbackend-production.up.railway.app/api/common/user-details/${receiverId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
  
        if (!res.ok) throw new Error("Failed to fetch user details");
  
        const data = await res.json();
        console.log("[Inbox] API User Profile:", data.data);
        setReceiverProfile(data.data);
      } catch (err) {
        console.error("Error fetching user profile:", err);
      }
    };
  
    fetchUserProfile();
  }, [receiverId]);

  useEffect(() => {
    const handleResize = () => {
      document.body.style.overflowY = window.innerWidth < 768 ? "auto" : "hidden";
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      document.body.style.overflowY = "auto";
      window.removeEventListener("resize", handleResize);
    };
  }, []);




  useEffect(() => {
    if (locationState?.creatorId) {
      console.log("[Inbox] Setting receiverId from location.state:", locationState.creatorId);
      setReceiverId(locationState.creatorId);
      localStorage.setItem("receiverId", locationState.creatorId);
    } else {
      console.log("[Inbox] No creatorId in location.state — clearing receiverId");
      localStorage.removeItem("receiverId");
    }
  }, [locationState]);



  useEffect(() => {
    if (!socket || !receiverId) {
      console.warn("[Inbox] Missing socket or receiverId. JOIN_CHAT not emitted.");
      return;
    }

    console.log("[Inbox] Emitting JOIN_CHAT with:", {
      user1Id: socket.userId,
      user2Id: receiverId,
    });

const joinChatHandler = ({ chatId, messages, participants }) => {
  console.log("[Inbox] JOIN_CHAT_SUCCESS received:", {
    chatId,
    messagesCount: messages?.length,
    participants,
  });

  // Find the receiver from participants (exclude self)
  let chatReceiver = participants?.find((p) => p.userId !== socket.userId) || null;

  // If not found, try pulling from location.state
  if (!chatReceiver && location.state?.creatorId === receiverId) {
    chatReceiver = {
      userId: location.state.creatorId,
      profilePicture: location.state.creatorPic || location.state.profilePicture,
      fullName:
        location.state.creatorName ||
        location.state.fullName ||
        location.state.name ||
        location.state.username ||
        null, // don’t immediately fallback here
    };
    console.log("[Inbox] Using fallback receiver from location.state:", chatReceiver);
  }

  // Normalize fields to ensure consistent receiver data
  if (chatReceiver) {
    chatReceiver = {
      userId: chatReceiver.userId,
      profilePicture: chatReceiver.profilePicture || chatReceiver.profileImage || null,
      fullName:
        chatReceiver.fullName ||
        chatReceiver.name ||
        chatReceiver.username ||
        chatReceiver.displayName ||
        "",
    };
  }

  console.log("[Inbox] Resolved receiver:", chatReceiver);
  setActiveChatId(chatId);
  setChatMessages((prev) => ({
    ...prev,
    [chatId]: messages || [],
  }));
  setReceiver(chatReceiver);
};


    socket.on("JOIN_CHAT_SUCCESS", joinChatHandler);
    socket.emit("JOIN_CHAT", {
      user1Id: socket.userId,
      user2Id: receiverId,
    });

    return () => {
      socket.off("JOIN_CHAT_SUCCESS", joinChatHandler);
    };
  }, [socket, receiverId, location.state]);

  // CENTRALIZED Real-time message listener - only here, not in ChatWindow
useEffect(() => {
  if (!socket) return;

  const receiveMessageHandler = (incoming) => {
    console.log('[Inbox] RECEIVE_MESSAGE raw:', incoming);

    const raw = incoming.completeMessage || incoming;

    // Normalize fields so frontend always sees the same structure
    const normalized = {
      _id: raw._id || null,
      tempId: raw.tempId || null,
      messageId: raw.messageId || null,
      chatId: String(raw.chatId || raw.chat_id || ""),
      sender: raw.sender?._id || raw.senderId || raw.sender || null,
      receiver: raw.receiver?._id || raw.receiverId || raw.receiver || null,
      content: raw.content || "",
      content_type: raw.content_type || raw.contentType || "text",
      media_url: raw.media_url || raw.mediaFile || null,
      timestamp: raw.timestamp || raw.createdAt || new Date().toISOString(),
      isOptimistic: false
    };

    setChatMessages((prev) => {
      const prevMessages = prev[normalized.chatId] || [];

      const exists = prevMessages.some(
        (msg) =>
          (msg._id && normalized._id && msg._id === normalized._id) ||
          (msg.messageId && normalized.messageId && msg.messageId === normalized.messageId) ||
          (msg.tempId && normalized.tempId && msg.tempId === normalized.tempId)
      );

      if (exists) {
        return {
          ...prev,
          [normalized.chatId]: prevMessages.map((msg) =>
            (msg._id && normalized._id && msg._id === normalized._id) ||
            (msg.messageId && normalized.messageId && msg.messageId === normalized.messageId) ||
            (msg.tempId && normalized.tempId && msg.tempId === normalized.tempId)
              ? { ...msg, ...normalized, isOptimistic: false }
              : msg
          ),
        };
      }

      return {
        ...prev,
        [normalized.chatId]: [...prevMessages, normalized],
      };
    });
  };

  socket.on("RECEIVE_MESSAGE", receiveMessageHandler);
  return () => {
    socket.off("RECEIVE_MESSAGE", receiveMessageHandler);
  };
}, [socket]);


  const handleDeleteMessage = (messageId) => {
    if (!activeChatId) return;
    setChatMessages((prev) => ({
      ...prev,
      [activeChatId]: prev[activeChatId]?.filter(
        (msg) => msg._id !== messageId && msg.messageId !== messageId
      ) || []
    }));
  };

  // Add optimistic message immediately
  const handleOptimisticMessage = (optimisticMessage) => {
    if (!activeChatId) return;
    
    console.log('[Inbox] Adding optimistic message:', optimisticMessage);
    
    setChatMessages((prev) => {
      const existingMessages = prev[activeChatId] || [];
      
      // Check if message already exists
      const exists = existingMessages.some(
        (msg) => 
          (msg.tempId && optimisticMessage.tempId && msg.tempId === optimisticMessage.tempId) ||
          (msg._id && optimisticMessage._id && msg._id === optimisticMessage._id)
      );

      if (exists) {
        return prev; // Don't add duplicate
      }

      return {
        ...prev,
        [activeChatId]: [...existingMessages, { ...optimisticMessage, isOptimistic: true, status: 'sent',  timestamp: new Date().toISOString() }]
      };
    });
  };

  

  const handleSelectChat = ({ chatId, messages, receiverId, receiver }) => {
    console.log("[Inbox] Chat selected:", { chatId, receiverId, receiver });
    
    // Enhanced receiver validation
    const validatedReceiver = {
      ...receiver,
      fullName: receiver?.fullName || 
               receiver?.name || 
               receiver?.username || 
               receiver?.displayName || 
               ""
    };
    
    setActiveChatId(chatId);
    setReceiverId(receiverId);
    setReceiver(validatedReceiver);

    setChatMessages((prev) => ({
      ...prev,
      [chatId]: messages || []
    }));

    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Helper function to get display name
  const getDisplayName = () => {
    return receiver?.fullName || 
           receiver?.name || 
           receiver?.username || 
           receiver?.displayName || 
           "Chat";
  };




  useEffect(() => {
  if (!socket?.userId) return;

  console.log("[Inbox] JOIN_APP for:", socket.userId);

  socket.emit("JOIN_APP", { userId: socket.userId });
}, [socket?.userId]);


// user status change (side bar are now used this)
useEffect(() => {
  if (!socket) return;

  const handleUserStatusChange = ({ userId, is_online, last_seen }) => {
    console.log("[Inbox] USER_STATUS_CHANGE:", { userId, is_online, last_seen });

    setUserStatuses((prev) => ({
      ...prev,
      [userId]: {
        is_online,
        last_seen: is_online ? null : last_seen || new Date().toISOString()
      }
    }));
  };

  socket.on("USER_STATUS_CHANGE", handleUserStatusChange);
  return () => socket.off("USER_STATUS_CHANGE", handleUserStatusChange);
}, [socket]);

useEffect(() => {
  if (!socket?.userId || !activeChatId) return;

  // mark as seen immediately on chat open
  socket.emit("MARK_MESSAGES_AS_SEEN", {
    chatId: activeChatId,
    userId: socket.userId,
  });
}, [socket?.userId, activeChatId]);


useEffect(() => {
  if (!socket?.userId || !activeChatId) return;

  const list = chatMessages[activeChatId] || [];
  if (list.length === 0) return;

  const last = list[list.length - 1];

  // Only emit if the last message is from the other person and the tab is visible
  const lastFromOther = (last.sender === receiverId || last.senderId === receiverId);
  if (lastFromOther && !document.hidden) {
    socket.emit("MARK_MESSAGES_AS_SEEN", {
      chatId: activeChatId,
      userId: socket.userId,
    });
  }
}, [chatMessages[activeChatId]?.length, activeChatId, receiverId, socket?.userId]);


useEffect(() => {
  if (!socket) return;

  const handleSeen = ({ chatId, userId: readerId, seenMessageIds, seenAt }) => {
    // If someone (readerId) marked messages as seen in this chat,
    // update *my sent messages* as read on my UI
    setChatMessages(prev => {
      const current = prev[chatId] || [];
      const updated = current.map(m => {
        // messages I SENT should become read when the other participant (reader) sees them
        const isMine = (m.sender === socket.userId || m.senderId === socket.userId);

        // If server gave specific ids → update only those
        if (Array.isArray(seenMessageIds) && seenMessageIds.length) {
          const matched = m._id && seenMessageIds.some(id => String(id) === String(m._id));
          return (isMine && matched) ? { ...m, status: 'read', seen_at: seenAt } : m;
        }

        // Fallback: mark all my sent messages as read
        return isMine ? { ...m, status: 'read', seen_at: seenAt || new Date().toISOString() } : m;
      });

      return { ...prev, [chatId]: updated };
    });
  };

  socket.on("USER_MARKED_MESSAGES_AS_SEEN", handleSeen);

  // (optional) backward compatibility if your backend also emits this:
  const handleAllSeen = ({ chatId, userId: readerId }) =>
    handleSeen({ chatId, userId: readerId, seenMessageIds: [], seenAt: new Date().toISOString() });
  socket.on("ALL_MESSAGES_SEEN", handleAllSeen);

  return () => {
    socket.off("USER_MARKED_MESSAGES_AS_SEEN", handleSeen);
    socket.off("ALL_MESSAGES_SEEN", handleAllSeen);
  };
}, [socket]);



// get user name profileImage and status
useEffect(() => {
  if (receiverId && socket) {
    socket.emit("GET_USER_STATUS", { userId: receiverId });
  }
}, [receiverId, socket]);


useEffect(() => {
  if (!socket) return;

  const handleUserStatus = (data) => {
    console.log("User status  witn user data from backend:", data);
    setUserStatuses((prev) => ({
      ...prev,
      [data.userId]: {
        is_online: data.is_online,
        last_seen: data.last_seen,
        name: data.name,
        profileImage: data.profileImage
      }
    }));
  };

  socket.on("GET_USER_STATUS_SUCCESS", handleUserStatus);
  socket.on("USER_STATUS_CHANGE", handleUserStatus);

  socket.on("GET_USER_STATUS_ERROR", (err) => {
    console.error("Status error:", err.message);
  });

  return () => {
    socket.off("GET_USER_STATUS_SUCCESS", handleUserStatus);
    socket.off("USER_STATUS_CHANGE", handleUserStatus);
    socket.off("GET_USER_STATUS_ERROR");
  };
}, [socket]);



const handleDeleteChat = (chatId) => {
  if (activeChatId === chatId) {
    setActiveChatId(null);
    setReceiverId(null);
    setReceiver(null);
     localStorage.removeItem("receiverId");
  }
};





  return (
    <div className=" bg-gray-50 flex pb-20 ">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm  z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={`
          fixed left-0 lg:left-70  w-80 h-screen bg-white border-r border-gray-200 z-50 shadow-lg transition-transform duration-300 ease-in-out
          md:translate-x-0 md:z-30
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <ChatSidebar 
         onSelectChat={handleSelectChat}
        // isOnline={userStatuses[receiverId]?.is_online || false}
        userStatuses={userStatuses}
         socketName={userStatuses[receiverId]?.name}
        socketProfile={userStatuses[receiverId]?.profileImage}
         onDeleteChat={handleDeleteChat} 
        receiverProfile={receiverProfile}


          />
      </div>

      <div className="flex-1 flex flex-col relative  md:ml-[340px]">
        {activeChatId ? (
          <>
            {/* Mobile Top Bar */}
            <div className="md:hidden fixed  top-19 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-gray-200 z-40 h-16 flex items-center px-2">
              <button
                onClick={toggleSidebar}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-all duration-200"
              >
                <Menu size={20} />
              </button>
              <div className="flex items-center ml-4 space-x-3">
                <div className="relative">
                  <img
                    src={receiver?.profilePicture || userStatuses[receiverId]?.profileImage}
                    alt="Avatar"
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-100"
                    onError={(e) => { e.target.src = "/default-avatar.png"; }}
                  />
                  <div
                          className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-white ${
                            userStatuses[receiverId]?.is_online ? "bg-green-500" : "bg-gray-400"
                          }`}
                        ></div>     
                        
                         </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">
                    { userStatuses[receiverId]?.name}
                  </h3>
                   {userStatuses[receiverId]?.is_online ? (
                      <p className="text-xs text-green-500 font-medium">Online</p>
                    ) : (
                      <p className="text-xs text-gray-500 font-medium">
                        Last seen {formatLastSeen(userStatuses[receiverId]?.last_seen)}
                      </p>
                    )}
                </div>
              </div>
            </div>
            
            {/* Desktop Top Bar */}
            <div className="hidden md:block">
              <ChatTopBar
               receiver={receiver}
              receiverId={receiverId}
              isOnline={userStatuses[receiverId]?.is_online || false}
              lastSeen={userStatuses[receiverId]?.last_seen}
              socketName={userStatuses[receiverId]?.name}
              socketProfile={userStatuses[receiverId]?.profileImage}
              receiverProfile={receiverProfile}

                 />
            </div>

            <ChatWindow
              chatId={activeChatId}
              messages={chatMessages[activeChatId] || []}
              receiver={receiver}
              receiverId={receiverId}
              onDeleteMessage={handleDeleteMessage}
               socketName={userStatuses[receiverId]?.name}
              socketProfile={userStatuses[receiverId]?.profileImage}
              receiverProfile={receiverProfile}

            />

            <MessageInput
              chatId={activeChatId}
              receiverId={receiverId}
              onImageSelect={(file) => console.log("File Select", file)}
              onOptimisticSend={handleOptimisticMessage}
            />
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center relative">
            <div className="md:hidden fixed top-17 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-gray-200 z-40 h-16 flex items-center px-4">
              <button
                onClick={toggleSidebar}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-all duration-200"
              >
                <Menu size={20} />
              </button>
              <h1 className="ml-4 text-lg font-semibold text-gray-800">
                Chats
              </h1>
            </div>
            <div className="flex flex-col items-center justify-center px-8 text-center mt-16 md:mt-0 z-10">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-6 shadow-lg">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-red-500"
                >
                  <path
                    d="M21 11.5C21.0034 12.8199 20.6951 14.1219 20.1 15.3C19.3944 16.7118 18.3098 17.8992 16.9674 18.7293C15.6251 19.5594 14.0782 19.9994 12.5 20C11.1801 20.0035 9.87812 19.6951 8.7 19.1L3 21L4.9 15.3C4.30493 14.1219 3.99656 12.8199 4 11.5C4.00061 9.92179 4.44061 8.37488 5.27072 7.03258C6.10083 5.69028 7.28825 4.60571 8.7 3.90003C9.87812 3.30496 11.1801 2.99659 12.5 3.00003H13C15.0843 3.11502 17.053 3.99479 18.5291 5.47086C20.0052 6.94694 20.885 8.91568 21 11V11.5Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-3">
                Welcome to Your Inbox
              </h2>
              <p className="text-gray-500 mb-8 max-w-md leading-relaxed text-lg">
                Select a conversation from the sidebar to start chatting, or
                begin a new conversation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full hover:from-red-600 hover:tored-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-medium md:hidden"
                >
                  View Conversations
                </button>
              
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inbox;