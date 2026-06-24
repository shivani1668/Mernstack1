import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Lock, Loader2, Eye, EyeOff } from "lucide-react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) return toast.error("Passwords do not match");
    if (password.length < 6) return toast.error("Password must be at least 6 characters");

    setIsLoading(true);
    try {
      await axiosInstance.post(`/auth/reset-password/${token}`, { password });
      toast.success("Password reset successfully!");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Link invalid or expired");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center p-6 sm:p-12">
      <div className="w-full max-w-md space-y-8 bg-base-100 p-8 rounded-2xl shadow-xl border border-base-300">
        <div className="text-center">
           <h1 className="text-2xl font-bold mt-2">Reset Password</h1>
           <p className="text-base-content/60">Enter your new password below</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-control">
            <label className="label"><span className="label-text font-medium">New Password</span></label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="size-5 text-base-content/40" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                className="input input-bordered w-full pl-10"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-control">
            <label className="label"><span className="label-text font-medium">Confirm New Password</span></label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="size-5 text-base-content/40" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                className="input input-bordered w-full pl-10"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-full" disabled={isLoading}>
            {isLoading ? <Loader2 className="size-5 animate-spin" /> : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};
export default ResetPasswordPage;
