import toast from 'react-hot-toast';

export const handleError = (error) => {
  console.error('Error:', error);

  if (error.response) {
    // Server error response
    const message = error.response.data?.message || 'An error occurred';
    toast.error(message);
    return message;
  } else if (error.request) {
    // No response received
    const message = 'No response from server';
    toast.error(message);
    return message;
  } else {
    // Request setup error
    const message = error.message || 'An unexpected error occurred';
    toast.error(message);
    return message;
  }
};

export const handleSuccess = (message) => {
  toast.success(message);
}; 