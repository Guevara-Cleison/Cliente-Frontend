import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente } from '../model/Cliente';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  /* URL BASE DEL MICROSERVICIO DE CLIENTES DE SPRINGBOOT */
  private baseUrl = 'http://localhost:8080/cliente'
  
  /* */
  private headers: HttpHeaders = new HttpHeaders({'Content-Type' : 'application/json'});

/* Constructor  que inicializa el servicio*/
  constructor(private httpClient: HttpClient) {

   }

   /* Funcion que permite consumir el servicio para consultar clientes */
  consultarClientes() : Observable<Cliente[]> {
    return this.httpClient.get<Cliente[]>(`${this.baseUrl}/consultarClientes`);
  } 

  /* Funcion que permite consumir el servicio para Guardar clientes. */
  guardarCliente(cliente: Cliente) : Observable<Cliente>{
    return this.httpClient.post<Cliente>(`${this.baseUrl}/guardarCliente`, cliente, {headers: this.headers});
  }

  /* Funcion que permite consumir el servicio para Actualizar clientes. */
  actualizarCliente(cliente: Cliente) : Observable<Cliente>{
    return this.httpClient.put<Cliente>(`${this.baseUrl}/actualizarCliente`, cliente, {headers: this.headers});
  }

  /* Funcion que permite consumir el servicio para eliminar clientes*/
  eliminarCliente(id: number) : Observable<void> {
    return this.httpClient.delete<void>(`${this.baseUrl}/eliminarCliente/${id}`);
  }

}
