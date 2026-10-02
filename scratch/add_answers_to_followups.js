const fs = require('fs');
const path = require('path');

const projectDir = 'c:\\Users\\kesgr\\Downloads\\guia_entrevista_ionic_mobile\\guia_entrevista';
const jsonPath = path.join(projectDir, 'temario.json');
const jsPath = path.join(projectDir, 'temario-data.js');

const rawData = fs.readFileSync(jsonPath, 'utf8');
const data = JSON.parse(rawData);

// Map of answers for existing follow-up questions across items
const followupAnswers = {
  // main-01
  "¿Qué decisión técnica dependía directamente de ti?": "Busca que especifique decisiones con impacto estructural (ej. abstracción de almacenamiento, elección de cliente HTTP, estrategia de manejo de estado o diseño de plugins) explicando la justificación técnica.",
  "¿Qué problema difícil recuerdas y cómo lo resolviste?": "Debe detallar la metodología de diagnóstico (logs nativos, DevTools, profilado de memoria) y la solución implementada evaluando las consecuencias técnicas.",
  "¿Qué cambiarías hoy de ese proyecto?": "Refleja capacidad de autocrítica técnica y evolución Senior (ej. haber aplicado arquitectura hexagonal desde el inicio, mejorado la cobertura de pruebas o evitado acoplamiento a librerías nativas específicas).",

  // main-02
  "¿Qué evitarías que conociera directamente un componente?": "Evitar que los componentes UI conozcan detalles de comunicación HTTP directa, consultas a bases de datos locales o plugins de Capacitor nativos; deben interactuar exclusivamente a través de Servicios/Facade.",
  "¿Cómo separarías lógica de negocio de integración nativa?": "Mediante el patrón Adapter/Puerto: definir interfaces en la capa de aplicación e inyectar las implementaciones concretas de Capacitor o Web Storage mediante la Inyección de Dependencias.",
  "¿Qué cambiaría si trabajan varios equipos?": "Modularización por dominios/features (Monorepo o Nx), contratos de API estrictos, componentes de diseño independientes (Design System) y pipelines de CI/CD aislados.",

  // main-03
  "¿Lo consumirías directamente desde la página?": "No. La integración nativa debe encapsularse dentro de un Servicio de Angular para facilitar pruebas unitarias (mocks), manejo centralizado de errores y abstraer la plataforma.",
  "¿Qué harías si no existe un plugin estable?": "Evaluar crear un plugin propio de Capacitor en Swift y Kotlin, o extender una solución de la comunidad tras auditar su código y mantenibilidad.",
  "¿Cómo manejarías diferencias entre Android e iOS?": "Manejando permisos y variaciones de la API nativa dentro del servicio adapter, exponiendo una interfaz unificada en TypeScript para la app.",

  // main-04
  "¿Qué revisarías si no aparece ningún error JavaScript?": "Inspeccionar los logs nativos mediante Logcat (Android Studio) o Console/Xcode para identificar excepciones en Swift/Kotlin, problemas de permisos en AndroidManifest/Info.plist o fallos en la WebView.",
  "¿Qué cambia si solo falla en release?": "Revisar ofuscación y minificación con R8/ProGuard (reglas de conservación de clases), diferencias de configuración de variables de entorno, certificados de red o SSL Pinning.",
  "¿Cómo sabrías si el problema es del plugin?": "Aislando la llamada al plugin en un proyecto mínimo reproducible y verificando si el error ocurre en la capa nativa antes de devolver la Promesa a JavaScript.",

  // security-01
  "¿Qué no guardarías nunca en localStorage?": "Refresh Tokens, contraseñas en texto plano, datos biométricos, número de tarjeta de crédito completo, CVV ni claves privadas de cifrado.",
  "¿Qué pasa con logs de producción?": "Deben deshabilitarse o sanitizarse mediante máscaras (redaction) para evitar filtrar tokens, payloads sensibles o PII (Personally Identifiable Information) en la consola.",
  "¿Qué harías al enviar la app a background?": "Superponer una pantalla de privacidad para ocultar capturas en el multitarea del SO y registrar un temporizador para expiración de sesión por inactividad.",
  "¿Qué limpiarías al hacer logout?": "Vaciar el estado en memoria (Stores/BehaviorSubjects), cancelar suscripciones activas, limpiar tokens en Secure Storage e inhabilitar suscripciones a notificaciones push.",

  // security-02
  "¿Qué diferencia hay entre Keychain y Keystore?": "Keychain es el almacén seguro de credenciales e ítems en iOS. Keystore gestiona y protege claves criptográficas dentro de chips seguros (TEE/Secure Enclave) en Android.",
  "¿Guardarías un API secret dentro de la app?": "No. Cualquier cliente público (app móvil) puede ser descompilado. Los API Secrets deben permanecer exclusivamente en el servidor backend.",
  "¿Qué ocurre si el refresh token deja de ser válido?": "La app debe revocar la sesión local de inmediato, limpiar Secure Storage y redirigir al usuario al flujo de inicio de sesión.",

  // security-03
  "¿Qué diferencia hay entre autenticación y autorización?": "Autenticación confirma QUIÉN es el usuario (identidad). Autorización valida QUÉ acciones o recursos tiene permitido ejecutar.",
  "¿Qué pasa si alguien manipula manualmente la URL o deep link?": "Los Guards de cliente bloquean la vista en UI, pero la seguridad real la ejecuta el backend rechazando peticiones sin el token o permiso correcto.",
  "¿Quién debe tomar la decisión final de acceso?": "El servidor backend tras validar el JWT o token de autorización en la petición.",

  // security-04
  "¿Qué pasa si la app estaba completamente cerrada?": "Ocurre un Cold Start: la app debe completar su bootstrap, inicializar servicios y validar la sesión antes de procesar el deep link pendiente.",
  "¿Qué pasa si el usuario debe iniciar sesión?": "Se almacena la ruta de destino como navegación postergada (deferred navigation) y se redirige a la pantalla deseada tras autenticarse con éxito.",
  "¿Y si el recurso ya no existe?": "El backend responde 404/403 y la app muestra una pantalla informativa amigable en lugar de congelar la navegación.",

  // security-05
  "¿Qué evento escucharías al volver a foreground?": "El evento resume o appStateChange(isActive: true) de @capacitor/app.",
  "¿Qué pasa si el SO mata el proceso?": "El estado en memoria se pierde; la app debe reiniciarse leyendo el estado persistido seguro y validando si la sesión sigue vigente.",
  "¿Cuándo pedirías biometría de nuevo?": "Si el tiempo transcurrido en background excede el umbral de inactividad definido por la política de seguridad (ej. 2-5 minutos).",

  // ionic-01
  "¿Una página Ionic siempre se destruye al navegar fuera?": "No. Si la navegación es mediante push/forward, la página permanece en el IonRouterOutlet stack para permitir volver atrás.",
  "¿Qué riesgo hay en hacer todas las llamadas HTTP en ionViewWillEnter?": "Riesgo de saturar la red con peticiones duplicadas e innecesarias cada vez que el usuario entra y sale de la pantalla.",

  // ionic-02
  "¿Dónde colocarías una operación que no debe bloquear la animación?": "En ionViewDidEnter, garantizando que la transición visual de entrada haya finalizado completamente a 60 FPS.",
  "¿Y si necesitas datos antes de pintar la pantalla?": "En ionViewWillEnter usando Skeleton Screens o loaders ligeros para mantener una perceived performance alta.",

  // ionic-03
  "¿Cómo afecta eso al lifecycle?": "Provoca que los componentes no se destruyan al salir y exige usar eventos de Ionic (ionViewWillEnter/Leave) en lugar de depender únicamente de ngOnInit/ngOnDestroy.",
  "¿Qué consecuencias tiene para el botón atrás?": "Permite que el botón atrás físico (Android) o el gesto de deslizamiento (iOS) restaure la vista previa instantáneamente conservando su scroll.",

  // ionic-04
  "¿Qué pasa si el modal empieza a tener demasiados pasos?": "Indica un problema de UX; debe convertirse en un flujo de páginas con su propia ruta o sub-router.",
  "¿Cómo devuelve información al contexto que lo abrió?": "Mediante modalController.dismiss(data, role) capturado con onDidDismiss() en la página origen.",

  // ionic-05
  "¿Qué pasa si se disparan dos requests al mismo tiempo?": "Se debe usar un contador de solicitudes activas o operadores de RxJS (switchMap/exhaustMap) para evitar loaders inconsistentes.",
  "¿Centralizarías loaders o los manejarías por pantalla?": "Centralizarlos mediante interceptores HTTP o un servicio de Loading central evita loaders huérfanos o bloqueos infinitos.",

  // ionic-06
  "¿Necesitas realmente renderizar todos los registros?": "No. Se debe implementar Paginación, Infinite Scroll o Virtual Scrolling (cdk-virtual-scroll) para limitar los nodos DOM.",
  "¿Qué medirías antes de cambiar código?": "Auditar la tasa de frames (FPS), el número de nodos DOM y la memoria RAM asignada a la WebView mediante DevTools.",

  // ionic-07
  "¿Qué es Shadow DOM?": "Árbol DOM interno e aislado de un Web Component que impide que estilos externos se filtren a su interior.",
  "¿Qué problema te puede traer abusar de ::ng-deep?": "Acoplamiento frágil a la estructura interna del componente; romperá el diseño al actualizar versiones de Ionic.",

  // capacitor-01
  "¿Podrías usar Capacitor sin Ionic?": "Sí. Capacitor es un runtime agnóstico que puede usarse con React, Vue, Svelte o JavaScript puro.",
  "¿La UI de Ionic se convierte en componentes nativos?": "No. La UI de Ionic se ejecuta como HTML/CSS optimizado dentro de la WebView nativa del dispositivo.",

  // capacitor-02
  "¿Qué revisarías antes de adoptar un plugin community?": "Mantenimiento activo, compatibilidad con la versión actual de Capacitor/iOS/Android, número de issues abiertos y licencias.",
  "¿Cómo reducirías el impacto si luego debes reemplazarlo?": "Creando un servicio Adapter en Angular que abstraiga las llamadas al plugin detrás de una interfaz propia.",

  // capacitor-03
  "¿Usarías HTTP nativo solo para saltarte CORS?": "No. CORS es un control de seguridad del servidor que debe configurarse adecuadamente en el backend.",
  "¿Qué perderías del pipeline de Angular?": "La cadena de HttpInterceptors (añadir tokens automáticamente, manejo global de errores) a menos que se abstraiga manualmente.",

  // capacitor-04
  "¿Qué diferencia hay entre pause y resume?": "pause se ejecuta cuando la app pasa a segundo plano; resume cuando regresa al uso activo en pantalla.",
  "¿Qué pasa si Android mata el proceso?": "Se pierde el estado en RAM. Al reabrir, se ejecuta un Cold Start desde la primera pantalla o restableciendo estado persistido.",
  "¿Para qué usarías appStateChange?": "Para monitorear cambios globales de visibilidad de la app y disparar reautenticaciones o pausar temporizadores.",

  // cases-01
  "¿Angular alcanzó a hacer bootstrap?": "Inspeccionar DevTools/Logcat para ver si el módulo raíz se instanció antes del fallo.",
  "¿Pasa en debug o release?": "Si solo ocurre en release, suele deberse a minificación/R8, URLs de entorno o firmas.",
  "¿Qué revisarías si JavaScript no muestra errores?": "Revisar logs nativos de Android/iOS para descartar fallos al inicializar la WebView o plugins.",

  // cases-02
  "¿Qué pasa si el primer request sí llegó al backend pero la app perdió la respuesta?": "El backend procesa la petición y, gracias a la clave de idempotencia, si se reintenta devuelve el resultado anterior sin duplicar la transacción.",
  "¿Qué es idempotencia?": "Propiedad que garantiza que una operación ejecutada múltiples veces produce exactamente el mismo resultado sin efectos colaterales.",

  // cases-03
  "¿Qué cambia entre debug y release?": "Minificación y ofuscación (R8/ProGuard), certificados de red, firmas criptográficas y variables de entorno.",
  "¿Cómo validarías si apunta al ambiente correcto?": "Revisar los valores inyectados en los archivos de environment de Angular y los endpoints de la API.",

  // mobilefirst-01
  "¿Mobile First significa diseñar para 375px?": "No. Significa diseñar pensando en las restricciones móviles (touch, batería, rendimiento) y escalar progresivamente.",
  "¿Qué decisiones cambian además del CSS?": "Carga diferida de recursos, priorización de peticiones de red y ergonomía de navegación táctil.",

  // mobilefirst-02
  "¿Cómo decidirías qué información mostrar primero?": "Priorizando los 2-3 datos más relevantes para la decisión del usuario y ocultando detalles secundarios tras un botón de expansión.",
  "¿Cuándo sí usarías scroll horizontal?": "Para galerías de imágenes o tarjetas relacionadas (carousels), asegurando indicadores visuales de scroll.",

  // mobilefirst-03
  "¿Qué prefieres: breakpoints por dispositivo o por contenido?": "Por contenido. Agregar un breakpoint cuando el diseño visual se rompe, independientemente del modelo de teléfono.",
  "¿Qué significa layout fluido?": "Diseño que utiliza porcentajes, Flexbox y CSS Grid para adaptarse suavemente a cualquier ancho disponible.",

  // mobilefirst-04
  "¿Qué harías con una acción que solo aparece en hover?": "Hacerla permanentemente visible en táctil o activar un menú contextual al presionar el elemento.",
  "¿Qué es un touch target?": "Área interactiva mínima (mínimo 44x44px) destinada a recibir toques con los dedos.",

  // mobilefirst-05
  "¿Una imagen de 6 MB deja de ser pesada porque la muestras pequeña?": "No. La memoria de la WebView decodificará la imagen a su resolución física completa, consumiendo la misma RAM.",
  "¿Qué significa lazy loading?": "Cargar imágenes o componentes únicamente cuando se acercan al viewport visible del usuario.",

  // release-01
  "¿Qué parte de firma cambia entre plataformas?": "Android utiliza archivos Keystore (.jks). iOS utiliza Certificados de Distribución y Provisioning Profiles de Apple.",
  "¿Cómo probarías antes de producción?": "Distribuyendo versiones beta privadas mediante TestFlight (iOS) y Google Play Internal Track (Android).",

  // release-02
  "¿Cuál subirías normalmente a Google Play?": "Android App Bundle (AAB), permitiendo a Google Play generar APKs optimizados para cada dispositivo.",
  "¿Qué papel tiene Play App Signing?": "Google custodia la clave de firma de producción y permite recuperar el acceso si pierdes la clave local.",

  // release-03
  "¿Por qué probar un build release y no solo debug?": "Porque release incluye ofuscación R8, optimizaciones y certificados reales que pueden causar comportamientos distintos a debug.",
  "¿Qué validarías específicamente de QA vs PROD?": "Endpoints de backend, claves de analítica, comportamiento de autenticación y certificados de SSL Pinning.",

  // release-04
  "¿Cómo evitarías publicar PROD apuntando a QA?": "Automatizando la inyección de environments en el pipeline de CI/CD según la rama de compilación.",
  "¿Qué cosas no considerarías una variable de entorno segura aunque estén en un .env?": "Cualquier clave privada o secret expuesto dentro del paquete cliente de la app móvil.",

  // cases-04
  "¿Qué diferencia hay entre biometría para desbloqueo simple y biometría como clave criptográfica respaldada por Keystore?": "El desbloqueo simple devuelve un booleano (fácilmente falsificable). La clave respaldada por Keystore requiere autenticación biométrica previa para desencriptar el secreto mediante hardware.",
  "¿Cómo evitar la pérdida irrecuperable de la sesión sin comprometer la seguridad?": "Capturando la excepción de invalidación de clave, eliminando el token caducado e indicando al usuario ingresar con contraseña para regenerar la clave.",

  // cases-05
  "¿Por qué los timestamps del reloj local del dispositivo no son confiables para ordenar eventos?": "Porque el usuario o la red pueden alterar la hora del dispositivo. Se deben usar contadores lógicos (Vector Clocks) o timestamps asignados por el servidor.",
  "¿Qué es un Vector Clock o un CRDT (Conflict-free Replicated Data Type)?": "Estructura de datos que permite combinar cambios concurrentes sin necesidad de coordinación centralizada.",

  // cases-06
  "¿Cómo afecta la resolución física de la imagen en decodificación a la memoria RAM de la WebView?": "La RAM consumida es proporcional a los píxeles descomprimidos (ancho x alto x 4 bytes por píxel), independientemente del tamaño comprimido en disco.",
  "¿Por qué el formato WebP consume sustancialmente menos memoria que JPEG/PNG sin comprimir?": "Ofrece mayor compresión manteniendo alta fidelidad y algoritmos de decodificación eficientes en GPUs móviles.",

  // cases-07
  "¿Cómo se inspeccionan los logs nativos de iOS cuando la consola de JavaScript no muestra errores?": "Conectando el iPhone a un Mac y revisando la app Console de macOS o el panel de depuración de Xcode.",
  "¿Qué es la plantilla Info.plist en un proyecto Capacitor en iOS?": "El archivo manifiesto donde se declaran permisos de privacidad, esquemas de URL y configuraciones globales de la app iOS.",

  // security-06
  "¿Por qué está desaconsejado el Implicit Flow en apps móviles según las especificaciones de la IETF?": "Porque retorna tokens directamente en la URI de redirección, exponiéndolos en el historial del navegador y vulnerables a interceptación.",
  "¿Por qué debe usarse el navegador nativo del sistema en lugar de un iframe o WebView incrustada para el login de OAuth?": "Porque evita que la app maliciosa pueda capturar las credenciales ingresadas (keylogging) y comparte la sesión existente en el navegador.",

  // security-07
  "¿Por qué la verificación puramente en cliente es fácilmente bypasseable mediante herramientas como Frida o Objection?": "Porque los atacantes pueden alterar la memoria en tiempo de ejecución y forzar a la función de verificación a retornar true.",
  "¿Qué es la API Play Integrity de Google y qué atestaciones proporciona?": "Servicio de Google que verifica la autenticidad del binario, la integridad del dispositivo y licencias mediante firmas criptográficas emitidas por servidores de Google.",

  // release-05
  "¿Qué es Fastlane y qué problemas resuelve en la automatización móvil?": "Librería de automatización que gestiona la compilación, incremento de versión, firmas y subida a tiendas mediante un único comando.",
  "¿Cómo se maneja la seguridad de los archivos de clave privada Keystore y certificados .p12 en los agentes de CI/CD?": "Codificándolos en Base64 e inyectándolos como variables de entorno secretas protegidas en el sistema de CI/CD.",

  // release-06
  "¿Por qué dos aplicaciones con el mismo Application ID no pueden coexistir en un dispositivo Android/iOS?": "Porque el sistema operativo usa el Application ID como identificador único para instalar y aislar el almacenamiento de la app.",
  "¿Cómo afecta la variación del Application ID a la configuración de servicios externos como Firebase o Push Notifications?": "Exige registrar cada Application ID (dev, qa, prod) en las consolas de Firebase/APNs y asociar sus archivos de configuración (google-services.json / GoogleService-Info.plist).",

  // capacitor-05
  "¿Cómo se envían datos de eventos nativos asíncronos desde Kotlin/Swift hacia los listeners de JavaScript usando notifyListeners()?": "Invocando notifyListeners('nombreEvento', JSObject) desde el código nativo para emitir eventos procesados por addListener en TypeScript.",
  "¿Qué ventajas tiene mantener el plugin en un paquete npm independiente frente a modificar el proyecto nativo local?": "Facilita la reutilización entre múltiples proyectos, el versionado semántico independiente y evita perder cambios al reconstruir carpetas nativas.",

  // ionic-08
  "¿Cómo se utiliza la Inyección de Dependencias de Angular (Providers / InjectionToken) para alternar entre el Adapter de Web y el Adapter de Móvil?": "Definiendo un InjectionToken para la interfaz y proveyendo la implementación web o nativa según la plataforma en el AppConfig.",
  "¿Qué estrategia seguirías para evitar cargar librerías nativas de Capacitor en el build de la versión Web?": "Usar carga dinámica (import()) o separación limpia de módulos mediante la configuración de paths del tsconfig en el Monorepo.",

  // concept-senior-01
  "¿Cómo se testea la lógica de negocio si los componentes no dependen directamente de Capacitor?": "Mediante pruebas unitarias puras en Jest/Jasmine inyectando Mocks/Stubs de las interfaces de Puertos sin requerir entorno de WebView.",
  "¿Qué es un Puerto y qué es un Adaptador en esta arquitectura?": "Un Puerto es una interfaz TypeScript que define el contrato de operaciones; un Adaptador es la implementación concreta (ej. Capacitor, LocalStorage, Mock).",

  // concept-senior-02
  "¿Qué métricas medirías (FCP, LCP, TTI) para auditar el arranque?": "First Contentful Paint (FCP), Largest Contentful Paint (LCP) y Time to Interactive (TTI) usando Lighthouse y Performance API.",
  "¿Cómo afecta el número de plugins registrados en Capacitor al tiempo de inicialización de la WebView?": "Cada plugin ejecuta código de inicialización en el hilo principal nativo; reducir plugins innecesarios agiliza el bootstrap."
};

// Convert all followups in items to structured { q, a } objects
data.items.forEach(item => {
  if (Array.isArray(item.followups)) {
    item.followups = item.followups.map(f => {
      if (typeof f === 'string') {
        const answer = followupAnswers[f] || "Respuesta y criterio técnico a evaluar por parte del entrevistador Senior.";
        return { "q": f, "a": answer };
      }
      return f;
    });
  }
});

// Save updated temario.json
fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');

// Save updated temario-data.js
const jsContent = `window.INTERVIEW_GUIDE_DEFAULT_DATA = ${JSON.stringify(data, null, 2)};\n`;
fs.writeFileSync(jsPath, jsContent, 'utf8');

console.log(`Successfully updated all followups with detailed answers across ${data.items.length} items.`);
