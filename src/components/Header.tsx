import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Phone,
  Mail,
  Menu,
  X,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Search,
  ChevronRight
} from 'lucide-react';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { getSiteName } from '../utils/siteConfig';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { settings } = useSiteSettings();
  const siteName = getSiteName();

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fermer le menu mobile lors du changement de route
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      {/* Top Bar - Dark Navy */}
      <div className="bg-brand-dark text-gray-300 py-2 text-sm border-b border-white/10 hidden md:block">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <a href={`mailto:${settings.site_email || 'contact@maerskaircargo.com'}`} className="flex items-center gap-2 hover:text-brand-accent transition cursor-pointer">
              <Mail size={14} className="text-brand-accent" />
              {settings.site_email || 'contact@maerskaircargo.com'}
            </a>
            <a href={`tel:${settings.site_phone || '+1 639 526 1121'}`} className="flex items-center gap-2 hover:text-brand-accent transition cursor-pointer">
              <Phone size={14} className="text-brand-accent" />
              {settings.site_phone || '+1 639 526 1121'}
            </a>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 pr-4 border-r border-gray-700">
               <a href="#" className="hover:text-brand-accent transition"><Facebook size={16} /></a>
               <a href="#" className="hover:text-brand-accent transition"><Twitter size={16} /></a>
               <a href="#" className="hover:text-brand-accent transition"><Linkedin size={16} /></a>
               <a href="#" className="hover:text-brand-accent transition"><Instagram size={16} /></a>
            </div>
            <Link to="/login" className="hover:text-white font-medium transition flex items-center gap-1">
              Client Login <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar - Sticky */}
      <header 
        className={`w-full transition-all duration-300 sticky top-0 z-50 ${
          scrolled ? 'bg-white shadow-lg py-2' : 'bg-white shadow-sm py-4'
        }`}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className={`transition-all duration-300 ${scrolled ? 'h-12' : 'h-14'}`}>
               <img 
                 src="/logo.png" 
                 alt={siteName} 
                 className="h-full w-auto object-contain"
               />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight text-brand-dark leading-none">
                {siteName}
              </span>
              <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                Global Logistics
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8 font-medium text-brand-primary">
            {['Home', 'About', 'Services', 'Network', 'Contact'].map((item) => {
              const path = item === 'Home' ? '/' : `/${item.toLowerCase()}`;
              return (
                <Link
                  key={item}
                  to={path}
                  className={`relative py-2 hover:text-brand-accent transition-colors ${
                    isActive(path) ? 'text-brand-accent font-bold' : ''
                  }`}
                >
                  {item}
                  {isActive(path) && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-accent rounded-full animate-slide-in" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <button className="p-2 text-gray-500 hover:text-brand-accent transition">
              <Search size={20} />
            </button>
            <Link 
              to="/track"
              className="bg-brand-dark text-white px-6 py-2.5 rounded-full font-bold text-sm tracking-wide hover:bg-brand-accent transition-all duration-300 shadow-lg hover:shadow-brand-accent/30 flex items-center gap-2"
            >
              TRACK CARGO
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button 
            className="lg:hidden text-brand-dark p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-brand-dark pt-24 px-6 lg:hidden animate-slide-in">
          <nav className="flex flex-col gap-6 text-xl font-medium text-white">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="border-b border-gray-700 pb-2 hover:text-brand-accent transition">Home</Link>
            <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="border-b border-gray-700 pb-2 hover:text-brand-accent transition">About</Link>
            <Link to="/services" onClick={() => setMobileMenuOpen(false)} className="border-b border-gray-700 pb-2 hover:text-brand-accent transition">Services</Link>
            <Link to="/network" onClick={() => setMobileMenuOpen(false)} className="border-b border-gray-700 pb-2 hover:text-brand-accent transition">Network</Link>
            <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="border-b border-gray-700 pb-2 hover:text-brand-accent transition">Contact</Link>
            <Link 
              to="/track" 
              onClick={() => setMobileMenuOpen(false)}
              className="mt-4 bg-brand-accent text-white py-4 rounded-lg text-center font-bold shadow-lg hover:bg-brand-secondary transition"
            >
              Track & Trace
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}
