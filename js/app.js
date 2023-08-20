// ******* CONSTRUCTORES *******
function Seguro(marca, year, tipo){
    this.marca = marca
    this.year = year
    this.tipo = tipo   
}
// Debes definir el constructor aunque este vacio.
function UI (){}

// ******* PROTOTYPES USER INTERFACE *******
//Llena opciones de year
UI.prototype.llenarOpciones = ()=>{
    const max = new Date().getFullYear(),
            min = max - 23;

    const year = document.querySelector('#year');

    for (let i = max; i > min; i--) {
        const opcion = document.createElement('OPTION')
        opcion.value=i;
        opcion.textContent = i;
        
        year.appendChild(opcion);
    }
}

// Muestra alertas en pantalla
UI.prototype.mostrarMensaje = (mensaje, tipo) =>{
    const div = document.createElement('DIV');

    if(tipo === 'error'){
        div.classList.add('error');
    }else{
        div.classList.add('correcto')
    }

    div.classList.add('mensaje', 'mt-10');
    div.textContent = mensaje;

    //Insertar en HTML
    const formulario = document.querySelector('#cotizar-seguro');
    formulario.insertBefore(div, document.querySelector('#resultado'))

    setTimeout( ()=>{
        div.remove();
    }, 2000 )
   
}

UI.prototype.mostrarResultado = (seguro, total) =>{
    const { marca, year, tipo } = seguro;
    let textoMarca;
     switch (marca){
        case '1': 
            textoMarca='Americano'
            break;
        case '2':
            textoMarca='Asiatico'
            break;
        case '3':
            textoMarca='Europeo'
            break;
        default:
           
            break;
     }

    const div = document.createElement('DIV');
    div.classList.add('mt-10');
    div.innerHTML = `
        <p class="header">Tu Resumen</p>
        <p class="font-bold"> Marca: <span class="font-normal capitalize"> ${textoMarca} </span></p>
        <p class="font-bold"> Total: <span class="font-normal"> $${total} </span></p>
        <p class="font-bold"> Año: <span class="font-normal"> ${year} </span></p>
        <p class="font-bold"> Tipo: <span class="font-normal capitalize"> ${tipo} </span></p>
    `;

    const resultadoDiv = document.querySelector('#resultado')

    // Mostrar spinner
    const spinner = document.querySelector('#cargando');
    spinner.style.display = 'block';

    setTimeout(() => {
        spinner.style.display = 'none';
         resultadoDiv.appendChild(div);
    }, 2000);
}


// ******* PROTOTYPES SEGURO *******
Seguro.prototype.cotizarSeguro = function (){
    /**
     * 1 = Americano = Precio * 1.15
     * 2 = Asiatico = Precio * 1.05
     * 3 = Europeo = Precio * 1.35
     */
    let cantidad;
    const base = 2000;

    switch (this.marca){
        case '1': 
            cantidad = base * 1.15;
            break;
        case '2':
            cantidad = base * 1.05;
            break;
        case '3':
            cantidad = base * 1.35
            break;
        default:
            cantidad= base;
            break;
    }

    // Por cada año de diferencia se tiene que quitar el 3% al costo
    // Considerando que 
    const diferencia = (new Date().getFullYear() - parseInt(this.year))
    for (let i = 0; i < diferencia; i++) {
        cantidad = cantidad - (cantidad * .03)
    }
    
    // Si el seguro es basico se multiplica por un 30% mas
    // Si es COMPLETO se multiplica por 50% mas

    if(this.tipo === 'basico'){
        cantidad *= 1.30
    }else{
        cantidad *= 1.50
    }

    return cantidad.toFixed(2);
}

//Instanciar objeto de User Interface
const ui = new UI();

document.addEventListener('DOMContentLoaded', ()=>{
    ui.llenarOpciones(); // llena el select con los años
});


// ******* EVENT LISTENERS *******
eventListeners()
function eventListeners(){
    const formulario = document.querySelector('#cotizar-seguro')
    formulario.addEventListener('submit', cotizarSeguro);
}

// ******* FUNCIONES *******
function cotizarSeguro(e){
    e.preventDefault();
    
    //Leer marca seleccionada
        const marca = document.querySelector('#marca').value;
    // Leer year seleccionado
        const yearSelected = document.querySelector('#year').value;
    // Leer Tipo de cobertura
        const tipo = document.querySelector('input[name="tipo"]:checked').value;

        if(marca === '' || yearSelected === '' || tipo === ''){
                ui.mostrarMensaje('Todos los campos son obligatorios', 'error');
                return;
        }

        ui.mostrarMensaje('Cotizando...', 'exito');

        // Ocultar cotizaciones previas
        const resultados = document.querySelector('#resultado div');

        if(resultados !== null){
            resultados.remove();
        }
         
        //instanciar seguro
        const seguro = new Seguro(marca, yearSelected, tipo);
        const total = seguro.cotizarSeguro();

        ui.mostrarResultado(seguro, total)
}