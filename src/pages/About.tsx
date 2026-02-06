import { Shield, CloudRain, Clock, Globe, Users, Trophy, ChevronRight } from 'lucide-react';
import SEO from '../components/SEO';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CounterAnimation from '../components/CounterAnimation';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-brand-dark">
      <SEO 
        title="About Us - Jongleur Maersk | Global Logistics Leader"
        description="Discover Jongleur Maersk, your trusted partner for international transport. Over 60 years of experience in global logistics."
        keywords="about jongleur maersk, international transport, logistics experience, shipping partner"
        canonical="https://jongleurmaersk.com/about"
      />
      <Header />

      {/* Hero Section */}
      <section className="relative bg-brand-dark text-white py-32 overflow-hidden">
        <div className="absolute top-0 right-0 w-2/3 h-full bg-brand-secondary/10 -skew-x-12 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-1/3 h-full bg-brand-accent/5 skew-x-12 -translate-x-1/4 pointer-events-none" />
        
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0 opacity-20">
           <img 
             src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=2070" 
             alt="Logistics Operations" 
             className="w-full h-full object-cover"
           />
           <div className="absolute inset-0 bg-gradient-to-r from-brand-dark via-brand-dark/95 to-brand-dark/40" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full mb-6 border border-white/10">
              <span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse" />
              <p className="text-sm font-medium text-blue-50">Since 1963</p>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Pioneering <span className="text-brand-accent">Global</span><br />Logistics
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl leading-relaxed">
              For over six decades, we've been the bridge connecting businesses to the world. 
              Efficiency, security, and reliability are the pillars of our legacy.
            </p>
            <div className="flex items-center gap-3 text-sm font-medium text-gray-400">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight size={14} />
              <span className="text-brand-accent">About Us</span>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-brand-accent/10 rounded-full blur-3xl" />
              <img 
                src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070" 
                alt="Our Mission" 
                className="rounded-2xl shadow-2xl relative z-10" 
              />
              <div className="absolute -bottom-10 -right-10 bg-brand-accent text-white p-8 rounded-xl shadow-xl z-20 max-w-xs hidden md:block">
                <p className="text-4xl font-bold mb-2">100%</p>
                <p className="text-sm font-medium opacity-90">Commitment to safe and timely delivery.</p>
              </div>
            </div>
            
            <div>
              <h2 className="text-brand-accent font-bold tracking-widest uppercase mb-3 text-sm">Who We Are</h2>
              <h3 className="text-4xl font-bold text-brand-dark mb-6">Excellence in Every Shipment</h3>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Jongleur Maersk isn't just a logistics company; we are your strategic partner in growth. 
                With a footprint in over 200 countries, we leverage cutting-edge technology and a vast 
                network to simplify complex supply chains.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                Our mission is to provide seamless, transparent, and efficient transport solutions that 
                empower businesses to scale without borders.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {[
                   { icon: <Shield className="text-brand-accent" size={32} />, title: "Secure Cargo", desc: "Full insurance coverage" },
                   { icon: <CloudRain className="text-brand-accent" size={32} />, title: "Weather Proof", desc: "Climate controlled logistics" },
                   { icon: <Clock className="text-brand-accent" size={32} />, title: "On Time", desc: "Guaranteed delivery windows" }
                 ].map((feature, i) => (
                   <div key={i} className="bg-gray-50 p-4 rounded-lg hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-gray-100">
                     <div className="mb-3">{feature.icon}</div>
                     <h4 className="font-bold text-brand-dark mb-1">{feature.title}</h4>
                     <p className="text-xs text-gray-500">{feature.desc}</p>
                   </div>
                 ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-20 bg-brand-dark text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-brand-secondary/10" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 text-center divide-x divide-white/10">
            {[
              { label: "Years Experience", value: 61, suffix: "+" },
              { label: "Expert Workers", value: 2500, suffix: "+" },
              { label: "Global Coverage", value: 79, suffix: "%" },
              { label: "Countries", value: 207, suffix: "+" },
              { label: "Corporate Clients", value: 186, suffix: "+" },
              { label: "Owned Vehicles", value: 450, suffix: "+" }
            ].map((stat, i) => (
              <div key={i} className={`p-4 ${i % 2 !== 0 ? 'border-none' : ''}`}> {/* Basic fix for borders visually */}
                <div className="text-4xl lg:text-5xl font-bold text-brand-accent mb-2 flex justify-center">
                  <CounterAnimation end={stat.value} duration={2000} suffix={stat.suffix} />
                </div>
                <div className="text-sm text-gray-400 font-medium uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-brand-accent font-bold tracking-widest uppercase mb-3 text-sm">Why Choose Us</h2>
            <h3 className="text-4xl font-bold text-brand-dark">Built on Trust & Performance</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {[
              { title: "Global Network", desc: "Operations spanning across 207+ countries providing seamless shipping.", icon: <Globe size={28} /> },
              { title: "Expert Team", desc: "Over 2500 professionals bringing decades of logistics expertise.", icon: <Users size={28} /> },
              { title: "Advanced Tech", desc: "Real-time AI tracking and automated systems ensuring transparency.", icon: <Shield size={28} /> },
              { title: "Customer Success", desc: "Dedicated account managers ensuring your unique needs are met.", icon: <Trophy size={28} /> }
            ].map((item, i) => (
              <div key={i} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 flex gap-6 group border border-gray-100">
                <div className="w-14 h-14 bg-brand-light text-brand-accent rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-brand-accent group-hover:text-white transition-colors">
                  {item.icon}
                </div>
                <div>
                  <h4 className="text-xl font-bold text-brand-dark mb-2">{item.title}</h4>
                  <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
