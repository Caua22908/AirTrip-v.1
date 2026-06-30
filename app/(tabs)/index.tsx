import React, { useState, useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, Text, Image, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const texts = [
  'Roteiros Personalizados',
  'Experiências Exclusivas',
  'Passagens Aéreas',
  'Hospedagens de Luxo',
  'Atendimento 24h',
];

export default function HomeScreen() {
  const [index, setIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = () => {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.delay(2000),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIndex((prevIndex) => (prevIndex + 1) % texts.length);
      });
    };

    animate();
  }, [index]);

  return (
    <LinearGradient
      // Paleta inspirada na sua logo: Azul Marinho para o Preto
      colors={['#000000', '#041E42', '#003366']}
      style={styles.container}
    >
      {/* Círculo decorativo de fundo para dar profundidade */}
      <View style={styles.circleDecorator} />

      <Image
        source={require('../../assets/images/AirTrip.png')}
        style={styles.image}
      />

      <View style={styles.glassContainer}>
        <Text style={styles.title}>Bem-vindo à Airtrip</Text>
        <Text style={styles.subtitle}>Sua jornada começa aqui</Text>
        
        <View style={styles.animatedTextWrapper}>
          <Animated.Text style={[styles.typingText, { opacity: fadeAnim }]}>
            {texts[index]}
          </Animated.Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  circleDecorator: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(0, 102, 204, 0.2)',
  },
  image: {
    width: 220,
    height: 220,
    borderRadius: 110, // Mantém o formato redondo que você pediu
    borderWidth: 3,
    borderColor: '#0056b3',
    resizeMode: 'cover',
    marginBottom: 40,
    backgroundColor: '#fff',
  },
  glassContainer: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '400',
    marginBottom: 25,
    color: '#BDC3C7',
    textTransform: 'uppercase',
  },
  animatedTextWrapper: {
    height: 50,
    justifyContent: 'center',
  },
  typingText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00AEEF', // Azul claro para destaque
    textAlign: 'center',
    textShadowColor: 'rgba(0, 174, 239, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
});