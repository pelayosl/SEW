class Api{

    constructor(){
        this.worker = null;
        this.interval = null;
        this.isRunning = false;
        this.timerElement = document.getElementsByTagName("p")[1];
        this.elapsedTime = 0;
        this.minutes = 0;
        this.seconds = 0;
        this.selectedDifficulty = undefined;
        this.guessCounter = 0;
        this.start = false;
        this.nextRound = this.nextRound.bind(this); // Ensure other methods are bound if necessary
        this.handleDrop = this.handleDrop.bind(this); 
        this.pilotos = [
            { piloto: "Hamilton", equipo: "Mercedes"},
            { piloto: "Russell", equipo: "Mercedes"},
            { piloto: "Verstappen", equipo: "RedBull"},
            { piloto: "Checo", equipo: "RedBull"},
            { piloto: "Alonso", equipo: "AstonMartin"},
            { piloto: "Stroll", equipo: "AstonMartin"},
            { piloto: "Leclerc", equipo: "Ferrari"},
            { piloto: "Sainz", equipo: "Ferrari"},
            { piloto: "Ocon", equipo: "Alpine"},
            { piloto: "Gasly", equipo: "Alpine"},
            { piloto: "Norris", equipo: "McLaren"},
            { piloto: "Piastri", equipo: "McLaren"},
        ];

        this.dificultades = [
            { option: 3, name: "facil"},
            { option: 4, name: "medio" },
            { option: 6, name: "dificil" },
        ]

        this.pilotosSeleccionados = new Map();
        this.equipoSeleccionado = null;
        var rand = this.getRandomInt(0,3);
        this.selectedDifficulty = this.dificultades[rand].option;
        this.selectedDifficultyName = this.dificultades[rand].name;
        this.displayRecords();
        this.iniciarJuego();
        this.startTimer();
        
    }

    displayRecords() {
        var facil = localStorage.getItem('guess-counter-facil');
        var medio = localStorage.getItem('guess-counter-medio');
        var dificil = localStorage.getItem('guess-counter-dificil');

        $("main").append(`<h3>Récords personales</h3>`);
        facil == null ?  $("main").append(`<p>Fácil: no jugado!</p>`) :  $("main").append(`<p>Fácil: ${facil}</p>`);
        medio == null ?  $("main").append(`<p>Medio: no jugado!</p>`) :  $("main").append(`<p>Medio: ${medio}</p>`);
        dificil == null ?  $("main").append(`<p>Difícil: no jugado!</p>`) :  $("main").append(`<p>Difícil: ${dificil}</p>`);
       
    }

    setRecords(){
        if(this.guessCounter > localStorage.getItem(`guess-counter-${this.selectedDifficultyName}`))
            localStorage.setItem(`guess-counter-${this.selectedDifficultyName}`, this.guessCounter);
        
        $("main").append(`<h3>¡Has jugado en modo ${this.selectedDifficultyName}!</h3>`)
        $("main").append(`<h3>Número de aciertos esta ronda: ${this.guessCounter}</h3>`)
    }

    iniciarJuego(){
        this.seleccionarEquipo();
        this.agregarPilotosYEquipos();
        if(this.start)
            this.crearListeners();
    }

    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min);
    }


    seleccionarEquipo(){
        var rand = this.getRandomInt(0, this.pilotos.length);
        this.equipoSeleccionado = this.pilotos[rand].equipo;
    }

    agregarPilotosYEquipos(){

        // Asegurar que hay un piloto del equipo seleccionado
        var pilotosDelEquipo = this.pilotos.filter(pilot => pilot.equipo === this.equipoSeleccionado);
        var rand = this.getRandomInt(0, pilotosDelEquipo.length);
        var pilotoSeleccionado = pilotosDelEquipo[rand];
        this.pilotosSeleccionados.set(pilotoSeleccionado.piloto, pilotoSeleccionado.equipo);
        while(this.pilotosSeleccionados.size < this.selectedDifficulty){
            var i = this.getRandomInt(0, this.pilotos.length);
            var piloto = this.pilotos[i].piloto;
            var equipo = this.pilotos[i].equipo;
            
            if(!Array.from(this.pilotosSeleccionados.values()).includes(equipo) && 
                !this.pilotosSeleccionados.has(piloto)){

                this.pilotosSeleccionados.set(piloto, equipo);
            }
        }
        
        const shuffledPilotos = Array.from(this.pilotosSeleccionados.entries())
        .sort(() => Math.random() - 0.5);

        this.pilotosSeleccionados.clear();
        shuffledPilotos.forEach(([piloto, equipo]) => {
            this.pilotosSeleccionados.set(piloto, equipo);
        });

        this.pilotosSeleccionados.forEach((equipo, piloto)=> {
            var article = document.createElement("article");
            article.setAttribute("draggable", "true");
            article.setAttribute("data-piloto", piloto);
            article.setAttribute("data-equipo", equipo);
            var img = document.createElement("img");
            img.setAttribute("src", `multimedia/imagenes/${piloto.toLowerCase()}.png`);
            img.setAttribute("alt", `Imagen de ${piloto}`);
            article.appendChild(img);
            $("section:first-of-type").append(article);
        })

        var articleEquipo = document.createElement("article");
        articleEquipo.setAttribute("data-equipo", this.equipoSeleccionado);
        var img = document.createElement("img");
        img.setAttribute("src", `multimedia/imagenes/${this.equipoSeleccionado.toLowerCase()}.svg`); 
        img.setAttribute("alt", `Imagen de ${this.equipoSeleccionado}`);
        articleEquipo.appendChild(img);
        $("section:nth-of-type(2)").append(articleEquipo);
    }

    crearListeners(){
        const pilotoArticles = document.querySelectorAll("section:first-of-type article");
        const equipoArticles = document.querySelectorAll("section:nth-of-type(2) article");

        let draggedPiloto = null;
        let dragData = null;

        // Para escritorio
        pilotoArticles.forEach(piloto => {
            piloto.setAttribute('draggable', 'true');

            piloto.addEventListener('dragstart', (event) => {
                draggedPiloto = piloto;
                dragData = {
                    piloto: piloto.getAttribute('data-piloto'),
                    equipo: piloto.getAttribute('data-equipo')
                };
                event.dataTransfer.setData('text/plain', JSON.stringify(dragData));
            });
        });

        equipoArticles.forEach(equipo => {
            equipo.addEventListener('dragover', (event) => {
                event.preventDefault();
            });

            equipo.addEventListener('drop', (event) => {
                event.preventDefault();
                this.handleDrop(event, equipo, dragData);
            });
        });

        // Para dispositivos móbiles
        pilotoArticles.forEach(piloto => {
            var startX, startY, isDragging = false;

            piloto.addEventListener('touchstart', (event) => {
                event.preventDefault();

                const touch = event.touches[0];
                startX = touch.clientX - piloto.offsetLeft;
                startY = touch.clientY - piloto.offsetTop;

                isDragging = true;
                draggedPiloto = piloto;
                dragData = {
                    piloto: piloto.getAttribute('data-piloto'),
                    equipo: piloto.getAttribute('data-equipo')
                };

            });

            piloto.addEventListener('touchend', (event) => {
                event.preventDefault();

                isDragging = false;

                const touch = event.changedTouches[0];
                const dropTarget = document.elementFromPoint(touch.clientX, touch.clientY);
                const teamTarget = dropTarget.closest('section:nth-of-type(2) article');

                if (teamTarget) {
                    this.handleDrop(event, teamTarget, dragData);
                }
            });
        });

        document.addEventListener('touchmove', (event) => {
            if (event.target.closest('article')) {
                event.preventDefault();
            }
        });
    }

    handleDrop(event, targetTeam, dragData) {
        const data = event.dataTransfer
                ? JSON.parse(event.dataTransfer.getData('text/plain'))
                : dragData;

            const teamData = targetTeam.getAttribute('data-equipo');

            if (data.equipo === teamData && this.minutes < 1) {
                this.nextRound();
            }
    }

    nextRound(){
        this.guessCounter++;
        $("article").remove();
        this.pilotosSeleccionados = new Map();
        this.equipoSeleccionado = null;
        this.iniciarJuego();
    }

    // Cronómetro
    initializeWebWorker(){
        this.crearListeners();
        this.start = true;
        this.elapsedTime = 0;
        this.timerElement.textContent = "00:00";
        const workerCode = `
            let intervalId = null;

            onmessage = function (event) {
                const { command, interval } = event.data;

                if (command === "start") {
                    if (intervalId) clearInterval(intervalId); // Reset any existing timer
                    startTime = Date.now();
                    intervalId = setInterval(() => {
                        postMessage({ type: "tick", elapsedTime: Date.now() - startTime }); // Notify the main thread on every tick
                    }, interval);
                } else if (command === "stop") {
                    if (intervalId) {
                        clearInterval(intervalId);
                        intervalId = null;
                    }
                } else if (command === "reset") {
                    if (intervalId) clearInterval(intervalId);
                    postMessage({ type: "reset" }); // Notify main thread of reset
                }
            };
        `;

        // Create a Blob URL for the worker code
        const blob = new Blob([workerCode], { type: "application/javascript" });
        const blobURL = URL.createObjectURL(blob);

        this.worker = new Worker(blobURL);
        this.worker.onmessage = (event) => {
            const { type, elapsedTime } = event.data;
            if (type === "tick") {
                this.elapsedTime = elapsedTime;
                this.updateTimer();
            } else if (type === "reset") {
                this.elapsedTime = 0;
                this.updateTimer();
            }
        };
        this.startTimer(1000);
    }
    startTimer(interval){
        if (!this.worker) {
            return;
        }
        this.interval = interval;
        this.elapsedTime = 0;
        this.worker.postMessage({ command: "start", interval: this.interval });
        this.isRunning = true;
    }

    stopTimer(){
        if (this.worker) {
            this.worker.postMessage({ command: "stop" });
            this.isRunning = false;
            this.setRecords();
        }
    }

    reset() {
        if (this.worker) {
            this.worker.postMessage({ command: "reset" });
            this.elapsedTime = 0;
            this.updateTimer();
            this.isRunning = false;
        }
    }

    terminate() {
        if (this.worker) {
            this.worker.terminate();
            this.worker = null;
            this.isRunning = false;
        }
    }

    updateTimer() {
        if(this.timerElement) {
            this.timerElement.textContent = this.formatTime(this.elapsedTime);
        }
         if(this.minutes == 1)
            this.stopTimer();
    }

    formatTime(elapsedTime) {
        var totalSeconds = Math.floor(elapsedTime / 1000); // está en milisegundos
        this.minutes = Math.floor(totalSeconds / 60) % 60;
        this.seconds = totalSeconds % 60;
        var minutesString = this.minutes.toString();
        var secondsString = this.seconds.toString();
        if(this.minutes < 10){
            minutesString = `0${this.minutes}`;
        }
        if(this.seconds < 10) {
            secondsString = `0${this.seconds}`;
        }
        return `${minutesString}:${secondsString}`;
    }
}

var api = new Api();