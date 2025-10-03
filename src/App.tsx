import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { SupabaseAuthProvider } from "@/contexts/SupabaseAuthContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { PerformanceMonitor } from "@/components/PerformanceMonitor";
import Index from "./pages/Index";
import ArticleDetail from "./pages/ArticleDetail";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import { Suspense } from "react";
import { LoadingFallback } from "@/components/ui/loading-fallback";

// Configure React Query with enhanced settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors, but retry on network errors
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

// Enhanced App component with error boundaries and performance monitoring
const App = () => {
  return (
    <ErrorBoundary>
      <PerformanceMonitor>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider defaultTheme="system" storageKey="groot-ui-theme">
            <SupabaseAuthProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner 
                  position="top-right"
                  expand={true}
                  richColors
                  closeButton
                />
                <BrowserRouter
                  future={{
                    v7_startTransition: true,
                    v7_relativeSplatPath: true,
                  }}
                >
                  <Suspense fallback={<LoadingFallback />}>
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/articles/:id" element={<ArticleDetail />} />
                      <Route path="/admin/*" element={<Admin />} />
                      <Route path="/admin" element={<Admin />} />
                      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
                </BrowserRouter>
              </TooltipProvider>
            </SupabaseAuthProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </PerformanceMonitor>
    </ErrorBoundary>
  );
};

export default App;
