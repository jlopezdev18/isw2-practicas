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
        descuentoCentavos = Math.round(subtotalCentavos * 0.1);
        isvCentavos = Math.round((subtotalCentavos - descuentoCentavos) * 0.15);
        totalCentavos = subtotalCentavos - descuentoCentavos + isvCentavos;
      } else if (cliente.tipo === 'frecuente') {
        descuentoCentavos = Math.round(subtotalCentavos * 0.05);
        isvCentavos = Math.round((subtotalCentavos - descuentoCentavos) * 0.15);
        totalCentavos = subtotalCentavos - descuentoCentavos + isvCentavos;
      } else {
        descuentoCentavos = 0;
        isvCentavos = Math.round((subtotalCentavos - descuentoCentavos) * 0.15);
        totalCentavos = subtotalCentavos - descuentoCentavos + isvCentavos;
      }
      if (tipoPago === 'tarjeta') {
        totalCentavos += Math.round(totalCentavos * 0.03);
      }
      ticket = `Cliente: ${cliente.nombre}\nTotal: L ${(totalCentavos / 100).toFixed(2)}`;
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
