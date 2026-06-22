# 🍷 Calculadora de Salario e Indemnizaciones - (CCT 85/89).

¡Este es el repositorio de **Sueldo Bodega**! Una aplicación web que esta dirigida para trabajadores y liquidadores del sector vitivinícola en Mendoza, Argentina.

Este proyecto nació como parte de mi recorrido en la Tecnicatura de **Tecnico en programacion** y mi curso de JavaScript, al querer compartir con mis compañeros de trabajo una herramienta para llevar el conteo de las horas extras que haciamos en el mes, ya que a muchos nos quedaban debiendo dinero de las mismas. Luego me percate de que el proyecto era insuficiente y comence a gregar opciones y calculos.

---

## Características Principales

- **Tipos de calculo:** Selector para empleados Mensualizados y Jornaleros, agregando un select para que el usuario elija el mes si es jornalero, ya que dependiendo de los dias que tengan cada uno, se calcule el sueldo basico.
- **Horas extras:** Se realizan sumando su sueldo basico y antiguedad, para luego obtener el valor de la hora.
- **Descuentos Legales y de Convenio:** Gestión de ausencias injustificadas y suspensiones disciplinarias aplicando el divisor 25 legal o descuento de horas reales según el tipo de contratación.
- **Calculo de Indemnizacion (Art. 245 LCT):** Cálculo automatizado de antigüedad por fracciones mayores a 3 meses, SAC proporcional y Vacaciones no Gozadas (base divisor 25). Tambien agregue un input para ingresar cantidad de dias de vacaciones que la bodega le adeuda.
- **Conversion a monedas:** El resulatdo final automaticamente se convierte a dolares, reales y pesos chilenos mediante la API de "DolarApi.com".
- **Text area para sugerencias:** Mediante un icono flotante, el usuario puede abrir un input para escribir y enviar a mi correo por medio de "Formspree".
- **API de Feriados en Tiempo Real:** Integración asrincrónica con _ArgentinaDatos API_ para mostrar un widget con los próximos feriados directamente en la Landing Page.
- **Interfaz claro/oscuro:** Para la comodidad de los usuarios, por problemas de vista

---

## Tecnologias

- **HTML**: Esfuerzo por el orden de las etiquetas con la extension de "Prettier", mejorando en el debido uso de los tags y sus atributos para la captura de datos correcta.
- **CSS:** Manejo de variables en temas claco/oscuro y media querys).
- **Javascript (Vanilla):** Uso de js puro, realizando calculos mediante funciones simples. Uso de peticiones HTTP asincrónicas, para obtener datos.

### Herramientas de Desarrollo (DevTools)

- **Git & GitHub:** Control de versiones y alojamiento del código fuente.
- **Visual Studio Code:** Entorno de desarrollo integrado (IDE).
- **Live Server:** Servidor local de desarrollo para el testeo de políticas de origen (CORS) y actualización en tiempo real.

---

## Patron de diseño (MVC)

Para garantizar el orden, el código está estructurado bajo el patrón **Modelo-Vista-Controlador**:

```text
├── index.html                  # Landing Page (Presentación, "botones para calcular" y Próximos Feriados)
├── calculadora.html            # Interfaz de liquidación de sueldos
├── indemnizacion.html          # Interfaz de cálculo de despidos
├── css/
│   └── estilos.css             # Estilos globales y variables de Tema Claro/Oscuro
└── js/
    ├── modelo.js               # Lógica matemática pura y fórmulas contables
    ├── controladorIndex.js     # Consumo de la API de feriados y UI de la Landing
    ├── controladorSueldos.js   # Manejo del DOM de la calculadora de haberes
    └── controlador-Indemnizacion.js # Gestión del formulario a partir del Art. 245
```
