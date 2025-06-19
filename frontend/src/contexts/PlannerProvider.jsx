import { useAxios } from "@/contexts/AxiosProvider";
import { createContext, useState } from "react";


export const PlannerContext = createContext();

export const PlannerProvider = ({ children }) => {
  const [plan, setPlan] = useState([]);
  const axios = useAxios(); 

   const fetchPlanner = async () => {
    try {
      const res = await axios.get("/planner");
      setPlan(res.data);
    } catch (err) {
      console.error("Errore nel fetch planner:", err);
    }
  };
 const addToPlanner = async (item) => {
    try {
      await axios.post("/planner/add", item);
      fetchPlanner();
    } catch (err) {
      console.error("Errore nell'aggiunta al planner:", err);
    }
  };

    const getPlannerByDate = async (date) => {
    try {
      const res = await axios.get(`/planner/${date}`);
      return res.data;
    } catch (err) {
      if (err.response?.status === 404) return null;
      console.error("Errore nel getPlannerByDate:", err);
      throw err;
    }
  };

const removeFromPlanner = async (itemId) => {
  try {
    await axios.delete(`/planner/item/${itemId}`);

    // Aggiorna localmente
    setPlan((prev) => {
      return prev
        .map((p) => ({
          ...p,
          items: p.items.filter((item) => item.id !== itemId),
        }))
        .filter((p) => p.items.length > 0); // Rimuove planner vuoti dallo stato
    });

    // Opzionale: fetch aggiornato (se vuoi sincronizzare)
    fetchPlanner();

  } catch (err) {
    console.error("Errore nella DELETE:", err);
    throw err;
  }
};


  return (
    <PlannerContext.Provider value={{ plan, fetchPlanner, addToPlanner,getPlannerByDate, removeFromPlanner }}>
      {children}
    </PlannerContext.Provider>
  );
};
