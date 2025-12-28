import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"

interface DropdownHelperProps {
    children: React.ReactNode
    dropdownItems: string[]
    onSelect?: (item: any) => void
    label?: string
}

export const DropdownHelper = ({ children, dropdownItems, onSelect, label }: DropdownHelperProps) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild className="outline-none focus:ring-0 focus:ring-offset-0 focus:outline-none focus-visible:ring-0 focus-visible:outline-none">
                <div className="cursor-pointer">{children}</div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {label && <div className="px-2 py-1.5 text-sm font-semibold">{label}</div>}
                <DropdownMenuSeparator />
                {dropdownItems.map((item, index) => (
                    <DropdownMenuItem 
                        key={index} 
                        onClick={() => onSelect?.(item)}
                        className="capitalize"
                    >
                        {item}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}