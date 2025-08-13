import { useCallback } from 'react';
import { toast, ToastOptions, TypeOptions } from 'react-toastify';

const defaultOptions: ToastOptions = {
    position: 'top-right',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    theme: 'light',
};

type ShowToast = (message: string, type?: TypeOptions, options?: ToastOptions) => void;

export const useToast = () => {
    const showToast: ShowToast = useCallback((message, type = 'default', options = {}) => {
        toast(message, {
            ...defaultOptions,
            type,
            ...options,
        });
    }, []);

    const success = useCallback(
        (msg: string, opts?: ToastOptions) => showToast(msg, 'success', opts),
        [showToast],
    );
    const error = useCallback(
        (msg: string, opts?: ToastOptions) => showToast(msg, 'error', opts),
        [showToast],
    );
    const info = useCallback(
        (msg: string, opts?: ToastOptions) => showToast(msg, 'info', opts),
        [showToast],
    );
    const warning = useCallback(
        (msg: string, opts?: ToastOptions) => showToast(msg, 'warning', opts),
        [showToast],
    );

    return { showToast, success, error, info, warning };
};