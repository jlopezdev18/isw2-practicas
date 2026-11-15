const DESCUENTO_MAYORISTA = 0.1;
const DESCUENTO_FRECUENTE = 0.05;
const TASA_ISV = 0.15;
const RECARGO_TARJETA = 0.03;
const CENTAVOS_POR_LEMPIRA = 100;

function procesarVenta(cliente, items, tipoPago) {
  let subtotalCentavos = 0;
  let descuentoCentavos = 0;
  let isvCentavos = 0;
  let totalCentavos = 0;
  let ticket = '';
  if (cliente.activo) {
    if (items.length > 0) {
      for (const item of items) {
        subtotalCentavos += item.precioCentavos * item.cantidad;
      }
      if (cliente.tipo === 'mayorista') {
        descuentoCentavos = Math.round(subtotalCentavos * DESCUENTO_MAYORISTA);
        isvCentavos = Math.round((subtotalCentavos - descuentoCentavos) * TASA_ISV);
        totalCentavos = subtotalCentavos - descuentoCentavos + isvCentavos;
      } else if (cliente.tipo === 'frecuente') {
        descuentoCentavos = Math.round(subtotalCentavos * DESCUENTO_FRECUENTE);
        isvCentavos = Math.round((subtotalCentavos - descuentoCentavos) * TASA_ISV);
        totalCentavos = subtotalCentavos - descuentoCentavos + isvCentavos;
      } else {
        descuentoCentavos = 0;
        isvCentavos = Math.round((subtotalCentavos - descuentoCentavos) * TASA_ISV);
        totalCentavos = subtotalCentavos - descuentoCentavos + isvCentavos;
      }
      if (tipoPago === 'tarjeta') {
        totalCentavos += Math.round(totalCentavos * RECARGO_TARJETA);
      }
      ticket = `Cliente: ${cliente.nombre}\nTotal: L ${(totalCentavos / CENTAVOS_POR_LEMPIRA).toFixed(2)}`;
      console.log(ticket);
      return {
        subtotalCentavos,
        descuentoCentavos,
        isvCentavos,
        totalCentavos,
        ticket,
      };
    } else {
      return null;
    }
  } else {
    return null;
  }
}

module.exports = { procesarVenta };
