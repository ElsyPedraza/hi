import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  User,
  Camera,
  Mail,
  Calendar,
  Lock,
  Shield,
  Trash2,
  Save,
  Eye,
  EyeOff,
  X,
  Check,
  MapPin,
  Phone,
} from "lucide-react";
import { useUser } from "@/contexts/UserProvider";
import { useAxios } from "@/contexts/AxiosProvider";

export default function Profile() {
  const { user, handleLogout, handleUpdateUser } = useUser();
  const [formKey, setFormKey] = useState(Date.now());

  const axios = useAxios();
  const fileInputRef = useRef(null);
  const currentPasswordRef = useRef(null);


  // Stati per i form
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    birthdate: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: true,
    marketingEmails: false,
    dataSharing: false,
  });

  // Stati UI
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Carica dati utente
  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        birthdate: user.birthdate ? user.birthdate.split("T")[0] : "",
      });

      setAvatarPreview(user.avatar || null);
    }
  }, [user]);

  useEffect(() => {
  if (activeTab === "security") {
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    // pulizia visiva extra
    if (currentPasswordRef.current) {
      currentPasswordRef.current.value = "";
    }
  }
}, [activeTab]);


  // Genera avatar di default basato sulle iniziali
  const getDefaultAvatar = () => {
    if (!user) return "U";
    const initials = `${user.firstName?.[0] || ""}${
      user.lastName?.[0] || ""
    }`.toUpperCase();
    return initials || user.email?.[0]?.toUpperCase() || "U";
  };

  // Gestione upload avatar
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setMessage({
          type: "error",
          text: "L'immagine deve essere inferiore a 5MB",
        });
        return;
      }

      setAvatar(file);
      const reader = new FileReader();
      reader.onload = (e) => setAvatarPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  // Salva profilo
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();

      // Aggiungi dati profilo
      Object.keys(profileData).forEach((key) => {
        formData.append(key, profileData[key]);
      });

      // Aggiungi avatar se presente
      if (avatar) {
        formData.append("avatar", avatar);
      }

      const response = await axios.put("/auth/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage({ type: "success", text: "Profilo aggiornato con successo!" });

      setAvatarPreview(response.data.user.avatar || null);
      handleUpdateUser(response.data.user);
    } catch (error) {
      console.error("Errore nel salvataggio profilo:", error);
      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Errore nell'aggiornamento del profilo",
      });
    } finally {
      setLoading(false);
    }
  };

  // Cambia password
  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: "error", text: "Le nuove password non coincidono" });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({
        type: "error",
        text: "La password deve essere di almeno 6 caratteri",
      });
      return;
    }

    setLoading(true);

    try {
      await axios.put("/auth/change-password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      setMessage({ type: "success", text: "Password cambiata con successo!" });
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      if (currentPasswordRef.current) {
  currentPasswordRef.current.value = "";
}
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Errore nel cambio password",
      });
    } finally {
      setLoading(false);
    }
  };

  // Elimina account
  const handleDeleteAccount = async () => {
    if (
      !confirm(
        "Sei sicuro di voler eliminare il tuo account? Questa azione è irreversibile."
      )
    ) {
      return;
    }

    const confirmation = prompt("Scrivi 'ELIMINA' per confermare:");
    if (confirmation !== "ELIMINA") {
      return;
    }

    try {
      await axios.delete("/auth/account");
      handleLogout();
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Errore nell'eliminazione dell'account",
      });
    }
  };

  const tabs = [
    { id: "profile", label: "Profilo", icon: User },
    { id: "security", label: "Sicurezza", icon: Shield },
  ];

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-lime-50 to-green-50 py-8">
        <div className="container mx-auto px-4">
          <div
            title="Il Mio Profilo"
            description="Gestisci le tue informazioni personali e le impostazioni dell'account"
          />

          {/* Message Alert */}
          {message.text && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-lg flex items-center justify-between ${
                message.type === "success"
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}
            >
              <div className="flex items-center">
                {message.type === "success" ? (
                  <Check className="h-5 w-5 mr-2" />
                ) : (
                  <X className="h-5 w-5 mr-2" />
                )}
                {message.text}
              </div>
              <button
                onClick={() => setMessage({ type: "", text: "" })}
                className="text-current hover:opacity-70"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          )}

          <div className="grid lg:grid-cols-4 gap-6">
            {/* Sidebar Tabs */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <nav className="space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                          activeTab === tab.id
                            ? "bg-lime-50 text-lime-700 border border-lime-200"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                        }`}
                      >
                        <Icon className="h-4 w-4 mr-3" />
                        {tab.label}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                {/* Profile Tab */}
                {activeTab === "profile" && (
                  <div className="p-6">
                    <div className="flex items-center mb-6">
                      <User className="h-6 w-6 text-lime-600 mr-3" />
                      <h2 className="text-xl font-semibold text-gray-900">
                        Informazioni Profilo
                      </h2>
                    </div>

                    <form onSubmit={handleSaveProfile} className="space-y-6">
                      {/* Avatar Section */}
                      <div className="flex items-center space-x-6">
                        <div className="relative">
                          {avatarPreview ? (
                            <img
                              src={
                                avatarPreview.startsWith("data:")
                                  ? avatarPreview // anteprima da FileReader
                                  : import.meta.env.VITE_BACKEND_URL +
                                    user.avatar
                              }
                              alt="Avatar"
                              className="h-24 w-24 rounded-full object-cover border-4 border-white shadow-lg"
                            />
                          ) : (
                            <div className="h-24 w-24 rounded-full bg-gradient-to-r from-lime-500 to-green-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                              {getDefaultAvatar()}
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute -bottom-2 -right-2 bg-lime-500 text-white p-2 rounded-full hover:bg-lime-600 transition-colors shadow-lg"
                          >
                            <Camera className="h-4 w-4" />
                          </button>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className="hidden"
                          />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            Foto Profilo
                          </h3>
                          <p className="text-sm text-gray-500">
                            Clicca sull'icona della fotocamera per cambiare la
                            tua foto profilo. Formati supportati: JPG, PNG (max
                            5MB)
                          </p>
                        </div>
                      </div>

                      {/* Personal Info */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nome
                          </label>
                          <input
                            type="text"
                            value={profileData.firstName}
                            disabled
                            onChange={(e) =>
                              setProfileData({
                                ...profileData,
                                firstName: e.target.value,
                              })
                            }
                            className="w-full bg-gray-100 cursor-not-allowed px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Cognome
                          </label>
                          <input
                            type="text"
                            value={profileData.lastName}
                            disabled
                            onChange={(e) =>
                              setProfileData({
                                ...profileData,
                                lastName: e.target.value,
                              })
                            }
                            className="w-full bg-gray-100 cursor-not-allowed px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                          <input
                            type="email"
                            value={profileData.email}
                            disabled
                            onChange={(e) =>
                              setProfileData({
                                ...profileData,
                                email: e.target.value,
                              })
                            }
                            className="w-full bg-gray-100 cursor-not-allowed pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Telefono
                          </label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <input
                              type="tel"
                              value={profileData.phone}
                              onChange={(e) =>
                                setProfileData({
                                  ...profileData,
                                  phone: e.target.value,
                                })
                              }
                              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Data di Nascita
                          </label>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <input
                              type="date"
                              value={profileData.birthdate}
                              disabled
                              onChange={(e) =>
                                setProfileData({
                                  ...profileData,
                                  birthdate: e.target.value,
                                })
                              }
                              className="w-full bg-gray-100 cursor-not-allowed  pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={loading}
                          className="bg-lime-500 text-white px-6 py-2 rounded-lg hover:bg-lime-600 transition-colors disabled:opacity-50 flex items-center"
                        >
                          {loading ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          ) : (
                            <Save className="h-4 w-4 mr-2" />
                          )}
                          Salva Modifiche
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Security Tab */}
                {activeTab === "security" && (
                  <div className="p-6">
                    <div className="flex items-center mb-6">
                      <Shield className="h-6 w-6 text-lime-600 mr-3" />
                      <h2 className="text-xl font-semibold text-gray-900">
                        Sicurezza Account
                      </h2>
                    </div>

                    <form
                      key={
                        loading
                          ? "loading"
                          : message.text === "Password cambiata con successo!"
                          ? "reset"
                          : "form"
                      }
                      onSubmit={handleChangePassword}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Password Attuale
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                          <input
                          ref={currentPasswordRef}
                            type={showPasswords.current ? "text" : "password"}
                            value={passwordData.currentPassword}
                            onChange={(e) =>
                              setPasswordData({
                                ...passwordData,
                                currentPassword: e.target.value,
                              })
                            }
                            className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                            required
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowPasswords({
                                ...showPasswords,
                                current: !showPasswords.current,
                              })
                            }
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPasswords.current ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nuova Password
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                          <input
                            type={showPasswords.new ? "text" : "password"}
                            value={passwordData.newPassword}
                            onChange={(e) =>
                              setPasswordData({
                                ...passwordData,
                                newPassword: e.target.value,
                              })
                            }
                            className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                            required
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowPasswords({
                                ...showPasswords,
                                new: !showPasswords.new,
                              })
                            }
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPasswords.new ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Conferma Nuova Password
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                          <input
                            type={showPasswords.confirm ? "text" : "password"}
                            value={passwordData.confirmPassword}
                            onChange={(e) =>
                              setPasswordData({
                                ...passwordData,
                                confirmPassword: e.target.value,
                              })
                            }
                            className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                            required
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowPasswords({
                                ...showPasswords,
                                confirm: !showPasswords.confirm,
                              })
                            }
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPasswords.confirm ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-blue-800 mb-2">
                          Requisiti Password:
                        </h4>
                        <ul className="text-sm text-blue-700 space-y-1">
                          <li>• Almeno 6 caratteri</li>
                          <li>• Consigliato: lettere maiuscole e minuscole</li>
                          <li>• Consigliato: almeno un numero</li>
                          <li>• Consigliato: almeno un carattere speciale</li>
                        </ul>
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={loading}
                          className="bg-lime-500 text-white px-6 py-2 rounded-lg hover:bg-lime-600 transition-colors disabled:opacity-50 flex items-center"
                        >
                          {loading ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          ) : (
                            <Lock className="h-4 w-4 mr-2" />
                          )}
                          Cambia Password
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
