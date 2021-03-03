import { Toast } from 'toaster-js';

export const showInfoToast = text =>
  new Toast(text, Toast.TYPE_INFO, Toast.TIME_SHORT);

export const showWarningToast = text =>
  new Toast(text, Toast.TYPE_WARNING, Toast.TIME_SHORT);
