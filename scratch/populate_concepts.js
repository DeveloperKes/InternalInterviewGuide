const fs = require('fs');
const path = require('path');

const projectDir = 'c:\\Users\\kesgr\\Downloads\\guia_entrevista_ionic_mobile\\guia_entrevista';
const jsonPath = path.join(projectDir, 'temario.json');
const jsPath = path.join(projectDir, 'temario-data.js');

const rawData = fs.readFileSync(jsonPath, 'utf8');
const data = JSON.parse(rawData);

const newConcepts = [
  {
    "id": "concept-ionic-01",
    "category": "Ionic",
    "priority": "alta",
    "type": "concepto",
    "question": "Shadow DOM, CSS Custom Properties y Shadow Parts en Ionic",
    "expected": "Shadow DOM encapsula el HTML y CSS interno de los Web Components de Ionic. Para personalizarlos sin recurrir a selectores frágiles o ::ng-deep, se deben utilizar las variables CSS (--background, --color, --border-radius) y las Shadow Parts expuestas oficialmente mediante ::part().",
    "basic": "Usar ::ng-deep o selectores CSS ultra específicos para forzar la propiedad directamente.",
    "followups": [
      "¿Qué problemas genera el uso de ::ng-deep en componentes con Shadow DOM?",
      "¿Cómo identificas en la documentación o DevTools qué ::part() expone un componente Ionic?"
    ],
    "terms": [
      {
        "term": "Shadow DOM",
        "definition": "Árbol DOM encapsulado e aislado que evita filtración no deseada de estilos."
      },
      {
        "term": "CSS Custom Property",
        "definition": "Variable CSS expuesta por el componente que atraviesa la barrera del Shadow DOM."
      },
      {
        "term": "Shadow Part",
        "definition": "Elemento interno marcado con el atributo part para permitir su estilizado desde el exterior mediante ::part()."
      }
    ],
    "tags": [
      "ionic",
      "shadow dom",
      "css",
      "theming"
    ]
  },
  {
    "id": "concept-ionic-02",
    "category": "Ionic",
    "priority": "alta",
    "type": "concepto",
    "question": "Ciclo de vida de páginas Ionic (IonRouterOutlet) vs Angular Router",
    "expected": "Angular Router destruye los componentes al cambiar de ruta. Ionic conserva una pila (stack) de páginas vivas en el DOM para posibilitar animaciones de navegación nativa. Por ello, ngOnInit solo ejecuta una vez al instanciar, mientras que ionViewWillEnter e ionViewDidEnter se ejecutan cada vez que la página entra al foco.",
    "basic": "Asumir que ionViewWillEnter es un sustituto directo de ngOnInit para cualquier tipo de inicialización.",
    "followups": [
      "¿Qué ocurre con las suscripciones a Observables en una página que permanece en el stack?",
      "¿En qué casos es preferible usar ionViewWillLeave e ionViewDidLeave?"
    ],
    "terms": [
      {
        "term": "Navigation Stack",
        "definition": "Pila de vistas que Ionic preserva en memoria para navegación tipo app nativa."
      },
      {
        "term": "ionViewWillEnter",
        "definition": "Evento que se dispara cuando la página está a punto de convertirse en la vista activa."
      }
    ],
    "tags": [
      "ionic",
      "lifecycle",
      "router",
      "stack"
    ]
  },
  {
    "id": "concept-capacitor-01",
    "category": "Capacitor",
    "priority": "alta",
    "type": "concepto",
    "question": "Capacitor Bridge y la arquitectura de comunicación IPC",
    "expected": "Capacitor ejecuta el código web dentro de una WebView nativa. La comunicación entre JavaScript y el código nativo (Swift/Kotlin) se realiza mediante un puente (Native Bridge) asíncrono que serializa datos. Los plugins exponen métodos que retornan Promesas o emiten eventos mediante Listeners nativos.",
    "basic": "Creer que Capacitor traduce el código JavaScript a código ejecutable nativo C++/Java.",
    "followups": [
      "¿Qué impacto en rendimiento tiene enviar objetos de datos extremadamente grandes a través del puente?",
      "¿Cómo se gestiona el ciclo de vida de los listeners de eventos nativos?"
    ],
    "terms": [
      {
        "term": "Native Bridge",
        "definition": "Capa de comunicación bidireccional asíncrona entre el motor web y el sistema operativo."
      },
      {
        "term": "Plugin Interface",
        "definition": "Contrato TypeScript que especifica las capacidades expuestas por la capa nativa."
      }
    ],
    "tags": [
      "capacitor",
      "bridge",
      "ipc",
      "nativo"
    ]
  },
  {
    "id": "concept-capacitor-02",
    "category": "Capacitor",
    "priority": "media",
    "type": "concepto",
    "question": "CapacitorHttp vs HttpClient de Angular: Cuándo usar cuál",
    "expected": "HttpClient opera dentro de la WebView mediante fetch/XHR, integrándose con interceptores Angular y la caché web. CapacitorHttp delega la petición a la pila de red nativa del SO (URLSession/HttpURLConnection), eludiendo políticas CORS del navegador y compartiendo cookies nativas. Debe usarse intencionalmente y no solo para ignorar configuraciones de CORS.",
    "basic": "Usar CapacitorHttp en todas las llamadas por defecto solo para omitir la configuración de CORS en el backend.",
    "followups": [
      "¿Por qué eludir CORS en cliente no es una buena práctica de arquitectura?",
      "¿Qué sucede con los interceptores de token de Angular al usar CapacitorHttp directamente?"
    ],
    "terms": [
      {
        "term": "CORS",
        "definition": "Política de seguridad del navegador que restringe solicitudes entre orígenes distintos."
      },
      {
        "term": "Native Networking",
        "definition": "Peticiones HTTP ejecutadas directamente por las APIs de red del sistema operativo."
      }
    ],
    "tags": [
      "capacitor",
      "http",
      "cors",
      "networking"
    ]
  },
  {
    "id": "concept-security-01",
    "category": "Seguridad",
    "priority": "alta",
    "type": "concepto",
    "question": "Almacenamiento Seguro: Web Storage vs Keychain / Keystore",
    "expected": "localStorage, sessionStorage e IndexedDB en la WebView son susceptibles a ataques XSS e inspección. Los datos altamente sensibles (Refresh Tokens, biometría, claves criptográficas) deben guardarse exclusivamente en iOS Keychain o Android Keystore mediante plugins de Secure Storage respaldados por hardware.",
    "basic": "Guardar tokens de sesión en localStorage por comodidad de acceso.",
    "followups": [
      "¿Dónde debe conservarse un Access Token de vida corta?",
      "¿Qué ocurre con las claves almacenadas en Keystore si el usuario desactiva el bloqueo de pantalla del dispositivo?"
    ],
    "terms": [
      {
        "term": "XSS (Cross-Site Scripting)",
        "definition": "Vulnerabilidad web donde un atacante ejecuta scripts para leer el almacenamiento del navegador."
      },
      {
        "term": "Hardware-backed Security",
        "definition": "Almacenamiento de claves dentro del chip de seguridad dedicado del dispositivo (Secure Enclave / TEE)."
      }
    ],
    "tags": [
      "seguridad",
      "keychain",
      "keystore",
      "storage"
    ]
  },
  {
    "id": "concept-security-02",
    "category": "Seguridad",
    "priority": "alta",
    "type": "concepto",
    "question": "Certificate Pinning (SSL / TLS Pinning) en apps móviles",
    "expected": "Consiste en embeber el certificado o la clave pública del servidor directamente en el paquete de la aplicación. Esto asegura que la app solo confíe en el servidor específico y previene ataques Man-in-the-Middle (MitM), incluso si se instala una entidad de certificación (CA) maliciosa en el sistema del dispositivo.",
    "basic": "Asumir que usar una URL con https:// garantiza seguridad total contra la interceptación de tráfico.",
    "followups": [
      "¿Qué sucede si el certificado del servidor expira y la app no soporta rotación dinámica de claves?",
      "¿Qué diferencia existe entre Certificate Pinning y Public Key Pinning?"
    ],
    "terms": [
      {
        "term": "MitM (Man-in-the-Middle)",
        "definition": "Interceptación y posible manipulación de la comunicación entre la app y el servidor."
      },
      {
        "term": "Public Key Pinning",
        "definition": "Práctica de validar únicamente la clave pública para permitir la renovación de certificados sin actualizar el cliente."
      }
    ],
    "tags": [
      "seguridad",
      "ssl pinning",
      "mitm",
      "redes"
    ]
  },
  {
    "id": "concept-arch-01",
    "category": "Guion principal",
    "priority": "alta",
    "type": "concepto",
    "question": "Estrategias de Cambio de Detección: Default, OnPush y Signals",
    "expected": "Default recorre todo el árbol de componentes ante cualquier evento asíncrono. OnPush solo evalúa el componente si cambia una referencia @Input() o si un Observable emite en el template. Signals en Angular introduce reactividad fina (fine-grained), actualizando de forma quirúrgica los nodos DOM sin depender de escaneos masivos de Zone.js.",
    "basic": "Activar ChangeDetectionStrategy.OnPush a ciegas esperando optimizar todo automáticamente sin usar inmutabilidad.",
    "followups": [
      "¿Por qué OnPush requiere el uso estricto de datos inmutables?",
      "¿Cómo mejoran los Signals el rendimiento en móviles de gama baja?"
    ],
    "terms": [
      {
        "term": "Zone.js",
        "definition": "Mecanismo que intercepta llamadas asíncronas en Angular para disparar detección de cambios global."
      },
      {
        "term": "Signals",
        "definition": "Primitiva reactiva de Angular que notifica cambios directamente a sus consumidores."
      }
    ],
    "tags": [
      "angular",
      "performance",
      "onpush",
      "signals"
    ]
  },
  {
    "id": "concept-arch-02",
    "category": "Guion principal",
    "priority": "media",
    "type": "concepto",
    "question": "Gestión de Memoria y Fugas (Memory Leaks) en RxJS",
    "expected": "Las suscripciones manuales a Observables de larga duración (servicios Singleton, eventos globales) continúan vivas en memoria aunque la página o componente se destruya. Deben gestionarse mediante takeUntilDestroyed(), el pipe async en los templates o desuscripciones explícitas en ngOnDestroy.",
    "basic": "Pensar que Angular cancela automáticamente todas las suscripciones cuando el usuario navega a otra pantalla.",
    "followups": [
      "¿Las peticiones de HttpClient requieren desuscripción manual?",
      "¿Qué ventajas ofrece el operador takeUntilDestroyed() de Angular 16+?"
    ],
    "terms": [
      {
        "term": "Memory Leak",
        "definition": "Retención involuntaria de memoria por referencias activas impidiendo el trabajo del Garbage Collector."
      },
      {
        "term": "takeUntilDestroyed",
        "definition": "Operador RxJS que completa automáticamente la suscripción al destruirse el contexto."
      }
    ],
    "tags": [
      "rxjs",
      "memory leak",
      "angular",
      "mantenibilidad"
    ]
  },
  {
    "id": "concept-perf-01",
    "category": "Casos reales",
    "priority": "alta",
    "type": "concepto",
    "question": "Estrategia Offline-First y persisencia de datos",
    "expected": "Una app Offline-First trata la falta de red como un estado normal. Usa una base de datos local robusta (SQLite a través de Capacitor o IndexedDB) como fuente principal de verdad y gestiona una cola de sincronización asíncrona e idempotente con el servidor cuando la conexión se restablece.",
    "basic": "Utilizar localStorage para almacenar catálogos pesados o transacciones pendientes.",
    "followups": [
      "¿Qué limitación tiene localStorage en capacidad de almacenamiento?",
      "¿Cómo se gestionan las resoluciones de conflicto cuando cambian los mismos datos en servidor y cliente?"
    ],
    "terms": [
      {
        "term": "SQLite",
        "definition": "Base de datos relacional ligera embebida nativamente en iOS y Android."
      },
      {
        "term": "Idempotent Sync",
        "definition": "Proceso de sincronización que puede reintentarse sin duplicar registros en la base de datos central."
      }
    ],
    "tags": [
      "offline",
      "sqlite",
      "storage",
      "sincronización"
    ]
  },
  {
    "id": "concept-perf-02",
    "category": "Casos reales",
    "priority": "media",
    "type": "concepto",
    "question": "Optimización de listas extensas: Virtual Scrolling vs Infinite Scroll",
    "expected": "Infinite Scroll realiza peticiones paginadas al backend conforme se avanza en el scroll, pero añade nodos continuamente al DOM. Virtual Scrolling (como cdk-virtual-scroll) solo mantiene en el DOM los elementos visibles en la pantalla, reciclando nodos HTML para asegurar 60 FPS sin importar si la lista tiene miles de registros.",
    "basic": "Renderizar miles de elementos mediante *ngFor confiando únicamente en el scroll nativo.",
    "followups": [
      "¿Cuándo es suficiente usar Infinite Scroll y cuándo es indispensable usar Virtual Scroll?",
      "¿Cómo afecta un DOM hipertrofiado a la memoria del WebView móvil?"
    ],
    "terms": [
      {
        "term": "Virtual Scrolling",
        "definition": "Renderizado dinámico que mantiene constante la cantidad de nodos DOM independientemente del total de ítems."
      },
      {
        "term": "DOM Footprint",
        "definition": "Cantidad de memoria y recursos requeridos por la WebView para gestionar los nodos HTML activos."
      }
    ],
    "tags": [
      "performance",
      "virtual scroll",
      "dom",
      "listas"
    ]
  },
  {
    "id": "concept-pub-01",
    "category": "Publicación",
    "priority": "alta",
    "type": "concepto",
    "question": "Firma de aplicaciones y distribución: Android Keystore vs iOS Provisioning Profiles",
    "expected": "En Android, la app se firma mediante una clave almacenada en un archivo Keystore (.jks/.keystore). En iOS, se requiere un certificado de distribución, un App ID y un Provisioning Profile que asocia certificados, dispositivos autorizados y permisos (Entitlements).",
    "basic": "Compilar el binario de release directamente sin configurar firmas criptográficas.",
    "followups": [
      "¿Qué función cumple Play App Signing si se pierde la clave privada local de Keystore?",
      "¿Qué diferencia existe entre un perfil Development, Ad-Hoc y App Store en iOS?"
    ],
    "terms": [
      {
        "term": "Play App Signing",
        "definition": "Servicio de Google Play que almacena de forma segura la clave de firma de producción."
      },
      {
        "term": "Provisioning Profile",
        "definition": "Archivo criptográfico de Apple que certifica qué binario puede ejecutarse en qué dispositivos."
      }
    ],
    "tags": [
      "publicación",
      "android",
      "ios",
      "firma"
    ]
  },
  {
    "id": "concept-pub-02",
    "category": "Publicación",
    "priority": "media",
    "type": "concepto",
    "question": "Actualizaciones de binarios vs Live Updates (Over-The-Air / OTA)",
    "expected": "Las actualizaciones binarias (AAB/IPA) cambian código nativo o plugins y deben pasar por la revisión de Google Play / App Store. Las Live Updates (Appflow/Capgo) permiten actualizar instantáneamente los assets web (HTML, JS, CSS) en los dispositivos del usuario sin revisión de tienda, siempre que no alteren el propósito ni plugins nativos.",
    "basic": "Asumir que cualquier cambio en una app Ionic exige enviar obligatoriamente un nuevo paquete binario a revisión.",
    "followups": [
      "¿Qué tipo de cambios requieren obligatoriamente una actualización de binario?",
      "¿Qué políticas de Apple imponen límites a la modificación del comportamiento por OTA?"
    ],
    "terms": [
      {
        "term": "OTA (Over-The-Air)",
        "definition": "Despliegue directo de paquetes de código web a dispositivos sin pasar por tiendas de apps."
      },
      {
        "term": "Binary Review",
        "definition": "Proceso de inspección manual y automatizada ejecutado por Apple y Google a nuevos binarios."
      }
    ],
    "tags": [
      "publicación",
      "ota",
      "live updates",
      "capacitor"
    ]
  },
  {
    "id": "concept-mf-01",
    "category": "Mobile First",
    "priority": "alta",
    "type": "concepto",
    "question": "Mobile First: Progressive Enhancement y áreas táctiles (Touch Targets)",
    "expected": "Mobile First parte de las restricciones móviles: priorizar contenido esencial, interacción mediante pulgares y Touch Targets mínimos de 44x44px. Progressive Enhancement expande la interfaz hacia pantallas mayores añadiendo elementos decorativos o paneles secundarios sin degradar la agilidad móvil.",
    "basic": "Diseñar primero para escritorio y luego ocultar elementos pesados con display: none en pantallas pequeñas.",
    "followups": [
      "¿Por qué ocultar elementos pesados con CSS en móvil no evita que el navegador gaste ancho de banda descargándolos?",
      "¿Cuáles son las dimensiones de Touch Target recomendadas por Apple HIG y Google Material Design?"
    ],
    "terms": [
      {
        "term": "Touch Target",
        "definition": "Área interactiva mínima de un botón o elemento para ser presionado de forma precisa con los dedos."
      },
      {
        "term": "Progressive Enhancement",
        "definition": "Metodología que construye la experiencia desde el núcleo básico accesible hacia funciones avanzadas."
      }
    ],
    "tags": [
      "mobile first",
      "touch target",
      "ux",
      "responsive"
    ]
  }
];

// Check if any id already exists
const existingIds = new Set(data.items.map(x => x.id));
newConcepts.forEach(concept => {
  if (!existingIds.has(concept.id)) {
    data.items.push(concept);
  }
});

// Write updated temario.json
fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');

// Write updated temario-data.js
const jsContent = `window.INTERVIEW_GUIDE_DEFAULT_DATA = ${JSON.stringify(data, null, 2)};\n`;
fs.writeFileSync(jsPath, jsContent, 'utf8');

console.log(`Successfully populated ${newConcepts.length} new concept entries. Total items now: ${data.items.length}`);
