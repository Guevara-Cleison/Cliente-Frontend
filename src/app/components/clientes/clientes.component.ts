import { Component, OnInit, TemplateRef } from '@angular/core';
import { Cliente } from '../../model/Cliente';
import { ClientesService } from '../../services/clientes.service';
import { response } from 'express';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.css'
})
export class ClientesComponent implements OnInit {

  modalReference!: NgbModalRef;

  /* Lista de clientes a mostrar en la pantalla */
  public clientes!: Cliente[];

  /* Objeto cliente a guardar o actualizar */
  public cliente!: Cliente;

  /* PAGINACION */
  /* Pagina actual */
  page = 1;
  /* Tamaño de la pagina */
  pageSize = 4;
  /* Cantidad total de registros*/
  collectionSize = 0;
  /* fin PAGINACION */

  /* Constructor default que inicializa el componente de clientes */
  constructor(private clienteService: ClientesService, private modalService: NgbModal) {

  }

  ngOnInit(): void {
    /**
     * ejecutamos la FUNCION
     */
    this.consultarClientes();
    this.cliente = new Cliente();
  }

  /* Funcion para consultar los clientes */
  consultarClientes() {
    console.log('Consultando Clientes...')

    this.clienteService.consultarClientes().subscribe(response => {
      console.log(response);
      this.clientes = response;

      this.collectionSize = this.clientes.length;

      this.clientes = this.clientes
        .map((cliente, i) => ({ counter: i + 1, ...cliente })).slice(
          (this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
    });
  }

  /* Metodo que permite abrir una ventana modal a traves del componente */
  open(content: any) {
    this.modalReference = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
    this.modalReference.result.then((result) => {
      //this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  /* Metodo que permite cargar el objeto en la venta a mostrarse*/
  cargarCliente(clienteSeleccionado: Cliente, content: any) {
    this.cliente = new Cliente();

    this.cliente.idcliente = clienteSeleccionado.idcliente;
    this.cliente.nombre = clienteSeleccionado.nombre;
    this.cliente.apellido = clienteSeleccionado.apellido;
    this.cliente.anio = clienteSeleccionado.anio;
    this.cliente.correo = clienteSeleccionado.correo;
    this.cliente.fecha_creacion = clienteSeleccionado.fecha_creacion;

    this.open(content);
  }

  /* Metodo que permite guardar un Cliente */
  guardarCliente(data: any) {
    /* SI  no existe el IdCliente se guarda 
    Si existe se actualiza*/
    if (!this.cliente.idcliente) {
      this.cliente = new Cliente();
      this.cliente.nombre = data.nombre;
      this.cliente.apellido = data.apellido;
      this.cliente.anio = data.anio;
      this.cliente.correo = data.correo;

      this.clienteService.guardarCliente(this.cliente).subscribe(response => {

        this.modalReference.close();
        this.consultarClientes();
      });
    } else {
      this.clienteService.actualizarCliente(this.cliente).subscribe(response => {
        this.modalReference.close();

        this.consultarClientes();
        this.cliente = new Cliente;
      });
    }
  }

  /* Metodo que permite mostrar la ventana de confirmacion de la eliminacion de un cliente */
  mostrarVentanaEliminar(cliente: Cliente) {
    Swal.fire({
      title:  "Confirmaacion", 
      text: `¿Estas seguro de eliminar al cliente ${cliente.nombre}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Eliminar!",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {

        this.clienteService.eliminarCliente(cliente.idcliente).subscribe(response =>{
          this.consultarClientes();
          Swal.fire({
            title: "Eliminado!",
            text: `El cliente ${cliente.nombre} fue eliminado exitosamente`,
            icon: "success"
          });
        });
      }//fin If
    });
  }



}
