const fs = require('fs');
const path = require('path');

const projectDir = 'c:\\Users\\kesgr\\Downloads\\guia_entrevista_ionic_mobile\\guia_entrevista';
const jsonPath = path.join(projectDir, 'temario.json');
const jsPath = path.join(projectDir, 'temario-data.js');

const rawData = fs.readFileSync(jsonPath, 'utf8');
const data = JSON.parse(rawData);

const newSecurityItems = [
  {
    "id": "security-08",
    "category": "Seguridad",
    "priority": "alta",
    "type": "pregunta",
    "question": "¿Cómo funciona técnicamente la protección de claves criptográficas con Keychain en iOS y Keystore en Android a nivel de hardware?",
    "expected": "Explicar la arquitectura respaldada por hardware: 1) En iOS, Secure Enclave es un coprocesador de seguridad aislado con su propio sistema operativo que almacena claves de cifrado y realiza operaciones criptográficas (AES, RSA, ECC) sin exponer la clave a la memoria RAM principal. 2) En Android, Android Keystore System interactúa con un entorno de ejecución seguro (TEE - Trusted Execution Environment) o chip StrongBox (HSM). Las claves generadas permanecen dentro del hardware seguro; la app solo recibe un key handle para solicitar firmas o desencriptados, garantizando que aunque el SO esté comprometido (root), la clave no se pueda extraer en texto plano.",
    "basic": "Decir que Keychain y Keystore son simplemente 'carpetas cifradas' donde se guardan textos planos en el almacenamiento de la app.",
    "followups": [
      {
        "q": "¿Qué sucede cuando se requiere autenticación biométrica previa para desbloquear una clave del Keystore?",
        "a": "Se aplica la condición setUserAuthenticationRequired(true), lo que exige que el hardware valide el intento biométrico exitoso inmediatamente antes de autorizar la operación de cifrado/descifrado."
      },
      {
        "q": "¿Qué es el chip StrongBox Keymaster en Android?",
        "a": "Un chip de hardware independiente del procesador principal (HSM dedicado) con almacenamiento seguro y protección contra manipulación física."
      }
    ],
    "terms": [
      {
        "term": "Secure Enclave",
        "definition": "Coprocesador seguro en dispositivos Apple para ejecutar operaciones criptográficas aisladas del SO."
      },
      {
        "term": "TEE (Trusted Execution Environment)",
        "definition": "Área segura del procesador principal en dispositivos Android para procesar datos confidenciales aisladamente."
      }
    ],
    "tags": [
      "keychain",
      "keystore",
      "secure enclave",
      "tee",
      "seguridad"
    ]
  },
  {
    "id": "security-09",
    "category": "Seguridad",
    "priority": "alta",
    "type": "pregunta",
    "question": "Necesitamos prevenir capturas de pantalla, grabación de pantalla y filtración de datos sensibles en el portapapeles. ¿Cómo lo implementarías en Ionic/Capacitor?",
    "expected": "Proteger la app a nivel nativo y de WebView: 1) Android: Aplicar la bandera FLAG_SECURE en la Activity principal para bloquear screenshots, screen recording e impedir que se muestre contenido en la vista de apps recientes (multitarea), 2) iOS: Detectar capturas/grabación mediante UIScreen.capturedDidChangeNotification y ocultar la UI o mostrar un blur overlay, y usar campos de texto protegidos o plugins de privacidad, 3) Portapapeles: Limpiar el Clipboard automáticamente tras copiar datos sensibles (como códigos OTP o contraseñas) mediante un temporizador breve (ej. 30 segundos) y deshabilitar copy/paste en inputs críticos.",
    "basic": "Creer que esto se resuelve únicamente usando CSS con user-select: none.",
    "followups": [
      {
        "q": "¿Por qué user-select: none en CSS no impide las capturas de pantalla del sistema operativo?",
        "a": "Porque CSS solo restringe la selección de texto en la WebView, mientras que la captura de pantalla es una función del sistema operativo a nivel de marco de ventana."
      },
      {
        "q": "¿Qué efecto produce FLAG_SECURE en el selector de aplicaciones recientes de Android?",
        "a": "Reemplaza la miniatura de la pantalla de la app en la multitarea por una superficie completamente negra o en blanco."
      }
    ],
    "terms": [
      {
        "term": "FLAG_SECURE",
        "definition": "Flag de ventana en Android que prohíbe capturas, grabaciones de pantalla y renderizado en pantallas no seguras."
      },
      {
        "term": "Screen Blur Overlay",
        "definition": "Capa visual de privacidad sobrepuesta sobre la app al pasar a segundo plano."
      }
    ],
    "tags": [
      "flag_secure",
      "clipboard",
      "screenshots",
      "privacidad",
      "seguridad"
    ]
  },
  {
    "id": "security-10",
    "category": "Seguridad",
    "priority": "alta",
    "type": "pregunta",
    "question": "Nuestra aplicación necesita almacenar una base de datos local pesada en el dispositivo con datos médicos o financieros. ¿Cómo garantizamos el cifrado en reposo (Data at Rest)?",
    "expected": "Implementar SQLCipher sobre SQLite: 1) Descartar Web Storage (localStorage/IndexedDB) no cifrado, 2) Utilizar el plugin @capacitor-community/sqlite habilitando la opción de cifrado transparente SQLCipher (AES-256), 3) Derivar la clave de cifrado de la base de datos a partir de una clave aleatoria generada de 256 bits guardada en Android Keystore / iOS Keychain (nunca hardcodeada), y 4) Cerrar explícitamente la conexión y purgar claves de la memoria al expirar la sesión o enviar la app a background.",
    "basic": "Cifrar manualmente cada campo con una clave string guardada dentro del código JavaScript.",
    "followups": [
      {
        "q": "¿Qué impacto en rendimiento tiene usar SQLCipher (AES-256) frente a una base de datos SQLite sin cifrar?",
        "a": "Un leve sobrecosto de CPU (alrededor del 5-15%) durante la lectura/escritura por la encriptación por páginas, el cual se minimiza mediante índices y transacciones bien estructuradas."
      },
      {
        "q": "¿Dónde debe conservarse la frase de paso o clave de cifrado de la base de datos SQLCipher?",
        "a": "Exclusivamente en Keychain (iOS) o Android Keystore, derivada dinámicamente mediante PBKDF2 si requiere contraseña de usuario."
      }
    ],
    "terms": [
      {
        "term": "SQLCipher",
        "definition": "Extensión de código abierto que proporciona cifrado transparente de archivos de base de datos SQLite mediante AES-256."
      },
      {
        "term": "Data at Rest",
        "definition": "Información almacenada en medios de almacenamiento persistente (disco/flash)."
      }
    ],
    "tags": [
      "sqlcipher",
      "sqlite",
      "cifrado",
      "data-at-rest",
      "seguridad"
    ]
  },
  {
    "id": "security-11",
    "category": "Seguridad",
    "priority": "media",
    "type": "pregunta",
    "question": "¿Cómo asegurarías las políticas de tráfico de red en Android y iOS para evitar peticiones no cifradas en HTTP plano?",
    "expected": "Configurar políticas de red strictly a nivel nativo: 1) Android: En res/xml/network_security_config.xml, configurar cleartextTrafficPermitted=\"false\" de forma global para prohibir peticiones HTTP no cifradas, permitiendo únicamente dominios HTTPS explícitos y configurando anclaje de certificados si aplica, 2) iOS: En Info.plist, mantener App Transport Security (ATS) habilitado (NSAppTransportSecurity -> NSAllowsArbitraryLoads = false), exigiendo TLS 1.2+ con Forward Secrecy, y 3) Auditar que no existan librerías nativas ni componentes WebView intentando cargar URLs http:// no seguras.",
    "basic": "Creer que mientras se llame a endpoints https:// dentro del código TypeScript no se requiere configuración nativa del SO.",
    "followups": [
      {
        "q": "¿Qué sucede si se intenta realizar una petición HTTP plana en Android 9+ con cleartextTrafficPermitted=\"false\"?",
        "a": "El sistema operativo aborta la conexión de red inmediatamente lanzando una excepción java.net.UnknownServiceException: CLEARTEXT communication not permitted."
      },
      {
        "q": "¿Qué es App Transport Security (ATS) en iOS?",
        "a": "Característica de seguridad de Apple que exige que todas las conexiones de red HTTP cumplan con TLS 1.2+ y cifrado fuerte."
      }
    ],
    "terms": [
      {
        "term": "Cleartext Traffic",
        "definition": "Tráfico de red transmitido sin cifrado (HTTP plano), vulnerable a interceptación."
      },
      {
        "term": "ATS (App Transport Security)",
        "definition": "Política de seguridad en iOS que bloquea tráfico de red inseguro por defecto."
      }
    ],
    "tags": [
      "http",
      "cleartext",
      "ats",
      "redes",
      "seguridad"
    ]
  },
  {
    "id": "concept-security-03",
    "category": "Seguridad",
    "priority": "alta",
    "type": "concepto",
    "question": "Invalidación de Claves Criptográficas por Cambios Biométricos (Key Invalidation)",
    "expected": "Tanto Android Keystore como iOS Keychain ofrecen la opción de vincular una clave criptográfica a las huellas o rostros enrolados en el dispositivo (biometricCurrentSet en iOS / setUserAuthenticationRequired en Android). Si el usuario agrega, borra o reconfigura una huella en los ajustes del SO, la clave almacenada en el hardware seguro se invalida irreversiblemente por diseño de seguridad. La app debe detectar esta excepción específica, notificar al usuario de que sus credenciales biométricas cambiaron, solicitar login mediante usuario/contraseña y generar un nuevo par de claves respaldadas por el hardware.",
    "basic": "Tratar la invalidación de claves como un fallo de código del plugin o intentar reintentar la operación en bucle.",
    "followups": [
      {
        "q": "¿Por qué los chips de seguridad invalidan las claves al cambiar las plantillas biométricas?",
        "a": "Para prevenir que un atacante que conozca el PIN del dispositivo agregue su propia huella y acceda a las claves y datos cifrados de la app."
      },
      {
        "q": "¿Cómo se maneja la recuperación de la sesión en el cliente?",
        "a": "Solicitando credenciales maestras (o token de recuperación de backend) para regenerar una nueva clave criptográfica en Keystore/Keychain."
      }
    ],
    "terms": [
      {
        "term": "Biometric Enrollment Change",
        "definition": "Evento del SO donde se modifica el conjunto de plantillas biométricas registradas."
      },
      {
        "term": "Key Purging",
        "definition": "Eliminación o invalidación definitiva de una clave de cifrado sin posibilidad de recuperación."
      }
    ],
    "tags": [
      "keychain",
      "keystore",
      "biometría",
      "key-invalidation",
      "seguridad"
    ]
  },
  {
    "id": "concept-security-04",
    "category": "Seguridad",
    "priority": "alta",
    "type": "concepto",
    "question": "Ofuscación de Código, Reglas de R8/ProGuard y Anti-Reverse Engineering",
    "expected": "El código compilado de una app Android (AAB/APK) puede ser descompilado fácilmente a bytecode Smali o Java usando herramientas como JADX o dex2jar. R8/ProGuard encoge, optimiza y ofusca el código nativo y Java/Kotlin renombrando clases, métodos y campos con nombres ilegibles (a, b, c). En Ionic, además de R8 para la capa nativa, se debe aplicar minificación web (Terser/Esbuild) para ofuscar el paquete JavaScript. Adicionalmente, las reglas de ProGuard (proguard-rules.pro) deben configurar excepciones (-keep) para clases deserializadas con Reflection o Gson para evitar que la minificación las rompa en release.",
    "basic": "Creer que publicar en Google Play mediante AAB ya ofusca el código automáticamente sin configurar R8 ni ProGuard.",
    "followups": [
      {
        "q": "¿Qué es un archivo mapping.txt generado por R8/ProGuard y por qué se debe conservar?",
        "a": "Es el mapa de des-ofuscación necesario para traducir los desgloses de pila (stacktraces) de errores recibidos en producción hacia los nombres de clases originales."
      },
      {
        "q": "¿Por qué la minificación de código JavaScript no previene la ingeniería inversa completa pero sí dificulta su análisis?",
        "a": "Porque transforma identificadores y estructuras pero la lógica sigue ejecutándose en el cliente; por ello la seguridad real debe residir en el backend."
      }
    ],
    "terms": [
      {
        "term": "R8 / ProGuard",
        "definition": "Herramienta de compilación en Android que reduce y ofusca el bytecode Java/Kotlin."
      },
      {
        "term": "Deobfuscation Mapping",
        "definition": "Archivo de correspondencia entre identificadores ofuscados y el código fuente original."
      }
    ],
    "tags": [
      "ofuscación",
      "r8",
      "proguard",
      "ingeniería-inversa",
      "seguridad"
    ]
  },
  {
    "id": "security-12",
    "category": "Seguridad",
    "priority": "media",
    "type": "pregunta",
    "question": "¿Cómo prevenir ataques de suplantación de la interfaz mediante solapamiento de pantallas (Tapjacking / Screen Overlay Attacks) en Android?",
    "expected": "Tapjacking ocurre cuando una app maliciosa muestra una ventana transparente o flotante sobre la app objetivo para engañar al usuario y hacer que presione botones críticos involuntariamente. Se previene a nivel nativo habilitando la propiedad filterTouchesWhenObscured = true en las vistas principales o configurando la bandera de ventana para rechazar toques cuando existe una capa flotante superpuesta en Android (onFilterTouchEventForSecurity).",
    "basic": "Desconocer los ataques de solapamiento de pantalla a nivel del sistema operativo móvil.",
    "followups": [
      {
        "q": "¿Qué sucede cuando se activa filterTouchesWhenObscured y otra app muestra un overlay flotante?",
        "a": "El sistema operativo descarta automáticamente los eventos de toque dirigidos a la app protegida mientras la vista esté tapada por el overlay."
      },
      {
        "q": "¿En qué tipo de aplicaciones es crítica esta protección?",
        "a": "En aplicaciones bancarias, pasarelas de pago y transferencias de dinero donde un toque involuntario confirme una transacción."
      }
    ],
    "terms": [
      {
        "term": "Tapjacking",
        "definition": "Ataque donde una ventana transparente sobrepuesta captura o desvía los toques del usuario."
      },
      {
        "term": "Obscured Touches",
        "definition": "Eventos de pantalla táctil recibidos cuando la interfaz de la app está parcialmente oculta por otra aplicación."
      }
    ],
    "tags": [
      "tapjacking",
      "overlay",
      "android",
      "seguridad"
    ]
  }
];

// Append items ensuring no ID collisions
const existingIds = new Set(data.items.map(x => x.id));
newSecurityItems.forEach(item => {
  if (!existingIds.has(item.id)) {
    data.items.push(item);
  }
});

// Write updated temario.json
fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');

// Write updated temario-data.js
const jsContent = `window.INTERVIEW_GUIDE_DEFAULT_DATA = ${JSON.stringify(data, null, 2)};\n`;
fs.writeFileSync(jsPath, jsContent, 'utf8');

console.log(`Successfully added ${newSecurityItems.length} new security items. Total items now: ${data.items.length}`);
