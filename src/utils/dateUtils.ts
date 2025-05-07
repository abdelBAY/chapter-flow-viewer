
import { formatDistanceToNow } from "date-fns";

/**
 * Checks if a date is within the last 3 days
 */
export const isRecentDate = (dateStr: string): boolean => {
  try {
    const date = new Date(dateStr);
    const now = new Date();
    // Consider dates less than 3 days old as "new"
    const timeDiff = now.getTime() - date.getTime();
    return timeDiff < 3 * 24 * 60 * 60 * 1000; // 3 days in milliseconds
  } catch (error) {
    return false;
  }
};

/**
 * Formats a date string into a human-readable format
 */
export const formatDate = (dateStr: string): string => {
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "Unknown date";
    const now = new Date();
    const timeDiff = now.getTime() - date.getTime();

    // Format as "X days" if less than 30 days
    if (timeDiff < 30 * 24 * 60 * 60 * 1000) {
      const days = Math.floor(timeDiff / (24 * 60 * 60 * 1000));
      return days === 0 ? "Today" : `${days} day${days > 1 ? 's' : ''} ago`;
    }
    return formatDistanceToNow(date, {
      addSuffix: true
    });
  } catch (error) {
    return "Unknown date";
  }
};
