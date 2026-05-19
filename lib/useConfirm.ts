import { useState, useCallback } from "react";

type ConfirmOptions = {
    title: string;
    message: string;
    confirmLabel?: string;
    variant?: "danger" | "warning";
};

export function useConfirm() {
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState<ConfirmOptions>({
        title: "",
        message: "",
    });
    const [resolve, setResolve] = useState<(val: boolean) => void>(() => { });

    const confirm = useCallback((opts: ConfirmOptions): Promise<boolean> => {
        setOptions(opts);
        setOpen(true);
        return new Promise((res) => {
            setResolve(() => res);
        });
    }, []);

    function handleConfirm() {
        setOpen(false);
        resolve(true);
    }

    function handleCancel() {
        setOpen(false);
        resolve(false);
    }

    return {
        open,
        options,
        confirm,
        handleConfirm,
        handleCancel,
    };
}