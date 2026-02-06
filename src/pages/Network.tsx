import { Globe, Map, Users, Building, ArrowRight } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CounterAnimation from '../components/CounterAnimation';
import { Link } from 'react-router-dom';

export default function Network() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-brand-dark">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-brand-dark text-white py-32 overflow-hidden">
        <div className="absolute top-0 left-0 w-2/3 h-full bg-brand-secondary/10 skew-x-12 -translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-1/3 h-full bg-brand-accent/5 -skew-x-12 translate-x-1/4 pointer-events-none" />
        
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0 opacity-20">
           <img 
             src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072" 
             alt="Global Network" 
             className="w-full h-full object-cover"
           />
           <div className="absolute inset-0 bg-gradient-to-r from-brand-dark via-brand-dark/95 to-brand-dark/50" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl text-center mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md px-4 py-2 rounded-full mb-6 border border-white/10">
              <Globe size={16} className="text-brand-accent" />
              <p className="text-sm font-medium text-brand-light">Connecting 5 Continents</p>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Our <span className="text-brand-accent">Global</span> Presence
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Spanning over 200 countries, our logistics network ensures your cargo reaches 
              any destination with speed and security.
            </p>
            <div className="flex justify-center items-center gap-3 text-sm font-medium text-gray-400">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <ArrowRight size={14} />
              <span className="text-brand-accent">Network</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section with Animation */}
      <section className="py-16 bg-white relative -mt-10 z-20 container mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: <Globe className="text-brand-accent" size={32} />, value: 207, label: "Countries Served", suffix: "+" },
              { icon: <Building className="text-brand-accent" size={32} />, value: 450, label: "Global Offices", suffix: "" },
              { icon: <Users className="text-brand-accent" size={32} />, value: 2500, label: "Professionals", suffix: "+" },
              { icon: <Map className="text-brand-accent" size={32} />, value: 98, label: "Satisfaction", suffix: "%" }
            ].map((stat, i) => (
              <div key={i} className="text-center group">
                 <div className="bg-brand-light w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-brand-accent group-hover:text-white transition-colors duration-300">
                   {stat.icon}
                 </div>
                 <div className="text-4xl font-bold text-brand-dark mb-1 flex justify-center">
                   <CounterAnimation end={stat.value} duration={2000} suffix={stat.suffix} />
                 </div>
                 <p className="text-gray-500 font-medium">{stat.label}</p>
              </div>
            ))}
        </div>
      </section>

      {/* Regional Coverage */}
      <section className="py-24 bg-gray-50 relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
             <div>
               <h2 className="text-brand-accent font-bold tracking-widest uppercase mb-3 text-sm">Global Reach</h2>
               <h3 className="text-4xl font-bold text-brand-dark mb-6">Operations Across Continents</h3>
               <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                 We have established strategic hubs in key global markets to facilitate seamless trade.
                 Our local expertise combined with global standards ensures your business is compliant and efficient everywhere.
               </p>
               <ul className="space-y-4">
                 {['North & South America', 'Europe & Middle East', 'Asia Pacific', 'Africa'].map((region, i) => (
                   <li key={i} className="flex items-center gap-3">
                     <span className="w-8 h-8 rounded-full bg-brand-accent text-white flex items-center justify-center font-bold text-sm">{i + 1}</span>
                     <span className="text-lg font-medium text-brand-dark">{region}</span>
                   </li>
                 ))}
               </ul>
             </div>
             <div className="relative">
                <div className="absolute inset-0 bg-brand-accent/10 rounded-full blur-3xl transform scale-75" />
                <img 
                  src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=2050" 
                  alt="World Map Connection" 
                  className="relative z-10 w-full rounded-xl shadow-2xl hover:scale-[1.02] transition-transform duration-500" 
                />
             </div>
          </div>
          
          {/* Office Locations */}
          <div>
            <div className="text-center mb-16">
               <h3 className="text-3xl font-bold text-brand-dark mb-4">Key Strategic Hubs</h3>
               <p className="text-gray-500 max-w-2xl mx-auto">Our major operational centers are located to optimize transit times and connectivity.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { city: "Shanghai, China", address: "2588 Pudong Ave, Pudong", phone: "+86 21 6888 8888" },
                { city: "Rotterdam, Netherlands", address: "Maasvlakte 2, 3011 Rotterdam", phone: "+31 10 123 4567" },
                { city: "Los Angeles, USA", address: "1000 W Seaside Ave, Long Beach", phone: "+1 562 123 4567" },
                { city: "Dubai, UAE", address: "Jebel Ali Free Zone", phone: "+971 4 123 4567" },
                { city: "Singapore", address: "10 Pasir Panjang Rd", phone: "+65 6123 4567" },
                { city: "Hamburg, Germany", address: "HafenCity, 20457 Hamburg", phone: "+49 40 1234 5678" }
              ].map((office, i) => (
                <div key={i} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-brand-accent/50 transition-all duration-300 group">
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="text-xl font-bold text-brand-dark group-hover:text-brand-accent transition-colors">{office.city}</h4>
                    <MapPinIcon />
                  </div>
                  <p className="text-gray-500 mb-2 text-sm">{office.address}</p>
                  <p className="text-brand-dark font-medium">{office.phone}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function MapPinIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}
