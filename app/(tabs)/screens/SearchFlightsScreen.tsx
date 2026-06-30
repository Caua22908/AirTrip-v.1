import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  FlatList,
  Image,
  ActivityIndicator,
  Alert,
  Switch,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Calendar } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

// Configurar notificações
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const airports = [
  { code: 'GIG', city: 'Rio de Janeiro', country: 'BR' },
  { code: 'GRU', city: 'São Paulo', country: 'BR' },
  { code: 'BSB', city: 'Brasília', country: 'BR' },
  { code: 'SDU', city: 'Santos Dumont', country: 'BR' },
  { code: 'CNF', city: 'Belo Horizonte', country: 'BR' },
  { code: 'CGB', city: 'Cuiabá', country: 'BR' },
  { code: 'CWB', city: 'Curitiba', country: 'BR' },
  { code: 'MAO', city: 'Manaus', country: 'BR' },
  { code: 'REC', city: 'Recife', country: 'BR' },
  { code: 'SSA', city: 'Salvador', country: 'BR' },
  { code: 'FOR', city: 'Fortaleza', country: 'BR' },
  { code: 'IGU', city: 'Foz do Iguaçu', country: 'PR' },
  { code: 'JFK', city: 'Nova York', country: 'EUA' },
  { code: 'MIA', city: 'Miami', country: 'EUA' },
  { code: 'LHR', city: 'Londres', country: 'Reino Unido' },
  { code: 'CDG', city: 'Paris', country: 'França' },
  { code: 'FRA', city: 'Frankfurt', country: 'Alemanha' },
  { code: 'AMS', city: 'Amsterdã', country: 'Holanda' },
  { code: 'DXB', city: 'Dubai', country: 'Emirados Árabes' },
];

interface FlightResult {
  flight_date: string;
  flight_status: string;
  departure: {
    airport: string;
    timezone: string;
    iata: string;
    icao: string;
    terminal: string;
    gate: string;
    delay: number;
    scheduled: string;
    estimated: string;
    actual: string;
  };
  arrival: {
    airport: string;
    timezone: string;
    iata: string;
    icao: string;
    terminal: string;
    gate: string;
    baggage: string;
    delay: number;
    scheduled: string;
    estimated: string;
    actual: string;
  };
  airline: {
    name: string;
    iata: string;
    icao: string;
  };
  flight: {
    number: string;
    iata: string;
    icao: string;
  };
}

interface ScheduledFlight {
  id: string;
  flight: FlightResult;
  departureCode: string;
  arrivalCode: string;
  notificationDate: Date;
  notificationTime: Date;
  isActive: boolean;
  createdAt: Date;
}

interface ApiResponse {
  data: FlightResult[];
  pagination?: {
    limit: number;
    offset: number;
    count: number;
    total: number;
  };
  error?: {
    code: string;
    message: string;
  };
}

export default function SearchFlightsScreen() {
  const [tripType, setTripType] = useState('roundtrip');
  const [departure, setDeparture] = useState<any>(null);
  const [arrival, setArrival] = useState<any>(null);
  const [departureDate, setDepartureDate] = useState(new Date());
  const [returnDate, setReturnDate] = useState(new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000));
  const [passengers, setPassengers] = useState(1);
  const [showDeparturePicker, setShowDeparturePicker] = useState(false);
  const [showReturnPicker, setShowReturnPicker] = useState(false);
  const [showAirportModal, setShowAirportModal] = useState(false);
  const [airportModalType, setAirportModalType] = useState('departure');
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [calendarMode, setCalendarMode] = useState<'departure' | 'return' | 'range'>('departure');
  const [calendarSelection, setCalendarSelection] = useState<{ start?: Date | null; end?: Date | null }>({ start: departureDate, end: returnDate });
  const [searchQuery, setSearchQuery] = useState('');
  
  // Estados para API
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [flights, setFlights] = useState<FlightResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  
  // Estados de paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalFlights, setTotalFlights] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const ITEMS_PER_PAGE = 10;

  // Estados para agendamento
  const [scheduledFlights, setScheduledFlights] = useState<ScheduledFlight[]>([]);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState<FlightResult | null>(null);
  const [notificationDate, setNotificationDate] = useState(new Date());
  const [notificationTime, setNotificationTime] = useState(new Date());
  const [showScheduleDatePicker, setShowScheduleDatePicker] = useState(false);
  const [showScheduleTimePicker, setShowScheduleTimePicker] = useState(false);
  const [showScheduledList, setShowScheduledList] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState(false);

  // Sua chave API - AviationStack
  const API_KEY = 'a2d0dcf6a549d01b4c120b13080078ba';
  const API_URL = 'https://api.aviationstack.com/v1/flights';

  // Carregar voos agendados ao iniciar
  useEffect(() => {
    loadScheduledFlights();
    requestNotificationPermission();
  }, []);

  // Verificar notificações agendadas periodicamente
  useEffect(() => {
    const interval = setInterval(() => {
      checkScheduledNotifications();
    }, 60000);

    return () => clearInterval(interval);
  }, [scheduledFlights]);

  const requestNotificationPermission = async () => {
    if (Platform.OS === 'web') {
      setNotificationPermission(true);
      return;
    }

    try {
      const { status } = await Notifications.requestPermissionsAsync();
      setNotificationPermission(status === 'granted');
      
      if (status !== 'granted') {
        Alert.alert(
          'Permissão necessária',
          'Para receber notificações sobre seus voos agendados, permita as notificações nas configurações do seu dispositivo.'
        );
      }
    } catch (error) {
      console.error('Erro ao solicitar permissão:', error);
    }
  };

  const loadScheduledFlights = async () => {
    try {
      const stored = await AsyncStorage.getItem('scheduledFlights');
      if (stored) {
        const parsed = JSON.parse(stored);
        const flightsWithDates = parsed.map((item: any) => ({
          ...item,
          notificationDate: new Date(item.notificationDate),
          notificationTime: new Date(item.notificationTime),
          createdAt: new Date(item.createdAt),
        }));
        setScheduledFlights(flightsWithDates);
      }
    } catch (error) {
      console.error('Erro ao carregar voos agendados:', error);
    }
  };

  const saveScheduledFlights = async (flights: ScheduledFlight[]) => {
    try {
      await AsyncStorage.setItem('scheduledFlights', JSON.stringify(flights));
    } catch (error) {
      console.error('Erro ao salvar voos agendados:', error);
    }
  };

  // Função CORRIGIDA para agendar notificação
// Na função scheduleNotification, use a sintaxe correta:

const scheduleNotification = async (flight: ScheduledFlight) => {
  if (Platform.OS === 'web') {
    Alert.alert(
      'Voo Agendado',
      `Você será notificado em ${flight.notificationDate.toLocaleDateString('pt-BR')} às ${flight.notificationTime.toLocaleTimeString('pt-BR')} sobre o voo ${flight.flight.flight?.iata || 'N/A'}`
    );
    return;
  }

  try {
    const notificationDateTime = new Date(
      flight.notificationDate.getFullYear(),
      flight.notificationDate.getMonth(),
      flight.notificationDate.getDate(),
      flight.notificationTime.getHours(),
      flight.notificationTime.getMinutes(),
      0
    );

    const now = new Date();
    const secondsUntilNotification = Math.floor((notificationDateTime.getTime() - now.getTime()) / 1000);

    if (secondsUntilNotification <= 0) {
      Alert.alert('Erro', 'A data/hora da notificação deve ser no futuro');
      return;
    }

    // CORREÇÃO: Usar a sintaxe correta para o trigger
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '✈️ Lembrete de Voo',
        body: `Voo ${flight.flight.flight?.iata || 'N/A'} - ${flight.departureCode} → ${flight.arrivalCode}\nCompanhia: ${flight.flight.airline?.name || 'N/A'}`,
        data: { flightId: flight.id },
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: {
        seconds: secondsUntilNotification,
        repeats: false,
      } as Notifications.TimeIntervalTriggerInput, // Usar type assertion
    });

    console.log(`✅ Notificação agendada para: ${notificationDateTime.toLocaleString('pt-BR')}`);
    console.log(`⏰ Em ${secondsUntilNotification} segundos (${Math.floor(secondsUntilNotification / 60)} minutos)`);
  } catch (error) {
    console.error('❌ Erro ao agendar notificação:', error);
    Alert.alert('Erro', 'Não foi possível agendar a notificação. Tente novamente.');
  }
};

  const checkScheduledNotifications = async () => {
    const now = new Date();
    const toNotify = scheduledFlights.filter(flight => {
      if (!flight.isActive) return false;
      
      const notificationDateTime = new Date(
        flight.notificationDate.getFullYear(),
        flight.notificationDate.getMonth(),
        flight.notificationDate.getDate(),
        flight.notificationTime.getHours(),
        flight.notificationTime.getMinutes(),
        0
      );

      return notificationDateTime <= now && flight.isActive;
    });

    for (const flight of toNotify) {
      const updatedFlights = scheduledFlights.map(f => {
        if (f.id === flight.id) {
          return { ...f, isActive: false };
        }
        return f;
      });
      
      setScheduledFlights(updatedFlights);
      await saveScheduledFlights(updatedFlights);

      Alert.alert(
        '✈️ Lembrete de Voo!',
        `Seu voo ${flight.flight.flight?.iata || 'N/A'} de ${flight.departureCode} para ${flight.arrivalCode} está agendado!`,
        [
          { text: 'Ver agora', onPress: () => setShowScheduledList(true) },
          { text: 'OK', style: 'cancel' },
        ]
      );
    }
  };

  const addScheduledFlight = async () => {
    if (!selectedFlight) return;

    const newScheduled: ScheduledFlight = {
      id: `${selectedFlight.flight?.number || 'flight'}-${Date.now()}`,
      flight: selectedFlight,
      departureCode: departure?.code || 'N/A',
      arrivalCode: arrival?.code || 'N/A',
      notificationDate: notificationDate,
      notificationTime: notificationTime,
      isActive: true,
      createdAt: new Date(),
    };

    const updatedList = [...scheduledFlights, newScheduled];
    setScheduledFlights(updatedList);
    await saveScheduledFlights(updatedList);
    await scheduleNotification(newScheduled);

    setShowScheduleModal(false);
    setSelectedFlight(null);

    Alert.alert(
      '✅ Voo Agendado!',
      `Você receberá uma notificação em ${notificationDate.toLocaleDateString('pt-BR')} às ${notificationTime.toLocaleTimeString('pt-BR')}`,
      [{ text: 'OK' }]
    );
  };

  const removeScheduledFlight = async (id: string) => {
    Alert.alert(
      'Remover agendamento',
      'Tem certeza que deseja remover este agendamento?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            const updatedList = scheduledFlights.filter(f => f.id !== id);
            setScheduledFlights(updatedList);
            await saveScheduledFlights(updatedList);
          },
        },
      ]
    );
  };

  const toggleScheduledFlight = async (id: string) => {
    const updatedList = scheduledFlights.map(f => {
      if (f.id === id) {
        return { ...f, isActive: !f.isActive };
      }
      return f;
    });
    setScheduledFlights(updatedList);
    await saveScheduledFlights(updatedList);
  };

  const searchFlights = async (page: number = 1, isLoadMore: boolean = false) => {
    if (!departure || !arrival) {
      Alert.alert('Erro', 'Selecione origem e destino');
      return;
    }

    if (departure.code === arrival.code) {
      Alert.alert('Erro', 'Origem e destino devem ser diferentes');
      return;
    }

    if (isLoadMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
      setShowResults(false);
      setFeedbackMessage(null);
      setFlights([]);
      setCurrentPage(1);
    }

    try {
      const dateParam = formatDateForAPI(departureDate);
      const offset = (page - 1) * ITEMS_PER_PAGE;
      
      const url = `${API_URL}?access_key=${API_KEY}&dep_iata=${departure.code}&arr_iata=${arrival.code}&date=${dateParam}&limit=${ITEMS_PER_PAGE}&offset=${offset}`;

      console.log(`🌐 Buscando voos - Página ${page}:`, url);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status} ${response.statusText}`);
      }

      const data: ApiResponse = await response.json();

      console.log(`📦 Resposta da API (Página ${page}):`, JSON.stringify(data).substring(0, 500) + '...');

      if (data.error) {
        const apiMessage = data.error.message || 'Erro ao buscar voos';
        setFeedbackMessage(`Não foi possível carregar os voos no momento. ${apiMessage}`);
        Alert.alert('Erro na API', apiMessage);
        setLoading(false);
        setLoadingMore(false);
        return;
      }

      if (data.data && data.data.length > 0) {
        setFeedbackMessage(null);
        if (isLoadMore) {
          setFlights(prev => [...prev, ...data.data]);
        } else {
          setFlights(data.data);
        }
        
        const total = data.pagination?.total || data.data.length;
        const totalPagesCalculated = Math.ceil(total / ITEMS_PER_PAGE);
        
        setTotalFlights(total);
        setTotalPages(totalPagesCalculated);
        setCurrentPage(page);
        setHasMore(page < totalPagesCalculated);
        setShowResults(true);
      } else {
        if (isLoadMore) {
          setHasMore(false);
          setLoadingMore(false);
          return;
        }
        
        const noResultsMessage = `Não encontramos voos de ${departure.code} para ${arrival.code} na data ${formatDate(departureDate)}. Tente outra data ou uma rota diferente.`;
        setFeedbackMessage(noResultsMessage);
        Alert.alert(
          'Nenhum voo encontrado', 
          `${noResultsMessage}\n\n💡 Dicas:\n• Tente outra data\n• Verifique os códigos dos aeroportos\n• Tente uma rota diferente`,
          [{ text: 'OK' }]
        );
        setFlights([]);
        setShowResults(false);
        setTotalFlights(0);
        setTotalPages(0);
        setHasMore(false);
      }
    } catch (error) {
      console.error('❌ Erro na busca:', error);
      setFeedbackMessage('Não foi possível conectar ao servidor. Verifique sua conexão com a internet e tente novamente.');
      Alert.alert(
        'Erro de Conexão', 
        'Não foi possível conectar ao servidor. Verifique sua conexão com a internet e tente novamente.'
      );
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMoreFlights = () => {
    if (!hasMore || loadingMore || loading) return;
    const nextPage = currentPage + 1;
    searchFlights(nextPage, true);
  };

  const goToPage = (page: number) => {
    if (page === currentPage) return;
    if (page < 1 || page > totalPages) return;
    searchFlights(page, false);
  };

  const formatDate = (date: any) => {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatDateForAPI = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  const formatKey = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const createMarkedDates = (start?: Date | null, end?: Date | null) => {
    const marks: any = {};
    if (!start && !end) return marks;

    if (start && !end) {
      marks[formatKey(start)] = { startingDay: true, endingDay: true, color: '#00d4ff', textColor: '#0d0620' };
      return marks;
    }

    // both present, ensure start <= end
    let s = start as Date;
    let e = end as Date;
    if (s > e) {
      const tmp = s; s = e; e = tmp;
    }

    const curr = new Date(s.getTime());
    while (curr <= e) {
      const key = formatKey(curr);
      const isStart = curr.getTime() === s.getTime();
      const isEnd = curr.getTime() === e.getTime();
      marks[key] = {
        color: '#00d4ff',
        textColor: '#0d0620',
        startingDay: isStart,
        endingDay: isEnd,
      };
      curr.setDate(curr.getDate() + 1);
    }

    return marks;
  };

  const getFlightStatus = (status: string) => {
    switch(status?.toLowerCase()) {
      case 'scheduled':
        return { text: 'Agendado', color: '#00d4ff', icon: 'schedule' };
      case 'active':
        return { text: 'Em voo', color: '#4caf50', icon: 'flight' };
      case 'landed':
        return { text: 'Pousou', color: '#4caf50', icon: 'flight-land' };
      case 'cancelled':
        return { text: 'Cancelado', color: '#ff4444', icon: 'cancel' };
      case 'incident':
        return { text: 'Incidente', color: '#ff9800', icon: 'warning' };
      case 'diverted':
        return { text: 'Desviado', color: '#ff9800', icon: 'flight' };
      default:
        return { text: status || 'Desconhecido', color: '#9ab8d9', icon: 'info' };
    }
  };

  const renderFlightCard = ({ item }: { item: FlightResult }) => {
    const status = getFlightStatus(item.flight_status);
    const hasDelay = item.departure?.delay > 0 || item.arrival?.delay > 0;
    const departureTime = item.departure?.scheduled || item.departure?.estimated || item.departure?.actual;
    const arrivalTime = item.arrival?.scheduled || item.arrival?.estimated || item.arrival?.actual;

    const isScheduled = scheduledFlights.some(
      f => f.flight.flight?.number === item.flight?.number && f.isActive
    );

    return (
      <View style={styles.flightCard}>
        <View style={styles.flightHeader}>
          <View style={styles.flightAirline}>
            <Text style={styles.flightAirlineName}>{item.airline?.name || 'Companhia Aérea'}</Text>
            <Text style={styles.flightNumber}>Voo {item.flight?.iata || item.flight?.number || 'N/A'}</Text>
          </View>
          <View style={[styles.flightStatus, { backgroundColor: status.color + '20' }]}>
            <MaterialIcons name={status.icon as any} size={16} color={status.color} />
            <Text style={[styles.flightStatusText, { color: status.color }]}>
              {status.text}
            </Text>
          </View>
        </View>

        <View style={styles.flightRoute}>
          <View style={styles.flightPoint}>
            <Text style={styles.flightTime}>
              {departureTime ? formatDateTime(departureTime) : 'Horário não disponível'}
            </Text>
            <Text style={styles.flightAirport}>
              {item.departure?.iata || departure?.code} - {item.departure?.airport || departure?.city || 'Origem'}
            </Text>
            {item.departure?.terminal && (
              <Text style={styles.flightTerminal}>Terminal {item.departure.terminal}</Text>
            )}
            {item.departure?.gate && (
              <Text style={styles.flightGate}>Portão {item.departure.gate}</Text>
            )}
          </View>

          <View style={styles.flightArrow}>
            <MaterialIcons name="flight" size={24} color="#00d4ff" />
            <View style={styles.flightLine} />
            <Text style={styles.flightDuration}>
              {item.flight?.iata || 'Voo'}
            </Text>
          </View>

          <View style={styles.flightPoint}>
            <Text style={styles.flightTime}>
              {arrivalTime ? formatDateTime(arrivalTime) : 'Horário não disponível'}
            </Text>
            <Text style={styles.flightAirport}>
              {item.arrival?.iata || arrival?.code} - {item.arrival?.airport || arrival?.city || 'Destino'}
            </Text>
            {item.arrival?.terminal && (
              <Text style={styles.flightTerminal}>Terminal {item.arrival.terminal}</Text>
            )}
            {item.arrival?.baggage && (
              <Text style={styles.flightBaggage}>Bagagem: {item.arrival.baggage}</Text>
            )}
          </View>
        </View>

        {hasDelay && (
          <View style={styles.flightDelay}>
            <MaterialIcons name="warning" size={16} color="#ff9800" />
            <Text style={styles.flightDelayText}>
              Atraso: {item.departure?.delay || 0}min (partida) / {item.arrival?.delay || 0}min (chegada)
            </Text>
          </View>
        )}

        {item.flight_date && (
          <View style={styles.flightDate}>
            <MaterialIcons name="calendar-today" size={14} color="#9ab8d9" />
            <Text style={styles.flightDateText}>
              Data do voo: {new Date(item.flight_date).toLocaleDateString('pt-BR')}
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.scheduleButton,
            isScheduled && styles.scheduleButtonActive,
          ]}
          onPress={() => {
            if (isScheduled) {
              Alert.alert('Voo já agendado', 'Este voo já está na sua lista de agendamentos.');
              return;
            }
            setSelectedFlight(item);
            setNotificationDate(new Date());
            setNotificationTime(new Date(Date.now() + 3600000));
            setShowScheduleModal(true);
          }}
        >
          <MaterialIcons 
            name={isScheduled ? 'check-circle' : 'alarm-add'} 
            size={20} 
            color={isScheduled ? '#4caf50' : '#fff'} 
          />
          <Text style={[
            styles.scheduleButtonText,
            isScheduled && styles.scheduleButtonTextActive,
          ]}>
            {isScheduled ? 'Agendado' : 'Agendar Voo'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderScheduledItem = ({ item }: { item: ScheduledFlight }) => (
    <View style={styles.scheduledCard}>
      <View style={styles.scheduledHeader}>
        <View style={styles.scheduledAirline}>
          <Text style={styles.scheduledAirlineName}>
            {item.flight.airline?.name || 'Companhia Aérea'}
          </Text>
          <Text style={styles.scheduledFlightNumber}>
            Voo {item.flight.flight?.iata || item.flight.flight?.number || 'N/A'}
          </Text>
        </View>
        <View style={styles.scheduledStatus}>
          <Switch
            value={item.isActive}
            onValueChange={() => toggleScheduledFlight(item.id)}
            trackColor={{ false: '#555', true: '#00d4ff' }}
            thumbColor={item.isActive ? '#fff' : '#999'}
          />
        </View>
      </View>

      <View style={styles.scheduledRoute}>
        <Text style={styles.scheduledRouteText}>
          {item.departureCode} → {item.arrivalCode}
        </Text>
      </View>

      <View style={styles.scheduledInfo}>
        <View style={styles.scheduledInfoItem}>
          <MaterialIcons name="calendar-today" size={14} color="#9ab8d9" />
          <Text style={styles.scheduledInfoText}>
            {item.notificationDate.toLocaleDateString('pt-BR')}
          </Text>
        </View>
        <View style={styles.scheduledInfoItem}>
          <MaterialIcons name="access-time" size={14} color="#9ab8d9" />
          <Text style={styles.scheduledInfoText}>
            {item.notificationTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
        <View style={styles.scheduledInfoItem}>
          <MaterialIcons 
            name={item.isActive ? 'notifications-active' : 'notifications-off'} 
            size={14} 
            color={item.isActive ? '#4caf50' : '#ff4444'} 
          />
          <Text style={[styles.scheduledInfoText, { color: item.isActive ? '#4caf50' : '#ff4444' }]}>
            {item.isActive ? 'Ativo' : 'Inativo'}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.scheduledRemoveButton}
        onPress={() => removeScheduledFlight(item.id)}
      >
        <MaterialIcons name="delete-outline" size={20} color="#ff4444" />
        <Text style={styles.scheduledRemoveText}>Remover</Text>
      </TouchableOpacity>
    </View>
  );

  const renderFooter = () => {
    if (!showResults || flights.length === 0) return null;

    return (
      <View style={styles.paginationContainer}>
        <View style={styles.paginationInfo}>
          <Text style={styles.paginationText}>
            Mostrando {flights.length} de {totalFlights} voos
          </Text>
          <Text style={styles.paginationText}>
            Página {currentPage} de {totalPages || 1}
          </Text>
        </View>

        <View style={styles.paginationControls}>
          <TouchableOpacity
            style={[styles.paginationButton, currentPage <= 1 && styles.paginationButtonDisabled]}
            onPress={() => goToPage(currentPage - 1)}
            disabled={currentPage <= 1 || loading}
          >
            <MaterialIcons 
              name="chevron-left" 
              size={24} 
              color={currentPage <= 1 ? '#555' : '#fff'} 
            />
            <Text style={[styles.paginationButtonText, currentPage <= 1 && styles.paginationButtonTextDisabled]}>
              Anterior
            </Text>
          </TouchableOpacity>

          <View style={styles.paginationCurrent}>
            <Text style={styles.paginationCurrentText}>{currentPage}</Text>
          </View>

          <TouchableOpacity
            style={[styles.paginationButton, !hasMore && styles.paginationButtonDisabled]}
            onPress={loadMoreFlights}
            disabled={!hasMore || loadingMore || loading}
          >
            <Text style={[styles.paginationButtonText, !hasMore && styles.paginationButtonTextDisabled]}>
              {loadingMore ? 'Carregando...' : 'Próximo'}
            </Text>
            <MaterialIcons 
              name="chevron-right" 
              size={24} 
              color={!hasMore ? '#555' : '#fff'} 
            />
          </TouchableOpacity>
        </View>

        {loadingMore && (
          <View style={styles.loadingMoreContainer}>
            <ActivityIndicator color="#00d4ff" size="small" />
            <Text style={styles.loadingMoreText}>Carregando mais voos...</Text>
          </View>
        )}
      </View>
    );
  };

  const handleDateChange = (event: any, selectedDate: any, type: any) => {
    // Detecta se a seleção foi confirmada (Android usa event.type)
    const confirmed = Platform.OS === 'android' ? event?.type === 'set' : true;

    if (type === 'departure') {
      setShowDeparturePicker(false);
      if (confirmed && selectedDate) {
        setDepartureDate(selectedDate);
        // Garantir que a volta não fique antes da ida
        if (returnDate && selectedDate > returnDate) {
          const nextDay = new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000);
          setReturnDate(nextDay);
        }
      }
    } else if (type === 'return') {
      setShowReturnPicker(false);
      if (confirmed && selectedDate) {
        // Não permitir selecionar volta anterior à ida
        if (selectedDate < departureDate) {
          Alert.alert('Data inválida', 'A data de volta não pode ser anterior à data de ida.');
          return;
        }
        setReturnDate(selectedDate);
      }
    } else if (type === 'scheduleDate') {
      setShowScheduleDatePicker(false);
      if (confirmed && selectedDate) setNotificationDate(selectedDate);
    } else if (type === 'scheduleTime') {
      setShowScheduleTimePicker(false);
      if (confirmed && selectedDate) setNotificationTime(selectedDate);
    }
  };

  const filteredAirports = airports.filter(
    (airport) =>
      airport.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      airport.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      airport.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAirportSelect = (airport: any) => {
    if (airportModalType === 'departure') {
      setDeparture(airport);
    } else {
      setArrival(airport);
    }
    setShowAirportModal(false);
    setSearchQuery('');
  };

  return (
    <LinearGradient
      colors={['#1a0d8d', '#2d1a9f', '#3d25b0']}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Image
            source={require('../../../assets/images/AirTrip.png')}
            style={styles.headerLogo}
          />
          <Text style={styles.title}>Buscar Voos</Text>
          <TouchableOpacity
            style={styles.scheduledButton}
            onPress={() => setShowScheduledList(true)}
          >
            <MaterialIcons name="alarm" size={28} color="#fff" />
            {scheduledFlights.filter(f => f.isActive).length > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {scheduledFlights.filter(f => f.isActive).length}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.tripTypeSection}>
          <TouchableOpacity
            style={[
              styles.tripTypeButton,
              tripType === 'oneway' && styles.tripTypeButtonActive,
            ]}
            onPress={() => setTripType('oneway')}
          >
            <MaterialIcons
              name="flight-takeoff"
              size={20}
              color={tripType === 'oneway' ? '#fff' : '#9ab8d9'}
            />
            <Text
              style={[
                styles.tripTypeText,
                tripType === 'oneway' && styles.tripTypeTextActive,
              ]}
            >
              Ida
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tripTypeButton,
              tripType === 'roundtrip' && styles.tripTypeButtonActive,
            ]}
            onPress={() => setTripType('roundtrip')}
          >
            <MaterialIcons
              name="flight-land"
              size={20}
              color={tripType === 'roundtrip' ? '#fff' : '#9ab8d9'}
            />
            <Text
              style={[
                styles.tripTypeText,
                tripType === 'roundtrip' && styles.tripTypeTextActive,
              ]}
            >
              Ida e Volta
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.searchForm}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>De (Origem)</Text>
            <TouchableOpacity
              style={styles.airportInput}
              onPress={() => {
                setAirportModalType('departure');
                setShowAirportModal(true);
              }}
            >
              <MaterialIcons name="flight-takeoff" size={20} color="#00d4ff" />
              <Text style={styles.airportInputText}>
                {departure ? `${departure.code} - ${departure.city}` : 'Selecione a origem'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Para (Destino)</Text>
            <TouchableOpacity
              style={styles.airportInput}
              onPress={() => {
                setAirportModalType('arrival');
                setShowAirportModal(true);
              }}
            >
              <MaterialIcons name="flight-land" size={20} color="#00d4ff" />
              <Text style={styles.airportInputText}>
                {arrival ? `${arrival.code} - ${arrival.city}` : 'Selecione o destino'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.datesRow}>
            <View style={[styles.formGroup, { flex: 1 }]}>
              <Text style={styles.label}>Ida</Text>
              <TouchableOpacity
                style={styles.dateInput}
                onPress={() => { setCalendarMode('departure'); setCalendarSelection({ start: departureDate, end: returnDate }); setShowCalendarModal(true); }}
              >
                <MaterialIcons name="calendar-today" size={18} color="#00d4ff" />
                <Text style={styles.dateInputText}>{formatDate(departureDate)}</Text>
              </TouchableOpacity>
            </View>

            {tripType === 'roundtrip' && (
              <View style={[styles.formGroup, { flex: 1, marginLeft: 10 }]}>
                <Text style={styles.label}>Volta</Text>
                <TouchableOpacity
                  style={styles.dateInput}
                  onPress={() => { setCalendarMode('return'); setCalendarSelection({ start: departureDate, end: returnDate }); setShowCalendarModal(true); }}
                >
                  <MaterialIcons name="calendar-today" size={18} color="#00d4ff" />
                  <Text style={styles.dateInputText}>{formatDate(returnDate)}</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <Modal
            visible={showCalendarModal}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setShowCalendarModal(false)}
          >
            <View style={styles.calendarOverlay}>
              <View style={styles.calendarContainer}>
                <View style={styles.calendarHeader}>
                  <Text style={styles.calendarTitle}>Selecione a data</Text>
                  <TouchableOpacity onPress={() => setShowCalendarModal(false)}>
                    <MaterialIcons name="close" size={24} color="#fff" />
                  </TouchableOpacity>
                </View>
                <Calendar
                  markingType={'period'}
                  markedDates={createMarkedDates(calendarSelection.start, calendarSelection.end)}
                  onDayPress={(day: any) => {
                    const selected = new Date(day.timestamp);
                    if (calendarMode === 'departure') {
                      // set departure immediately and close
                      setDepartureDate(selected);
                      if (selected > returnDate) {
                        const nextDay = new Date(selected.getTime() + 24 * 60 * 60 * 1000);
                        setReturnDate(nextDay);
                      }
                      setShowCalendarModal(false);
                    } else if (calendarMode === 'return') {
                      if (selected < departureDate) {
                        Alert.alert('Data inválida', 'A data de volta não pode ser anterior à data de ida.');
                        return;
                      }
                      setReturnDate(selected);
                      setShowCalendarModal(false);
                    } else {
                      // range selection
                      if (!calendarSelection.start || (calendarSelection.start && calendarSelection.end)) {
                        setCalendarSelection({ start: selected, end: null });
                      } else if (calendarSelection.start && !calendarSelection.end) {
                        if (selected < calendarSelection.start) {
                          setCalendarSelection({ start: selected, end: calendarSelection.start });
                        } else {
                          setCalendarSelection({ start: calendarSelection.start, end: selected });
                        }
                      }
                    }
                  }}
                />

                {calendarMode === 'range' && (
                  <View style={styles.calendarActions}>
                    <TouchableOpacity style={styles.calendarActionButton} onPress={() => setShowCalendarModal(false)}>
                      <Text style={styles.calendarActionText}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.calendarActionButton, styles.calendarActionConfirm]}
                      onPress={() => {
                        if (calendarSelection.start && calendarSelection.end) {
                          setDepartureDate(calendarSelection.start);
                          setReturnDate(calendarSelection.end);
                          setShowCalendarModal(false);
                        } else {
                          Alert.alert('Seleção incompleta', 'Selecione uma data de ida e outra de volta.');
                        }
                      }}
                    >
                      <Text style={[styles.calendarActionText, { color: '#fff' }]}>Confirmar</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          </Modal>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Passageiros</Text>
            <View style={styles.passengerControl}>
              <TouchableOpacity
                style={styles.passengerButton}
                onPress={() => passengers > 1 && setPassengers(passengers - 1)}
              >
                <MaterialIcons name="remove" size={20} color="#fff" />
              </TouchableOpacity>

              <Text style={styles.passengerCount}>{passengers}</Text>

              <TouchableOpacity
                style={styles.passengerButton}
                onPress={() => passengers < 9 && setPassengers(passengers + 1)}
              >
                <MaterialIcons name="add" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => searchFlights(1, false)}
            disabled={loading}
          >
            <LinearGradient
              colors={['#00d4ff', '#4a4fa0']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.searchButton, loading && styles.searchButtonDisabled]}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <MaterialIcons name="search" size={20} color="#fff" />
                  <Text style={styles.searchButtonText}>Buscar Voos</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {showResults && flights.length > 0 && (
          <View style={styles.resultsSection}>
            <View style={styles.resultsHeader}>
              <Text style={styles.resultsTitle}>
                🛫 {totalFlights} voo{totalFlights > 1 ? 's' : ''} encontrado{totalFlights > 1 ? 's' : ''}
              </Text>
              <TouchableOpacity onPress={() => setShowResults(false)}>
                <MaterialIcons name="close" size={24} color="#9ab8d9" />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={flights}
              keyExtractor={(item, index) => `${item.flight?.number || index}-${index}`}
              renderItem={renderFlightCard}
              scrollEnabled={false}
              ListFooterComponent={renderFooter}
            />
          </View>
        )}

        {!showResults && !loading && (
          <View style={styles.tipsSection}>
            {feedbackMessage ? (
              <View style={styles.feedbackCard}>
                <MaterialIcons name="info-outline" size={20} color="#00d4ff" />
                <Text style={styles.feedbackText}>{feedbackMessage}</Text>
              </View>
            ) : null}

            <Text style={styles.tipsTitle}>💡 Dicas para Economizar</Text>

            <View style={styles.tipCard}>
              <MaterialIcons name="info" size={20} color="#00d4ff" />
              <Text style={styles.tipText}>Voe na terça ou quarta para melhores preços</Text>
            </View>

            <View style={styles.tipCard}>
              <MaterialIcons name="info" size={20} color="#00d4ff" />
              <Text style={styles.tipText}>Reserve com até 3 meses de antecedência</Text>
            </View>

            <View style={styles.tipCard}>
              <MaterialIcons name="info" size={20} color="#00d4ff" />
              <Text style={styles.tipText}>Voos noturnos geralmente têm preços menores</Text>
            </View>

            <View style={styles.tipCard}>
              <MaterialIcons name="info" size={20} color="#00d4ff" />
              <Text style={styles.tipText}>Use alertas de preço para acompanhar ofertas</Text>
            </View>
          </View>
        )}

        <Modal
          visible={showScheduleModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowScheduleModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>✈️ Agendar Voo</Text>
                <TouchableOpacity onPress={() => setShowScheduleModal(false)}>
                  <MaterialIcons name="close" size={28} color="#fff" />
                </TouchableOpacity>
              </View>

              {selectedFlight && (
                <View style={styles.scheduleContent}>
                  <View style={styles.scheduleFlightInfo}>
                    <Text style={styles.scheduleFlightTitle}>
                      {selectedFlight.airline?.name || 'Companhia Aérea'}
                    </Text>
                    <Text style={styles.scheduleFlightCode}>
                      Voo {selectedFlight.flight?.iata || selectedFlight.flight?.number || 'N/A'}
                    </Text>
                    <Text style={styles.scheduleRoute}>
                      {departure?.code || 'N/A'} → {arrival?.code || 'N/A'}
                    </Text>
                  </View>

                  <View style={styles.scheduleDivider} />

                  <Text style={styles.scheduleLabel}>
                    Quando deseja ser notificado?
                  </Text>

                  <View style={styles.scheduleDateTimeRow}>
                    <TouchableOpacity
                      style={styles.scheduleDateTimeButton}
                      onPress={() => setShowScheduleDatePicker(true)}
                    >
                      <MaterialIcons name="calendar-today" size={20} color="#00d4ff" />
                      <Text style={styles.scheduleDateTimeText}>
                        {notificationDate.toLocaleDateString('pt-BR')}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.scheduleDateTimeButton}
                      onPress={() => setShowScheduleTimePicker(true)}
                    >
                      <MaterialIcons name="access-time" size={20} color="#00d4ff" />
                      <Text style={styles.scheduleDateTimeText}>
                        {notificationTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.scheduleActions}>
                    <TouchableOpacity
                      style={[styles.scheduleActionButton, styles.scheduleCancelButton]}
                      onPress={() => setShowScheduleModal(false)}
                    >
                      <Text style={styles.scheduleCancelText}>Cancelar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.scheduleActionButton, styles.scheduleConfirmButton]}
                      onPress={addScheduledFlight}
                    >
                      <MaterialIcons name="check" size={20} color="#fff" />
                      <Text style={styles.scheduleConfirmText}>Agendar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          </View>
        </Modal>

        <Modal
          visible={showScheduledList}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowScheduledList(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>🔔 Voos Agendados</Text>
                <TouchableOpacity onPress={() => setShowScheduledList(false)}>
                  <MaterialIcons name="close" size={28} color="#fff" />
                </TouchableOpacity>
              </View>

              {scheduledFlights.length === 0 ? (
                <View style={styles.emptyState}>
                  <MaterialIcons name="alarm-off" size={60} color="#555" />
                  <Text style={styles.emptyStateText}>
                    Nenhum voo agendado
                  </Text>
                  <Text style={styles.emptyStateSubtext}>
                    Agende um voo para receber notificações
                  </Text>
                </View>
              ) : (
                <FlatList
                  data={scheduledFlights}
                  keyExtractor={(item) => item.id}
                  renderItem={renderScheduledItem}
                  contentContainerStyle={styles.scheduledList}
                />
              )}
            </View>
          </View>
        </Modal>

        <Modal
          visible={showAirportModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowAirportModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {airportModalType === 'departure'
                    ? 'Selecione a Origem'
                    : 'Selecione o Destino'}
                </Text>
                <TouchableOpacity onPress={() => setShowAirportModal(false)}>
                  <MaterialIcons name="close" size={28} color="#fff" />
                </TouchableOpacity>
              </View>

              <TextInput
                style={styles.searchInput}
                placeholder="Buscar cidade, país ou código..."
                placeholderTextColor="#9ab8d9"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />

              <FlatList
                data={filteredAirports}
                keyExtractor={(item) => item.code}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.airportItem}
                    onPress={() => handleAirportSelect(item)}
                  >
                    <View style={styles.airportItemContent}>
                      <Text style={styles.airportCode}>{item.code}</Text>
                      <View>
                        <Text style={styles.airportCity}>{item.city}</Text>
                        <Text style={styles.airportCountry}>{item.country}</Text>
                      </View>
                    </View>
                    <MaterialIcons name="chevron-right" size={24} color="#00d4ff" />
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </Modal>
      </ScrollView>

      {showDeparturePicker && (
        <DateTimePicker
          value={departureDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, date) => handleDateChange(event, date, 'departure')}
          minimumDate={new Date()}
        />
      )}

      {showReturnPicker && (
        <DateTimePicker
          value={returnDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, date) => handleDateChange(event, date, 'return')}
          minimumDate={departureDate}
        />
      )}

      {showScheduleDatePicker && (
        <DateTimePicker
          value={notificationDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, date) => handleDateChange(event, date, 'scheduleDate')}
          minimumDate={new Date()}
        />
      )}

      {showScheduleTimePicker && (
        <DateTimePicker
          value={notificationTime}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, date) => handleDateChange(event, date, 'scheduleTime')}
        />
      )}
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
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  headerLogo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
    borderWidth: 2,
    borderColor: '#00d4ff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
  },
  scheduledButton: {
    position: 'relative',
    padding: 8,
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#ff4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  tripTypeSection: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 10,
  },
  tripTypeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
    borderWidth: 2,
    borderColor: 'rgba(0, 212, 255, 0.3)',
    gap: 8,
  },
  tripTypeButtonActive: {
    backgroundColor: 'rgba(0, 212, 255, 0.3)',
    borderColor: '#00d4ff',
  },
  tripTypeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9ab8d9',
  },
  tripTypeTextActive: {
    color: '#fff',
  },
  searchForm: {
    paddingHorizontal: 20,
    marginBottom: 30,
    backgroundColor: 'rgba(0, 212, 255, 0.05)',
    marginHorizontal: 20,
    borderRadius: 15,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 255, 0.2)',
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#9ab8d9',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  airportInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: 'rgba(0, 212, 255, 0.2)',
    gap: 10,
  },
  airportInputText: {
    flex: 1,
    color: '#fff',
    fontSize: 14,
  },
  datesRow: {
    flexDirection: 'row',
    gap: 10,
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: 'rgba(0, 212, 255, 0.2)',
    gap: 8,
  },
  dateInputText: {
    flex: 1,
    color: '#fff',
    fontSize: 14,
  },
  passengerControl: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 10,
    paddingVertical: 8,
    borderWidth: 2,
    borderColor: 'rgba(0, 212, 255, 0.2)',
    gap: 15,
  },
  passengerButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#00d4ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  passengerCount: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    minWidth: 30,
    textAlign: 'center',
  },
  searchButton: {
    flexDirection: 'row',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    gap: 10,
  },
  searchButtonDisabled: {
    opacity: 0.7,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tipsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  feedbackCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 212, 255, 0.12)',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 255, 0.25)',
    gap: 10,
    alignItems: 'flex-start',
  },
  feedbackText: {
    color: '#fff',
    fontSize: 13,
    flex: 1,
    lineHeight: 18,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#00d4ff',
    gap: 12,
    alignItems: 'center',
  },
  tipText: {
    color: '#9ab8d9',
    fontSize: 13,
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    flex: 1,
    backgroundColor: '#1a0d8d',
    marginTop: 40,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  calendarOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
  },
  calendarContainer: {
    marginHorizontal: 20,
    backgroundColor: '#1a0d8d',
    borderRadius: 12,
    overflow: 'hidden',
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)'
  },
  calendarTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  calendarActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
  },
  calendarActionButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    marginHorizontal: 6,
  },
  calendarActionConfirm: {
    backgroundColor: '#00d4ff',
  },
  calendarActionText: {
    color: '#fff',
    fontWeight: '700',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 212, 255, 0.2)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  searchInput: {
    marginHorizontal: 20,
    marginVertical: 15,
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    color: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 255, 0.2)',
  },
  airportItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 212, 255, 0.1)',
  },
  airportItemContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  airportCode: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00d4ff',
    minWidth: 45,
  },
  airportCity: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  airportCountry: {
    fontSize: 12,
    color: '#9ab8d9',
    marginTop: 2,
  },
  resultsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  flightCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 255, 0.15)',
  },
  flightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  flightAirline: {
    flex: 1,
  },
  flightAirlineName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  flightNumber: {
    color: '#9ab8d9',
    fontSize: 12,
    marginTop: 2,
  },
  flightStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  flightStatusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  flightRoute: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  flightPoint: {
    flex: 1,
  },
  flightTime: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  flightAirport: {
    color: '#9ab8d9',
    fontSize: 12,
    marginTop: 2,
  },
  flightTerminal: {
    color: '#00d4ff',
    fontSize: 11,
    marginTop: 2,
  },
  flightGate: {
    color: '#00d4ff',
    fontSize: 11,
    marginTop: 2,
  },
  flightBaggage: {
    color: '#00d4ff',
    fontSize: 11,
    marginTop: 2,
  },
  flightArrow: {
    alignItems: 'center',
    paddingHorizontal: 10,
    flex: 0.5,
  },
  flightLine: {
    width: 30,
    height: 1,
    backgroundColor: 'rgba(0, 212, 255, 0.3)',
    marginTop: -5,
  },
  flightDuration: {
    color: '#9ab8d9',
    fontSize: 10,
    marginTop: 4,
  },
  flightDelay: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
    gap: 8,
  },
  flightDelayText: {
    color: '#ff9800',
    fontSize: 12,
    flex: 1,
  },
  flightDate: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  flightDateText: {
    color: '#9ab8d9',
    fontSize: 11,
  },
  paginationContainer: {
    marginTop: 10,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 212, 255, 0.15)',
  },
  paginationInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  paginationText: {
    color: '#9ab8d9',
    fontSize: 12,
  },
  paginationControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  paginationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(0, 212, 255, 0.15)',
    borderRadius: 8,
    gap: 4,
  },
  paginationButtonDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    opacity: 0.5,
  },
  paginationButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  paginationButtonTextDisabled: {
    color: '#555',
  },
  paginationCurrent: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#00d4ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paginationCurrentText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingMoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 10,
  },
  loadingMoreText: {
    color: '#9ab8d9',
    fontSize: 14,
  },
  scheduleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 212, 255, 0.2)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 10,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 255, 0.3)',
  },
  scheduleButtonActive: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    borderColor: '#4caf50',
  },
  scheduleButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  scheduleButtonTextActive: {
    color: '#4caf50',
  },
  scheduleContent: {
    padding: 20,
  },
  scheduleFlightInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  scheduleFlightTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  scheduleFlightCode: {
    color: '#9ab8d9',
    fontSize: 14,
    marginBottom: 4,
  },
  scheduleRoute: {
    color: '#00d4ff',
    fontSize: 16,
    fontWeight: '600',
  },
  scheduleDivider: {
    height: 1,
    backgroundColor: 'rgba(0, 212, 255, 0.2)',
    marginBottom: 20,
  },
  scheduleLabel: {
    color: '#9ab8d9',
    fontSize: 14,
    marginBottom: 12,
  },
  scheduleDateTimeRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  scheduleDateTimeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 255, 0.2)',
    gap: 8,
  },
  scheduleDateTimeText: {
    color: '#fff',
    fontSize: 14,
  },
  scheduleActions: {
    flexDirection: 'row',
    gap: 12,
  },
  scheduleActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
  },
  scheduleCancelButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  scheduleCancelText: {
    color: '#9ab8d9',
    fontSize: 16,
    fontWeight: '600',
  },
  scheduleConfirmButton: {
    backgroundColor: '#00d4ff',
  },
  scheduleConfirmText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scheduledList: {
    padding: 20,
  },
  scheduledCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 255, 0.15)',
  },
  scheduledHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  scheduledAirline: {
    flex: 1,
  },
  scheduledAirlineName: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  scheduledFlightNumber: {
    color: '#9ab8d9',
    fontSize: 12,
    marginTop: 2,
  },
  scheduledStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scheduledRoute: {
    marginBottom: 8,
  },
  scheduledRouteText: {
    color: '#00d4ff',
    fontSize: 14,
    fontWeight: '600',
  },
  scheduledInfo: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  scheduledInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  scheduledInfoText: {
    color: '#9ab8d9',
    fontSize: 12,
  },
  scheduledRemoveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
    marginTop: 4,
    paddingTop: 8,
  },
  scheduledRemoveText: {
    color: '#ff4444',
    fontSize: 13,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
  emptyStateSubtext: {
    color: '#9ab8d9',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
});