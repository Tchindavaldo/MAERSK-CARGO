import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Package, User, MapPin, Printer, Ship } from 'lucide-react';
import QRCode from 'qrcode';
import { supabase } from '../lib/supabase';
import SEO from '../components/SEO';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface Insurance {
  name: string;
  amount: string;
  paid: boolean;
}

interface Shipment {
  tracking_number: string;
  status: string;
  origin: string;
  destination: string;
  carrier: string;
  carrier_reference: string;
  product: string;
  type_of_shipment: string;
  quantity: number;
  weight: string;
  payment_mode: string;
  shipment_mode: string;
  total_freight: string;
  expected_delivery_date: string;
  departure_date: string;
  departure_time: string;
  delivery_time: string;
  package_description: string;
  shipper_name: string;
  shipper_phone: string;
  shipper_email: string;
  shipper_address: string;
  receiver_name: string;
  receiver_phone: string;
  receiver_email: string;
  receiver_address: string;
  comment: string;
  image_url: string;
  insurances?: Insurance[];
  import_tax?: string;
  import_tax_paid?: boolean;
  status_date?: string;
  status_time?: string;
  tracking_progress?: number;
  tracking_stage?: string;
}

export default function Track() {
  const [searchParams] = useSearchParams();
  const [trackingNumber, setTrackingNumber] = useState('');
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  const generateQRCode = useCallback(async (trackingNumber: string) => {
    try {
      const trackingUrl = `${window.location.origin}/track?tracking=${trackingNumber}`;
      const qrCodeDataUrl = await QRCode.toDataURL(trackingUrl, {
        width: 200,
        margin: 2,
        color: {
          dark: '#0B132B', // brand-dark
          light: '#FFFFFF'
        }
      });
      setQrCodeUrl(qrCodeDataUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  }, []);

  const handleTrack = useCallback(async (e: React.FormEvent | null, initialTracking?: string) => {
    if (e) e.preventDefault();

    const tracking = initialTracking || trackingNumber.trim();
    if (!tracking) return;

    setLoading(true);
    setError('');
    setShipment(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('jongleur_maersk_shipments')
        .select('*')
        .eq('tracking_number', tracking)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (!data) {
        setError('Tracking number not found. Please check and try again.');
      } else {
        setShipment(data);
        generateQRCode(data.tracking_number);
      }
    } catch (err) {
      setError('An error occurred while tracking your shipment. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [trackingNumber, generateQRCode]);

  useEffect(() => {
    const initialTracking = searchParams.get('tracking');
    if (initialTracking) {
      handleTrack(null, initialTracking);
    }
  }, [searchParams, handleTrack]);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-brand-light font-sans">
      <SEO 
        title="Track & Trace - Jongleur Maersk | Real-time Tracking"
        description="Track your shipments in real-time with Jongleur Maersk. Enter your tracking number to see the status and location of your package."
        keywords="tracking, shipment, maersk, cargo, logistics, delivery, real-time"
        canonical="https://jongleur-maersk.com/track"
      />
      <Header />

      <section className="relative bg-brand-dark text-white py-24 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        
        {/* Content */}
        <div className="container mx-auto px-4 relative z-10 text-center">
            <div className="inline-block bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-4 border border-white/20">
              <p className="text-sm font-medium text-brand-accent">📍 Live Tracking System</p>
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold mb-4 leading-tight tracking-tight">
              Track Your Cargo
            </h1>
            <p className="text-lg text-gray-400 mb-6">Real-time visibility for your global shipments.</p>
        </div>
      </section>

      <section className="py-16 -mt-10">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto shadow-2xl rounded-2xl bg-white overflow-hidden border border-gray-100 p-8">
            
            <form onSubmit={(e) => handleTrack(e)} className="max-w-3xl mx-auto mb-12">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Enter Tracking Number (e.g. CC-10-751490)"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    className="w-full px-6 py-4 rounded-lg bg-gray-50 border-2 border-gray-100 focus:border-brand-accent focus:bg-white text-lg transition-all focus:outline-none placeholder-gray-400 font-medium text-brand-dark"
                  />
                  <Search className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-brand-accent hover:bg-brand-secondary text-white px-10 py-4 rounded-lg text-lg font-bold transition shadow-lg whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Locating...' : 'Track Now'}
                </button>
              </div>
              {error && (
                <div className="text-center bg-red-50 text-red-600 mt-4 py-3 rounded-lg font-medium border border-red-100">{error}</div>
              )}
            </form>

            {shipment && (
              <div className="bg-gradient-to-br from-gray-50 to-brand-light/30 rounded-2xl overflow-hidden shadow-2xl">
                {/* Visual Tracking Progress Bar */}
                <div className="bg-white p-8 border-b border-gray-200">
                  <h3 className="text-2xl font-bold mb-6 text-center text-brand-dark">Package Tracking Progress</h3>
                  <div className="max-w-4xl mx-auto">
                    {/* Progress Bar */}
                    <div className="relative mb-8">
                      <div className="flex justify-between mb-3">
                        <div className={`flex-1 text-center transition-all ${
                          shipment.tracking_stage === 'picked_up' ? 'text-brand-accent font-bold scale-110' : 'text-gray-400'
                        }`}>
                          <div className="text-2xl mb-2">📦</div>
                          <div className="text-xs font-semibold">Picked Up</div>
                        </div>
                        <div className={`flex-1 text-center transition-all ${
                          shipment.tracking_stage === 'in_transit' ? 'text-brand-accent font-bold scale-110' : 'text-gray-400'
                        }`}>
                          <div className="text-2xl mb-2">🚚</div>
                          <div className="text-xs font-semibold">In Transit</div>
                        </div>
                        <div className={`flex-1 text-center transition-all ${
                          shipment.tracking_stage === 'customs' ? 'text-brand-accent font-bold scale-110' : 'text-gray-400'
                        }`}>
                          <div className="text-2xl mb-2">🛃</div>
                          <div className="text-xs font-semibold">Customs</div>
                        </div>
                        <div className={`flex-1 text-center transition-all ${
                          shipment.tracking_stage === 'out_for_delivery' ? 'text-brand-accent font-bold scale-110' : 'text-gray-400'
                        }`}>
                          <div className="text-2xl mb-2">🚛</div>
                          <div className="text-xs font-semibold">Out for Delivery</div>
                        </div>
                        <div className={`flex-1 text-center transition-all ${
                          shipment.tracking_stage === 'delivered' ? 'text-brand-accent font-bold scale-110' : 'text-gray-400'
                        }`}>
                          <div className="text-2xl mb-2">✅</div>
                          <div className="text-xs font-semibold">Delivered</div>
                        </div>
                      </div>
                      
                      {/* Progress Bar Container */}
                      <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                        <div 
                          className="absolute top-0 left-0 h-full bg-gradient-to-r from-brand-accent to-brand-secondary transition-all duration-700 ease-out"
                          style={{ width: `${shipment.tracking_progress || 0}%` }}
                        ></div>
                      </div>
                      <div className="text-center mt-3 text-sm font-bold text-brand-accent">
                        {shipment.tracking_progress || 0}% Complete
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-8 border-b border-gray-200">
                  <div className="tracking-info-detail">
                    <div className="tracking-box bg-gradient-to-br from-brand-light/50 to-gray-50 p-6 rounded-xl border-2 border-brand-accent/20 shadow-md">
                      <div className="tracking-time-box mb-4">
                        <div className="tracking-time text-xl font-bold text-brand-dark">
                          {shipment.status_date ? formatDate(shipment.status_date) : 'N/A'}
                        </div>
                        <span className="text-sm text-gray-600 font-medium">{shipment.status_time || 'N/A'}</span>
                      </div>
                      <div className="tracking-location style-7 flex items-start gap-4">
                        <span className="dott w-4 h-4 bg-brand-accent rounded-full mt-1 flex-shrink-0 animate-pulse shadow-lg"></span>
                        <div className="flex-1">
                          <strong className="text-brand-accent font-bold block mb-3 text-lg">{shipment.status}</strong>
                          
                          {/* Display Insurances */}
                          {shipment.insurances && shipment.insurances.length > 0 && (
                            <div className="mb-3">
                              <p className="text-sm font-bold text-brand-dark mb-2">Insurances:</p>
                              {shipment.insurances.map((insurance, index) => (
                                <div key={index} className="text-sm text-gray-700 ml-2 mb-2 flex items-center gap-2">
                                  <span className="w-1.5 h-1.5 bg-brand-accent rounded-full"></span>
                                  {insurance.name}: {insurance.amount} 
                                  <span className={`ml-2 px-2.5 py-1 rounded-full text-xs font-bold ${
                                    insurance.paid ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                  }`}>
                                    {insurance.paid ? 'PAID' : 'NOT PAID'}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {/* Display Import Tax */}
                          {shipment.import_tax && (
                            <div className="text-sm text-gray-700 flex items-center gap-2">
                              <span className="font-bold text-brand-dark">Import Tax:</span> {shipment.import_tax}
                              <span className={`ml-2 px-2.5 py-1 rounded-full text-xs font-bold ${
                                shipment.import_tax_paid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                              }`}>
                                {shipment.import_tax_paid ? 'PAID' : 'NOT PAID'}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  <div className="flex items-center justify-center mb-10">
                    <div className="bg-white p-6 rounded-xl border-2 border-brand-accent/30 shadow-lg hover:shadow-xl transition-shadow">
                      {qrCodeUrl ? (
                        <div className="text-center">
                          <img
                            src={qrCodeUrl}
                            alt="QR Code"
                            className="mx-auto mb-3"
                            style={{width: '120px', height: '120px'}}
                          />
                          <p className="text-center text-xs font-bold text-brand-dark bg-brand-light/50 py-1.5 px-3 rounded-lg">{shipment.tracking_number}</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center" style={{width: '120px', height: '120px'}}>
                          <svg className="animate-spin h-8 w-8 text-brand-accent mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <p className="text-xs text-gray-500">Loading QR...</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl border-2 border-gray-200 hover:border-brand-accent/50 transition-all shadow-md hover:shadow-lg">
                      <h3 className="text-xl font-bold mb-5 flex items-center gap-2 text-brand-dark">
                        <User size={24} className="text-brand-accent" />
                        Shipper Information
                      </h3>
                      <div className="space-y-4 text-sm">
                        <div>
                          <p className="text-gray-500 font-semibold mb-1">Name</p>
                          <p className="font-medium text-brand-dark">{shipment.shipper_name}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 font-semibold mb-1">Address</p>
                          <p className="font-medium text-brand-dark">{shipment.shipper_address}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 font-semibold mb-1">Phone Number</p>
                          <p className="font-medium text-brand-dark">{shipment.shipper_phone}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 font-semibold mb-1">Email</p>
                          <p className="font-medium text-brand-dark">{shipment.shipper_email}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border-2 border-gray-200 hover:border-brand-accent/50 transition-all shadow-md hover:shadow-lg">
                      <h3 className="text-xl font-bold mb-5 flex items-center gap-2 text-brand-dark">
                        <User size={24} className="text-brand-accent" />
                        Receiver Information
                      </h3>
                      <div className="space-y-4 text-sm">
                        <div>
                          <p className="text-gray-500 font-semibold mb-1">Name</p>
                          <p className="font-medium text-brand-dark">{shipment.receiver_name}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 font-semibold mb-1">Address</p>
                          <p className="font-medium text-brand-dark">{shipment.receiver_address}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 font-semibold mb-1">Phone Number</p>
                          <p className="font-medium text-brand-dark">{shipment.receiver_phone}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 font-semibold mb-1">Email</p>
                          <p className="font-medium text-brand-dark">{shipment.receiver_email}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-xl border-2 border-gray-200 shadow-md mb-8">
                    <h3 className="text-xl font-bold mb-5 text-brand-dark border-b-2 border-brand-accent/20 pb-3">Shipment Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div>
                        <p className="text-gray-500 text-sm mb-1 font-semibold">Origin</p>
                        <p className="font-medium text-brand-dark">{shipment.origin}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm mb-1 font-semibold">Package</p>
                        <p className="font-medium text-brand-dark">{shipment.product}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm mb-1 font-semibold">Status</p>
                        <p className="font-medium text-brand-accent">{shipment.status}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm mb-1 font-semibold">Destination</p>
                        <p className="font-medium text-brand-dark">{shipment.destination}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm mb-1 font-semibold">Carrier</p>
                        <p className="font-medium text-brand-dark">{shipment.carrier}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm mb-1 font-semibold">Type of Shipment</p>
                        <p className="font-medium text-brand-dark">{shipment.type_of_shipment}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm mb-1 font-semibold">Weight</p>
                        <p className="font-medium text-brand-dark">{shipment.weight}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm mb-1 font-semibold">Shipment Mode</p>
                        <p className="font-medium text-brand-dark">{shipment.shipment_mode}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm mb-1 font-semibold">Carrier Reference No.</p>
                        <p className="font-medium text-brand-dark">{shipment.carrier_reference}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm mb-1 font-semibold">Product</p>
                        <p className="font-medium text-brand-dark">{shipment.product}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm mb-1 font-semibold">Qty</p>
                        <p className="font-medium text-brand-dark">{shipment.quantity}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm mb-1 font-semibold">Payment Mode</p>
                        <p className="font-medium text-brand-dark">{shipment.payment_mode}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm mb-1 font-semibold">Total Freight</p>
                        <p className="font-medium text-brand-dark">{shipment.total_freight}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm mb-1 font-semibold">Expected Delivery Date</p>
                        <p className="font-medium text-brand-dark">{formatDate(shipment.expected_delivery_date)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm mb-1 font-semibold">Departure Date</p>
                        <p className="font-medium text-brand-dark">{formatDate(shipment.departure_date)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm mb-1 font-semibold">Departure Time</p>
                        <p className="font-medium text-brand-dark">{shipment.departure_time}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm mb-1 font-semibold">Delivery Time</p>
                        <p className="font-medium text-brand-dark">{shipment.delivery_time}</p>
                      </div>
                    </div>
                  </div>

                  {shipment.comment && (
                    <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-l-4 border-amber-400 p-6 mb-8 rounded-r-xl shadow-md">
                      <p className="font-bold text-amber-800 mb-2 flex items-center gap-2">
                        <span className="text-lg">⚠️</span> Important Information
                      </p>
                      <p className="text-amber-900">{shipment.comment}</p>
                    </div>
                  )}

                  {/* Image de l'envoi */}
                  {shipment.image_url && (
                    <div className="bg-white p-6 rounded-xl border-2 border-gray-200 shadow-md mb-8">
                      <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-brand-dark">
                        <Package size={24} className="text-brand-accent" />
                        Shipment Image
                      </h3>
                      <img
                        src={shipment.image_url}
                        alt="Shipment"
                        className="w-full max-w-2xl mx-auto rounded-xl shadow-lg"
                      />
                    </div>
                  )}

                  {/* Google Map de la Chine */}
                  <div className="bg-white p-6 rounded-xl border-2 border-gray-200 shadow-md mb-8">
                    <h3 className="text-xl font-bold mb-5 flex items-center gap-2 text-brand-dark">
                      <MapPin size={24} className="text-brand-accent" />
                      Location Map - China
                    </h3>
                    
                    <div className="mb-4 bg-gradient-to-r from-brand-light/50 to-gray-50 p-4 rounded-xl border border-brand-accent/20">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-brand-accent rounded-full animate-pulse shadow-lg"></div>
                          <span className="font-bold text-brand-dark">Origin: {shipment.origin}</span>
                        </div>
                        <div className="text-gray-600 font-medium">
                          <MapPin size={16} className="inline mr-1 text-brand-accent" />
                          China
                        </div>
                      </div>
                    </div>
                    
                    {/* Google Map intégrée */}
                    <div className="rounded-xl overflow-hidden border-2 border-gray-200 shadow-lg" style={{height: '400px'}}>
                      <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d29532.261909129487!2d114.15769!3d22.28552!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3404007368c8e47b%3A0xb9382c04fcfaa30e!2sHong%20Kong!5e0!3m2!1sfr!2sfr!4v1696234567890!5m2!1sfr!2sfr"
                        width="100%"
                        height="100%"
                        style={{border: 0}}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Hong Kong Location Map"
                      ></iframe>
                    </div>
                    
                    <div className="mt-4 text-center text-sm text-gray-600 font-medium">
                      <p>📍 Shipment location: <strong className="text-brand-dark">{shipment.origin}</strong></p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-brand-dark to-brand-secondary text-white p-6 text-center">
                  <button onClick={handlePrint} className="bg-white text-brand-dark px-10 py-3.5 rounded-xl font-bold hover:bg-brand-light hover:scale-105 transition-all shadow-lg">
                    Print Details
                  </button>
                </div>
              </div>
            )}

            {!shipment && !loading && !error && (
              <div className="text-center py-20">
                <div className="bg-brand-light w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                   <Package size={48} className="text-brand-accent" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Ready to Track</h3>
                <p className="text-gray-500">Enter your tracking number above to begin.</p>
              </div>
            )}

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
