import { Link } from 'react-router-dom';
import { Ship, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { useSiteSettings } from '../hooks/useSiteSettings';

export default function Footer() {
  const { settings } = useSiteSettings();

  return (
    <footer className="bg-brand-dark text-white pt-20 pb-10 border-t border-white/5">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-brand-accent rounded-lg text-white">
                <Ship size={24} />
              </div>
              <span className="text-2xl font-black tracking-tight leading-none">
                JONGLEUR
                <span className="text-brand-accent">MAERSK</span>
              </span>
            </div>
            <p className="text-gray-400 leading-relaxed text-sm">
              We provide global logistics solutions that drive your business forward. Reliable, efficient, and secure shipping from China to the world.
            </p>
            <div className="flex gap-4 pt-2">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-brand-accent hover:text-white transition-all duration-300 text-gray-400">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-6 border-b border-brand-accent/30 inline-block pb-2">Quick Links</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li><Link to="/about" className="hover:text-brand-accent transition-colors flex items-center gap-2">About Us</Link></li>
              <li><Link to="/services" className="hover:text-brand-accent transition-colors flex items-center gap-2">Our Services</Link></li>
              <li><Link to="/track" className="hover:text-brand-accent transition-colors flex items-center gap-2">Track Shipment</Link></li>
              <li><Link to="/careers" className="hover:text-brand-accent transition-colors flex items-center gap-2">Careers</Link></li>
              <li><Link to="/news" className="hover:text-brand-accent transition-colors flex items-center gap-2">Latest News</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-bold text-lg mb-6 border-b border-brand-accent/30 inline-block pb-2">Logistics Services</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              {['Ocean Freight', 'Air Freight', 'Road Transport', 'Warehousing', 'Customs Brokerage', 'Supply Chain'].map((s) => (
                <li key={s}>
                  <Link to="/services" className="hover:text-brand-accent transition-colors">{s}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-bold text-lg mb-6 border-b border-brand-accent/30 inline-block pb-2">Contact Us</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="text-brand-accent mt-1 flex-shrink-0" size={18} />
                <span>{settings.site_address || '123 Logistics Way, Shanghai, China'}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="text-brand-accent flex-shrink-0" size={18} />
                <span>{settings.site_phone || '+1 234 567 8900'}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="text-brand-accent flex-shrink-0" size={18} />
                <span>{settings.site_email || 'info@jongleurmaersk.com'}</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 gap-4">
          <p>&copy; {new Date().getFullYear()} Jongleur Maersk. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-white transition">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition">Terms of Service</Link>
            <Link to="/sitemap" className="hover:text-white transition">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
