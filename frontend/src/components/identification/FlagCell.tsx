import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Flag, ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";

interface FlagCellProps {
    flag?: string;
}

export const FlagCell = ({ flag }: FlagCellProps) => {
    const { t } = useTranslation();

    if (!flag || flag === "Clean") {
        return (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <ShieldCheck className="h-4 w-4 text-green-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{t("common.clean") || "Clean"}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );
    }

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Flag className="h-4 w-4 text-red-500 fill-red-500" />
                </TooltipTrigger>
                <TooltipContent>
                    <p>{flag}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};
