// componente mostrar mensagem de erro
import React from 'react';

import { Container } from './styles';

interface TooltipProps {
  title: string;
  className?: string; // não obrigatoria
}

const Tooltip: React.FC<TooltipProps> = ({
  title,
  className = '',
  children,
}) => {
  return (
    <Container className={className}>
      {children}
      <span>{title}</span>
    </Container>
  );
};

export default Tooltip;
