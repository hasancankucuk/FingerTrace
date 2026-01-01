import { Badge } from "@/components/ui/badge"
import { useTranslation } from "react-i18next"

export const ContactHeading = () => {
    const { t } = useTranslation()

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center space-y-6 max-w-4xl mx-auto">
                <Badge variant="outline" className="px-4 py-2">
                    {t("contact.badge")}
                </Badge>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                    {t("contact.title_1")}<span className="text-primary">{t("contact.title_2")}</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                    {t("contact.description")}
                </p>
            </div>
        </section>
    )
}