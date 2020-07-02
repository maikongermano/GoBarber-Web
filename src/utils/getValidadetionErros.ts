import { ValidationError } from 'yup';

interface Errors {
  [key: string]: string; // pode ser qualquer coisa
}

export default function getValidationErros(err: ValidationError): Errors {
  const validationErros: Errors = {};

  err.inner.forEach(error => {
    validationErros[error.path] = error.message;
  });

  return validationErros;
}
