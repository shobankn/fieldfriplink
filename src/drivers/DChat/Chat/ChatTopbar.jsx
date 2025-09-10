import { useEffect, useState } from 'react';
import customer from '../../../images/customer.png';
import formatLastSeen from './FormatedLastSeen'

const ChatTopBar = ({ receiver,isOnline, lastSeen,socketName,socketProfile,receiverId,receiverProfile }) => {

   const [userProfile, setUserProfile] = useState(null);
  
// const displayName = receiver?.fullName || receiver?.name || receiver?.username || receiverProfile?.name ;
const displayName = receiverProfile?.name ;

  const avatar =
    receiver?.profilePicture ||    // from JOIN_CHAT
    receiver?.profileImage ||      // from JOIN_CHAT (alternate key)
    socketProfile ||               // from socket status
    receiverProfile?.image || 
    receiver?.creatorPic ||
    customer; 
    
     console.log("Receiver info:", receiver);
  console.log("Socket Profile:", socketProfile);
  console.log("Fetched Profile:", userProfile);
  console.log("creator pic",receiver?.creatorPic)








  return (
    <div className='fixed top-25 right-0 left-80 lg:left-145  bg-white/95 backdrop-blur-md border-b border-gray-200 z-20 h-16'>
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <img 
              src={avatar} 
              alt={`${displayName}'s avatar`} 
              className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100" 
              onError={(e) => { e.target.src = customer; }}
            />
              <div
                  className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                    isOnline ? "bg-green-500" : "bg-gray-400"
                  }`}
                ></div>
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900 leading-tight">{displayName}</h2>
            
            {isOnline ? (
              <p className="text-sm text-green-500 font-medium">Online</p>
            ) : (
              <p className="text-sm text-gray-500 font-medium">
                 Last seen {formatLastSeen(lastSeen)}
              </p>
            )}

          </div>
        </div>
        
      
      </div>
    </div>
  );
};

export default ChatTopBar;



// remve user name