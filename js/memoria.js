class Memoria {
    constructor() {
        
        this.elements = [
            {
                "element": "RedBull",
                "source": "https://upload.wikimedia.org/wikipedia/de/c/c4/Red_Bull_Racing_logo.svg"
            },
            {
                "element": "RedBull",
                "source": "https://upload.wikimedia.org/wikipedia/de/c/c4/Red_Bull_Racing_logo.svg"
            },
            {
                "element": "McLaren",
                "source": "https://upload.wikimedia.org/wikipedia/en/6/66/McLaren_Racing_logo.svg"
            },
            {
                "element": "McLaren",
                "source": "https://upload.wikimedia.org/wikipedia/en/6/66/McLaren_Racing_logo.svg"
            },
            {
                "element": "Alpine",
                "source": "https://upload.wikimedia.org/wikipedia/fr/b/b7/Alpine_F1_Team_2021_Logo.svg"
            },
            {
                "element": "Alpine",
                "source": "https://upload.wikimedia.org/wikipedia/fr/b/b7/Alpine_F1_Team_2021_Logo.svg"
            },
            {
                "element": "AstonMartin",
                "source": "https://upload.wikimedia.org/wikipedia/fr/7/72/Aston_Martin_Aramco_Cognizant_F1.svg"
            },
            {
                "element": "AstonMartin",
                "source": "https://upload.wikimedia.org/wikipedia/fr/7/72/Aston_Martin_Aramco_Cognizant_F1.svg"
            },
            {
                "element": "Ferrari",
                "source": "https://upload.wikimedia.org/wikipedia/de/c/c0/Scuderia_Ferrari_Logo.svg"
            },
            {
                "element": "Ferrari",
                "source": "https://upload.wikimedia.org/wikipedia/de/c/c0/Scuderia_Ferrari_Logo.svg"
            },
            {
                "element": "Mercedes",
                "source": "https://upload.wikimedia.org/wikipedia/commons/f/fb/Mercedes_AMG_Petronas_F1_Logo.svg"
            },
            {
                "element": "Mercedes",
                "source": "https://upload.wikimedia.org/wikipedia/commons/f/fb/Mercedes_AMG_Petronas_F1_Logo.svg"
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
        }, 1000);
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
        }, 1000);
    }

    createElements() {

        var section = document.getElementsByTagName('section')[0];

        for(var i = 0 ; i < this.elements.length ; i++) {

            var article = document.createElement('article');
            article.setAttribute('data-element', this.elements[i].element);

            var heading = document.createElement('h3');
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
        Si fallas, ambas cartas se volverán a ocultar.
        Encuentra todas las parejas para terminar el juego.`;
        // Get the first article element
        const section = main.querySelector('section');

        // Insert the <p> before the first <article>, if it exists
        main.insertBefore(p, section);
    }

}

const memoria = new Memoria();


