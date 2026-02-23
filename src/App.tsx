import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { PublicRoute } from "./components/PublicRoute";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Games from "./pages/Games";
import Social from "./pages/Social";
import Auth from "./pages/Auth";
import MindQuestGame from "./pages/MindQuestGame";
import SPSGame from "./pages/SPSGame";
import SPSPvPGame from "./pages/SPSPvPGame";
import SPSPrivateRoom from "./pages/SPSPrivateRoom";
import AuthCallback from "./pages/AuthCallback";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <NotificationProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route 
                path="/" 
                element={
                  <PublicRoute>
                    <Index />
                  </PublicRoute>
                } 
              />
              <Route 
                path="/auth" 
                element={
                  <PublicRoute>
                    <Auth />
                  </PublicRoute>
                } 
              />
              <Route path="/auth/callback" element={<AuthCallback />} />
              
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/games"
                element={
                  <ProtectedRoute>
                    <Games />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/games/mind-quest"
                element={
                  <ProtectedRoute>
                    <MindQuestGame />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/games/sps"
                element={
                  <ProtectedRoute>
                    <SPSGame />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/games/sps-ai"
                element={
                  <ProtectedRoute>
                    <SPSGame />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/games/pvp"
                element={
                  <ProtectedRoute>
                    <SPSPvPGame />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/games/private"
                element={
                  <ProtectedRoute>
                    <SPSPrivateRoom />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/social"
                element={
                  <ProtectedRoute>
                    <Social />
                  </ProtectedRoute>
                }
              />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </NotificationProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
