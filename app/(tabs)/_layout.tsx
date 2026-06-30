import React, { useEffect, useState } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import {
  Ionicons,
  MaterialIcons,
  FontAwesome5,
} from '@expo/vector-icons';
import { Pressable, View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { RouteProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LoginScreen from '../(tabs)/usuario/Login';
import RegistroUser from '../(tabs)/usuario/RegistroUser';
import RegistroSuccess from '../(tabs)/usuario/RegistroSuccess';

import HomeScreen from './screens/HomeScreen';
import AboutCompanyScreen from './screens/AboutCompanyScreen';
import SearchFlightsScreen from './screens/SearchFlightsScreen';
import MinhasReservasScreen from './screens/MinhasReservasScreen'; // ← IMPORTADO

import GerenciamentoUser from '../(tabs)/usuario/GerenciamentoUser';

import AlterarSenhaScreen from '../(tabs)/usuario/AlterarSenha';
import RedefinirSenhaScreen from '../(tabs)/usuario/RedefinirSenha';
import CustomDrawerContent from './CustomDrawerContent';

type ColorScheme = 'light' | 'dark';

const DrawerNavigator = createDrawerNavigator();
const TabNavigator = createBottomTabNavigator();
const Stack = createStackNavigator();

const { width } = Dimensions.get('window');

/* =======================
   HEADER GRADIENTE PADRÃO
======================= */
const HeaderGradient = () => (
  <LinearGradient
    colors={['#1a0d8d', '#2d1a9f', '#3d25b0']}
    style={styles.headerGradient}
    start={[0, 0]}
    end={[1, 1]}
  />
);

/* =======================
   HEADER TITLE COM LOGO
======================= */
const HeaderTitle = () => (
  <View style={styles.headerTitleContainer}>
    <Image
      source={require('../../assets/images/AirTrip.png')}
      style={styles.headerLogo}
    />
    <Text style={styles.headerTitleText}>AirTrip</Text>
  </View>
);

/* =======================
   TABS - Abas Principais
======================= */
function Tabs() {
  const colorScheme = useColorScheme();

  return (
    <TabNavigator.Navigator
      initialRouteName="Home"
      screenOptions={({ route }: { route: RouteProp<any, any> }) => ({
        tabBarIcon: ({ color, size, focused }) => {
          const iconSize = focused ? size + 4 : size;

          switch (route.name) {
            case 'Home':
              return <MaterialIcons name="home" size={iconSize} color={color} />;
            case 'Buscar Voos':
              return <MaterialIcons name="flight-takeoff" size={iconSize} color={color} />;
            case 'Sobre':
              return <MaterialIcons name="info" size={iconSize} color={color} />;
            default:
              return <MaterialIcons name="home" size={iconSize} color={color} />;
          }
        },
        tabBarActiveTintColor: '#00d4ff',
        tabBarInactiveTintColor: '#9ab8d9',
        tabBarStyle: {
          backgroundColor: '#0d0620',
          borderTopColor: 'rgba(0, 212, 255, 0.2)',
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontSize: 20,
          fontWeight: 'bold',
        },
        headerBackground: HeaderGradient,
        headerStyle: {
          elevation: 0,
          shadowOpacity: 0,
        },
      })}
    >
      <TabNavigator.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerTitle: HeaderTitle,
        }}
      />
      <TabNavigator.Screen
        name="Buscar Voos"
        component={SearchFlightsScreen}
        options={{
          headerTitle: HeaderTitle,
        }}
      />
      <TabNavigator.Screen
        name="Sobre"
        component={AboutCompanyScreen}
        options={{
          headerTitle: HeaderTitle,
        }}
      />
    </TabNavigator.Navigator>
  );
}

/* =======================
   DRAWER PRINCIPAL
======================= */
function DrawerLayout() {
  const colorScheme = useColorScheme() as ColorScheme;

  const [userType, setUserType] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Verifica se o usuário está logado
  useEffect(() => {
    const checkUser = async () => {
      try {
        const userTypeStorage = await AsyncStorage.getItem('userType');
        setUserType(userTypeStorage || null);
      } catch (error) {
        console.error('Erro ao verificar usuário:', error);
        setUserType(null);
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, []);

  if (loading) return null;

  return (
    <DrawerNavigator.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={({ navigation }) => ({
        drawerStyle: {
          backgroundColor: '#0d0620',
          width: Math.min(width * 0.8, 300),
        },
        drawerActiveTintColor: '#00d4ff',
        drawerInactiveTintColor: '#9ab8d9',
        drawerActiveBackgroundColor: 'rgba(0, 212, 255, 0.15)',
        drawerItemStyle: {
          borderRadius: 10,
          marginHorizontal: 10,
          marginVertical: 2,
        },
        drawerLabelStyle: {
          fontSize: 15,
          fontWeight: '500',
          marginLeft: -8,
        },
        headerLeft: () => (
          <Pressable
            onPress={() => navigation.toggleDrawer()}
            style={styles.menuButton}
          >
            <LinearGradient
              colors={['rgba(0, 212, 255, 0.2)', 'rgba(0, 212, 255, 0.05)']}
              style={styles.menuButtonGradient}
              start={[0, 0]}
              end={[1, 1]}
            >
              <MaterialIcons name="menu" size={28} color="#00d4ff" />
            </LinearGradient>
          </Pressable>
        ),
        headerBackground: HeaderGradient,
        headerStyle: {
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTitleStyle: {
          color: '#fff',
          fontSize: 20,
          fontWeight: 'bold',
        },
        headerTitle: HeaderTitle,
      })}
    >
      {/* ================= HOME ================= */}
      <DrawerNavigator.Screen
        name="Home"
        component={Tabs}
        options={{
          drawerIcon: ({ color, size }) => (
            <MaterialIcons name="home" size={size} color={color} />
          ),
        }}
      />

      {/* ================= ADMIN - Gerenciamento ================= */}
      {userType === '0' && (
        <>
          <DrawerNavigator.Screen
            name="GerenciamentoUser"
            component={GerenciamentoUser}
            options={{
              title: 'Gerenciar Usuários',
              drawerIcon: ({ color, size }) => (
                <MaterialIcons name="people" size={size} color={color} />
              ),
              headerTitle: 'Gerenciar Usuários',
              headerBackground: HeaderGradient,
            }}
          />

          <DrawerNavigator.Screen
            name="AlterarSenha"
            component={AlterarSenhaScreen}
            options={{
              title: 'Alterar Senha',
              drawerIcon: ({ color, size }) => (
                <MaterialIcons name="lock" size={size} color={color} />
              ),
              headerTitle: 'Alterar Senha',
              headerBackground: HeaderGradient,
            }}
          />

          <DrawerNavigator.Screen
            name="RedefinirSenha"
            component={RedefinirSenhaScreen}
            options={{
              title: 'Redefinir Senha',
              drawerIcon: ({ color, size }) => (
                <MaterialIcons name="vpn-key" size={size} color={color} />
              ),
              headerTitle: 'Redefinir Senha',
              headerBackground: HeaderGradient,
            }}
          />
        </>
      )}

      {/* ================= USUÁRIO ================= */}
      {userType === '1' && (
        <>
          <DrawerNavigator.Screen
            name="MinhasReservas"
            component={MinhasReservasScreen}
            options={{
              title: 'Minhas Reservas',
              drawerIcon: ({ color, size }) => (
                <MaterialIcons name="receipt-long" size={size} color={color} />
              ),
              headerTitle: 'Minhas Reservas',
              headerBackground: HeaderGradient,
            }}
          />
        </>
      )}

      {/* ================= OPÇÕES GERAIS ================= */}
      <DrawerNavigator.Screen
        name="Sobre"
        component={AboutCompanyScreen}
        options={{
          title: 'Sobre a AirTrip',
          drawerIcon: ({ color, size }) => (
            <MaterialIcons name="info" size={size} color={color} />
          ),
          headerTitle: 'Sobre a AirTrip',
          headerBackground: HeaderGradient,
        }}
      />

    </DrawerNavigator.Navigator>
  );
}

/* =======================
   STACK PRINCIPAL COM LOGIN
======================= */
export default function RootStack() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="RegistroUser" component={RegistroUser} />
      <Stack.Screen name="RegistroSuccess" component={RegistroSuccess} />
      <Stack.Screen name="Main" component={DrawerLayout} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  headerGradient: {
    flex: 1,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerLogo: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: 'rgba(0, 212, 255, 0.5)',
  },
  headerTitleText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 212, 255, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  menuButton: {
    marginLeft: 15,
    borderRadius: 12,
    overflow: 'hidden',
  },
  menuButtonGradient: {
    padding: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 255, 0.3)',
  },
});