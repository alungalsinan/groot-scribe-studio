import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { SupabaseAuthProvider } from "@/contexts/SupabaseAuthContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { PerformanceMonitor } from "@/components/PerformanceMonitor";
import { Suspense } from "react";
import { LoadingFallback } from "@/components/ui/loading-fallback";

// Import existing pages
import Index from "./pages/Index";
import ArticleDetail from "./pages/ArticleDetail";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

// Import new magazine pages
import Articles from "./pages/Articles";
import Issues from "./pages/Issues";
import IssueDetail from "./pages/IssueDetail";
import Categories from "./pages/Categories";
import CategoryDetail from "./pages/CategoryDetail";
import Authors from "./pages/Authors";
import AuthorDetail from "./pages/AuthorDetail";
import About from "./pages/About";
import Press from "./pages/Press";
import Contact from "./pages/Contact";
import Search from "./pages/Search";
import Newsletter from "./pages/Newsletter";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";

// Configure React Query with enhanced settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error: any) => {
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

// Enhanced App component with complete magazine routing
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
                  <Suspense fallback={<LoadingFallback variant="page" />}>
                    <Routes>
                      {/* Main Pages */}
                      <Route path="/" element={<Index />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/press" element={<Press />} />
                      <Route path="/newsletter" element={<Newsletter />} />
                      <Route path="/search" element={<Search />} />
                      
                      {/* Article Routes */}
                      <Route path="/articles" element={<Articles />} />
                      <Route path="/articles/:id" element={<ArticleDetail />} />
                      
                      {/* Magazine Issue Routes */}
                      <Route path="/issues" element={<Issues />} />
                      <Route path="/issues/:id" element={<IssueDetail />} />
                      
                      {/* Category Routes */}
                      <Route path="/categories" element={<Categories />} />
                      <Route path="/categories/:slug" element={<CategoryDetail />} />
                      
                      {/* Author Routes */}
                      <Route path="/authors" element={<Authors />} />
                      <Route path="/authors/:id" element={<AuthorDetail />} />
                      
                      {/* Admin Routes */}
                      <Route path="/admin/*" element={<Admin />} />
                      <Route path="/admin" element={<Admin />} />
                      
                      {/* Legal Pages */}
                      <Route path="/privacy" element={<PrivacyPolicy />} />
                      <Route path="/terms" element={<Terms />} />
                      
                      {/* 404 Catch-all */}
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
