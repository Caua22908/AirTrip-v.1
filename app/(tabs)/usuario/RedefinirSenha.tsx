import React from 'react';
import { View, Image } from 'react-native';
import { TextInput, Button, Text, Snackbar } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from './styles/RedefinirSenhaScreenStyles'; // Import the styles
import useRedefinirSenha from './hooks/useRedefinirSenha'; // Import the custom hook

export default function RedefinirSenhaScreen() {
  const {
    email,
    setEmail,
    novaSenha,
    setNovaSenha,
    confirmarSenha,
    setConfirmarSenha,
    loading,
    visibleSnackbar,
    setVisibleSnackbar,
    handleRedefinirSenha
  } = useRedefinirSenha(); // Use the custom hook

  return (
    <LinearGradient
      colors={['#f7e7ce', '#D2B48C', '#A67B5B']}
      style={styles.container}
      start={{ x: 0.2, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.imageWrapper}>
            <Image source={require('../../../assets/images/AirTrip.png')} style={styles.image} />
          </View>
          <Text style={styles.brand}>AirTrip</Text>
        </View>

        <Text style={styles.title}>Redefinir Senha</Text>

        <TextInput
          label="E-mail"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          autoCapitalize="none"
          keyboardType="email-address"
          mode="outlined"
          left={<TextInput.Icon icon="email" />}
          outlineColor="#A67B5B"
          activeOutlineColor="#5D4037"
        />

        <TextInput
          label="Nova Senha"
          value={novaSenha}
          onChangeText={setNovaSenha}
          secureTextEntry
          style={styles.input}
          mode="outlined"
          left={<TextInput.Icon icon="lock" />}
          outlineColor="#A67B5B"
          activeOutlineColor="#5D4037"
        />

        <TextInput
          label="Confirmar Senha"
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
          secureTextEntry
          style={styles.input}
          mode="outlined"
          left={<TextInput.Icon icon="lock-check" />}
          outlineColor="#A67B5B"
          activeOutlineColor="#5D4037"
        />

        <Button
          mode="contained"
          onPress={handleRedefinirSenha}
          style={styles.button}
          loading={loading}
          disabled={loading}
        >
          Redefinir Senha
        </Button>

        <Snackbar
          visible={visibleSnackbar}
          onDismiss={() => setVisibleSnackbar(false)}
          duration={Snackbar.DURATION_SHORT}
        >
          Senha redefinida com sucesso!
        </Snackbar>
      </View>
    </LinearGradient>
  );
}
