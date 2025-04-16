
export const getPriorityLabel = (priority: string): string => {
  switch (priority) {
    case "high":
      return "Высокий";
    case "medium":
      return "Средний";
    case "low":
      return "Низкий";
    default:
      return "Стандартный";
  }
};

export const getPriorityColor = (priority: string): string => {
  switch (priority) {
    case "high":
      return "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100";
    case "medium":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100";
    case "low":
      return "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
  }
};
