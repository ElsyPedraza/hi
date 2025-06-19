import { motion } from "framer-motion";
import { useState } from "react";
import { Link, useNavigate} from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, Home } from "lucide-react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUser } from "@/contexts/UserProvider";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, { message: "Campo richiesto" }),
});

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const {
    watch,
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const email = watch("email");

  const { handleLogin } = useUser();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const error = await handleLogin(data);
    if (error) {
      setError("email", { type: "custom", message: "" });
      setError("password", { type: "custom", message: error });
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-[url('/images/park-background.jpg')] bg-cover bg-center flex items-center justify-center p-4 relative">
      {/* Overlay con sfumatura */}
      <div className="absolute inset-0 "></div>

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
        className="relative z-10 w-full max-w-md"
      >
        {/* Login Card con bordo animato */}
        <div className="relative">
          {/* Animated Border */}
          <div className="absolute -inset-1 rounded-2xl overflow-hidden">
            <div className="absolute inset-0">
              <div className="absolute h-[500%] w-[500%] animate-border-flow bg-gradient-to-r from-lime-400 via-yellow-400 to-red-500"></div>
            </div>
          </div>

          {/* Login Form */}
          <div className="relative bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
            <div className="text-center mb-8">
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
              <h1 className="text-3xl font-bold bg-gradient-to-r from-lime-600 to-green-600 bg-clip-text text-transparent">
                Benvenuto!
              </h1>
              <p className="text-gray-600 mt-2">Accedi al tuo account HI.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-lime-200 to-green-200 rounded-lg opacity-50 group-hover:opacity-100 transition-opacity blur-sm"></div>
                  <div className="relative bg-white rounded-lg">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-lime-600 w-5 h-5" />
                    <input
                      type="email"
                      {...register("email")}
                      className="w-full pl-10 pr-4 py-3 border border-lime-200 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent transition-all"
                      placeholder="inserisci la tua email"
                    />
                  </div>
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-lime-200 to-green-200 rounded-lg opacity-50 group-hover:opacity-100 transition-opacity blur-sm"></div>
                  <div className="relative bg-white rounded-lg">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-lime-600 w-5 h-5" />
                    <input
                      type={showPassword ? "text" : "password"}
                      {...register("password")}
                      className="w-full pl-10 pr-12 py-3 border border-lime-200 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent transition-all"
                      placeholder="inserisci la tua password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-lime-600"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-lime-300 text-lime-600 focus:ring-lime-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">Ricordami</span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-lime-600 hover:text-lime-800"
                >
                  Password dimenticata?
                </Link>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                className="w-full bg-gradient-to-r from-lime-500 to-green-600 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Accedi
              </motion.button>
            </form>

            {/* Sign Up Link */}
            <div className="text-center mt-6">
              <p className="text-gray-600">
                Non hai un account?{" "}
                <Link
                  to="/register"
                  className="text-lime-600 hover:text-lime-800 font-semibold"
                >
                  Registrati
                </Link>
              </p>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -z-10 top-10 right-10 w-20 h-20 bg-yellow-300 rounded-full opacity-20 blur-2xl"></div>
            <div className="absolute -z-10 bottom-10 left-10 w-20 h-20 bg-lime-300 rounded-full opacity-20 blur-2xl"></div>
          </div>
        </div>
      </motion.div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-40 h-40 bg-yellow-400 rounded-full -top-20 -left-20 opacity-10 blur-3xl"
          animate={{
            y: [0, 100, 0],
            x: [0, 50, 0],
          }}
          transition={{
            duration: 15,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute w-60 h-60 bg-lime-400 rounded-full -bottom-30 -right-30 opacity-10 blur-3xl"
          animate={{
            y: [0, -100, 0],
            x: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      </div>
    </div>
  );
}
