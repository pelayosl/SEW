<?php
class Record {
    private $server;
    private $user;
    private $pass;
    private $dbname;

	private $db;

	private $nivel;

    public function __construct() {
        $this->server = "localhost";
        $this->user = "DBUSER2024";
        $this->pass = "DBPSWD2024";
        $this->dbname = "records";
		$this->db = new mysqli($this->server, $this->user, $this->pass, $this->dbname);
		$this->submit();
    }
	public function submit() {
		if (count($_POST)>0) {
			$nombre = $_POST['nombre'];
            $apellidos = $_POST['apellidos'];
            $this->nivel = $this->nivel = $_POST["difficulty"];
            $tiempo = $_POST['tiempo_reaccion'];

			// comprueba la conexion
			if($this->db->connect_error) {
				exit ("<h3>ERROR de conexión:".$this->db->connect_error."</h3>");
			}

			$stmt = $this->db->prepare("INSERT INTO registro (nombre, apellidos, nivel, tiempo) VALUES (?, ?, ?, ?)");
            $stmt->bind_param("ssii", $nombre, $apellidos, $this->nivel, $tiempo);

			$stmt->execute();

			$stmt->close();
		}
	}
	public function saveRecord() {
		if ($this->nivel != null){			
			
			$stmt_top10 = $this->db->prepare("SELECT nombre, apellidos, tiempo 
                                    FROM registro 
                                    WHERE nivel = ? 
                                    ORDER BY tiempo ASC 
                                    LIMIT 10");
			$stmt_top10->bind_param("i", $this->nivel);
			$stmt_top10->execute();
			$result = $stmt_top10->get_result();
			if ($result->num_rows > 0) {
				echo "<h3>Top 10 mejores tiempos para nivel  ".$this->nivel."</h3>";
                    $html_ol = "<ol>";
                    while ($row = $result->fetch_assoc()) {
                        $html_row = "<li>".$row["nombre"]." ".$row["apellidos"].": ".($row["tiempo"]/1000)." s"."</li>";
                        $html_ol .= $html_row;
                    }
                    $html_ol .= "</ol>";
                    echo $html_ol;
			}
			
		}
		$this->db->close();
	}
	
}
$record = new Record();

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
			<a href = "viajes.php" title = "F1 Desktop: Viajes">Viajes</a>
			<a href = "juegos.html" class="active" title = "F1 Desktop: Juegos">Juegos</a>
            
		</nav>
	</header>
    <p>Estás en: <a href="index.html">Inicio</a> | <a href="juegos.html">Juegos</a> | Semáforo</p>
	<section>
			<h2>Menú de Juegos</h2>
            <nav>
                <a href="memoria.html" title="Accede a juego de memoria">Juego de memoria</a>
				<a href="semaforo.php" title="Accede a juego del semáforo">Juego del semáforo</a>
				<a href="api.html" title="Accede a juego de pilotos de F1">Juego de pilotos</a>
				<a href="php/ranking.php" title="Accede al ranking de pilotos de F1">Ranking de pilotos</a>
            </nav>
        </section>
	<main>
		
	</main>
	<aside><?php $record->saveRecord(); ?></aside>
    <script defer src="js/semaforo.js"></script>
</body>
</html>