const fs = require('fs');
const path = require('path');

const projectDir = 'c:\\Users\\kesgr\\Downloads\\guia_entrevista_ionic_mobile\\guia_entrevista';
const jsonPath = path.join(projectDir, 'temario.json');
const jsPath = path.join(projectDir, 'temario-data.js');

const rawData = fs.readFileSync(jsonPath, 'utf8');
const data = JSON.parse(rawData);

// 1. Remove category "Adaptabilidad RN → Ionic"
data.items = data.items.filter(item => item.category !== "Adaptabilidad RN → Ionic");

// 2. Define new Senior-level items
const newSeniorItems = [
  {
    "id": "cases-04",
    "category": "Casos reales",
    "priority": "alta",
    "type": "pregunta",
    "question": "Al actualizar la huella o rostro en los ajustes del dispositivo iOS/Android, el almacenamiento seguro o biometría lanza un error irrecuperable en producción. ¿Qué ocurrió y cómo lo resolverías?",
    "expected": "Explicar la invalidación de claves (Key Invalidation). Android Keystore e iOS Keychain con flag biometricCurrentSet invalidan automáticamente la clave de cifrado generada por hardware si la plantilla biométrica cambia en el SO. La app Senior debe capturar este fallo específico, no tratarlo como un error genérico, limpiar el token caducado/inválido de forma segura e instruir al usuario a reautenticarse con usuario/contraseña para regenerar un nuevo par de claves criptográficas.",
    "basic": "Creer que es un error de código del plugin o intentar reiniciar la aplicación esperando que vuelva a funcionar automáticamente.",
    "followups": [
      "¿Qué diferencia hay entre biometría para desbloqueo simple y biometría como clave criptográfica respaldada por Keystore?",
      "¿Cómo evitar la pérdida irrecuperable de la sesión sin comprometer la seguridad?"
    ],
    "terms": [
      {
        "term": "Key Invalidation",
        "definition": "Invalidación automática de la clave criptográfica por el SO al detectar cambios en el enrolamiento biométrico."
      },
      {
        "term": "Secure Enclave",
        "definition": "Procesador seguro en iOS que gestiona claves ligadas a biometría."
      }
    ],
    "tags": [
      "biometría",
      "keystore",
      "keychain",
      "casos reales",
      "seguridad"
    ]
  },
  {
    "id": "cases-05",
    "category": "Casos reales",
    "priority": "alta",
    "type": "pregunta",
    "question": "Dos usuarios editan el mismo expediente en modo offline y ambos se conectan a internet al mismo tiempo. ¿Cómo manejarías la resolución de conflictos en la app y el backend?",
    "expected": "Demostrar conocimiento de estrategias de sincronización avanzadas: 1) Determinación de la regla de negocio (Last-Write-Wins vs fusión de campos vs intervención manual), 2) Uso de identificadores UUID generados en cliente para evitar colisiones de IDs, 3) Control de concurrencia optimista utilizando firmas de versión (Vector Clocks, ETag o Timestamps con versión), y 4) Manejo de respuestas 409 Conflict presentando al usuario una interfaz de conciliación visual si la regla no es automatizable.",
    "basic": "Decir 'se guarda el último que envíe la petición' (Last-Write-Wins a ciegas) sin considerar pérdida de datos ni control de versiones.",
    "followups": [
      "¿Por qué los timestamps del reloj local del dispositivo no son confiables para ordenar eventos?",
      "¿Qué es un Vector Clock o un CRDT (Conflict-free Replicated Data Type)?"
    ],
    "terms": [
      {
        "term": "Optimistic Concurrency Control",
        "definition": "Mecanismo que valida que la versión enviada coincida con la del servidor antes de aplicar la mutación."
      },
      {
        "term": "Conflict Resolution",
        "definition": "Regla de negocio o algoritmo encargado de conciliar cambios divergentes."
      }
    ],
    "tags": [
      "offline",
      "sincronización",
      "conflictos",
      "concurrencia",
      "casos reales"
    ]
  },
  {
    "id": "cases-06",
    "category": "Casos reales",
    "priority": "alta",
    "type": "pregunta",
    "question": "La app móvil sufre cierres inesperados (OOM Crash / Memory Pressure) únicamente en dispositivos Android de gama media/baja al abrir un catálogo con imágenes de alta resolución. ¿Cómo diagnosticarías y solucionarías el problema?",
    "expected": "Aislar la causa en la WebView: 1) Inspeccionar la memoria del Heap con Chrome DevTools (remote debugging) y Profiler de Android Studio, 2) Identificar si las imágenes se están renderizando a su tamaño original sin compresión ni escalado adaptativo, 3) Implementar imágenes responsivas (srcset / WebP) servidas desde CDN optimizada para móvil, 4) Limpiar referencias a imágenes en componentes destruidos y aplicar lazy loading nativo (loading='lazy'), y 5) En listas, utilizar Virtual Scrolling para desinstanciar elementos HTML fuera del viewport.",
    "basic": "Sugerir que es un error de Angular o intentar solucionar agregando un setTimeout.",
    "followups": [
      "¿Cómo afecta la resolución física de la imagen en decodificación a la memoria RAM de la WebView?",
      "¿Por qué el formato WebP consume sustancialmente menos memoria que JPEG/PNG sin comprimir?"
    ],
    "terms": [
      {
        "term": "OOM (Out Of Memory)",
        "definition": "El sistema operativo mata el proceso porque la WebView excedió la cuota de memoria RAM asignada."
      },
      {
        "term": "Decoded Image Memory",
        "definition": "Memoria en RAM descompresionada requerida para pintar cada píxel de una imagen."
      }
    ],
    "tags": [
      "performance",
      "oom",
      "memoria",
      "imágenes",
      "casos reales"
    ]
  },
  {
    "id": "cases-07",
    "category": "Casos reales",
    "priority": "alta",
    "type": "pregunta",
    "question": "Al actualizar Xcode o el SDK de iOS, la integración con la cámara o localización deja de funcionar o la app se cierra de golpe al intentar abrir el plugin. ¿Qué causas nativas buscarías?",
    "expected": "Revisar los permisos y cadenas de privacidad requeridas por Apple en el archivo Info.plist. Si Apple añade o endurece requisitos de privacidad (ej. NSCameraUsageDescription, NSLocationWhenInUseUsageDescription), la llamada a la API nativa sin la descripción explícita o el permiso del usuario causará un crash inmediato lanzado por el SO. También revisar si el plugin nativo requiere actualización para Swift/iOS SDK o si faltan Entitlements en la configuración.",
    "basic": "Reinstalar node_modules o modificar el código TypeScript de Angular esperando que se solucione.",
    "followups": [
      "¿Cómo se inspeccionan los logs nativos de iOS cuando la consola de JavaScript no muestra errores?",
      "¿Qué es la plantilla Info.plist en un proyecto Capacitor en iOS?"
    ],
    "terms": [
      {
        "term": "Info.plist",
        "definition": "Archivo de propiedades de iOS donde se declaran permisos de privacidad e identificadores nativos."
      },
      {
        "term": "Privacy Usage Description",
        "definition": "Texto explícito requerido por Apple que justifica ante el usuario el motivo por el cual se solicita un permiso nativo."
      }
    ],
    "tags": [
      "ios",
      "xcode",
      "info.plist",
      "permisos",
      "casos reales"
    ]
  },
  {
    "id": "security-06",
    "category": "Seguridad",
    "priority": "alta",
    "type": "pregunta",
    "question": "¿Cómo implementarías la autenticación de usuarios mediante OAuth 2.0 con PKCE (Proof Key for Code Exchange) en una aplicación móvil Ionic/Capacitor?",
    "expected": "OAuth 2.0 PKCE es la recomendación oficial para clientes públicos (apps móviles/SPA) que no pueden almacenar un client_secret de forma segura. El flujo implica: 1) La app genera un code_verifier aleatorio y deriva un code_challenge (SHA-256), 2) Abre el flujo de autorización mediante un navegador del sistema seguro (Browser de Capacitor / Safari View Controller / Custom Tabs, no una WebView incrustada ordinaria), 3) El proveedor de identidad redirige mediante un Deep Link registrado a la app con un authorization_code, y 4) La app intercambia el código más el code_verifier en el endpoint de token sin requerir client_secret.",
    "basic": "Almacenar el client_secret del cliente OAuth dentro del código de la app o usar el flujo Implícito (Implicit Flow).",
    "followups": [
      "¿Por qué está desaconsejado el Implicit Flow en apps móviles según las especificaciones de la IETF?",
      "¿Por qué debe usarse el navegador nativo del sistema en lugar de un iframe o WebView incrustada para el login de OAuth?"
    ],
    "terms": [
      {
        "term": "PKCE",
        "definition": "Mecanismo de seguridad que vincula la solicitud de código de autorización con el intercambio de tokens mediante un reto de clave dinámica."
      },
      {
        "term": "System Browser vs WebView",
        "definition": "El navegador del sistema protege contra la interceptación de credenciales por parte de la app."
      }
    ],
    "tags": [
      "oauth2",
      "pkce",
      "seguridad",
      "autenticación"
    ]
  },
  {
    "id": "security-07",
    "category": "Seguridad",
    "priority": "alta",
    "type": "pregunta",
    "question": "Para una aplicación bancaria o fintech, se requiere verificar la integridad de la app y detectar si el dispositivo está rooteado o tiene Jailbreak. ¿Cómo abordarías este requerimiento?",
    "expected": "Aislar y desacoplar las verificaciones: 1) Integrar plugins o librerías nativas probadas (RootBear en Android, Detección de Frida/Jailbreak en iOS), 2) Usar APIs oficiales del sistema operativo como Play Integrity API (Android) y DeviceCheck / App Attest (iOS) para validar en el backend que el binario es auténtico y no ha sido alterado (anti-tampering), y 3) Asumir una postura de defensa en profundidad donde la decisión final de bloquear operaciones críticas la toma el backend tras evaluar los atestaciones firmadas por Google/Apple.",
    "basic": "Escribir un if sencillo en JavaScript verificando la existencia de la carpeta /system/app o confiar ciegamente en una bandera en cliente.",
    "followups": [
      "¿Por qué la verificación puramente en cliente es fácilmente bypasseable mediante herramientas como Frida o Objection?",
      "¿Qué es la API Play Integrity de Google y qué atestaciones proporciona?"
    ],
    "terms": [
      {
        "term": "Play Integrity / App Attest",
        "definition": "Servicios de atestación por hardware provistos por Google y Apple para certificar la integridad del binario y del entorno de ejecución."
      },
      {
        "term": "Anti-Tampering",
        "definition": "Técnicas que previenen la modificación del binario de la app o la inyección de código dinámico."
      }
    ],
    "tags": [
      "root",
      "jailbreak",
      "play-integrity",
      "seguridad",
      "fintech"
    ]
  },
  {
    "id": "release-05",
    "category": "Publicación",
    "priority": "alta",
    "type": "pregunta",
    "question": "¿Cómo estructurarías un pipeline de CI/CD automatizado para compilar, firmar y desplegar versiones de prueba y producción de una app Ionic/Capacitor?",
    "expected": "Diseñar un pipeline robusto (GitHub Actions / GitLab CI / Bitrise) con los siguientes pasos: 1) Lint, pruebas unitarias y de integración web, 2) Inyección de variables de entorno según la rama (main, qa, dev), 3) npx cap sync para sincronizar los proyectos nativos, 4) Ejecución de scripts Fastlane (fastlane ios beta, fastlane android internal), 5) Inyección de certificados de firma y perfiles (mediante Fastlane Match o secretos de CI), 6) Compilación de paquetes AAB (Android) e IPA (iOS), y 7) Despliegue automático a Google Play Internal Track y Apple TestFlight notificando al equipo por Slack/Teams.",
    "basic": "Compilar manualmente desde Android Studio y Xcode en la laptop del desarrollador cada vez que se requiere una entrega.",
    "followups": [
      "¿Qué es Fastlane y qué problemas resuelve en la automatización móvil?",
      "¿Cómo se maneja la seguridad de los archivos de clave privada Keystore y certificados .p12 en los agentes de CI/CD?"
    ],
    "terms": [
      {
        "term": "Fastlane",
        "definition": "Herramienta de automatización estándar en la industria móvil para gestionar builds, firmas y despliegues en tiendas."
      },
      {
        "term": "Fastlane Match",
        "definition": "Enfoque que gestiona y sincroniza certificados y perfiles de Apple entre miembros del equipo a través de un repositorio cifrado."
      }
    ],
    "tags": [
      "ci-cd",
      "fastlane",
      "automatización",
      "testflight",
      "play-console"
    ]
  },
  {
    "id": "release-06",
    "category": "Publicación",
    "priority": "media",
    "type": "pregunta",
    "question": "Necesitamos que en el mismo dispositivo se puedan instalar simultáneamente la app de DEV, la de QA y la de PROD. ¿Qué cambios de configuración debes realizar a nivel de Capacitor y proyectos nativos?",
    "expected": "Configurar Application IDs / Bundle IDs dinámicos por entorno: 1) En Android (build.gradle), definir applicationIdSuffix (.dev, .qa) para cada buildType o productFlavor, 2) En iOS (Xcode / targets), definir Bundle Identifiers distintos (com.empresa.app.dev, com.empresa.app.qa), 3) Configurar esquemas de URI / Deep Links distintos por variante (appdev://, appqa://), y 4) Utilizar capacitor.config.ts dinámico o variables de entorno que modifiquen el appId y appName durante el build para identificar visualmente cada ambiente.",
    "basic": "Cambiar manualmente el paquete o desinstalar la versión de PROD para poder probar la de QA.",
    "followups": [
      "¿Por qué dos aplicaciones con el mismo Application ID no pueden coexistir en un dispositivo Android/iOS?",
      "¿Cómo afecta la variación del Application ID a la configuración de servicios externos como Firebase o Push Notifications?"
    ],
    "terms": [
      {
        "term": "Application ID / Bundle Identifier",
        "definition": "Identificador único global de la aplicación ante el sistema operativo y las tiendas."
      },
      {
        "term": "Build Variants / Flavors",
        "definition": "Configuraciones que permiten generar distintas versiones (DEV/QA/PROD) de la misma base de código."
      }
    ],
    "tags": [
      "flavors",
      "build-variants",
      "bundle-id",
      "configuración"
    ]
  },
  {
    "id": "capacitor-05",
    "category": "Capacitor",
    "priority": "alta",
    "type": "pregunta",
    "question": "¿Cómo implementarías un Plugin propio de Capacitor desde cero para exponer una librería nativa personalizada en iOS (Swift) y Android (Kotlin)?",
    "expected": "Explicar el patrón de desarrollo de plugins de Capacitor: 1) Crear la interfaz en TypeScript con anotaciones @registerPlugin y definir los métodos con Promise o PluginListenerHandle, 2) En Android (Kotlin), extender Plugin, anotar la clase con @CapacitorPlugin y los métodos con @PluginMethod, utilizando call.resolve(JSObject) o call.reject(), 3) En iOS (Swift), extender CAPPlugin y usar la macro CAP_PLUGIN_METHOD, y 4) Empaquetar el plugin como paquete npm independiente o módulo local y desacoplar su consumo en la app Ionic mediante un servicio Adapter.",
    "basic": "Intentar modificar directamente la carpeta android/ o ios/ generada en el proyecto principal sin estructurar un plugin reutilizable.",
    "followups": [
      "¿Cómo se envían datos de eventos nativos asíncronos desde Kotlin/Swift hacia los listeners de JavaScript usando notifyListeners()?",
      "¿Qué ventajas tiene mantener el plugin en un paquete npm independiente frente a modificar el proyecto nativo local?"
    ],
    "terms": [
      {
        "term": "Custom Plugin",
        "definition": "Módulo nativo propio que extiende las capacidades del runtime de Capacitor."
      },
      {
        "term": "@CapacitorPlugin",
        "definition": "Anotación en Kotlin/Java que registra la clase como plugin reconocible por el puente de Capacitor."
      }
    ],
    "tags": [
      "capacitor",
      "custom-plugin",
      "kotlin",
      "swift",
      "nativo"
    ]
  },
  {
    "id": "ionic-08",
    "category": "Ionic",
    "priority": "alta",
    "type": "pregunta",
    "question": "¿Cómo estructurarías un Monorepo de gran escala (Nx / Turborepo) que comparte librerías entre una aplicación Web Desktop en Angular y una app móvil en Ionic/Capacitor?",
    "expected": "Diseñar una arquitectura limpia modularizada: 1) Librerías de Dominio/Core: Contienen modelos, servicios de API, lógica de negocio y estado (RxJS/Signals) reutilizables al 100% entre Web y Móvil, 2) Librerías de Infraestructura/Storage: Abstraen el almacenamiento local mediante un patrón Adapter (usando IndexedDB en Web y SQLite/SecureStorage en Móvil), 3) Librerías de UI compartidas: Componentes de UI agnósticos, y 4) Aplicaciones ejecutables: Proyectos apps/web y apps/mobile que consumen las librerías compartidas e inyectan las implementaciones concretas de infraestructura mediante Inyección de Dependencias (DI) de Angular.",
    "basic": "Duplicar el código en dos repositorios separados o mezclar componentes de UI de Ionic dentro de la app web desktop.",
    "followups": [
      "¿Cómo se utiliza la Inyección de Dependencias de Angular (Providers / InjectionToken) para alternar entre el Adapter de Web y el Adapter de Móvil?",
      "¿Qué estrategia seguirías para evitar cargar librerías nativas de Capacitor en el build de la versión Web?"
    ],
    "terms": [
      {
        "term": "Monorepo",
        "definition": "Estrategia de arquitectura que mantiene múltiples aplicaciones y librerías compartidas en un único repositorio Git."
      },
      {
        "term": "Dependency Inversion Principle",
        "definition": "Principio de diseño donde la lógica de negocio depende de abstracciones y no de implementaciones nativas o web concretas."
      }
    ],
    "tags": [
      "monorepo",
      "nx",
      "arquitectura",
      "angular",
      "reutilización"
    ]
  },
  {
    "id": "concept-senior-01",
    "category": "Conceptos de repaso",
    "priority": "alta",
    "type": "concepto",
    "question": "Monorepo y Arquitectura Hexagonal / Clean Architecture en proyectos Ionic",
    "expected": "La Arquitectura Hexagonal (Puertos y Adaptadores) aplicada a proyectos Ionic/Capacitor permite desacoplar completamente la lógica de negocio y las reglas de dominio del framework web (Angular) y de la capa nativa (Capacitor). Las entidades y casos de uso viven en capas puras. Las llamadas a APIs, almacenamiento local o plugins nativos se definen como Puertos (Interfaces). Los Adaptadores implementan dichos Puertos (ej. CapacitorStorageAdapter vs LocalStorageAdapter). Esto garantiza que la app pueda migrarse de framework, probarse con unit tests puros sin WebView y mantenerse escalable a largo plazo.",
    "basic": "Llamar a plugins de Capacitor o apis HTTP directamente desde los componentes de la interfaz de usuario.",
    "followups": [
      "¿Cómo se testea la lógica de negocio si los componentes no dependen directamente de Capacitor?",
      "¿Qué es un Puerto y qué es un Adaptador en esta arquitectura?"
    ],
    "terms": [
      {
        "term": "Hexagonal Architecture",
        "definition": "Patrón de arquitectura de software que aísla la lógica central de las dependencias e interfaces externas."
      },
      {
        "term": "Ports and Adapters",
        "definition": "Interfaces (puertos) que definen el contrato y clases concretas (adaptadores) que implementan la tecnología específica."
      }
    ],
    "tags": [
      "arquitectura",
      "hexagonal",
      "clean-architecture",
      "desacoplamiento"
    ]
  },
  {
    "id": "concept-senior-02",
    "category": "Conceptos de repaso",
    "priority": "alta",
    "type": "concepto",
    "question": "Optimización de Tiempos de Arranque (Cold Start Performance) en apps híbridas",
    "expected": "El inicio en frío (Cold Start) comprende el tiempo desde que el usuario toca el icono de la app hasta que la interfaz es completamente interactiva (Time to Interactive - TTI). Para optimizarlo en Ionic: 1) Reducir el tamaño del Bundle inicial de JS mediante Standalone Components, Lazy Loading de rutas y Tree-Shaking agresivo, 2) Deferir la inicialización de plugins nativos no críticos hasta después de pintar la pantalla principal, 3) Usar Splash Screen nativa sincronizada que no se oculte hasta que el bootstrap de Angular finalice, y 4) Evitar peticiones de red bloqueantes durante la fase de arranque.",
    "basic": "Creer que la lentitud del arranque inicial es una limitación insuperable e inherente a las aplicaciones híbridas.",
    "followups": [
      "¿Qué métricas medirías (FCP, LCP, TTI) para auditar el arranque?",
      "¿Cómo afecta el número de plugins registrados en Capacitor al tiempo de inicialización de la WebView?"
    ],
    "terms": [
      {
        "term": "Cold Start",
        "definition": "Proceso de arranque completo de la app desde cero cuando el proceso no estaba alojado en memoria RAM."
      },
      {
        "term": "TTI (Time to Interactive)",
        "definition": "Tiempo que tarda la aplicación en estar completamente lista para responder a la interacción del usuario."
      }
    ],
    "tags": [
      "performance",
      "cold-start",
      "bootstrap",
      "optimización"
    ]
  }
];

// Append items ensuring no ID collisions
const existingIds = new Set(data.items.map(x => x.id));
newSeniorItems.forEach(item => {
  if (!existingIds.has(item.id)) {
    data.items.push(item);
  }
});

// Update meta description
data.meta.description = "Banco de preguntas, conceptos y casos de estudio Senior para entrevistas técnicas Frontend y Mobile (Ionic, Capacitor, Angular, Arquitectura, Seguridad, Publicación y CI/CD).";

// Write updated temario.json
fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');

// Write updated temario-data.js
const jsContent = `window.INTERVIEW_GUIDE_DEFAULT_DATA = ${JSON.stringify(data, null, 2)};\n`;
fs.writeFileSync(jsPath, jsContent, 'utf8');

console.log(`Successfully updated dataset. Total items: ${data.items.length}`);
