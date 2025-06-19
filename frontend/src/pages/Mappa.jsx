import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Clock, Star, Users, Info } from "lucide-react";
import level0 from "../assets/level_0.png";
import level1 from "../assets/level_1.png";
import level2 from "../assets/level_2.png";
import level3 from "../assets/level_3.png";
import level4 from "../assets/level_4.png";
import toilets from "../assets/toilet.png";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useAxios } from "@/contexts/AxiosProvider";
import { usePlanner } from "@/hooks/usePlanner";
import { useLocation } from "react-router-dom";
import { useSearchParams } from "react-router-dom";

function Mappa() {
  const [selectedAttraction, setSelectedAttraction] = useState(null);
  const [attractions, setAttractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const myaxios = useAxios();
const { plan, addToPlanner, fetchPlanner, removeFromPlanner, getPlannerByDate } = usePlanner();

  const location = useLocation();

  useEffect(() => {
    fetchAttractions();
  }, []);

  useEffect(() => {
    if (location.state?.attractionName && attractions.length > 0) {
      const found = attractions.find((a) =>
        a.name
          .toLowerCase()
          .includes(location.state.attractionName.toLowerCase())
      );
      if (found) {
        const enriched = {
          ...found,
          waitTime: Math.floor(Math.random() * 25) + 5,
          rating: (4 + Math.random()).toFixed(1),
          ageRecommendation: getAgeRecommendation(found.category),
          duration: getDuration(found.category),
          capacity: getCapacity(found.category),
          tips: getTips(found.category),
          location: getLocationText(found.category),
        };
        setSelectedAttraction(enriched);
      }
    }
  }, [location.state, attractions]);

  const fetchAttractions = async () => {
    try {
      const response = await myaxios.get("/attractions");
      setAttractions(response.data);
    } catch (error) {
      console.error("Errore nel caricamento attrazioni:", error);
    } finally {
      setLoading(false);
    }
  };

  // Mappa le animazioni Lottie alle attrazioni del database
  const getAttractionByName = (searchName) => {
    return attractions.find(
      (attr) =>
        attr.name.toLowerCase().includes(searchName.toLowerCase()) ||
        searchName.toLowerCase().includes(attr.name.toLowerCase())
    );
  };

  const [searchParams] = useSearchParams();
  useEffect(() => {
    const locationToFocus = searchParams.get("focus");
    if (locationToFocus) {
      handleAttractionClick(locationToFocus.toLowerCase());
    }
  }, [searchParams]);

  const handleAttractionClick = (attractionKey) => {
    let attraction = null;

    switch (attractionKey) {
      case "carousel":
        attraction = getAttractionByName("carosello");
        break;
      case "trenino":
        attraction = getAttractionByName("Trenino del Parco");
        break;
      case "autoscontro":
        attraction = getAttractionByName("Autoscontro");
        break;
      case "ruota":
        attraction = getAttractionByName("Ruota Panoramica");
        break;
      case "nave":
        attraction = getAttractionByName("Nave Pirata");
        break;
      case "montagna":
        attraction = getAttractionByName("montagne russe");
        break;
      case "festa":
        attraction = getAttractionByName("teatro");
        break;
      case "tenda1":
        attraction = getAttractionByName("Tenda Grande");
        break;
      case "tenda2":
        attraction = getAttractionByName("Tenda Piccola");
        break;
      case "castello":
        attraction = getAttractionByName("Castello delle Avventure");
        break;
      case "food":
        attraction = {
          id: "food",
          name: "Ristorante Centrale",
          description:
            "Il nostro ristorante principale con cucina italiana e specialità locali",
          category: "ristoro",
        };
        break;
      case "medical":
        attraction = {
          id: "medical",
          name: "Stazione Medica",
          description:
            "Punto di primo soccorso con personale qualificato sempre disponibile",
          category: "servizi",
        };
        break;
      case "infopoint":
        attraction = {
          id: "infopoint",
          name: "Info Point",
          description: "Centro informazioni per mappe, orari e prenotazioni",
          category: "servizi",
        };
        break;
      case "toilets":
        attraction = {
          id: "toilets",
          name: "Toilet",
          description: "Bagni pubblici puliti e accessibili",
          category: "servizi",
        };
        break;
    }

    if (attraction) {
      const enrichedAttraction = {
        ...attraction,
        waitTime: Math.floor(Math.random() * 25) + 5,
        rating: (4 + Math.random()).toFixed(1),
        ageRecommendation: getAgeRecommendation(attraction.category),
        duration: getDuration(attraction.category),
        capacity: getCapacity(attraction.category),
        tips: getTips(attraction.category),
        location: getLocationText(attraction.category),
      };
      setSelectedAttraction(enrichedAttraction);
    }
  };


  const getAgeRecommendation = (category) => {
    const ageMap = {
      giostra: "8+",
      bambini: "3+",
      tour: "6+",
      spettacolo: "Tutti",
      ristoro: "Tutti",
      servizi: "Tutti",
    };
    return ageMap[category] || "Tutti";
  };

  const getDuration = (category) => {
    const durationMap = {
      giostra: "3-5 minuti",
      bambini: "4-6 minuti",
      tour: "8-10 minuti",
      spettacolo: "30-45 minuti",
      ristoro: "30-60 minuti",
      servizi: "Su necessità",
    };
    return durationMap[category] || "5 minuti";
  };

  const getCapacity = (category) => {
    const capacityMap = {
      giostra: "24-32 persone",
      bambini: "16-24 persone",
      tour: "12-16 persone",
      spettacolo: "100-500 persone",
      ristoro: "80-120 persone",
      servizi: "Illimitata",
    };
    return capacityMap[category] || "20 persone";
  };

  const getTips = (category) => {
    const tipsMap = {
      giostra: [
        "Altezza minima richiesta",
        "Emozioni forti garantite",
        "Controlla le restrizioni",
      ],
      bambini: [
        "Perfetto per i più piccoli",
        "Accompagnamento adulti consigliato",
        "Sicurezza garantita",
      ],
      tour: [
        "Vista panoramica mozzafiato",
        "Ideale per foto ricordo",
        "Esperienza rilassante",
      ],
      spettacolo: [
        "Controlla gli orari",
        "Posti limitati",
        "Prenotazione consigliata",
      ],
      ristoro: [
        "Menu bambini disponibile",
        "Prenotazione consigliata",
        "Terrazza panoramica",
      ],
      servizi: [
        "Sempre disponibile",
        "Personale qualificato",
        "Assistenza gratuita",
      ],
    };
    return (
      tipsMap[category] || [
        "Divertimento garantito",
        "Adatto a tutti",
        "Esperienza unica",
      ]
    );
  };

  const getLocationText = (category) => {
    const locationMap = {
      giostra: "Zona Adrenalina",
      bambini: "Zona Famiglia",
      tour: "Zona Panoramica",
      spettacolo: "Zona Spettacoli",
      ristoro: "Zona Ristoro",
      servizi: "Zona Servizi",
    };
    return locationMap[category] || "Zona Centrale";
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "giostra":
        return "from-red-500 to-orange-500";
      case "bambini":
        return "from-blue-500 to-cyan-500";
      case "spettacolo":
        return "from-purple-500 to-pink-500";
      case "tour":
        return "from-green-500 to-lime-500";
      case "ristoro":
        return "from-yellow-500 to-orange-500";
      case "servizi":
        return "from-gray-500 to-gray-600";
      default:
        return "from-lime-500 to-green-500";
    }
  };

  const getWaitTimeColor = (waitTime) => {
    if (waitTime <= 10) return "text-green-600 bg-green-100";
    if (waitTime <= 20) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-50 to-green-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-lime-600 to-green-600 bg-clip-text text-transparent mb-2">
            Mappa del Parco
          </h1>
          <p className="text-gray-600 text-lg">
            Clicca sulle attrazioni per scoprire tutti i dettagli
          </p>
        </motion.div>

        {/* Mappa con Legenda Laterale */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="grid lg:grid-cols-4 gap-6"
        >
          {/* Mappa Principale */}
          <div className="lg:col-span-3 bg-white rounded-xl shadow-lg p-4">
            <div className="relative w-full max-w-6xl mx-auto aspect-[16/9]">
              {/* Livelli della mappa */}
              <img
                src={level0 || "/placeholder.svg"}
                alt="Mappa EnjoyPark"
                className="absolute inset-0 w-full h-full object-contain z-0"
              />
              <img
                src={level1 || "/placeholder.svg"}
                alt="Mappa EnjoyPark"
                className="absolute inset-0 w-full h-full object-contain z-10"
              />
              <img
                src={level2 || "/placeholder.svg"}
                alt="Mappa EnjoyPark"
                className="absolute inset-0 w-full h-full object-contain z-20"
              />
              <img
                src={level3 || "/placeholder.svg"}
                alt="Mappa EnjoyPark"
                className="absolute inset-0 w-full h-full object-contain z-30"
              />
              <img
                src={level4 || "/placeholder.svg"}
                alt="Mappa EnjoyPark"
                className="absolute inset-0 w-full h-full object-contain z-40"
              />

              <div className="absolute inset-0">
                {/* ATTRAZIONI NELLE POSIZIONI ORIGINALI */}

                {/* Giostra */}
                <motion.div
                  className="absolute top-[40%] left-[15%] w-[30%] z-50 cursor-pointer"
                  onClick={() => handleAttractionClick("ruota")}
                >
                  <DotLottieReact
                    src="https://lottie.host/da2fe80e-4f42-49e7-bdbe-7020b151027a/a6hbrs7td3.lottie"
                    loop
                    autoplay
                  />
                </motion.div>

                {/* Carousel */}
                <motion.div
                  className="absolute top-[26%] left-[38%] w-[20%] z-50 cursor-pointer"
                  onClick={() => handleAttractionClick("carousel")}
                >
                  <DotLottieReact
                    src="https://lottie.host/9e418f94-e96a-4d23-a2f7-034f55dc5261/VLMuJx8QYG.lottie"
                    loop
                    autoplay
                  />
                </motion.div>

                {/* Montagna Russe */}
                <motion.div
                  className="absolute -top-[16%] left-[18%] w-[50%] z-50 cursor-pointer"
                  onClick={() => handleAttractionClick("montagna")}
                >
                  <DotLottieReact
                    src="https://lottie.host/7461ec7f-3514-45e0-94de-56c24a507256/SIgncChnh5.lottie"
                    loop
                    autoplay
                  />
                </motion.div>

                {/* Area Festa */}
                <motion.div
                  className="absolute top-[76%] left-[39%] w-[17%] z-50 cursor-pointer"
                  onClick={() => handleAttractionClick("festa")}
                >
                  <DotLottieReact
                    src="https://lottie.host/2dde1a34-c4d3-4abc-8184-97111ad7f372/Mu9jjiqAP1.lottie"
                    loop
                    autoplay
                  />
                </motion.div>

                {/* Mongolfiera 1 */}
                <motion.div
                  className="absolute top-[30%] left-[20%] w-[12%] z-50 cursor-pointer"
                  onClick={() => handleAttractionClick("mongolfiera1")}
                >
                  <DotLottieReact
                    src="https://lottie.host/cf5d6e90-3824-48eb-91dc-44c7abd9ff4a/w4Ma4TXS2y.lottie"
                    loop
                    autoplay
                  />
                </motion.div>

                {/* Mongolfiera 2 */}
                <motion.div
                  className="absolute top-[50%] left-[73%] w-[12%] z-50 cursor-pointer"
                  onClick={() => handleAttractionClick("mongolfiera2")}
                >
                  <DotLottieReact
                    src="https://lottie.host/cf5d6e90-3824-48eb-91dc-44c7abd9ff4a/w4Ma4TXS2y.lottie"
                    loop
                    autoplay
                  />
                </motion.div>

                {/* Tenda Grande */}
                <motion.div
                  className="absolute top-[24%] left-[36%] w-[8%] h-[8%] z-50 cursor-pointer text-transparent"
                  onClick={() => handleAttractionClick("tenda1")}
                >
                  Tenda Grande
                </motion.div>

                {/* Tenda Piccola */}
                <motion.div
                  className="absolute top-[22%] left-[41%] w-[5%] z-50 cursor-pointer text-transparent"
                  onClick={() => handleAttractionClick("tenda2")}
                >
                  Tenda Piccola{" "}
                </motion.div>

                {/* Castello delle Avventure */}
                <motion.div
                  className="absolute top-[32%] left-[58%] w-[15%] z-50 cursor-pointer text-transparent"
                  onClick={() => handleAttractionClick("castello")}
                >
                  Castello
                </motion.div>

                {/* Nave Pirata */}
                <motion.div
                  className="absolute top-[36%] left-[69%] w-[10%] z-50 cursor-pointer text-transparent"
                  onClick={() => handleAttractionClick("nave")}
                >
                  nave
                </motion.div>

                {/* Autoscontro */}
                <motion.div
                  className="absolute top-[56%] left-[57%] w-[13%] z-50 cursor-pointer text-transparent"
                  onClick={() => handleAttractionClick("autoscontro")}
                >
                  auto
                </motion.div>

                {/* Trenino del Parco */}
                <motion.div
                  className="absolute top-[50%] left-[42%] w-[25%] z-50 cursor-pointer text-transparent"
                  onClick={() => handleAttractionClick("trenino")}
                >
                  trenino
                </motion.div>

                {/* inizio Nuvole decorative - NON CLICCABILI */}
                <div className="absolute top-[0%] -left-[0%] w-[40%] z-45">
                  <DotLottieReact
                    src="https://lottie.host/01f968eb-3cd3-4a7b-8242-dd1f137d0581/xW7yQeMk3H.lottie"
                    loop
                    autoplay
                  />
                </div>
                <div className="absolute top-[5%] left-[57%] w-[40%] z-45">
                  <DotLottieReact
                    src="https://lottie.host/01f968eb-3cd3-4a7b-8242-dd1f137d0581/xW7yQeMk3H.lottie"
                    loop
                    autoplay
                  />
                </div>
                <div className="absolute -top-[5%] left-[47%] w-[40%] z-45">
                  <DotLottieReact
                    src="https://lottie.host/01f968eb-3cd3-4a7b-8242-dd1f137d0581/xW7yQeMk3H.lottie"
                    loop
                    autoplay
                  />
                </div>
                {/* fine Nuvole decorative - NON CLICCABILI */}

                {/* Food */}
                <motion.div
                  className="absolute top-[54%] left-[60%] w-[17%] z-50 cursor-pointer"
                  onClick={() => handleAttractionClick("food")}
                >
                  <DotLottieReact
                    src="https://lottie.host/6ea551ee-009d-40ad-b9ec-5e7a0230ebcb/z4rgLjIqXe.lottie"
                    loop
                    autoplay
                  />
                </motion.div>

                {/* Medical Station */}
                <motion.div
                  className="absolute top-[33%] left-[30%] w-[17%] z-50 cursor-pointer"
                  onClick={() => handleAttractionClick("medical")}
                >
                  <DotLottieReact
                    src="https://lottie.host/21171f4c-a9cb-4a98-8502-abaf5701313f/4xo70eceQU.lottie"
                    loop
                    autoplay
                  />
                </motion.div>

                {/* Info Point */}
                <motion.div
                  className="absolute top-[72%] left-[32%] w-[13%] z-50 cursor-pointer"
                  onClick={() => handleAttractionClick("infopoint")}
                >
                  <DotLottieReact
                    src="https://lottie.host/84f7bcf8-7ce4-41b5-9382-cf7becc0e15b/ln2QTevmq7.lottie"
                    loop
                    autoplay
                  />
                </motion.div>

                {/* Toilet*/}
                <div className="absolute top-[68%] left-[55%] w-[5%] z-50">
                  <motion.div
                    className="absolute top-[21%] left-[36%] w-[8%] h-[8%] z-50 cursor-pointer text-transparent"
                    onClick={() => handleAttractionClick("toilets")}
                  >
                    Toilet
                  </motion.div>
                  <img
                    src={toilets || "/placeholder.svg"}
                    alt="toilets"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Legenda Verticale */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-1 space-y-4"
          >
       

            {/* Info Utili */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <Info className="h-5 w-5 mr-2 text-lime-600" />
                Info Utili
              </h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-lime-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Clicca sulle attrazioni per vedere i dettagli</p>
                </div>
              </div>
            </div>

            {/* Tempi di Attesa */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <Clock className="h-5 w-5 mr-2 text-blue-600" />
                Tempi di Attesa
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Breve</span>
                  </div>
                  <span className="text-xs text-gray-500">0-10 min</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Medio</span>
                  </div>
                  <span className="text-xs text-gray-500">10-20 min</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Lungo</span>
                  </div>
                  <span className="text-xs text-gray-500">20+ min</span>
                </div>
              </div>
            </div>

            {/* Orari Parco */}
            <div className="bg-gradient-to-br from-lime-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-bold mb-4 flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Orari Oggi
              </h3>
              <div className="text-center">
                <div className="text-2xl font-bold">09:00 - 23:00</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Popup Attrazione */}
      <AnimatePresence>
        {selectedAttraction && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
            onClick={() => setSelectedAttraction(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header del popup */}
              <div
                className={`bg-gradient-to-r ${getCategoryColor(
                  selectedAttraction.category
                )} p-6 text-white relative`}
              >
                <button
                  onClick={() => setSelectedAttraction(null)}
                  className="absolute top-4 right-4 p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>

                <div className="flex items-start space-x-4">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-2">
                      {selectedAttraction.name}
                    </h2>
                    <div className="flex items-center space-x-4 text-white/90">
                      <span className="bg-white/20 px-2 py-1 rounded-full text-sm capitalize">
                        {selectedAttraction.category}
                      </span>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 mr-1 fill-current" />
                        <span>{selectedAttraction.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contenuto del popup */}
              <div className="p-6 space-y-6">
                {/* Descrizione */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Descrizione
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {selectedAttraction.description}
                  </p>
                </div>

                {/* Informazioni principali */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-5 w-5 text-lime-600" />
                      <div>
                        <p className="font-medium text-gray-800">Posizione</p>
                        <p className="text-sm text-gray-600">
                          {selectedAttraction.location}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Clock className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-800">Durata</p>
                        <p className="text-sm text-gray-600">
                          {selectedAttraction.duration}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Users className="h-5 w-5 text-purple-600" />
                      <div>
                        <p className="font-medium text-gray-800">Capacità</p>
                        <p className="text-sm text-gray-600">
                          {selectedAttraction.capacity}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">!</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          Età consigliata
                        </p>
                        <p className="text-sm text-gray-600">
                          {selectedAttraction.ageRecommendation}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                        <Clock className="h-3 w-3 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          Tempo di attesa
                        </p>
                        <span
                          className={`text-sm px-2 py-1 rounded-full font-medium ${getWaitTimeColor(
                            selectedAttraction.waitTime
                          )}`}
                        >
                          {selectedAttraction.waitTime === 0
                            ? "Nessuna attesa"
                            : `${selectedAttraction.waitTime} minuti`}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Consigli utili */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                    <Info className="h-5 w-5 mr-2 text-lime-600" />
                    Consigli Utili
                  </h3>
                  <div className="space-y-2">
                    {selectedAttraction.tips.map((tip, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-lime-500 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-sm text-gray-600">{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Mappa;
