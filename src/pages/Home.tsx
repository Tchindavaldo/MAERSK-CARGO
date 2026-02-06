import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Shield, 
  Clock, 
  Plane, 
  Ship, 
  Truck, 
  Box, 
  Globe, 
  ArrowRight, 
  CheckCircle2,
  Search
} from 'lucide-react';
import OrganizationSchema from '../components/OrganizationSchema';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CounterAnimation from '../components/CounterAnimation';
import SEO from '../components/SEO';

export default function Home() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const navigate = useNavigate();

  const handleTrack = (e: FormEvent) => {
    e.preventDefault();
    if (trackingNumber.trim()) {
      navigate(`/track?tracking=${trackingNumber.trim()}`);
    }
  };

  return (
    <div className="min-h-screen bg-brand-light font-sans text-brand-primary">
      <SEO 
        title="Jongleur Maersk - Global Logistics & Shipping Solutions"
        description="Premium international logistics services. Ocean, Air, and Road freight solutions connecting China to the world."
        keywords="global shipping, logistics, freight forwarder, maersk, china shipping, tracking"
        canonical="https://jongleurmaersk.com"
      />
      <OrganizationSchema />
      <Header />

      {/* Hero Section */}
      <section className="relative bg-brand-dark overflow-hidden min-h-[85vh] flex items-center">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 right-0 w-2/3 h-full bg-brand-secondary/10 -skew-x-12 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-1/3 h-full bg-brand-accent/5 skew-x-12 -translate-x-1/4 pointer-events-none" />
        
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0 opacity-40">
           <img 
             src="https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
             alt="Global Logistics Background" 
             className="w-full h-full object-cover"
           />
           <div className="absolute inset-0 bg-gradient-to-r from-brand-dark via-brand-dark/90 to-brand-dark/40" />
        </div>

        <div className="container mx-auto px-4 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in-up">
            <div className="inline-block px-4 py-1.5 rounded-full bg-brand-accent/20 text-brand-accent font-semibold text-sm mb-6 border border-brand-accent/30">
              Global Logistics Partner
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Shipping the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-accent to-white">
                Future Today
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-10 max-w-xl leading-relaxed">
              Jongleur Maersk delivers world-class logistics solutions. From Shanghai to the world, we ensure your cargo arrives safely and on time.
            </p>
            
            <div className="bg-white/10 backdrop-blur-md p-2 rounded-xl border border-white/20 max-w-lg shadow-2xl">
              <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="Enter Tracking Number..."
                    className="w-full px-6 py-4 rounded-lg bg-white/95 text-brand-primary placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-accent shadow-inner font-medium"
                  />
                  <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                </div>
                <button
                  type="submit"
                  className="px-8 py-4 bg-brand-accent hover:bg-brand-secondary text-white font-bold rounded-lg transition-all duration-300 shadow-lg hover:shadow-brand-accent/50 whitespace-nowrap"
                >
                  TRACK CARGO
                </button>
              </form>
            </div>
          </div>
          
          <div className="hidden lg:block relative">
            {/* Floating Cards Graphic */}
            <div className="relative z-10 transform hover:scale-105 transition duration-700">
               <img 
                 src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                 alt="Container Ship" 
                 className="rounded-2xl shadow-2xl border-4 border-white/10 w-full max-w-md ml-auto"
               />
               <div className="absolute -bottom-10 -left-10 bg-white p-6 rounded-xl shadow-xl max-w-xs animate-bounce-slow">
                 <div className="flex items-center gap-4 mb-3">
                   <div className="p-3 bg-green-100 rounded-full text-green-600">
                     <CheckCircle2 size={24} />
                   </div>
                   <div>
                     <p className="text-xs text-gray-500 font-semibold uppercase">Status</p>
                     <p className="font-bold text-brand-dark">Shipment Delivered</p>
                   </div>
                 </div>
                 <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                   <div className="h-full bg-green-500 w-full" />
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Ribbon */}
      <div className="bg-brand-primary text-white py-10 relative z-20 -mt-8 shadow-xl mx-4 lg:mx-20 rounded-xl">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-white/10">
            {[
              { label: "Countries Served", val: 200, suffix: "+" },
              { label: "Annual Shipments", val: 50, suffix: "k+" },
              { label: "Business Clients", val: 1200, suffix: "+" },
              { label: "Team Experts", val: 450, suffix: "" }
            ].map((stat, i) => (
              <div key={i} className="text-center px-4">
                <h3 className="text-3xl lg:text-4xl font-bold text-brand-accent mb-1">
                  <CounterAnimation end={stat.val} suffix={stat.suffix} />
                </h3>
                <p className="text-xs lg:text-sm text-gray-300 uppercase tracking-wider font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Services Section */}
      <section className="py-24 bg-brand-light">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
             <h2 className="text-brand-accent font-bold tracking-widest uppercase mb-3 text-sm">Our Expertise</h2>
             <h3 className="text-4xl font-bold text-brand-dark mb-6">Comprehensive Shipping Solutions</h3>
             <p className="text-gray-600 text-lg">We provide end-to-end logistics tailored to your specific needs, ensuring efficiency and reliability at every step.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Ship size={40} />,
                title: "Ocean Freight",
                desc: "Cost-effective maritime transport for large volumes. FCL and LCL options available worldwide.",
                img: "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&w=800&q=80"
              },
              {
                icon: <Plane size={40} />,
                title: "Air Freight",
                desc: "Rapid air cargo services for time-sensitive shipments. Door-to-door delivery within days.",
                img: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80"
              },
              {
                icon: <Truck size={40} />,
                title: "Land Transport",
                desc: "Flexible road and rail networks connecting ports to inland destinations efficiently.",
                img: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=80"
              }
            ].map((service, idx) => (
              <div key={idx} className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 top-0 hover:-top-2">
                <div className="h-48 overflow-hidden relative">
                   <div className="absolute inset-0 bg-brand-dark/20 group-hover:bg-brand-dark/0 transition-colors z-10" />
                   <img src={service.img} alt={service.title} className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700" />
                </div>
                <div className="p-8 relative">
                   <div className="absolute -top-10 right-8 bg-brand-accent p-4 rounded-xl text-white shadow-lg">
                     {service.icon}
                   </div>
                   <h4 className="text-2xl font-bold text-brand-dark mb-3">{service.title}</h4>
                   <p className="text-gray-600 mb-6 leading-relaxed">{service.desc}</p>
                   <a href="#" className="inline-flex items-center text-brand-accent font-bold hover:text-brand-dark transition-colors">
                     Learn More <ArrowRight size={18} className="ml-2" />
                   </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us - Split */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 relative">
               <div className="absolute -left-10 -top-10 w-64 h-64 bg-brand-accent/10 rounded-full blur-3xl" />
               <div className="relative rounded-2xl overflow-hidden shadow-2xl border-8 border-gray-50">
                  <img 
                    src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                    alt="Why Choose Us" 
                    className="w-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-8">
                     <p className="text-white font-medium italic">"Excellence is not an act, but a habit."</p>
                  </div>
               </div>
            </div>
            
            <div className="lg:w-1/2">
              <h2 className="text-brand-accent font-bold tracking-widest uppercase mb-3 text-sm">Why Choose Jongleur Maersk</h2>
              <h3 className="text-4xl font-bold text-brand-dark mb-8">We Go Beyond Logistics</h3>
              
              <div className="space-y-8">
                {[
                  {
                    icon: <Shield className="text-brand-accent" size={24} />,
                    title: "Secure & Insured",
                    text: "Your cargo's safety is our priority. Comprehensive insurance coverage included."
                  },
                  {
                    icon: <Globe className="text-brand-accent" size={24} />,
                    title: "Global Network",
                    text: "Partnerships in over 120 countries ensuring borders are never barriers."
                  },
                  {
                    icon: <Clock className="text-brand-accent" size={24} />,
                    title: "On-Time Delivery",
                    text: "We value your time. Our optimized routes guarantee punctual arrivals."
                  }
                ].map((feature, i) => (
                  <div key={i} className="flex gap-5">
                     <div className="flex-shrink-0 w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center border border-blue-100">
                        {feature.icon}
                     </div>
                     <div>
                        <h4 className="text-xl font-bold text-brand-dark mb-2">{feature.title}</h4>
                        <p className="text-gray-600 leading-relaxed">{feature.text}</p>
                     </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-brand-light relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gray-50 skew-x-12 translate-x-1/2" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
             <h2 className="text-brand-accent font-bold tracking-widest uppercase mb-3 text-sm">Simple Process</h2>
             <h3 className="text-4xl font-bold text-brand-dark mb-6">How We Deliver Excellence</h3>
             <p className="text-gray-600 text-lg">From booking to final delivery, our process is streamlined for transparency and speed.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gray-200 -z-10" />
            
            {[
              { step: "01", title: "Book Shipment", desc: "Request a quote and schedule your pickup online or via phone.", icon: <Box size={24} /> },
              { step: "02", title: "Pack & Collect", desc: "We professionally pack and collect your cargo from any location.", icon: <Truck size={24} /> },
              { step: "03", title: "Global Transit", desc: "Your goods travel via our optimized air or ocean freight networks.", icon: <Globe size={24} /> },
              { step: "04", title: "Secure Delivery", desc: "Final mile delivery to the receiver's doorstep with proof of receipt.", icon: <CheckCircle2 size={24} /> }
            ].map((item, i) => (
              <div key={i} className="group relative bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:-translate-y-2 transition-transform duration-300">
                 <div className="w-16 h-16 bg-brand-dark text-white rounded-full flex items-center justify-center text-xl font-bold mb-6 mx-auto group-hover:bg-brand-accent transition-colors shadow-lg border-4 border-white">
                   {item.icon}
                 </div>
                 <div className="text-center">
                   <span className="block text-6xl font-black text-gray-50 absolute top-4 right-4 -z-10 select-none group-hover:text-blue-50 transition-colors">{item.step}</span>
                   <h4 className="text-xl font-bold text-brand-dark mb-3">{item.title}</h4>
                   <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                 </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-16">
             <div className="lg:w-1/3">
               <h2 className="text-brand-accent font-bold tracking-widest uppercase mb-3 text-sm">Common Questions</h2>
               <h3 className="text-4xl font-bold text-brand-dark mb-6">Frequently Asked Questions</h3>
               <p className="text-gray-600 text-lg mb-8">Can't find what you're looking for? Contact our support team for immediate assistance.</p>
               <Link to="/contact" className="inline-flex items-center gap-2 text-brand-dark font-bold hover:text-brand-accent transition-colors">
                 Contact Support <ArrowRight size={20} />
               </Link>
             </div>
             
             <div className="lg:w-2/3 space-y-6">
               {[
                 { q: "How do I track my shipment?", a: "You can track your shipment using the unique tracking ID provided at booking. Simply enter it in the tracking field on our homepage or tracking page for real-time updates." },
                 { q: "What documents are required for international shipping?", a: "Typically, you'll need a Commercial Invoice, Packing List, and Bill of Lading. Our customs experts will guide you through the specific requirements for your destination." },
                 { q: "Do you offer insurance for cargo?", a: "Yes, we provide comprehensive cargo insurance options to protect your goods against loss or damage during transit. Ask for insurance details when booking." },
                 { q: "What are your shipping rates?", a: "Rates vary based on weight, dimensions, destination, and service type (Air/Sea). Use our 'Get a Quote' feature for an accurate estimate tailored to your shipment." }
               ].map((faq, i) => (
                 <div key={i} className="bg-gray-50 rounded-xl p-6 hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-gray-100 cursor-pointer group">
                    <h4 className="text-lg font-bold text-brand-dark mb-2 flex justify-between items-center group-hover:text-brand-accent transition-colors">
                      {faq.q}
                      <span className="text-2xl text-gray-300 font-light">+</span>
                    </h4>
                    <p className="text-gray-600 leading-relaxed text-sm">{faq.a}</p>
                 </div>
               ))}
             </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-brand-dark/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-brand-dark">Trusted by Industry Leaders</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Sarah Jenkins", role: "Import Director", text: "Jongleur Maersk transformed our supply chain. The visibility and reliability are unmatched." },
              { name: "Michael Chen", role: "Factory Owner", text: "Shipping to Africa used to be a headache. Now it's the easiest part of my business." },
              { name: "Robert Fox", role: "Logistics Manager", text: "Their customer support is incredible. Always available and proactive with updates." }
            ].map((t, i) => (
              <div key={i} className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 relative">
                <div className="text-brand-accent mb-4">★★★★★</div>
                <p className="text-gray-600 mb-6 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-brand-primary rounded-full flex items-center justify-center text-white font-bold">
                     {t.name[0]}
                   </div>
                   <div>
                     <div className="font-bold text-brand-dark">{t.name}</div>
                     <div className="text-xs text-gray-500 uppercase">{t.role}</div>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer Wrapper */}
      <section className="bg-brand-primary py-20 text-center relative overflow-hidden">
         <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/world-map.png')]"></div>
         <div className="container mx-auto px-4 relative z-10">
           <h2 className="text-4xl text-white font-bold mb-6">Ready to Ship with Confidence?</h2>
           <p className="text-blue-200 text-xl mb-10 max-w-2xl mx-auto">Join thousands of businesses who trust Jongleur Maersk for their logistics needs.</p>
           <button className="bg-brand-accent hover:bg-white hover:text-brand-dark text-white px-10 py-4 rounded-full font-bold text-lg transition-all duration-300 shadow-2xl transform hover:-translate-y-1">
             Get a Free Quote Today
           </button>
         </div>
      </section>

      <Footer />
    </div>
  );
}
