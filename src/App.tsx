import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import Chatbot from "./components/Chatbot";
import Index from "./pages/Index";
import Companies from "./pages/Companies";
import Properties from "./pages/Properties";
import Collections from "./pages/Collections";
import Requests from "./pages/Requests";
import Admin from "./pages/Admin";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import CustomerServices from "./pages/CustomerServices";
import TrackOrder from "./pages/TrackOrder";
import NotFound from "./pages/NotFound";
import CustomerOrdersAdmin from "./pages/CustomerOrdersAdmin";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<CustomerServices />} />
          <Route path="/track-order" element={<TrackOrder />} />
          <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<ProtectedRoute requiredRole="super-admin"><Index /></ProtectedRoute>} />
            <Route path="/companies" element={<ProtectedRoute requiredRole="super-admin"><Companies /></ProtectedRoute>} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/requests" element={<ProtectedRoute requiredRole="super-admin"><Requests /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute requiredRole="super-admin"><Admin /></ProtectedRoute>} />
            <Route path="/reports" element={<ProtectedRoute requiredRole="super-admin"><Reports /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute requiredRole="super-admin"><Settings /></ProtectedRoute>} />
            <Route path="/customer-orders" element={<CustomerOrdersAdmin />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <Chatbot />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
