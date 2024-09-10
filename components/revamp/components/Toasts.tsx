import {
  Theme,
  ToastPosition,
  TypeOptions,
  toast,
  ToastContent,
} from 'react-toastify';

interface ToastsProps {
  message: ToastContent;
  type?: TypeOptions;
  position?: ToastPosition;
  autoCloseTime?: number;
  hideProgressBar?: boolean;
  closeOnClick?: boolean;
  pauseOnHover?: boolean;
  draggable?: boolean;
  progress?: number | undefined;
  theme?: Theme;
}

export const toastRender = ({
  type = 'default',
  message,
  position = 'bottom-center',
  autoCloseTime = 5000,
  hideProgressBar = false,
  closeOnClick = true,
  pauseOnHover = true,
  draggable = true,
  progress = undefined,
  theme = 'light',
}: ToastsProps) => {
  const contentOptions = {
    position,
    autoClose: autoCloseTime,
    hideProgressBar,
    closeOnClick,
    pauseOnHover,
    draggable,
    progress,
    theme,
  };

  switch (type) {
    case 'success':
      toast.success(message, contentOptions);
      break;

    case 'error':
      toast.error(message, contentOptions);
      break;

    case 'info':
      toast.info(message, contentOptions);
      break;

    case 'warning':
      toast.warning(message, contentOptions);
      break;

    default:
      toast(message, contentOptions);
      break;
  }
};
