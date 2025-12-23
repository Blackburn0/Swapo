import { useState } from 'react';
import { useMessageList } from '@/hooks/useMessageList';
import { useLocation, useNavigate } from 'react-router-dom';
import ChatWindow from './ChatWindow';
import { ChevronLeft } from 'lucide-react';

const Messages = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { userId?: number; username?: string };

  const [selectedChatId, setSelectedChatId] = useState<number | null>(
    state?.userId || null,
  );
  const [selectedUsername, setSelectedUsername] = useState<string>(
    state?.username || '',
  );

  const { data: chatList = [], isLoading: listLoading } = useMessageList();

  if (listLoading)
    return <p className="mt-10 text-center">Loading messages...</p>;

  return (
    <div className="mx-auto flex h-[calc(100vh-60px)] max-w-4xl bg-stone-50 dark:bg-gray-900">
      {!selectedChatId ? (
        // Chat List
        <div className="flex-1 overflow-y-auto p-4">
          <ChevronLeft
            size={28}
            className="absolute left-2 cursor-pointer text-gray-900 dark:text-gray-100"
            onClick={() => navigate(-1)}
          />
          <h2 className="mb-4 text-lg font-bold text-gray-900 dark:text-gray-100">
            Chats
          </h2>
          {chatList.length === 0 ? (
            <p className="text-gray-500">No messages yet</p>
          ) : (
            chatList.map((conversation: any) => {
              const otherUser = conversation.other_user;
              const lastMsg = conversation.last_message;
              const hasUnread = conversation.unread_count > 0;
              const displayName =
                otherUser.first_name && otherUser.last_name
                  ? `${otherUser.first_name} ${otherUser.last_name}`
                  : otherUser.username;

              return (
                <div
                  key={otherUser.user_id}
                  className="flex cursor-pointer items-center space-x-5 border-b border-gray-200 px-2 py-4 hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-gray-800/50"
                >
                  <div>
                    <img
                      src={
                        otherUser.profile_picture_url ||
                        'https://img.icons8.com/office/40/person-male.png'
                      }
                      alt={displayName}
                      className="h-10 w-10 rounded-full"
                      onClick={() =>
                        navigate(`/app/dashboard/profile/${otherUser.user_id}`)
                      }
                    />
                  </div>

                  {/* Message Info */}
                  <div
                    className="relative w-full text-left"
                    onClick={() => {
                      setSelectedChatId(otherUser.user_id);
                      setSelectedUsername(displayName);
                    }}
                  >
                    <p
                      className={`font-medium capitalize hover:text-gray-700 dark:hover:text-gray-300 ${
                        hasUnread
                          ? 'font-semibold text-gray-900 dark:text-gray-100'
                          : 'text-gray-900 dark:text-gray-100'
                      }`}
                    >
                      {displayName}
                    </p>
                    <p
                      className={`truncate text-xs ${
                        hasUnread
                          ? 'font-medium text-gray-700 dark:text-gray-300'
                          : 'text-gray-500'
                      }`}
                    >
                      {lastMsg.content}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      {new Date(lastMsg.timestamp).toLocaleString()}
                    </p>
                    {hasUnread && (
                      <span className="absolute top-6.5 right-0 h-3 w-3 rounded-full border-2 border-red-800/90 bg-white dark:border-gray-900"></span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        // Chat Window
        <div className="flex flex-1 flex-col">
          <ChatWindow
            selectedChatId={selectedChatId}
            selectedUsername={selectedUsername}
            setSelectedChatId={setSelectedChatId}
          />
        </div>
      )}
    </div>
  );
};

export default Messages;
