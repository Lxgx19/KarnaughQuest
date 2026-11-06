/** Reglas del K-map para aceptar un grupo. */
class GroupValidator {
  static validate(fn, cells) {
    if (!cells.length) return { ok: false, reason: 'Selecciona primero las celdas del grupo.' };
    if (cells.some(x => !fn.isOne(x))) return { ok: false, reason: 'El grupo incluye una celda con 0. Solo se agrupan unos.' };
    if (cells.length !== Cube.fromMinterms(fn.n, cells).size)
      return { ok: false, reason: 'Grupo no válido: el tamaño debe ser 1, 2, 4, 8 o 16 y las celdas deben ser adyacentes (los bordes también se tocan).' };
    return { ok: true, reason: '' };
  }
}
