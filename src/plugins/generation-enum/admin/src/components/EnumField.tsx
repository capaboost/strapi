import React from 'react';
import { Select, Option } from '@strapi/design-system/Select';

interface EnumFieldProps {
  onChange: (value: string) => void;
  value: string;
  name: string;
}

const EnumField: React.FC<EnumFieldProps> = ({ onChange, value, name }) => {
  const options = ['GEN_W', 'GEN_X', 'GEN_Y', 'GEN_Z', 'GEN_ALPHA', 'GEN_BETA'];

  return (
    <Select name={name} onChange={(e: any) => onChange(e.target.value)} value={value}>
      {options.map((option) => (
        <Option key={option} value={option}>{option}</Option>
      ))}
    </Select>
  );
};

export default EnumField;
