import React from 'react';
import { TextInput } from '@strapi/design-system/TextInput';

const Input = ({ name, value, onChange }: { name: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => {
  return (
    <>
    sodfjhsdjfh
      <TextInput
        name={name}
        label="Text Field a tady je něco dalšího"
        onChange={onChange}
        value={value}
      />
    </>
    
  );
};

export default Input;
