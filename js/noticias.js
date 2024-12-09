class Noticias {
    constructor(inputFile = null) {
        if (!(window.File && window.FileReader && window.FileList && window.Blob))
            document.write("<p>Este navegador no soporta el API File, el programa puede no funcionar correctamente</p>");
        this.inputFile = inputFile;
        if(inputFile)
            this.readInputFile();
        this.readForm();
    }

    readInputFile() {
        var archivo = this.inputFile[0];
        var texto;
        var array;
        
        //Solamente admite archivos de tipo texto
        var tipoTexto = /text.*/;
        if (archivo.type.match(tipoTexto)) {
            var lector = new FileReader();
            // Using arrow function to maintain 'this' context
            lector.onload = (evento) => {
                texto = lector.result;
                array = texto.split("\n");
                for(var i = 0; i < array.length; i++) {
                    if(array[i].trim()) {  // Only process non-empty lines
                        this.procesarNoticia(array[i]);
                    }
                }
            };
            
            lector.readAsText(archivo);
        } else {
            errorArchivo.innerText = "Error : Archivo no válido";
        }
    }

    readForm(){
        var titular = document.getElementsByName('titular')[0].value;
        var entradilla = document.getElementsByName('entradilla')[0].value;
        var autor = document.getElementsByName('autor')[0].value;

        if(titular && entradilla && autor) {
            $("section").append(`
                <article><h4>${titular}</h4>
                <h5>${entradilla}</h5>
                <p>${autor}</p></article>
            `);
        }
       

    }
    
    procesarNoticia(texto) {
        var array = texto.split("_");
        if(array.length >= 3) {  // Make sure we have all three parts
            $("section").append(`
                    <article><h4>${array[0]}</h4>
                    <h5>${array[1]}</h5>
                    <p>${array[2]}</p></article>
            `);
        }
    }
}
var noticias;
function handleFileInput(input) {
    noticias = new Noticias(input.files);
}

