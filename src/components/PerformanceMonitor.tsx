import React, { useEffect, useRef, useState } from 'react';
import { toast } from '@/hooks/use-toast';

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage?: number;
  connectionType?: string;
}

interface Props {
  children: React.ReactNode;
  enableMonitoring?: boolean;
  warningThreshold?: number; // milliseconds
}

export const PerformanceMonitor: React.FC<Props> = ({ 
  children, 
  enableMonitoring = true,
  warningThreshold = 3000 // 3 seconds
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const startTimeRef = useRef<number>(performance.now());
  const renderStartRef = useRef<number>(performance.now());

  useEffect(() => {
    if (!enableMonitoring) return;

    const measurePerformance = () => {
      const now = performance.now();
      const loadTime = now - startTimeRef.current;
      const renderTime = now - renderStartRef.current;

      // Get memory usage if available
      let memoryUsage: number | undefined;
      if ('memory' in performance && (performance as any).memory) {
        memoryUsage = (performance as any).memory.usedJSHeapSize / 1024 / 1024; // MB
      }

      // Get connection type if available
      let connectionType: string | undefined;
      if ('connection' in navigator && (navigator as any).connection) {
        connectionType = (navigator as any).connection.effectiveType;
      }

      const newMetrics: PerformanceMetrics = {
        loadTime,
        renderTime,
        memoryUsage,
        connectionType
      };

      setMetrics(newMetrics);

      // Log performance in development
      if (process.env.NODE_ENV === 'development') {
        console.group('📈 Performance Metrics');
        console.log('🕰️ Load Time:', `${loadTime.toFixed(2)}ms`);
        console.log('🎨 Render Time:', `${renderTime.toFixed(2)}ms`);
        if (memoryUsage) {
          console.log('🧠 Memory Usage:', `${memoryUsage.toFixed(2)}MB`);
        }
        if (connectionType) {
          console.log('🌐 Connection:', connectionType);
        }
        console.groupEnd();
      }

      // Warn about slow performance
      if (loadTime > warningThreshold) {
        console.warn('⚠️ Slow page load detected:', `${loadTime.toFixed(2)}ms`);
        
        if (process.env.NODE_ENV === 'development') {
          toast({
            title: 'Performance Warning',
            description: `Slow page load: ${loadTime.toFixed(0)}ms`,
            variant: 'destructive',
          });
        }
      }

      // Send to analytics in production (example)
      if (process.env.NODE_ENV === 'production') {
        // Example: send to Google Analytics, Mixpanel, etc.
        // analytics.track('page_performance', newMetrics);
      }
    };

    // Measure on component mount
    const timer = setTimeout(measurePerformance, 100);

    // Measure on page load complete
    if (document.readyState === 'complete') {
      measurePerformance();
    } else {
      window.addEventListener('load', measurePerformance);
    }

    // Cleanup
    return () => {
      clearTimeout(timer);
      window.removeEventListener('load', measurePerformance);
    };
  }, [enableMonitoring, warningThreshold]);

  // Update render start time on each render
  useEffect(() => {
    renderStartRef.current = performance.now();
  });

  // Performance observer for additional metrics
  useEffect(() => {
    if (!enableMonitoring || !('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      
      entries.forEach((entry) => {
        if (process.env.NODE_ENV === 'development') {
          if (entry.entryType === 'measure') {
            console.log(`📏 ${entry.name}:`, `${entry.duration.toFixed(2)}ms`);
          } else if (entry.entryType === 'navigation') {
            const nav = entry as PerformanceNavigationTiming;
            console.log('🧠 Navigation Timing:', {
              domContentLoaded: nav.domContentLoadedEventEnd - nav.domContentLoadedEventStart,
              domComplete: nav.domComplete - nav.domLoading,
              loadComplete: nav.loadEventEnd - nav.loadEventStart,
            });
          }
        }
      });
    });

    try {
      observer.observe({ entryTypes: ['measure', 'navigation'] });
    } catch (e) {
      // Some browsers don't support all entry types
      console.warn('Performance Observer setup failed:', e);
    }

    return () => observer.disconnect();
  }, [enableMonitoring]);

  return (
    <>
      {children}
      {/* Development Performance HUD */}
      {process.env.NODE_ENV === 'development' && metrics && (
        <PerformanceHUD metrics={metrics} />
      )}
    </>
  );
};

// Development-only performance HUD
const PerformanceHUD: React.FC<{ metrics: PerformanceMetrics }> = ({ metrics }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-mono shadow-lg hover:bg-blue-700 transition-colors"
      >
        📈 Perf
      </button>
      
      {isVisible && (
        <div className="absolute bottom-12 right-0 bg-black/90 text-white p-4 rounded-lg shadow-xl font-mono text-sm min-w-[200px]">
          <div className="space-y-2">
            <div>🕰️ Load: {metrics.loadTime.toFixed(2)}ms</div>
            <div>🎨 Render: {metrics.renderTime.toFixed(2)}ms</div>
            {metrics.memoryUsage && (
              <div>🧠 Memory: {metrics.memoryUsage.toFixed(2)}MB</div>
            )}
            {metrics.connectionType && (
              <div>🌐 Network: {metrics.connectionType}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Hook for manual performance tracking
export const usePerformanceTracker = () => {
  const track = (name: string, fn: () => void | Promise<void>) => {
    const start = performance.now();
    
    performance.mark(`${name}-start`);
    
    const result = fn();
    
    if (result instanceof Promise) {
      return result.finally(() => {
        const end = performance.now();
        performance.mark(`${name}-end`);
        performance.measure(name, `${name}-start`, `${name}-end`);
        
        if (process.env.NODE_ENV === 'development') {
          console.log(`📏 ${name}:`, `${(end - start).toFixed(2)}ms`);
        }
      });
    } else {
      const end = performance.now();
      performance.mark(`${name}-end`);
      performance.measure(name, `${name}-start`, `${name}-end`);
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`📏 ${name}:`, `${(end - start).toFixed(2)}ms`);
      }
      
      return result;
    }
  };

  return { track };
};
