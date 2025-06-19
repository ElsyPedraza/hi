import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Download,
  User,
  CreditCard,
  Ticket,
  QrCode,
  ArrowLeft,
} from "lucide-react";
import { useAxios } from "@/contexts/AxiosProvider";
import { useUser } from "@/contexts/UserProvider";
import QRCode from "qrcode";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function Success() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const axios = useAxios();
  const { user } = useUser();
  const [paymentData, setPaymentData] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qrCodeImages, setQrCodeImages] = useState({});
  const sessionId = searchParams.get("session_id");
  const [buyer, setBuyer] = useState({});


  useEffect(() => {
    if (sessionId) {
      fetchPaymentDetails();
     
    }
  }, [sessionId]);

  const fetchPaymentDetails = async () => {
    try {
      setLoading(true);

      // Recupera i dettagli del pagamento da Stripe
      const response = await axios.get(`/tickets/payment-success/${sessionId}`);
      const data = response.data;

      setPaymentData(data.payment);
      setTickets(data.tickets);
       setBuyer(data.buyer);

      // Genera QR codes per ogni biglietto
      const qrImages = {};
      for (const ticket of data.tickets) {
        try {
          const qrImage = await QRCode.toDataURL(ticket.qrCode, {
            width: 200,
            margin: 2,
            color: {
              dark: "#16a34a",
              light: "#ffffff",
            },
          });
          qrImages[ticket.id] = qrImage;
        } catch (error) {
          console.error("Errore generazione QR:", error);
        }
      }
      setQrCodeImages(qrImages);
    } catch (error) {
      console.error("Errore nel recupero dettagli pagamento:", error);
      navigate("/tickets");
    } finally {
      setLoading(false);
    }
  };

  const downloadTicket = async (ticket) => {
    try {
      const response = await axios.get(`/tickets/${ticket.id}/download`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `biglietto-${ticket.id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Errore download biglietto:", error);
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-lime-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-lime-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Caricamento dettagli pagamento...</p>
        </div>
      </div>
    );
  }

  if (!paymentData || !tickets.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-lime-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Pagamento non trovato</p>
          <button
            onClick={() => navigate("/tickets")}
            className="bg-lime-600 text-white px-6 py-2 rounded-lg hover:bg-lime-700 transition-colors"
          >
            Torna ai biglietti
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-50 to-green-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header Success */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
            <DotLottieReact
              src="https://lottie.host/ab7ce684-86d7-48d1-9e1d-eaeff278a6d2/cXtJnczGph.lottie"
              loop
              autoplay
            />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Pagamento Completato!
          </h1>
          <p className="text-gray-600 text-lg">
            I tuoi biglietti sono pronti per l'uso
          </p>
        </motion.div>

        {/* Payment Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Riepilogo Pagamento
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Dati Acquirente */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <User className="h-5 w-5 mr-2 text-lime-600" />
                Dati Acquirente
              </h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <span className="text-gray-600 w-20">Nome:</span>
                  <span className="font-medium">{buyer.name || "N/A"}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-600 w-16">Email:</span>
                  <span className="font-medium">{buyer.email || "N/A"}</span>
                </div>
                  <div className="flex items-center">
                    <span className="text-gray-600 w-16">Telefono:</span>
                    <span className="font-medium">{buyer.phone || "N/A"}</span>
                  </div>
               
              </div>
            </div>

            {/* Dati Pagamento */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <CreditCard className="h-5 w-5 mr-2 text-lime-600" />
                Dati Pagamento
              </h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <span className="text-gray-600 w-20">Metodo:</span>
                  <span className="font-medium">
                    **** **** **** {paymentData.card?.last4 || "****"}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-600 w-20">Tipo:</span>
                  <span className="font-medium capitalize">
                    {paymentData.card?.brand || "Carta"}{" "}
                    {paymentData.card?.funding || ""}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-600 w-16">Data:</span>
                  <span className="font-medium">
                    {new Date(paymentData.created * 1000).toLocaleString(
                      "it-IT"
                    )}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-600 w-20">Totale:</span>
                  <span className="font-bold text-lime-600 text-lg">
                    €{(paymentData.amount_total / 100).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tickets */}
        <div className="space-y-6">
          {tickets.map((ticket, index) => (
            <motion.div
              key={ticket.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <div className="bg-gradient-to-r from-lime-500 to-green-600 p-4">
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center">
                    <Ticket className="h-6 w-6 mr-2" />
                    <h3 className="text-xl font-bold">
                      {ticket.type?.name || "Biglietto"}
                    </h3>
                  </div>
                  <span className="text-lg font-semibold">#{ticket.id}</span>
                </div>
              </div>

              <div className="p-6">
                <div className="grid lg:grid-cols-3 gap-6">
                  {/* QR Code */}
                  <div className="text-center">
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      {qrCodeImages[ticket.id] ? (
                        <img
                          src={qrCodeImages[ticket.id] || "/placeholder.svg"}
                          alt="QR Code"
                          className="mx-auto"
                        />
                      ) : (
                        <div className="w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center mx-auto">
                          <QrCode className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 font-mono bg-gray-100 p-2 rounded">
                      {ticket.qrCode}
                    </p>
                  </div>

                  {/* Ticket Details */}
                  <div className="lg:col-span-2">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-3">
                          Dettagli Biglietto
                        </h4>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <span className="text-gray-600">Data visita:</span>
                            <span className="font-medium ml-2">
                              {new Date(ticket.validDate).toLocaleDateString(
                                "it-IT",
                                {
                                  weekday: "long",
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <span className="text-gray-600">Tipo:</span>
                            <span className="font-medium ml-2">
                              {ticket.type?.name}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <span className="text-gray-600">Prezzo:</span>
                            <span className="font-bold text-lime-600 ml-2">
                              €{ticket.type?.price?.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-800 mb-3">
                          Stato Biglietto
                        </h4>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                            <span className="text-green-600 font-medium">
                              Attivo
                            </span>
                          </div>
                          <div className="text-sm text-gray-600">
                            <p>✓ Pagamento confermato</p>
                            <p>✓ Biglietto valido</p>
                            <p>✓ Pronto per l'uso</p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-6 space-y-3">
                          <button
                            onClick={() => downloadTicket(ticket)}
                            className="w-full bg-lime-600 text-white py-2 px-4 rounded-lg hover:bg-lime-700 transition-colors flex items-center justify-center"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Scarica PDF
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Important Notes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-blue-50 border border-blue-200 rounded-xl p-6 mt-8"
        >
          <h3 className="font-semibold text-blue-800 mb-3">
            Informazioni Importanti
          </h3>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• Presenta il QR code all'ingresso del parco</li>
            <li>• Il biglietto è valido solo per la data selezionata</li>
            <li>• Conserva questo biglietto fino alla fine della visita</li>
            <li>• In caso di problemi, contatta il nostro supporto</li>
          </ul>
        </motion.div>

        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-8"
        >
          <button
            onClick={() => navigate("/dashboard")}
            className="inline-flex items-center text-lime-600 hover:text-lime-700 font-medium"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Torna alla Dashboard
          </button>
        </motion.div>
      </div>
    </div>
  );
}
