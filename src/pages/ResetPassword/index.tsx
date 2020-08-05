import React, { useRef, useCallback } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { FiLock } from 'react-icons/fi';

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

interface ResetPasswordFormData {
  password: string;
  password_confirmation: string;
}

const ResetPassword: React.FC = () => {
  const formRef = useRef<FormHandles>(null); // FormHandles tipagem de form

  const { addToast } = useToast();
  const history = useHistory();

  const location = useLocation(); // pegando qryparams

  const handleSubmit = useCallback(
    async (data: ResetPasswordFormData) => {
      try {
        formRef.current?.setErrors({}); // inicia vazio

        const schema = Yup.object().shape({
          password: Yup.string().required('Senha obrigatória'),
          password_confirmation: Yup.string().oneOf(
            [Yup.ref('password'), 'null'],
            'Confirmação incorreta',
          ),
        });

        await schema.validate(data, {
          abortEarly: false, // retorna todos os erros juntos
        });

        // pegando token
        const token = location.search.replace('?token=', '');

        if (!token) {
          throw new Error();
        }

        // alterarndo senha
        await api.post('/password/reset', {
          password: data.password,
          password_confirmation: data.password_confirmation,
          token,
        });

        history.push('/'); // redireciona para o login
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidadetionErros(err);
          formRef.current?.setErrors(errors);
          return; // nao fica processando quando os campos ainda nao tiver preenchidos
        }
        addToast({
          type: 'error',
          title: 'Erro ao resetar senha',
          description: 'Ocorreu um erro ao resetar sua senha, tente novamente.',
        });
      }
    },
    [addToast, history, location],
  );

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="GoBarber" />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Resetar Senha</h1>

            <Input
              name="password"
              icon={FiLock}
              type="password"
              placeholder="Nova senha"
            />

            <Input
              name="password_confirmation"
              icon={FiLock}
              type="password"
              placeholder="Confirmação da senha"
            />

            <Button type="submit">Alterar senha</Button>
          </Form>
        </AnimationContainer>
      </Content>

      <Background />
    </Container>
  );
};

export default ResetPassword;
