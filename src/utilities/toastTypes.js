import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure({
  limit: 3,
});


let toastConfig = {
  basicToast: (message) =>
    toast(message, {
      autoClose: 2400,
      position: toast.POSITION.TOP_RIGHT,
    }),
  errorToast: (message) =>
    toast.error(message, {
      autoClose: 2400,
      position: toast.POSITION.TOP_RIGHT,
    }),
  infoToast: (message) =>
    toast.info(message, {
      autoClose: 2400,
      position: toast.POSITION.TOP_RIGHT,
    }),
    successToast: (message, options = {}) =>
    
      toast.success(message, {
        autoClose: options.duration || 2400,
        position: toast.POSITION.TOP_RIGHT,
      }),
  warningToast: (message) =>
    toast.warn(message, {
      autoClose: 2400,
      position: toast.POSITION.TOP_RIGHT,
    }),
};

export default toastConfig;
