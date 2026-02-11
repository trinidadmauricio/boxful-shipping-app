'use client';

import { useEffect, useState, useCallback } from 'react';
import { Table, Button, DatePicker, message, Tooltip, Input } from 'antd';
import api from '@/lib/api';
import type { Order } from '@/types';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import CalendarIcon from '@/components/icons/CalendarIcon';

const { RangePicker } = DatePicker;

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const fetchOrders = useCallback(async (currentPage = 1) => {
    setLoading(true);
    try {
      const params: Record<string, string> = {
        page: String(currentPage),
        limit: '10',
      };
      if (dateRange?.[0]) params.startDate = dateRange[0].toISOString();
      if (dateRange?.[1]) params.endDate = dateRange[1].toISOString();

      const { data } = await api.get<{ data: Order[]; meta: { total: number; page: number; limit: number; totalPages: number } }>('/orders', { params });
      setOrders(data.data);
      setTotal(data.meta.total);
    } catch {
      message.error('Error al cargar ordenes');
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    fetchOrders(page);
  }, [page, fetchOrders]);

  const handleSearch = () => {
    setPage(1);
    fetchOrders(1);
  };

  const handleDownloadCsv = async () => {
    try {
      const params: Record<string, string> = {};
      if (dateRange?.[0]) params.startDate = dateRange[0].toISOString();
      if (dateRange?.[1]) params.endDate = dateRange[1].toISOString();

      const { data } = await api.get('/orders/export/csv', {
        params,
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'ordenes.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      message.error('Error al descargar CSV');
    }
  };

  const columns: ColumnsType<Order> = [
    {
      title: 'No. de orden',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      render: (text: string) => (
        <span className="text-[12px] font-semibold" style={{ color: 'var(--dark-gray-500)' }}>
          {text}
        </span>
      ),
    },
    {
      title: 'Nombre',
      dataIndex: 'firstName',
      key: 'firstName',
      render: (text: string) => (
        <span className="text-[12px] font-semibold" style={{ color: 'var(--dark-gray-500)' }}>
          {text}
        </span>
      ),
    },
    {
      title: 'Apellidos',
      dataIndex: 'lastName',
      key: 'lastName',
      render: (text: string) => (
        <span className="text-[12px] font-semibold" style={{ color: 'var(--dark-gray-500)' }}>
          {text}
        </span>
      ),
    },
    {
      title: 'Departamento',
      dataIndex: 'department',
      key: 'department',
      render: (text: string) => (
        <span className="text-[12px] font-semibold" style={{ color: 'var(--dark-gray-500)' }}>
          {text}
        </span>
      ),
    },
    {
      title: 'Municipio',
      dataIndex: 'municipality',
      key: 'municipality',
      render: (text: string) => (
        <span className="text-[12px] font-semibold" style={{ color: 'var(--dark-gray-500)' }}>
          {text}
        </span>
      ),
    },
    {
      title: 'Paquetes en orden',
      key: 'packages',
      render: (_: unknown, record: Order) => (
        <Tooltip
          title={record.packages
            .map((p) => `${p.content} (${p.weight}lb)`)
            .join(', ')}
        >
          <span
            className="cursor-pointer inline-block rounded px-2 py-1 text-[12px] font-medium"
            style={{
              color: '#22c55e',
              background: 'var(--verde-claro-bg)'
            }}
          >
            {record.packages.length}
          </span>
        </Tooltip>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-[20px] flex items-center gap-3">
        <RangePicker
          value={dateRange}
          onChange={(dates) => setDateRange(dates)}
          format="DD/MM/YYYY"
          placeholder={['Enero', 'Julio']}
          suffixIcon={<CalendarIcon />}
          style={{ width: 312, height: 48 }}
        />
        <Button
          type="primary"
          onClick={handleSearch}
          style={{
            width: 144,
            height: 48,
            borderRadius: 8,
            fontWeight: 600,
            fontSize: 16,
          }}
        >
          Buscar
        </Button>
        <Button
          onClick={handleDownloadCsv}
          style={{
            width: 200,
            height: 48,
            borderRadius: 8,
            fontWeight: 600,
            fontSize: 16,
            borderColor: 'var(--dark-gray-100)',
          }}
        >
          Descargar órdenes
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={orders}
        rowKey="id"
        loading={loading}
        rowSelection={{
          selectedRowKeys: selectedRows,
          onChange: (keys) => setSelectedRows(keys as string[]),
        }}
        pagination={{
          current: page,
          total,
          pageSize: 10,
          onChange: (p) => setPage(p),
          showSizeChanger: false,
        }}
        style={{ borderRadius: 12 }}
      />
    </div>
  );
}
