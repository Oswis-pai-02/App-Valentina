import * as Notifications from "expo-notifications";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Configuración para que las notificaciones suenen incluso con la app abierta
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const recetaValentina = [
  { id: "1", nombre: "Trobamicina oft.", dosis: "2 gotas", hrs: 12, dias: 6 },
  { id: "2", nombre: "Clamoxin susp 250mg", dosis: "3.2 ml", hrs: 12, dias: 7 },
  { id: "3", nombre: "Prednisona 5mg", dosis: "3/4 tab", hrs: 24, dias: 4 },
  { id: "4", nombre: "Bisolvon jarabe", dosis: "1 ml", hrs: 12, dias: 4 },
];

export default function Index() {
  const [medicamentos, setMedicamentos] = useState(recetaValentina);

  useEffect(() => {
    // Solicitar permisos de notificación al abrir la app
    const pedirPermisos = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permiso denegado",
          "Se necesitan permisos para las alarmas.",
        );
      }
    };
    pedirPermisos();
  }, []);

  const programarRecordatorios = async (med) => {
    const totalTomas = (24 / med.hrs) * med.dias;

    // Iteramos para programar cada toma durante los días indicados
    for (let i = 1; i <= totalTomas; i++) {
      const trigger = new Date(Date.now() + i * med.hrs * 60 * 60 * 1000);

      await Notifications.scheduleNotificationAsync({
        content: {
          title: `¡Hora de la medicina de Valentina! 🐾`,
          body: `Toca darle ${med.dosis} de ${med.nombre}`,
          sound: true,
        },
        trigger,
      });
    }
    Alert.alert("Listo", `Alarmas programadas para ${med.nombre}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Receta Activa: Valentina</Text>
      <Text style={styles.subHeader}>Notas: Abundantes líquidos</Text>

      <FlatList
        data={medicamentos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.medName}>{item.nombre}</Text>
            <Text style={styles.medDetails}>Dosis: {item.dosis}</Text>
            <Text style={styles.medDetails}>
              Cada {item.hrs} hrs por {item.dias} días
            </Text>

            <TouchableOpacity
              style={styles.button}
              onPress={() => programarRecordatorios(item)}
            >
              <Text style={styles.buttonText}>Activar Alarmas</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
    marginTop: 40,
  },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 5, color: "#333" },
  subHeader: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
    fontStyle: "italic",
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3,
  },
  medName: { fontSize: 18, fontWeight: "bold", color: "#2c3e50" },
  medDetails: { fontSize: 14, color: "#7f8c8d", marginTop: 5 },
  button: {
    backgroundColor: "#3498db",
    padding: 10,
    borderRadius: 5,
    marginTop: 15,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
