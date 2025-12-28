import { Badge } from "@/components/ui/badge"
import { useNavigate } from "react-router-dom"
import { HowItWorksStep } from "./HowItWorksStep"
import { useAuthStore } from "@/store/useAuthStore"
import type { AuthState } from "@/models/Authstate"
import { useTranslation } from "react-i18next"

export const HowItWorksSection = () => {
	const navigate = useNavigate()
	const isAuth = useAuthStore((s: AuthState) => Boolean(s.token))
	const { t } = useTranslation()

	const steps = [
		{
			stepNumber: 1,
			title: t("landing.how_it_works.steps.install.title"),
			description: t("landing.how_it_works.steps.install.description"),
			codeExample: "npm install @fingertrace/sdk",
		},
		{
			stepNumber: 2,
			title: t("landing.how_it_works.steps.configure.title"),
			description: t("landing.how_it_works.steps.configure.description"),
			codeExample: "FingerTrace.init('{apiKey}')",
		},
		{
			stepNumber: 3,
			title: t("landing.how_it_works.steps.analyze.title"),
			description: t("landing.how_it_works.steps.analyze.description"),
			showButton: true,
		},
	]

	const handleViewDashboard = () => {
		isAuth ? navigate("/dashboard") : navigate("/login")
	}

	return (
		<section className="bg-muted/30 py-20">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center space-y-4 mb-16">
					<Badge variant="outline">{t("landing.how_it_works.badge")}</Badge>
					<h2 className="text-3xl md:text-4xl font-bold">
						{t("landing.how_it_works.title")}
					</h2>
				</div>

				<div className="grid md:grid-cols-3 gap-8">
					{steps.map((step) => (
						<HowItWorksStep
							key={step.stepNumber}
							stepNumber={step.stepNumber}
							title={step.title}
							description={step.description}
							codeExample={step.codeExample}
							showButton={step.showButton}
							onButtonClick={
								step.showButton ? handleViewDashboard : undefined
							}
						/>
					))}
				</div>
			</div>
		</section>
	)
}