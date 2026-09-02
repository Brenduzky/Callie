export type Usuario = {
    id: number;
  nombre: string;
  mail: string;
  contrasena: string;
  fechaDeNacimiento: string;
  problemaFonoaudiologico: string;
  monedasDisponibles: number;

}

export type Ejercicio = {
  idDelEjercicio: number;
  recompensaEnMonedas: number;
  idDelUsuario: number;
  completado: boolean;
};
 
export type ObjetoDelUsuario = {
  idDelUsuario: number;
  idDelObjeto: number;
};
 
export type ItemTienda = {
  idDelObjeto: number;
  desbloqueado: boolean;
  monedasUtilizadas: number;
};