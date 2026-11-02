function validarStock(items, consultarStock) {
  for (const item of items) {
    const stock = consultarStock(item.productoId);
    if (stock === null || stock < item.cantidad) {
      throw new Error(`Stock insuficiente: ${item.nombre}`);
    }
  }
}

function calcularTotales(items) {
  let subtotalCentavos = 0;
  for (const item of items) {
    subtotalCentavos += item.cantidad * item.precioCentavos;
  }
  const isvCentavos = Math.round(subtotalCentavos * 0.15);
  const totalCentavos = subtotalCentavos + isvCentavos;
  return { subtotalCentavos, isvCentavos, totalCentavos };
}

function crearTicket(cliente, pedido) {
  return `Cliente: ${cliente.nombre}\nTotal: L ${(pedido.totalCentavos / 100).toFixed(2)}`;
}

class Pedido {
  constructor({ consultarStock, guardar, imprimir, enviar }) {
    this.consultarStock = consultarStock;
    this.guardar = guardar;
    this.imprimir = imprimir;
    this.enviar = enviar;
  }

  procesar(cliente, items) {
    validarStock(items, this.consultarStock);
    const totales = calcularTotales(items);
    const pedido = { clienteId: cliente.id, items, ...totales };
    this.guardar(pedido);
    const ticket = crearTicket(cliente, pedido);
    this.imprimir(ticket);
    this.enviar(cliente.telefono, ticket);
    return pedido;
  }
}

const servicioPedido = new Pedido({
  consultarStock: id => baseDeDatos.consultarStock(id),
  guardar: pedido => baseDeDatos.guardarPedido(pedido),
  imprimir: texto => impresora.imprimir(texto),
  enviar: (telefono, texto) => whatsApp.enviar(telefono, texto),
});
