import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAppStore } from '@/store/useAppStore';
import Navbar from '@/components/Navbar';
import Index from "./pages/Index";
import Detect from "./pages/Detect";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ThemeInit = () => {
  const isDark = useAppStore((s) => s.isDark);
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ThemeInit />
        <Navbar />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/detect" element={<Detect />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
