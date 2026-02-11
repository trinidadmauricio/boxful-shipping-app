'use client';

import { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      await login(values);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      message.error(axiosErr.response?.data?.message || 'Error al iniciar sesion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-[44px]">
      <div className="flex flex-col gap-3">
        <h1 className="text-[22px] font-bold leading-normal" style={{ color: 'var(--azul-oscuro)' }}>
          Bienvenido
        </h1>
        <p className="text-[16px] leading-normal" style={{ color: 'var(--dark-gray-500)' }}>
          Por favor ingresa tus credenciales
        </p>
      </div>

      <Form layout="vertical" onFinish={onFinish} size="large" className="compact-form">
        <div className="flex flex-col gap-6">
          <Form.Item
            label="Correo electr&oacute;nico"
            name="email"
            rules={[
              { required: true, message: 'Ingresa tu correo' },
              { type: 'email', message: 'Correo invalido' },
            ]}
                     >
            <Input placeholder="Digita tu correo" />
          </Form.Item>

          <Form.Item
            label="Contrase&ntilde;a"
            name="password"
            rules={[{ required: true, message: 'Ingresa tu contrasena' }]}
                     >
            <Input.Password placeholder="Digita el NIT del comercio" />
          </Form.Item>
        </div>

        <div className="mt-[44px] flex flex-col items-center gap-[31px]">
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
            Iniciar sesi&oacute;n
          </Button>

          <p className="text-center text-[16px]" style={{ color: 'var(--dark-gray-500)' }}>
            &iquest;Necesitas una cuenta?{' '}
            <Link href="/register" className="font-bold" style={{ color: 'var(--dark-gray-500)' }}>
              Reg&iacute;strate aqu&iacute;
            </Link>
          </p>
        </div>
      </Form>
    </div>
  );
}
