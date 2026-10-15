import { importLibrary, setOptions } from "@googlemaps/js-api-loader";
import { onValue, ref } from "firebase/database";
import { connectFirebase } from "./firebase.js";
import "./style.css";

const locationStatus = document.querySelector("#location-status");
const firebaseStatus = document.querySelector("#firebase-status");
const coordinates = document.querySelector("#coordinates");
const mapElement = document.querySelector("#map");

function showLocationError(error) {
  const messages = {
    1: "Permiso denegado. Permite el acceso a la ubicación en la configuración del navegador.",
    2: "No se pudo determinar la ubicación. Revisa el GPS o la conexión del dispositivo.",
    3: "Se agotó el tiempo de espera al obtener la ubicación. Inténtalo de nuevo.",
  };

  locationStatus.textContent = messages[error.code] ?? "No se pudo obtener la ubicación.";
  locationStatus.classList.add("error");
}

async function startMap() {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    locationStatus.textContent = "Falta VITE_GOOGLE_MAPS_API_KEY en .env.local.";
    locationStatus.classList.add("error");
    return;
  }

  try {
    setOptions({ key: apiKey, v: "weekly" });
    const { Map } = await importLibrary("maps");
    const { Marker } = await importLibrary("marker");
    const map = new Map(mapElement, {
      center: { lat: 19.4326, lng: -99.1332 },
      zoom: 15,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
    });
    const marker = new Marker({ map, title: "Mi ubicación" });

    if (!("geolocation" in navigator)) {
      locationStatus.textContent = "Este navegador no permite acceder a la ubicación.";
      locationStatus.classList.add("error");
      return;
    }

    locationStatus.textContent = "Esperando permiso y señal GPS…";
    navigator.geolocation.watchPosition(
      ({ coords }) => {
        const position = { lat: coords.latitude, lng: coords.longitude };
        map.setCenter(position);
        marker.setPosition(position);
        locationStatus.textContent = "Ubicación actualizada en tiempo real.";
        locationStatus.classList.remove("error");
        coordinates.textContent =
          `Latitud: ${position.lat.toFixed(6)} · Longitud: ${position.lng.toFixed(6)}`;
      },
      showLocationError,
      { enableHighAccuracy: true, maximumAge: 0, timeout: 15000 },
    );
  } catch (error) {
    console.error("No se pudo cargar Google Maps:", error);
    locationStatus.textContent =
      "No se pudo cargar Google Maps. Revisa la API key y que Maps JavaScript API esté habilitada.";
    locationStatus.classList.add("error");
  }
}

try {
  const result = connectFirebase();
  firebaseStatus.textContent = result.message;
  firebaseStatus.classList.toggle("error", !result.connected);
  if (result.database) {
    onValue(
      ref(result.database, ".info/connected"),
      (snapshot) => {
        const connected = snapshot.val() === true;
        firebaseStatus.textContent = connected
          ? "Conectado a Firebase Realtime Database. La ubicación no se envía ni se guarda."
          : "Conectando o reconectando a Firebase Realtime Database…";
        firebaseStatus.classList.remove("error");
      },
      (error) => {
        console.error("No se pudo comprobar la conexión con Firebase:", error);
        firebaseStatus.textContent = "No se pudo conectar a Firebase. Revisa la URL y las reglas.";
        firebaseStatus.classList.add("error");
      },
    );
  }
} catch (error) {
  console.error("No se pudo inicializar Firebase:", error);
  firebaseStatus.textContent = "No se pudo inicializar Firebase. Revisa la configuración.";
  firebaseStatus.classList.add("error");
}

startMap();
