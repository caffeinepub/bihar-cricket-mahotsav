// Import process.env polyfill FIRST to ensure II_URL is available
import './polyfills/processEnv';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createRouter, createRootRoute, createRoute } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import HowItWorksPage from './pages/HowItWorksPage';
import PlayerRegistrationPage from './pages/PlayerRegistrationPage';
import AuctionTeamsPage from './pages/AuctionTeamsPage';
import TeamsDetailPage from './pages/TeamsDetailPage';
import PrizesPage from './pages/PrizesPage';
import SponsorshipPage from './pages/SponsorshipPage';
import ContactPage from './pages/ContactPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import PaymentCancelPage from './pages/PaymentCancelPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminPlayersPage from './pages/AdminPlayersPage';
import AdminSponsorsPage from './pages/AdminSponsorsPage';
import AdminTeamsPage from './pages/AdminTeamsPage';
import Layout from './components/Layout';

const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: AboutPage,
});

const howItWorksRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/how-it-works',
  component: HowItWorksPage,
});

const playerRegistrationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/player-registration',
  component: PlayerRegistrationPage,
});

const auctionTeamsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/auction-teams',
  component: AuctionTeamsPage,
});

const teamsDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/teams',
  component: TeamsDetailPage,
});

const prizesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/prizes',
  component: PrizesPage,
});

const sponsorshipRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/sponsorship',
  component: SponsorshipPage,
});

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/contact',
  component: ContactPage,
});

const paymentSuccessRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/payment-success',
  component: PaymentSuccessPage,
});

const paymentCancelRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/payment-cancel',
  component: PaymentCancelPage,
});

const adminLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/login',
  component: AdminLoginPage,
});

const adminDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminDashboardPage,
});

const adminPlayersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/players',
  component: AdminPlayersPage,
});

const adminSponsorsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/sponsors',
  component: AdminSponsorsPage,
});

const adminTeamsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/teams',
  component: AdminTeamsPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  aboutRoute,
  howItWorksRoute,
  playerRegistrationRoute,
  auctionTeamsRoute,
  teamsDetailRoute,
  prizesRoute,
  sponsorshipRoute,
  contactRoute,
  paymentSuccessRoute,
  paymentCancelRoute,
  adminLoginRoute,
  adminDashboardRoute,
  adminPlayersRoute,
  adminSponsorsRoute,
  adminTeamsRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}
