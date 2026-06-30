import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  return (
    <LinearGradient
      colors={['#1a0d8d', '#2d1a9f', '#3d25b0']}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Hero Section com Logo */}
        <View style={styles.heroSection}>
          <Image
            source={require('../../../assets/images/AirTrip.png')}
            style={styles.logo}
          />
          <Text style={styles.brandName}>AirTrip</Text>
          <Text style={styles.tagline}>Suas Jornadas, Nosso Compromisso</Text>

          <LinearGradient
            colors={['#00d4ff', '#4a4fa0']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.ctaButton}
          >
            <Text style={styles.ctaButtonText}>✈️ Comece Sua Viagem</Text>
          </LinearGradient>
        </View>

        {/* Estatísticas */}
        <View style={styles.statsSection}>
          <View style={styles.statCard}>
            <MaterialIcons name="flight" size={32} color="#00d4ff" />
            <Text style={styles.statNumber}>500+</Text>
            <Text style={styles.statLabel}>Rotas Disponíveis</Text>
          </View>

          <View style={styles.statCard}>
            <MaterialIcons name="public" size={32} color="#00d4ff" />
            <Text style={styles.statNumber}>150+</Text>
            <Text style={styles.statLabel}>Destinos</Text>
          </View>

          <View style={styles.statCard}>
            <MaterialIcons name="people" size={32} color="#00d4ff" />
            <Text style={styles.statNumber}>1M+</Text>
            <Text style={styles.statLabel}>Passageiros</Text>
          </View>
        </View>

        {/* Serviços Destacados */}
        <View style={styles.servicesSection}>
          <Text style={styles.sectionTitle}>Por Que Escolher AirTrip?</Text>

          <View style={styles.serviceItem}>
            <View style={styles.serviceIcon}>
              <MaterialIcons name="check-circle" size={24} color="#00d4ff" />
            </View>
            <View style={styles.serviceContent}>
              <Text style={styles.serviceTitle}>Melhores Preços Garantidos</Text>
              <Text style={styles.serviceDescription}>
                Comparamos os melhores preços do mercado para você
              </Text>
            </View>
          </View>

          <View style={styles.serviceItem}>
            <View style={styles.serviceIcon}>
              <MaterialIcons name="lock" size={24} color="#00d4ff" />
            </View>
            <View style={styles.serviceContent}>
              <Text style={styles.serviceTitle}>Compras 100% Seguras</Text>
              <Text style={styles.serviceDescription}>
                Suas transações são protegidas com encriptação de ponta
              </Text>
            </View>
          </View>

          <View style={styles.serviceItem}>
            <View style={styles.serviceIcon}>
              <MaterialIcons name="support-agent" size={24} color="#00d4ff" />
            </View>
            <View style={styles.serviceContent}>
              <Text style={styles.serviceTitle}>Suporte 24/7</Text>
              <Text style={styles.serviceDescription}>
                Nossa equipe está sempre pronta para ajudar
              </Text>
            </View>
          </View>

          <View style={styles.serviceItem}>
            <View style={styles.serviceIcon}>
              <MaterialIcons name="free-cancellation" size={24} color="#00d4ff" />
            </View>
            <View style={styles.serviceContent}>
              <Text style={styles.serviceTitle}>Cancelamento Flexível</Text>
              <Text style={styles.serviceDescription}>
                Cancele com até 24h de antecedência
              </Text>
            </View>
          </View>
        </View>

        {/* Ofertas em Destaque */}
        <View style={styles.offersSection}>
          <Text style={styles.sectionTitle}>Ofertas Imperdíveis</Text>

          <View style={styles.offerCard}>
            <Image
              source={require('../../../assets/images/p1.png')}
              style={styles.offerImage}
            />
            <LinearGradient
              colors={['transparent', 'rgba(26, 13, 141, 0.9)']}
              style={styles.offerOverlay}
            >
              <Text style={styles.offerTitle}>São Paulo → Rio de Janeiro</Text>
              <Text style={styles.offerPrice}>a partir de R$ 189,00</Text>
            </LinearGradient>
          </View>

          <View style={styles.offerCard}>
            <Image
              source={require('../../../assets/images/p2.png')}
              style={styles.offerImage}
            />
            <LinearGradient
              colors={['transparent', 'rgba(26, 13, 141, 0.9)']}
              style={styles.offerOverlay}
            >
              <Text style={styles.offerTitle}>Brasília → Salvador</Text>
              <Text style={styles.offerPrice}>a partir de R$ 245,00</Text>
            </LinearGradient>
          </View>

          <View style={styles.offerCard}>
            <Image
              source={require('../../../assets/images/p3.png')}
              style={styles.offerImage}
            />
            <LinearGradient
              colors={['transparent', 'rgba(26, 13, 141, 0.9)']}
              style={styles.offerOverlay}
            >
              <Text style={styles.offerTitle}>Curitiba → Manaus</Text>
              <Text style={styles.offerPrice}>a partir de R$ 320,00</Text>
            </LinearGradient>
          </View>
        </View>

        {/* Newsletter */}
        <View style={styles.newsletterSection}>
          <Text style={styles.newsletterTitle}>Receba Nossas Melhores Ofertas</Text>
          <Text style={styles.newsletterSubtitle}>
            Inscreva-se e receba descontos exclusivos direto no seu email
          </Text>
          <LinearGradient
            colors={['#00d4ff', '#4a4fa0']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.newsletterButton}
          >
            <Text style={styles.newsletterButtonText}>Inscrever-se Agora</Text>
          </LinearGradient>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  heroSection: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 50,
    paddingHorizontal: 20,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    borderWidth: 3,
    borderColor: '#00d4ff',
  },
  brandName: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 212, 255, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  tagline: {
    fontSize: 18,
    color: '#9ab8d9',
    marginBottom: 30,
    fontStyle: 'italic',
  },
  ctaButton: {
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 50,
    marginTop: 20,
  },
  ctaButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 15,
    marginBottom: 40,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 255, 0.3)',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00d4ff',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#9ab8d9',
    textAlign: 'center',
    marginTop: 5,
  },
  servicesSection: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 212, 255, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  serviceItem: {
    flexDirection: 'row',
    marginBottom: 15,
    backgroundColor: 'rgba(0, 212, 255, 0.05)',
    padding: 15,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#00d4ff',
  },
  serviceIcon: {
    marginRight: 15,
    justifyContent: 'center',
  },
  serviceContent: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  serviceDescription: {
    fontSize: 13,
    color: '#9ab8d9',
  },
  offersSection: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  offerCard: {
    marginBottom: 15,
    borderRadius: 15,
    overflow: 'hidden',
    height: 150,
    position: 'relative',
  },
  offerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  offerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '70%',
    justifyContent: 'flex-end',
    paddingBottom: 15,
    paddingHorizontal: 15,
  },
  offerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  offerPrice: {
    fontSize: 14,
    color: '#00d4ff',
    fontWeight: '700',
  },
  newsletterSection: {
    marginHorizontal: 20,
    padding: 25,
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 255, 0.3)',
  },
  newsletterTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  newsletterSubtitle: {
    fontSize: 14,
    color: '#9ab8d9',
    marginBottom: 20,
    textAlign: 'center',
  },
  newsletterButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  newsletterButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
