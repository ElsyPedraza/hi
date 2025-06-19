import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { Calendar, Users, CreditCard, Ticket, Check, Star, Gift } from "lucide-react"
import { useUser } from "@/contexts/UserProvider"
import { useNavigate } from "react-router-dom"
import { useAxios } from "@/contexts/AxiosProvider";

export default function Tickets() {
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [selectedDate, setSelectedDate] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)
  const { isAuthenticated } = useUser()
  const navigate = useNavigate()
  const axios = useAxios();
const [ticketTypes, setTicketTypes] = useState([]);
const [message, setMessage] = useState({ type: "", text: "" });



useEffect(() => {
  const fetchTicketTypes = async () => {
    try {
      const res = await axios.get("/tickets/types");
      setTicketTypes(res.data);
    } catch (err) {
      console.error("Errore nel caricamento dei tipi di biglietto:", err);
    }
  };

  fetchTicketTypes();
}, []);


  const getTotalPrice = () => {
    if (!selectedTicket) return 0
    return selectedTicket.price * quantity
  }

  const handlePurchase = async () => {
  if (!isAuthenticated) {
    navigate("/login");
    return;
  }

  if (!selectedTicket || !selectedDate) {
    setMessage({ type: "error", text: "Seleziona un biglietto e una data." });
    return;
  }

  setIsProcessing(true);

  try {
    const res = await axios.post("/tickets/checkout", {
      ticketTypeId: selectedTicket.id,
      validDate: selectedDate,
      quantity,
    });

    window.location.href = res.data.url; // Redirect a Stripe Checkout
  } catch (error) {
    console.error("Errore nel checkout:", error);
    setMessage({ type: "error", text: "Errore durante l'elaborazione del pagamento." });
  } finally {
    setIsProcessing(false);
  }
};


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
            ? "bg-green-50 text-green-800 border border-green-200"
            : "bg-red-50 text-red-800 border border-red-200"
        }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {message.type === "success" ? (
            <Check className="h-4 w-4" />
          ) : (
            <CreditCard className="h-4 w-4" />
          )}
          {message.text}
        </div>
        <button
          onClick={() => setMessage({ type: "", text: "" })}
          className="text-current hover:opacity-70"
        >
          ✕
        </button>
      </div>
    </div>
  </motion.div>
)}

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-lime-600 to-green-600 bg-clip-text text-transparent mb-2">
            Acquista Biglietti
          </h1>
          <p className="text-gray-600 text-lg">Scegli il biglietto perfetto per la tua visita</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Ticket Selection */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Seleziona il tuo biglietto</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {ticketTypes.map((ticket) => (
                  <motion.div
                    key={ticket.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedTicket(ticket)}
                    className={`relative bg-white rounded-xl p-6 cursor-pointer transition-all duration-300 ${
                      selectedTicket?.id === ticket.id ? "ring-2 ring-lime-500 shadow-lg" : "shadow-md hover:shadow-lg"
                    }`}
                  >
                    {/* Popular Badge */}
                    {ticket.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center">
                          <Star className="h-4 w-4 mr-1" />
                          Più Popolare
                        </span>
                      </div>
                    )}

                    {/* Selected Indicator */}
                    {selectedTicket?.id === ticket.id && (
                      <div className="absolute top-4 right-4">
                        <div className="bg-lime-500 text-white rounded-full p-1">
                          <Check className="h-4 w-4" />
                        </div>
                      </div>
                    )}

                    {/* Ticket Header */}
                    <div className={`h-2 bg-gradient-to-r ${ticket.color} rounded-t-lg mb-4`}></div>

                    <h3 className="text-xl font-bold text-gray-800 mb-2">{ticket.name}</h3>
                    <p className="text-gray-600 text-sm mb-4">{ticket.description}</p>

                    {/* Price */}
                    <div className="mb-4">
                      <div className="flex items-baseline">
                        <span className="text-3xl font-bold text-gray-800">€{ticket.price}</span>
                        {ticket.originalPrice && (
                          <span className="text-lg text-gray-400 line-through ml-2">€{ticket.originalPrice}</span>
                        )}
                      </div>
                      {ticket.originalPrice && (
                        <span className="text-green-600 text-sm font-medium">
                          Risparmi €{ticket.originalPrice - ticket.price}!
                        </span>
                      )}
                    </div>

                    {/* Features */}
                    <ul className="space-y-2">
                      {ticket.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm text-gray-600">
                          <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Date and Quantity Selection */}
            {selectedTicket && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl p-6 shadow-lg"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-4">Dettagli della visita</h3>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Date Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Data della visita</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Quantity Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Quantità</label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <select
                        value={quantity}
                        onChange={(e) => setQuantity(Number.parseInt(e.target.value))}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                          <option key={num} value={num}>
                            {num} {num === 1 ? "biglietto" : "biglietti"}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl p-6 shadow-lg sticky top-8"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4">Riepilogo Ordine</h3>

              {selectedTicket ? (
                <>
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-800">{selectedTicket.name}</h4>
                        <p className="text-sm text-gray-600">Quantità: {quantity}</p>
                        {selectedDate && <p className="text-sm text-gray-600">Data: {selectedDate}</p>}
                      </div>
                      <span className="font-bold text-gray-800">€{(selectedTicket.price * quantity).toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="border-t pt-4 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-800">Totale</span>
                      <span className="text-2xl font-bold text-lime-600">€{getTotalPrice().toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    onClick={handlePurchase}
                    disabled={!selectedDate || isProcessing}
                    className="w-full bg-gradient-to-r from-lime-500 to-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-lime-600 hover:to-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isProcessing ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    ) : (
                      <CreditCard className="h-5 w-5 mr-2" />
                    )}
                    {isProcessing ? "Elaborazione..." : "Acquista Ora"}
                  </button>

                  {!isAuthenticated && (
                    <p className="text-sm text-gray-600 text-center mt-3">
                      <span className="text-orange-600">Nota:</span> Devi effettuare il login per completare l'acquisto
                    </p>
                  )}
                </>
              ) : (
                <div className="text-center py-8">
                  <Ticket className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Seleziona un biglietto per vedere il riepilogo</p>
                </div>
              )}

              {/* Benefits */}
              <div className="mt-6 pt-6 border-t">
                <h4 className="font-medium text-gray-800 mb-3">Vantaggi inclusi:</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <Gift className="h-4 w-4 text-green-500 mr-2" />
                    Cancellazione gratuita
                  </li>
                  <li className="flex items-center">
                    <Gift className="h-4 w-4 text-green-500 mr-2" />
                    Biglietto digitale
                  </li>
                  <li className="flex items-center">
                    <Gift className="h-4 w-4 text-green-500 mr-2" />
                    Accesso prioritario
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
