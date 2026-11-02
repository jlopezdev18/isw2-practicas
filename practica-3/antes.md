class Pedido {
  procesar(cliente, items) {
    let subtotalCentavos = 0;
    for (const item of items) {
      const stock = baseDeDatos.consultarStock(item.productoId);
      if (stock === null || stock < item.cantidad) {
        throw new Error(`Stock insuficiente: ${item.nombre}`);
      }
      subtotalCentavos += item.cantidad * item.precioCentavos;
    }
    const isvCentavos = Math.round(subtotalCentavos * 0.15);
    const totalCentavos = subtotalCentavos + isvCentavos;
    const pedido = {
      clienteId: cliente.id, items, subtotalCentavos, isvCentavos, totalCentavos,
    };
    baseDeDatos.guardarPedido(pedido);
    const ticket = `Cliente: ${cliente.nombre}\nTotal: L ${(totalCentavos / 100).toFixed(2)}`;
    impresora.imprimir(ticket);
    whatsApp.enviar(cliente.telefono, ticket);
    return pedido;
  }
}
