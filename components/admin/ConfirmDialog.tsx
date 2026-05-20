"use client";

import { AlertTriangle } from "lucide-react";

type Props = {
    open: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: "danger" | "warning";
    onConfirm: () => void;
    onCancel: () => void;
};

export default function ConfirmDialog({
    open,
    title,
    message,
    confirmLabel = "تأكيد",
    cancelLabel = "إلغاء",
    variant = "danger",
    onConfirm,
    onCancel,
}: Props) {
    if (!open) return null;

    return (
        <div
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4"
            onClick={onCancel}
        >
            <div
                className="bg-white rounded-2xl w-full max-w-sm shadow-xl p-6"
                dir="rtl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Icon */}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${variant === "danger" ? "bg-red-50" : "bg-amber-50"
                    }`}>
                    <AlertTriangle
                        size={22}
                        className={variant === "danger" ? "text-red-500" : "text-amber-500"}
                    />
                </div>

                {/* Text */}
                <h2 className="text-base font-semibold text-gray-800 text-center mb-2">
                    {title}
                </h2>
                <p className="text-sm text-gray-500 text-center leading-relaxed mb-6">
                    {message}
                </p>

                {/* Buttons */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm py-2.5 rounded-xl transition font-medium"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`flex-1 text-white text-sm py-2.5 rounded-xl transition font-medium ${variant === "danger"
                                ? "bg-red-500 hover:bg-red-600"
                                : "bg-amber-500 hover:bg-amber-600"
                            }`}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}