export const getStatusColor = (status: string) => {
  const lowerStatus = status.toLowerCase();
  if (lowerStatus === 'pending' || lowerStatus === 'active') {
    return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400';
  }
  if (lowerStatus === 'in_progress') {
    return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400';
  }
  if (lowerStatus === 'completed') {
    return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
  }
  return 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300';
};

export const getStatusDotColor = (status: string) => {
  const lowerStatus = status.toLowerCase();
  if (lowerStatus === 'pending' || lowerStatus === 'active')
    return 'bg-yellow-500';
  if (lowerStatus === 'in_progress') return 'bg-blue-500';
  if (lowerStatus === 'completed') return 'bg-green-500';
  return 'bg-gray-400';
};
