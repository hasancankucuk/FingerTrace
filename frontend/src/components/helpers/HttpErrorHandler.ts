import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export const HttpErrorHandler = (err: any) => {
    const { t } = useTranslation();

    const status = err?.status;
    const body = typeof err?.body === 'object' ? JSON.stringify(err.body) : err?.body;

    const errorMessages: Record<number, string> = {
        400: t("http.400", { body }),
        401: t("http.401"),
        403: t("http.403"),
        404: t("http.404"),
        429: t("http.429"),
        500: t("http.500")
    };

    const message = errorMessages[status as number] || errorMessages[500];

    toast.error(message);
};