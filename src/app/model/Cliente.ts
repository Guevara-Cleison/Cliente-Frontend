/*
 ENTIDAD QUE MAPEA LA INFORMACION OBTENIA DEL MICROSERVICIO DE CLIENTE
*/
export class Cliente {

    public idcliente!: number;

    public nombre!: string;
    
    public apellido!: string;

    public anio!: number;

    public correo!: string;
    
    public fecha_creacion!: Date;

}