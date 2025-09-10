import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import Dashboard from "./app/dashboard/Dashboard";
import LoginPage from "./app/login/Login";
import SignupPage from "./app/signup/Signup";
import { ApiKeys } from "./app/api_keys/ApiKeys";
import { SidebarProvider } from "./components/ui/sidebar";
import { AppSidebar } from "./components/app-sidebar";
import { Health } from "./app/health/Health";
import { Analysis } from "./app/analysis/Analysis";
import { Identification } from "./app/identification/Identification";
import { Account } from "./app/account/Account";
import type { AuthState } from "./models/Authstate";
import { ForgotPassword } from "./app/login/ForgotPassword";
import { Landing } from "./app/landing/Landing";
import { Documentation } from "./app/landing/Documentation";
import { Terms } from "./app/legal/Terms";
import { Privacy } from "./app/legal/Privacy";
import { Security } from "./app/legal/Security";
import { Features } from "./app/landing/Features";
import { Contact } from "./app/landing/Contact";
import { BlogList } from "./app/blog/BlogList";
import { BlogPost } from "./app/blog/BlogPost";
import { useAuthStore } from "./store/useAuthStore";

function SidebarLayout() {
  return (
    <div className="flex h-screen w-full bg-gray-50">
      <AppSidebar className="h-full flex-shrink-0" collapsible="icon" />
      <main className="flex-1 flex flex-col overflow-y-auto bg-gray-50">
        <div className="p-4 flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

function NoSidebarLayout() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="w-full p-4">
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
    <BrowserRouter>
      <SidebarProvider>
        <Routes>
          {/* Public landing pages */}
          <Route path="/" element={<Landing />} />
          <Route path="/features" element={<Features />} />
          <Route path="/docs" element={<Documentation />} />
          <Route path="/contact" element={<Contact />} />


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
            </Route>
          </Route>

          {/* Blog routes */}
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
        </Routes>
      </SidebarProvider>
    </BrowserRouter>
  );
}

export default App;