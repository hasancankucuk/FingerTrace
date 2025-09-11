import { useEffect, useRef, forwardRef, useImperativeHandle, useCallback } from "react";

export interface TurnstileRef {
  getToken: () => string | null;
  reset: () => void;
}

interface TurnstileProps {
  siteKey: string;
  onVerify?: (token: string) => void;
  onError?: (error: string) => void;
  onExpire?: () => void;
  theme?: 'light' | 'dark' | 'auto';
  size?: 'normal' | 'compact';
}

export const Turnstile = forwardRef<TurnstileRef, TurnstileProps>(({
  siteKey,
  onVerify,
  onError,
  onExpire,
  theme = 'auto',
  size = 'normal'
}, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const isLoadingRef = useRef(false);
  const isRenderedRef = useRef(false);

  const stableOnVerify = useCallback((token: string) => {
    onVerify?.(token);
  }, [onVerify]);

  const stableOnError = useCallback((error: string) => {
    onError?.(error);
  }, [onError]);

  const stableOnExpire = useCallback(() => {
    onExpire?.();
  }, [onExpire]);

  useImperativeHandle(ref, () => ({
    getToken: () => {
      if (typeof window !== 'undefined' && window.turnstile && widgetIdRef.current) {
        return window.turnstile.getResponse(widgetIdRef.current);
      }
      return null;
    },
    reset: () => {
      if (typeof window !== 'undefined' && window.turnstile && widgetIdRef.current) {
        window.turnstile.reset(widgetIdRef.current);
      }
    }
  }), []);

  const initializeTurnstile = useCallback(() => {
    if (!containerRef.current || 
        !siteKey || 
        typeof window === 'undefined' || 
        !window.turnstile ||
        isRenderedRef.current) {
      return;
    }

    try {
      if (widgetIdRef.current) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }

      containerRef.current.innerHTML = '';

      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        theme,
        size,
        callback: stableOnVerify,
        'error-callback': stableOnError,
        'expired-callback': stableOnExpire,
      });

      isRenderedRef.current = true;
      console.log('Turnstile widget rendered:', widgetIdRef.current);

    } catch (error) {
      console.error('Turnstile initialization error:', error);
      stableOnError('Initialization failed');
    }
  }, [siteKey, theme, size, stableOnVerify, stableOnError, stableOnExpire]);

  const loadTurnstileScript = useCallback(() => {
    if (isLoadingRef.current) return;
    
    if (typeof window !== 'undefined' && window.turnstile) {
      initializeTurnstile();
      return;
    }

    if (document.querySelector('script[src*="turnstile"]')) {
      const checkTurnstile = () => {
        if (window.turnstile) {
          initializeTurnstile();
        } else {
          setTimeout(checkTurnstile, 100);
        }
      };
      checkTurnstile();
      return;
    }

    isLoadingRef.current = true;

    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      isLoadingRef.current = false;
      // Script yüklendi ama API hazır olmayabilir
      const waitForTurnstile = () => {
        if (window.turnstile) {
          initializeTurnstile();
        } else {
          setTimeout(waitForTurnstile, 100);
        }
      };
      waitForTurnstile();
    };

    script.onerror = () => {
      isLoadingRef.current = false;
      console.error('Failed to load Turnstile script');
      stableOnError('Failed to load CAPTCHA');
    };

    document.head.appendChild(script);
  }, [initializeTurnstile, stableOnError]);

  useEffect(() => {
    if (!siteKey) {
      console.error('Turnstile site key is required');
      return;
    }

    const timer = setTimeout(() => {
      loadTurnstileScript();
    }, 100);

    return () => {
      clearTimeout(timer);
      if (widgetIdRef.current && typeof window !== 'undefined' && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch (error) {
          console.error('Error removing Turnstile widget:', error);
        }
      }
      isRenderedRef.current = false;
    };
  }, []); // Sadece mount/unmount'da çalışsın

  // Site key değişirse widget'i yeniden render et
  useEffect(() => {
    if (isRenderedRef.current && siteKey) {
      isRenderedRef.current = false;
      initializeTurnstile();
    }
  }, [siteKey, initializeTurnstile]);

  return (
    <div className="turnstile-container">
      <div ref={containerRef} className="cf-turnstile" />
    </div>
  );
});

Turnstile.displayName = 'Turnstile';

// Global type declaration
declare global {
  interface Window {
    turnstile: {
      render: (container: HTMLElement, options: any) => string;
      getResponse: (widgetId: string) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}