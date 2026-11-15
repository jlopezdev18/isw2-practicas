const DESCUENTO_MAYORISTA = 0.1;
const DESCUENTO_FRECUENTE = 0.05;
const TASA_ISV = 0.15;
const RECARGO_TARJETA = 0.03;
const CENTAVOS_POR_LEMPIRA = 100;

function calcularSubtotal(items) {
  let subtotalCentavos = 0;
  for (const item of items) {
    subtotalCentavos += item.precioCentavos * item.cantidad;
  }
  return subtotalCentavos;
}

function calcularTotales(items, tipoCliente, tipoPago) {
  const subtotalCentavos = calcularSubtotal(items);
  let descuentoCentavos = 0;
  if (tipoCliente === 'mayorista') {
    descuentoCentavos = Math.round(subtotalCentavos * DESCUENTO_MAYORISTA);
  } else if (tipoCliente === 'frecuente') {
    descuentoCentavos = Math.round(subtotalCentavos * DESCUENTO_FRECUENTE);
  } else {
    descuentoCentavos = 0;
  }
  const isvCentavos = Math.round((subtotalCentavos - descuentoCentavos) * TASA_ISV);
  let totalCentavos = subtotalCentavos - descuentoCentavos + isvCentavos;
  if (tipoPago === 'tarjeta') {
    totalCentavos += Math.round(totalCentavos * RECARGO_TARJETA);
  }
  return {
    subtotalCentavos,
    descuentoCentavos,
    isvCentavos,
    totalCentavos,
  };
}

function crearTicket(cliente, totalCentavos) {
  return `Cliente: ${cliente.nombre}\nTotal: L ${(totalCentavos / CENTAVOS_POR_LEMPIRA).toFixed(2)}`;
}

function procesarVenta(cliente, items, tipoPago, { registrarVenta = console.log } = {}) {
  if (!cliente.activo) {
    return null;
  }
  if (!(items.length > 0)) {
    return null;
  }

  const totales = calcularTotales(items, cliente.tipo, tipoPago);
  const ticket = crearTicket(cliente, totales.totalCentavos);
  registrarVenta(ticket);
  return { ...totales, ticket };
}

module.exports = { procesarVenta };
