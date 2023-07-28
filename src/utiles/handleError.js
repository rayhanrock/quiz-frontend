import { toast } from 'react-toastify';

export const handleError = (error) => {
  if (error.request && error.request.data) {
  } else if (error.response && error.response.data) {
    Object.entries(error.response.data).forEach(([key, value]) => {
      if (key == 'non_field_errors') {
        toast.error(value[0]);
      } else {
        if (key == 'message') {
          toast.error(value);
        } else {
          if (typeof value == 'string') {
            toast.error(
              key.charAt(0).toUpperCase() + key.slice(1) + ' : ' + value
            );
          } else {
            toast.error(
              key.charAt(0).toUpperCase() + key.slice(1) + ' : ' + value[0]
            );
          }
        }
      }
    });
  } else {
    toast.error(error.message);
  }
};
