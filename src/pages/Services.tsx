import { Plane, Ship, PackageCheck, Warehouse, Zap, MapPin, ArrowRight, ShieldCheck, Clock, Globe } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

export default function Services() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-brand-dark">
      <SEO title="Our Services - Jongleur Maersk" description="Explore our comprehensive logistics solutions including Sea Freight, Air Freight, and custom courier services." />
      <Header />

      {/* Hero Section */}
      <section className="relative bg-brand-dark text-white py-32 overflow-hidden">
        <div className="absolute inset-0 bg-brand-secondary/20" />
        <div className="absolute top-0 right-0 w-3/4 h-full bg-gradient-to-l from-brand-secondary/30 to-transparent skew-x-12 translate-x-1/4 pointer-events-none" />
        
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0 opacity-20">
           <img 
             src="https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?q=80&w=2065" 
             alt="Services Background" 
             className="w-full h-full object-cover"
           />
           <div className="absolute inset-0 bg-gradient-to-r from-brand-dark via-brand-dark/95 to-brand-dark/50" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl">
            <div className="inline-block bg-brand-accent/20 border border-brand-accent/30 text-brand-accent px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
               Comprehensive Logistics
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Our <span className="text-brand-accent">Services</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl leading-relaxed">
              Tailored logistics solutions designed to move your business forward. 
              From ocean freight to last-mile delivery, we handle it all with precision.
            </p>
             <div className="flex items-center gap-3 text-sm font-medium text-gray-400">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <ArrowRight size={14} />
              <span className="text-brand-accent">Services</span>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 bg-white relative">
        <div className="absolute top-0 left-0 w-full h-32 bg-gray-50 skew-y-2 -translate-y-16 -z-10" />
        
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-brand-accent font-bold tracking-widest uppercase mb-3 text-sm">Our Expertise</h2>
            <h3 className="text-4xl font-bold text-brand-dark mb-6">World-Class Logistics Solutions</h3>
            <p className="text-gray-600 text-lg">
              We offer a complete suite of shipping and logistics services. 
              Whether you need speed, cost-efficiency, or specialized handling, we have the right solution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Sea Freight",
                icon: <Ship size={48} />,
                desc: "Cost-effective transportation for large quantities of goods internationally via cargo ships.",
                features: ["FCL & LCL shipments", "Door-to-door service", "Customs clearance"]
              },
              {
                title: "Air Freight",
                icon: <Plane size={48} />,
                desc: "The fastest method for international shipping, ideal for time-sensitive and high-value cargo.",
                features: ["Express & standard options", "Real-time tracking", "Priority handling"]
              },
              {
                title: "Courier Services",
                icon: <PackageCheck size={48} />,
                desc: "Fast and reliable delivery of packages and documents for businesses and individuals.",
                features: ["Same-day delivery", "Document shipping", "Express pickup"]
              },
              {
                title: "Storage Services",
                icon: <Warehouse size={48} />,
                desc: "Secure temporary and long-term storage solutions with climate-controlled facilities.",
                features: ["Climate control", "24/7 security", "Inventory management"]
              },
              {
                title: "Fast Freight",
                icon: <Zap size={48} />,
                desc: "Expedited delivery services for urgent shipments requiring swift transit.",
                features: ["Guaranteed delivery times", "Priority customs", "Dedicated support"]
              },
              {
                title: "Cargo Tracking",
                icon: <MapPin size={48} />,
                desc: "Advanced real-time shipment monitoring system to manage your logistics operations.",
                features: ["Real-time updates", "SMS notifications", "Detailed reporting"]
              }
            ].map((service, index) => (
              <div key={index} className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-brand-accent/30 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-light rounded-bl-full -mr-16 -mt-16 opacity-50 group-hover:bg-brand-accent/10 transition-colors" />
                
                <div className="text-brand-accent mb-6 group-hover:scale-110 transition-transform duration-300 inline-block">
                  {service.icon}
                </div>
                
                <h3 className="text-2xl font-bold text-brand-dark mb-4 group-hover:text-brand-accent transition-colors">{service.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed line-clamp-3">
                  {service.desc}
                </p>
                
                <ul className="space-y-3 mb-8">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-sm text-gray-500">
                      <span className="w-1.5 h-1.5 bg-brand-accent rounded-full mr-3" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <Link to="/contact" className="w-full py-3 px-6 rounded-lg font-semibold bg-gray-50 text-brand-dark hover:bg-brand-accent hover:text-white transition-all duration-300 flex items-center justify-center gap-2 group-hover:shadow-md">
                   Get Quote <ArrowRight size={18} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                 {[
                     { icon: <ShieldCheck size={32} />, title: "Secure Handling", desc: "Your cargo is insured and handled with the utmost care throughout the entire journey." },
                     { icon: <Clock size={32} />, title: "On-Time Delivery", desc: "We value your time. Our optimized routes ensure punctual storage and delivery." },
                     { icon: <Globe size={32} />, title: "Global Network", desc: "With partners in over 200 countries, we connect you to every corner of the world." }
                 ].map((item, i) => (
                     <div key={i} className="flex gap-6 items-start">
                         <div className="w-14 h-14 rounded-xl bg-brand-dark flex items-center justify-center text-brand-accent shrink-0 shadow-lg">
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

      {/* CTA Section */}
      <section className="py-24 bg-brand-dark relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
        <div className="container mx-auto px-4 relative z-10 text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Need a Custom Solution?</h2>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Every business has unique logistics needs. Our team is ready to design a
              tailored shipping solution that fits your specific requirements and budget.
            </p>
            <Link to="/contact" className="inline-block bg-brand-accent hover:bg-brand-light hover:text-brand-dark text-white px-10 py-4 rounded-lg text-lg font-bold transition-all shadow-lg hover:shadow-brand-accent/20 transform hover:-translate-y-1">
              Contact Our Team
            </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
