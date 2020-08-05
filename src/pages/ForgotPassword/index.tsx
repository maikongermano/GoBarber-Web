import React, { useRef, useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiLogIn, FiMail } from 'react-icons/fi';

import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import getValidadetionErros from '../../utils/getValidadetionErros';

import { useToast } from '../../hooks/toast';

import logoImg from '../../assets/logo.svg';

import { Container, Content, AnimationContainer, Background } from './styles';

import Input from '../../components/Input';

import Button from '../../components/Button';
import api from '../../service/api';

interface ForgotPasswordFormData {
  email: string;
}

const ForgotPassword: React.FC = () => {
  // loading
  const [loading, setLoading] = useState(false);
  const formRef = useRef<FormHandles>(null); // FormHandles tipagem de form

  const { addToast } = useToast();

  const handleSubmit = useCallback(
    // enviando form e validando
    async (data: ForgotPasswordFormData) => {
      try {
        setLoading(true); // exibi loading
        formRef.current?.setErrors({}); // inicia vazio

        const schema = Yup.object().shape({
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite um e-mail válido'),
        });

        await schema.validate(data, {
          abortEarly: false, // retorna todos os erros juntos
        });
        // recuperação de senha
        await api.post('/password/forgot', {
          email: data.email,
        });

        addToast({
          type: 'success',
          title: 'E-mail de recuperação enviado',
          description:
            'Enviamos um e-mail para confirmar a recuperação de senha, cheque sua caixa de entrada',
        });
        // history.push('/dashboard'); // redireciona apos login para a pagina dashboard
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidadetionErros(err);
          formRef.current?.setErrors(errors);
          return; // nao fica processando quando os campos ainda nao tiver preenchidos
        }
        addToast({
          type: 'error',
          title: 'Erro na recuperação de senha',
          description:
            'Ocorreu um erro ao tentar realizar a recuperação de senha, tente novamente',
        });
      } finally {
        setLoading(false); // finaliza loading
      }
    },
    [addToast],
  );

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="GoBarber" />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Recuperar senha</h1>

            <Input name="email" icon={FiMail} placeholder="Email" />

            <Button loading={loading} type="submit">
              Recuperar
            </Button>
          </Form>

          <Link to="/">
            <FiLogIn />
            Voltar ao login
          </Link>
        </AnimationContainer>
      </Content>

      <Background />
    </Container>
  );
};

export default ForgotPassword;
