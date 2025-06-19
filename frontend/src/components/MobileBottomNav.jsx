import { Home, Map, Theater, FerrisWheelIcon as Ferris, Phone , Ticket, User} from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { useUser } from "@/contexts/UserProvider"



const menuItems = [
  { id: "home", label: "Home", icon: Home },
  { id: "attractions", label: "Attrazioni", icon: Ferris },
  { id: "map", label: "Mappa", icon: Map },
  { id: "shows", label: "Eventi", icon: Theater },
  { id: "tickets", label: "Biglietti", icon: Ticket },
  { id: "contact", label: "Contatti", icon: Phone },
  { id: "dashboard", label: "Dashboard", icon: User },
]

export default function MobileBottomNav() {
  const location = useLocation()
  const { isAuthenticated } = useUser()

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-md md:hidden">
      <nav className="flex justify-between items-center px-4 py-2">
        {menuItems
          .filter(item => {
            if (item.id === "dashboard" && !isAuthenticated) return false
            return true
          })
          .map((item) => {
            const isActive =
              location.pathname === `/${item.id}` ||
              (item.id === "home" && location.pathname === "/")
            const Icon = item.icon

            return (
              <Link
                key={item.id}
                to={`/${item.id === "home" ? "" : item.id}`}
                className={`flex flex-col items-center flex-1 text-xs transition-all ${
                  isActive
                    ? "text-orange-500 font-semibold"
                    : "text-gray-500 hover:text-orange-400"
                }`}
              >
                <Icon className="h-5 w-5 mb-1" />
                <span className="text-[10px] leading-none">
                  {item.label.split(" ")[0]}
                </span>
              </Link>
            )
          })}
      </nav>
    </div>
  )
}

