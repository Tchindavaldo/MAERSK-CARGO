import { Mail, Phone, MapPin, Clock, ArrowRight } from 'lucide-react';
import SEO from '../components/SEO';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { Link } from 'react-router-dom';
import { getSiteName } from '../utils/siteConfig';

export default function Contact() {
  const { settings } = useSiteSettings();
  const siteName = getSiteName();

  return (
    <div className="min-h-screen bg-white font-sans text-brand-dark">
      <SEO 
        title={`Contact - ${siteName} | Global Logistics Partner`}
        description={`Contact ${siteName} for your international transport needs. Get a free quote for sea, air, and land freight solutions.`}
        keywords={`contact ${siteName}, logistics quote, shipping contact, freight forwarder china`}
        canonical="https://www.maerskaircargo.com/contact"
      />
      <Header />

      {/* Hero Section */}
      <section className="relative bg-brand-dark text-white py-32 overflow-hidden">
        <div className="absolute top-0 right-0 w-2/3 h-full bg-brand-secondary/10 -skew-x-12 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-1/3 h-full bg-brand-accent/5 skew-x-12 -translate-x-1/4 pointer-events-none" />
        
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0 opacity-20">
           <img 
             src="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?q=80&w=2074" 
             alt="Contact Support" 
             className="w-full h-full object-cover"
           />
           <div className="absolute inset-0 bg-gradient-to-r from-brand-dark via-brand-dark/95 to-brand-dark/40" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/10">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <p className="text-sm font-medium text-blue-50">Online Support 24/7</p>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Get in <span className="text-brand-accent">Touch</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl leading-relaxed">
              Ready to streamline your supply chain? Our team is here to answer your questions and provide tailored solutions.
            </p>
            <div className="flex items-center gap-3 text-sm font-medium text-gray-400">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <ArrowRight size={14} />
              <span className="text-brand-accent">Contact</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-brand-accent font-bold tracking-widest uppercase mb-3 text-sm">Contact Us</h2>
            <h3 className="text-4xl font-bold text-brand-dark mb-6">We Value Your Feedback & Queries</h3>
            <p className="text-gray-600 text-lg leading-relaxed">
              {siteName} is a global supplier of transport and logistics solutions.
              Reach out to us for any inquiries or to request a quote for your shipping needs.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div>
              <h3 className="text-2xl font-bold text-brand-dark mb-6">Contact Information</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-xl border border-gray-100 hover:border-brand-accent/30 transition-colors group">
                  <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-brand-accent shadow-sm group-hover:bg-brand-accent group-hover:text-white transition-colors">
                     <MapPin size={24} />
                  </div>
                  <div>
                    <div className="font-bold text-lg mb-1 text-brand-dark">Our Location</div>
                    <div className="text-gray-600">{settings.site_address || "123 Logistics Way, Transport City"}</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-xl border border-gray-100 hover:border-brand-accent/30 transition-colors group">
                  <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-brand-accent shadow-sm group-hover:bg-brand-accent group-hover:text-white transition-colors">
                     <Phone size={24} />
                  </div>
                  <div>
                    <div className="font-bold text-lg mb-1 text-brand-dark">Phone Number</div>
                    <div className="text-gray-600">{settings.site_phone || "+1 234 567 890"}</div>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-xl border border-gray-100 hover:border-brand-accent/30 transition-colors group">
                  <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-brand-accent shadow-sm group-hover:bg-brand-accent group-hover:text-white transition-colors">
                     <Mail size={24} />
                  </div>
                  <div>
                    <div className="font-bold text-lg mb-1 text-brand-dark">Email Address</div>
                    <div className="text-gray-600">{settings.site_email || "contact@maerskaircargo.com"}</div>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-xl border border-gray-100 hover:border-brand-accent/30 transition-colors group">
                  <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-brand-accent shadow-sm group-hover:bg-brand-accent group-hover:text-white transition-colors">
                     <Clock size={24} />
                  </div>
                  <div>
                    <div className="font-bold text-lg mb-1 text-brand-dark">Business Hours</div>
                    <div className="text-gray-600">Monday - Friday: 9:00 AM - 6:00 PM</div>
                    <div className="text-gray-600">Saturday: 9:00 AM - 1:00 PM</div>
                    <div className="text-gray-600">Sunday: Closed</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 shadow-lg">
              <h3 className="text-2xl font-bold text-brand-dark mb-6">Send Us a Message</h3>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2 text-sm">Your Name *</label>
                    <input
                      type="text"
                      placeholder="Full Name"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent bg-white transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2 text-sm">Your Email *</label>
                    <input
                      type="email"
                      placeholder="Email Address"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent bg-white transition-all"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2 text-sm">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2 text-sm">Subject *</label>
                  <input
                    type="text"
                    placeholder="Subject"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent bg-white transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2 text-sm">Your Message *</label>
                  <textarea
                    placeholder="How can we help you?"
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent bg-white transition-all resize-none"
                    required
                  ></textarea>
                </div>
                <button className="w-full bg-brand-accent hover:bg-brand-dark text-white px-8 py-4 rounded-lg font-bold transition-all shadow-md hover:shadow-xl transform hover:-translate-y-0.5">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center text-brand-dark">Seamless Shipping Process</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { step: "01", title: "Request a Quote", desc: "Fill out our contact form with your shipping details to get started." },
                { step: "02", title: "Custom Solution", desc: "Receive a tailored shipping plan and competitive pricing from our experts." },
                { step: "03", title: "Ship & Track", desc: "We handle the logistics while you track your shipment in real-time." }
              ].map((item, i) => (
                <div key={i} className="text-center p-8 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group">
                  <span className="absolute -right-4 -top-4 text-8xl font-black text-gray-50 group-hover:text-brand-light/30 transition-colors z-0 select-none">
                    {item.step}
                  </span>
                  <div className="relative z-10">
                    <div className="text-xl font-bold text-brand-accent mb-3">{item.step}. {item.title}</div>
                    <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Bottom */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="bg-brand-dark text-white rounded-2xl p-12 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-full h-full bg-brand-accent/5" />
             <div className="relative z-10">
                <h2 className="text-4xl font-bold mb-4">Ready to Ship Your Cargo?</h2>
                <p className="text-xl mb-8 text-gray-300">
                  Contact us today and get a free quote for your shipping needs
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a href={`tel:${settings.site_phone}`} className="bg-white text-brand-dark px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition inline-block">
                    Call Us Now
                  </a>
                  <a href={`mailto:${settings.site_email}`} className="bg-brand-accent text-white px-8 py-4 rounded-lg font-bold hover:bg-brand-light hover:text-brand-dark transition inline-block">
                    Send Email
                  </a>
                </div>
             </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
