# Mapa de ubicación

Página web que muestra en Google Maps la ubicación GPS del dispositivo que la abre. La página verifica la conexión con Realtime Database usando su indicador `.info/connected`; no lee ni escribe la ubicación.

## Preparar el proyecto

1. Instala Node.js (versión 18 o posterior).
2. En esta carpeta, instala las dependencias:

   ```powershell
   npm install
   ```

3. Crea el archivo local de configuración:

   ```powershell
   Copy-Item .env.example .env.local
   ```

4. Abre `.env.local` y completa:
   - `VITE_GOOGLE_MAPS_API_KEY`: una clave de Google Maps con **Maps JavaScript API** habilitada.
   - `VITE_FIREBASE_DATABASE_URL`: el enlace de Realtime Database que copiaste.
   - Los demás valores `VITE_FIREBASE_`: están en **Configuración del proyecto → General → Tus apps → app web**, dentro de la configuración del SDK.

   La clave de Google Maps se usa en el navegador: restríngela por sitio web (HTTP referrers) y limita su uso a Maps JavaScript API. No uses una clave de cuenta de servicio.

5. Inicia el servidor local:

   ```powershell
   npm run dev
   ```

   Abre en el navegador la dirección local que muestre Vite. Acepta el permiso de ubicación cuando el navegador lo solicite.

La geolocalización del navegador requiere `localhost` durante el desarrollo o HTTPS al publicar. La ubicación se mantiene en el dispositivo y no se guarda en Firebase.

## Publicar en GitHub Pages

El workflow `.github/workflows/deploy.yml` construye y publica el sitio al hacer push a `main`. Antes del primer despliegue:

1. En el repositorio de GitHub, abre **Settings → Secrets and variables → Actions → New repository secret**.
2. Agrega las ocho variables `VITE_...` que aparecen en `.env.example`, con los mismos valores de `.env.local`.
3. En **Settings → Pages → Build and deployment**, selecciona **GitHub Actions** como fuente.
4. Sube los cambios a la rama `main` o ejecuta manualmente el workflow desde **Actions → Deploy to GitHub Pages → Run workflow**.

Cuando la acción termine correctamente, el sitio estará en `https://magasotomayor18-star.github.io/google-maps/`. En Google Cloud, restringe la clave de Maps para que acepte ese dominio, además de localhost durante el desarrollo.

Las claves que se usan en el navegador se incluirán en los archivos JavaScript publicados por diseño; los secretos de Actions evitan versionarlas en el repositorio, pero no las convierten en claves privadas de servidor. Restringe la clave de Maps por HTTP referrer y API.
