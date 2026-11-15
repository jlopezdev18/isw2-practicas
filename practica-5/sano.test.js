const assert = require('node:assert/strict');
const { procesarVenta } = require('./sano');

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

const cliente = { nombre: 'Ana', activo: true, tipo: 'regular' };
const items = [{ precioCentavos: 10000, cantidad: 1 }];

test('permite registrar el ticket sin depender de la consola', () => {
  const tickets = [];
  const logOriginal = console.log;
  console.log = () => { throw new Error('Se usó la consola en lugar del adaptador'); };
  try {
    const resultado = procesarVenta(cliente, items, 'efectivo', {
      registrarVenta: ticket => tickets.push(ticket),
    });

    assert.deepEqual(resultado, {
      subtotalCentavos: 10000,
      descuentoCentavos: 0,
      isvCentavos: 1500,
      totalCentavos: 11500,
      ticket: 'Cliente: Ana\nTotal: L 115.00',
    });
    assert.deepEqual(tickets, ['Cliente: Ana\nTotal: L 115.00']);
  } finally {
    console.log = logOriginal;
  }
});

function registroProhibido() {
  throw new Error('No se debe registrar una venta rechazada');
}

test('no llama al adaptador si el cliente está inactivo', () => {
  assert.equal(procesarVenta({ activo: false }, null, 'efectivo', {
    registrarVenta: registroProhibido,
  }), null);
});

test('no llama al adaptador si el carrito está vacío', () => {
  assert.equal(procesarVenta(cliente, [], 'efectivo', {
    registrarVenta: registroProhibido,
  }), null);
});

test('propaga el mismo error del adaptador', () => {
  const fallo = new Error('Registro no disponible');
  assert.throws(
    () => procesarVenta(cliente, items, 'efectivo', {
      registrarVenta: () => { throw fallo; },
    }),
    error => error === fallo,
  );
});

process.on('exit', () => {
  console.log(`\nResultado: ${aprobados} aprobados, ${fallidos} fallidos`);
});
