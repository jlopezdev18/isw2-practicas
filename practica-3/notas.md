# Notas de la práctica 3

## S — Responsabilidad única: principio 2 y principio 9

1. El principio 2, «Una función, una responsabilidad», se aplica separando las tareas de `procesar()`.
2. `validarStock()` revisa disponibilidad y `calcularTotales()` calcula el subtotal, el ISV y el total.
3. `crearTicket()` prepara el texto; las funciones inyectadas guardan, imprimen y envían, y `Pedido` coordina.
4. El principio 9, «Diseñá para el cambio», permite cambiar el ticket sin modificar el cálculo ni el guardado.
5. Aunque hay más funciones, cada una es pequeña y tiene una razón para cambiar.

## D — Inversión de dependencias: principio 9

1. El principio 9, «Diseñá para el cambio», se aplica al recibir las dependencias en el constructor de `Pedido`.
2. El guardado se recibe como una función `guardar(pedido)`, sin acceder directamente a la base de datos.
3. El envío se recibe como una función `enviar(telefono, texto)`, sin depender directamente de WhatsApp.
4. Fuera de `Pedido` se eligen las funciones concretas, que pueden reemplazarse respetando sus parámetros y comportamiento.
5. Así se puede verificar el flujo con funciones simuladas, sin una base de datos ni mensajes reales.
