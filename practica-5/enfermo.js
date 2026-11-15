function p(c, a, t) {
  let s = 0;
  let d = 0;
  let i = 0;
  let x = 0;
  let r = '';
  if (c.activo) {
    if (a.length > 0) {
      for (const e of a) {
        s += e.precioCentavos * e.cantidad;
      }
      if (c.tipo === 'mayorista') {
        d = Math.round(s * 0.1);
        i = Math.round((s - d) * 0.15);
        x = s - d + i;
      } else if (c.tipo === 'frecuente') {
        d = Math.round(s * 0.05);
        i = Math.round((s - d) * 0.15);
        x = s - d + i;
      } else {
        d = 0;
        i = Math.round((s - d) * 0.15);
        x = s - d + i;
      }
      if (t === 'tarjeta') {
        x += Math.round(x * 0.03);
      }
      r = `Cliente: ${c.nombre}\nTotal: L ${(x / 100).toFixed(2)}`;
      console.log(r);
      return {
        subtotalCentavos: s,
        descuentoCentavos: d,
        isvCentavos: i,
        totalCentavos: x,
        ticket: r,
      };
    } else {
      return null;
    }
  } else {
    return null;
  }
}

module.exports = { procesarVenta: p };
