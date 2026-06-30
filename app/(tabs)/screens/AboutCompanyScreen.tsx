import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

export default function AboutCompanyScreen() {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <LinearGradient
      colors={['#1a0d8d', '#2d1a9f', '#3d25b0']}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Cabeçalho com Logo */}
        <View style={styles.header}>
          <Image
            source={require('../../../assets/images/AirTrip.png')}
            style={styles.logo}
          />
          <Text style={styles.title}>AirTrip</Text>
          <Text style={styles.subtitle}>Sua Companhia Aérea de Confiança</Text>
        </View>

        {/* Sobre a Empresa */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sobre Nós</Text>
          <LinearGradient
            colors={['rgba(0, 212, 255, 0.1)', 'rgba(74, 79, 160, 0.1)']}
            style={styles.contentBox}
          >
            <Text style={styles.sectionText}>
              AirTrip é a plataforma líder em vendas de passagens aéreas na América Latina. Desde 2010,
              conectamos milhões de viajantes com seus destinos dos sonhos, oferecendo as melhores tarifas
              e um atendimento excepcional.
            </Text>
            <Text style={styles.sectionText}>
              Nossa missão é tornar as viagens aéreas acessíveis, seguras e convenientes para todos.
              Com uma rede de 500+ rotas e parcerias com as maiores companhias aéreas do mundo, garantimos
              sempre as melhores opções de voo para seu destino.
            </Text>
          </LinearGradient>
        </View>

        {/* Valores da Empresa */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nossos Valores</Text>

          <View style={styles.valueCard}>
            <View style={styles.valueIcon}>
              <MaterialIcons name="favorite" size={28} color="#00d4ff" />
            </View>
            <View style={styles.valueContent}>
              <Text style={styles.valueTitle}>Excelência</Text>
              <Text style={styles.valueDescription}>
                Buscamos sempre o melhor em cada aspecto do nosso serviço
              </Text>
            </View>
          </View>

          <View style={styles.valueCard}>
            <View style={styles.valueIcon}>
              <MaterialIcons name="security" size={28} color="#00d4ff" />
            </View>
            <View style={styles.valueContent}>
              <Text style={styles.valueTitle}>Confiança</Text>
              <Text style={styles.valueDescription}>
                Segurança e transparência em todas as transações
              </Text>
            </View>
          </View>

          <View style={styles.valueCard}>
            <View style={styles.valueIcon}>
              <MaterialIcons name="public" size={28} color="#00d4ff" />
            </View>
            <View style={styles.valueContent}>
              <Text style={styles.valueTitle}>Acessibilidade</Text>
              <Text style={styles.valueDescription}>
                Fazemos viagens aéreas acessíveis para todos
              </Text>
            </View>
          </View>

          <View style={styles.valueCard}>
            <View style={styles.valueIcon}>
              <MaterialIcons name="people" size={28} color="#00d4ff" />
            </View>
            <View style={styles.valueContent}>
              <Text style={styles.valueTitle}>Humanidade</Text>
              <Text style={styles.valueDescription}>
                Ouvimos e cuidamos de cada cliente com dedicação
              </Text>
            </View>
          </View>
        </View>

        {/* Estatísticas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nossos Números</Text>

          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>15+</Text>
              <Text style={styles.statName}>Anos de Experiência</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>150+</Text>
              <Text style={styles.statName}>Destinos</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>500+</Text>
              <Text style={styles.statName}>Rotas Ativas</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>1M+</Text>
              <Text style={styles.statName}>Passageiros Anuais</Text>
            </View>
          </View>
        </View>

        {/* Equipe */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nossa Equipe</Text>
          <LinearGradient
            colors={['rgba(0, 212, 255, 0.1)', 'rgba(74, 79, 160, 0.1)']}
            style={styles.contentBox}
          >
            <Text style={styles.sectionText}>
              Nossa equipe é composta por profissionais experientes e apaixonados por viagens.
              Com mais de 500 colaboradores dedicados, estamos sempre prontos para ajudar você
              em cada etapa da sua jornada.
            </Text>
            <View style={styles.teamHighlight}>
              <View style={styles.teamMember}>
                <MaterialIcons name="person" size={40} color="#00d4ff" />
                <Text style={styles.teamRole}>Agentes de Viagem</Text>
              </View>
              <View style={styles.teamMember}>
                <MaterialIcons name="support-agent" size={40} color="#00d4ff" />
                <Text style={styles.teamRole}>Suporte 24/7</Text>
              </View>
              <View style={styles.teamMember}>
                <MaterialIcons name="engineering" size={40} color="#00d4ff" />
                <Text style={styles.teamRole}>Engenheiros</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Certificações */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Certificações & Prêmios</Text>

          <View style={styles.certCard}>
            <MaterialIcons name="verified" size={32} color="#00d4ff" />
            <View style={styles.certContent}>
              <Text style={styles.certTitle}>IATA Certified</Text>
              <Text style={styles.certDesc}>Associado da Organização</Text>
            </View>
          </View>

          <View style={styles.certCard}>
            <MaterialIcons name="star" size={32} color="#00d4ff" />
            <View style={styles.certContent}>
              <Text style={styles.certTitle}>Melhor Plataforma 2024</Text>
              <Text style={styles.certDesc}>Prêmio de Excelência em Viagens</Text>
            </View>
          </View>

          <View style={styles.certCard}>
            <MaterialIcons name="security" size={32} color="#00d4ff" />
            <View style={styles.certContent}>
              <Text style={styles.certTitle}>SSL 256-bit Encrypted</Text>
              <Text style={styles.certDesc}>Transações 100% Seguras</Text>
            </View>
          </View>
        </View>

        {/* Contato */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Entre em Contato</Text>

          <LinearGradient
            colors={['#00d4ff', '#4a4fa0']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.contactButton}
          >
            <FontAwesome5 name="envelope" size={18} color="#fff" />
            <Text style={styles.contactButtonText}>contato@airtrip.com.br</Text>
          </LinearGradient>

          <LinearGradient
            colors={['#00d4ff', '#4a4fa0']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.contactButton}
          >
            <FontAwesome5 name="phone" size={18} color="#fff" />
            <Text style={styles.contactButtonText}>+55 (11) 4020-0200</Text>
          </LinearGradient>

          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={styles.detailsButton}
          >
            <Text style={styles.detailsButtonText}>📍 Escritórios e Detalhes de Contato</Text>
          </TouchableOpacity>
        </View>

        {/* Modal de Contato */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <MaterialIcons name="close" size={28} color="#fff" />
              </TouchableOpacity>

              <Text style={styles.modalTitle}>Nossos Escritórios</Text>

              <View style={styles.officeItem}>
                <MaterialIcons name="location-on" size={20} color="#00d4ff" />
                <View style={styles.officeContent}>
                  <Text style={styles.officeCity}>São Paulo - SP</Text>
                  <Text style={styles.officeAddress}>Av. Paulista, 1000 - Conjunto 1500</Text>
                </View>
              </View>

              <View style={styles.officeItem}>
                <MaterialIcons name="location-on" size={20} color="#00d4ff" />
                <View style={styles.officeContent}>
                  <Text style={styles.officeCity}>Rio de Janeiro - RJ</Text>
                  <Text style={styles.officeAddress}>Av. Atlântica, 2000 - Sala 300</Text>
                </View>
              </View>

              <View style={styles.officeItem}>
                <MaterialIcons name="location-on" size={20} color="#00d4ff" />
                <View style={styles.officeContent}>
                  <Text style={styles.officeCity}>Brasília - DF</Text>
                  <Text style={styles.officeAddress}>SCS Quadra 1, Bloco A - Sala 200</Text>
                </View>
              </View>

              <Text style={styles.horarioTitle}>Horário de Atendimento</Text>
              <Text style={styles.horario}>Segunda a Sexta: 08:00 - 22:00</Text>
              <Text style={styles.horario}>Sábado: 09:00 - 20:00</Text>
              <Text style={styles.horario}>Domingo: 10:00 - 18:00</Text>
            </View>
          </View>
        </Modal>
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
  header: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
    borderWidth: 3,
    borderColor: '#00d4ff',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#9ab8d9',
    fontStyle: 'italic',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
    textShadowColor: 'rgba(0, 212, 255, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  contentBox: {
    borderRadius: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 255, 0.3)',
  },
  sectionText: {
    color: '#9ab8d9',
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 10,
  },
  valueCard: {
    flexDirection: 'row',
    marginBottom: 15,
    backgroundColor: 'rgba(0, 212, 255, 0.05)',
    padding: 15,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#00d4ff',
  },
  valueIcon: {
    marginRight: 15,
    justifyContent: 'center',
  },
  valueContent: {
    flex: 1,
  },
  valueTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  valueDescription: {
    fontSize: 13,
    color: '#9ab8d9',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  statBox: {
    width: '48%',
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 255, 0.3)',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00d4ff',
    marginBottom: 5,
  },
  statName: {
    fontSize: 12,
    color: '#9ab8d9',
    textAlign: 'center',
  },
  teamHighlight: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  teamMember: {
    alignItems: 'center',
  },
  teamRole: {
    color: '#00d4ff',
    fontSize: 12,
    marginTop: 8,
    fontWeight: '600',
    textAlign: 'center',
  },
  certCard: {
    flexDirection: 'row',
    marginBottom: 12,
    backgroundColor: 'rgba(0, 212, 255, 0.05)',
    padding: 15,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#00d4ff',
    alignItems: 'center',
  },
  certContent: {
    flex: 1,
    marginLeft: 15,
  },
  certTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 3,
  },
  certDesc: {
    fontSize: 12,
    color: '#9ab8d9',
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
  },
  contactButtonText: {
    color: '#fff',
    marginLeft: 12,
    fontSize: 14,
    fontWeight: '600',
  },
  detailsButton: {
    padding: 15,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
    borderWidth: 2,
    borderColor: '#00d4ff',
    alignItems: 'center',
  },
  detailsButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1a0d8d',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: '80%',
  },
  closeButton: {
    alignItems: 'flex-end',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  officeItem: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
    padding: 15,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#00d4ff',
  },
  officeContent: {
    marginLeft: 15,
    flex: 1,
  },
  officeCity: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 3,
  },
  officeAddress: {
    fontSize: 13,
    color: '#9ab8d9',
  },
  horarioTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
    marginBottom: 10,
  },
  horario: {
    fontSize: 14,
    color: '#9ab8d9',
    marginBottom: 5,
  },
});
