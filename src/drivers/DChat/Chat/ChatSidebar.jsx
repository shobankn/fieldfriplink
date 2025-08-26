import { useEffect, useState, useRef } from "react";
import { useSocketContext } from "./SocketContext";
import customer from '../../../images/customer.png';
import DeleteChatModal from './DeleteChatModel';
import { MoreVertical } from "lucide-react";

const ChatSidebar = ({ onSelectChat, className, isOnline }) => {
  const socket = useSocketContext();
  const [chats, setChats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const chatsRef = useRef(chats);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [chatToDelete, setChatToDelete] = useState(null);
  const [activeChatId, setActiveChatId] = useState(null);
  const activeChatIdRef = useRef(activeChatId);

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

  useEffect(() => {
    if (!socket || !socket.userId) return;

    setIsLoading(true);
    socket.emit("GET_CHATS", { userId: socket.userId });

    const handleGetChatsSuccess = ({ chats }) => {
      console.log("[ChatSidebar] GET_CHATS_SUCCESS received:", chats);
      setChats(chats);
      setIsLoading(false);
    };

    const handleGetChatsError = () => {
      console.warn("No chats yet. Waiting for messages...");
      setIsLoading(false);
    };

    const handleReceiveMessage = (data) => {
      console.log("[ChatSidebar] RECEIVE_MESSAGE fired:", data);
      
      const actualMessage = data.completeMessage || data.message || data;
      const messageChatId = data.chatId || data.chat_id || actualMessage.chatId || actualMessage.chat_id;
      const currentChats = chatsRef.current;
      const chatExists = currentChats.some(c => c.chatId === messageChatId);

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
                  unreadCount:
                    messageChatId === activeChatIdRef.current
                      ? 0
                      : (chat.unreadCount || 0) + 1,
                  _updateKey: Date.now()
                }
              : chat
          )
        );
      }
    };

    const handleSendMessageSuccess = (data) => {
      console.log("[ChatSidebar] SEND_MESSAGE_SUCCESS fired:", data);
      
      const actualMessage = data.completeMessage || data.message || data;
      const messageChatId = data.chatId || data.chat_id || actualMessage.chatId || actualMessage.chat_id;
      const currentChats = chatsRef.current;
      const chatExists = currentChats.some(c => c.chatId === messageChatId);

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
                  unreadCount:
                    messageChatId === activeChatIdRef.current
                      ? 0
                      : (chat.unreadCount || 0) + 1,
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
    setActiveChatId(chat.chatId);
    const otherUser = chat.participants.find(p => p._id !== socket.userId);

    socket.emit("JOIN_CHAT", {
      user1Id: socket.userId,
      user2Id: otherUser._id,
    });

    socket.once("JOIN_CHAT_SUCCESS", (data) => {
      const { chatId, messages, participants } = data;
      const receiver = participants.find(p => p.userId !== socket.userId);

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
      <div className={`fixed left-0 top-0 w-80 bg-gray-50 border-r border-gray-200 z-50 shadow-lg overflow-hidden flex flex-col ${className}`} style={{ marginTop: "0px" }}>
        <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
          <p className="text-xl font-semibold text-gray-800">Chats</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            // Shimmer effect while loading
            <div className="space-y-4 p-6">
              {[...Array(5)].map((_, index) => (
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
            // No chats found message
            <div className="flex flex-col items-center justify-center py-12 px-6">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-gray-400">
                  <path d="M21 11.5C21.0034 12.8199 20.6951 14.1219 20.1 15.3C19.3944 16.7118 18.3098 17.8992 16.9674 18.7293C15.6251 19.5594 14.0782 19.9994 12.5 20C11.1801 20.0035 9.87812 19.6951 8.7 19.1L3 21L4.9 15.3C4.30493 14.1219 3.99656 12.8199 4 11.5C4.00061 9.92179 4.44061 8.37488 5.27072 7.03258C6.10083 5.69028 7.28825 4.60571 8.7 3.90003C9.87812 3.30496 11.1801 2.99659 12.5 3.00003H13C15.0843 3.11502 17.053 3.99479 18.5291 5.47086C20.0052 6.94694 20.885 8.91568 21 11V11.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p className="text-gray-500 text-center">No chats available</p>
              <p className="text-gray-400 text-sm text-center mt-1">Start a new conversation</p>
            </div>
          ) : (
            // Chat list
            sortedChats.map((chat) => {
              const participant = chat.participants.find(p => p._id !== socket.userId);
              if (!participant) return null;

              const isActive = chat.chatId === activeChatId;

              return (
                <div
                  key={`${chat.chatId}-${chat._updateKey || 0}`}
                  onClick={() => handleChatClick(chat)}
                  className={`flex items-center px-6 py-4 cursor-pointer transition-all duration-200 border-b border-gray-100 group ${isActive ? 'bg-red-100' : 'hover:bg-white'}`}
                >
                  <div className="relative">
                    <img
                      src={participant.profileImage || customer}
                      className={`w-12 h-12 rounded-full object-cover ring-2 ${isActive ? 'ring-[#ea4444]' : 'ring-gray-100 group-hover:ring-[#ea4444]'} transition-all duration-200`}
                      alt={`${participant.name}'s avatar`}
                    />
                    <div
                      className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white ${
                        isOnline ? "bg-green-500" : "bg-gray-400"
                      }`}
                    ></div>
                  </div>
                  <div className="ml-4 flex-1 min-w-0">
                    <p className={`text-sm font-semibold truncate ${isActive ? 'text-[#ea4444]' : 'text-gray-900 group-hover:text-[#ea4444]'} transition-colors duration-200`}>
                      {participant.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate mt-1">
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
                    <span className="text-xs text-gray-400">
                      {formatTime(chat.lastMessage?.timestamp || chat.updatedAt)}
                    </span>
                    {chat.unreadCount > 0 && (
                      <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        {chat.unreadCount}
                      </span>
                    )}
                    <button
                      onClick={(e) => openDeleteModal(chat, e)}
                      className="text-gray-400 hover:text-red-600 transition-colors duration-200"
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
        onDeleted={(chatId) =>
          setChats((prev) => prev.filter((c) => c.chatId !== chatId))
        }
      />
    </>
  );
};

export default ChatSidebar;