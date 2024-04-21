export function generarPassword() {
  const LENGTH = 32;
  const CHARS =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+';
  let contraseña = '';

  for (let i = 0; i < LENGTH; i++) {
    const caracterAleatorio = CHARS.charAt(
      Math.floor(Math.random() * CHARS.length),
    );
    contraseña += caracterAleatorio;
  }

  return contraseña;
}
