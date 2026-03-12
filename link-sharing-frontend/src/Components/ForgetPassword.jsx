import { Mail, ArrowLeft, Send } from "lucide-react";
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

const MotionDiv = motion.div;
const MotionButton = motion.button;

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Logic for sending reset link
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSent(true);
    } catch (err) {
      // Error handling
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-auth-shell min-h-screen px-4 py-12 relative overflow-hidden bg-[var(--saas-bg-main)]">
      {/* Cinematic Background Elements */}
      <div className="absolute inset-0 z-0">
         <div className="absolute top-[-10%] left-[10%] w-[40%] h-[40%] bg-[var(--saas-accent-primary)] opacity-10 blur-[120px] rounded-full" />
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full" />
      </div>

      <MotionDiv
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-[440px] mx-auto"
      >
        <div className="flex flex-col items-center mb-10">
          <Link to="/" className="flex h-12 w-12 items-center justify-center rounded-[1.25rem] bg-[var(--saas-accent-gradient)] font-black text-white text-xl shadow-[0_0_30px_var(--saas-accent-glow)] transition-transform hover:scale-110">
            LH
          </Link>
          <h1 className="mt-8 text-3xl font-black tracking-tight text-[var(--saas-text-primary)] font-display">
            {sent ? "Check your inbox." : "Recovery needed?"}
          </h1>
          <p className="mt-2 text-center text-[14px] font-medium text-[var(--saas-text-secondary)] max-w-xs">
            {sent 
              ? `We've sent a secure recovery link to ${email}`
              : "Enter your email and we'll help you establish access."
            }
          </p>
        </div>

        <div className="app-auth-panel rounded-[2.5rem] p-8 md:p-10 border border-[var(--saas-border)] bg-[var(--saas-bg-surface)] shadow-2xl backdrop-blur-3xl relative">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          
          {!sent ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-[var(--saas-text-secondary)] mb-2.5 px-1">
                  Target Account
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-[var(--saas-text-secondary)] group-focus-within:text-[var(--saas-accent-primary)] transition-colors">
                     <Mail className="w-4.5 h-4.5" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full bg-[var(--saas-bg-elevated)] border border-[var(--saas-border)] focus:border-[var(--saas-accent-primary)] focus:ring-4 focus:ring-[var(--saas-accent-glow)]/10 rounded-2xl py-4 pl-12 pr-4 text-sm font-semibold text-[var(--saas-text-primary)] transition-all outline-none placeholder:text-[var(--saas-text-secondary)]/30"
                  />
                </div>
              </div>

              <MotionButton
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full flex items-center justify-center gap-2 rounded-2xl py-4 text-sm font-black uppercase tracking-widest text-black bg-[var(--saas-accent-gradient)] shadow-lg shadow-[var(--saas-accent-glow)] hover:brightness-110 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                ) : (
                  <>
                    Send Reset Key
                    <Send className="w-4 h-4 ml-1" />
                  </>
                )}
              </MotionButton>
            </form>
          ) : (
            <div className="text-center py-4">
               <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--saas-accent-glow)]/10 text-[var(--saas-accent-primary)] mb-6">
                  <Mail className="w-8 h-8" />
               </div>
               <p className="text-sm text-[var(--saas-text-secondary)] leading-relaxed mb-8">
                 Didn't receive the email? Check your spam folder or try another address.
               </p>
               <button 
                 onClick={() => setSent(false)}
                 className="text-[11px] font-black uppercase tracking-widest text-[var(--saas-accent-primary)] hover:underline"
               >
                 Resend Link
               </button>
            </div>
          )}

          <div className="mt-8 pt-8 border-t border-[var(--saas-border)]">
              <Link 
                to="/login" 
                className="flex items-center justify-center gap-2 text-[var(--saas-text-secondary)] hover:text-[var(--saas-text-primary)] text-sm font-bold transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Authentication
              </Link>
          </div>
        </div>
      </MotionDiv>
    </div>
  );
};

export default ForgotPassword;
