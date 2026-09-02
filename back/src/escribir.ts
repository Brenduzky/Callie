// escribir.ts
// Corré esto con: npx tsx ./escribir.ts
// Crea 4 archivos .json con datos de prueba, uno por tabla.

import * as fs from 'fs';
import { Usuario, Ejercicio, ObjetoDelUsuario, ItemTienda } from './type';

const usuarios: Usuario[] = [
  {
    id: 1,
    nombre: 'Juan',
    mail: 'maria@gmail.com',
    contrasena: '1234',
    fechaDeNacimiento: '2001-05-12',
    problemaFonoaudiologico: 'dislalia',
    monedasDisponibles: 50,
  },
];

const ejercicios: Ejercicio[] = [
  { idDelEjercicio: 1, recompensaEnMonedas: 10, idDelUsuario: 1, completado: true },
  { idDelEjercicio: 2, recompensaEnMonedas: 15, idDelUsuario: 1, completado: false },
];

const objetosDelUsuario: ObjetoDelUsuario[] = [
  { idDelUsuario: 1, idDelObjeto: 3 },
];

const tienda: ItemTienda[] = [
  { idDelObjeto: 1, desbloqueado: true, monedasUtilizadas: 20 },
  { idDelObjeto: 2, desbloqueado: false, monedasUtilizadas: 0 },
  { idDelObjeto: 3, desbloqueado: true, monedasUtilizadas: 30 },
];

const textoUsuarios: string = JSON.stringify(usuarios, null, 2);
fs.writeFileSync('./usuarios.json', textoUsuarios, 'utf8');
console.log('Escrito: ./usuarios.json');
 
const textoEjercicios: string = JSON.stringify(ejercicios, null, 2);
fs.writeFileSync('./ejercicios.json', textoEjercicios, 'utf8');
console.log(' Escrito: ./ejercicios.json');
 
const textoObjetos: string = JSON.stringify(objetosDelUsuario, null, 2);
fs.writeFileSync('./objetosDelUsuario.json', textoObjetos, 'utf8');
console.log(' Escrito: ./objetosDelUsuario.json');

const textoTienda: string = JSON.stringify(tienda, null, 2);
fs.writeFileSync('./tienda.json', textoTienda, 'utf8');
console.log('Escrito: ./tienda.json');

try {
  fs.writeFileSync('./usuarios.json', textoUsuarios, 'utf8');
  console.log('Archivo guardado correctamente en ./usuarios.json');
} catch (error) {
  console.error('Hubo un error al escribir usuarios.json:', error);
}

try {
  fs.writeFileSync('./ejercicios.json', textoEjercicios, 'utf8');
  console.log('Archivo guardado correctamente en ./ejercicios.json');
} catch (error) {
  console.error('Hubo un error al escribir ejercicios.json:', error);
}

try {
  fs.writeFileSync('./objetosDelUsuario.json', textoObjetos, 'utf8');
  console.log('Archivo guardado correctamente en ./objetosDelUsuario.json');
} catch (error) {
  console.error('Hubo un error al escribir objetosDelUsuario.json:', error);
}

try {
  fs.writeFileSync('./tienda.json', textoTienda, 'utf8');
  console.log('Archivo guardado correctamente en ./tienda.json');
} catch (error) {
  console.error('Hubo un error al escribir tienda.json:', error);
}