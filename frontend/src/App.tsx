import { SimpleChatBot } from "@/components/ChatBot/SimpleChatBot";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SearchIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import {
  Account,
  Analysis,
  ApiKeys,
  BlogList,
  BlogPost,
  Contact,
  Dashboard,
  Documentation,
  Features,
  ForgotPassword,
  Health,
  Identification,
  Landing,
  LoginPage,
  Privacy,
  Search,
  Security,
  SignupPage,
  Terms
} from "./app/index";
import { AppSidebar } from "./components/app-sidebar";
import { LanguageToggle } from "./components/language-toggle";
import { ModeToggle } from "./components/mode-toggle";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./components/ui/input-group";
import { Kbd } from "./components/ui/kbd";
import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar";
import type { AuthState } from "./models/Authstate";
import { useAuthStore } from "./store/useAuthStore";

const queryClient = new QueryClient();

function SidebarLayout() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      searchInputRef.current?.blur();
    }
  };

  return (
    <div className="flex h-screen w-full bg-background text-foreground transition-all duration-300">
      <AppSidebar className="h-full border-r shrink-0" collapsible="icon" />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="flex h-14 items-center justify-between border-b px-4 shrink-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <div className="h-4 w-px bg-border hidden sm:block" />
          </div>
          <div className="flex items-center gap-4">
            <InputGroup className="w-64 transition-all duration-300 focus-within:w-80">
              <InputGroupInput
                ref={searchInputRef}
                placeholder={t("common.search")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
              />
              <InputGroupAddon>
                <SearchIcon />
              </InputGroupAddon>
              <InputGroupAddon align="inline-end">
                <Kbd>⌘</Kbd>
                <Kbd>K</Kbd>
              </InputGroupAddon>
            </InputGroup>
          </div>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <ModeToggle />
          </div>
        </header>
        <main className="flex-1 overflow-y-auto bg-slate-50/30 dark:bg-zinc-950/30">
          <div className="p-4 md:p-6 lg:p-8 mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

function NoSidebarLayout() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background text-foreground transition-colors duration-300">
      <div className="w-full max-w-md p-6">
        <Outlet />
      </div>
    </div>
  );
}

function PrivateRoute() {
  const isAuth = useAuthStore((s: AuthState) => Boolean(s.token));
  return isAuth ? <Outlet /> : <Navigate to="/login" replace />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="fingertrace-theme">
        <BrowserRouter>
          <SidebarProvider>
            <Routes>
              {/* Public landing pages */}
              <Route path="/" element={<Landing />} />
              <Route path="/features" element={<Features />} />
              <Route path="/docs" element={<Documentation />} />
              <Route path="/contact" element={<Contact />} />


              {/* Blog routes */}
              <Route path="/blog" element={<BlogList />} />
              <Route path="/blog/:slug" element={<BlogPost />} />

              {/* Legal pages */}
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/security" element={<Security />} />
              <Route path="/status" element={<Health />} />


              {/* Pages without sidebar */}
              <Route element={<NoSidebarLayout />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
              </Route>

              {/* Protected pages with sidebar */}
              <Route element={<PrivateRoute />}>
                <Route element={<SidebarLayout />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/api-keys" element={<ApiKeys />} />
                  <Route path="/analysis" element={<Analysis />} />
                  <Route path="/identification" element={<Identification />} />
                  <Route path="/account" element={<Account />} />
                  <Route path="/search" element={<Search />} />
                </Route>
              </Route>

            </Routes>
          </SidebarProvider>
        </BrowserRouter>
        <SimpleChatBot />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;