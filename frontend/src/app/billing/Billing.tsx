import { useTranslation } from "react-i18next";
import { AccountStatus } from "./AccountStatus";
import { Plans } from "./Plans";
import { Platforms } from "./Platforms";

export const Billing = () => {
    const { t } = useTranslation();

    return (
        <div className="p-6 space-y-6 max-w-6xl mx-auto">
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold tracking-tight">
                    {t("nav.billing")}
                </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Platforms />
                <AccountStatus />
            </div>

            <Plans />
        </div>
    );
};
