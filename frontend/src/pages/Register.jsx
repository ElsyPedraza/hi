

import { motion } from "framer-motion"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Eye, EyeOff, Mail, Lock, User, Home, Calendar } from "lucide-react"
import { DotLottieReact } from "@lottiefiles/dotlottie-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAxios } from "@/contexts/AxiosProvider"

const registerSchema = z
  .object({
    firstName: z.string().min(1, "Il nome è obbligatorio"),
    lastName: z.string().min(1, "Il cognome è obbligatorio"),
    email: z.string().email("Email non valida"),
    birthdate: z.string().min(1, "La data di nascita è obbligatoria"),
    password: z.string().min(6, "Almeno 6 caratteri"),
    passwordConfirmation: z.string().min(1, "Conferma la password"),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Le password non coincidono",
    path: ["passwordConfirmation"],
  })

export default function Register() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: zodResolver(registerSchema),
  })

  const navigate = useNavigate()
  const myaxios = useAxios()

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      console.log("Dati da inviare:", data)
      const result = await myaxios.post("/auth/register", {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        passwordConfirmation: data.passwordConfirmation,
        birthdate: new Date(data.birthdate).toISOString().split("T")[0],
      })

      console.log("Registrazione completata:", result.data)
      navigate("/login")
    } catch (error) {
      console.error("Errore registrazione:", error)

      const message = error.response?.data?.message || "Errore imprevisto"

      // Mostra l'errore sul campo email
      setError("email", {
        type: "custom",
        message: message,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-900/70 via-green-800/60 to-yellow-800/70 flex items-center justify-center p-4 relative">
      {/* Home Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.3 }}
        className="absolute top-6 left-6 z-50"
      >
        <Link to="/">
          <motion.div
            className="bg-white/90 backdrop-blur-md p-3 rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-all duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Home className="w-6 h-6 text-lime-600" />
            <span className="sr-only">Torna alla Home</span>
          </motion.div>
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md my-8"
      >
        {/* Register Card con bordo animato */}
        <div className="relative">
          {/* Animated Border */}
          <div className="absolute -inset-1 rounded-2xl overflow-hidden">
            <div className="absolute inset-0">
              <div className="absolute h-[500%] w-[500%] animate-border-flow bg-gradient-to-r from-lime-400 via-yellow-400 to-red-500"></div>
            </div>
          </div>

          {/* Register Form */}
          <div className="relative bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
            <div className="text-center mb-6">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
                className="w-20 h-20 bg-gradient-to-br from-lime-500 to-green-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg"
              >
                <DotLottieReact
                  className="w-40 object-contain"
                  src="https://lottie.host/05f465cf-b6ea-417c-b500-022704fb26ad/sHJhkuzs9C.lottie"
                  loop
                  autoplay
                />
              </motion.div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-lime-600 to-green-600 bg-clip-text text-transparent">
                Crea un Account
              </h1>
              <p className="text-gray-600 mt-1 text-sm">Unisciti alla famiglia EnjoyPark</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* First Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-lime-200 to-green-200 rounded-lg opacity-50 group-hover:opacity-100 transition-opacity blur-sm"></div>
                  <div className="relative bg-white rounded-lg">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-lime-600 w-5 h-5" />
                    <input
                      type="text"
                      {...register("firstName")}
                      className="w-full pl-10 pr-4 py-2.5 border border-lime-200 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent transition-all"
                      placeholder="Mario"
                    />
                  </div>
                </div>
                {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>}
              </div>

              {/* Last Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cognome</label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-lime-200 to-green-200 rounded-lg opacity-50 group-hover:opacity-100 transition-opacity blur-sm"></div>
                  <div className="relative bg-white rounded-lg">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-lime-600 w-5 h-5" />
                    <input
                      type="text"
                      {...register("lastName")}
                      className="w-full pl-10 pr-4 py-2.5 border border-lime-200 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent transition-all"
                      placeholder="Rossi"
                    />
                  </div>
                </div>
                {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>}
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-lime-200 to-green-200 rounded-lg opacity-50 group-hover:opacity-100 transition-opacity blur-sm"></div>
                  <div className="relative bg-white rounded-lg">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-lime-600 w-5 h-5" />
                    <input
                      type="email"
                      {...register("email")}
                      placeholder="email@example.com"
                      className="w-full pl-10 pr-4 py-2.5 border border-lime-200 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
              </div>

              {/* Birthdate Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data di Nascita</label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-lime-200 to-green-200 rounded-lg opacity-50 group-hover:opacity-100 transition-opacity blur-sm"></div>
                  <div className="relative bg-white rounded-lg">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-lime-600 w-5 h-5" />
                    <input
                      type="date"
                      {...register("birthdate")}
                      className="w-full pl-10 pr-4 py-2.5 border border-lime-200 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
                {errors.birthdate && <p className="text-red-500 text-sm mt-1">{errors.birthdate.message}</p>}
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-lime-200 to-green-200 rounded-lg opacity-50 group-hover:opacity-100 transition-opacity blur-sm"></div>
                  <div className="relative bg-white rounded-lg">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-lime-600 w-5 h-5" />
                    <input
                      type={showPassword ? "text" : "password"}
                      {...register("password")}
                      className="w-full pl-10 pr-12 py-2.5 border border-lime-200 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent transition-all"
                      placeholder="Crea una password sicura"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-lime-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Conferma Password</label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-lime-200 to-green-200 rounded-lg opacity-50 group-hover:opacity-100 transition-opacity blur-sm"></div>
                  <div className="relative bg-white rounded-lg">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-lime-600 w-5 h-5" />
                    <input
                      type={showPassword ? "text" : "password"}
                      {...register("passwordConfirmation")}
                      className="w-full pl-10 pr-12 py-2.5 border border-lime-200 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent transition-all"
                      placeholder="Ripeti la password"
                    />
                  </div>
                </div>
                {errors.passwordConfirmation && (
                  <p className="text-red-500 text-sm mt-1">{errors.passwordConfirmation.message}</p>
                )}
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    type="checkbox"
                    className="w-4 h-4 rounded border-lime-300 text-lime-600 focus:ring-lime-500"
                    required
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="terms" className="text-gray-600">
                    Accetto i{" "}
                    <a href="#" className="text-lime-600 hover:text-lime-800 font-medium">
                      Termini e Condizioni
                    </a>{" "}
                    e la{" "}
                    <a href="#" className="text-lime-600 hover:text-lime-800 font-medium">
                      Privacy Policy
                    </a>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-lime-500 to-green-600 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all mt-6 disabled:opacity-50"
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
              >
                {isLoading ? "Registrazione..." : "Registrati"}
              </motion.button>
            </form>

            {/* Login Link */}
            <div className="text-center mt-6">
              <p className="text-gray-600">
                Hai già un account?{" "}
                <Link to="/login" className="text-lime-600 hover:text-lime-800 font-semibold">
                  Accedi
                </Link>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
