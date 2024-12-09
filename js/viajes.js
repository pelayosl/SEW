class Viajes{
    constructor(){
        this.mensaje = "";
        this.longitud = null;
        this.latitud = null;
        this.precision = null;
        this.altitud = null;
        this.precisionAltitud = null;
        this.rumbo = null;
        this.velocidad = null;

        this.map = null;
        this.marker = null;

        navigator.geolocation.getCurrentPosition(this.getPosicion.bind(this), this.verErrores.bind(this));
        
    }

    getPosicion(posicion){
        this.mensaje = "Se ha realizado correctamente la petición de geolocalización";
        this.longitud         = posicion.coords.longitude; 
        this.latitud          = posicion.coords.latitude;  
        this.precision        = posicion.coords.accuracy;
        this.altitud          = posicion.coords.altitude;
        this.precisionAltitud = posicion.coords.altitudeAccuracy;
        this.rumbo            = posicion.coords.heading;
        this.velocidad        = posicion.coords.speed;

        this.getMapaEstaticoGoogle();
        this.initDynamicMap();
    }

    verErrores(error){
        switch(error.code) {
        case error.PERMISSION_DENIED:
            this.mensaje = "El usuario no permite la petición de geolocalización"
            break;
        case error.POSITION_UNAVAILABLE:
            this.mensaje = "Información de geolocalización no disponible"
            break;
        case error.TIMEOUT:
            this.mensaje = "La petición de geolocalización ha caducado"
            break;
        case error.UNKNOWN_ERROR:
            this.mensaje = "Se ha producido un error desconocido"
            break;
        }
    }

    getMapaEstaticoGoogle(){
        
        var apiKey = "&key=AIzaSyBoSW46rRKo8lL6dOAAAaatHAhtwCDlKKo";
        //URL: obligatoriamente https
        var url = "https://maps.googleapis.com/maps/api/staticmap?";
        //Parámetros
        // centro del mapa (obligatorio si no hay marcadores)
        if (!this.latitud || !this.longitud) {
            throw new Error('Latitude and longitude are required');
        }
        var centro = "center=" + this.latitud + "," + this.longitud;
        //zoom (obligatorio si no hay marcadores)
        //zoom: 1 (el mundo), 5 (continentes), 10 (ciudad), 15 (calles), 20 (edificios)
        var zoom ="&zoom=15";
        //Tamaño del mapa en pixeles (obligatorio)
        var tamaño= "&size=800x600";
        //Escala (opcional)
        //Formato (opcional): PNG,JPEG,GIF
        //Tipo de mapa (opcional)
        //Idioma (opcional)
        //region (opcional)
        //marcadores (opcional)
        var marcador = "&markers=color:red%7Clabel:S%7C" + this.latitud + "," + this.longitud;
        //rutas. path (opcional)
        //visible (optional)
        //style (opcional)
        var sensor = "&sensor=false"; 
        
        this.imagenMapa = url + centro + zoom + tamaño + marcador + sensor + apiKey;
        $("main").append("<h3>Mapa estático</h3>");
        $("main").append("<img src='"+this.imagenMapa+"' alt='mapa estático google' />");
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
        var mapSection = document.createElement('section');
        var mapDiv = document.createElement('div');
        
        mapSection.appendChild(mapDiv);
        document.querySelector('main').appendChild(mapSection);
        
        const mapOptions = {
            center: { lat: this.latitud, lng: this.longitud },
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        
        this.map = new google.maps.Map(mapDiv, mapOptions);
        this.marker = new google.maps.Marker({
            position: { lat: this.latitud, lng: this.longitud },
            map: this.map,
            title: 'Tu posición'
        });
    }

}
