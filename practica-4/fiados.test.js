const { calcularMora } = require('./fiados');


let aprobados = 0;
let fallidos = 0;

function assertEqual(actual, esperado) {
  if (!Object.is(actual, esperado)) {
    throw new Error(`Esperado: ${esperado}; recibido: ${actual}`);
  }
}

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

function lanzaError(fn) {
  try {
    fn();
    return false;
  } catch (error) {
    return error instanceof Error;
  }
}

// RED: estas dos pruebas se escribieron antes de agregar las validaciones.

test('lanza error si el monto es negativo', () => {
  // Arrange
  const monto = -100;
  const diasVencidos = 2;

  // Act
  const resultado = lanzaError(() => calcularMora(monto, diasVencidos));

  // Assert
  assertEqual(resultado, true);
});

test('lanza error si los días no son numéricos', () => {
  // Arrange
  const monto = 100;
  const diasVencidos = 'dos';

  // Act
  const resultado = lanzaError(() => calcularMora(monto, diasVencidos));

  // Assert
  assertEqual(resultado, true);
});

test('calcula el 5% cuando el fiado está vencido', () => {
  // Arrange
  const monto = 100;
  const diasVencidos = 3;

  // Act
  const resultado = calcularMora(monto, diasVencidos);

  // Assert
  assertEqual(resultado, 5);
});

test('cobra el 5% incluso con un solo día vencido', () => {
  // Arrange
  const monto = 200;
  const diasVencidos = 1;

  // Act
  const resultado = calcularMora(monto, diasVencidos);

  // Assert
  assertEqual(resultado, 10);
});

test('devuelve 0 si hay exactamente 0 días vencidos', () => {
  // Arrange
  const monto = 500;
  const diasVencidos = 0;

  // Act
  const resultado = calcularMora(monto, diasVencidos);

  // Assert
  assertEqual(resultado, 0);
});

test('devuelve 0 si la fecha de vencimiento aún no llega', () => {
  // Arrange
  const monto = 500;
  const diasVencidos = -3;

  // Act
  const resultado = calcularMora(monto, diasVencidos);

  // Assert
  assertEqual(resultado, 0);
});

test('devuelve 0 cuando el monto es 0 aunque haya mora', () => {
  // Arrange
  const monto = 0;
  const diasVencidos = 5;

  // Act
  const resultado = calcularMora(monto, diasVencidos);

  // Assert
  assertEqual(resultado, 0);
});

test('rechaza monto negativo aun sin días vencidos', () => {
  // Arrange
  const monto = -50;
  const diasVencidos = 0;

  // Act
  const resultado = lanzaError(() => calcularMora(monto, diasVencidos));

  // Assert
  assertEqual(resultado, true);
});

test('rechaza días enviados como texto numérico', () => {
  // Arrange
  const monto = 100;
  const diasVencidos = '2';

  // Act
  const resultado = lanzaError(() => calcularMora(monto, diasVencidos));

  // Assert
  assertEqual(resultado, true);
});

test('rechaza NaN como días vencidos', () => {
  // Arrange
  const monto = 100;
  const diasVencidos = NaN;

  // Act
  const resultado = lanzaError(() => calcularMora(monto, diasVencidos));

  // Assert
  assertEqual(resultado, true);
});

test('rechaza días indefinidos', () => {
  // Arrange
  const monto = 100;
  const diasVencidos = undefined;

  // Act
  const resultado = lanzaError(() => calcularMora(monto, diasVencidos));

  // Assert
  assertEqual(resultado, true);
});

process.on('exit', () => {
  console.log(`\nResultado: ${aprobados} aprobados, ${fallidos} fallidos`);
});