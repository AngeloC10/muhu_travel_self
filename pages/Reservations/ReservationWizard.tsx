import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icons } from '../../components/Icons';
import { TourPackage, Passenger, PaymentMethod, Reservation, Client } from '../../types';
import { db } from '../../services/backend-db';
import { DEFAULT_THEME } from '../../constants';

// --- Sub-components for each step ---

const StepIndicator = ({ currentStep }: { currentStep: number }) => {
  const steps = ['Paquete & Pax', 'Pasajeros', 'Pago', 'Facturación', 'Confirmación'];
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 -z-10"></div>
        <div className={`absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-indigo-600 -z-10 transition-all duration-500`} style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}></div>

        {steps.map((label, idx) => (
          <div key={idx} className="flex flex-col items-center bg-white px-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 
              ${idx <= currentStep ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
              {idx + 1}
            </div>
            <span className={`text-xs mt-2 font-medium ${idx <= currentStep ? 'text-indigo-600' : 'text-gray-400'}`}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const ReservationWizard: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [packages, setPackages] = useState<TourPackage[]>([]);

  // Form State
  const [selectedPackageId, setSelectedPackageId] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [adultCount, setAdultCount] = useState(1);
  const [passengers, setPassengers] = useState<Passenger[]>([]);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.CREDIT_CARD);
  const [coupon, setCoupon] = useState('');

  const [billingDocType, setBillingDocType] = useState<'DNI' | 'PASAPORTE' | 'CE'>('DNI');
  const [billingDocNum, setBillingDocNum] = useState('');
  const [billingName, setBillingName] = useState('');
  const [billingEmail, setBillingEmail] = useState('');
  const [billingPhone, setBillingPhone] = useState('');

  const [createdResCode, setCreatedResCode] = useState('');

  useEffect(() => {
    db.getPackages().then(setPackages);
  }, []);

  // Initialize passenger array when count changes
  useEffect(() => {
    setPassengers(prev => {
      const newArr = [...prev];
      if (newArr.length < adultCount) {
        for (let i = newArr.length; i < adultCount; i++) {
          newArr.push({ firstName: '', lastName: '', nationality: 'Peru', docType: 'DNI', docNumber: '', birthDate: '', gender: 'M' });
        }
      } else if (newArr.length > adultCount) {
        return newArr.slice(0, adultCount);
      }
      return newArr;
    });
  }, [adultCount]);

  const updatePassenger = (index: number, field: keyof Passenger, value: any) => {
    const newPax = [...passengers];
    newPax[index] = { ...newPax[index], [field]: field === 'firstName' || field === 'lastName' ? value.toUpperCase() : value };
    setPassengers(newPax);
  };

  const handleFinish = async () => {
    const pkg = packages.find(p => p.id === selectedPackageId);
    if (!pkg) return;

    // 1. Handle Client (Billing)
    const clientData = {
      fullName: billingName.toUpperCase(),
      docType: billingDocType,
      docNumber: billingDocNum,
      email: billingEmail,
      phone: billingPhone,
    };
    const client = await db.upsertClient(clientData);

    // 2. Create Reservation
    const total = pkg.price * adultCount; // Simple logic, coupons could reduce this

    const res = await db.createReservation({
      packageId: pkg.id,
      packageName: pkg.name,
      clientId: client.id,
      clientName: client.fullName,
      dateCreated: new Date().toISOString(),
      travelDate: travelDate,
      adultCount: adultCount,
      passengers: passengers,
      totalAmount: total,
      status: 'CONFIRMED',
      paymentMethod: paymentMethod,
      couponCode: coupon
    });

    if (res) {
      setCreatedResCode(res.reservationCode);
      setStep(4); // Success Step
    } else {
      alert("Error al crear la reserva");
    }
  };

  const selectedPkg = packages.find(p => p.id === selectedPackageId);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <button onClick={() => navigate(-1)} className="mr-4 p-2 rounded-full hover:bg-gray-200 text-gray-600">
          <Icons.Prev size={20} />
        </button>
        <h1 className="text-2xl font-serif font-bold text-slate-800">Nueva Reserva</h1>
      </div>

      <StepIndicator currentStep={step} />

      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 min-h-[500px] relative pb-24">

        {/* STEP 0: PACKAGE SELECTION */}
        {step === 0 && (
          <div className="animate-fade-in">
            <h2 className="text-xl font-bold mb-6 flex items-center"><Icons.Package className="mr-2 text-indigo-500" /> Detalles del Viaje</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Seleccionar Paquete</label>
                <select
                  className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50"
                  value={selectedPackageId} onChange={(e) => setSelectedPackageId(e.target.value)}
                >
                  <option value="">-- Seleccione --</option>
                  {packages.map(p => <option key={p.id} value={p.id}>{p.name} (S/ {p.price})</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Viaje</label>
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={travelDate} onChange={(e) => setTravelDate(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Adultos (+11 años)</label>
                <input
                  type="number" min="1" max={selectedPkg?.maxPax || 10}
                  className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={adultCount} onChange={(e) => setAdultCount(parseInt(e.target.value) || 1)}
                />
              </div>
            </div>

            {selectedPkg && (
              <div className="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-100 flex justify-between items-center">
                <div>
                  <p className="text-sm text-indigo-600 font-semibold">Total Estimado</p>
                  <p className="text-2xl font-bold text-indigo-900">S/ {(selectedPkg.price * adultCount).toFixed(2)}</p>
                </div>
                <div className="text-right text-sm text-indigo-700">
                  <p>Max Pax: {selectedPkg.maxPax}</p>
                  <p>Duración: {selectedPkg.durationDays} días</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 1: PASSENGER DETAILS */}
        {step === 1 && (
          <div className="animate-fade-in">
            <h2 className="text-xl font-bold mb-6 flex items-center"><Icons.Users className="mr-2 text-indigo-500" /> Datos de los Pasajeros</h2>
            <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2">
              {passengers.map((pax, idx) => (
                <div key={idx} className="p-5 border border-gray-200 rounded-lg bg-gray-50 relative">
                  <div className="absolute -top-3 left-4 bg-indigo-100 text-indigo-800 px-2 py-0.5 text-xs font-bold rounded">Pasajero {idx + 1}</div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                    <input placeholder="Nombres" className="p-2 border rounded" value={pax.firstName} onChange={e => updatePassenger(idx, 'firstName', e.target.value)} />
                    <input placeholder="Apellidos" className="p-2 border rounded" value={pax.lastName} onChange={e => updatePassenger(idx, 'lastName', e.target.value)} />
                    <select className="p-2 border rounded" value={pax.gender} onChange={e => updatePassenger(idx, 'gender', e.target.value)}>
                      <option value="M">Masculino</option>
                      <option value="F">Femenino</option>
                    </select>
                    <select className="p-2 border rounded" value={pax.docType} onChange={e => updatePassenger(idx, 'docType', e.target.value)}>
                      <option value="DNI">DNI</option>
                      <option value="PASAPORTE">Pasaporte</option>
                    </select>
                    <input placeholder="Num. Documento" className="p-2 border rounded" value={pax.docNumber} onChange={e => updatePassenger(idx, 'docNumber', e.target.value)} />
                    <input type="date" className="p-2 border rounded" value={pax.birthDate} onChange={e => updatePassenger(idx, 'birthDate', e.target.value)} />
                    <input placeholder="Nacionalidad" className="p-2 border rounded" value={pax.nationality} onChange={e => updatePassenger(idx, 'nationality', e.target.value)} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: PAYMENT */}
        {step === 2 && (
          <div className="animate-fade-in max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-6 flex items-center justify-center"><Icons.Payment className="mr-2 text-indigo-500" /> Método de Pago</h2>

            <div className="space-y-3">
              {[
                { id: PaymentMethod.CREDIT_CARD, label: 'Tarjeta de Crédito', icon: '💳' },
                { id: PaymentMethod.DEBIT_CARD, label: 'Tarjeta de Débito', icon: '💳' },
                { id: PaymentMethod.YAPE, label: 'Yape / Plin', icon: '📱' },
              ].map((method) => (
                <div
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id)}
                  className={`p-4 border rounded-xl cursor-pointer flex items-center transition-all ${paymentMethod === method.id ? 'border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500' : 'hover:bg-gray-50'}`}
                >
                  <div className="text-2xl mr-4">{method.icon}</div>
                  <div className="font-medium">{method.label}</div>
                  {paymentMethod === method.id && <Icons.Success className="ml-auto text-indigo-600" size={20} />}
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t">
              <label className="block text-sm font-medium text-gray-700 mb-2">Código de Cupón (Opcional)</label>
              <div className="flex">
                <input
                  type="text"
                  placeholder="MUHU2023"
                  className="flex-1 p-2 border border-gray-300 rounded-l-lg outline-none uppercase"
                  value={coupon} onChange={e => setCoupon(e.target.value)}
                />
                <button className="px-4 bg-gray-800 text-white rounded-r-lg text-sm font-medium hover:bg-gray-700">Aplicar</button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: BILLING */}
        {step === 3 && (
          <div className="animate-fade-in max-w-2xl mx-auto">
            <h2 className="text-xl font-bold mb-6 flex items-center"><Icons.Employee className="mr-2 text-indigo-500" /> Datos de Facturación</h2>
            <p className="text-sm text-gray-500 mb-4 bg-yellow-50 p-3 rounded border border-yellow-100">
              ℹ Esta persona quedará registrada como el <strong>Cliente Titular</strong> de la reserva.
            </p>

            <div className="grid grid-cols-1 gap-6">
              <div className="flex gap-4">
                <div className="w-1/3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo Doc.</label>
                  <select
                    className="w-full border p-3 rounded-lg"
                    value={billingDocType} onChange={(e: any) => setBillingDocType(e.target.value)}
                  >
                    <option value="DNI">DNI</option>
                    <option value="CE">CE</option>
                    <option value="PASAPORTE">Pasaporte</option>
                  </select>
                </div>
                <div className="w-2/3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Número Documento</label>
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full border p-3 rounded-lg pl-10"
                      value={billingDocNum} onChange={(e) => setBillingDocNum(e.target.value)}
                    />
                    <Icons.Search className="absolute left-3 top-3.5 text-gray-400 cursor-pointer hover:text-indigo-500" size={18} />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Razón Social / Nombre Completo</label>
                <input
                  type="text"
                  className="w-full border p-3 rounded-lg bg-gray-50"
                  value={billingName} onChange={(e) => setBillingName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
                  <input
                    type="email"
                    className="w-full border p-3 rounded-lg bg-gray-50"
                    placeholder="cliente@email.com"
                    value={billingEmail} onChange={(e) => setBillingEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono / WhatsApp</label>
                  <input
                    type="tel"
                    className="w-full border p-3 rounded-lg bg-gray-50"
                    placeholder="999 888 777"
                    value={billingPhone} onChange={(e) => setBillingPhone(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: SUCCESS */}
        {step === 4 && (
          <div className="animate-fade-in text-center py-10">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Icons.Success size={40} className="text-green-600" />
            </div>
            <h2 className="text-3xl font-serif font-bold text-gray-800 mb-2">¡Reserva Exitosa!</h2>
            <p className="text-gray-600 mb-6">La reserva se ha generado correctamente.</p>

            <div className="bg-gray-100 p-4 rounded-lg inline-block mb-8">
              <span className="block text-xs text-gray-500 uppercase tracking-wider">Código de Reserva</span>
              <span className="text-3xl font-mono font-bold text-indigo-600">{createdResCode}</span>
            </div>

            <div className="flex justify-center gap-4">
              <button onClick={() => navigate('/reservations')} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                Ver Reservas
              </button>
              <button onClick={() => navigate('/')} className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                Ir al Dashboard
              </button>
            </div>
          </div>
        )}

        {/* Actions Footer */}
        {step < 4 && (
          <div className="absolute bottom-0 left-0 w-full p-6 bg-gray-50 border-t border-gray-100 rounded-b-xl flex justify-between">
            <button
              onClick={() => setStep(s => Math.max(0, s - 1))}
              disabled={step === 0}
              className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center
                ${step === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-white border border-transparent hover:border-gray-200'}`}
            >
              <Icons.Prev size={18} className="mr-2" /> Anterior
            </button>

            <button
              onClick={() => {
                if (step === 3) handleFinish();
                else setStep(s => s + 1);
              }}
              disabled={!selectedPackageId}
              className={`${DEFAULT_THEME.secondaryColor} px-8 py-2 rounded-lg font-medium shadow-lg shadow-amber-500/30 transform active:scale-95 transition-all flex items-center`}
            >
              {step === 3 ? 'Finalizar Reserva' : 'Siguiente'} <Icons.Next size={18} className="ml-2" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
