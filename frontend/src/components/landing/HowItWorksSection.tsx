import { Badge } from "@/components/ui/badge"
import { useNavigate } from "react-router-dom"
import { HowItWorksStep } from "./HowItWorksStep"
import { useAuthStore } from "@/store/useAuthStore"
import type { AuthState } from "@/models/Authstate"

const steps = [
	{
		stepNumber: 1,
		title: "Install SDK",
		description:
			"Add our lightweight SDK to your application with a single line of code.",
		codeExample: "npm install @fingertrace/sdk",
	},
	{
		stepNumber: 2,
		title: "Configure Tracking",
		description:
			"Set up event tracking and define the metrics that matter to your business.",
		codeExample: "FingerTrace.init('{apiKey}')",
	},
	{
		stepNumber: 3,
		title: "Analyze & Optimize",
		description:
			"View real-time analytics and insights to improve your product experience.",
		showButton: true,
	},
]

export const HowItWorksSection = () => {
	const navigate = useNavigate()
	const isAuth = useAuthStore((s: AuthState) => Boolean(s.token))

	const handleViewDashboard = () => {
		isAuth ? navigate("/dashboard") : navigate("/login")
	}

	return (
		<section className="bg-muted/30 py-20">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center space-y-4 mb-16">
					<Badge variant="outline">How it Works</Badge>
					<h2 className="text-3xl md:text-4xl font-bold">
						Get started in minutes
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