import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  TrendingUp,
  AlertCircle,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  BarChart3,
  Shield,
  Zap,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth.jsx";

export const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    if (!formData.email || !formData.password) {
      setError("Please enter both email and password.");
      setIsLoading(false);
      return;
    }

    const result = await login(formData.email, formData.password);

    if (!result.success) {
      setError(result.error);
    } else {
      navigate("/dashboard");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex">
      {/* Left Column - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md border border-white/20">
          <div className="text-center mb-8">
            <TrendingUp className="mx-auto h-12 w-12 text-yellow-400 mb-4" />
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-gray-300">Sign in to your Cripto account</p>
          </div>

          <div className="space-y-6">
            {error && (
              <div className="bg-red-500/20 border border-red-500 rounded-lg p-3 flex items-center text-red-200">
                <AlertCircle className="h-5 w-5 mr-2" />
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white py-3 rounded-lg font-semibold hover:from-yellow-500 hover:to-orange-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </button>
            </form>
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-300">
              Don't have an account?{" "}
              <button
                onClick={() => navigate("/register")}
                className="text-yellow-400 hover:text-yellow-300 font-semibold"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Right Column - Promotional Content */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-lg">
          <div className="mb-8">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <BarChart3 className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">
              Track Your Crypto Portfolio
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Monitor real-time prices, analyze trends, and make informed investment decisions with Cripto's powerful dashboard.
            </p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-center text-gray-300">
              <Shield className="h-6 w-6 text-yellow-400 mr-3" />
              <span>Secure and encrypted data</span>
            </div>
            <div className="flex items-center text-gray-300">
              <Zap className="h-6 w-6 text-yellow-400 mr-3" />
              <span>Real-time market updates</span>
            </div>
            <div className="flex items-center text-gray-300">
              <BarChart3 className="h-6 w-6 text-yellow-400 mr-3" />
              <span>Advanced portfolio analytics</span>
            </div>
          </div>

          <button
            onClick={() => navigate("/dashboard")}
            className="inline-flex items-center px-8 py-4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg text-white font-semibold hover:bg-white/20 transition-all duration-200 group"
          >
            Explore Dashboard
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};