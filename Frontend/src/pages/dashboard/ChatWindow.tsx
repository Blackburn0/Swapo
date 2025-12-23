import { ChevronLeft, Phone, Image, SendHorizonal } from 'lucide-react';
import { useEnterKey } from '@/hooks/useEnterKey';
import { useMessageList } from '@/hooks/useMessageList';
import { useMessages } from '@/hooks/useMessages';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '@/utils/axiosInstance';

interface ChatWindowProps {
  selectedChatId: number;
  selectedUsername: string;
  setSelectedChatId: (id: number | null) => void;
}

const ChatWindow = ({
  selectedChatId,
  selectedUsername,
  setSelectedChatId,
}: ChatWindowProps) => {
  const {
    data: messages = [],
    sendMessage,
    isLoading: chatLoading,
  } = useMessages(selectedChatId);
  const { data: chatList = [] } = useMessageList();
  const navigate = useNavigate();
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('/auth/me');
        setProfile(res.data.user);
      } catch (err) {
        console.error('Failed to load user profile:', err);
      }
    };

    fetchProfile();
  }, []);

  const handleSend = async () => {
    if (!messageText.trim()) return;
    await sendMessage.mutateAsync({
      content: messageText,
      receiver: selectedChatId,
    });
    setMessageText('');
  };

  useEnterKey(handleSend);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (chatLoading) return <p className="p-4 text-center">Loading chat...</p>;

  const otherUser = chatList.find(
    (c: any) => c.other_user.user_id === selectedChatId,
  )?.other_user;

  return (
    <div className="flex flex-1 flex-col bg-stone-50 dark:bg-gray-900">
      {/* Header */}
      <div className="relative flex items-center justify-center border-b border-gray-200 pt-2 pb-4 dark:border-gray-700">
        <ChevronLeft
          size={28}
          className="absolute left-2 cursor-pointer text-gray-900 dark:text-gray-100"
          onClick={() => setSelectedChatId(null)}
        />
        <div className="text-center">
          <h1
            className="cursor-pointer text-xl font-bold text-gray-900 capitalize hover:text-gray-700 dark:text-gray-100 dark:hover:text-gray-400"
            onClick={() =>
              otherUser &&
              navigate(`/app/dashboard/profile/${otherUser.user_id}`)
            }
          >
            {selectedUsername || `User #${selectedChatId}`}
          </h1>
          <p className="text-sm font-semibold text-green-400">Online</p>
        </div>
        <Phone
          size={20}
          className="absolute right-3 cursor-pointer text-gray-900 dark:text-gray-100"
        />
      </div>

      {/* Messages */}
      <div className="hide-scrollbar-vertical flex flex-1 flex-col space-y-3 overflow-y-auto px-4 py-4">
        {messages.map((msg: any, idx: number) => {
          // Get current user ID from profile
          const currentUserId =
            profile?.user_id || profile?.profile_id || profile?.id;

          // Get message sender ID
          const messageSenderId =
            msg.sender_details?.user_id || msg.sender_details?.id || msg.sender;

          // Check if current user is the sender
          const isSender =
            currentUserId &&
            messageSenderId &&
            String(currentUserId) === String(messageSenderId);

          const senderDetails = msg.sender_details;
          const receiverDetails = msg.receiver_details;

          return (
            <div key={idx} className="flex flex-col space-y-1">
              {/* Message bubble - always aligned right for current user */}
              <div
                className={`flex items-end ${
                  isSender
                    ? 'ml-auto flex-row-reverse space-x-2 space-x-reverse'
                    : 'mr-auto flex-row space-x-2'
                }`}
                style={{ maxWidth: '85%' }}
              >
                <img
                  src={
                    isSender
                      ? senderDetails?.profile_picture_url ||
                        'https://img.icons8.com/office/40/person-female.png'
                      : receiverDetails?.profile_picture_url ||
                        'https://img.icons8.com/office/40/person-male.png'
                  }
                  alt={isSender ? 'You' : receiverDetails?.username || 'User'}
                  className="h-8 w-8 cursor-pointer rounded-full object-cover"
                  style={{ minWidth: '32px' }}
                  onClick={() =>
                    !isSender &&
                    navigate(
                      `/app/dashboard/profile/${receiverDetails?.user_id}`,
                    )
                  }
                />
                <div
                  className={`rounded-2xl px-4 py-2 text-sm ${
                    isSender
                      ? 'bg-red-800/90 text-white'
                      : 'bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-100'
                  }`}
                  style={{
                    borderBottomRightRadius: isSender ? '4px' : '16px',
                    borderBottomLeftRadius: isSender ? '16px' : '4px',
                  }}
                >
                  {msg.content}
                </div>
              </div>
              {/* Timestamp */}
              <div
                className={`text-xs ${
                  isSender
                    ? 'text-right text-gray-400 dark:text-gray-500'
                    : 'text-left text-gray-500 dark:text-gray-400'
                }`}
                style={{
                  paddingRight: isSender ? '40px' : '0',
                  paddingLeft: isSender ? '0' : '40px',
                }}
              >
                {new Date(msg.timestamp).toLocaleString()}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef}></div>
      </div>

      {/* Message Input */}
      <div className="mb-17 flex items-center space-x-2 border-t border-gray-200 bg-stone-50 px-2 pt-2 dark:border-gray-700 dark:bg-gray-900">
        <div className="flex flex-1 items-center rounded-full bg-gray-200 px-3 py-2 dark:bg-gray-700">
          <input
            type="text"
            placeholder="Message..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            className="flex-1 bg-transparent py-1 pl-2 text-gray-900 placeholder-gray-500 outline-none dark:text-gray-100 dark:placeholder-gray-400"
          />
          <div className="flex w-10 items-center justify-center text-gray-500 dark:text-gray-400">
            <Image size={18} />
          </div>
        </div>
        <div
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-red-800/90 text-white"
          onClick={handleSend}
          style={{ transition: 'background-color 0.2s' }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = '#1d4ed8')
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = '#2563eb')
          }
        >
          <SendHorizonal size={18} />
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
