const fs = require('fs');
const path = require('path');

const projectDir = 'c:\\Users\\kesgr\\Downloads\\guia_entrevista_ionic_mobile\\guia_entrevista';
const jsonPath = path.join(projectDir, 'temario.json');
const jsPath = path.join(projectDir, 'temario-data.js');

const rawData = fs.readFileSync(jsonPath, 'utf8');
const data = JSON.parse(rawData);

const conceptUpdates = {
  "concept-01": {
    "expected": "La 'pantalla blanca' (White Screen of Death - WSOD) no es un error en sí mismo, sino un síntoma general de que la WebView o la aplicación web dejó de renderizar o quedó congelada durante su arranque. Ocurre comúnmente por: 1) Excepciones no capturadas durante la fase de bootstrap de Angular, 2) Promesas o llamadas de inicialización asíncrona suspendidas indefinidamente sin manejo de timeout, 3) Errores de ruta/autenticación en bucle infinito, 4) Fallos en la carga de assets JS/CSS compilados en producción (ej. rutas relativas incorrectas), 5) Fallos nativos o de plugins al cargar antes de montar la WebView, o 6) Overlays o splash screens nativos que no se ocultan explícitamente tras completar la inicialización.",
    "basic": "Asumir que la pantalla blanca se debe siempre a un único problema de CSS o a la falta de un try/catch puntual, en lugar de diagnosticar metódicamente la capa donde se detuvo el ciclo de arranque (WebView vs JavaScript vs Plugin Nativo)."
  },
  "concept-02": {
    "expected": "Son tres tecnologías de protección de secretos con propósitos y ámbitos totalmente distintos: 1) iOS Keychain y Android Keystore son servicios de seguridad locales dentro del dispositivo móvil. Almacenan credenciales, Refresh Tokens o claves de cifrado protegidas por hardware (Secure Enclave / TEE) y biometría. 2) Azure Key Vault es un servicio en la nube (cloud HSM) diseñado para gestionar secretos de infraestructura, certificados TLS y claves API del backend. Las aplicaciones móviles NUNCA deben consumir Azure Key Vault directamente con credenciales maestras; en su lugar, la app usa Keychain/Keystore localmente para guardar sus propios tokens y se comunica de forma segura con la API del backend, el cual utiliza Azure Key Vault de forma interna.",
    "basic": "Creer que Azure Key Vault sustituye a Keychain/Keystore en el cliente móvil o intentar almacenar secretos globales de backend dentro del código fuente de la app."
  },
  "concept-03": {
    "expected": "El ciclo de vida global de la app administra las transiciones de estado a nivel de sistema operativo mediante @capacitor/app. El evento pause o appStateChange(isActive: false) se dispara cuando la app pasa a segundo plano (background). resume o appStateChange(isActive: true) ocurre al regresar al primer plano (foreground). Durante el estado en background, el sistema operativo (especialmente iOS/Android) puede pausar el hilo ejecutor o eliminar por completo el proceso (Process Death) para liberar memoria RAM. Por tanto, al regresar a foreground se deben revalidar timeouts de sesión, refrescar tokens, verificar estado de red y solicitar biometría si la política de seguridad lo exige.",
    "basic": "Confundir el ciclo de vida global de la app con el ciclo de vida de páginas Ionic (ionViewWillEnter/ionViewWillLeave), o asumir que el código JavaScript sigue ejecutándose ininterrumpidamente mientras la app está en segundo plano."
  },
  "concept-04": {
    "expected": "Un deep link o notificación push representa exclusivamente una INTENCIÓN de navegación, jamás una autorización implícita. El flujo seguro exige: 1) Capturar el payload sin navegar de inmediato, 2) Verificar si la aplicación está inicializada y si existe una sesión activa; si no, guardar el destino como 'navegación pendiente' (deferred navigation) y redirigir al login o flujo de biometría, 3) Enviar el ID o recurso al backend mediante peticiones autenticadas para que el servidor valide si el usuario actual posee los permisos necesarios (autorización), y 4) Rendir la vista de destino solo tras confirmación exitosa del backend o manejar errores (401, 403, 404) limpiando el estado pendiente.",
    "basic": "Extraer un parámetro o ID del payload de la notificación e invocar inmediatamente router.navigate() sin validar sesión ni autorización de backend."
  },
  "concept-ionic-01": {
    "expected": "Los Web Components de Ionic encapsulan su estructura HTML y estilos CSS utilizando el Shadow DOM, evitando que los CSS globales del proyecto afecten el interior del componente o viceversa. Para personalizar elementos dentro del Shadow DOM sin recurrir a selectores frágiles o desaconsejados como ::ng-deep: 1) Se utilizan las CSS Custom Properties (variables expuestas como --background, --color, --border-radius), las cuales atraviesan el límite del Shadow DOM, y 2) Se utilizan los Shadow Parts (::part()), que son elementos internos marcados explícitamente por Ionic para permitir estilizado directo desde el CSS externo.",
    "basic": "Intentar sobreescribir la estructura interna de componentes Ionic usando ::ng-deep o selectores CSS profundos, lo que causa roturas silenciosas al actualizar la versión de Ionic."
  },
  "concept-ionic-02": {
    "expected": "Mientras que el RouterOutlet estándar de Angular destruye los componentes al navegar hacia otra ruta, el IonRouterOutlet de Ionic mantiene una pila de páginas (Navigation Stack) vivas en el DOM para posibilitar transiciones fluidas de deslizamiento y conservar el estado de scroll al presionar 'Atrás'. Como consecuencia, ngOnInit() solo se ejecuta UNA VEZ al instanciar el componente por primera vez. Para ejecutar lógica cada vez que la vista aparece en pantalla (como actualizar datos o refrescar contadores), Ionic ofrece los eventos propios ionViewWillEnter e ionViewDidEnter. Igualmente, ionViewWillLeave e ionViewDidLeave notifican la salida sin destruir el componente.",
    "basic": "Tratar ionViewWillEnter como un reemplazo idéntico de ngOnInit(), provocando llamadas HTTP redundantes o duplicadas cada vez que el usuario regresa a una pantalla guardada en el stack."
  },
  "concept-capacitor-01": {
    "expected": "Capacitor ejecuta la aplicación web dentro de un contenedor WebView nativo (WKWebView en iOS, Android WebView en Android). La comunicación entre JavaScript y el código nativo (Swift/Kotlin) se realiza mediante un puente (Native Bridge) asíncrono basado en transmisión de mensajes serializados en JSON (IPC). Cuando la app invoca un método de un plugin nativo (ej. @capacitor/camera), el puente empaqueta los argumentos, los envía a la capa nativa y devuelve una Promise JavaScript. Para eventos continuos (geolocalización, giroscopio, push), el puente registra listeners que notifican asíncronamente a JavaScript cuando la capa nativa emite un nuevo evento.",
    "basic": "Creer que Capacitor compila o convierte el código JavaScript en código nativo ejecutable C++/Java/Swift, en lugar de entenderlo como un runtime web desacoplado que se comunica con el sistema operativo mediante un puente IPC."
  },
  "concept-capacitor-02": {
    "expected": "HttpClient de Angular se ejecuta dentro del motor JavaScript de la WebView mediante peticiones estándar fetch/XHR, aprovechando la cadena de interceptores de Angular (HttpInterceptor), la gestión de Observables y la caché web. CapacitorHttp intercepta o delega las peticiones HTTP a las librerías de red nativas del sistema operativo (URLSession en iOS, UrlConnection / OkHttp en Android). Esto le permite saltar restricciones de CORS del navegador en entornos móviles y compartir cookies nativas del sistema. Sin embargo, al desviar las peticiones fuera de la WebView, se puede perder la integración directa con los interceptores de Angular si no se abstrae adecuadamente mediante un adapter.",
    "basic": "Utilizar CapacitorHttp indiscriminadamente en toda la aplicación solo para evitar configurar adecuadamente las políticas de CORS en los servidores de desarrollo o backend."
  },
  "concept-security-01": {
    "expected": "El almacenamiento web tradicional (localStorage, sessionStorage e IndexedDB) se guarda en archivos planos no cifrados dentro del directorio del navegador WebView. Cualquier vulnerabilidad de inyección de código (XSS) o inspección física de un dispositivo rooteado/jailbroken permite extraer su contenido fácilmente. Por ello, la información confidencial (Refresh Tokens, datos biométricos, claves de sesión) debe almacenarse utilizando Keychain (iOS) y Android Keystore a través de plugins seguros (como @capacitor-community/secure-storage o Capacitor Vault). Estos servicios cifran la información con claves respaldadas por módulos de seguridad en hardware (Secure Enclave / TEE) inaccesibles para otras apps o inspección web.",
    "basic": "Guardar tokens de autenticación de larga duración en localStorage o sessionStorage por simplicidad de desarrollo."
  },
  "concept-security-02": {
    "expected": "Certificate Pinning es una técnica de seguridad donde la aplicación móvil contiene embebido el certificado SSL/TLS o el hash de la clave pública del servidor backend objetivo. Durante el saludo inicial (TLS Handshake), la aplicación verifica que la clave o certificado presentado por el servidor coincida exactamente con el valor empaquetado. Esto invalida cualquier intento de interceptar la conexión mediante ataques Man-in-the-Middle (MitM), incluso si un atacante consigue instalar un certificado de CA malicioso o malintencionado en los ajustes de red del dispositivo del usuario.",
    "basic": "Asumir que realizar peticiones a través de https:// es automáticamente inmune a la interceptación de tráfico o inspección proxy (como Charles Proxy o Fiddler) en dispositivos con CA personalizadas instaladas."
  },
  "concept-arch-01": {
    "expected": "En Angular, la estrategia por defecto (ChangeDetectionStrategy.Default) utiliza Zone.js para revisar todo el árbol de componentes de arriba a abajo ante cualquier evento asíncrono (click, timer, HTTP). La estrategia OnPush le indica a Angular que solo revise un componente si sus entradas @Input() cambian de referencia por inmutabilidad, o si se emiten eventos explícitamente dentro del componente o mediante el pipe async. Por su parte, los Signals introducen un modelo de reactividad fina (fine-grained), notificando directamente a los nodos DOM exactos que dependen del valor modificado, permitiendo en un futuro prescindir del escaneo masivo de Zone.js y optimizando dramáticamente el rendimiento en dispositivos móviles.",
    "basic": "Aplicar ChangeDetectionStrategy.OnPush en un componente pero continuar mutando las propiedades de los objetos internamente sin cambiar sus referencias, provocando que la interfaz deje de actualizarse."
  },
  "concept-arch-02": {
    "expected": "En aplicaciones Angular e Ionic, las suscripciones a Observables de larga duración (como servicios instanciados como providedIn: 'root', eventos del Router o listeners de Capacitor) mantienen vivas las referencias en memoria a los callbacks y componentes que las crearon, impidiendo que el Garbage Collector libere la memoria aunque la pantalla se haya cerrado. Para prevenir fugas de memoria: 1) Utilizar el operador takeUntilDestroyed() en el contexto de inyección (Angular 16+), 2) Emplear el pipe async en los templates HTML para desuscripción automática, o 3) Gestionar explícitamente objetos Subscription cancelándolos en ngOnDestroy().",
    "basic": "Asumir que Angular destruye y cancela automáticamente todas las suscripciones de RxJS iniciadas dentro de un componente cuando este se desmonta del DOM."
  },
  "concept-perf-01": {
    "expected": "La arquitectura Offline-First prioriza la experiencia del usuario tratando la falta de conexión a Internet como un estado normal y no como una falla. La aplicación interactúa primariamente con una base de datos local embebida (como SQLite mediante @capacitor-community/sqlite o IndexedDB), garantizando lectura y escritura instantáneas a 60 FPS. Las mutaciones realizadas sin conexión se encolan en una tabla de transacciones pendientes (Sync Queue). Al recuperar conectividad, un servicio de sincronización en segundo plano procesa la cola enviando las peticiones de forma idempotente al backend y resolviendo posibles conflictos de versión.",
    "basic": "Utilizar localStorage o variables de estado volátiles para gestionar grandes volúmenes de datos o catálogos sin conexión, arriesgando pérdida de información por cuotas de espacio o cierre de proceso."
  },
  "concept-perf-02": {
    "expected": "Tanto Infinite Scroll como Virtual Scroll abordan listas largas, pero con mecanismos totalmente distintos. Infinite Scroll solicita páginas adicionales de datos del backend a medida que el usuario se acerca al final del scroll; sin embargo, cada nueva página añade nuevos nodos HTML al DOM, provocando que con miles de elementos el DOM se hipertrofie y la memoria de la WebView colapse. Virtual Scrolling (cdk-virtual-scroll-viewport) solo crea y mantiene en el DOM los nodos HTML correspondientes a los elementos visibles dentro del viewport actual, reciclando dinámicamente los mismos nodos al hacer scroll. Esto mantiene el consumo de memoria y CPU constante sin importar si la lista tiene 10 o 100,000 registros.",
    "basic": "Confiar únicamente en Infinite Scroll para listas masivas sin considerar el impacto de degradación paulatina de la memoria RAM en dispositivos móviles al mantener miles de nodos DOM activos."
  },
  "concept-pub-01": {
    "expected": "Para publicar y ejecutar aplicaciones móviles en dispositivos reales, los sistemas operativos exigen firmas criptográficas de autenticidad. En Android, se genera una clave privada almacenada en un archivo Keystore (.jks / .keystore) utilizada para firmar el paquete AAB o APK. Google Play App Signing permite delegar a Google la custodia de la clave maestra de producción. En iOS, el proceso requiere un certificado de desarrollador (Distribution Certificate), un identificador único (App ID con sus Entitlements) y un Provisioning Profile emitido por Apple que vincula criptográficamente el certificado, el App ID y la lista de dispositivos autorizados o el canal de App Store.",
    "basic": "Intentar generar o distribuir un paquete de versión final (Release) sin haber configurado las claves de firma criptográfica ni los perfiles de provisión adecuados para cada plataforma."
  },
  "concept-pub-02": {
    "expected": "Existen dos vías para actualizar una app híbrida publicada: 1) Actualización de Binario (Native Build): Requiere compilar un nuevo AAB (Android) o IPA (iOS) cuando se agregan/modifican plugins nativos, iconos, permisos o la versión del runtime de Capacitor. Este binario debe subirse a Google Play Console y App Store Connect para someterse a revisión oficial de las tiendas (review process). 2) Live Updates / OTA (Over-The-Air): Permite reemplazar de forma transparente e instantánea el paquete de assets web (HTML, JS, CSS) en los dispositivos instalados descargándolos en segundo plano mediante servicios como Ionic Appflow o Capgo, omitiendo el tiempo de revisión de las tiendas siempre que no se altere la naturaleza de la app ni código nativo.",
    "basic": "Creer que cualquier corrección menor en el código de una pantalla web o estilo CSS en Ionic exige inevitablemente compilar un nuevo binario nativo y esperar el proceso completo de aprobación de la App Store."
  },
  "concept-mf-01": {
    "expected": "La filosofía Mobile First aborda el diseño desde las restricciones físicas del dispositivo móvil: procesadores con energía limitada, pantallas pequeñas, conectividad variable y ergonomía táctil (uso con una mano/pulgar). Garantiza áreas de toque (Touch Targets) mínimas de 44x44px (Apple HIG) o 48x48px (Google Material Design) con separación suficiente para prevenir toques erróneos. Progressive Enhancement parte de este núcleo móvil optimizado y funcional, añadiendo capas progresivas de complejidad visual (paneles laterales, vistas multitabla) en pantallas mayores sin sobrecargar la versión móvil inicial.",
    "basic": "Concebir Mobile First como 'diseñar en desktop y luego ocultar elementos pesados mediante display: none en CSS para móvil', lo que no evita que el navegador descargue y ejecute recursos innecesarios en el dispositivo móvil."
  }
};

data.items.forEach(item => {
  if (conceptUpdates[item.id]) {
    item.expected = conceptUpdates[item.id].expected;
    item.basic = conceptUpdates[item.id].basic;
  }
});

// Save JSON
fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');

// Save JS
const jsContent = `window.INTERVIEW_GUIDE_DEFAULT_DATA = ${JSON.stringify(data, null, 2)};\n`;
fs.writeFileSync(jsPath, jsContent, 'utf8');

console.log('Successfully updated concept descriptions in temario.json and temario-data.js');
