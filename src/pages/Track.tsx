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
              <div className="bg-gray-50 rounded-lg overflow-hidden shadow-lg">
                {/* Visual Tracking Progress Bar */}
                <div className="bg-white p-6 border-b-2 border-gray-200">
                  <h3 className="text-xl font-bold mb-6 text-center">Package Tracking Progress</h3>
                  <div className="max-w-4xl mx-auto">
                    {/* Progress Bar */}
                    <div className="relative mb-8">
                      <div className="flex justify-between mb-2">
                        <div className={`flex-1 text-center ${
                          shipment.tracking_stage === 'picked_up' ? 'text-red-600 font-bold' : 'text-gray-500'
                        }`}>
                          <div className="text-xs mb-1">📦</div>
                          <div className="text-xs">Picked Up</div>
                        </div>
                        <div className={`flex-1 text-center ${
                          shipment.tracking_stage === 'in_transit' ? 'text-red-600 font-bold' : 'text-gray-500'
                        }`}>
                          <div className="text-xs mb-1">🚚</div>
                          <div className="text-xs">In Transit</div>
                        </div>
                        <div className={`flex-1 text-center ${
                          shipment.tracking_stage === 'customs' ? 'text-red-600 font-bold' : 'text-gray-500'
                        }`}>
                          <div className="text-xs mb-1">🛃</div>
                          <div className="text-xs">Customs</div>
                        </div>
                        <div className={`flex-1 text-center ${
                          shipment.tracking_stage === 'out_for_delivery' ? 'text-red-600 font-bold' : 'text-gray-500'
                        }`}>
                          <div className="text-xs mb-1">🚛</div>
                          <div className="text-xs">Out for Delivery</div>
                        </div>
                        <div className={`flex-1 text-center ${
                          shipment.tracking_stage === 'delivered' ? 'text-red-600 font-bold' : 'text-gray-500'
                        }`}>
                          <div className="text-xs mb-1">✅</div>
                          <div className="text-xs">Delivered</div>
                        </div>
                      </div>
                      
                      {/* Progress Bar Container */}
                      <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="absolute top-0 left-0 h-full bg-red-600 transition-all duration-500"
                          style={{ width: `${shipment.tracking_progress || 0}%` }}
                        ></div>
                      </div>
                      <div className="text-center mt-2 text-sm font-medium text-gray-700">
                        {shipment.tracking_progress || 0}% Complete
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 border-b-2 border-gray-200">
                  <div className="tracking-info-detail">
                    <div className="tracking-box bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="tracking-time-box mb-3">
                        <div className="tracking-time text-lg font-bold text-gray-800">
                          {shipment.status_date ? formatDate(shipment.status_date) : 'N/A'}
                        </div>
                        <span className="text-sm text-gray-600">{shipment.status_time || 'N/A'}</span>
                      </div>
                      <div className="tracking-location style-7 flex items-start gap-3">
                        <span className="dott w-3 h-3 bg-red-500 rounded-full mt-1 flex-shrink-0 animate-pulse"></span>
                        <div className="flex-1">
                          <strong className="text-red-600 font-bold block mb-2">{shipment.status}</strong>
                          
                          {/* Display Insurances */}
                          {shipment.insurances && shipment.insurances.length > 0 && (
                            <div className="mb-3">
                              <p className="text-sm font-semibold text-gray-700 mb-1">Insurances:</p>
                              {shipment.insurances.map((insurance, index) => (
                                <div key={index} className="text-sm text-gray-700 ml-2 mb-1">
                                  • {insurance.name}: {insurance.amount} 
                                  <span className={`ml-2 px-2 py-0.5 rounded text-xs ${
                                    insurance.paid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                  }`}>
                                    {insurance.paid ? 'PAID' : 'NOT PAID'}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {/* Display Import Tax */}
                          {shipment.import_tax && (
                            <div className="text-sm text-gray-700">
                              <span className="font-semibold">Import Tax:</span> {shipment.import_tax}
                              <span className={`ml-2 px-2 py-0.5 rounded text-xs ${
                                shipment.import_tax_paid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
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

                <div className="p-6">
                  <div className="flex items-center justify-center mb-8">
                    <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                      {qrCodeUrl ? (
                        <div className="text-center">
                          <img
                            src={qrCodeUrl}
                            alt="QR Code"
                            className="mx-auto mb-2"
                            style={{width: '120px', height: '120px'}}
                          />
                          <p className="text-center text-xs font-bold">{shipment.tracking_number}</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center" style={{width: '120px', height: '120px'}}>
                          <svg className="animate-spin h-8 w-8 text-red-600 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <p className="text-xs text-gray-500">Loading QR...</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <User size={24} className="text-red-600" />
                        Shipper Information
                      </h3>
                      <div className="space-y-3 text-sm">
                        <div>
                          <p className="text-gray-500">Name</p>
                          <p className="font-medium">{shipment.shipper_name}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Address</p>
                          <p className="font-medium">{shipment.shipper_address}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Phone Number</p>
                          <p className="font-medium">{shipment.shipper_phone}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Email</p>
                          <p className="font-medium">{shipment.shipper_email}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <User size={24} className="text-red-600" />
                        Receiver Information
                      </h3>
                      <div className="space-y-3 text-sm">
                        <div>
                          <p className="text-gray-500">Name</p>
                          <p className="font-medium">{shipment.receiver_name}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Address</p>
                          <p className="font-medium">{shipment.receiver_address}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Phone Number</p>
                          <p className="font-medium">{shipment.receiver_phone}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Email</p>
                          <p className="font-medium">{shipment.receiver_email}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg border border-gray-200 mb-8">
                    <h3 className="text-xl font-bold mb-4">Shipment Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div>
                        <p className="text-gray-500 text-sm mb-1">Origin</p>
                        <p className="font-medium">{shipment.origin}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm mb-1">Package</p>
                        <p className="font-medium">{shipment.product}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm mb-1">Status</p>
                        <p className="font-medium">{shipment.status}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm mb-1">Destination</p>
                        <p className="font-medium">{shipment.destination}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm mb-1">Carrier</p>
                        <p className="font-medium">{shipment.carrier}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm mb-1">Type of Shipment</p>
                        <p className="font-medium">{shipment.type_of_shipment}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm mb-1">Weight</p>
                        <p className="font-medium">{shipment.weight}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm mb-1">Shipment Mode</p>
                        <p className="font-medium">{shipment.shipment_mode}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm mb-1">Carrier Reference No.</p>
                        <p className="font-medium">{shipment.carrier_reference}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm mb-1">Product</p>
                        <p className="font-medium">{shipment.product}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm mb-1">Qty</p>
                        <p className="font-medium">{shipment.quantity}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm mb-1">Payment Mode</p>
                        <p className="font-medium">{shipment.payment_mode}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm mb-1">Total Freight</p>
                        <p className="font-medium">{shipment.total_freight}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm mb-1">Expected Delivery Date</p>
                        <p className="font-medium">{formatDate(shipment.expected_delivery_date)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm mb-1">Departure Date</p>
                        <p className="font-medium">{formatDate(shipment.departure_date)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm mb-1">Departure Time</p>
                        <p className="font-medium">{shipment.departure_time}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm mb-1">Delivery Time</p>
                        <p className="font-medium">{shipment.delivery_time}</p>
                      </div>
                    </div>
                  </div>

                  {shipment.comment && (
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-8">
                      <p className="font-bold text-yellow-800 mb-2">Important Information</p>
                      <p className="text-yellow-900">{shipment.comment}</p>
                    </div>
                  )}

                  {/* Image de l'envoi */}
                  {shipment.image_url && (
                    <div className="bg-white p-6 rounded-lg border border-gray-200 mb-8">
                      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Package size={24} className="text-red-600" />
                        Shipment Image
                      </h3>
                      <img
                        src={shipment.image_url}
                        alt="Shipment"
                        className="w-full max-w-2xl mx-auto rounded-lg shadow-md"
                      />
                    </div>
                  )}

                  {/* Google Map de la Chine */}
                  <div className="bg-white p-6 rounded-lg border border-gray-200 mb-8">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <MapPin size={24} className="text-red-600" />
                      Location Map - China
                    </h3>
                    
                    <div className="mb-4 bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                          <span className="font-medium">Origin: {shipment.origin}</span>
                        </div>
                        <div className="text-gray-600">
                          <MapPin size={16} className="inline mr-1" />
                          China
                        </div>
                      </div>
                    </div>
                    
                    {/* Google Map intégrée */}
                    <div className="rounded-lg overflow-hidden border-2 border-gray-200" style={{height: '400px'}}>
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
                    
                    <div className="mt-3 text-center text-sm text-gray-600">
                      <p>📍 Shipment location: <strong>{shipment.origin}</strong></p>
                    </div>
                  </div>
                </div>

                <div className="bg-red-600 text-white p-6 text-center">
                  <button onClick={handlePrint} className="bg-white text-red-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition">
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
