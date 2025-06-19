// Shows.jsx con preferiti per data e paginazione Shadcn (corretto)
import { motion } from "framer-motion";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useState, useEffect } from "react";
import { usePlanner } from "@/hooks/usePlanner";
import {
  Clock,
  MapPin,
  Users,
  Calendar,
  Star,
  Search,
  Check,
  X,
} from "lucide-react";
import { useAxios } from "@/contexts/AxiosProvider";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserProvider";

export default function Shows() {
  const [shows, setShows] = useState([]);
  const [displayedShows, setDisplayedShows] = useState([]);
  const [groupedShows, setGroupedShows] = useState({});
  const [selectedDate, setSelectedDate] = useState("all");
  const [favorites, setFavorites] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [planner, setPlanner] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredAllShows, setFilteredAllShows] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("all");
  const { addToPlanner } = usePlanner();
  const navigate = useNavigate();
  const { user } = useUser();
  const [message, setMessage] = useState({ type: "", text: "" });

  const itemsPerPage = 6;

  const myaxios = useAxios();

  useEffect(() => {
    fetchShows();
    loadFavorites();
  }, [selectedDate]);

  useEffect(() => {
    filterShows();
  }, [
    shows,
    searchTerm,
    showFavoritesOnly,
    favorites,
    currentPage,
    selectedTimeSlot,
  ]);

  const fetchShows = async () => {
    try {
      const url =
        selectedDate === "all" ? "/shows" : `/shows?date=${selectedDate}`;
      const res = await myaxios.get(url);
      setShows(res.data);
    } catch (error) {
      console.error("Errore nel caricamento spettacoli:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleAddShowToPlanner = async (show) => {
    try {
      const payload = {
        date: show.date,
        showScheduleId: show.scheduleId,
      };
      await addToPlanner(payload); // usa quella del context
      setMessage({ type: "success", text: "Spettacolo aggiunto al planner!" });
    } catch (err) {
      console.error("Errore durante l'aggiunta:", err);
      setMessage({
        type: "error",
        text: "Errore durante l'aggiunta al planner",
      });
    }
  };

  const loadFavorites = () => {
    const saved = localStorage.getItem("favoriteShows");
    if (saved) setFavorites(JSON.parse(saved));
  };

  const toggleFavorite = (show) => {
    const key = `${show.id}-${show.date}`;
    const updated = favorites.includes(key)
      ? favorites.filter((f) => f !== key)
      : [...favorites, key];

    setFavorites(updated);
    localStorage.setItem("favoriteShows", JSON.stringify(updated));
  };

  const isFavorite = (show) => favorites.includes(`${show.id}-${show.date}`);

  const getTimeSlot = (timeStr) => {
    const [hour] = timeStr.split(":");
    const h = parseInt(hour);
    if (h < 12) return "Mattina";
    if (h < 18) return "Pomeriggio";
    return "Sera";
  };

  const filterShows = () => {
    let filtered = shows;
    if (showFavoritesOnly) {
      filtered = filtered.filter((s) =>
        favorites.includes(`${s.id}-${s.date}`)
      );
    }
    if (selectedTimeSlot !== "all") {
      filtered = filtered.filter(
        (s) => getTimeSlot(s.time) === selectedTimeSlot
      );
    }

    if (searchTerm) {
      filtered = filtered.filter((s) =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredAllShows(filtered);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginated = filtered.slice(startIndex, startIndex + itemsPerPage);
    setDisplayedShows(paginated);

    const grouped = paginated.reduce((acc, show) => {
      const slot = getTimeSlot(show.time);
      if (!acc[slot]) acc[slot] = [];
      acc[slot].push(show);
      return acc;
    }, {});
    setGroupedShows(grouped);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-lime-500"></div>
      </div>
    );
  }

  const today = new Date().toISOString().split("T")[0];
  const totalPages = Math.ceil(filteredAllShows.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-50 to-green-50 py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-lime-600 to-green-600 bg-clip-text text-transparent mb-2">
            Spettacoli ed Eventi
          </h1>
          <p className="text-gray-600 text-lg">
            Scopri tutte le emozioni che ti aspettano
          </p>

   {message.text && (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    className={`fixed inset-0 flex items-center justify-center z-50 pointer-events-none`}
  >
    <div
      className={`px-6 py-4 rounded-lg shadow-lg text-sm max-w-sm w-full mx-auto pointer-events-auto
        ${
          message.type === "success"
            ? "bg-green-100 text-green-800 border border-green-200"
            : "bg-red-50 text-red-800 border border-red-200"
        }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {message.type === "success" ? (
            <Check className="h-4 w-4" />
          ) : (
            <X className="h-4 w-4" />
          )}
          {message.text}
        </div>
        <button
          onClick={() => setMessage({ type: "", text: "" })}
          className="text-current hover:opacity-70"
        >
          <X className="h-3 w-3" />
        </button>
      </div>
    </div>
  </motion.div>
)}


          {selectedDate !== "all" && (
            <p className="text-sm text-gray-500">
              Mostrando spettacoli per il {selectedDate}
            </p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-lg mb-8 space-y-4"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => {
                  setSelectedDate("all");
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedDate === "all"
                    ? "bg-gray-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Tutti
              </button>
              <button
                onClick={() => {
                  setSelectedDate(today);
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedDate === today
                    ? "bg-red-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Oggi
              </button>
              <div className="relative">
                <input
                  type="date"
                  value={
                    selectedDate !== "all" && selectedDate !== today
                      ? selectedDate
                      : ""
                  }
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="peer opacity-0 absolute left-0 top-0 w-full h-full cursor-pointer"
                />
                <div className="px-4 py-2 rounded-full border border-gray-200 text-sm text-gray-700 bg-white cursor-pointer select-none peer-hover:bg-gray-50">
                  {selectedDate !== "all" && selectedDate !== today
                    ? selectedDate
                    : "Seleziona data"}
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedTimeSlot("all");
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedTimeSlot === "all"
                    ? "bg-yellow-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Tutte le fasce
              </button>
              <button
                onClick={() => {
                  setSelectedTimeSlot("Mattina");
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedTimeSlot === "Mattina"
                    ? "bg-lime-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Mattina
              </button>
              <button
                onClick={() => {
                  setSelectedTimeSlot("Pomeriggio");
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedTimeSlot === "Pomeriggio"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Pomeriggio
              </button>
              <button
                onClick={() => {
                  setSelectedTimeSlot("Sera");
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedTimeSlot === "Sera"
                    ? "bg-indigo-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Sera
              </button>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-2 w-full md:w-auto">
              <div className="relative w-full md:w-1/2">
                <Search className="absolute left-3 top-1/2 transform  -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Cerca spettacoli..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-full"
                />
              </div>
              <button
                onClick={() => {
                  setShowFavoritesOnly(!showFavoritesOnly);
                  setCurrentPage(1);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  showFavoritesOnly
                    ? "bg-yellow-500 text-white"
                    : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-100"
                }`}
              >
                <Star
                  className={
                    showFavoritesOnly ? "fill-white" : "text-yellow-500"
                  }
                  size={16}
                />
                {showFavoritesOnly ? "Solo preferiti" : "Mostra preferiti"}
              </button>
            </div>
          </div>
        </motion.div>

        {Object.entries(groupedShows).map(([slot, showsInSlot]) => (
          <div key={slot} className="mb-10">
            <h2 className="text-2xl font-semibold text-lime-700 mb-4">
              {slot}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {showsInSlot.map((show, index) => (
                <motion.div
                  key={`${show.id}-${show.date}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative h-48 bg-gradient-to-br from-lime-400 to-green-500">
                    <img
                      src={show.image}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = `/placeholder.svg?height=200&width=300&text=${encodeURIComponent(
                          show.name
                        )}`;
                      }}
                    />
                    <button
                      onClick={() => toggleFavorite(show)}
                      className="absolute top-3 right-3 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
                    >
                      <Star
                        className={`h-5 w-5 ${
                          isFavorite(show)
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-gray-400"
                        }`}
                      />
                    </button>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {show.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {show.description}
                    </p>
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{show.location}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="h-4 w-4 mr-2" />
                        <span>Età consigliata: {show.ageRecommendation}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>Data: {show.date}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>
                          Ore: {show.time} – durata {show.duration} min
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {!user ? (
                        <button
                          onClick={() => navigate("/login")}
                          className="w-full bg-gray-300 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors text-sm font-medium"
                        >
                          Accedi per usare il Planner
                        </button>
                      ) : (
                        <button
                          onClick={() => handleAddShowToPlanner(show)}
                          className="w-full bg-lime-500 text-white px-4 py-2 rounded-lg hover:bg-lime-600 transition-colors text-sm font-medium"
                        >
                          Aggiungi al Planner
                        </button>
                      )}

                      <button
                        onClick={() =>
                          navigate("/map", {
                            state: { attractionName: show.location },
                          })
                        }
                        className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <MapPin className="h-4 w-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}

        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  />
                </PaginationItem>

                <PaginationItem>
                  <PaginationLink
                    href="#"
                    isActive={currentPage === 1}
                    onClick={() => setCurrentPage(1)}
                  >
                    1
                  </PaginationLink>
                </PaginationItem>

                {currentPage > 3 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}

                {[...Array(totalPages)]
                  .map((_, i) => i + 1)
                  .filter(
                    (n) =>
                      n !== 1 &&
                      n !== totalPages &&
                      Math.abs(currentPage - n) <= 1
                  )
                  .map((n) => (
                    <PaginationItem key={n}>
                      <PaginationLink
                        href="#"
                        isActive={currentPage === n}
                        onClick={() => setCurrentPage(n)}
                      >
                        {n}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                {currentPage < totalPages - 2 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}

                {totalPages > 1 && (
                  <PaginationItem>
                    <PaginationLink
                      href="#"
                      isActive={currentPage === totalPages}
                      onClick={() => setCurrentPage(totalPages)}
                    >
                      {totalPages}
                    </PaginationLink>
                  </PaginationItem>
                )}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}

        {filteredAllShows.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-gray-400 mb-4">
              <DotLottieReact
                src="https://lottie.host/fc57117d-e67f-4064-81a2-c86fcd9c28e2/rdkoDpArXa.lottie"
                loop
                autoplay
                className="w-56 h-32 mx-auto"
              />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Nessuno spettacolo trovato
            </h3>
            <p className="text-gray-500">
              Prova a modificare i filtri di ricerca
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
