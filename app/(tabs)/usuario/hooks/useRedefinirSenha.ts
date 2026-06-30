// hooks/useRedefinirSenha.ts
import { useState } from 'react';
import axios from 'axios';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import API_URL from '../../../../conf/api'; // ajuste o caminho conforme a pasta
 

interface UseRedefinirSenha {
  email: string;
  setEmail: (email: string) => void;
  novaSenha: string;
  setNovaSenha: (senha: string) => void;
  confirmarSenha: string;
  setConfirmarSenha: (senha: string) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  visibleSnackbar: boolean;
  setVisibleSnackbar: (visible: boolean) => void;
  handleRedefinirSenha: () => void;
}

export default function useRedefinirSenha(): UseRedefinirSenha {
  const [email, setEmail] = useState<string>('');
  const [novaSenha, setNovaSenha] = useState<string>('');
  const [confirmarSenha, setConfirmarSenha] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [visibleSnackbar, setVisibleSnackbar] = useState<boolean>(false);
  const navigation = useNavigation<StackNavigationProp<any>>();

  const handleRedefinirSenha = async (): Promise<void> => {
    if (!email || !novaSenha || !confirmarSenha) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos!');
      return;
    }

    if (novaSenha !== confirmarSenha) {
      Alert.alert('Erro', 'As senhas não coincidem!');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.put(`${API_URL}/usuarios/redefinir-senha`, {
        email,
        novaSenha,
        confirmarSenha,
      });

      if (response.status === 200) {
        Alert.alert('Sucesso', 'Senha redefinida com sucesso!', [
          {
            text: 'OK',
            onPress: () => {
              setTimeout(() => {
                navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
              }, 1000);
            }
          }
        ]);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const { status, data } = error.response;
        let errorMessage = 'Ocorreu um erro inesperado.';

        switch (status) {
          case 400:
            errorMessage = 'Email, nova senha e confirmação de senha são obrigatórios.';
            break;
          case 404:
            errorMessage = 'Usuário não encontrado.';
            break;
          default:
            errorMessage = data.error || errorMessage;
            break;
        }

        Alert.alert('Erro', errorMessage);
      } else {
        Alert.alert('Erro', 'Falha ao conectar ao servidor. Verifique sua conexão.');
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    novaSenha,
    setNovaSenha,   
    confirmarSenha,
    setConfirmarSenha,
    loading,
    setLoading,
    visibleSnackbar,
    setVisibleSnackbar,
    handleRedefinirSenha
  };
}
