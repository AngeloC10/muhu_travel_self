import React, { useEffect, useState } from 'react';
import { GenericTable } from '../../components/GenericTable';
import { Icons } from '../../components/Icons';
import { Reservation } from '../../types';
import { db } from '../../services/backend-db';
import { useNavigate } from 'react-router-dom';

export const ReservationList: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    db.getReservations().then((data) => {
      const mappedData = data.map(r => ({
        ...r,
        clientName: r.client?.fullName || r.clientName || '',
        packageName: r.package?.name || r.packageName || ''
      }));
      setReservations(mappedData);
    });
  }, []);

  return (
    <GenericTable<Reservation>
      title="Gestión de Reservas"
      data={reservations}
      onAdd={() => navigate('/reservations/new')}
      searchOptions={[
        { label: 'Código', value: 'reservationCode' },
        { label: 'Cliente', value: 'clientName' },
        { label: 'Paquete', value: 'packageName' },
      ]}
      columns={[
        { header: 'Código', accessor: (r) => <span className="font-mono font-bold text-indigo-600">{r.reservationCode}</span> },
        { header: 'Cliente', accessor: (r) => r.client?.fullName || r.clientName || 'N/A' },
        { header: 'Paquete', accessor: (r) => r.package?.name || r.packageName || 'N/A' },
        { header: 'Fecha Viaje', accessor: (r) => r.travelDate },
        { header: 'Pax', accessor: (r) => r.adultCount },
        { header: 'Total', accessor: (r) => <span className="font-bold">S/ {r.totalAmount}</span> },
        {
          header: 'Estado', accessor: (r) => (
            <span className={`px-2 py-1 rounded-full text-xs font-bold ${r.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
              r.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
              }`}>
              {r.status}
            </span>
          )
        },
      ]}
      expandableContent={(reservation) => (
        <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
          <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center">
            <Icons.Users className="mr-2" size={16} /> Lista de Pasajeros
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reservation.passengers.map((pax, idx) => (
              <div key={idx} className="flex items-start p-3 bg-gray-50 rounded border border-gray-100">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs mr-3">
                  {idx + 1}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">{pax.firstName} {pax.lastName}</p>
                  <p className="text-xs text-gray-500">{pax.docType}: {pax.docNumber}</p>
                  <p className="text-xs text-gray-500">{pax.nationality} • {pax.gender === 'M' ? 'Masculino' : 'Femenino'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    />
  );
};