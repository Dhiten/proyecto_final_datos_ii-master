const config = {
    width: 930,
    height: 800,
    parent: "container",
    type: Phaser.AUTO,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

function preload() {

    this.load.image("Auditorio", "./assets/Auditorio.jpg");
    this.load.image("Bambú", "./assets/Bambu.jpg");
    this.load.image("Biblioteca", "./assets/Biblioteca.jpg");
    this.load.image("Bloque G", "./assets/Bloque_G.jpg");
    this.load.image("Bloque I", "./assets/Bloque_I.jpeg");
    this.load.image("Bloque K", "./assets/Bloque_K.jpeg");
    this.load.image("Bloque L", "./assets/Bloque_L.jpg");
    this.load.image("Café du nord", "./assets/Cafe_du_nord.jpg");
    this.load.image("Camión", "./assets/Camion.jpg");
    this.load.image("Cancha de futbol", "./assets/Cancha_de_futbol.jpg");
    this.load.image("Casa blanca", "./assets/Casa_blanca.jpg");
    this.load.image("Centro médico", "./assets/Centro_medico.jpeg");
    this.load.image("Coliseo", "./assets/Coliseo.jpeg");
    this.load.image("Consultorio jurídico", "./assets/Consultorio_juridico.jpeg");
    this.load.image("CREE", "./assets/CREE.jpg");
    this.load.image("du nord express", "./assets/du_nord_express.jpeg");
    this.load.image("du nord plaza", "./assets/du_nord_plaza.jpg");
    this.load.image("Entrada", "./assets/Entrada.jpg");
    this.load.image("Fuente", "./assets/Fuente.jpg");
    this.load.image("Graphique", "./assets/Graphique.jpg");
    this.load.image("Hospital", "./assets/Hospital.jpeg");
    this.load.image("Km5", "./assets/Km5.jpg");
    this.load.image("Laboratrio CEDU", "./assets/Laboratorio_CEDU.jpeg");
    this.load.image("Laboratorio de ciencias de la computación", "./assets/Laboratorio_de_ciencias_de_la_computacion.jpg");
    this.load.image("Laboratorio diseno digital y fotografía", "./assets/Laboratorio_diseno_digital_y_fotografia.jpeg");
    this.load.image("Le petit", "./assets/Le_petit.png");
    this.load.image("Parqueadero", "./assets/Parqueadero.jpeg");
    this.load.image("Restaurante 1966", "./assets/Restaurante_1966.jpeg");
    this.load.image("Sala de estudio biblioteca", "./assets/Sala_de_estudio_biblioteca.jpeg");
    this.load.image("Salas de doctorado edificio de ingenierierias", "./assets/Salas_de_doctorado_edificio_de_ingenierierias.jpeg");
    this.load.image("Salones magistrales edificio de ingenierias", "./assets/Salones_magistrales_edificio_de_ingenierias.jpeg");
    this.load.image("Terrasse", "./assets/Terrasse.jpeg");
}

var algo;
var num_jugador;
var valor;
var turn = false;
function create() {
    this.socket = io();
    
    this.socket.on('player-number', function (msg) {
        $('#numero').text("Jugador " + msg);
        num_jugador = msg;
    });
    this.cameras.main.backgroundColor.setTo(125, 132, 137); 
    algo = this;
    var names = ["Auditorio", "Bambú", "Biblioteca", "Bloque G", "Bloque I", "Bloque K", "Bloque L", "Café du nord",
        "Camión", "Cancha de futbol", "Casa blanca", "Centro médico", "Coliseo", "Consultorio jurídico", "CREE", "du nord express",
        "du nord plaza", "Entrada", "Fuente", "Graphique", "Hospital", "Km5", "Laboratrio CEDU", "Laboratorio de c. de la comp.",
        "Laboratorio d. digital y fotografía", "Le petit", "Parqueadero", "Restaurante 1966", "Sala de estudio", "Salas de doctorado",
        "Salones magistrales ", "Terrasse"]

    var incx = 120;
    var incy = 120;
    valor = Math.floor(Math.random() * (20 - 0)) + 0;
    var contador = 0;

    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 5; j++) {
            var photo = this.add.sprite(incx, incy, names[contador]);
            photo.setScale(0.3);
            photo.setInteractive();
            photo.data = contador;
            if (contador == valor) {
                photo.date = 1;
            } else {
                photo.date = 0;
            }
            
            
            this.add.text(incx - 75, incy + 75, names[contador], { fontSize: '14px', fill: '#ffffff' });
            contador++;
            incx = incx + 180;
        }
        incy = incy + 180;
        incx = 120;
       
    }
    
    

    this.input.on('gameobjectdown', onObjectClicked);
    this.add.text(10, 10, "Lugar: " + names[valor], { fontSize: '22px', fill: '#ffffff' });
    //scoreText = this.add.text(600, 50, 'Adivina\n el lugar \nde la U', { fontSize: '32px', fill: '#1F59C4' });

    $('#formulario').hide();
$('#container').hide();
$('#messages').hide();
$('#ganador').hide();


    var nick;
    

    $('#nom').submit(function (e) {

        $('#nom').hide();
        $('#ingrese').hide();
        $('#formulario').show();
        $('#container').show();
        $('#messages').show();

        return false;
    });

    $('#formulario').submit(function (e) {
        e.preventDefault(); // prevents page reloading
        algo.socket.emit('chat message', { men: $('#m').val(), nickname: $('#nic').val() });
        $('#m').val('');

        return false;
    });

    algo.socket.on('chat message', function (msg) {
        $('#messages').append('<li><strong>' + msg.nickname + '</strong>' + '   ' + msg.men + '</li>');
    });

    algo.socket.on('player-number2', function (msg) {
        $('#num_ju').text("   jugador "+msg);
        algo.socket.emit('lugar', {jugador: msg, lugar: valor});
    });

    algo.socket.on('ganador', function (msg) {
        $('#nom').hide();
        $('#ingrese').hide();
        $('#formulario').hide();
        $('#container').hide();
        $('#messages').hide();
        $('#num_ju').hide();
        $('#ganador').show();
        $('#ganador').text("Ha ganado el jugador "+msg);
    });

    algo.socket.on('actualizar_turno', function (msg) {
        if(msg == num_jugador){
            $('#tu_turno').hide();
            turn = false;
        }else {
            $('#tu_turno').show();
            turn = true;
        }
    });
    

}




function onObjectClicked(pointer, gameObject) {
    if(turn == true) {
        algo.socket.emit('click', {jugador: num_jugador, data:gameObject.data} );
        if(gameObject.date == 1 ) {
            console.log("click");      
        }
    
        gameObject.alpha = 0.3;
        gameObject.scale = 0.2;
    }

}

function update(time, delta) {
    // if (game.input.mousePointer.isDown) {
    //    console.log(game.input.mousePointer.x);
    //   console.log("creo que clic");
    // }

}


