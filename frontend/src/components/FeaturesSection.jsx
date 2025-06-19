import { motion } from "framer-motion";
import { Waves, Zap, Users, Star, MapPin, Calendar } from "lucide-react";
import AnimatedCard from "./AnimatedCard";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAxios } from "@/contexts/AxiosProvider";

import { useUser } from "@/contexts/UserProvider";

export default function FeaturesSection() {
  const [features, setFeatures] = useState([]);
  const axios = useAxios();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [attractionsRes, showsRes] = await Promise.all([
          axios.get("/attractions"),
          axios.get("/shows?date=all"),
        ]);

        const attractionFeatures = attractionsRes.data.slice(0, 3).map((a) => ({
          title: a.name,
          description: a.description,
          image: a.image,
          gradient: "from-lime-500 to-green-500",
          type: "attraction",
        }));

        const showFeatures = showsRes.data.slice(0, 3).map((s) => ({
          title: s.name,
          description: s.description,
          image: s.image,
          gradient: "from-purple-500 to-pink-500",
          type: "show",
        }));

        setFeatures([...attractionFeatures, ...showFeatures]);
      } catch (err) {
        console.error("Errore caricamento features:", err);
      }
    };

    fetchData();
  }, [axios]);

  return (
    <section className="py-20 bg-blue-50">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-lime-600 to-green-600 bg-clip-text text-transparent">
              Perché Scegliere
            </span>
            <br />
            <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
              HI.?
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Scopri cosa rende il nostro parco un'esperienza unica e
            indimenticabile
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <AnimatedCard
              key={feature.title}
              title={feature.title}
              description={feature.description}
              image={feature.image}
              gradient={feature.gradient}
              delay={index * 0.1}
              onClick={() =>
                feature.type === "attraction"
                  ? navigate("/attractions")
                  : navigate("/shows")
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}
