class Semaforo {
    
    constructor(){
        this.levels = [0.2, 0.5, 0.8];
        this.lights = 4;
        this.date = null;
        this.unload_moment = null;
        this.clic_moment = null;
        this.difficulty = this.getRandomInt(0,3);
        this.createStructure();
    }

    getRandomInt(min, max) {
        return Math.random() * (max - min) + min;
    }

    createStructure(){
        const main = document.querySelector('main');
        const heading = document.createElement('h2');
        heading.textContent = 'Semáforo';
        main.appendChild(heading);

        for(let i = 0; i < this.lights; i++){
            const div = document.createElement('div');
            main.appendChild(div);
            
        }
        const arrancar = document.createElement('button');
        arrancar.textContent = "Arranque";
        arrancar.onclick = () => {
            this.initSequence(arrancar, parar);
        }
        const parar = document.createElement('button');
        parar.textContent = "Reacción";
        parar.onclick = () => {
            this.stopReaction(parar, arrancar);
        }
        main.appendChild(arrancar);
        main.appendChild(parar);
        
    }

    initSequence(arrancar, parar) {
        const main = document.querySelector('main');
        main.classList.add('load');
        arrancar.disabled = true;
        parar.disabled = false;
        setTimeout(() => {
            this.unload_moment = new Date();
            this.endSequence();
        }, this.getRandomInt(3000, 2000+(this.difficulty*100)));
    }

    endSequence() {
        const main = document.querySelector('main');
        main.classList.remove('load');
        main.classList.add('unload');
    }

    stopReaction(parar, arrancar) {
        
        const main = document.querySelector('main');
        this.clic_moment = new Date();
        let millis = this.clic_moment.getTime() - this.unload_moment.getTime();
        const p = document.createElement('p');
        p.textContent = `Tiempo de reacción: ${millis} milisegundos!`;
        main.appendChild(p);
        main.classList.remove('unload');
        parar.disabled = true;
        arrancar.disabled = false;
    }
}

const semaforo = new Semaforo();