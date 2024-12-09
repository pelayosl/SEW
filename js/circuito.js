class Circuito{
    constructor() {
        this.lat = null;
        this.long = null;
        if (!(window.File && window.FileReader && window.FileList && window.Blob))
            document.write("<p>Este navegador no soporta el API File, el programa puede no funcionar correctamente</p>");
    }

    readInputFile(inputFile) {
        var archivo = inputFile[0];
        var texto;

        var nombre = archivo.name.toLowerCase();
        if (nombre.endsWith('.xml')) 
            {
            var lector = new FileReader();
            lector.onload = function (evento) {
                texto = evento.target.result;
                
                var parser = new DOMParser();
                var xml = parser.parseFromString(texto, "text/xml");
                
                this.formatXMLContent(xml);
            }.bind(this);      
            lector.readAsText(archivo);
        }
        else if(nombre.endsWith('.kml'))
            {
                var lector = new FileReader();
                lector.onload = function (evento) {
                    texto = evento.target.result;
                    
                    var parser = new DOMParser();
                    var xml = parser.parseFromString(texto, "text/xml");
                   
                    this.formatKMLContent(xml);
                }.bind(this);      
                lector.readAsText(archivo);
            }
        else if(nombre.endsWith('.svg'))
            {
                var lector = new FileReader();
                lector.onload = function (evento) {
                    texto = evento.target.result;

                    $("main").append('<h3>Altimetría del circuito</h3>');
                    var image = document.createElement('img');
                    image.src = texto;
                    image.alt = "Imagen de altimetría del circuito";
                    $("main").append(texto);
                }.bind(this);      
                lector.readAsText(archivo);
            }
        else
            $("main").append(`<p>¡ARCHIVO INVÁLIDO! ${archivo.type}</h2>`);
    }

    formatXMLContent(xml){
        
        var circuito = xml.querySelector('circuito');
        if(circuito){
            $("main").append(`<h3>Circuito: ${this.getElementText(circuito, 'nombre')}</h3>`);
        }
        var dimensiones = circuito.querySelector('dimensiones');
        if (dimensiones) {
            $("main").append(`
                <p>Longitud: ${dimensiones.getAttribute('longitud_circuito')} km</p>
                <p>Anchura: ${dimensiones.getAttribute('anchura')} m</p>
            `);
        }
        $("main").append(`
            <p>Fecha: ${this.getElementText(circuito, 'fecha_carrera')}</p>
            <p>Hora: ${this.getElementText(circuito, 'hora_inicio')}</p>
            <p>Vueltas: ${this.getElementText(circuito, 'num_vueltas')}</p>
        `);

        var ubicacion = circuito.querySelector('ubicacion');
        if (ubicacion) {
            $("main").append(`
                <p>Localidad: ${this.getElementText(ubicacion, 'localidad')}</p>
                <p>País: ${this.getElementText(ubicacion, 'pais')}</p>
            `);
        }

        var referencias = circuito.querySelectorAll('referencias referencia');
        if (referencias.length > 0) {
            var refList = '<h4>Referencias:</h4><ul>';
            referencias.forEach(ref => {
                refList += `<li><a href="${ref.textContent}">${ref.textContent}</a></li>`;
            });
            refList += '</ul>'
            $("main").append(refList);
        }

        var fotos = circuito.querySelectorAll('fotos foto');
        if (fotos.length > 0) {
            $("main").append('<h4>Fotos:</h4>');
            fotos.forEach(foto => {
                $("main").append(`<p>Ruta: ${foto.textContent}</p>`);
            });
        }
        var videos = circuito.querySelectorAll('videos video');
        if (videos.length > 0) {
            ($("main")).append('<h4>Videos:</h4>');
            videos.forEach(video => {
                $("main").append(`<p>Ruta: ${video.textContent}</p>`);
            });
        }
        var coordIniciales = circuito.querySelector('coordenadas_inicio');

        // Cambiar lat y long a decimal
        this.lat = this.fromDMStoDecimal(this.getElementText(coordIniciales, 'latitud'));
        this.long = this.fromDMStoDecimal(this.getElementText(coordIniciales, 'longitud'));

        if(coordIniciales){
            $("main").append(`<h4>Coordenadas iniciales del circuito</h4>
                            Latitud: ${this.lat}<br>
                            Longitud: ${this.long}<br>
                            Altitud: ${this.getElementText(coordIniciales, 'altitud')} m
                `);
        }
        var tramos = circuito.querySelectorAll('tramos tramo');
        if (tramos.length > 0) {
            $("main").append('<h4>Tramos del circuito:</h4>');
            var tramosTable = $(`
                <table>
                    <thead>
                        <tr>
                            <th id="sector" scope="row">Sector</th>
                            <th id="distancia" scope="row">Distancia</th>
                            <th id="coordenadas" scope="row">Coordenadas Finales</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            `);
            tramos.forEach(tramo => {
                var coordFinales = tramo.querySelector('coordenadas_final');
                tramosTable.find('tbody').append(`
                    <tr>
                        <td headers="sector">${tramo.getAttribute('sector')}</td>
                        <td headers="distancia">${tramo.getAttribute('distancia')} m</td>
                        <td headers="coordenadas">
                            Lat: ${this.getElementText(coordFinales, 'latitud')}<br>
                            Long: ${this.getElementText(coordFinales, 'longitud')}<br>
                            Alt: ${this.getElementText(coordFinales, 'altitud')} m
                        </td>
                    </tr>
                `);
            });
            $("main").append(tramosTable);
        }
        this.initDynamicMap();
    }

    formatKMLContent(kml) {
        var coordinates = kml.getElementsByTagName("coordinates")[0];
        var coordinatesArray = coordinates.textContent.trim().split(/\s+/);

        var latLongArray = coordinatesArray.map(coord => {
            const [lng, lat, alt] = coord.split(",").map(parseFloat);
            return { lat: lat, lng: lng };
        });
    
        var polyline = new google.maps.Polyline({
            path: latLongArray,
            geodesic: true,
            strokeColor: "#FF0000",
            strokeOpacity: 1.0,
            strokeWeight: 2,
        });

        polyline.setMap(this.map);

        // latLongArray.forEach((position) => {
        //     var marker = new google.maps.Marker({
        //         position,
        //         map: this.map,
        //     });
        // });

    }

    getElementText(parent, tagName) {
        var element = parent.querySelector(tagName);
        return element ? element.textContent : '';
    }

    initDynamicMap() {
        
        if (!window.google) {
            const apiKey = 'AIzaSyBoSW46rRKo8lL6dOAAAaatHAhtwCDlKKo';
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
            script.async = true;
            script.defer = true;
            document.head.appendChild(script);

            script.onload = () => this.createMap();
        } else {
            this.createMap();
        }
    }

    createMap() {
        $("main").append("<h3>Mapa dinámico</h3>");

        if (!document.getElementById('map')) {
            const mapDiv = document.createElement('div');
            mapDiv.id = 'map';
            document.querySelector('main').appendChild(mapDiv);
        }

        const mapOptions = {
            center: { lat: this.lat, lng: this.long },
            zoom: 13,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        this.map = new google.maps.Map(document.getElementById('map'), mapOptions);

    }

    fromDMStoDecimal(coord){
        coord = coord.trim();
        
        var direction = coord.slice(-1);
        var isNegative = direction == 'S' || direction == 'W';
        
        coord = coord.slice(0, -1);
        
        var parts = coord.split(/[°'"]/);
        
        var degrees = parseFloat(parts[0]);
        var minutes = parts[1] ? parseFloat(parts[1]) : 0;
        var seconds = parts[2] ? parseFloat(parts[2]) : 0;
        
        let decimalDegrees = degrees + (minutes / 60) + (seconds / 3600);
        
        return isNegative ? -decimalDegrees : decimalDegrees;
    }

}