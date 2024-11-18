class Noticias {
    constructor(inputFile) {
        if (window.File && window.FileReader && window.FileList && window.Blob) 
                document.write("<p>Este navegador soporta el API File </p>");
        else
                document.write("<p>Este navegador no soporta el API File, el programa puede no funcionar correctamente</p>");

        this.inputFile = inputFile;
    }

    readInputFile() {
        var archivo = this.inputFile[0];
        
        nombre.innerText = "Nombre del archivo: " + archivo.name;
        tamaño.innerText = "Tamaño del archivo: " + archivo.size + " bytes"; 
        tipo.innerText = "Tipo del archivo: " + archivo.type;
        ultima.innerText = "Fecha de la última modificación: " + archivo.lastModifiedDate;
        contenido.innerText="Contenido del archivo de texto:"
        //Solamente admite archivos de tipo texto
        var tipoTexto = /text.*/;
        if (archivo.type.match(tipoTexto)) 
            {
            var lector = new FileReader();
            lector.onload = function (evento) {
                //El evento "onload" se lleva a cabo cada vez que se completa con éxito una operación de lectura
                //La propiedad "result" es donde se almacena el contenido del archivo
                //Esta propiedad solamente es válida cuando se termina la operación de lectura
                areaVisualizacion.innerText = lector.result;
                }      
            lector.readAsText(archivo);
        }
        else {
            errorArchivo.innerText = "Error : Archivo no válido";
        }       
    }
}