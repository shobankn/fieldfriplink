import { useEffect, useState, useRef } from "react";
import { useSocketContext } from "./SocketContext";
import customer from '../../images/customer.png';
import DeleteChatModal from './DeleteChatModel';
import { MoreVertical, Trash2 } from "lucide-react";

const ChatSidebar = ({ onSelectChat, className, userStatuses,socketName,socketProfile,onDeleteChat,receiverProfile  }) => {
  const socket = useSocketContext();
  const [chats, setChats] = useState([]);
  const chatsRef = useRef(chats); // Keep a ref to current chats
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [chatToDelete, setChatToDelete] = useState(null);
  const [activeChatId, setActiveChatId] = useState(null);
  const activeChatIdRef = useRef(activeChatId);
  const [isLoading, setIsLoading] = useState(true); // Added loading state

  // Keep ref in sync
  useEffect(() => {
    activeChatIdRef.current = activeChatId;
  }, [activeChatId]);

  const openDeleteModal = (chat, e) => {
    e.stopPropagation();
    setChatToDelete(chat);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setChatToDelete(null);
  };

  // Update ref whenever chats change
  useEffect(() => {
    chatsRef.current = chats;
  }, [chats]);



  const calculateUnreadCount = (chat, messageChatId, actualMessage, socket, activeChatIdRef) => {
  const senderId = actualMessage.sender?._id || actualMessage.sender || actualMessage.senderId || actualMessage.from;

  // Case 1: message is from me → no unread count
  if (senderId === socket.userId) {
    return 0;
  }

  // Case 2: message is from someone else but I'm in that chat → no unread count
  if (messageChatId === activeChatIdRef.current) {
    return 0;
  }

  // Case 3: message is from someone else in another chat → increment
  return (chat.unreadCount || 0) + 1;
};


  useEffect(() => {
    if (!socket || !socket.userId) return;

    socket.emit("GET_CHATS", { userId: socket.userId });

    const handleGetChatsSuccess = ({ chats }) => {
      console.log("[ChatSidebar] GET_CHATS_SUCCESS received:", chats);
      setChats(chats);
      setIsLoading(false); // Stop loading when chats are fetched
    };

    const handleGetChatsError = () => {
      console.warn("No chats yet. Waiting for messages...");
      setIsLoading(false); // Stop loading on error
    };
    

    const handleReceiveMessage = (data) => {
      console.log("[ChatSidebar] RECEIVE_MESSAGE fired:", data);
      
      // Extract the actual message from the nested structure
      const actualMessage = data.completeMessage || data.message || data;
      const messageChatId = data.chatId || data.chat_id || actualMessage.chatId || actualMessage.chat_id;
      const currentChats = chatsRef.current;
      const chatExists = currentChats.some(c => c.chatId === messageChatId);

      // Get message content from the actual message object
      const messageContent = actualMessage.content || actualMessage.message || actualMessage.text || actualMessage.body || '';
      
      if (!messageContent || messageContent.trim() === '') {
        console.log(`[ChatSidebar] Skipping update — empty content for chat ${messageChatId}`);
        return;
      }

      if (!chatExists) {
        socket.emit("GET_CHATS", { userId: socket.userId });
      } else {
        setChats(prevChats =>
          prevChats.map(chat =>
            chat.chatId === messageChatId
              ? {
                  ...chat,
                  lastMessage: {
                    content: messageContent,
                    timestamp: actualMessage.timestamp || actualMessage.createdAt || data.timestamp || data.createdAt || new Date().toISOString(),
                    sender: actualMessage.sender || actualMessage.senderId || actualMessage.from || data.sender || data.senderId || data.from
                  },
                  updatedAt: actualMessage.timestamp || actualMessage.createdAt || data.timestamp || data.createdAt || new Date().toISOString(),
                  // unreadcount
                 unreadCount: calculateUnreadCount(chat, messageChatId, actualMessage, socket, activeChatIdRef),

                  _updateKey: Date.now()
                }
              : chat
          )
        );
      }
    };

    const handleSendMessageSuccess = (data) => {
      console.log("[ChatSidebar] SEND_MESSAGE_SUCCESS fired:", data);
      
      // Extract the actual message from the nested structure
      const actualMessage = data.completeMessage || data.message || data;
      const messageChatId = data.chatId || data.chat_id || actualMessage.chatId || actualMessage.chat_id;
      const currentChats = chatsRef.current;
      const chatExists = currentChats.some(c => c.chatId === messageChatId);

      // Get message content from the actual message object  
      const messageContent = actualMessage.content || actualMessage.message || actualMessage.text || actualMessage.body || '';

      console.log("[ChatSidebar] Extracted message content:", messageContent);
      console.log("[ChatSidebar] Full incoming message payload:", JSON.stringify(data, null, 2));

      if (!messageContent || messageContent.trim() === '') {
        console.log(`[ChatSidebar] Skipping update — empty content for chat ${messageChatId}`);
        return;
      }

      if (!chatExists) {
        socket.emit("GET_CHATS", { userId: socket.userId });
      } else {
        setChats(prevChats =>
          prevChats.map(chat =>
            chat.chatId === messageChatId
              ? {
                  ...chat,
                  lastMessage: {
                    content: messageContent,
                    timestamp: actualMessage.timestamp || actualMessage.createdAt || data.timestamp || data.createdAt || new Date().toISOString(),
                    sender: actualMessage.sender || actualMessage.senderId || actualMessage.from || data.sender || data.senderId || data.from
                  },
                  updatedAt: actualMessage.timestamp || actualMessage.createdAt || data.timestamp || data.createdAt || new Date().toISOString(),
                  // unread Count
                 unreadCount: calculateUnreadCount(chat, messageChatId, actualMessage, socket, activeChatIdRef),

                  _updateKey: Date.now()
                }
              : chat
          )
        );
      }
    };

    socket.on("GET_CHATS_SUCCESS", handleGetChatsSuccess);
    socket.on("GET_CHATS_ERROR", handleGetChatsError);
    socket.on("RECEIVE_MESSAGE", handleReceiveMessage);
    socket.on("SEND_MESSAGE_SUCCESS", handleSendMessageSuccess);

    return () => {
      socket.off("GET_CHATS_SUCCESS", handleGetChatsSuccess);
      socket.off("GET_CHATS_ERROR", handleGetChatsError);
      socket.off("RECEIVE_MESSAGE", handleReceiveMessage);
      socket.off("SEND_MESSAGE_SUCCESS", handleSendMessageSuccess);
    };
  }, [socket]);

  const handleChatClick = (chat) => {
    setActiveChatId(chat.chatId); // Mark active chat
    const otherUser = chat.participants.find(p => p._id !== socket.userId);

    socket.emit("JOIN_CHAT", {
      user1Id: socket.userId,
      user2Id: otherUser._id,
    });

    socket.once("JOIN_CHAT_SUCCESS", (data) => {
      const { chatId, messages, participants } = data;
      const receiver = participants.find(p => p.userId !== socket.userId);

      // Reset unread count when user opens the chat
      setChats(prevChats =>
        prevChats.map(c =>
          c.chatId === chat.chatId ? { ...c, unreadCount: 0 } : c
        )
      );

      onSelectChat({
        chatId,
        messages,
        receiverId: receiver?.userId,
        receiver: {
          _id: otherUser?.userId,
          fullName: otherUser?.fullName,
          profilePicture: otherUser?.profilePicture,
        }
      });
    });
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${ampm}`;
  };
  

  const sortedChats = [...chats].sort((a, b) => {
    const aTime = new Date(a.updatedAt || a.lastMessage?.timestamp || 0);
    const bTime = new Date(b.updatedAt || b.lastMessage?.timestamp || 0);
    return bTime - aTime;
  });
  

  return (
    <>
      <div className={`fixed left-0 top:0 w-80 bg-gray-50 border-r border-gray-200 z-50 shadow-lg overflow-hidden flex flex-col ${className}`} style={{ marginTop: "0px" }}>
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <p className="text-xl font-semibold text-gray-800">Chats</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {/* Shimmer effect for loading state */}
              {[...Array(3)].map((_, index) => (
                <div key={index} className="flex items-center space-x-4 animate-pulse">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                  <div className="h-3 bg-gray-200 rounded w-12"></div>
                </div>
              ))}
            </div>
          ) : sortedChats.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 bg-white px-6">
           
            </div>
          ) : (
            sortedChats.map((chat) => {
              const participant = chat.participants.find(p => p._id !== socket.userId);
              const isOnline = userStatuses?.[participant._id]?.is_online || false;

              if (!participant) return null;
              console.log(participant);

              return (
                <div
                  key={`${chat.chatId}-${chat._updateKey || 0}`}
                  onClick={() => handleChatClick(chat)}
                  className={`flex items-center px-6 py-4 cursor-pointer transition-all duration-200 border-b border-gray-100 group ${
                    activeChatId === chat.chatId ? 'bg-red-200' : 'hover:bg-red-200'
                  }`}
                >
                  <div className="relative">
                    <img
                      src={participant.profileImage || customer || socketProfile || receiverProfile?.image}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100 group-hover:ring-red-200 transition-all duration-200"
                      alt={`${participant.name || socketName}'s avatar`}
                    />
                    <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white ${isOnline ? "bg-green-500" : "bg-gray-400"}`}></div>
                  </div>
                  <div className="ml-4 flex-1 min-w-0">
                    <p className={`text-sm font-semibold truncate group-hover:text-red-600 transition-colors duration-200 ${activeChatId === chat.chatId ? 'text-red-600' : 'text-gray-900'}`}>
                      {participant.name || receiverProfile?.name || socketName}
                    </p>
                    <p className={`text-xs truncate mt-1 ${activeChatId === chat.chatId ? 'text-red-600' : 'text-gray-500'}`}>
                      {chat.lastMessage ? (
                        (chat.lastMessage.sender?._id === socket.userId || chat.lastMessage.sender === socket.userId)
                          ? `You: ${chat.lastMessage.content}`
                          : chat.lastMessage.content
                      ) : (
                        "No messages yet"
                      )}
                    </p>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    <span className={`text-xs ${activeChatId === chat.chatId ? 'text-red-600' : 'text-gray-400'}`}>
                      {formatTime(chat.lastMessage?.timestamp || chat.updatedAt)}
                    </span>
                    {chat.unreadCount > 0 && (
                      <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        {chat.unreadCount}
                      </span>
                    )}
                    <button
                      onClick={(e) => openDeleteModal(chat, e)}
                      className=" cursor-pointer text-gray-400 hover:text-red-600 transition-colors duration-200"
                    >
                      <MoreVertical size={16} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
      <DeleteChatModal
  isOpen={showDeleteModal}
  chat={chatToDelete}
  onClose={closeDeleteModal}
  socketName={socketName}
  socketProfile={socketProfile}
onDeleted={(chatId) => {
  setChats((prev) => prev.filter((c) => c.chatId !== chatId));

  // Clear active chat state if the deleted chat was open
  if (localStorage.getItem("receiverId")) {
    localStorage.removeItem("receiverId");
  }
  if (localStorage.getItem("activeChatId") === chatId) {
    localStorage.removeItem("activeChatId");
  }

  if (onDeleteChat) onDeleteChat(chatId); // tell parent to close ChatWindow
}}
/>
    </>
  );
};

export default ChatSidebar;