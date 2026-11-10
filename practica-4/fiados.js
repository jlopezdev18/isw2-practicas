function calcularMora(monto, diasVencidos) {
  if (monto < 0) {
    throw new Error('El monto no puede ser negativo');
  }

  if (typeof diasVencidos !== 'number' || !Number.isFinite(diasVencidos)) {
    throw new TypeError('Los días vencidos deben ser un número válido');
  }

  return diasVencidos > 0 ? monto * 0.05 : 0;
}

module.exports = { calcularMora };