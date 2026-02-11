import { Form, Select, Input } from 'antd';

interface PhoneCode {
  value: string;
  label: string;
}

interface PhoneInputProps {
  label?: string;
  required?: boolean;
  phoneCodes: PhoneCode[];
  phoneCodeField?: string;
  phoneField?: string;
  phoneMessage?: string;
}

export default function PhoneInput({
  label = 'Teléfono',
  required = true,
  phoneCodes,
  phoneCodeField = 'phoneCode',
  phoneField = 'phone',
  phoneMessage = 'Requerido',
}: PhoneInputProps) {
  return (
    <Form.Item label={label} required={required}>
      <div className="flex">
        <Form.Item name={phoneCodeField} noStyle>
          <Select
            style={{
              width: 90,
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
            }}
            popupMatchSelectWidth={false}
            className="phone-code-select"
          >
            {phoneCodes.map((code) => (
              <Select.Option key={code.value} value={code.value}>{code.label}</Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name={phoneField}
          noStyle
          rules={[{ required, message: phoneMessage }]}
        >
          <Input placeholder="7777 7777" style={{ flex: 1, borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }} />
        </Form.Item>
      </div>
    </Form.Item>
  );
}
