import React, {
  InputHTMLAttributes,
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react';
import { IconBaseProps } from 'react-icons';
import { FiAlertCircle } from 'react-icons/fi';
import { useField } from '@unform/core';

// mport Tooltip from '../Tooltip'; // mostra mensagem de erro

import { Container, Error } from './styles';

/* todas as propriedas do input  informando que name é obrigaotrio */
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  containerStyle?: object;
  icon?: React.ComponentType<IconBaseProps>;
}

const Input: React.FC<InputProps> = ({
  name,
  containerStyle = {},
  icon: Icon,
  ...rest
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsfocused] = useState(false); // seta as propriedade de focu
  const [isField, setIsField] = useState(false); // seta as propridade de focused
  const { fieldName, defaultValue, error, registerField } = useField(name);

  const handleInputFocus = useCallback(() => {
    setIsfocused(true);
  }, []);

  const handleInputBlur = useCallback(() => {
    setIsfocused(false);
    setIsField(!!inputRef.current?.value); // true or false
  }, []); /** so ira ser chamado se alguma das variavel sofrer
  alteração sempre quando for criar função dentro do componenete
  usar usecallback para nao ficar reecriando o componente */

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'value',
    });
  }, [fieldName, registerField]);
  return (
    <Container
      style={containerStyle}
      isErrored={!!error}
      isField={isField}
      isFocused={isFocused}
      data-testid="input-container"
    >
      {Icon && <Icon size={20} />}
      <input
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        defaultValue={defaultValue}
        ref={inputRef}
        {...rest}
      />
      {error && (
        <Error title={error}>
          <FiAlertCircle color="c53030" size={20} />
        </Error>
      )}
    </Container>
  );
};

export default Input;
