# Práctica 5: de una venta enferma a una venta sana

La función `p` de [enfermo.js](enfermo.js) tiene **43 líneas**, desde su declaración hasta su llave de cierre. Procesa una venta de pulpería y contiene siete problemas intencionales. Se conserva como referencia; la evolución está en [sano.js](sano.js).

## Principios citados

- **Principio 2: «Una función, una responsabilidad».** La numeración y su relación con SRP están documentadas en [las notas de P3](../practica-3/notas.md).
- **Principio 6: red de seguridad antes del refactor.** Es el requisito de la consigna de P5: primero caracterizar el comportamiento actual y después cambiar su estructura. El commit `0047e34` contiene la función original y sus tests; todavía no existe `sano.js`.
- **Principio 9: «Diseñá para el cambio».** La numeración y su relación con SRP y DIP también están documentadas en [P3](../practica-3/notas.md). Aquí guía además la extensión de descuentos sin editar el cálculo (OCP).

## Diagnóstico y tratamiento

| Problema sembrado | Principio violado, por número | Refactor aplicado | Commit |
| --- | --- | --- | --- |
| M1: nombres crípticos `p`, `c`, `a`, `t`, `s`, `d`, `i`, `x`, `r`; no explican las unidades. | **9**: dificultan entender y modificar las reglas. | Renombrar la función, los parámetros y las variables; expresar los importes en centavos. | `57269be` |
| M1: números mágicos `0.1`, `0.05`, `0.15`, `0.03` y `100`. | **9**: las reglas y la conversión monetaria quedan dispersas. | Introducir constantes con nombres; posteriormente agrupar las tasas de descuento en una tabla. | `9eba940` |
| M1: cálculo de ISV y total copiado en tres ramas. | **9**: un cambio obliga a editar varios lugares y puede dejar reglas inconsistentes. | Consolidar las operaciones comunes después de seleccionar el descuento. | `fc470ba` |
| M1: camino principal dentro de dos `if`, con `else` que solo devuelven `null`. | **2**: los casos de rechazo se mezclan con la coordinación de la venta. | Aplicar retornos tempranos, conservando la comprobación del cliente antes de leer los productos. | `25d0af8` |
| M1/M3: función larga que suma, descuenta, calcula impuestos, formatea e imprime; viola **S (SRP)**. | **2**: tiene varias razones para cambiar. | Extraer `calcularSubtotal`, `calcularTotales` y `crearTicket`; dejar la coordinación en `procesarVenta`. | `56eacb9` |
| M3: dependencia directa de `console.log`; viola **D (DIP)**. | **9**: cambiar el destino del ticket obliga a tocar la venta. | Inyectar la función `registrarVenta`, con la consola como adaptador predeterminado. | `2c001cd` |
| M3: cadena de condiciones por tipo de cliente; viola **O (OCP)**. | **9**: cada nuevo descuento exige modificar el cálculo. | Sustituir condiciones por una tabla `tasasDescuento` inyectable, consultando solo propiedades propias. | `1dde47b` |

## Comportamiento caracterizado antes del refactor

La interfaz común es `procesarVenta(cliente, items, tipoPago)`. Los ejemplos usan clientes con `nombre`, `activo` y `tipo`, y productos con `precioCentavos` y `cantidad`, expresados como enteros no negativos. Las tasas son las reglas del ejemplo.

1. Un cliente inactivo devuelve `null` sin leer los productos ni imprimir. Un carrito vacío también devuelve `null` sin imprimir.
2. El subtotal suma precio por cantidad. Mayorista recibe 10% y frecuente 5%; otros tipos reciben 0%.
3. El descuento se redondea con `Math.round`. Después se calcula y redondea el ISV del 15% sobre el subtotal descontado.
4. Solo el pago `tarjeta` añade un 3% redondeado sobre el importe que ya incluye ISV. Las comparaciones de tipo de cliente y pago distinguen mayúsculas.
5. La respuesta contiene `subtotalCentavos`, `descuentoCentavos`, `isvCentavos`, `totalCentavos` y `ticket`. Se imprime exactamente un ticket, con salto de línea y dos decimales: `Cliente: Ana\nTotal: L 115.00`.
6. Los importes cero generan ticket si hay productos. Las entradas no se modifican y un error de impresión se propaga sin ocultarlo.

[enfermo.test.js](enfermo.test.js) usa el mini-runner de P4: ejecuta todos los casos, cuenta aprobados/fallidos y establece `process.exitCode = 1` ante un fallo. Las aserciones profundas usan únicamente la biblioteca estándar de Node. Las expectativas numéricas y los textos son explícitos; no se calculan copiando la implementación. La captura de consola siempre se restaura con `finally`.

## Historia y evidencia

Cada fila corresponde a un commit real. Se ejecutaron nuevamente las suites desde los archivos de **cada commit histórico**, en un directorio temporal, para comprobar que todos los pasos quedan verdes. También se verificó que `enfermo.js` y `enfermo.test.js` conservan sus blobs originales en toda la secuencia.

| Commit | Paso | Original | Refactor | Extensiones |
| --- | --- | --- | --- | --- |
| `0047e34` | `test(practica-5): caracterizar la venta antes del refactor` | 24/24 | Todavía no existe | Todavía no existen |
| `57269be` | `refactor(practica-5): renombrar variables de la venta` | 24/24 | 24/24 | — |
| `9eba940` | `refactor(practica-5): nombrar tasas y unidad monetaria` | 24/24 | 24/24 | — |
| `fc470ba` | `refactor(practica-5): unificar el calculo de ISV y total` | 24/24 | 24/24 | — |
| `25d0af8` | `refactor(practica-5): simplificar el flujo con retornos tempranos` | 24/24 | 24/24 | — |
| `56eacb9` | `refactor(practica-5): separar calculos y formato del ticket` | 24/24 | 24/24 | — |
| `2c001cd` | `refactor(practica-5): inyectar el registro de ventas` | 24/24 | 24/24 | 4/4 |
| `1dde47b` | `refactor(practica-5): configurar descuentos sin modificar el calculo` | 24/24 | 24/24 | 7/7 |

Las pruebas adicionales de [sano.test.js](sano.test.js) verifican los puntos de extensión: un registro en memoria sin usar consola, rechazos sin invocar el adaptador, propagación de su error, un tipo de cliente nuevo, reemplazo de tasas sin mutar las predeterminadas y exclusión de propiedades heredadas. Las pruebas nuevas detectaron el acoplamiento y la falta de configuración antes de aplicar sus respectivos cambios; ambos commits contienen su versión verde.

Una comprobación adicional comparó resultados y tickets de ambas implementaciones en **1080 combinaciones**: 5 tipos de cliente × 3 pagos × 12 precios × 3 cantidades × 2 estados de actividad. No hubo diferencias. Esta comprobación exploratoria complementa las suites versionadas.

### Reproducir las suites desde la raíz del repositorio

Requiere Node.js, sin instalar paquetes. Verificado con Node **v24.13.0**.

```powershell
node practica-5/enfermo.test.js
node practica-5/enfermo.test.js ./sano
node practica-5/sano.test.js
node practica-4/fiados.test.js
```

Resultados: **24, 24, 7 y 11 aprobados**, respectivamente; **0 fallidos** y código de salida **0** en los cuatro comandos. La P4 funciona como comprobación de regresión del ejercicio anterior.

```powershell
git log --reverse --oneline 32e107e..HEAD -- practica-5
git diff --check 32e107e..HEAD
```

El historial contiene **siete commits `refactor`**, además del commit inicial de caracterización y la documentación. El PR se integra mediante **merge commit**, conservando los pasos individuales.

## Uso de los puntos de extensión

El cuarto argumento es opcional. `registrarVenta(ticket)` es una función síncrona; se llama una sola vez por venta aceptada. `tasasDescuento` sustituye la tabla para esa llamada y asocia tipos de cliente con tasas decimales. Los tipos ausentes reciben 0%.

```javascript
const { procesarVenta } = require('./sano');
const tickets = [];

const venta = procesarVenta(
  { nombre: 'Ana', activo: true, tipo: 'estudiante' },
  [{ precioCentavos: 10000, cantidad: 1 }],
  'tarjeta',
  {
    registrarVenta: ticket => tickets.push(ticket),
    tasasDescuento: { estudiante: 0.2 },
  },
);
// venta.totalCentavos === 9476; tickets contiene el ticket de L 94.76.
```
