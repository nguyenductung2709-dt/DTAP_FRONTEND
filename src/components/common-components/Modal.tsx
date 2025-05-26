import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({isOpen, onClose, children}) => {
    if (!isOpen) return null;

    return (
        //opacity doesn't show transparency
        <div className="fixed inset-0 bg-black bg-opacity-100 flex justify-center items-center z-50">
            <div className="bg-white text-black p-6 rounded-lg shadow-lg max-w-sm w-full relative">
                <button className="absolute top-2 right-3 text-lg font-bold text-gray-700"
                onClick={onClose}>
                    x
                </button>
                {children}
            </div>
        </div>
    );
};

export default Modal;
