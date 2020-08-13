import React from 'react';

import { render, fireEvent, waitFor } from '@testing-library/react';
import Input from '../../components/Input';

jest.mock('@unform/core', () => {
  return {
    useField() {
      return {
        fieldName: 'email',
        defaultValue: '',
        error: '',
        registerField: jest.fn(),
      };
    },
  };
});

describe('Input component', () => {
  it('should be able to render an input', () => {
    const { getByPlaceholderText } = render(
      <Input name="email" placeholder="Email" />,
    );

    // espero que exista
    expect(getByPlaceholderText('Email')).toBeTruthy();
  });

  it('should renders highlight on input focus', async () => {
    const { getByPlaceholderText, getByTestId } = render(
      <Input name="email" placeholder="Email" />,
    );

    const inputElement = getByPlaceholderText('Email');
    const containerElement = getByTestId('input-container');

    // clicar no input
    fireEvent.focus(inputElement);

    await waitFor(() => {
      expect(containerElement).toHaveStyle('border-color: #ff9000;'); // borda
      expect(containerElement).toHaveStyle('color: #ff9000;'); // texto digitado
    });

    fireEvent.blur(inputElement);

    await waitFor(() => {
      expect(containerElement).not.toHaveStyle('border-color: #ff9000;'); // borda
      expect(containerElement).not.toHaveStyle('color: #ff9000;'); // texto digitado
    });
  });

  it('should keep input border highlight when input filled', async () => {
    const { getByPlaceholderText, getByTestId } = render(
      <Input name="email" placeholder="Email" />,
    );

    const inputElement = getByPlaceholderText('Email');
    const containerElement = getByTestId('input-container');

    fireEvent.change(inputElement, {
      target: { value: 'johndoe@example.com' },
    });

    fireEvent.blur(inputElement);

    await waitFor(() => {
      expect(containerElement).toHaveStyle('color: #ff9000;'); // texto
    });
  });
});
