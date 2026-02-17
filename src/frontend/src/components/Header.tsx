import { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { Menu, X, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import LoginButton from './LoginButton';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsCallerAdmin } from '../hooks/useQueries';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: isAdmin, isLoading: isAdminLoading } = useIsCallerAdmin();

  const isAuthenticated = !!identity;

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'How It Works', path: '/how-it-works' },
    { label: 'Register', path: '/player-registration' },
    { label: 'Auction & Teams', path: '/auction-teams' },
    { label: 'Prizes', path: '/prizes' },
    { label: 'Sponsorship', path: '/sponsorship' },
    { label: 'Contact', path: '/contact' },
  ];

  const adminNavItems = [
    { label: 'Admin Dashboard', path: '/admin' },
    { label: 'Player Management', path: '/admin/players' },
    { label: 'Sponsor Management', path: '/admin/sponsors' },
    { label: 'Team Management', path: '/admin/teams' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/assets/ChatGPT Image Jan 16, 2026, 02_12_48 AM.png"
              alt="Bihar Cricket Mahotsav"
              className="h-16 w-16 md:h-20 md:w-20 object-contain"
            />
            <div className="hidden md:block">
              <div className="text-lg font-bold text-primary">Bihar Cricket Mahotsav</div>
              <div className="text-xs text-muted-foreground">Gaon se Ground Tak</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="text-sm font-medium text-foreground/80 hover:text-saffron transition-colors"
                activeProps={{ className: 'text-saffron' }}
              >
                {item.label}
              </Link>
            ))}
            {isAuthenticated && isAdmin && !isAdminLoading && (
              <>
                <div className="h-4 w-px bg-border" />
                {adminNavItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="text-sm font-medium text-foreground/80 hover:text-saffron transition-colors flex items-center gap-1"
                    activeProps={{ className: 'text-saffron' }}
                  >
                    {item.label === 'Admin Dashboard' && <Shield className="h-3 w-3" />}
                    {item.label}
                  </Link>
                ))}
              </>
            )}
            <div className="flex items-center gap-2">
              <LoginButton />
              {isAuthenticated && isAdmin && !isAdminLoading && (
                <Badge variant="destructive" className="ml-2">
                  <Shield className="h-3 w-3 mr-1" />
                  Admin
                </Badge>
              )}
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="lg:hidden py-4 border-t">
            <div className="flex flex-col gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="text-sm font-medium text-foreground/80 hover:text-saffron transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              {isAuthenticated && isAdmin && !isAdminLoading && (
                <>
                  <div className="h-px bg-border my-2" />
                  <div className="flex items-center gap-2 py-2">
                    <Badge variant="destructive">
                      <Shield className="h-3 w-3 mr-1" />
                      Admin Access
                    </Badge>
                  </div>
                  {adminNavItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className="text-sm font-medium text-foreground/80 hover:text-saffron transition-colors py-2 flex items-center gap-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label === 'Admin Dashboard' && <Shield className="h-4 w-4" />}
                      {item.label}
                    </Link>
                  ))}
                </>
              )}
              <div className="pt-2 border-t">
                <LoginButton />
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
