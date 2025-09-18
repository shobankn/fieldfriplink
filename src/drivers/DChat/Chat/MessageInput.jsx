import { useEffect, useRef, useState } from "react";
import { useSocketContext } from "./SocketContext";
import { v4 as uuidv4 } from "uuid";

const MessageInput = ({ chatId, receiverId, onOptimisticSend, className }) => {
  const [message, setMessage] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);
  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const socket = useSocketContext();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const payload = token.split(".")[1];
      try {
        const decodedPayload = JSON.parse(atob(payload));
        const userId =
          decodedPayload.userId || decodedPayload.id || decodedPayload.sub;
        setCurrentUserId(userId);
      } catch (error) {
        console.error("Invalid token payload:", error);
      }
    }
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log("[MessageInput] Image selected:", file);
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const sendMessage = async () => {
    if (!message && !selectedImage) return;

    const messageId = Date.now().toString() + Math.floor(Math.random() * 1000);
    const generatedChatId = chatId?.chatId || chatId || uuidv4();

    let mediaUrl = null;

    if (selectedImage) {
      const formData = new FormData();
      formData.append("file", selectedImage);

      try {
        const response = await fetch(
          `https://fieldtriplinkbackend-production.up.railway.app/api/chat/upload-file/${generatedChatId}/${currentUserId}`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) throw new Error("Upload failed");

        const data = await response.json();
        mediaUrl = data.fileUrl;
      } catch (err) {
        console.error("Image upload failed:", err);
        return;
      }
    }

    const newMessage = {
      sender: currentUserId,
      receiverId,
      content: message || " ",
      content_type: selectedImage ? "image" : "text",
      media_url: mediaUrl,
      messageId,
      chatId: generatedChatId,
    };

    if (onOptimisticSend) onOptimisticSend(newMessage);

    socket.emit("SEND_MESSAGE", {
      senderId: currentUserId,
      receiverId,
      content: newMessage.content,
      contentType: newMessage.content_type,
      mediaFile: mediaUrl || null,
      messageId,
    });

    setMessage("");
    handleRemoveImage();
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  return (
    <div className={`fixed bottom-0 right-0 left-0 md:left-80 lg:left-145 2xl:left-165 bg-white/95 backdrop-blur-md border-t border-gray-200 z-20 transition-all duration-200 ${imagePreview ? 'pb-0' : ''}`}>
      {/* Image Preview - WhatsApp Style */}
      {imagePreview && (
        <div className="px-4 pt-3 pb-2 bg-gray-50/50 border-b border-gray-200">
          <div className="flex items-start gap-3">
            <div className="relative">
              <img
                src={imagePreview}
                alt="Selected"
                className="w-16 h-16 object-cover rounded-lg border-2 border-white shadow-md"
              />
              <button
                onClick={handleRemoveImage}
                className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-all duration-200 shadow-md"
              >
                ×
              </button>
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 mb-1">Photo</p>
              <p className="text-sm text-gray-700 truncate">
                {selectedImage?.name || 'Selected image'}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {selectedImage?.size ? `${(selectedImage.size / 1024 / 1024).toFixed(2)} MB` : ''}
              </p>
            </div>

            
          </div>
        </div>
      )}

      {/* Input Field - Always visible */}
      <div className="p-4">
        <div className="flex items-end gap-3">
          <div className="flex-1 bg-gray-50 rounded-full flex items-center px-5 py-3 shadow-sm hover:shadow-md transition-shadow duration-200">
            <input
              className="flex-1 bg-transparent placeholder-gray-500 text-gray-900 focus:outline-none text-sm"
              placeholder={imagePreview ? "Add a caption..." : "Type a message..."}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <span
              className="ml-3 p-1.5 text-gray-500 hover:text-red-500 transition-colors duration-200 cursor-pointer rounded-full hover:bg-gray-100"
              onClick={handleImageClick}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 10C10.1046 10 11 9.10457 11 8C11 6.89543 10.1046 6 9 6C7.89543 6 7 6.89543 7 8C7 9.10457 7.89543 10 9 10Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2.66992 18.95L7.59992 15.64C8.38992 15.11 9.52992 15.17 10.2399 15.78L10.5699 16.07C11.3499 16.74 12.6099 16.74 13.3899 16.07L17.5499 12.5C18.3299 11.83 19.5899 11.83 20.3699 12.5L21.9999 13.9"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
          <button
            onClick={sendMessage}
            disabled={!message && !selectedImage}
            className={`w-12 h-12 cursor-pointer rounded-full flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 ${
              (message || selectedImage)
                ? 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageInput;