
import React, { useEffect, useState } from 'react';
import { GenericTable, SearchOption } from '../components/GenericTable';
import { db } from '../services/backend-db';
import { Client, Employee, Provider, TourPackage, User, UserRole } from '../types';
import { Icons } from '../components/Icons';
import { useAuth } from '../context/AuthContext';

type EntityType = 'users' | 'clients' | 'employees' | 'providers' | 'packages';

interface Props {
  type: EntityType;
  title: string;
}

export const EntityManager: React.FC<Props> = ({ type, title }) => {
  const { user } = useAuth();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState('');

  // Simple Modal State for Create/Edit (Simplified for demo)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<any>({});

  const loadData = async () => {
    setLoading(true);
    let res: any[] = [];
    switch (type) {
      case 'users': res = await db.getUsers(); break;
      case 'clients': res = await db.getClients(); break;
      case 'employees': res = await db.getEmployees(); break;
      case 'providers': res = await db.getProviders(); break;
      case 'packages': res = await db.getPackages(); break;
    }
    setData(res);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, [type]);

  // Logic: Soft Delete for Employees/Providers, Hard Delete for others
  const handleDelete = async (item: any) => {
    const isSoftDelete = type === 'employees' || type === 'providers';
    const actionVerb = isSoftDelete ? 'desactivar' : 'eliminar';

    if (!window.confirm(`¿Estás seguro de ${actionVerb} este registro?`)) return;

    if (type === 'packages') await db.deletePackage(item.id);
    else if (type === 'employees') await db.deleteEmployee(item.id);
    else if (type === 'providers') await db.deleteProvider(item.id);

    // Show success message for deactivation
    if (isSoftDelete) {
      setSuccessMsg(`${type === 'employees' ? 'Empleado' : 'Proveedor'} desactivado con éxito.`);
      setTimeout(() => setSuccessMsg(''), 3000);
    }

    await loadData();
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (type === 'packages') {
      await db.savePackage({
        ...formData,
        id: formData.id,
        destinations: typeof formData.destinations === 'string'
          ? formData.destinations.split(',').map((d: string) => d.trim()).filter(Boolean)
          : formData.destinations
      });
    }
    else if (type === 'employees') {
      const empData = {
        ...formData,
        id: formData.id,
        hireDate: formData.hireDate || new Date().toISOString().split('T')[0],
        status: formData.status || 'ACTIVE'
      };
      await db.saveEmployee(empData);
    }
    else if (type === 'providers') {
      const provData = {
        ...formData,
        id: formData.id,
        status: formData.status || 'ACTIVE'
      };
      await db.saveProvider(provData);
    }

    setIsModalOpen(false);
    await loadData();

    // Show success alert
    setSuccessMsg('¡Registro guardado con éxito!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  // Define search options based on type
  const getSearchOptions = (): SearchOption<any>[] => {
    switch (type) {
      case 'clients': return [
        { label: 'Nombre', value: 'fullName' },
        { label: 'Nro. Documento', value: 'docNumber' }
      ];
      case 'employees': return [
        { label: 'Nombre', value: 'fullName' },
        { label: 'Cargo', value: 'position' }
      ];
      case 'providers': return [
        { label: 'Nombre', value: 'companyName' },
        { label: 'Servicio', value: 'serviceType' }
      ];
      case 'packages': return [
        { label: 'Nombre', value: 'name' }
      ];
      default: return [];
    }
  };

  // Define columns dynamically
  const getColumns = () => {
    switch (type) {
      case 'clients': return [
        { header: 'Nombre', accessor: (c: Client) => <span className="font-medium">{c.fullName}</span> },
        { header: 'Documento', accessor: (c: Client) => <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">{c.docType} {c.docNumber}</span> },
        { header: 'Contacto', accessor: (c: Client) => <div className="text-xs">{c.email}<br />{c.phone}</div> },
      ];
      case 'packages': return [
        { header: 'Nombre Paquete', accessor: (p: TourPackage) => <div className="font-bold text-indigo-900">{p.name}</div> },
        { header: 'Precio', accessor: (p: TourPackage) => <span className="text-emerald-600 font-bold">S/ {p.price}</span> },
        { header: 'Duración', accessor: (p: TourPackage) => `${p.durationDays} Días` },
        { header: 'Max Pax', accessor: (p: TourPackage) => p.maxPax },
        { header: 'Destinos', accessor: (p: TourPackage) => p.destinations?.join(', ') || 'N/A' },
      ];
      case 'employees': return [
        {
          header: 'Empleado', accessor: (e: Employee) => (
            <div>
              <div className="font-bold text-gray-800">{e.fullName}</div>
              <div className="text-xs text-gray-500">{e.email}</div>
            </div>
          )
        },
        { header: 'Cargo', accessor: (e: Employee) => <span className="bg-blue-50 text-blue-700 border border-blue-100 text-xs font-semibold px-2 py-1 rounded-lg">{e.position}</span> },
        { header: 'Teléfono', accessor: (e: Employee) => <span className="text-sm text-gray-600">{e.phone}</span> },
        {
          header: 'Estado', accessor: (e: Employee) => (
            <span className={`px-2 py-1 rounded-full text-xs font-bold border ${e.status === 'ACTIVE'
              ? 'bg-green-50 text-green-700 border-green-200'
              : 'bg-red-50 text-red-700 border-red-200'
              }`}>
              {e.status === 'ACTIVE' ? 'Activo' : 'Inactivo'}
            </span>
          )
        },
      ];
      case 'providers': return [
        { header: 'Empresa', accessor: (p: Provider) => p.companyName },
        { header: 'Servicio', accessor: (p: Provider) => p.serviceType },
        { header: 'Contacto', accessor: (p: Provider) => p.contactName },
        {
          header: 'Estado', accessor: (p: Provider) => (
            <span className={`px-2 py-1 rounded-full text-xs font-bold border ${p.status === 'ACTIVE'
              ? 'bg-green-50 text-green-700 border-green-200'
              : 'bg-red-50 text-red-700 border-red-200'
              }`}>
              {p.status === 'ACTIVE' ? 'Activo' : 'Inactivo'}
            </span>
          )
        },
      ];
      case 'users': return [
        { header: 'Nombre', accessor: (u: User) => u.name },
        { header: 'Email', accessor: (u: User) => u.email },
        { header: 'Rol', accessor: (u: User) => u.role },
      ];
      default: return [];
    }
  };

  // Simple form generator based on type
  const renderFormFields = () => {
    if (type === 'packages') return (
      <>
        <input className="border p-2 w-full mb-2 rounded" placeholder="Nombre Paquete" value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
        <textarea className="border p-2 w-full mb-2 rounded" placeholder="Descripción" value={formData.description || ''} onChange={e => setFormData({ ...formData, description: e.target.value })} />
        <div className="flex gap-2">
          <input type="number" className="border p-2 w-1/2 mb-2 rounded" placeholder="Precio" value={formData.price || ''} onChange={e => setFormData({ ...formData, price: Number(e.target.value) })} required />
          <input type="number" className="border p-2 w-1/2 mb-2 rounded" placeholder="Días" value={formData.durationDays || ''} onChange={e => setFormData({ ...formData, durationDays: Number(e.target.value) })} required />
        </div>
        <input type="number" className="border p-2 w-full mb-2 rounded" placeholder="Max Personas" value={formData.maxPax || ''} onChange={e => setFormData({ ...formData, maxPax: Number(e.target.value) })} required />
        <input className="border p-2 w-full mb-2 rounded" placeholder="Destinos (separados por coma)" value={Array.isArray(formData.destinations) ? formData.destinations.join(', ') : formData.destinations || ''} onChange={e => setFormData({ ...formData, destinations: e.target.value })} />
      </>
    );

    if (type === 'employees') return (
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1">Nombre Completo</label>
          <input
            className="border border-gray-300 p-2 w-full rounded focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="Ej. Juan Perez"
            value={formData.fullName || ''}
            onChange={e => setFormData({ ...formData, fullName: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1">Cargo / Puesto</label>
          <input
            className="border border-gray-300 p-2 w-full rounded focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="Ej. Guía de Turismo"
            value={formData.position || ''}
            onChange={e => setFormData({ ...formData, position: e.target.value })}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">Email</label>
            <input
              type="email"
              className="border border-gray-300 p-2 w-full rounded focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="correo@empresa.com"
              value={formData.email || ''}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">Teléfono</label>
            <input
              type="tel"
              className="border border-gray-300 p-2 w-full rounded focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="999888777"
              value={formData.phone || ''}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1">Estado</label>
          <select
            className="border border-gray-300 p-2 w-full rounded focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
            value={formData.status || 'ACTIVE'}
            onChange={e => setFormData({ ...formData, status: e.target.value })}
          >
            <option value="ACTIVE">Activo</option>
            <option value="INACTIVE">Inactivo</option>
          </select>
        </div>
      </div>
    );

    if (type === 'providers') return (
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1">Nombre Empresa</label>
          <input
            className="border border-gray-300 p-2 w-full rounded focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="Nombre Empresa"
            value={formData.companyName || ''}
            onChange={e => setFormData({ ...formData, companyName: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1">Tipo de Servicio</label>
          <select
            className="border border-gray-300 p-2 w-full rounded focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
            value={formData.serviceType || ''}
            onChange={e => setFormData({ ...formData, serviceType: e.target.value })}
          >
            <option value="">Seleccione Tipo</option>
            <option value="Transport">Transporte</option>
            <option value="Hotel">Hotel</option>
            <option value="Guide">Guía Externo</option>
            <option value="Restaurant">Restaurante</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1">Nombre de Contacto</label>
          <input
            className="border border-gray-300 p-2 w-full rounded focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="Contacto"
            value={formData.contactName || ''}
            onChange={e => setFormData({ ...formData, contactName: e.target.value })}
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <input
            className="border border-gray-300 p-2 w-full rounded focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="Email"
            value={formData.email || ''}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
          />
          <input
            className="border border-gray-300 p-2 w-full rounded focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="Teléfono"
            value={formData.phone || ''}
            onChange={e => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1">Estado</label>
          <select
            className="border border-gray-300 p-2 w-full rounded focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
            value={formData.status || 'ACTIVE'}
            onChange={e => setFormData({ ...formData, status: e.target.value })}
          >
            <option value="ACTIVE">Activo</option>
            <option value="INACTIVE">Inactivo</option>
          </select>
        </div>
      </div>
    );

    return <p className="text-red-500">Formulario no disponible.</p>;
  };

  return (
    <div className="space-y-6 relative">
      {/* Success Alert */}
      {successMsg && (
        <div className="fixed top-20 right-6 z-50 animate-fade-in-left">
          <div className="bg-emerald-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center">
            <Icons.Success className="mr-3 text-white" size={24} />
            <span className="font-medium">{successMsg}</span>
          </div>
        </div>
      )}

      <GenericTable
        key={type}
        title={title}
        data={data}
        searchOptions={getSearchOptions()}
        columns={getColumns()}
        onAdd={
          (user?.role === UserRole.AGENT && (type === 'packages' || type === 'employees' || type === 'providers'))
            ? undefined
            : (type !== 'clients' && type !== 'users' ? () => { setFormData(type === 'employees' || type === 'providers' ? { status: 'ACTIVE' } : {}); setIsModalOpen(true); } : undefined)
        }
        onDelete={
          (user?.role === UserRole.AGENT && (type === 'packages' || type === 'employees' || type === 'providers'))
            ? undefined
            : ((type !== 'users' && type !== 'employees' && type !== 'providers' && type !== 'clients') ? handleDelete : undefined)
        }
        onEdit={
          (user?.role === UserRole.AGENT && (type === 'packages' || type === 'employees' || type === 'providers'))
            ? undefined
            : (type !== 'clients' && type !== 'users' ? (item) => { setFormData(item); setIsModalOpen(true); } : undefined)
        }
      />

      {/* Simple Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md animate-fade-in-up">
            <h3 className="text-lg font-bold mb-4 text-slate-800 border-b pb-2">
              {formData.id ? 'Editar' : 'Registrar'} {type === 'employees' ? 'Empleado' : type === 'providers' ? 'Proveedor' : 'Paquete'}
            </h3>
            <form onSubmit={handleSave}>
              {renderFormFields()}
              <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded font-medium transition-colors">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 font-medium shadow-md shadow-indigo-200 transition-all">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
