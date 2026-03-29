import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { Settings, LogOut, User, Menu } from "lucide-react"
import { Button } from "../ui/button"
import ThemeToggle from "../../utils/ThemeToggel"

const pageTitles = {
  tester: { title: "API Tester", subtitle: "Test your APIs with ease" },
  collections: {
    title: "Collections",
    subtitle: "Organize and manage your API requests",
  },
  history: {
    title: "History",
    subtitle: "View your recent API requests",
  },
  request: {
    title: "Request",
    subtitle: "Edit and test your API request",
  },
}

export function Header({ activeItem = "tester", requestName, onMenuClick }) {
  const pageInfo = pageTitles[activeItem] || pageTitles.tester
  const title =
    activeItem === "request" && requestName
      ? requestName
      : pageInfo.title
  const subtitle = pageInfo.subtitle

  return (
    <header className="h-14 sm:h-16 bg-card border-b border-border flex items-center justify-between px-3 sm:px-6">
      <div className="flex items-center gap-3">
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden shrink-0"
          onClick={onMenuClick}
        >
          <Menu className="w-5 h-5" />
        </Button>

        <div className="min-w-0">
          <h1 className="text-base sm:text-lg font-semibold text-foreground truncate">
            {title}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground truncate hidden sm:block">
            {subtitle}
          </p>
        </div>
      </div>

      <DropdownMenu>
        <ThemeToggle/>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 sm:gap-3 hover:bg-accent rounded-lg p-1.5 sm:p-2 transition-colors shrink-0">
            <div className="text-right hidden md:block">
              <p className="text-sm font-medium text-foreground">
                John Doe
              </p>
              <p className="text-xs text-muted-foreground">
                john@example.com
              </p>
            </div>

            <Avatar className="h-8 w-8 sm:h-9 sm:w-9">
              <AvatarImage
                src="https://github.com/shadcn.png"
                alt="User"
              />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem>
            <User className="w-4 h-4 mr-2" />
            Profile
          </DropdownMenuItem>

          <DropdownMenuItem>
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem className="text-destructive">
            <LogOut className="w-4 h-4 mr-2" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}