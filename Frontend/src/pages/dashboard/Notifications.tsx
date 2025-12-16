import { useMemo } from 'react';
import { Bell, ChevronLeft } from 'lucide-react';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '@/hooks/useNotifications';

const Notifications = () => {
  const navigate = useNavigate();
  const { notifications, isLoading, markAllAsRead, markAsRead } =
    useNotifications();

  // Filter notifications to show only required types
  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) =>
      [
        'new_message',
        'trade_proposal',
        'trade_accepted',
        'system_alert',
      ].includes(n.type),
    );
  }, [notifications]);

  // Group notifications by time
  const grouped = useMemo(() => {
    const today: typeof filteredNotifications = [];
    const yesterday: typeof filteredNotifications = [];
    const older: typeof filteredNotifications = [];

    const now = new Date();
    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const yesterdayStart = new Date(todayStart);
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);

    filteredNotifications.forEach((notification) => {
      const notifDate = new Date(notification.timestamp);
      if (notifDate >= todayStart) {
        today.push(notification);
      } else if (notifDate >= yesterdayStart) {
        yesterday.push(notification);
      } else {
        older.push(notification);
      }
    });

    return { today, yesterday, older };
  }, [filteredNotifications]);

  const handleMarkAllRead = () => {
    markAllAsRead.mutate();
  };

  const handleNotificationClick = (notification: (typeof notifications)[0]) => {
    // Mark as read
    if (!notification.is_read) {
      markAsRead.mutate(notification.notification_id);
    }

    // Navigate based on notification type
    switch (notification.type) {
      case 'new_message':
        if (notification.sender_details) {
          navigate('/app/dashboard/messages', {
            state: {
              userId: notification.sender_details.user_id,
              username:
                notification.sender_details.first_name &&
                notification.sender_details.last_name
                  ? `${notification.sender_details.first_name} ${notification.sender_details.last_name}`
                  : notification.sender_details.username,
            },
          });
        } else {
          navigate('/app/dashboard/messages');
        }
        break;
      case 'trade_proposal':
        if (notification.proposal_details) {
          navigate(
            `/app/dashboard/proposal/${notification.proposal_details.proposal_id}`,
          );
        } else {
          navigate('/app/dashboard/trade');
        }
        break;
      case 'trade_accepted':
        if (notification.trade_details) {
          navigate(
            `/app/dashboard/trade/${notification.trade_details.trade_id}`,
          );
        } else {
          navigate('/app/dashboard/trade');
        }
        break;
      case 'system_alert':
        // No navigation for system alerts
        break;
      default:
        break;
    }
  };

  const getNotificationTitle = (notification: (typeof notifications)[0]) => {
    switch (notification.type) {
      case 'new_message':
        return notification.sender_details
          ? `Message from ${notification.sender_details.first_name || notification.sender_details.username}`
          : 'New Message';
      case 'trade_proposal':
        return 'New Trade Proposal';
      case 'trade_accepted':
        return 'Trade Accepted';
      case 'system_alert':
        return 'System Announcement';
      default:
        return 'Notification';
    }
  };

  const getNotificationIcon = (notification: (typeof notifications)[0]) => {
    if (notification.type === 'system_alert') {
      return 'text-red-500 bg-red-50 dark:bg-red-900/20';
    }
    return 'bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-200';
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">
          Loading notifications...
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col bg-[#FAFAFA] dark:bg-black">
      {/* Header */}
      <header className="mx-auto flex w-full max-w-2xl items-center justify-between px-4 py-5 md:px-8 md:pt-8">
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.history.back()}
            className="cursor-pointer rounded-full p-2 transition hover:bg-gray-100 dark:hover:bg-black/50"
            aria-label="Go back"
          >
            <ChevronLeft size={26} className="text-gray-800 dark:text-white" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
            Notifications
          </h1>
        </div>

        <button
          onClick={handleMarkAllRead}
          className="cursor-pointer text-sm font-medium text-red-600 hover:underline dark:text-red-500"
        >
          Mark all as read
        </button>
      </header>

      {/* Notifications */}
      <main className="flex-1 overflow-y-auto px-4 pb-24 md:px-8 md:pb-28">
        <div className="mx-auto max-w-2xl space-y-6">
          {filteredNotifications.length === 0 ? (
            <div className="py-8 text-center text-gray-500 dark:text-gray-400">
              No notifications yet
            </div>
          ) : (
            <>
              {/* Today */}
              {grouped.today.length > 0 && (
                <section>
                  <h2 className="mb-2 text-sm font-semibold text-gray-500 dark:text-gray-300">
                    Today
                  </h2>
                  <div className="grid gap-3 md:gap-4">
                    {grouped.today.map((n) => (
                      <div
                        key={n.notification_id}
                        onClick={() => handleNotificationClick(n)}
                        className="flex cursor-pointer items-start gap-3 rounded-xl bg-white p-4 shadow-sm transition hover:bg-gray-50 md:p-5 dark:bg-gray-700 dark:hover:bg-gray-600"
                      >
                        {/* Avatar or Icon */}
                        {n.sender_details?.profile_picture_url ? (
                          <img
                            src={n.sender_details.profile_picture_url}
                            alt={getNotificationTitle(n)}
                            className="h-10 w-10 rounded-full object-cover md:h-12 md:w-12"
                          />
                        ) : (
                          <div
                            className={clsx(
                              'flex h-10 w-10 items-center justify-center rounded-full md:h-12 md:w-12',
                              getNotificationIcon(n),
                            )}
                          >
                            <Bell size={18} />
                          </div>
                        )}

                        {/* Text */}
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <h3 className="text-sm font-semibold text-gray-900 md:text-base dark:text-white">
                              {getNotificationTitle(n)}
                            </h3>
                            {!n.is_read && (
                              <span className="h-2.5 w-2.5 rounded-full border-2 border-red-500 bg-white" />
                            )}
                          </div>
                          <p className="mt-0.5 text-left text-sm leading-snug text-gray-600 dark:text-gray-300">
                            {n.message_text}
                          </p>
                          <p className="mt-2 text-left text-xs text-gray-400 md:text-sm">
                            {formatTime(n.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Yesterday */}
              {grouped.yesterday.length > 0 && (
                <section>
                  <h2 className="mb-2 text-sm font-semibold text-gray-500 dark:text-gray-300">
                    Yesterday
                  </h2>
                  <div className="grid gap-3 md:gap-4">
                    {grouped.yesterday.map((n) => (
                      <div
                        key={n.notification_id}
                        onClick={() => handleNotificationClick(n)}
                        className="flex cursor-pointer items-start gap-3 rounded-xl bg-white p-4 shadow-sm transition hover:bg-gray-50 md:p-5 dark:bg-gray-700 dark:hover:bg-gray-600"
                      >
                        {n.sender_details?.profile_picture_url ? (
                          <img
                            src={n.sender_details.profile_picture_url}
                            alt={getNotificationTitle(n)}
                            className="h-10 w-10 rounded-full object-cover md:h-12 md:w-12"
                          />
                        ) : (
                          <div
                            className={clsx(
                              'flex h-10 w-10 justify-center rounded-full md:h-12 md:w-12',
                              getNotificationIcon(n),
                            )}
                          >
                            <Bell size={18} />
                          </div>
                        )}

                        <div className="flex-1">
                          <h3 className="text-sm font-semibold text-gray-900 md:text-base dark:text-white">
                            {getNotificationTitle(n)}
                          </h3>
                          <p className="mt-0.5 text-left text-sm leading-snug text-gray-600 dark:text-gray-300">
                            {n.message_text}
                          </p>
                          <p className="mt-2 text-left text-xs text-gray-400 md:text-sm dark:text-gray-400">
                            {formatTime(n.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Older */}
              {grouped.older.length > 0 && (
                <section>
                  <h2 className="mb-2 text-sm font-semibold text-gray-500 dark:text-gray-300">
                    Older
                  </h2>
                  <div className="grid gap-3 md:gap-4">
                    {grouped.older.map((n) => (
                      <div
                        key={n.notification_id}
                        onClick={() => handleNotificationClick(n)}
                        className="flex cursor-pointer gap-3 rounded-xl bg-white p-4 text-left shadow-sm transition hover:bg-gray-50 md:p-5 dark:bg-gray-700 dark:hover:bg-gray-600"
                      >
                        {n.sender_details?.profile_picture_url ? (
                          <img
                            src={n.sender_details.profile_picture_url}
                            alt={getNotificationTitle(n)}
                            className="h-10 w-10 rounded-full object-cover md:h-12 md:w-12"
                          />
                        ) : (
                          <div
                            className={clsx(
                              'flex h-10 w-10 items-center justify-center rounded-full md:h-12 md:w-12',
                              getNotificationIcon(n),
                            )}
                          >
                            <Bell size={18} />
                          </div>
                        )}

                        <div className="flex-1">
                          <h3 className="text-sm font-semibold text-gray-900 md:text-base dark:text-white">
                            {getNotificationTitle(n)}
                          </h3>
                          <p className="mt-0.5 text-sm leading-snug text-gray-600 dark:text-gray-300">
                            {n.message_text}
                          </p>
                          <p className="mt-2 text-xs text-gray-400 md:text-sm dark:text-gray-400">
                            {formatTime(n.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Notifications;
