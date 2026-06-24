import { useState } from "react";
import { Mail, MessageSquare, Loader2, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axiosInstance.post("/auth/forgot-password", { email });
      toast.success("Reset link sent to your email!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center p-6 sm:p-12">
      <div className="w-full max-w-md space-y-8 bg-base-100 p-8 rounded-2xl shadow-xl border border-base-300">
        <div className="text-center">
          <div className="flex flex-col items-center gap-2 group">
            <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center transition-colors">
              <MessageSquare className="size-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold mt-2">Forgot Password?</h1>
            <p className="text-base-content/60">Enter your email to receive a reset link</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Email Address</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="size-5 text-base-content/40" />
              </div>
              <input
                type="email"
                className="input input-bordered w-full pl-10"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-full" disabled={isLoading}>
            {isLoading ? <Loader2 className="size-5 animate-spin" /> : "Send Reset Link"}
          </button>
        </form>

        <div className="text-center">
          <Link to="/login" className="link link-primary flex items-center justify-center gap-2 text-sm">
            <ArrowLeft size={16} /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};
export default ForgotPasswordPage;
