import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import AnimatedBackground from "@/components/AnimatedBackground";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { authService } from "../services";
import { 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  Eye, 
  EyeOff,
  Loader2,
  Gift
} from "lucide-react";
import pantherImg from "@/assets/panther-character.png";
import owlImg from "@/assets/owl-character.png";
import snakeImg from "@/assets/snake-character.png";
import { toast } from "sonner";

const Auth = () => {
  const navigate = useNavigate();
  const { setSession, user: currentUser } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isResetPassword, setIsResetPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    otp: ["", "", "", "", "", ""],
    interests: [] as string[],
    character: "owl"
  });

  const characters = [
    { id: "owl", name: "Wise Owl", image: owlImg, emoji: "🦉", description: "Master of wisdom and riddles." },
    { id: "panther", name: "Shadow Panther", image: pantherImg, emoji: "🐆", description: "Fast, agile, and fiercely competitive." },
    { id: "snake", name: "Venom Snake", image: snakeImg, emoji: "🐍", description: "Cunning, strategic, and unpredictable." }
  ];

  const [signupStep, setSignupStep] = useState<'info' | 'interests' | 'character'>('info');

  const interestsList = ['Gaming', 'Movies', 'Music', 'Tech', 'Science', 'Travel', 'Food', 'Art'];

  useEffect(() => {
    if (currentUser) {
      navigate("/dashboard");
    }
  }, [currentUser, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...formData.otp];
    newOtp[index] = value;
    setFormData({ ...formData, otp: newOtp });
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Enter") {
      if (isResetPassword) {
        handleResetPassword(e as any);
      } else {
        handleVerifyOtp();
      }
    } else if (e.key === "Backspace" && !formData.otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const toggleInterest = (interest: string) => {
    const currentInterests = formData.interests || [];
    const newInterests = currentInterests.includes(interest) 
        ? currentInterests.filter(i => i !== interest)
        : [...currentInterests, interest];
    setFormData({...formData, interests: newInterests});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        const response = await authService.login({
            email: formData.email,
            password: formData.password
        });
        
        if (response.requiresOtp) {
          toast.success("Login verification code sent! Check your email.");
          setShowOTP(true);
        } else {
          setSession(response.user, response.access_token);
          toast.success("Welcome back to the Jungle!");
          navigate("/dashboard");
        }
      } else {
        if (signupStep === 'info') {
            setSignupStep('interests');
            setIsLoading(false);
            return;
        }
        if (signupStep === 'interests') {
            setSignupStep('character');
            setIsLoading(false);
            return;
        }

        await authService.signup({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            interests: formData.interests,
            avatar: formData.character // Sending character as avatar
        });
        toast.success("Verification code sent! Check your email.");
        setShowOTP(true);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong in the jungle...");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const otpString = formData.otp.join("");
    if (otpString.length < 6) {
      toast.error("Please enter the complete 6-digit code");
      return;
    }

    setIsLoading(true);
    try {
      if (isLogin) {
        const response = await authService.verifyLoginOtp({
          email: formData.email,
          otp: otpString
        });
        setSession(response.user, response.access_token);
        toast.success("Identity verified! Welcome explorer.");
        navigate("/dashboard");
      } else {
        await authService.verifyOtp({
          email: formData.email,
          otp: otpString
        });
        toast.success("Email verified! You can now enter the jungle.");
        setIsLogin(true);
        setShowOTP(false);
      }
      setIsResetPassword(false); // Just in case
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Invalid Code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
        await authService.forgotPassword(formData.email);
        toast.success("Reset code sent to your email");
        setIsForgotPassword(false);
        setIsResetPassword(true);
    } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to send reset code");
    } finally {
        setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = formData.otp.join("");
    if (otpString.length < 6) {
        toast.error("Please enter the complete 6-digit code");
        return;
    }
    setIsLoading(true);
    try {
        await authService.resetPassword({
            email: formData.email,
            otp: otpString,
            newPassword: formData.password
        });
        toast.success("Password reset! Please login.");
        setIsResetPassword(false);
        setFormData(prev => ({ ...prev, password: '', otp: ["", "", "", "", "", ""] }));
        setIsLogin(true);
    } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to reset password");
    } finally {
        setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: 'google' | 'github') => {
      window.location.href = `http://localhost:3003/auth/${provider}`;
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      <AnimatedBackground />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-3 mb-8">
          <span className="text-4xl">🌿</span>
          <span className="font-display text-2xl gradient-text">
            Mind Quest
          </span>
        </Link>

        <div className="glass-card p-8">
          {/* Step Indicator */}
          {!isLogin && !showOTP && !isForgotPassword && !isResetPassword && (
            <div className="flex justify-between mb-8 px-4">
              {[
                { step: 'info', icon: '👤' },
                { step: 'interests', icon: '🎯' },
                { step: 'character', icon: '🐾' }
              ].map((s, i) => (
                <div key={s.step} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all duration-300 ${
                    signupStep === s.step 
                      ? "bg-primary text-primary-foreground scale-110 shadow-lg shadow-primary/20" 
                      : (
                        (signupStep === 'interests' && s.step === 'info') || 
                        (signupStep === 'character' && (s.step === 'info' || s.step === 'interests'))
                          ? "bg-primary/20 text-primary"
                          : "bg-muted/30 text-muted-foreground opacity-50"
                      )
                  }`}>
                    {s.icon}
                  </div>
                  {i < 2 && (
                    <div className={`w-full h-0.5 min-w-[30px] mx-2 ${
                        (signupStep === 'interests' && i === 0) || 
                        (signupStep === 'character')
                          ? "bg-primary/30"
                          : "bg-border/30"
                    }`} />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Character mascot */}
          <div className="flex justify-center mb-4">
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary/30"
            >
              <img src={pantherImg} alt="Panther Guide" className="w-full h-full object-cover" />
            </motion.div>
          </div>

          {/* Tab Switcher */}
          {!showOTP && !isForgotPassword && !isResetPassword && (
            <div className="flex gap-2 mb-8 p-1 bg-muted/50 rounded-xl">
              <button
                onClick={() => { setIsLogin(true); }}
                className={`flex-1 py-3 rounded-lg font-bold transition-all duration-300 ${
                  isLogin
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                🔑 Login
              </button>
              <button
                onClick={() => { setIsLogin(false); }}
                className={`flex-1 py-3 rounded-lg font-bold transition-all duration-300 ${
                  !isLogin
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                🐾 Sign Up
              </button>
            </div>
          )}

          {/* Forms */}
          {isResetPassword ? (
             <form onSubmit={handleResetPassword}>
                <div className="text-center mb-6">
                    <h3 className="font-display text-xl font-semibold mb-2">Reset Password</h3>
                    <p className="text-muted-foreground text-sm">
                        Enter the code sent to {formData.email} and your new password.
                    </p>
                </div>
                
                <div className="flex gap-2 justify-center mb-6">
                    {formData.otp.map((digit, i) => (
                    <input
                        key={i}
                        id={`otp-${i}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, i)}
                        className="w-12 h-14 text-center text-xl font-bold input-glass"
                    />
                    ))}
                </div>

                <div className="relative mb-6">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="New Password"
                    className="input-glass w-full pl-12 pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="btn-jungle w-full flex items-center justify-center gap-2"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Reset Password"}
                </button>
                
                 <button 
                    type="button"
                    onClick={() => { setIsResetPassword(false); setIsForgotPassword(true); }}
                    className="w-full mt-4 text-sm text-muted-foreground hover:text-foreground"
                >
                    Back
                </button>
             </form>
          ) : isForgotPassword ? (
              <form onSubmit={handleForgotPassword}>
                <div className="text-center mb-6">
                    <h3 className="font-display text-xl font-semibold mb-2">Forgot Password?</h3>
                    <p className="text-muted-foreground text-sm">
                        Enter your email address and we'll send you a code to reset your password.
                    </p>
                </div>

                <div className="relative mb-6">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email Address"
                    className="input-glass w-full pl-12"
                    required
                    />
                </div>

                 <button 
                  type="submit" 
                  disabled={isLoading}
                  className="btn-jungle w-full flex items-center justify-center gap-2"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send Reset Code"}
                </button>

                <button 
                    type="button"
                    onClick={() => setIsForgotPassword(false)}
                    className="w-full mt-4 text-sm text-muted-foreground hover:text-foreground"
                >
                    Back to Login
                </button>
              </form>
          ) : !showOTP ? (
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                {!isLogin && signupStep === 'info' && (
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your Jungle Name"
                      className="input-glass w-full pl-12"
                      required
                    />
                  </div>
                )}

                {!isLogin && signupStep === 'interests' && (
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-muted-foreground">🎯 Your Interests</label>
                        <div className="flex flex-wrap gap-2">
                            {interestsList.map(interest => (
                                <button
                                    key={interest}
                                    type="button"
                                    onClick={() => toggleInterest(interest)}
                                    className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                                        (formData.interests || []).includes(interest)
                                            ? "bg-primary text-primary-foreground border-primary shadow-lg scale-105"
                                            : "bg-muted/20 border-white/10 hover:bg-muted/40"
                                    }`}
                                >
                                    {interest}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {!isLogin && signupStep === 'character' && (
                    <div className="space-y-4">
                        <label className="text-sm font-bold text-muted-foreground block text-center">🐾 Choose Your Character</label>
                        <div className="grid grid-cols-1 gap-3">
                            {characters.map(char => (
                                <button
                                    key={char.id}
                                    type="button"
                                    onClick={() => setFormData({...formData, character: char.id})}
                                    className={`flex items-center gap-4 p-3 rounded-xl border transition-all text-left ${
                                        formData.character === char.id
                                            ? "bg-primary/20 border-primary shadow-lg ring-1 ring-primary/50"
                                            : "bg-muted/20 border-white/10 hover:bg-muted/40 opacity-70"
                                    }`}
                                >
                                    <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-primary/20 flex-shrink-0">
                                        <img src={char.image} alt={char.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <p className="font-bold flex items-center gap-2">
                                            {char.emoji} {char.name}
                                        </p>
                                        <p className="text-xs text-muted-foreground">{char.description}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {!isLogin && signupStep !== 'info' && (
                  <div className="p-3 rounded-xl bg-muted/20 border border-white/5 mb-4">
                    <p className="text-xs text-muted-foreground flex items-center gap-2">
                       <span className="text-primary">👤</span> {formData.name} • {formData.email}
                    </p>
                  </div>
                )}

                {(isLogin || signupStep === 'info') && (
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Email Address"
                      className="input-glass w-full pl-12"
                      required
                    />
                  </div>
                )}

                {(isLogin || signupStep === 'info') && (
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Secret Passphrase"
                      className="input-glass w-full pl-12 pr-12"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                )}

                {isLogin && (
                  <div className="text-right">
                    <button 
                        type="button" 
                        onClick={() => setIsForgotPassword(true)}
                        className="text-sm text-primary hover:underline"
                    >
                      Forgot passphrase?
                    </button>
                  </div>
                )}

                {!isLogin && signupStep === 'character' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 p-4 rounded-xl bg-secondary/10 border border-secondary/20"
                  >
                      <p className="text-sm text-muted-foreground">Get 200 coins free on signup</p>
                  </motion.div>
                )}

                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="btn-jungle w-full flex items-center justify-center gap-2 text-lg"
                >
                   {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      {isLogin ? "🔓 Enter the Jungle" : (
                          signupStep === 'character' ? "🌿 Join the Pack" : "Next ✨"
                      )}
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
                
                {!isLogin && signupStep !== 'info' && (
                    <button
                        type="button"
                        onClick={() => {
                            if (signupStep === 'character') setSignupStep('interests');
                            else if (signupStep === 'interests') setSignupStep('info');
                        }}
                        className="w-full text-sm text-muted-foreground hover:text-foreground"
                    >
                        Go Back
                    </button>
                )}
              </div>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="text-5xl mb-4">🦉</div>
              <h3 className="font-display text-xl mb-2">Verify Your Identity</h3>
              <p className="text-muted-foreground text-sm mb-6">
                Wise Owl sent a 6-digit code to {formData.email}
              </p>

              <div className="flex gap-2 justify-center mb-6">
                {formData.otp.map((digit, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, i)}
                    className="w-12 h-14 text-center text-xl font-bold input-glass"
                  />
                ))}
              </div>

              <button 
                onClick={handleVerifyOtp}
                disabled={isLoading}
                className="btn-jungle w-full mb-4 text-lg"
              >
                 {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "✅ Verify & Enter"}
              </button>

              <button 
                onClick={() => setShowOTP(false)}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                ← Back to {isLogin ? "login" : "signup"}
              </button>
            </motion.div>
          )}

          {!showOTP && !isForgotPassword && !isResetPassword && (
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 text-sm text-muted-foreground bg-card">
                  or continue with
                </span>
              </div>
            </div>
          )}

          {!showOTP && !isForgotPassword && !isResetPassword && (
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => handleSocialLogin('google')}
                className="flex items-center justify-center gap-2 py-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors font-bold"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </button>
              <button 
                onClick={() => handleSocialLogin('github')}
                className="flex items-center justify-center gap-2 py-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors font-bold"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub
              </button>
            </div>
          )}

          <div className="text-center mt-6">
            <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              ← Back to Jungle
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
