class Voiture {
    // constructeur de la classe
    constructor(directionD) {
        // la direction (gauche ou droite)
        this.direction = directionD;
        this.dejaDeplacer = false;
    }

    // getter setter 
    get Direction() {
        return this.direction;
    }
    set DejaDeplacer(d) {
        this.dejaDeplacer = d
    }
    get DejaDeplacer() {
        return this.dejaDeplacer;
    }
}

class Joueur {
    // constructeur du joueur avec ca 
    constructor(pX, pY) {
        this.x = pX;
        this.y = pY;
    }

    // getter setter des cordonnéee
    set X(xD) {
        this.x = xD;
    }
    set Y(yD) {
        this.y = yD;
    }

    get X() {
        return this.x;
    }
    get Y() {
        return this.y;
    }
}

class jeu {
    // constructeur
    constructor() {
        // initialisation des éléments
        this.fini = false; // <-- si la partie est fini
        this.cases = [
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0]
        ]; // <-- le terrain de jeu

        this.JoueurA = new Joueur(this.cases.length - 1, this.cases[this.cases.length - 1].length - 2); // creations du joueur, on lui passe ca position (en bas a droite)
        this.cases[this.JoueurA.X][this.JoueurA.Y] = this.JoueurA; // <-- on met la position sur le terrain
        this.interval;// <-- on fais l'intervalle (afin de pouvoir le réinitialiser)
        this.tempInterval = 750; // <-- 
        this.apparationVoiture();
        this.affichage();
    }

    restart(){
        document.getElementById(`titre`).innerHTML = "Crossy Frog";
        document.getElementById(`announce`).innerHTML = ``;
        this.fini = false;
        this.cases = [
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0]
        ];

        this.JoueurA = new Joueur(this.cases.length - 1, this.cases[this.cases.length - 1].length - 2);
        this.cases[this.JoueurA.X][this.JoueurA.Y] = this.JoueurA;
        this.interval;
        this.tempInterval = 750;
        this.apparationVoiture();
        this.affichage();
        this.start();
    }

    start() {
        this.interval = setInterval(() => {
            this.deplacementVoiture();
        }, this.tempInterval);
        this.affichage();
    }

    affichage() {
        let playground = document.getElementById(`playground`);
        playground.innerHTML = "";
        // affichage de la place de jeu
        this.cases.forEach(row => {
            // Parcourir chaque case de la ligne
            row.forEach(cell => {
                let dice = Math.floor(Math.random() * 2) + 1;
                const div = document.createElement('div'); // Créer un div
                div.classList.add('cell'); // Ajouter la classe "cell"

                div.innerHTML = ``;
                if (cell === this.JoueurA) {
                    div.classList.add('active'); // Ajouter une classe "active" si la valeur est 1
                    div.innerHTML = '🐸';
                } else if (cell instanceof Voiture) {
                    div.classList.add('ennemi')
                    div.innerHTML = '🚗';
                }
                playground.appendChild(div); // Ajouter le div au playground
            });
        });
    }

    // fais apparaître les voitures 
    apparationVoiture() {
        // pour chaque collone
        this.cases.forEach((row, rowIndex) => {
            if (rowIndex === this.cases.length - 1) { // <- appart pour la dernière
                return;
            }

            // lance un dé
            const D = Math.random();
            // sois les voiture apparaisse à droite ou à gauche
            if (D < 0.5) {
                if (D < 0.25) {
                    row[1] = new Voiture("d");
                } else {
                    row[0] = new Voiture("d");
                }
            } else {
                if (D > 0.75) {
                    row[row.length - 1] = new Voiture("g");
                } else {
                    row[row.length - 2] = new Voiture("g");
                }
            }
        });
    }

    // fais le déplacement des voitures (de droite et de gauche)
    deplacementVoiture() {

        // Parcours de chaque ligne de la grille
        this.cases.forEach((row, rowIndex) => {
            // Parcours de chaque case dans la ligne
            row.forEach((cell, colIndex) => {

                // Si la case contient une voiture
                if (cell instanceof Voiture && cell.DejaDeplacer === false) {

                    // Si la voiture se déplace vers la droite
                    if (cell.Direction === "d") {
                        if (colIndex + 1 < row.length) {
                            // Déplacement vers la droite sans sortir de la grille
                            this.loseCondition("voiture", rowIndex, colIndex + 1);

                            this.cases[rowIndex][colIndex] = 0; // Effacer la position actuelle
                            this.cases[rowIndex][colIndex + 1] = cell; // Placer la voiture à droite
                        } else {
                            // Si la voiture sort à droite, on la replace à gauche
                            this.loseCondition("voiture", rowIndex, 0);

                            this.cases[rowIndex][colIndex] = 0; // Effacer la position actuelle
                            this.cases[rowIndex][0] = cell; // Placer la voiture à la première case à gauche
                        }
                    }

                    // Si la voiture se déplace vers la gauche
                    if (cell.Direction === "g") {
                        if (colIndex - 1 >= 0) {
                            // Déplacement vers la gauche sans sortir de la grille
                            this.loseCondition("voiture", rowIndex, colIndex - 1);

                            this.cases[rowIndex][colIndex] = 0; // Effacer la position actuelle
                            this.cases[rowIndex][colIndex - 1] = cell; // Placer la voiture à gauche
                        } else {
                            // Si la voiture sort à gauche, on la replace à droite
                            this.loseCondition("voiture", rowIndex, row.length - 1);

                            this.cases[rowIndex][colIndex] = 0; // Effacer la position actuelle
                            this.cases[rowIndex][row.length - 1] = cell; // Placer la voiture à la dernière case à droite
                        }
                    }
                    cell.DejaDeplacer = true;
                }
            });
            row.forEach((cell, colIndex) => {
                if (cell instanceof Voiture) {
                    cell.DejaDeplacer = false;
                }
            });
        });
        this.affichage();
    }

    // gère les déplacement du joueur
    deplacement(direction) {
        if (this.fini) {
            this.restart();
        }
        // JAI MAL GERRER LES CONTRLES SONT INVERSER (deja fixé)
        this.cases[this.JoueurA.X][this.JoueurA.Y] = 0;

        switch (direction) {
            case "Up":
                if ((this.JoueurA.X - 1) >= 0) {
                    this.loseCondition("joueur", this.JoueurA.X - 1, this.JoueurA.Y)
                    this.JoueurA.X--;
                }
                break;
            case "Down":
                if ((this.JoueurA.X + 1) < this.cases.length) {
                    this.loseCondition("joueur", this.JoueurA.X + 1, this.JoueurA.Y)
                    this.JoueurA.X++;
                }
                break;
            case "Right":
                if ((this.JoueurA.Y + 1) < this.cases[0].length) { // inverser 
                    this.loseCondition("joueur", this.JoueurA.X, this.JoueurA.Y + 1)
                    this.JoueurA.Y++;
                }
                break;
            case "Left":
                if ((this.JoueurA.Y - 1) >= 0) {
                    this.loseCondition("joueur", this.JoueurA.X, this.JoueurA.Y - 1)
                    this.JoueurA.Y--;
                }
                break;
            default:
                console.log(`??? : ${direction}`);
                break;
        }

        this.cases[this.JoueurA.X][this.JoueurA.Y] = this.JoueurA;
        this.affichage();

        this.winCondition();
    }

    // vas vérifier sur le joueur a gagner
    winCondition() {
        if (this.JoueurA.X == 0) {
            this.fin(`gagné`);
        }
    }

    loseCondition(demande, PositionX, PositionY) {
        if (demande == "joueur") {
            if (this.cases[PositionX][PositionY] instanceof Voiture) {
                this.fin(`Perdu`);
            }
        } else {
            if (this.cases[PositionX][PositionY] == this.JoueurA) {
                this.fin(`Perdu`);
            }
        }

    }

    // récupère un message et l'affiche, signale la fin au joueur
    fin(message) {
        this.fini = true;
        clearInterval(this.interval);
        document.getElementById(`titre`).innerHTML = message;
        document.getElementById(`announce`).innerHTML = `cliquer pour recommencer`;
    }
}

// initialisation du jeu
let partie = new jeu();
partie.start();

// gère le déplacement
up.addEventListener("click", () => {
    partie.deplacement("Up");
});
down.addEventListener("click", () => {
    partie.deplacement("Down");
});
left.addEventListener("click", () => {
    partie.deplacement("Left");
});
right.addEventListener("click", () => {
    partie.deplacement("Right");
});