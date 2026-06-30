import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

// Interface para a reserva
interface Reservation {
  id: string;
  flightNumber: string;
  airline: string;
  departureCode: string;
  arrivalCode: string;
  departureCity: string;
  arrivalCity: string;
  departureTime: string;
  arrivalTime: string;
  departureDate: string;
  status: 'confirmada' | 'pendente' | 'cancelada' | 'finalizada';
  passengerName: string;
  passengerCount: number;
  seatNumber?: string;
  gate?: string;
  terminal?: string;
  createdAt: string;
}

export default function MinhasReservasScreen() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'todas' | 'confirmada' | 'pendente' | 'cancelada' | 'finalizada'>('todas');

  // Carregar reservas do AsyncStorage
  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    try {
      const stored = await AsyncStorage.getItem('reservations');
      if (stored) {
        const parsed = JSON.parse(stored);
        setReservations(parsed);
      } else {
        // Dados mockados para demonstração
        const mockReservations: Reservation[] = [
          {
            id: '1',
            flightNumber: 'LA1234',
            airline: 'LATAM Airlines',
            departureCode: 'GRU',
            arrivalCode: 'GIG',
            departureCity: 'São Paulo',
            arrivalCity: 'Rio de Janeiro',
            departureTime: '08:00',
            arrivalTime: '09:15',
            departureDate: '2024-12-15',
            status: 'confirmada',
            passengerName: 'João Silva',
            passengerCount: 2,
            seatNumber: '12A',
            gate: 'B23',
            terminal: '2',
            createdAt: '2024-12-01T10:00:00',
          },
          {
            id: '2',
            flightNumber: 'GX5678',
            airline: 'GOL Linhas Aéreas',
            departureCode: 'CWB',
            arrivalCode: 'MAO',
            departureCity: 'Curitiba',
            arrivalCity: 'Manaus',
            departureTime: '14:30',
            arrivalTime: '17:45',
            departureDate: '2024-12-20',
            status: 'pendente',
            passengerName: 'Maria Santos',
            passengerCount: 1,
            terminal: '1',
            createdAt: '2024-12-02T15:30:00',
          },
          {
            id: '3',
            flightNumber: 'AZ9101',
            airline: 'Azul Linhas Aéreas',
            departureCode: 'BSB',
            arrivalCode: 'SSA',
            departureCity: 'Brasília',
            arrivalCity: 'Salvador',
            departureTime: '10:15',
            arrivalTime: '12:00',
            departureDate: '2024-12-10',
            status: 'finalizada',
            passengerName: 'Pedro Oliveira',
            passengerCount: 3,
            seatNumber: '5C',
            gate: 'A12',
            terminal: '1',
            createdAt: '2024-11-20T08:00:00',
          },
          {
            id: '4',
            flightNumber: 'CM4321',
            airline: 'Copa Airlines',
            departureCode: 'GIG',
            arrivalCode: 'JFK',
            departureCity: 'Rio de Janeiro',
            arrivalCity: 'Nova York',
            departureTime: '23:00',
            arrivalTime: '06:30',
            departureDate: '2025-01-05',
            status: 'confirmada',
            passengerName: 'Ana Costa',
            passengerCount: 2,
            seatNumber: '8B',
            gate: 'C45',
            terminal: '3',
            createdAt: '2024-12-05T20:00:00',
          },
        ];
        setReservations(mockReservations);
        await AsyncStorage.setItem('reservations', JSON.stringify(mockReservations));
      }
    } catch (error) {
      console.error('Erro ao carregar reservas:', error);
    } finally {
      setLoading(false);
    }
  };

  // Salvar reservas no AsyncStorage
  const saveReservations = async (newReservations: Reservation[]) => {
    try {
      await AsyncStorage.setItem('reservations', JSON.stringify(newReservations));
    } catch (error) {
      console.error('Erro ao salvar reservas:', error);
    }
  };

  // Adicionar nova reserva
  const addReservation = (newReservation: Omit<Reservation, 'id' | 'createdAt'>) => {
    const reservation: Reservation = {
      ...newReservation,
      id: `res-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    const updatedReservations = [reservation, ...reservations];
    setReservations(updatedReservations);
    saveReservations(updatedReservations);
    Alert.alert('Sucesso', 'Reserva adicionada com sucesso!');
  };

  // Cancelar reserva
  const cancelReservation = (id: string) => {
    Alert.alert(
      'Cancelar Reserva',
      'Tem certeza que deseja cancelar esta reserva?',
      [
        { text: 'Não', style: 'cancel' },
        {
          text: 'Sim, Cancelar',
          style: 'destructive',
          onPress: () => {
            const updatedReservations = reservations.map(res =>
              res.id === id
                ? { ...res, status: 'cancelada' as const }
                : res
            );
            setReservations(updatedReservations);
            saveReservations(updatedReservations);
            Alert.alert('Cancelado', 'Reserva cancelada com sucesso!');
          },
        },
      ]
    );
  };

  // Filtrar reservas
  const filteredReservations = reservations.filter(res =>
    filter === 'todas' ? true : res.status === filter
  );

  // Estatísticas
  const totalReservations = reservations.length;
  const confirmedCount = reservations.filter(r => r.status === 'confirmada').length;
  const pendingCount = reservations.filter(r => r.status === 'pendente').length;
  const cancelledCount = reservations.filter(r => r.status === 'cancelada').length;
  const completedCount = reservations.filter(r => r.status === 'finalizada').length;

  // Renderizar status
  const renderStatus = (status: Reservation['status']) => {
    const config = {
      confirmada: { color: '#4caf50', icon: 'check-circle', label: 'Confirmada' },
      pendente: { color: '#ff9800', icon: 'pending', label: 'Pendente' },
      cancelada: { color: '#ff4444', icon: 'cancel', label: 'Cancelada' },
      finalizada: { color: '#2196f3', icon: 'check-circle', label: 'Finalizada' },
    };

    const { color, icon, label } = config[status];
    return (
      <View style={[styles.statusBadge, { backgroundColor: color + '20' }]}>
        <MaterialIcons name={icon as any} size={14} color={color} />
        <Text style={[styles.statusText, { color }]}>{label}</Text>
      </View>
    );
  };

  // Renderizar card de reserva
  const renderReservationCard = ({ item }: { item: Reservation }) => (
    <TouchableOpacity
      style={styles.reservationCard}
      activeOpacity={0.7}
      onPress={() => {
        Alert.alert(
          'Detalhes da Reserva',
          `Voo: ${item.flightNumber}\nCompanhia: ${item.airline}\nRota: ${item.departureCode} → ${item.arrivalCode}\nData: ${item.departureDate}\nPassageiro: ${item.passengerName}`,
          [{ text: 'OK' }]
        );
      }}
    >
      <LinearGradient
        colors={['rgba(0, 212, 255, 0.05)', 'rgba(0, 212, 255, 0.02)']}
        style={styles.cardGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.cardHeader}>
          <View style={styles.airlineInfo}>
            <Text style={styles.airlineName}>{item.airline}</Text>
            <Text style={styles.flightNumber}>Voo {item.flightNumber}</Text>
          </View>
          {renderStatus(item.status)}
        </View>

        <View style={styles.routeContainer}>
          <View style={styles.routePoint}>
            <Text style={styles.routeCode}>{item.departureCode}</Text>
            <Text style={styles.routeCity}>{item.departureCity}</Text>
            <Text style={styles.routeTime}>{item.departureTime}</Text>
          </View>

          <View style={styles.routeArrow}>
            <View style={styles.routeLine} />
            <MaterialIcons name="flight" size={20} color="#00d4ff" />
          </View>

          <View style={styles.routePoint}>
            <Text style={styles.routeCode}>{item.arrivalCode}</Text>
            <Text style={styles.routeCity}>{item.arrivalCity}</Text>
            <Text style={styles.routeTime}>{item.arrivalTime}</Text>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <View style={styles.footerInfo}>
            <MaterialIcons name="event" size={14} color="#9ab8d9" />
            <Text style={styles.footerText}>{item.departureDate}</Text>
          </View>

          <View style={styles.footerInfo}>
            <MaterialIcons name="people" size={14} color="#9ab8d9" />
            <Text style={styles.footerText}>{item.passengerCount} passageiro(s)</Text>
          </View>

          {item.seatNumber && (
            <View style={styles.footerInfo}>
              <MaterialIcons name="chair" size={14} color="#9ab8d9" />
              <Text style={styles.footerText}>Poltrona {item.seatNumber}</Text>
            </View>
          )}
        </View>

        {item.status !== 'cancelada' && item.status !== 'finalizada' && (
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => cancelReservation(item.id)}
          >
            <MaterialIcons name="delete-outline" size={18} color="#ff4444" />
            <Text style={styles.cancelButtonText}>Cancelar Reserva</Text>
          </TouchableOpacity>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={['#1a0d8d', '#2d1a9f', '#3d25b0']}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <MaterialIcons name="receipt-long" size={40} color="#00d4ff" />
          <Text style={styles.title}>Minhas Reservas</Text>
          <Text style={styles.subtitle}>
            Gerencie todos os seus voos em um só lugar
          </Text>
        </View>

        {/* Estatísticas */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{totalReservations}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={[styles.statCard, styles.statCardActive]}>
            <Text style={styles.statNumber}>{confirmedCount}</Text>
            <Text style={styles.statLabel}>Confirmadas</Text>
          </View>
          <View style={[styles.statCard, styles.statCardPending]}>
            <Text style={styles.statNumber}>{pendingCount}</Text>
            <Text style={styles.statLabel}>Pendentes</Text>
          </View>
          <View style={[styles.statCard, styles.statCardCancelled]}>
            <Text style={styles.statNumber}>{cancelledCount}</Text>
            <Text style={styles.statLabel}>Canceladas</Text>
          </View>
        </View>

        {/* Filtros */}
        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {['todas', 'confirmada', 'pendente', 'cancelada', 'finalizada'].map((f) => (
              <TouchableOpacity
                key={f}
                style={[
                  styles.filterButton,
                  filter === f && styles.filterButtonActive,
                ]}
                onPress={() => setFilter(f as any)}
              >
                <Text
                  style={[
                    styles.filterText,
                    filter === f && styles.filterTextActive,
                  ]}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Lista de Reservas */}
        {filteredReservations.length > 0 ? (
          <FlatList
            data={filteredReservations}
            keyExtractor={(item) => item.id}
            renderItem={renderReservationCard}
            scrollEnabled={false}
            contentContainerStyle={styles.listContainer}
          />
        ) : (
          <View style={styles.emptyState}>
            <MaterialIcons name="receipt-long" size={80} color="#555" />
            <Text style={styles.emptyStateTitle}>Nenhuma reserva encontrada</Text>
            <Text style={styles.emptyStateSubtitle}>
              {filter === 'todas'
                ? 'Você ainda não tem reservas. Faça sua primeira busca!'
                : `Nenhuma reserva com status "${filter}"`}
            </Text>
            <TouchableOpacity style={styles.emptyStateButton}>
              <LinearGradient
                colors={['#00d4ff', '#4a4fa0']}
                style={styles.emptyStateGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <MaterialIcons name="search" size={20} color="#fff" />
                <Text style={styles.emptyStateButtonText}>Buscar Voos</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
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
    paddingTop: 30,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
    textShadowColor: 'rgba(0, 212, 255, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#9ab8d9',
    marginTop: 4,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  statCardActive: {
    borderColor: 'rgba(76, 175, 80, 0.3)',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  statCardPending: {
    borderColor: 'rgba(255, 152, 0, 0.3)',
    backgroundColor: 'rgba(255, 152, 0, 0.1)',
  },
  statCardCancelled: {
    borderColor: 'rgba(255, 68, 68, 0.3)',
    backgroundColor: 'rgba(255, 68, 68, 0.1)',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  statLabel: {
    fontSize: 10,
    color: '#9ab8d9',
    marginTop: 2,
    textTransform: 'uppercase',
  },
  filterContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  filterButtonActive: {
    backgroundColor: 'rgba(0, 212, 255, 0.2)',
    borderColor: '#00d4ff',
  },
  filterText: {
    color: '#9ab8d9',
    fontSize: 12,
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#00d4ff',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  reservationCard: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 255, 0.15)',
  },
  cardGradient: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  airlineInfo: {
    flex: 1,
  },
  airlineName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  flightNumber: {
    fontSize: 12,
    color: '#9ab8d9',
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  routeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: 12,
  },
  routePoint: {
    alignItems: 'center',
    flex: 1,
  },
  routeCode: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00d4ff',
  },
  routeCity: {
    fontSize: 12,
    color: '#9ab8d9',
    marginTop: 2,
  },
  routeTime: {
    fontSize: 12,
    color: '#fff',
    marginTop: 2,
  },
  routeArrow: {
    alignItems: 'center',
    flex: 0.5,
  },
  routeLine: {
    width: 30,
    height: 1,
    backgroundColor: 'rgba(0, 212, 255, 0.3)',
    marginBottom: 4,
  },
  cardFooter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  footerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  footerText: {
    fontSize: 12,
    color: '#9ab8d9',
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
    gap: 6,
  },
  cancelButtonText: {
    color: '#ff4444',
    fontSize: 13,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: '#9ab8d9',
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  emptyStateButton: {
    marginTop: 24,
    borderRadius: 12,
    overflow: 'hidden',
  },
  emptyStateGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    gap: 8,
  },
  emptyStateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});