import { Separator } from "@/components/ui/separator"
import { useNavigate } from "react-router-dom"

const footerSections = [
	{
		title: "Product",
		links: [
			{ name: "Features", href: "/features" },
			{ name: "Documentation", href: "/docs" }
		]
	},
	{
		title: "Company", 
		links: [
			{ name: "About", href: "#about" },
			{ name: "Blog", href: "#blog" },
			{ name: "Contact", href: "/contact" }
		]
	},
	{
		title: "Legal",
		links: [
			{ name: "Privacy", href: "/privacy" },
			{ name: "Terms", href: "/terms" },
			{ name: "Security", href: "/security" }
		]
	}
]

export const FooterSection = () => {
	const navigate = useNavigate()

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
							<div className="h-6 w-6 rounded bg-primary flex items-center justify-center">
								<span className="text-primary-foreground font-bold text-xs">FT</span>
							</div>
							<span className="font-bold">FingerTrace</span>
						</div>
						<p className="text-sm text-muted-foreground">
							Advanced user analytics and interaction tracking for modern applications.
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
						© 2025 FingerTrace. All rights reserved.
					</p>
					<div className="flex gap-4 text-sm text-muted-foreground">
						<a href="#" className="hover:text-foreground transition-colors">
							Status
						</a>
						<a
							href="https://github.com/hasancankucuk/fingertrace"
							target="_blank"
							rel="noopener noreferrer"
							className="hover:text-foreground transition-colors"
						>
							GitHub
						</a>
					</div>
				</div>
			</div>
		</footer>
	)
}