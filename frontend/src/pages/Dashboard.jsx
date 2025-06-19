import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  Ticket,
  MapPin,
  User,
  Clock,
  Star,
  TrendingUp,
  Users,
  Gift,
} from "lucide-react";
import { useUser } from "@/contexts/UserProvider";
import { usePlanner } from "@/hooks/usePlanner";
import { useAxios } from "@/contexts/AxiosProvider";

export default function Dashboard() {
  const [userTickets, setUserTickets] = useState([]);
  const [userPlanners, setUserPlanners] = useState([]);
  const [favoriteAttractions, setFavoriteAttractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const {
    plan,
    addToPlanner,
    fetchPlanner,
    removeFromPlanner,
    getPlannerByDate,
  } = usePlanner();
  const axios = useAxios();

  useEffect(() => {
    fetchUserData();
    fetchPlanner();
  }, []);

  const fetchUserData = async () => {
    try {
      const res = await axios.get("/tickets/my");
      const tickets = res.data;

      const mappedTickets = tickets.map((t) => ({
        id: t.id,
        type: t.type.name,
        date: t.validDate.split("T")[0],
        status: t.status || "active",
        qr_code: t.qrCode,
      }));

      setUserTickets(mappedTickets);

      const fetchAttractionsAndShows = async () => {
  try {
    const [attractionsRes, showsRes] = await Promise.all([
      axios.get("/attractions"),
      axios.get("/shows"),
    ]);

    const attractions = attractionsRes.data;
    const shows = showsRes.data;

    const attractionFavIds = JSON.parse(localStorage.getItem("favorites")) || [];
    const showFavKeys = JSON.parse(localStorage.getItem("favoriteShows")) || [];

    // Mappa attrazioni preferite
    const mappedAttractions = attractions
      .filter((a) => attractionFavIds.includes(a.id))
      .map((a) => ({
        id: a.id,
        name: a.name,
        wait_time: a.waitTime || 0,
        type: "attraction",
      }));

    // Mappa spettacoli preferiti
    const mappedShows = shows
      .filter((s) => showFavKeys.includes(`${s.id}-${s.date}`))
      .map((s) => ({
        id: s.id,
        name: s.name,
        wait_time: 0, // oppure durata o altro se preferisci
        type: "show",
      }));

    // Unisci entrambi
    setFavoriteAttractions([...mappedAttractions, ...mappedShows]);
  } catch (error) {
    console.error("Errore nel caricamento attrazioni/spettacoli preferiti:", error);
  }
};


      fetchAttractionsAndShows();
      setLoading(false);
    } catch (error) {
      console.error("Errore nel caricamento biglietti:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-lime-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-50 to-green-50 py-8">
      <div className="container mx-auto px-4">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-lime-600 to-green-600 bg-clip-text text-transparent mb-2">
            Ciao {user?.firstName}, Benvenuto nel tuo Parco Giochi HI.!
          </h1>
          <p className="text-gray-600 text-lg">
            Gestisci i tuoi biglietti, pianifica la tua visita e scopri le
            novità del parco
          </p>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatsCard
            icon={<Ticket className="h-6 w-6" />}
            title="Biglietti Attivi"
            value={userTickets.length}
            color="from-blue-500 to-cyan-500"
          />
          <StatsCard
            icon={<Calendar className="h-6 w-6" />}
            title="Pianificatori"
            value={plan.length}
            color="from-green-500 to-lime-500"
          />
          <StatsCard
            icon={<Star className="h-6 w-6" />}
            title="Preferiti"
            value={favoriteAttractions.length}
            color="from-yellow-500 to-orange-500"
          />
          <StatsCard
            icon={<User className="h-6 w-6" />}
            title="Profilo"
            value="Completa"
            color="from-purple-500 to-pink-500"
            to="/profile"
          />
          
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Active Tickets */}
            <DashboardCard
              title="I Tuoi Biglietti"
              icon={<Ticket className="h-5 w-5" />}
            >
              {userTickets.length > 0 ? (
                <div className="space-y-3">
                  {userTickets.map((ticket) => (
                    <TicketCard key={ticket.id} ticket={ticket} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  message="Non hai biglietti attivi"
                  action={
                    <Link
                      to="/tickets"
                      className="bg-lime-500 text-white px-4 py-2 rounded-lg hover:bg-lime-600 transition-colors"
                    >
                      Acquista Biglietti
                    </Link>
                  }
                />
              )}
            </DashboardCard>

            {/* Planners */}
            <DashboardCard
              title="I Tuoi Pianificatori"
              icon={<Calendar className="h-5 w-5" />}
            >
              {plan.length > 0 ? (
                <div className="space-y-3">
                  {plan.map((p) => (
                    <Link
                      to={`/planner/${p.date.split("T")[0]}`}
                      key={p.id}
                      className="block border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold text-gray-800">
                            {new Date(p.date).toLocaleDateString("it-IT")}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {p.items.length} attività
                          </p>
                        </div>
                        <button className="text-sm text-lime-600 hover:underline">
                          Visualizza
                        </button>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p>Nessun planner creato</p>
              )}
            </DashboardCard>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <DashboardCard
              title="Azioni Rapide"
              icon={<TrendingUp className="h-5 w-5" />}
            >
              <div className="grid grid-cols-2 gap-3">
                <QuickActionButton
                  to="/map"
                  icon={<MapPin className="h-5 w-5" />}
                  label="Mappa"
                  color="bg-blue-500"
                />
                <QuickActionButton
                  to="/attractions"
                  icon={<Star className="h-5 w-5" />}
                  label="Attrazioni"
                  color="bg-green-500"
                />
                <QuickActionButton
                  to="/shows"
                  icon={<Users className="h-5 w-5" />}
                  label="Spettacoli"
                  color="bg-purple-500"
                />
                <QuickActionButton
                  to="/tickets"
                  icon={<Ticket className="h-5 w-5" />}
                  label="Biglietti"
                  color="bg-orange-500"
                />
              </div>
            </DashboardCard>
          </div>
        </div>
      </div>
    </div>
  );
}

// Components



function StatsCard({ icon, title, value, color, to }) {
  const cardContent = (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`bg-white rounded-xl p-4 shadow-lg ${to ? "cursor-pointer" : ""}`}
    >
      <div
        className={`inline-flex p-2 rounded-lg bg-gradient-to-r ${color} text-white mb-2`}
      >
        {icon}
      </div>
      <div className="text-2xl font-bold text-gray-800">{value}</div>
      <div className="text-sm text-gray-600">{title}</div>
    </motion.div>
  );

  return to ? <Link to={to}>{cardContent}</Link> : cardContent;
}


function DashboardCard({ title, icon, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-6 shadow-lg"
    >
      <div className="flex items-center mb-4">
        <div className="p-2 bg-lime-100 rounded-lg text-lime-600 mr-3">
          {icon}
        </div>
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
      </div>
      {children}
    </motion.div>
  );
}

function TicketCard({ ticket }) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-gray-800">{ticket.type}</h3>
          <p className="text-gray-600">Data visita: {ticket.date}</p>
          <p className="text-sm text-gray-500">QR: {ticket.qr_code}</p>
        </div>
        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
          Attivo
        </span>
      </div>
    </div>
  );
}


function QuickActionButton({ to, icon, label, color }) {
  return (
    <Link to={to}>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`${color} text-white p-3 rounded-lg text-center hover:shadow-lg transition-all`}
      >
        <div className="flex justify-center mb-1">{icon}</div>
        <div className="text-xs font-medium">{label}</div>
      </motion.div>
    </Link>
  );
}



function EmptyState({ message, action }) {
  return (
    <div className="text-center py-8">
      <p className="text-gray-500 mb-4">{message}</p>
      {action}
    </div>
  );
}
