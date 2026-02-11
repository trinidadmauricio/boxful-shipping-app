'use client';

import { useState } from 'react';
import {
  Form,
  Input,
  Button,
  DatePicker,
  Select,
  InputNumber,
  Modal,
  message,
  Switch,
} from 'antd';
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  PlusOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import type { PackageItem } from '@/types';
import BoxIcon from '@/components/icons/BoxIcon';
import TrashIcon from '@/components/icons/TrashIcon';
import OrderSentIcon from '@/components/icons/OrderSentIcon';
import PhoneInput from '@/components/PhoneInput';
import type { Dayjs } from 'dayjs';

interface OrderFormValues {
  pickupAddress: string;
  scheduledDate: Dayjs;
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  phoneCode: string;
  deliveryAddress: string;
  department: string;
  municipality: string;
  reference?: string;
  instructions?: string;
  codExpectedAmount?: number;
}

const departments = [
  'San Salvador',
  'La Libertad',
  'Santa Ana',
  'San Miguel',
  'Sonsonate',
  'Usulutan',
  'La Union',
  'La Paz',
  'Chalatenango',
  'Cuscatlan',
  'Ahuachapan',
  'Morazan',
  'San Vicente',
  'Cabanas',
];

const phoneCodes = [
  { value: '503', label: '503' },
  { value: '502', label: '502' },
  { value: '504', label: '504' },
  { value: '505', label: '505' },
  { value: '506', label: '506' },
];

export default function NewOrderPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [stepOneForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [isCod, setIsCod] = useState(false);

  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [newPkg, setNewPkg] = useState<Partial<PackageItem>>({});
  const [stepOneValues, setStepOneValues] = useState<OrderFormValues | null>(null);

  const handleStepOneNext = async () => {
    try {
      const values = await stepOneForm.validateFields();
      setStepOneValues(values);
      setStep(2);
    } catch {
      // validation errors shown by form
    }
  };

  const handleAddPackage = () => {
    if (!newPkg.content || !newPkg.weight || !newPkg.length || !newPkg.height || !newPkg.width) {
      message.warning('Completa todos los campos del paquete');
      return;
    }
    setPackages([
      ...packages,
      {
        content: newPkg.content!,
        weight: newPkg.weight!,
        length: newPkg.length!,
        height: newPkg.height!,
        width: newPkg.width!,
      },
    ]);
    setNewPkg({});
  };

  const handleRemovePackage = (index: number) => {
    setPackages(packages.filter((_, i) => i !== index));
  };

  const handleUpdatePackage = (index: number, field: keyof PackageItem, value: string | number) => {
    const updated = [...packages];
    updated[index] = { ...updated[index], [field]: value };
    setPackages(updated);
  };

  const handleSubmit = async () => {
    if (packages.length === 0) {
      message.warning('Agrega al menos un paquete');
      return;
    }

    setLoading(true);
    try {
      const formValues = stepOneValues!;
      const payload = {
        pickupAddress: formValues.pickupAddress,
        scheduledDate: formValues.scheduledDate.toISOString(),
        firstName: formValues.firstName,
        lastName: formValues.lastName,
        email: formValues.email || undefined,
        phone: formValues.phone,
        phoneCode: formValues.phoneCode || '503',
        deliveryAddress: formValues.deliveryAddress,
        department: formValues.department,
        municipality: formValues.municipality,
        reference: formValues.reference || undefined,
        instructions: formValues.instructions || undefined,
        isCod,
        codExpectedAmount: isCod ? formValues.codExpectedAmount : undefined,
        packages,
      };
      await api.post('/orders', payload);
      setSuccessOpen(true);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      message.error(axiosErr.response?.data?.message || 'Error al crear la orden');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-[57px] flex flex-col gap-3">
        <h2 className="text-[22px] font-bold leading-normal" style={{ color: 'var(--azul-oscuro)' }}>
          Crea una orden
        </h2>
        <p className="text-[16px] leading-normal" style={{ color: 'var(--dark-gray-500)' }}>
          Dale una ventaja competitiva a tu negocio con entregas{' '}
          <strong>el mismo día</strong> (Área Metropolitana) y{' '}
          <strong>el día siguiente</strong> a nivel nacional.
        </p>
      </div>

      {step === 1 && (
        <div
          className="rounded-xl border p-8"
          style={{ borderColor: 'var(--dark-gray-100)', background: 'white' }}
        >
          <h3 className="mb-10 text-[16px] font-bold" style={{ color: 'var(--azul-oscuro)' }}>
            Completa los datos
          </h3>

          <Form
            form={stepOneForm}
            layout="vertical"
            initialValues={{ phoneCode: '503' }}
            size="large"
            className="compact-form"
          >
            <div className="grid grid-cols-3 gap-x-5 gap-y-6">
              {/* Fila 1: Dirección (2 cols) + Fecha (1 col) */}
              <div className="col-span-2">
                <Form.Item
                  label="Dirección de recolección"
                  name="pickupAddress"
                  rules={[{ required: true, message: 'Requerido' }]}
                >
                  <Input placeholder="Dirección de recolección" />
                </Form.Item>
              </div>
              <Form.Item
                label="Fecha programada"
                name="scheduledDate"
                rules={[{ required: true, message: 'Requerido' }]}
              >
                <DatePicker className="w-full" placeholder="DD/MM/AAAA" format="DD/MM/YYYY" />
              </Form.Item>

              {/* Fila 2: Nombres + Apellidos + Correo (3 cols iguales) */}
              <Form.Item
                label="Nombres"
                name="firstName"
                rules={[{ required: true, message: 'Requerido' }]}
              >
                <Input placeholder="Nombres" />
              </Form.Item>
              <Form.Item
                label="Apellidos"
                name="lastName"
                rules={[{ required: true, message: 'Requerido' }]}
              >
                <Input placeholder="Apellidos" />
              </Form.Item>
              <Form.Item label="Correo electrónico" name="email">
                <Input placeholder="correo@ejemplo.com" />
              </Form.Item>

              {/* Fila 3: Teléfono (1 col) + Dirección destinatario (2 cols) */}
              <PhoneInput phoneCodes={phoneCodes} />
              <div className="col-span-2">
                <Form.Item
                  label="Dirección del destinatario"
                  name="deliveryAddress"
                  rules={[{ required: true, message: 'Requerido' }]}
                >
                  <Input placeholder="Dirección completa" />
                </Form.Item>
              </div>

              {/* Fila 4: Departamento + Municipio + Punto de referencia (3 cols iguales) */}
              <Form.Item
                label="Departamento"
                name="department"
                rules={[{ required: true, message: 'Requerido' }]}
              >
                <Select placeholder="Seleccionar" className="h-[48px]">
                  {departments.map((d) => (
                    <Select.Option key={d} value={d}>{d}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label="Municipio"
                name="municipality"
                rules={[{ required: true, message: 'Requerido' }]}
              >
                <Input placeholder="Municipio" />
              </Form.Item>
              <Form.Item label="Punto de referencia" name="reference">
                <Input placeholder="Punto de referencia" />
              </Form.Item>

              {/* Fila 5: Indicaciones (3 cols - full width) */}
              <div className="col-span-3">

                <Form.Item label="Indicaciones" name="instructions">
                  <Input placeholder="Indicaciones especiales" />
                </Form.Item>
              </div>
            </div>
          </Form>

          <div
            className="mt-10 flex items-center gap-4 rounded-xl px-4 py-[22px]"
            style={{ background: 'var(--naranja-50)' }}
          >
            <div className="flex flex-1 flex-col gap-1">
              <p className="text-[16px] font-bold" style={{ color: 'var(--azul-oscuro)' }}>
                Pago contra entrega (PCE)
              </p>
              <div className="flex items-center gap-2">
                <p className="text-[14px]" style={{ color: 'var(--dark-gray-500)' }}>
                  Tu cliente paga el <span className="font-semibold">monto que indiques</span> al momento de la entrega
                </p>
                {isCod && (
                  <Form form={stepOneForm}>
                    <Form.Item name="codExpectedAmount" style={{ marginBottom: 0 }}>
                      <InputNumber
                        prefix="$"
                        placeholder="00.00"
                        min={0}
                        precision={2}
                        style={{ width: 181, height: 48 }}
                      />
                    </Form.Item>
                  </Form>
                )}
              </div>
            </div>

            <Switch checked={isCod} onChange={setIsCod} />
          </div>

          <div className="mt-10 flex justify-end">
            <Button
              type="primary"
              icon={<ArrowRightOutlined />}
              iconPlacement="end"
              onClick={handleStepOneNext}
              style={{
                width: 159,
                height: 47,
                borderRadius: 8,
                fontWeight: 600,
                fontSize: 16,
              }}
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div
          className="rounded-xl border p-8"
          style={{ borderColor: 'var(--dark-gray-100)', background: 'white' }}
        >
          <h3 className="mb-10 text-[16px] font-bold" style={{ color: 'var(--azul-oscuro)' }}>
            Agrega tus productos
          </h3>

          {/* Input row container with gray background */}
          <div
            className="rounded-lg p-6"
            style={{ background: 'var(--dark-gray-50)' }}
          >
            {/* Input fields row */}
            <div className="flex items-end gap-3">
              {/* Box Icon */}
              <div className="pb-2">
                <BoxIcon />
              </div>

              {/* Largo */}
              <div className="flex flex-col">
                <label className="mb-2 text-[12px] font-semibold" style={{ color: 'var(--azul-900)' }}>
                  Largo
                </label>
                <InputNumber
                  value={newPkg.length}
                  onChange={(v) => setNewPkg({ ...newPkg, length: v ?? undefined })}
                  min={0}
                  placeholder="15"
                  suffix={<span style={{ color: 'var(--dark-gray-300)' }}>cm</span>}
                  style={{ width: 100, height: 48 }}
                  controls={false}
                />
              </div>

              {/* Alto */}
              <div className="flex flex-col">
                <label className="mb-2 text-[12px] font-semibold" style={{ color: 'var(--azul-900)' }}>
                  Alto
                </label>
                <InputNumber
                  value={newPkg.height}
                  onChange={(v) => setNewPkg({ ...newPkg, height: v ?? undefined })}
                  min={0}
                  placeholder="15"
                  suffix={<span style={{ color: 'var(--dark-gray-300)' }}>cm</span>}
                  style={{ width: 100, height: 48 }}
                  controls={false}
                />
              </div>

              {/* Ancho */}
              <div className="flex flex-col">
                <label className="mb-2 text-[12px] font-semibold" style={{ color: 'var(--azul-900)' }}>
                  Ancho
                </label>
                <InputNumber
                  value={newPkg.width}
                  onChange={(v) => setNewPkg({ ...newPkg, width: v ?? undefined })}
                  min={0}
                  placeholder="15"
                  suffix={<span style={{ color: 'var(--dark-gray-300)' }}>cm</span>}
                  style={{ width: 100, height: 48 }}
                  controls={false}
                />
              </div>

              {/* Peso en libras */}
              <div className="flex flex-col">
                <label className="mb-2 text-[12px] font-semibold" style={{ color: 'var(--azul-900)' }}>
                  Peso en libras
                </label>
                <Input
                  value={newPkg.weight}
                  onChange={(e) => setNewPkg({ ...newPkg, weight: parseFloat(e.target.value) || undefined })}
                  placeholder="3 libras"
                  style={{ width: 180, height: 48 }}
                />
              </div>

              {/* Contenido */}
              <div className="flex flex-1 flex-col">
                <label className="mb-2 text-[12px] font-semibold" style={{ color: 'var(--azul-900)' }}>
                  Contenido
                </label>
                <Input
                  value={newPkg.content}
                  onChange={(e) => setNewPkg({ ...newPkg, content: e.target.value })}
                  placeholder="iPhone 14 pro Max"
                  style={{ height: 48 }}
                />
              </div>
            </div>

            {/* Agregar button - separate row below */}
            <div className="mt-4 flex justify-end">
              <Button
                icon={<PlusOutlined />}
                iconPlacement="end"
                onClick={handleAddPackage}
                style={{
                  width: 159,
                  height: 47,
                  borderRadius: 8,
                  fontWeight: 600,
                  fontSize: 16,
                  borderColor: 'var(--dark-gray-100)',
                }}
              >
                Agregar
              </Button>
            </div>
          </div>

          {/* Package list */}
          {packages.length > 0 && (
            <div className="mt-6 space-y-3">
              {packages.map((pkg, index) => (
                <div
                  key={index}
                  className="flex items-end gap-6 rounded-lg border px-6 py-5"
                  style={{ borderColor: 'var(--verde-claro-border)', background: 'white' }}
                >
                  {/* Peso en libras - editable */}
                  <div className="flex flex-col gap-2" style={{ minWidth: 200 }}>
                    <label className="text-[12px] font-semibold" style={{ color: 'var(--azul-900)' }}>
                      Peso en libras
                    </label>
                    <Input
                      value={pkg.weight}
                      onChange={(e) => handleUpdatePackage(index, 'weight', parseFloat(e.target.value) || 0)}
                      placeholder="3 libras"
                      style={{ height: 48, fontSize: 16 }}
                    />
                  </div>

                  {/* Contenido - editable */}
                  <div className="flex flex-1 flex-col gap-2">
                    <label className="text-[12px] font-semibold" style={{ color: 'var(--azul-900)' }}>
                      Contenido
                    </label>
                    <Input
                      value={pkg.content}
                      onChange={(e) => handleUpdatePackage(index, 'content', e.target.value)}
                      placeholder="iPhone 14 pro Max"
                      style={{ height: 48, fontSize: 16 }}
                    />
                  </div>

                  {/* Box icon + dimensions in columns - editable */}
                  <div className="flex items-end gap-4">
                    <div className="pb-3">
                      <BoxIcon />
                    </div>
                    <div className="flex gap-4">
                      {/* Largo column */}
                      <div className="flex flex-col gap-2">
                        <label className="text-center text-[14px] font-semibold" style={{ color: 'var(--azul-900)' }}>
                          Largo
                        </label>
                        <InputNumber
                          value={pkg.length}
                          onChange={(v) => handleUpdatePackage(index, 'length', v || 0)}
                          min={0}
                          placeholder="15"
                          suffix={<span style={{ color: 'var(--dark-gray-300)' }}>cm</span>}
                          style={{ width: 100, height: 48 }}
                          controls={false}
                        />
                      </div>

                      {/* Alto column */}
                      <div className="flex flex-col gap-2">
                        <label className="text-center text-[14px] font-semibold" style={{ color: 'var(--azul-900)' }}>
                          Alto
                        </label>
                        <InputNumber
                          value={pkg.height}
                          onChange={(v) => handleUpdatePackage(index, 'height', v || 0)}
                          min={0}
                          placeholder="15"
                          suffix={<span style={{ color: 'var(--dark-gray-300)' }}>cm</span>}
                          style={{ width: 100, height: 48 }}
                          controls={false}
                        />
                      </div>

                      {/* Ancho column */}
                      <div className="flex flex-col gap-2">
                        <label className="text-center text-[14px] font-semibold" style={{ color: 'var(--azul-900)' }}>
                          Ancho
                        </label>
                        <InputNumber
                          value={pkg.width}
                          onChange={(v) => handleUpdatePackage(index, 'width', v || 0)}
                          min={0}
                          placeholder="15"
                          suffix={<span style={{ color: 'var(--dark-gray-300)' }}>cm</span>}
                          style={{ width: 100, height: 48 }}
                          controls={false}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Delete button */}
                  <button
                    onClick={() => handleRemovePackage(index)}
                    className="flex items-center justify-center"
                    style={{
                      width: 48,
                      height: 48,
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#ef4444',
                    }}
                  >
                    <TrashIcon style={{ fontSize: 20 }} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Bottom buttons */}
          <div className="mt-10 flex justify-between">
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => setStep(1)}
              style={{
                width: 159,
                height: 47,
                borderRadius: 8,
                fontWeight: 600,
                fontSize: 16,
                borderColor: 'var(--dark-gray-100)',
              }}
            >
              Regresar
            </Button>
            <Button
              type="primary"
              icon={<ArrowRightOutlined />}
              iconPlacement="end"
              loading={loading}
              onClick={handleSubmit}
              style={{
                width: 159,
                height: 47,
                borderRadius: 8,
                fontWeight: 600,
                fontSize: 16,
              }}
            >
              Enviar
            </Button>
          </div>
        </div>
      )}

      <Modal
        open={successOpen}
        footer={null}
        closable={false}
        centered
        width={498}
        styles={{ body: { padding: 20 } }}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="flex w-full justify-end">
            <button onClick={() => setSuccessOpen(false)} className="cursor-pointer text-gray-400 hover:text-gray-600">
              <CloseOutlined style={{ fontSize: 16 }} />
            </button>
          </div>

          <OrderSentIcon />

          <div className="mt-2 flex flex-col gap-2 text-center">
            <p className="text-[20px]" style={{ color: 'var(--dark-gray-700)' }}>
              Orden <strong>enviada</strong>
            </p>
            <p className="text-[14px]" style={{ color: 'var(--dark-gray-500)' }}>
              La orden ha sido creada y enviada, puedes
            </p>
          </div>

          <div className="mt-4 flex w-full justify-center gap-[10px]">
            <Button
              onClick={() => {
                setSuccessOpen(false);
                router.push('/orders');
              }}
              style={{
                width: 188,
                height: 47,
                borderRadius: 8,
                fontWeight: 600,
                fontSize: 16,
                borderColor: 'var(--dark-gray-100)',
                color: 'var(--dark-gray-500)',
              }}
            >
              Ir a inicio
            </Button>
            <Button
              type="primary"
              onClick={() => {
                setSuccessOpen(false);
                setStep(1);
                stepOneForm.resetFields();
                setPackages([]);
                setIsCod(false);
              }}
              style={{
                width: 188,
                height: 47,
                borderRadius: 8,
                fontWeight: 600,
                fontSize: 16,
              }}
            >
              Crear otra
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
