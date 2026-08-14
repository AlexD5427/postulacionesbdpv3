/**
 * Curvas de animacion compartidas.
 *
 * Se declaran como tupla mutable de cuatro numeros (no `as const`) porque es la
 * forma que exige la propiedad `ease` de framer-motion: un `readonly` tuple no
 * es asignable a su tipo `Easing`.
 */
export type Bezier = [number, number, number, number];

/** Salida suave y larga: la curva principal de la interfaz. */
export const EASE_OUT: Bezier = [0.16, 1, 0.3, 1];

/** Entrada y salida simetricas: cortinas, mascaras y menus. */
export const EASE_IN_OUT: Bezier = [0.76, 0, 0.24, 1];

/** Rebote corto: botones, tooltips y elementos que aparecen. */
export const EASE_BACK: Bezier = [0.34, 1.56, 0.64, 1];

/** Progresos lineales suavizados: barras y temporizadores. */
export const EASE_SOFT: Bezier = [0.33, 1, 0.68, 1];
