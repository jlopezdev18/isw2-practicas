const TASAS_DESCUENTO = Object.freeze({ mayorista: 0.1, frecuente: 0.05 });
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

function calcularTotales(items, tipoCliente, tipoPago, tasasDescuento) {
  const subtotalCentavos = calcularSubtotal(items);
  const tasaDescuento = Object.hasOwn(tasasDescuento, tipoCliente) ? tasasDescuento[tipoCliente] : 0;
  const descuentoCentavos = Math.round(subtotalCentavos * tasaDescuento);
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

function procesarVenta(cliente, items, tipoPago, {
  registrarVenta = console.log,
  tasasDescuento = TASAS_DESCUENTO,
} = {}) {
  if (!cliente.activo) {
    return null;
  }
  if (!(items.length > 0)) {
    return null;
  }

  const totales = calcularTotales(items, cliente.tipo, tipoPago, tasasDescuento);
  const ticket = crearTicket(cliente, totales.totalCentavos);
  registrarVenta(ticket);
  return { ...totales, ticket };
}

module.exports = { procesarVenta };
