import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";

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
  }));

  useEffect(() => {
    const loadTurnstile = () => {
      if (document.querySelector('script[src*="turnstile"]')) {
        initializeTurnstile();
        return;
      }

      const script = document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
      script.async = true;
      script.onload = initializeTurnstile;
      document.head.appendChild(script);
    };

    const initializeTurnstile = () => {
      if (!containerRef.current || typeof window === 'undefined' || !window.turnstile) {
        return;
      }

      if (widgetIdRef.current) {
        window.turnstile.remove(widgetIdRef.current);
      }

      // Yeni widget render et
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        theme,
        size,
        callback: (token: string) => {
          onVerify?.(token);
        },
        'error-callback': (error: string) => {
          onError?.(error);
        },
        'expired-callback': () => {
          onExpire?.();
        },
      });
    };

    loadTurnstile();

    return () => {
      if (widgetIdRef.current && typeof window !== 'undefined' && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
      }
    };
  }, [siteKey, theme, size, onVerify, onError, onExpire]);

  return <div ref={containerRef} className="cf-turnstile-container" />;
});

Turnstile.displayName = 'Turnstile';

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