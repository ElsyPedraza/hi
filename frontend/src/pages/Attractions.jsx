import { motion } from "framer-motion";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useState, useEffect } from "react";
import { Clock, Users, Star, Filter, Search, MapPin,  Check, X  } from "lucide-react";
import { useAxios } from "@/contexts/AxiosProvider";
import { usePlanner } from "@/hooks/usePlanner";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserProvider";
import { set } from "react-hook-form";

export default function Attractions() {
  const [attractions, setAttractions] = useState([]);
  const [filteredAttractions, setFilteredAttractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [favorites, setFavorites] = useState([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const { addToPlanner } = usePlanner();
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];
  const { user } = useUser();
  const [message, setMessage] = useState({ type: "", text: "" });


  const myaxios = useAxios();

  const categories = [
    { id: "all", name: "Tutte", color: "bg-gray-500" },
    { id: "giostra", name: "Giostre", color: "bg-red-500" },
    { id: "bambini", name: "Bambini", color: "bg-yellow-500" },
    { id: "tour", name: "Tour", color: "bg-blue-500" },
    { id: "spettacolo", name: "Spettacoli", color: "bg-indigo-500" },
  ];

  useEffect(() => {
    fetchAttractions();
    loadFavorites();
  }, []);

  useEffect(() => {
    console.log("useEffect triggered con categoria:", selectedCategory);
    filterAttractions(attractions);
  }, [attractions, searchTerm, selectedCategory, favorites, showFavoritesOnly]);

  const fetchAttractions = async () => {
    try {
      const res = await myaxios.get("/attractions");
      const mapped = res.data.map((attr) => ({
        ...attr,
        category: attr.category,
        waitTime: attr.waitTime || 0,
        image: attr.image,
        minHeight: 0,
        maxHeight: null,
        status: "open",
      }));
      console.log("ATTRAZIONI CARICATE:", mapped);
      setAttractions(mapped);
    } catch (error) {
      console.error("Errore nel caricamento attrazioni:", error);
    } finally {
      setLoading(false);
    }
  };

  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date().toISOString().split("T")[0];
    return today;
  });

  const handleAddToPlanner = async (attractionId) => {
    if (!user) {
      setMessage({ type: "error", text: "Devi essere loggato per aggiungere al planner." });
      return;
    }
    try {
      const today = new Date().toISOString().split("T")[0];
      await addToPlanner({ date: selectedDate, attractionId });
     setMessage({ type: "success", text: "Attrazione aggiunta al planner!" });
    } catch (err) {
      console.error("Errore planner:", err);
       setMessage({ type: "error", text: "Errore durante l'aggiunta al planner." });
    }
  };

  const loadFavorites = () => {
    const savedFavorites = localStorage.getItem("favorites");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  };

  const toggleFavorite = (attractionId) => {
    const newFavorites = favorites.includes(attractionId)
      ? favorites.filter((id) => id !== attractionId)
      : [...favorites, attractionId];

    setFavorites(newFavorites);
    localStorage.setItem("favorites", JSON.stringify(newFavorites));
  };

  const filterAttractions = (source = attractions) => {
    let filtered = source;

    console.log("Filtro selezionato:", selectedCategory);
    console.log("Ricerca per nome:", searchTerm);

    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (attraction) => attraction.category === selectedCategory
      );
    }

    if (showFavoritesOnly) {
      filtered = filtered.filter((attraction) =>
        favorites.includes(attraction.id)
      );
    }
    if (searchTerm) {
      filtered = filtered.filter((attraction) =>
        attraction.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    console.log("Risultato finale:", filtered);
    setFilteredAttractions(filtered);
  };

  const getWaitTimeColor = (waitTime) => {
    if (waitTime <= 10) return "text-green-600 bg-green-100";
    if (waitTime <= 20) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "open":
        return "text-green-600 bg-green-100";
      case "closed":
        return "text-red-600 bg-red-100";
      case "maintenance":
        return "text-orange-600 bg-orange-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "open":
        return "Aperta";
      case "closed":
        return "Chiusa";
      case "maintenance":
        return "Manutenzione";
      default:
        return "Sconosciuto";
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
      {message.text && (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
  >
    <div
      className={`pointer-events-auto px-6 py-4 rounded-lg shadow-lg text-sm max-w-sm w-full mx-auto
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

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-lime-600 to-green-600 bg-clip-text text-transparent mb-2">
            Attrazioni del Parco
          </h1>
          <p className="text-gray-600 text-lg">
            Scopri tutte le emozioni che ti aspettano
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-lg mb-8"
        >
          {/* Categories */}
          <div className="flex flex-wrap items-center gap-2 justify-between">
            <div className="flex items-center gap-4">
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedCategory === category.id
                        ? `${category.color} text-white`
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
              <div className="relative">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="peer opacity-0 absolute left-0 top-0 w-full h-full cursor-pointer"
                />
                <div className="px-4 py-2 rounded-full border border-gray-200 text-sm text-gray-700 bg-white cursor-pointer select-none peer-hover:bg-gray-50">
                  {selectedDate !== today ? selectedDate : "Seleziona data"}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Search */}
              <div>
                <div className="relative ">
                  <Search className="absolute left-3 top-1/2 transform  -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Cerca attrazioni..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-full"
                  />
                </div>
              </div>

              {/* Pulsante preferiti */}
              <button
                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
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

        {/* Attractions Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAttractions.map((attraction, index) => (
            <motion.div
              key={attraction.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              {/* Image */}
              <div className="relative h-48 bg-gradient-to-br from-lime-400 to-green-500">
                <img
                  src={attraction.image}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = `/placeholder.svg?height=200&width=300&text=${encodeURIComponent(
                      attraction.name
                    )}`;
                  }}
                />
                {/* Favorite Button */}
                <button
                  onClick={() => toggleFavorite(attraction.id)}
                  className="absolute top-3 right-3 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
                >
                  <Star
                    className={`h-5 w-5 ${
                      favorites.includes(attraction.id)
                        ? "text-yellow-500 fill-yellow-500"
                        : "text-gray-400"
                    }`}
                  />
                </button>
                {/* Status Badge */}
                <div className="absolute top-3 left-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      attraction.status
                    )}`}
                  >
                    {getStatusText(attraction.status)}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {attraction.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {attraction.description}
                </p>

                {/* Stats */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    {/* Wait Time */}
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-gray-400 mr-1" />
                      <span
                        className={`text-sm font-medium px-2 py-1 rounded ${getWaitTimeColor(
                          attraction.waitTime
                        )}`}
                      >
                        {attraction.waitTime} min
                      </span>
                    </div>
                  </div>
                </div>

                {/* Height Requirements */}
                {(attraction.minHeight > 0 || attraction.maxHeight) && (
                  <div className="flex items-center mb-4">
                    <Users className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">
                      {attraction.minHeight > 0 &&
                        `Min: ${attraction.minHeight}cm`}
                      {attraction.minHeight > 0 &&
                        attraction.maxHeight &&
                        " • "}
                      {attraction.maxHeight && `Max: ${attraction.maxHeight}cm`}
                    </span>
                  </div>
                )}

                {/* Actions */}
                <div className="flex space-x-2">
                  {attraction.category === "spettacolo" ? (
                    <button
                      onClick={() => navigate("/shows")}
                      className="flex-1 bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-600 transition-colors text-sm font-medium"
                    >
                      Vedi Spettacoli
                    </button>
                  ) : !user ? (
                    <button
                      onClick={() => navigate("/login")}
                      className="flex-1 bg-gray-300 text-gray-600 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors text-sm font-medium"
                    >
                      Accedi per aggiungere il Planner
                    </button>
                  ) : (
                    <button
                      onClick={() => handleAddToPlanner(attraction.id)}
                      className="flex-1 bg-lime-500 text-white py-2 px-4 rounded-lg hover:bg-lime-600 transition-colors text-sm font-medium"
                    >
                      Aggiungi al Planner
                    </button>
                  )}

                  <button
                    onClick={() =>
                      navigate("/map", {
                        state: { attractionName: attraction.name },
                      })
                    }
                    className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <MapPin className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredAttractions.length === 0 && (
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
              Nessuna attrazione trovata
            </h3>
          </motion.div>
        )}
      </div>
    </div>
  );
}
