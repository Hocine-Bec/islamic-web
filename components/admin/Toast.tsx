"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle, X } from "lucide-react";

export type ToastType = "success" | "error";

export type ToastMessage = {
    id: number;
    type: ToastType;
    message: string;
};

type Props = {
    toasts: ToastMessage[];
    onRemove: (id: number) => void;
};

export default function Toast({ toasts, onRemove }: Props) {
    return (
        <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-2" dir="rtl">
            {toasts.map((toast) => (
                <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
            ))}
        </div>
    );
}

function ToastItem({
    toast,
    onRemove,
}: {
    toast: ToastMessage;
    onRemove: (id: number) => void;
}) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Animate in
        const showTimer = setTimeout(() => setVisible(true), 10);
        // Auto dismiss after 3s
        const hideTimer = setTimeout(() => {
            setVisible(false);
            setTimeout(() => onRemove(toast.id), 300);
        }, 3000);

        return () => {
            clearTimeout(showTimer);
            clearTimeout(hideTimer);
        };
    }, [toast.id, onRemove]);

    return (
        <div
            className={`flex items-center gap-3 bg-white border rounded-xl px-4 py-3 shadow-lg transition-all duration-300 min-w-[260px] max-w-[340px] ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                } ${toast.type === "success"
                    ? "border-green-100"
                    : "border-red-100"
                }`}
        >
            {toast.type === "success" ? (
                <CheckCircle size={16} className="text-green-600 flex-shrink-0" />
            ) : (
                <XCircle size={16} className="text-red-500 flex-shrink-0" />
            )}
            <p className="text-sm text-gray-700 flex-1">{toast.message}</p>
            <button
                onClick={() => {
                    setVisible(false);
                    setTimeout(() => onRemove(toast.id), 300);
                }}
                className="text-gray-300 hover:text-gray-500 transition flex-shrink-0"
            >
                <X size={13} />
            </button>
        </div>
    );
}