

import { useParams, useNavigate } from "react-router-dom"
import { usePlanner } from "@/hooks/usePlanner"
import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"
import {
  Calendar,
  Trash2,
  MapPin,
  Clock,
  Star,
  Plus,
  FerrisWheelIcon as Ferris,
  ArrowLeft,
  Users,
  Timer,
  AlertCircle,
  Lightbulb,
  Theater,Check, X
} from "lucide-react"
import { useAxios } from "@/contexts/AxiosProvider"
import html2pdf from "html2pdf.js"

export default function PlannerPage() {
  const { date } = useParams()
  const navigate = useNavigate()
  const { plan, fetchPlanner, removeFromPlanner, getPlannerByDate } = usePlanner()
  const axios = useAxios()
  const plannerRef = useRef()

  const [planner, setPlanner] = useState(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(null)
  const [suggestedItems, setSuggestedItems] = useState([])
  const [message, setMessage] = useState({ type: "", text: "" });


  useEffect(() => {
    const loadSuggestions = async () => {
      try {
        // Recupera prima il planner per la data
        const plannerRes = await getPlannerByDate(date)
        const existingItems = plannerRes?.items || []
        const [attrRes, showScheduleRes] = await Promise.all([
          axios.get("/attractions"),
          axios.get(`/shows/show-schedule?date=${date}`),
        ])
        console.log("Spettacoli trovati:", showScheduleRes.data)

        // Mappa tutte le attrazioni
        const mappedAttractions = attrRes.data
          .filter((a) => a.category !== "spettacolo") // solo attrazioni "classiche"
          .map((a) => ({
            type: "attraction",
            id: a.id,
            name: a.name,
          }))

        // Filtro spettacoli solo per la data del planner
        const showDate = new Date(date).toISOString().split("T")[0]
        const mappedShows = showScheduleRes.data
          .filter((s) => s.date.split("T")[0] === showDate)
          .map((s) => ({
            type: "show",
            id: s.scheduleId,
            name: s.show?.title || "Spettacolo senza nome",
          }))

        // Elimina elementi già presenti nel planner
        const existingIds = new Set(
          existingItems.map((item) => {
            if (item.attraction) return `attraction-${item.attraction.id}`
            if (item.showSchedule) return `show-${item.showSchedule.id}`
            return ""
          }),
        )

        const filteredSuggestions = [...mappedAttractions, ...mappedShows].filter(
          (item) => !existingIds.has(`${item.type}-${item.id}`),
        )

        setSuggestedItems(filteredSuggestions)
      } catch (error) {
        console.error("Errore nel caricamento di attrazioni e spettacoli:", error)
      }
    }

    loadSuggestions()
  }, [])

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const data = await getPlannerByDate(date)
        setPlanner(data)
      } catch (error) {
        console.error("Errore nel caricamento del planner:", error)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [date, getPlannerByDate])

  useEffect(() => {
    if (plan && plan.length > 0) {
      const currentPlanner = plan.find((p) => {
        const planDate = new Date(p.date).toDateString()
        const currentDate = new Date(date).toDateString()
        return planDate === currentDate
      })
      if (currentPlanner) {
        setPlanner(currentPlanner)
      }
    }
  }, [plan, date])

  const handleDelete = async (itemId) => {
    if (!confirm) return

    try {
      setDeleting(itemId)
      await removeFromPlanner(itemId)

      if (planner.items.length === 1) {
        await axios.delete(`/planner/${planner.id}`)

        // Aggiorna lo stato
        fetchPlanner()
        setPlanner(null)

        // Torna alla dashboard
        navigate("/dashboard")
        return
      }

      setPlanner((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          items: prev.items.filter((item) => item.id !== itemId),
        }
      })
    } catch (error) {
      console.error("Errore nella rimozione:", error)
      setMessage({ type: "error", text: "Errore nella rimozione dell'element" });
    } finally {
      setDeleting(null)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("it-IT", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (timeString) => {
    if (!timeString) return null
    return new Date(timeString).toLocaleTimeString("it-IT", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getTotalDuration = () => {
    if (!planner?.items) return 0
    return planner.items.reduce((total, item) => {
      const duration = item.attraction?.duration_minutes || item.showSchedule?.show?.duration || 30
      return total + duration
    }, 0)
  }

  const getItemType = (item) => {
    if (item.attraction) return "attraction"
    if (item.showSchedule) return "show"
    return "other"
  }

  const getItemIcon = (type) => {
    switch (type) {
      case "attraction":
        return <Star className="h-5 w-5" />
      case "show":
        return <Users className="h-5 w-5" />
      default:
        return <Calendar className="h-5 w-5" />
    }
  }

  const getItemColor = (type) => {
    switch (type) {
      case "attraction":
        return "from-lime-500 to-green-500"
      case "show":
        return "from-blue-500 to-cyan-500"
      default:
        return "from-gray-500 to-gray-600"
    }
  }



const addItemToPlanner = async (item) => {
  try {
    await axios.post(`/planner/${planner.id}/add`, {
      items: [
        item.type === "attraction"
          ? { type: "attraction", attractionId: item.id }
          : { type: "show", showScheduleId: item.id },
      ],
    });

 
    const updated = await getPlannerByDate(date);
    setPlanner(updated);
    fetchPlanner(); // aggiorna globale

    setSuggestedItems((prev) => prev.filter((s) => !(s.id === item.id && s.type === item.type)));
    setMessage({ type: "success", text: "Elemento aggiunto al planner!" });
    setTimeout(() => setMessage({ type: "", text: "" }), 4000);
  } catch (error) {
    console.error("Errore aggiunta al planner:", error);
    setMessage({ type: "error", text: "Errore durante l'aggiunta al planner." });
  }
};


  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-lime-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-lime-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Caricamento del tuo planner...</p>
        </div>
      </div>
    )
  }

  if (!planner) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-lime-50 to-green-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-600 mb-2">Planner non trovato</h2>
            <p className="text-gray-500 mb-6">Non è stato possibile caricare il planner per questa data.</p>
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-lime-500 text-white px-6 py-3 rounded-lg hover:bg-lime-600 transition-colors"
            >
              Torna alla Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-50 to-green-50 py-8">
      <div className="container mx-auto px-4" ref={plannerRef}>
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
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center mb-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="mr-4 p-2 text-gray-600 hover:text-gray-800 hover:bg-white rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex-1">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-lime-600 to-green-600 bg-clip-text text-transparent mb-2">
                Il Tuo Planner
              </h1>
              <p className="text-gray-600 text-lg flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                {formatDate(planner.date)}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="bg-gradient-to-r from-lime-500 to-green-500 text-white p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                <Calendar className="h-6 w-6" />
              </div>
              <p className="text-2xl font-bold text-gray-800">{planner.items?.length || 0}</p>
              <p className="text-sm text-gray-600">Elementi</p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                <Timer className="h-6 w-6" />
              </div>
              <p className="text-2xl font-bold text-gray-800">{Math.round(getTotalDuration() / 60)}h</p>
              <p className="text-sm text-gray-600">Durata Totale</p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                <Star className="h-6 w-6" />
              </div>
              <p className="text-2xl font-bold text-gray-800">
                {planner.items?.filter((item) => getItemType(item) === "attraction").length || 0}
              </p>
              <p className="text-sm text-gray-600">Attrazioni</p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                <Users className="h-6 w-6" />
              </div>
              <p className="text-2xl font-bold text-gray-800">
                {planner.items?.filter((item) => getItemType(item) === "show").length || 0}
              </p>
              <p className="text-sm text-gray-600">Spettacoli</p>
            </div>
          </div>
        </motion.div>

        {/* Layout a due colonne: Planner Items + Suggerimenti */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Colonna sinistra: Elementi del Planner */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-6"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <Calendar className="h-6 w-6 mr-2 text-lime-600" />
                Il Tuo Programma
              </h2>
            </motion.div>

            <div className="space-y-4">
              {planner.items && planner.items.length > 0 ? (
                planner.items.map((item, index) => {
                  const itemType = getItemType(item)
                  const itemName = item.attraction?.name || item.showSchedule?.show?.title || "Elemento sconosciuto"
                  const itemLocation =
                    item.attraction?.location ||
                    item.showSchedule?.show?.attraction?.name ||
                    "Posizione non specificata"
                  const itemTime = formatTime(item.preferredTime)

                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            {/* Header con icona e tipo */}
                            <div className="flex items-center mb-3">
                              <div
                                className={`bg-gradient-to-r ${getItemColor(
                                  itemType,
                                )} text-white p-2 rounded-lg mr-3 flex items-center justify-center`}
                              >
                                {getItemIcon(itemType)}
                              </div>
                              <div>
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    itemType === "attraction"
                                      ? "bg-lime-100 text-lime-800"
                                      : itemType === "show"
                                        ? "bg-blue-100 text-blue-800"
                                        : "bg-gray-100 text-gray-800"
                                  }`}
                                >
                                  {itemType === "attraction"
                                    ? "Attrazione"
                                    : itemType === "show"
                                      ? "Spettacolo"
                                      : "Altro"}
                                </span>
                              </div>
                            </div>

                            {/* Nome e descrizione */}
                            <h3 className="text-xl font-bold text-gray-800 mb-2">{itemName}</h3>

                            {/* Dettagli */}
                            <div className="space-y-2">
                              <div className="flex items-center text-gray-600">
                                <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                                <span className="text-sm">{itemLocation}</span>
                              </div>

                              {itemTime && (
                                <div className="flex items-center text-gray-600">
                                  <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
                                  <span className="text-sm">Orario preferito: {itemTime}</span>
                                </div>
                              )}

                              {/* Durata stimata */}
                              {(item.attraction?.duration_minutes || item.showSchedule?.show?.duration) && (
                                <div className="flex items-center text-gray-600">
                                  <Timer className="h-4 w-4 mr-2 flex-shrink-0" />
                                  <span className="text-sm">
                                    Durata: {item.attraction?.duration_minutes || item.showSchedule?.show?.duration}{" "}
                                    minuti
                                  </span>
                                </div>
                              )}

                              {/* Rating se disponibile */}
                              {(item.attraction?.rating || item.showSchedule?.show?.rating) && (
                                <div className="flex items-center text-gray-600">
                                  <Star className="h-4 w-4 mr-2 flex-shrink-0 text-yellow-500 fill-yellow-500" />
                                  <span className="text-sm">
                                    Rating: {item.attraction?.rating || item.showSchedule?.show?.rating}
                                    /5
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Note se presenti */}
                            {item.notes && (
                              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-600">
                                  <strong>Note:</strong> {item.notes}
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Azioni */}
                          <div className="flex flex-col space-y-2 ml-4">
                            <button
                              onClick={() => handleDelete(item.id)}
                              disabled={deleting === item.id}
                              className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                            >
                              {deleting === item.id ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-500"></div>
                              ) : (
                                <Trash2 className="h-5 w-5" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-center py-12"
                >
                  <div className="bg-white rounded-xl shadow-lg p-8">
                    <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">Planner Vuoto</h3>
                    <p className="text-gray-500 mb-6">
                      Inizia aggiungendo attrazioni e spettacoli dal pannello a destra
                    </p>
                    <div className="flex items-center justify-center text-lime-600">
                      <span className="mr-2">Guarda i suggerimenti</span>
                      <ArrowLeft className="h-5 w-5 rotate-180" />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Colonna destra: Suggerimenti */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-white rounded-xl shadow-lg p-6 sticky top-8"
            >
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <Lightbulb className="h-5 w-5 text-yellow-500 mr-2" />
                Aggiungi al Planner
              </h3>

              {suggestedItems.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {suggestedItems.map((item, index) => (
                    <motion.div
                      key={`${item.type}-${item.id || Math.random()}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.05 }}
                      className="bg-gradient-to-br from-lime-50 to-green-50 rounded-lg border border-lime-200 p-4 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 text-sm mb-1">{item.name}</h4>
                          <p className="text-xs text-gray-600 flex items-center">
                            {item.type === "attraction" ? (
                              <Ferris className="h-3 w-3 mr-1 text-yellow-500" />
                            ) : (
                              <Theater className="h-3 w-3 mr-1 text-blue-500" />
                            )}
                            {item.type === "attraction" ? "Attrazione" : "Spettacolo"}
                          </p>
                        </div>
                        <div className="w-2 h-2 bg-lime-500 rounded-full mt-1"></div>
                      </div>
                      <button
                        onClick={() => addItemToPlanner(item)}
                        className="w-full bg-lime-500 text-white px-3 py-2 rounded-lg hover:bg-lime-600 transition-colors flex items-center justify-center text-sm font-medium"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Aggiungi
                      </button>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Star className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">Tutti gli elementi disponibili sono già nel tuo planner!</p>
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Suggerimenti per la visita */}
        {planner.items && planner.items.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 bg-white rounded-xl shadow-lg p-6"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">💡 Suggerimenti per la tua visita</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-lime-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p>Arriva al parco 30 minuti prima dell'apertura per evitare le code</p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-lime-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p>Fai una pausa pranzo tra le 12:00 e le 14:00</p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-lime-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p>Controlla i tempi di attesa in tempo reale sull'app</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
