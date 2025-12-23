import { CheckCircle, Info, XCircle } from 'lucide-react';

interface ToastItem {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

const Toaster = ({ toasts }: { toasts: ToastItem[] }) => {
  return (
    <div className="fixed right-5 bottom-5 z-[1000] flex flex-col items-end gap-3">
      {toasts.map((toast) => {
        const { id, message, type } = toast;

        // Define color and icon per type
        const toastStyle =
          type === 'success'
            ? 'border-green-400/70 bg-green-600/90'
            : type === 'error'
              ? 'border-red-400/70 bg-red-600/90'
              : 'border-blue-400/70 bg-blue-600/90';

        const Icon =
          type === 'success' ? CheckCircle : type === 'error' ? XCircle : Info;

        return (
          <div
            key={id}
            className={`flex items-center gap-3 rounded-xl border ${toastStyle} animate-slide-in max-w-sm min-w-[260px] px-5 py-3 text-white shadow-lg backdrop-blur-md`}
          >
            <Icon className="h-5 w-5 flex-shrink-0 self-center" />
            <span className="text-sm leading-tight">{message}</span>
          </div>
        );
      })}
    </div>
  );
};

export default Toaster;
