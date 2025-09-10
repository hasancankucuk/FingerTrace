import { Zap, Code, Database, Shield, Terminal } from "lucide-react"
import { NavigationBar } from "@/components/landing/NavigationBar"
import { FooterSection } from "@/components/landing/FooterSection"
import { HeroSection } from "@/components/documentation/HeroSection"
import { QuickLink } from "@/components/documentation/QuickLink"
import { QuickStartSection } from "@/components/documentation/QuickStartSection"
import { SDKIntegrationSection } from "@/components/documentation/SDKIntegrationSection"
import { APIReferenceSection } from "@/components/documentation/APIReferenceSection"
import { ExamplesSection } from "@/components/documentation/ExamplesSection"
import { SupportSection } from "@/components/documentation/SupportSection"

const quickLinks = [
	{
		title: "Quick Start",
		description: "Get up and running in 5 minutes",
		href: "#quick-start",
		icon: <Zap className="h-5 w-5" />,
	},
	{
		title: "SDK Integration",
		description: "Integrate with your application",
		href: "#sdk-integration",
		icon: <Code className="h-5 w-5" />,
	},
	{
		title: "API Reference",
		description: "Complete API documentation",
		href: "#api-reference",
		icon: <Database className="h-5 w-5" />,
	},
	{
		title: "Workspaces",
		description: "Organize your projects",
		href: "#workspaces",
		icon: <Shield className="h-5 w-5" />,
	},
	{
		title: "Examples",
		description: "Real-world code examples",
		href: "#examples",
		icon: <Terminal className="h-5 w-5" />,
	},
	{
		title: "Security",
		description: "Privacy and compliance",
		href: "#security",
		icon: <Shield className="h-5 w-5" />,
	},
]

export const Documentation = () => {
	const handleQuickStart = () => {
		const element = document.querySelector("#quick-start")
		element?.scrollIntoView({ behavior: "smooth" })
	}

	// const handleViewGitHub = () => {
	// 	window.open("https://github.com/hasancankucuk/fingertrace", "_blank")
	// }

	const handleContactSupport = () => {
		window.open("mailto:support@fingertrace.app", "_blank")
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
			<NavigationBar />

			<HeroSection
				onQuickStart={handleQuickStart}
			/>

			<div className="container mx-auto px-4 py-12 max-w-6xl">
				{/* Quick Links */}
				<section className="mb-16">
					<h2 className="text-2xl font-bold mb-8 text-center">
						Jump to what you need
					</h2>
					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
						{quickLinks.map((link, index) => (
							<QuickLink
								key={index}
								title={link.title}
								description={link.description}
								href={link.href}
								icon={link.icon}
							/>
						))}
					</div>
				</section>

				<QuickStartSection />
				<SDKIntegrationSection />
				<APIReferenceSection />
				<ExamplesSection />
				<SupportSection onContactSupport={handleContactSupport} />
			</div>

			<FooterSection />
		</div>
	)
}