import { Separator } from "@/components/ui/separator"
import { IconInnerShadowTop } from "@tabler/icons-react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"

export const FooterSection = () => {
	const navigate = useNavigate()
	const { t } = useTranslation()

	const footerSections = [
		{
			title: t("landing.footer.sections.product"),
			links: [
				{ name: t("landing.footer.links.features"), href: "/features" },
				{ name: t("landing.footer.links.documentation"), href: "/docs" }
			]
		},
		{
			title: t("landing.footer.sections.company"),
			links: [
				{ name: t("landing.footer.links.about"), href: "#about" },
				{ name: t("landing.footer.links.blog"), href: "/blog" },
				{ name: t("landing.footer.links.contact"), href: "/contact" }
			]
		},
		{
			title: t("landing.footer.sections.legal"),
			links: [
				{ name: t("landing.footer.links.privacy"), href: "/privacy" },
				{ name: t("landing.footer.links.terms"), href: "/terms" },
				{ name: t("landing.footer.links.security"), href: "/security" }
			]
		}
	]

	const handleLinkClick = (href: string) => {
		if (href.startsWith('#')) {
			// Handle anchor links for same page
			const element = document.querySelector(href)
			element?.scrollIntoView({ behavior: 'smooth' })
		} else {
			// Handle navigation to other pages
			navigate(href)
		}
	}

	return (
		<footer className="border-t bg-muted/30">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<div className="grid md:grid-cols-4 gap-8">
					{/* Brand Section */}
					<div className="space-y-4">
						<div className="flex items-center gap-2">
							<div className="h-6 w-6  flex items-center justify-center">
								<IconInnerShadowTop className="!size-7" />
							</div>
							<span className="font-bold">FingerTrace</span>
						</div>
						<p className="text-sm text-muted-foreground">
							{t("landing.footer.brand_desc")}
						</p>
					</div>

					{/* Footer Links */}
					{footerSections.map((section) => (
						<div key={section.title} className="space-y-4">
							<h4 className="font-semibold">{section.title}</h4>
							<div className="space-y-2 text-sm">
								{section.links.map((link) => (
									<div key={link.name}>
										<button
											onClick={() => handleLinkClick(link.href)}
											className="text-muted-foreground hover:text-foreground transition-colors text-left"
										>
											{link.name}
										</button>
									</div>
								))}
							</div>
						</div>
					))}
				</div>

				<Separator className="my-8" />

				<div className="flex flex-col md:flex-row justify-between items-center gap-4">
					<p className="text-sm text-muted-foreground">
						{t("landing.footer.rights")}
					</p>
					<div className="flex gap-4 text-sm text-muted-foreground">
						<a href="/status" className="hover:text-foreground transition-colors">
							{t("landing.footer.links.status")}
						</a>
					</div>
				</div>
			</div>
		</footer>
	)
}