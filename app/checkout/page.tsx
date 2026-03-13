'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, Suspense, useEffect, useRef } from 'react';
import { getServiceBySlug } from '@/lib/services-data';
import { createOrder as createLocalOrder } from '@/lib/order-manager';
import { Service, Package as PackageType } from '@/lib/types';
import { useCreateOrder, useOrder } from '@/hooks/use-orders';
import {
  CheckCircle,
  ArrowLeft,
  Loader,
  AlertTriangle,
  ExternalLink,
  Zap,
  ArrowRight,
} from 'lucide-react';

type CheckoutPhase = 'form' | 'payment' | 'processing' | 'confirmed' | 'failed';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [profileLink, setProfileLink] = useState('');
  const [orderError, setOrderError] = useState('');
  const [phase, setPhase] = useState<CheckoutPhase>('form');
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [backendOrderId, setBackendOrderId] = useState<string | null>(null);
  const sseRef = useRef<EventSource | null>(null);

  const serviceId = searchParams.get('service');
  const packageId = searchParams.get('package');

  const [service, setService] = useState<Service | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<PackageType | null>(null);

  const createOrderMutation = useCreateOrder();
  const { data: orderData } = useOrder(backendOrderId, phase === 'payment' || phase === 'processing');

  useEffect(() => {
    if (serviceId) {
      const svc = getServiceBySlug(serviceId);
      if (svc) {
        setService(svc);
        if (packageId) {
          if (packageId.startsWith('offer-')) {
            const offServiceId = parseInt(searchParams.get('serviceId') ?? '0', 10);
            const offQuantity = parseInt(searchParams.get('quantity') ?? '0', 10);
            const offPrice = parseFloat(searchParams.get('price') ?? '0');
            if (offServiceId && offQuantity && offPrice) {
              setSelectedPackage({
                id: packageId,
                name: `Special Offer — ${offQuantity} units`,
                quantityLabel: `${offQuantity} units`,
                description: `Special Offer for ${offQuantity} units`,
                price: offPrice,
                quantity: offQuantity,
                serviceCategory: svc.packages[0]?.serviceCategory ?? 'followers',
                ssmServiceId: offServiceId,
              } as PackageType);
            }
          } else {
            const pkg = svc.packages.find((p) => p.id === packageId);
            if (pkg) setSelectedPackage(pkg);
          }
        }
      }
    }
  }, [serviceId, packageId, searchParams]);

  useEffect(() => {
    if (!orderData?.data) return;
    const orderStatus = orderData.data.status;
    const paymentStatus = orderData.data.payment?.status;

    if (orderStatus === 'COMPLETED' || orderStatus === 'PROCESSING') {
      setPhase('confirmed');
    } else if (orderStatus === 'FAILED') {
      setPhase('failed');
    } else if (paymentStatus === 'SUCCESS' && phase === 'payment') {
      setPhase('processing');
    } else if (paymentStatus === 'FAILED') {
      setPhase('failed');
    }
  }, [orderData, phase]);

  useEffect(() => {
    if (!backendOrderId || phase === 'form' || phase === 'confirmed') return;

    const sse = new EventSource(`/api/sse/${backendOrderId}`);
    sseRef.current = sse;

    sse.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.status === 'PROCESSING' || data.status === 'COMPLETED') setPhase('confirmed');
        if (data.status === 'FAILED') setPhase('failed');
        if (data.paymentStatus === 'SUCCESS' && phase === 'payment') setPhase('processing');
      } catch { /* ignore */ }
    };

    return () => { sse.close(); sseRef.current = null; };
  }, [backendOrderId, phase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();


    if (!service || !selectedPackage) { setOrderError('Invalid service or package'); return; }

    try {
      const isInstagram = serviceId === 'instagram';
      const result = await createOrderMutation.mutateAsync({
        serviceId: selectedPackage.ssmServiceId ?? 1,
        link: profileLink,
        quantity: selectedPackage.quantity,
        amount: selectedPackage.price,
        serviceCategory: (isInstagram ? (selectedPackage.serviceCategory ?? 'followers') : 'followers') as 'followers' | 'likes' | 'comments' | 'views',
      });

      if (result.success && result.data) {
        const localOrder = createLocalOrder(service.id, service.name, selectedPackage.id, selectedPackage.quantityLabel ?? `${selectedPackage.quantity}`, selectedPackage.quantity, selectedPackage.price, profileLink);
        if (typeof window !== 'undefined') {
          const orders = JSON.parse(localStorage.getItem('orders') || '[]');
          const idx = orders.findIndex((o: { orderId: string }) => o.orderId === localOrder.orderId);
          if (idx !== -1) {
            orders[idx].backendOrderId = result.data.orderId;
            localStorage.setItem('orders', JSON.stringify(orders));
          }
        }
        router.push(`/payment/status?orderId=${result.data.orderId}`);
      } else {
        setOrderError(result.message || 'Failed to create order');
      }
    } catch (err) {
      setOrderError((err as Error).message || 'Failed to create order.');
    }
  };

  if (!service || !selectedPackage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-400 mb-4">Invalid package selected</p>
          <button onClick={() => router.push('/')} className="text-amber-600 hover:text-amber-700 font-semibold flex items-center gap-2 justify-center">
            <ArrowLeft size={20} /> Go back to home
          </button>
        </div>
      </div>
    );
  }

  const isLoading = createOrderMutation.isPending;
  const error = orderError || createOrderMutation.error?.message;
  const btnClass = service.accentColor;
  const textClass = service.accentText;

  return (
    <div className="min-h-screen pt-6 sm:pt-8 lg:pt-12 pb-10 sm:pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl lg:max-w-5xl mx-auto">

        {phase === 'form' && (
          <>
            <div className="mb-6 sm:mb-8">
              <button onClick={() => router.back()} className={`flex items-center gap-2 ${textClass} font-semibold mb-3 text-sm sm:text-base`}>
                <ArrowLeft size={18} /> Go Back
              </button>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Checkout</h1>
              <p className="text-gray-500 mt-1 text-sm sm:text-base">Complete your purchase and watch your engagement grow</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
                <div className="lg:col-span-2 space-y-5 sm:space-y-6">

                  <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 shadow-sm">
                    <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Order Summary</h2>
                    <div className="space-y-3 text-gray-600 text-sm sm:text-base">
                      <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                        <span>Service</span>
                        <span className="font-semibold text-gray-800">{service.name}</span>
                      </div>
                      <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                        <span>Package</span>
                        <span className="font-semibold text-gray-800">{selectedPackage.quantityLabel}</span>
                      </div>
                      {selectedPackage.serviceCategory && (
                        <div className="flex justify-between items-center">
                          <span>Type</span>
                          <span className={`font-semibold capitalize ${textClass}`}>{selectedPackage.serviceCategory}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 shadow-sm">
                    <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Enter Your Link</h2>
                    <label className="block text-xs sm:text-sm text-gray-600 mb-2">
                      {selectedPackage.serviceCategory === 'followers' ? 'Instagram Profile URL' : 'Instagram Post / Reel URL'}
                    </label>
                    <input
                      type="text"
                      placeholder={selectedPackage.serviceCategory === 'followers' ? 'https://instagram.com/yourprofile' : 'https://instagram.com/p/abc123 or /reel/abc123'}
                      value={profileLink}
                      onChange={(e) => { setProfileLink(e.target.value); setOrderError(''); }}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-400 transition-all text-sm"
                    />
                    <div className="flex items-start gap-2 text-xs sm:text-sm text-gray-500 mt-3">
                      <CheckCircle size={16} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span>We never ask for your password or sensitive information</span>
                    </div>
                  </div>



                  <button type="submit" disabled={isLoading} className={`w-full ${btnClass} disabled:bg-gray-300 disabled:hover:bg-gray-300 text-white font-bold py-3 sm:py-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base`}>
                    {isLoading ? (<><Loader size={18} className="animate-spin" />{createOrderMutation.isPending ? 'Creating Order...' : 'Validating...'}</>) : '💳 Pay with UPI'}
                  </button>
                  <p className="text-center text-xs text-gray-400">Secure UPI payment via ZapUPI</p>
                </div>

                <div className="lg:sticky lg:top-8 h-fit">
                  <div className={`bg-gradient-to-br ${service.bgGradient} rounded-lg p-4 sm:p-6 text-white shadow-xl mt-6 lg:mt-0`}>
                    <h3 className="text-base sm:text-lg font-bold mb-4 sm:mb-6">Total Cost</h3>
                    <div className="flex justify-between items-center text-white/80 mb-4 text-sm sm:text-base">
                      <span>{selectedPackage.quantityLabel}</span>
                      <span className="font-semibold text-white">₹{selectedPackage.price}</span>
                    </div>
                    <div className="border-t border-white/20 pt-4">
                      <div className="flex justify-between items-center text-lg font-bold">
                        <span>Total</span>
                        <span className="text-xl sm:text-2xl">₹{selectedPackage.price}</span>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/20 text-xs text-white/80 space-y-1">
                      <p>🔒 Secure UPI Payment</p>
                      <p>⚡ Instant Confirmation</p>
                      <p>📱 All UPI apps supported</p>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </>
        )}

        {phase === 'payment' && paymentUrl && (
          <div className="max-w-lg mx-auto">
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-lg">
              <div className={`bg-gradient-to-r ${service.bgGradient} px-6 py-4`}>
                <h2 className="text-lg font-bold text-white flex items-center gap-2"><Zap size={20} />Complete Your Payment</h2>
                <p className="text-white/80 text-sm mt-1">Scan the QR code or pay using your UPI app</p>
              </div>
              <div className="p-4 sm:p-6">
                <div className="rounded-xl overflow-hidden border border-gray-200 bg-white mb-4">
                  <iframe src={paymentUrl} className="w-full" style={{ height: '500px', border: 'none' }} title="ZapUPI Payment" allow="payment" />
                </div>
                <a href={paymentUrl} target="_blank" rel="noopener noreferrer" className={`flex items-center justify-center gap-2 ${textClass} text-sm font-medium transition`}>
                  <ExternalLink size={14} />Having trouble? Open in new tab
                </a>
                <div className="flex items-center justify-center gap-2 text-gray-400 text-xs mt-4 pt-4 border-t border-gray-100">
                  <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span></span>
                  Listening for payment confirmation...
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5 mt-4 shadow-sm">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><p className="text-gray-400 text-xs mb-1">Service</p><p className="text-gray-800 font-semibold">{service.name}</p></div>
                <div><p className="text-gray-400 text-xs mb-1">Package</p><p className="text-gray-800">{selectedPackage.quantityLabel}</p></div>
                <div><p className="text-gray-400 text-xs mb-1">Amount</p><p className={`${textClass} font-bold`}>₹{selectedPackage.price}</p></div>
                <div><p className="text-gray-400 text-xs mb-1">Order ID</p><code className={`${textClass} text-xs bg-gray-50 px-2 py-0.5 rounded font-mono`}>{backendOrderId?.substring(0, 12)}...</code></div>
              </div>
            </div>
          </div>
        )}

        {phase === 'processing' && (
          <div className="max-w-lg mx-auto">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 text-center shadow-lg">
              <div className={`w-20 h-20 mx-auto mb-6 rounded-full ${service.accentBgLight} flex items-center justify-center`}>
                <Zap size={36} className={`${textClass} animate-bounce`} />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Payment Received! 🎉</h2>
              <p className="text-gray-500 text-sm sm:text-base mb-4">Your payment has been confirmed. We&apos;re now placing your order...</p>
              <div className={`flex items-center justify-center gap-2 ${textClass} text-sm`}><Loader size={16} className="animate-spin" />Processing your order...</div>
            </div>
          </div>
        )}

        {phase === 'confirmed' && (
          <div className="max-w-lg mx-auto">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 text-center shadow-lg">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-50 flex items-center justify-center">
                <CheckCircle size={40} className="text-emerald-500" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Order Confirmed! 🚀</h2>
              <p className="text-gray-500 text-sm sm:text-base mb-6">Your order has been placed successfully.</p>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 text-left">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><p className="text-gray-400 text-xs mb-1">Service</p><p className="text-gray-800 font-semibold">{service.name}</p></div>
                  <div><p className="text-gray-400 text-xs mb-1">Package</p><p className="text-gray-800">{selectedPackage.quantityLabel}</p></div>
                  <div><p className="text-gray-400 text-xs mb-1">Amount Paid</p><p className="text-emerald-600 font-bold">₹{selectedPackage.price}</p></div>
                  <div><p className="text-gray-400 text-xs mb-1">Status</p><span className="text-emerald-600 text-xs font-semibold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">Confirmed</span></div>
                  {orderData?.data?.payment?.utr && (
                    <div className="col-span-2"><p className="text-gray-400 text-xs mb-1">UTR</p><code className="text-emerald-600 text-xs bg-gray-50 px-2 py-0.5 rounded font-mono">{orderData.data.payment.utr}</code></div>
                  )}
                </div>
              </div>

              <button onClick={() => router.push('/my-orders')} className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 mx-auto">
                View My Orders <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {phase === 'failed' && (
          <div className="max-w-lg mx-auto">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 text-center shadow-lg">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-50 flex items-center justify-center">
                <AlertTriangle size={40} className="text-red-500" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Payment Failed</h2>
              <p className="text-gray-500 text-sm sm:text-base mb-6">Your payment could not be processed. Please try again.</p>
              <button onClick={() => { setPhase('form'); setPaymentUrl(null); setBackendOrderId(null); setOrderError(''); }}
                className={`${btnClass} text-white font-bold py-3 px-8 rounded-lg transition-all duration-300`}>
                Try Again
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader size={40} className="animate-spin text-amber-500" /></div>}>
      <CheckoutContent />
    </Suspense>
  );
}
