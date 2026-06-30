import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Login: undefined;
  RegistroUser: undefined;
  RegistroSuccess: undefined;
};

export default function RegistroSuccess() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <LinearGradient
      colors={['#1a0d8d', '#2d1a9f', '#3d25b0']}
      style={styles.background}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.container}>
        <View style={styles.card}>
          <View style={styles.iconCircle}>
            <Text style={styles.icon}>✓</Text>
          </View>
          <Text style={styles.title}>Cadastro realizado!</Text>
          <Text style={styles.subtitle}>
            Sua conta foi criada com sucesso. Agora é só fazer login e começar a usar a AirTrip.
          </Text>
          <Image
            source={require('../../../assets/images/AirTrip.png')}
            style={styles.logo}
          />
          <Button
            mode="contained"
            onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Login' }] })}
            style={styles.button}
            labelStyle={styles.buttonLabel}
            contentStyle={styles.buttonContent}
          >
            Ir para o login
          </Button>
          <TouchableOpacity
            onPress={() => navigation.navigate('RegistroUser')}
            style={styles.linkContainer}
          >
            <Text style={styles.linkText}>Voltar para criar outra conta</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 20,
    padding: 26,
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 255, 0.15)',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(0, 212, 255, 0.14)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
  },
  icon: {
    fontSize: 42,
    color: '#00d4ff',
    fontWeight: '700',
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    color: '#cfd8ff',
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 28,
    lineHeight: 22,
  },
  logo: {
    width: 84,
    height: 84,
    borderRadius: 30,
    marginBottom: 28,
  },
  button: {
    width: '100%',
    borderRadius: 14,
    backgroundColor: '#00d4ff',
    elevation: 4,
  },
  buttonLabel: {
    color: '#0d0620',
    fontWeight: 'bold',
  },
  buttonContent: {
    paddingVertical: 8,
  },
  linkContainer: {
    marginTop: 16,
  },
  linkText: {
    color: '#00d4ff',
    fontSize: 14,
    fontWeight: '600',
  },
});
