<?php
class Record {
    public $server;
    public $user;
    public $pass;
    public $dbname;

    public function __construct() {
        $this->server = "localhost";
        $this->user = "DBUSER2024";
        $this->pass = "DBPSWD2024";
        $this->dbname = "records";
    }
}
?>
<!DOCTYPE HTML>

<html lang="es">
<head>
    <!-- Datos que describen el documento -->
    <meta charset="UTF-8" />
	<meta name ="author" content ="Pelayo Sierra Lobo" />
	<meta name ="description" content ="Juegos de F1" />
	<meta name ="keywords" content ="F1, F1 Desktop" />
    <meta name ="viewport" content ="width=device-width, initial-scale=1.0" />
	<title>F1Desktop: Juegos</title>
	<link rel="stylesheet" type="text/css" href="estilo/estilo.css" />
	<link rel="stylesheet" type="text/css" href="estilo/layout.css" />
    <link rel="stylesheet" type="text/css" href="estilo/semaforo_grid.css" />
	<link rel=icon href=multimedia/imagenes/favicon.ico sizes="16x16" type="image/vnd.microsoft.icon">
	<script 
		src="https://code.jquery.com/jquery-3.7.1.min.js" 
		integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" 
		crossorigin="anonymous">
	</script>
</head>
<body>
    <!-- Datos con los contenidos que aparece en el navegador -->
    <header>
		<h1><a href = "index.html" title = "F1 Desktop: Inicio">F1 Desktop</a></h1>
		<nav>
			<a href = "index.html" title = "F1 Desktop: Inicio">Inicio</a>
			<a href = "piloto.html" title = "F1 Desktop: Piloto">Piloto</a>
			<a href = "noticias.html" title = "F1 Desktop: Noticias">Noticias</a>
			<a href = "calendario.html" title = "F1 Desktop: Calendario">Calendario</a>
			<a href = "meteorologia.html" title = "F1 Desktop: Meteorología">Meteorología</a>
			<a href = "circuito.html" title = "F1 Desktop: Circuito">Circuito</a>
			<a href = "viajes.html" title = "F1 Desktop: Viajes">Viajes</a>
			<a href = "juegos.html" class="active" title = "F1 Desktop: Juegos">Juegos</a>
            
		</nav>
	</header>
    <p>Estás en: <a href="index.html">Inicio</a> | <a href="juegos.html">Juegos</a> | Semáforo</p>
	<main>
	</main>
    <script defer src="js/semaforo.js"></script>
</body>
</html>