class Agenda{
    constructor(){
        this.date = new Date();
        this.url = `https://api.jolpi.ca/ergast/f1/2024/races/?format=json`;
            
    }

    informacionCarreras(){
        if ($("main").children().length > 2) {
            $("main").empty();
            $("main").append('<h2>Calendario</h2>');
            $("main").append('<button onclick = "agenda.informacionCarreras()">Ver carreras 2024</button>');
            return;
        }
        $("button").remove();
        $("main").append('<button onclick = "agenda.informacionCarreras()">Esconder carreras 2024</button>');
        $.ajax({
            dataType: "json",
            url: this.url,
            method: 'GET',

            success: function(datos){
                $("pre").text(JSON.stringify(datos, null, 2));
                const raceDate = new Date();
                let stringDatos = `<h3>Carreras temporada ` + raceDate.getFullYear() + ` </h3><section>`;

                const races = datos.MRData.RaceTable.Races;

                races.forEach(race => {
                    const date = new Date(race.date + 'T' + race.time);
                    const dateString = date.toLocaleDateString('es-ES', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    });
                    const timeString = date.toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit'
                    });
                    
                    stringDatos += `
                        <article>
                            <h4>${race.raceName} - Ronda ${race.round}</h4>
                            <ul>
                                <li>Circuito: ${race.Circuit.circuitName}</li>
                                <li>Coordenadas:
                                    <ul>
                                        <li>Latitud: ${race.Circuit.Location.lat}</li>
                                        <li>Longitud: ${race.Circuit.Location.long}</li>
                                    </ul>
                                </li>
                                <li>Localidad: ${race.Circuit.Location.locality}</li>
                                <li>País: ${race.Circuit.Location.country}</li>
                                <li>Fecha y hora: ${dateString}, a las ${timeString}</li>
                            </ul>
                        </article>`
                });
                
                $("main").append(stringDatos + '</section>'); 
            },
            error:function(){
                $("h3").html("¡Tenemos problemas! No puedo obtener JSON de <a href='http://api.jolpi.ca/ergast/f1/'>Jolpica</a>"); 
                $("h4").remove();
                $("h5").remove();
                $("p").remove();
                }
        })
    }

}

const agenda = new Agenda();