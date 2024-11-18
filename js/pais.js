
class Pais {

    constructor(nombrePais, capital, poblacion) {
        this.nombrePais = nombrePais;
        this.capital = capital;
        this.poblacion = poblacion;
        this.circuito = undefined;
        this.gobierno = undefined;
        this.latitud = undefined;
        this.longitud = undefined;
        this.religion = undefined;
    }

    cargaValores(circuito, gobierno, latitud, longitud, religion){
        this.circuito = circuito;
        this.gobierno = gobierno;
        this.latitud = latitud;
        this.longitud = longitud;
        this.religion = religion;
    }

    obtenerNombre() {
        return this.nombrePais;
    }

    obtenerCapital() {
        return this.capital;
    }

    obtenerListaInfoSecundaria() {
        return `<ul>
                <li>Nombre del circuito: ${this.circuito}</li>
                <li>Población país: ${this.poblacion}</li>
                <li>Forma de gobierno: ${this.gobierno}</li>
                <li>Religión mayoritaria: ${this.religion}</li>
                </ul>`;
    }

    escribirCoordenadas() {
        $("main").append("<p>" + this.latitud + ", " + this.longitud + "</p>");
    }

    obtenerClima(){
        var apikey = "555c0a703c7136dc904d06d3d5ff1dcd";
        var tipo = "xml";
        var unidades = "metric";
        var idioma = "es";
        
        var url = `http://api.openweathermap.org/data/2.5/forecast?lat=${this.latitud}&lon=${this.longitud}&appid=${apikey}`+
        `&units=${unidades}&lang=${idioma}&mode=${tipo}`;

        $.ajax({
            dataType: "xml",
            url: url,
            method: 'GET',
            success: function(datos){
                
                    //Presentación del archivo XML en modo texto
                    $("h5").text(JSON.stringify(datos));

                    let stringDatos = "<h3>Pronóstico del tiempo para 5 días</h3><section>";
                    $('forecast > time', datos).each(function() {
                        const timeSlot = $(this);
                        const fromTime = timeSlot.attr('from');
                        const date = new Date(fromTime);
                        if(date.getHours() == 9) { /* En arabia saudita la zona horaria es UTC+3 --> 9 UTC corresponde a 12 SA */

                            const icon = `https://openweathermap.org/img/wn/` + $('symbol', timeSlot).attr('var') + `@2x.png`;

                            date.setHours(date.getHours()+3);
                            const dateString = date.toLocaleDateString('es-ES', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric'
                            });
                            const timeString = date.toLocaleTimeString('es-ES', {
                                hour: '2-digit',
                                minute: '2-digit'
                            });

                            stringDatos += `
                            <article>
                                <h4>${dateString} - ${timeString}</h4>
                                <img src="` + icon +`"
				                    alt="Icono representando el clima"/>
                                <ul>
                                    <li>Temperatura: ${parseFloat($('temperature', timeSlot).attr("value"))}°C</li>
                                    <li>Mínima: ${parseFloat($('temperature', timeSlot).attr("min"))}°C</li>
                                    <li>Máxima: ${parseFloat($('temperature', timeSlot).attr("max"))}°C</li>
                                    <li>Humedad: ${$('humidity', timeSlot).attr("value")}${$('humidity', timeSlot).attr("unit")}</li>
                                    <li>Lluvia: ${parseFloat($('precipitation', timeSlot).attr("probability") * 100)}%</li>
                                </ul>
                            </article>`;
                        }
                    });
                    
                    $("main").append(stringDatos + '</section>');                  
                },
            error:function(){
                $("h3").html("¡Tenemos problemas! No puedo obtener XML de <a href='http://openweathermap.org'>OpenWeatherMap</a>"); 
                $("h4").remove();
                $("h5").remove();
                $("p").remove();
                }
        }); 
    }


}

const pais = new Pais("Arabia Saudita", "Riad", 32175000);
pais.cargaValores("Jeddah Corniche", "Monarquía absoluta", "21.6326", "39.1045", "Islam suní");
$("main").append('<h3>Nombre del país</h3>');
$("main").append('<p>' + pais.obtenerNombre() + '</p>');
$("main").append('<h3>Capital</h3>');
$("main").append('<p>' + pais.obtenerCapital() + '</p>');
$("main").append('<h3>Información</h3>');
$("main").append(pais.obtenerListaInfoSecundaria());
$("main").append('<h4>Coordenadas meta</h4>');
pais.escribirCoordenadas();
pais.obtenerClima();