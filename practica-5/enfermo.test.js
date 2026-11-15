const assert = require('node:assert/strict');
const { procesarVenta } = require(process.argv[2] || './enfermo');

// Mini-runner de P4: continúa tras un fallo y devuelve un código de salida no cero.
let aprobados = 0;
let fallidos = 0;

function test(nombre, fn) {
  try {
    fn();
    aprobados++;
    console.log(`✓ ${nombre}`);
  } catch (error) {
    fallidos++;
    console.error(`✗ ${nombre}: ${error.message}`);
    process.exitCode = 1;
  }
}

function ejecutarVenta(cliente, items, tipoPago = 'efectivo') {
  const tickets = [];
  const logOriginal = console.log;
  console.log = ticket => tickets.push(ticket);
  try {
    const resultado = procesarVenta(cliente, items, tipoPago);
    return { resultado, tickets };
  } finally {
    console.log = logOriginal;
  }
}

const casos = [
  {
    nombre: 'cliente regular en efectivo', tipo: 'regular', pago: 'efectivo',
    precio: 10000, cantidad: 1, subtotal: 10000, descuento: 0, isv: 1500, total: 11500, texto: '115.00',
  },
  {
    nombre: 'mayorista recibe 10% de descuento', tipo: 'mayorista', pago: 'efectivo',
    precio: 10000, cantidad: 1, subtotal: 10000, descuento: 1000, isv: 1350, total: 10350, texto: '103.50',
  },
  {
    nombre: 'cliente frecuente recibe 5% de descuento', tipo: 'frecuente', pago: 'efectivo',
    precio: 10000, cantidad: 1, subtotal: 10000, descuento: 500, isv: 1425, total: 10925, texto: '109.25',
  },
  {
    nombre: 'tarjeta cobra 3% después del ISV', tipo: 'regular', pago: 'tarjeta',
    precio: 10000, cantidad: 1, subtotal: 10000, descuento: 0, isv: 1500, total: 11845, texto: '118.45',
  },
  {
    nombre: 'mayorista con tarjeta redondea el recargo de 310.5 a 311', tipo: 'mayorista', pago: 'tarjeta',
    precio: 10000, cantidad: 1, subtotal: 10000, descuento: 1000, isv: 1350, total: 10661, texto: '106.61',
  },
  {
    nombre: 'cliente frecuente con tarjeta', tipo: 'frecuente', pago: 'tarjeta',
    precio: 10000, cantidad: 1, subtotal: 10000, descuento: 500, isv: 1425, total: 11253, texto: '112.53',
  },
  {
    nombre: 'tipo de cliente desconocido no recibe descuento', tipo: 'nuevo', pago: 'efectivo',
    precio: 10000, cantidad: 1, subtotal: 10000, descuento: 0, isv: 1500, total: 11500, texto: '115.00',
  },
  {
    nombre: 'toString también es un tipo desconocido', tipo: 'toString', pago: 'efectivo',
    precio: 10000, cantidad: 1, subtotal: 10000, descuento: 0, isv: 1500, total: 11500, texto: '115.00',
  },
  {
    nombre: 'otro medio de pago no lleva recargo', tipo: 'regular', pago: 'transferencia',
    precio: 10000, cantidad: 1, subtotal: 10000, descuento: 0, isv: 1500, total: 11500, texto: '115.00',
  },
  {
    nombre: 'el tipo de cliente distingue mayúsculas', tipo: 'MAYORISTA', pago: 'efectivo',
    precio: 10000, cantidad: 1, subtotal: 10000, descuento: 0, isv: 1500, total: 11500, texto: '115.00',
  },
  {
    nombre: 'el medio de pago distingue mayúsculas', tipo: 'regular', pago: 'Tarjeta',
    precio: 10000, cantidad: 1, subtotal: 10000, descuento: 0, isv: 1500, total: 11500, texto: '115.00',
  },
  {
    nombre: 'descuento mayorista redondea medio centavo hacia arriba', tipo: 'mayorista', pago: 'efectivo',
    precio: 5, cantidad: 1, subtotal: 5, descuento: 1, isv: 1, total: 5, texto: '0.05',
  },
  {
    nombre: 'descuento frecuente redondea medio centavo hacia arriba', tipo: 'frecuente', pago: 'efectivo',
    precio: 10, cantidad: 1, subtotal: 10, descuento: 1, isv: 1, total: 10, texto: '0.10',
  },
  {
    nombre: 'ISV de 1.5 centavos se redondea a 2', tipo: 'regular', pago: 'efectivo',
    precio: 10, cantidad: 1, subtotal: 10, descuento: 0, isv: 2, total: 12, texto: '0.12',
  },
  {
    nombre: 'recargo de tarjeta se redondea hacia arriba', tipo: 'regular', pago: 'tarjeta',
    precio: 20, cantidad: 1, subtotal: 20, descuento: 0, isv: 3, total: 24, texto: '0.24',
  },
  {
    nombre: 'recargo de tarjeta se redondea hacia abajo', tipo: 'regular', pago: 'tarjeta',
    precio: 100, cantidad: 1, subtotal: 100, descuento: 0, isv: 15, total: 118, texto: '1.18',
  },
  {
    nombre: 'producto gratuito genera ticket de cero', tipo: 'regular', pago: 'efectivo',
    precio: 0, cantidad: 2, subtotal: 0, descuento: 0, isv: 0, total: 0, texto: '0.00',
  },
  {
    nombre: 'cantidad cero genera ticket de cero', tipo: 'frecuente', pago: 'tarjeta',
    precio: 10000, cantidad: 0, subtotal: 0, descuento: 0, isv: 0, total: 0, texto: '0.00',
  },
];

for (const caso of casos) {
  test(caso.nombre, () => {
    const cliente = { nombre: 'Ana', activo: true, tipo: caso.tipo };
    const items = [{ precioCentavos: caso.precio, cantidad: caso.cantidad }];
    const ticket = `Cliente: Ana\nTotal: L ${caso.texto}`;

    const actual = ejecutarVenta(cliente, items, caso.pago);

    assert.deepEqual(actual.resultado, {
      subtotalCentavos: caso.subtotal,
      descuentoCentavos: caso.descuento,
      isvCentavos: caso.isv,
      totalCentavos: caso.total,
      ticket,
    });
    assert.deepEqual(actual.tickets, [ticket]);
  });
}

test('suma cantidades y precios de varios productos sin mutar las entradas', () => {
  const cliente = { nombre: 'María López', activo: true, tipo: 'regular' };
  const items = [
    { precioCentavos: 1250, cantidad: 2 },
    { precioCentavos: 333, cantidad: 3 },
  ];
  const entradasOriginales = structuredClone({ cliente, items });
  const ticket = 'Cliente: María López\nTotal: L 40.24';

  const actual = ejecutarVenta(cliente, items);

  assert.deepEqual(actual.resultado, {
    subtotalCentavos: 3499,
    descuentoCentavos: 0,
    isvCentavos: 525,
    totalCentavos: 4024,
    ticket,
  });
  assert.deepEqual(actual.tickets, [ticket]);
  assert.deepEqual({ cliente, items }, entradasOriginales);
});

test('cliente inactivo devuelve null y no imprime', () => {
  const actual = ejecutarVenta({ activo: false }, [{ precioCentavos: 10000, cantidad: 1 }]);
  assert.deepEqual(actual, { resultado: null, tickets: [] });
});

test('cliente inactivo no intenta leer los productos', () => {
  const actual = ejecutarVenta({ activo: false }, null);
  assert.deepEqual(actual, { resultado: null, tickets: [] });
});

test('carrito vacío devuelve null y no imprime', () => {
  const actual = ejecutarVenta({ activo: true }, []);
  assert.deepEqual(actual, { resultado: null, tickets: [] });
});

test('cliente inactivo con carrito vacío devuelve null', () => {
  const actual = ejecutarVenta({ activo: false }, []);
  assert.deepEqual(actual, { resultado: null, tickets: [] });
});

test('propaga el error de impresión sin ocultarlo', () => {
  const errorImpresion = new Error('Impresora sin papel');
  const logOriginal = console.log;
  console.log = () => { throw errorImpresion; };
  try {
    assert.throws(
      () => procesarVenta(
        { nombre: 'Ana', activo: true, tipo: 'regular' },
        [{ precioCentavos: 10000, cantidad: 1 }],
        'efectivo',
      ),
      error => error === errorImpresion,
    );
  } finally {
    console.log = logOriginal;
  }
});

process.on('exit', () => {
  console.log(`\nResultado: ${aprobados} aprobados, ${fallidos} fallidos`);
});
