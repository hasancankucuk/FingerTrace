import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";

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

export interface TurnstileRef {
  reset: () => void;
  getToken: () => string | null;
}

interface TurnstileProps {
  siteKey?: string;
  onVerify?: (token: string) => void;
  onError?: (error: string) => void;
  onExpire?: () => void;
  theme?: 'light' | 'dark' | 'auto';
  size?: 'normal' | 'compact';
}

const DEFAULT_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY;

export const Turnstile = forwardRef<TurnstileRef, TurnstileProps>(({
  siteKey = DEFAULT_SITE_KEY,
  onVerify,
  onError,
  onExpire,
  theme = 'auto',
  size = 'normal'
}, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const handlersRef = useRef({ onVerify, onError, onExpire });


  useEffect(() => {
    handlersRef.current = { onVerify, onError, onExpire };
  }, [onVerify, onError, onExpire]);

  useImperativeHandle(ref, () => ({
    reset: () => widgetIdRef.current && window.turnstile?.reset(widgetIdRef.current),
    getToken: () => widgetIdRef.current && window.turnstile?.getResponse(widgetIdRef.current) || null
  }), []);

  useEffect(() => {
    let mounted = true;

    const init = () => {
      if (!mounted || !containerRef.current || !window.turnstile) return;
      try {
        if (widgetIdRef.current) window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          theme,
          size,
          callback: (t: string) => handlersRef.current.onVerify?.(t),
          'error-callback': (e: any) => handlersRef.current.onError?.(e),
          'expired-callback': () => handlersRef.current.onExpire?.(),
        });
      } catch (e) {
        console.error("Turnstile error:", e);
      }
    };

    if (!document.querySelector('script[src*="turnstile"]')) {
      const script = document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    const timer = setInterval(() => {
      if (window.turnstile) {
        clearInterval(timer);
        init();
      }
    }, 100);

    return () => {
      mounted = false;
      clearInterval(timer);
      if (widgetIdRef.current && window.turnstile) {
        try { window.turnstile.remove(widgetIdRef.current); } catch (e) { }
      }
    };
  }, [siteKey, theme, size]);

  return <div ref={containerRef} />;
});

Turnstile.displayName = 'Turnstile';

export function useTurnstile(options?: TurnstileProps) {
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const ref = useRef<TurnstileRef>(null);
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const reset = useCallback(() => {
    setToken(null);
    setError(null);
    ref.current?.reset();
  }, []);

  const BoundTurnstile = useCallback((props: Partial<TurnstileProps>) => (
    <Turnstile
      ref={ref}
      {...optionsRef.current}
      {...props}
      onVerify={(t) => {
        setToken(t);
        setError(null);
        optionsRef.current?.onVerify?.(t);
        props.onVerify?.(t);
      }}
      onError={(e) => {
        setToken(null);
        setError(e);
        optionsRef.current?.onError?.(e);
        props.onError?.(e);
      }}
      onExpire={() => {
        setToken(null);
        optionsRef.current?.onExpire?.();
        props.onExpire?.();
      }}
    />
  ), []);

  return {
    Turnstile: BoundTurnstile,
    token,
    verified: !!token,
    error,
    reset,
    ref
  };
}