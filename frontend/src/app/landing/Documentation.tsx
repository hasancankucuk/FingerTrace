import { Zap, Code, Database, Shield, Terminal } from "lucide-react"
import { NavigationBar } from "@/components/landing/NavigationBar"
import { FooterSection } from "@/components/landing/FooterSection"
import { HeroSection } from "@/components/documentation/HeroSection"
import { QuickLink } from "@/components/documentation/QuickLink"
import { QuickStartSection } from "@/components/documentation/QuickStartSection"
import { SDKIntegrationSection } from "@/components/documentation/SDKIntegrationSection"
import { APIReferenceSection } from "@/components/documentation/APIReferenceSection"
import { SupportSection } from "@/components/documentation/SupportSection"

import { useTranslation } from "react-i18next"

export const Documentation = () => {
	const { t } = useTranslation()

	const quickLinks = [
		{
			title: t("landing.documentation.quick_links.items.quick_start.title"),
			description: t("landing.documentation.quick_links.items.quick_start.description"),
			href: "#quick-start",
			icon: <Zap className="h-5 w-5" />,
		},
		{
			title: t("landing.documentation.quick_links.items.sdk_integration.title"),
			description: t("landing.documentation.quick_links.items.sdk_integration.description"),
			href: "#sdk-integration",
			icon: <Code className="h-5 w-5" />,
		},
		{
			title: t("landing.documentation.quick_links.items.api_reference.title"),
			description: t("landing.documentation.quick_links.items.api_reference.description"),
			href: "#api-reference",
			icon: <Database className="h-5 w-5" />,
		},
		{
			title: t("landing.documentation.quick_links.items.workspaces.title"),
			description: t("landing.documentation.quick_links.items.workspaces.description"),
			href: "#workspaces",
			icon: <Shield className="h-5 w-5" />,
		},
		{
			title: t("landing.documentation.quick_links.items.examples.title"),
			description: t("landing.documentation.quick_links.items.examples.description"),
			href: "#examples",
			icon: <Terminal className="h-5 w-5" />,
		},
		{
			title: t("landing.documentation.quick_links.items.security.title"),
			description: t("landing.documentation.quick_links.items.security.description"),
			href: "#security",
			icon: <Shield className="h-5 w-5" />,
		},
	]

	const handleQuickStart = () => {
		const element = document.querySelector("#quick-start")
		element?.scrollIntoView({ behavior: "smooth" })
	}

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
						{t("landing.documentation.quick_links.title")}
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
				{/* <ExamplesSection /> */}
				<SupportSection onContactSupport={handleContactSupport} />
			</div>

			<FooterSection />
		</div>
	)
}