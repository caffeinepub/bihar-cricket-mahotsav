import { Link } from '@tanstack/react-router';
import { Heart } from 'lucide-react';

export default function Footer() {
  const handleLinkClick = () => {
    // Scroll to top immediately when footer link is clicked
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img
                src="/assets/generated/yka-logo-transparent.dim_150x150.png"
                alt="Yuva Khel Abhiyaan"
                className="h-12 w-12 object-contain"
              />
              <div>
                <h3 className="font-bold text-lg">Yuva Khel Abhiyaan</h3>
                <p className="text-xs opacity-90">Youth Sports Development</p>
              </div>
            </div>
            <p className="text-sm opacity-90">
              Empowering Bihar's cricket talent through professional tournaments and player development programs.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" onClick={handleLinkClick} className="hover:text-saffron transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" onClick={handleLinkClick} className="hover:text-saffron transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/player-registration" onClick={handleLinkClick} className="hover:text-saffron transition-colors">
                  Player Registration
                </Link>
              </li>
              <li>
                <Link to="/sponsorship" onClick={handleLinkClick} className="hover:text-saffron transition-colors">
                  Become a Sponsor
                </Link>
              </li>
              <li>
                <Link to="/contact" onClick={handleLinkClick} className="hover:text-saffron transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-lg mb-4">Contact</h3>
            <ul className="space-y-2 text-sm opacity-90">
              <li>Bihar, India</li>
              <li>Email: info@biharcricketmahotsav.com</li>
              <li>WhatsApp: Available via floating button</li>
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 pt-8 border-t border-primary-foreground/20">
          <p className="text-xs opacity-75 mb-4">
            <strong>Disclaimer:</strong> Bihar Cricket Mahotsav is organised by Yuva Khel Abhiyaan – a youth sports
            development initiative. This is not a government-owned event.
          </p>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <p className="opacity-90">© 2025 Bihar Cricket Mahotsav. All rights reserved.</p>
            <p className="flex items-center gap-1 opacity-90">
              Built with <Heart className="h-4 w-4 text-saffron fill-saffron" /> using{' '}
              <a
                href="https://caffeine.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-saffron transition-colors font-medium"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
