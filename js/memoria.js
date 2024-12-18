class Memoria {
    constructor() {
        
        this.elements = [
            {
                "element": "RedBull",
                "source": "multimedia/imagenes/redbull.svg"
            },
            {
                "element": "RedBull",
                "source": "multimedia/imagenes/redbull.svg"
            },
            {
                "element": "McLaren",
                "source": "multimedia/imagenes/mclaren.svg"
            },
            {
                "element": "McLaren",
                "source": "multimedia/imagenes/mclaren.svg"
            },
            {
                "element": "Alpine",
                "source": "multimedia/imagenes/alpine.svg"
            },
            {
                "element": "Alpine",
                "source": "multimedia/imagenes/alpine.svg"
            },
            {
                "element": "AstonMartin",
                "source": "multimedia/imagenes/astonmartin.svg"
            },
            {
                "element": "AstonMartin",
                "source": "multimedia/imagenes/astonmartin.svg"
            },
            {
                "element": "Ferrari",
                "source": "multimedia/imagenes/ferrari.svg"
            },
            {
                "element": "Ferrari",
                "source": "multimedia/imagenes/ferrari.svg"
            },
            {
                "element": "Mercedes",
                "source": "multimedia/imagenes/mercedes.svg"
            },
            {
                "element": "Mercedes",
                "source": "multimedia/imagenes/mercedes.svg"
            },
        ];

        this.hasFlippedCard = false; // indica si ya hay una carta dada la vuelta
        this.lockBoard = false; // indica si el tablero se encuentra bloqueado
        this.firstCard = null; // indica la primera carta en darse la vuelta
        this.secondCard = null; // indica la segunda carta en darse la vuelta
        this.shuffleElements();
        this.createElements();
        this.addEventListeners();
        
    }

    shuffleElements() {
        for(var j = this.elements.length -1 ; j > 0; j--) {
            var position = this.getRandomInt(0,j+1);
            var element = this.elements[j].element
            var source = this.elements[j].source
            this.elements[j].element = this.elements[position].element;
            this.elements[j].source = this.elements[position].source;
            this.elements[position].element = element;
            this.elements[position].source = source;
        }
    }

    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min);
    }

    unflipCards() {
        this.lockBoard = true;
        setTimeout(() => {
            this.firstCard.dataset.state = 'hidden';
            this.secondCard.dataset.state = 'hidden';
            this.resetBoard();
        }, 650);
    }

    resetBoard() {
        this.firstCard = null;
        this.secondCard = null;
        this.hasFlippedCard = false;
        this.lockBoard = false;
    }

    checkForMatch() {
        this.firstCard.dataset.element == this.secondCard.dataset.element ? this.disableCards() : this.unflipCards();
    }

    disableCards() {
        this.lockBoard = true;
        setTimeout(() => {
            this.firstCard.dataset.state = 'revealed';
            this.secondCard.dataset.state = 'revealed';
            this.resetBoard();
        }, 200);
    }

    createElements() {

        var section = document.getElementsByTagName('section')[1];

        for(var i = 0 ; i < this.elements.length ; i++) {

            var article = document.createElement('article');
            article.setAttribute('data-element', this.elements[i].element);
            var heading = document.createElement('h5');
            heading.textContent = 'Tarjeta de memoria';
            
            var image = document.createElement('img');
            image.src = this.elements[i].source;
            image.alt = this.elements[i].element;

            article.appendChild(heading);
            article.appendChild(image);

            section.appendChild(article);
        }
    }

    addEventListeners() {
        var cards = document.getElementsByTagName('article');
        for(var i = 0; i < cards.length; i++) {
            cards[i].addEventListener('click', this.flipCard.bind(cards[i], this));
        }
    }

    flipCard(game) {
        if(game.lockBoard) return;
        if(this == game.firstCard) return;
        if(this.dataset.state == 'revealed') return;

        this.dataset.state = 'flip';

        if(!game.hasFlippedCard){
            game.hasFlippedCard = true;
            game.firstCard = this;
            return;
        }

        game.secondCard = this;
        game.checkForMatch();
    }

    comoJugar(){
        const main = document.getElementsByTagName('main')[0];
        let pExists = main.querySelector('p');
        if(pExists){
            main.removeChild(pExists);
            return;
        }
        let p = document.createElement('p');
        p.textContent = `\tHaz click en cada carta para desvelarla y encontrar parejas.
        Cada carta contiene una imagen del logo de un equipo de Fórmula 1.
        Si fallas, ambas cartas se volverán a ocultar.
        Encuentra todas las parejas para terminar el juego.`;
        
        const section = main.querySelector('section:nth-of-type(2)');

        main.insertBefore(p, section);
    }

}

const memoria = new Memoria();


