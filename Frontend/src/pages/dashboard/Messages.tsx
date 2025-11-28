import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, Image, Phone, SendHorizonal } from 'lucide-react';
import { useMessages } from '@/hooks/useMessages';
import { useMessageList } from '@/hooks/useMessageList';
import { useEnterKey } from '@/hooks/useEnterKey';
import { useLocation } from 'react-router-dom';

const Messages = () => {
  const location = useLocation();
  const state = location.state as { userId?: number; username?: string };

  const [selectedChatId, setSelectedChatId] = useState<number | null>(
    state?.userId || null,
  );
  const { data: chatList = [], isLoading: listLoading } = useMessageList();
  const {
    data: messages = [],
    sendMessage,
    isLoading: chatLoading,
  } = useMessages(selectedChatId);
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSend = async () => {
    if (!messageText.trim() || !selectedChatId) return;
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

  if (listLoading)
    return <p className="mt-10 text-center">Loading messages...</p>;

  return (
    <div className="mx-auto flex h-[calc(100vh-60px)] max-w-4xl bg-stone-50 dark:bg-gray-900">
      {/* Left: Message List */}
      <div className="w-1/3 overflow-y-auto border-r border-gray-200 dark:border-gray-700">
        <h2 className="border-b p-4 text-lg font-bold text-gray-900 dark:border-gray-700 dark:text-gray-100">
          Chats
        </h2>
        {chatList.length === 0 && (
          <p className="p-4 text-gray-500">No messages yet</p>
        )}
        {chatList.map((chat: any) => (
          <div
            key={chat.message_id}
            className={`cursor-pointer border-b border-gray-100 p-4 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800 ${
              selectedChatId === chat.message_id
                ? 'bg-gray-100 dark:bg-gray-800'
                : ''
            }`}
            onClick={() => setSelectedChatId(chat.message_id)}
          >
            <p className="text-left font-medium text-gray-900 dark:text-gray-100">
              {chat.content}
            </p>
            <p className="mt-1 text-left text-xs text-gray-500">
              {new Date(chat.timestamp).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* Right: Chat Details */}
      <div className="flex flex-1 flex-col justify-between">
        {!selectedChatId ? (
          <div className="flex h-full items-center justify-center text-gray-500">
            Select a chat to view messages
          </div>
        ) : chatLoading ? (
          <p className="mt-10 text-center">Loading chat...</p>
        ) : (
          <>
            {/* Header */}
            <div className="relative flex items-center justify-center border-b border-gray-200 pt-2 pb-4 dark:border-gray-700">
              <ChevronLeft
                size={28}
                className="absolute left-2 cursor-pointer text-gray-900 dark:text-gray-100"
                onClick={() => setSelectedChatId(null)}
              />
              <div className="text-center">
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Chat #{selectedChatId}
                </h1>
                <p className="text-sm font-semibold text-green-400">Online</p>
              </div>
              <Phone
                size={20}
                className="absolute right-3 cursor-pointer text-gray-900 dark:text-gray-100"
              />
            </div>

            {/* Messages */}
            <div className="hide-scrollbar-vertical flex flex-col space-y-2 overflow-y-auto px-2 py-3">
              {messages.map((msg: any, idx: number) => (
                <div key={idx} className="flex flex-col space-y-1">
                  <div
                    className={`flex items-end ${
                      msg.is_sender ? 'justify-end' : 'justify-start'
                    } space-x-2`}
                  >
                    {!msg.is_sender && (
                      <img
                        src={
                          msg.sender_avatar ||
                          'https://img.icons8.com/office/40/person-male.png'
                        }
                        alt={msg.sender_name}
                        className="h-8 w-8 rounded-full"
                      />
                    )}
                    <div
                      className={`max-w-[70%] p-3 text-sm ${
                        msg.is_sender
                          ? 'rounded-tl-lg rounded-tr-lg rounded-br-none rounded-bl-lg bg-red-500 text-right text-white dark:bg-red-500'
                          : 'rounded-lg rounded-br-lg rounded-bl-none bg-gray-200 text-left text-gray-900 dark:bg-gray-700 dark:text-gray-100'
                      }`}
                    >
                      {msg.content || msg.text}
                    </div>
                    {msg.is_sender && (
                      <img
                        src={
                          msg.sender_avatar ||
                          'https://img.icons8.com/office/40/person-female.png'
                        }
                        alt="You"
                        className="h-8 w-8 rounded-full"
                      />
                    )}
                  </div>
                  <div
                    className={`text-xs ${
                      msg.is_sender
                        ? 'mr-10 text-right text-gray-400'
                        : 'ml-10 text-left text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {new Date(msg.timestamp).toLocaleString()}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef}></div>
            </div>

            {/* Message Input */}
            <div className="mb-2 flex items-center space-x-2 border-t border-gray-200 bg-stone-50 px-2 pt-2 dark:border-gray-700 dark:bg-gray-900">
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
                className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-white transition-colors hover:bg-red-700"
                onClick={handleSend}
              >
                <SendHorizonal size={18} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Messages;
