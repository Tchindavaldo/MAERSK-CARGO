import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Ship,
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

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { settings } = useSiteSettings();

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="flex flex-col w-full z-50 transition-all duration-300">
      {/* Top Bar - Dark Navy */}
      <div className="bg-brand-dark text-gray-300 py-2 text-sm border-b border-white/10 hidden md:block">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <a href={`mailto:${settings.site_email || 'contact@jongleurmaersk.com'}`} className="flex items-center gap-2 hover:text-brand-accent transition cursor-pointer">
              <Mail size={14} className="text-brand-accent" />
              {settings.site_email || 'contact@jongleurmaersk.com'}
            </a>
            <a href={`tel:${settings.site_phone || '+1 234 567 8900'}`} className="flex items-center gap-2 hover:text-brand-accent transition cursor-pointer">
              <Phone size={14} className="text-brand-accent" />
              {settings.site_phone || '+1 234 567 8900'}
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

      {/* Main Navbar */}
      <header 
        className={`w-full transition-all duration-300 ${
          scrolled ? 'bg-white shadow-lg py-2' : 'bg-white shadow-sm py-4'
        } sticky top-0`}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className={`p-2 rounded-lg transition-colors duration-300 ${scrolled ? 'bg-brand-accent text-white' : 'bg-brand-dark text-white'}`}>
               <Ship size={32} />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight text-brand-dark leading-none">
                JONGLEUR
                <span className="text-brand-accent">MAERSK</span>
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

          {/* Right Action */}
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
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-brand-dark pt-24 px-6 lg:hidden animate-slide-in">
          <nav className="flex flex-col gap-6 text-xl font-medium text-white">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="border-b border-gray-700 pb-2">Home</Link>
            <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="border-b border-gray-700 pb-2">About</Link>
            <Link to="/services" onClick={() => setMobileMenuOpen(false)} className="border-b border-gray-700 pb-2">Services</Link>
            <Link to="/network" onClick={() => setMobileMenuOpen(false)} className="border-b border-gray-700 pb-2">Network</Link>
            <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="border-b border-gray-700 pb-2">Contact</Link>
            <Link 
              to="/track" 
              onClick={() => setMobileMenuOpen(false)}
              className="mt-4 bg-brand-accent text-white py-4 rounded-lg text-center font-bold shadow-lg"
            >
              Track & Trace
            </Link>
          </nav>
        </div>
      )}
    </div>
  );
}
