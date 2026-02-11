'use client';

import { useState } from 'react';
import { Form, Input, Button, Select, DatePicker, Modal, message } from 'antd';
import { ArrowLeftOutlined, ExclamationCircleFilled, CloseOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import PhoneInput from '@/components/PhoneInput';

const phoneCodes = [
  { value: '503', label: '503' },
  { value: '502', label: '502' },
  { value: '504', label: '504' },
  { value: '505', label: '505' },
  { value: '506', label: '506' },
  { value: '507', label: '507' },
  { value: '52', label: '52' },
  { value: '1', label: '1' },
];

export default function RegisterPage() {
  const { register } = useAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [formValues, setFormValues] = useState<Record<string, unknown> | null>(null);

  const onFinish = (values: Record<string, unknown>) => {
    setFormValues(values);
    setConfirmOpen(true);
  };

  const handleConfirm = async () => {
    setConfirmOpen(false);
    setLoading(true);
    try {
      const payload = {
        name: formValues?.name as string,
        lastName: formValues?.lastName as string,
        sex: formValues?.sex as string | undefined,
        birthDate: (formValues?.birthDate as { toISOString: () => string } | undefined)?.toISOString(),
        email: formValues?.email as string,
        phone: formValues?.phone as string,
        phoneCode: (formValues?.phoneCode as string) || '503',
        password: formValues?.password as string,
      };
      await register(payload);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      message.error(axiosErr.response?.data?.message || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  const phoneCode = Form.useWatch('phoneCode', form) || '503';
  const phone = Form.useWatch('phone', form) || '';

  return (
    <div className="flex flex-col gap-[44px]">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Link href="/login" className="flex items-center" style={{ color: 'var(--azul-oscuro)' }}>
            <ArrowLeftOutlined style={{ fontSize: 18 }} />
          </Link>
          <h1 className="text-[22px] font-bold leading-normal" style={{ color: 'var(--azul-oscuro)' }}>
            Cu&eacute;ntanos de ti
          </h1>
        </div>
        <p className="text-[16px] leading-normal" style={{ color: 'var(--dark-gray-500)' }}>
          Completa la informaci&oacute;n de registro
        </p>
      </div>

      <Form form={form} layout="vertical" onFinish={onFinish} size="large" initialValues={{ phoneCode: '503' }} className="compact-form">
        <div className="flex flex-col gap-[44px]">
          <div className="grid grid-cols-2 gap-6">
            <Form.Item
              label="Nombre"
              name="name"
              rules={[{ required: true, message: 'Ingresa tu nombre' }]}
                         >
              <Input placeholder="Digita tu nombre" />
            </Form.Item>
            <Form.Item
              label="Apellido"
              name="lastName"
              rules={[{ required: true, message: 'Ingresa tu apellido' }]}
                         >
              <Input placeholder="Digita tu apellido" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <Form.Item label="Sexo" name="sex" className="!mb-0">
              <Select placeholder="Seleccionar">
                <Select.Option value="M">Masculino</Select.Option>
                <Select.Option value="F">Femenino</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="Fecha de nacimiento" name="birthDate" className="!mb-0">
              <DatePicker className="w-full" placeholder="Seleccionar" format="DD/MM/YYYY" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <Form.Item
              label="Correo electr&oacute;nico"
              name="email"
              rules={[
                { required: true, message: 'Ingresa tu correo' },
                { type: 'email', message: 'Correo invalido' },
              ]}
                         >
              <Input placeholder="Digitar correo" />
            </Form.Item>
            <PhoneInput
              label="N&uacute;mero de whatsapp"
              phoneCodes={phoneCodes}
              phoneMessage="Ingresa tu telefono"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <Form.Item
              label="Contrase&ntilde;a"
              name="password"
              rules={[
                { required: true, message: 'Ingresa una contrasena' },
                { min: 6, message: 'Minimo 6 caracteres' },
              ]}
                         >
              <Input.Password placeholder="Digitar contrase&ntilde;a" />
            </Form.Item>
            <Form.Item
              label="Repetir contrase&ntilde;a"
              name="confirmPassword"
              dependencies={['password']}
              rules={[
                { required: true, message: 'Confirma tu contrasena' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) return Promise.resolve();
                    return Promise.reject(new Error('Las contrasenas no coinciden'));
                  },
                }),
              ]}
                         >
              <Input.Password placeholder="Digitar contrase&ntilde;a" />
            </Form.Item>
          </div>

          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
            style={{
              height: 47,
              borderRadius: 8,
              fontWeight: 600,
              fontSize: 16,
            }}
          >
            Siguiente
          </Button>
        </div>
      </Form>

      <Modal
        open={confirmOpen}
        footer={null}
        closable={false}
        centered
        width={498}
        styles={{ body: { padding: 16 } }}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="flex w-full justify-end">
            <button onClick={() => setConfirmOpen(false)} className="cursor-pointer text-gray-400 hover:text-gray-600">
              <CloseOutlined style={{ fontSize: 16 }} />
            </button>
          </div>

          <div className="flex h-[90px] w-[90px] items-center justify-center rounded-full" style={{ backgroundColor: '#FFF4E6' }}>
            <ExclamationCircleFilled style={{ fontSize: 44, color: '#FAAD14' }} />
          </div>

          <div className="mt-2 flex flex-col gap-2 text-center">
            <p className="text-[20px]" style={{ color: 'var(--dark-gray-700)' }}>
              Confirmar n&uacute;mero <strong>de tel&eacute;fono</strong>
            </p>
            <p className="text-[14px]" style={{ color: 'var(--dark-gray-500)' }}>
              Est&aacute; seguro de que desea continuar con el n&uacute;mero <strong>+{phoneCode} {phone}</strong>?
            </p>
          </div>

          <div className="mt-4 flex w-full justify-end gap-[10px]">
            <Button
              onClick={() => setConfirmOpen(false)}
              style={{
                width: 144,
                height: 48,
                borderRadius: 8,
                fontWeight: 600,
                fontSize: 16,
                borderColor: 'var(--dark-gray-100)',
                color: 'var(--dark-gray-500)',
              }}
            >
              Cancelar
            </Button>
            <Button
              type="primary"
              onClick={handleConfirm}
              style={{
                width: 144,
                height: 48,
                borderRadius: 8,
                fontWeight: 600,
                fontSize: 16,
              }}
            >
              Aceptar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
