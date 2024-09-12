// Function to format dates
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString(); // Formats the date to the user's local date format (e.g., MM/DD/YYYY)
};