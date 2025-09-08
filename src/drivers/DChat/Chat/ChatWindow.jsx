import React, { useEffect, useRef } from 'react';
import noMessage from '../../../images/no-message.png';
import { useSocketContext } from './SocketContext';
import customer from '../../../images/customer.png';
import { Trash } from 'lucide-react';

const ChatWindow = ({ chatId, messages = [], receiver, receiverId, onDeleteMessage, socketName, socketProfile }) => {
  const socket = useSocketContext();
  const bottomRef = useRef(null);

  // Auto-scroll on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleDeleteMessage = (messageId) => {
    if (!socket?.userId || !chatId || !receiverId) return;
    socket.emit('DELETE_MESSAGE', {
      messageId,
      userId: socket.userId,
      chatId,
      receiverId,
    });
    onDeleteMessage?.(messageId);
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${ampm}`;
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Chat messages container */}
      <div className="flex-1 overflow-y-auto px-4 pt-18 pb-4 w-full">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="w-32 h-32 mb-6 opacity-50">
              <img className="w-full h-full object-contain" src={noMessage} alt="No Message" />
            </div>
            <p className="text-gray-500 text-lg">No Chat yet</p>
            <p className="text-gray-400 text-sm mt-2">Start a conversation by sending a message</p>
          </div>
        ) : (
          <>
            {messages.map((msg, index) => {
              const messageSender = msg.sender || msg.senderId || msg.from;
              const isMyMessage = messageSender === socket.userId;
              const isImage = (msg.content_type || msg.contentType || '').toLowerCase() === 'image';
              const prevMsg = messages[index - 1];
              const prevSender = prevMsg ? (prevMsg.sender || prevMsg.senderId || prevMsg.from) : null;
              const isSameUser = prevSender && prevSender === messageSender;
              const showAvatar = !isMyMessage && !isSameUser;

              return (
            <div
  key={msg._id || msg.tempId || msg.messageId || index}
  className={`mb-4 flex w-full ${isMyMessage ? 'justify-end' : 'justify-start'}`}
>
  <div
    className={`flex items-center gap-2 max-w-[70%] group ${
      isMyMessage ? 'flex-row-reverse ml-auto' : 'flex-row mr-auto'
    }`}
  >
    {/* Avatar */}
    {!isMyMessage && (
      <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center">
        <img
          src={receiver?.profilePicture || receiver?.profileImage || socketProfile || customer}
          alt="Avatar"
          className="w-8 h-8 rounded-full object-cover"
        />
      </div>
    )}

    {/* Message bubble + trash */}
    <div
      className={`flex items-center gap-2 ${
        isMyMessage ? 'flex-row-reverse' : 'flex-row'
      }`}
    >
      {/* Message bubble */}
      <div
        className={`relative px-4 py-3 rounded-2xl shadow-sm ${
          isMyMessage
            ? 'bg-red-400 text-white rounded-br-md'
            : 'bg-[#F1F2F2] text-[#000000B2] rounded-bl-md border border-gray-100'
        } ${msg.isOptimistic ? 'opacity-100' : ''}`}
      >
        {isImage && msg.media_url ? (
          <div className="space-y-2">
            <img
              src={msg.media_url}
              alt="Shared"
              className="w-full max-w-sm rounded-lg shadow-md cursor-pointer hover:shadow-lg"
              onClick={() => window.open(msg.media_url, '_blank')}
              onLoad={() =>
                bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
              }
            />
            {msg.content?.trim() && <p className="text-sm mt-2">{msg.content}</p>}
          </div>
        ) : (
          <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">
            {msg.content || 'Message content not available'}
          </p>
        )}

        {/* Time + ticks */}
        <div
          className={`flex items-center justify-${
            isMyMessage ? 'end' : 'start'
          } mt-2 gap-1`}
        >
          <p className="text-xs text-gray-400">
            {formatTime(msg.timestamp || msg.createdAt)}
          </p>
          {isMyMessage && (
            <span className="inline-flex ml-1">
              {msg.status === 'read' ? (
                <svg
                  className="w-4 h-4 text-blue-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path d="M1 12l4 4L15 6" strokeWidth="2" />
                  <path d="M8 12l4 4L22 2" strokeWidth="2" />
                </svg>
              ) : msg.status === 'delivered' ? (
                <svg
                  className="w-4 h-4 text-gray-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path d="M1 12l4 4L15 6" strokeWidth="2" />
                  <path d="M8 12l4 4L22 2" strokeWidth="2" />
                </svg>
              ) : (
                <svg
                  className="w-4 h-4 text-gray-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path d="M1 12l4 4L15 6" strokeWidth="2" />
                </svg>
              )}
            </span>
          )}
        </div>
      </div>

      {/* Trash always on right */}
      <Trash
        onClick={() => handleDeleteMessage(msg._id || msg.messageId)}
        className="w-4 h-4 text-gray-400 hover:text-red-500 cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-200 flex-shrink-0"
      />
    </div>
  </div>
</div>

              );
            })}
            <div ref={bottomRef} />
          </>
        )}
      </div>
    </div>
  );
};

export default ChatWindow;
