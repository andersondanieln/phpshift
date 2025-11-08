import React from 'react';
import Toast from './Toast';

const ToastContainer = ({ toast }) => {
    if (!toast) return null;
    return <Toast toast={toast} />;
};

export default ToastContainer;