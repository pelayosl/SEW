
<?php

class Ranking{
	
	private $server;
    private $user;
    private $pass;
    private $dbname;

	private $db;

	public function __construct(){
		$this->server = 'localhost';
		$this->user = 'DBUSER2024';
		$this->pass = 'DBPSWD2024';
		$this->dbname = 'ranking_pilotos';

		$this->db = new mysqli($this->server, $this->user, $this->pass, $this->dbname);
           
        if ($this->db->connect_error){
            exit("<h2>ERROR conexión: ".$this->db->connect_error."</h2>");
        }

		$this->loadData();
	}

	public function checkUserInput(){
		if (count($_POST) != 0) {
			$result = null;

			if(isset($_POST["import"])){
				$result = $this->importCSV();
			}
				
			else if(isset($_POST["export"]))
				$result = $this->exportCSV();

			if (!$result['success'] && $result!=null) {
				echo '<h2>'.$result['message'].'<h2>';
			}
		}
	}
	public function loadData(){
		$this->deleteTables();
		$this->createTables();
		$this->db->close();
	}

	private function deleteTables(){
		$deleteQueries = [
			"DROP TABLE IF EXISTS RESULTADOS;",
			"DROP TABLE IF EXISTS CLASIFICACIONES;",
			"DROP TABLE IF EXISTS PILOTOS;",
			"DROP TABLE IF EXISTS CARRERAS;",
			"DROP TABLE IF EXISTS CIRCUITOS;"
			
		];
		for($i = 0; $i < 5; $i++){
			if(!$this->db->query($deleteQueries[$i]))
				echo "<p>No se ha podido eliminar la tabla 'persona'. Error: " . $this->db->error . "</p>";
		}
	}

	private function createTables(){
		$this->db->autocommit(false);
		$sqlFile = file_get_contents("ranking_pilotos.sql");
		$sqlQueries = explode(';', $sqlFile);
		try{
			foreach ($sqlQueries as $query){
				$query = trim($query);
        
				if (!empty($query)) {
					$this->db->query($query);
				}
			}
			$this->db->commit();
		}
		catch(Exception $e){
			$this->db->rollback();
			exit("ERROR INSERTANDO TABLAS=".$e->getMessage());
		}
		
	}

	public function importCSV(){
		$this->db = new mysqli($this->server, $this->user, $this->pass, $this->dbname);
           
        if ($this->db->connect_error){
            exit("<h2>ERROR conexión: ".$this->db->connect_error."</h2>");
        }
		$csv = $_FILES['csv'];

		if(!$csv["type"] === ".csv") {
			return [ 
				'success' => false, 
				'message' => 'ALERTA: Sólo se permiten ficheros de tipo .csv' 
			]; 
		} 

		$csvFile = fopen($csv['tmp_name'], 'r');

		if(!$csvFile)
			return [
				'success' => false,
				'message' => 'ALERTA: Error al abrir el archivo .csv'
			];

		
		fgetcsv($csvFile); // me salto la cabecera
		// while(($getCSV = fgetcsv($csvFile)) !== false){
		// 	$id_resultado = $getCSV[0];
		// 	$id_carrera = $getCSV[1];
		// 	$id_piloto = $getCSV[2];
		// 	$posicion = $getCSV[3];
		// 	$puntos = $getCSV[4];

		// 	$query = "INSERT INTO resultados 
		// 	(id_resultado, id_carrera, id_piloto, posicion, puntos) 
		// 	VALUES (?, ?, ?, ?, ?)";

		// 	$stmt = $this->db->prepare($query);
		// 	$stmt->bind_param("iiiii", 
		// 		$id_resultado, 
		// 		$id_carrera, 
		// 		$id_piloto, 
		// 		$posicion, 
		// 		$puntos
		// 	);

		// 	if (!$stmt->execute()) {
		// 		return [
		// 			'success' => false,
		// 			'message' => 'Error al insertar datos: ' . $stmt->error
		// 		];
		// 	}

		// 	$stmt->close();
		// }
		fclose($csvFile);
		$this->db->close();
		return [
			'success' => true,
			'message' => 'Datos importados correctamente'
		];
	}

	public function exportCSV(){
		$query = "SELECT 
               id_clasificacion, 
               id_piloto, 
               temporada, 
               puntos_totales, 
               posicion_global 
               FROM clasificaciones 
               ORDER BY temporada, posicion_global";

		$result = $this->db->query($query);

		if (!$result) {
			return [
				'success' => false,
				'message' => 'ALERTA: Ha habido un error al recuperar los datos de la tabla clasificaciones: ' . $this->db->error
			];
		}

		$filename = 'clasificaciones_F1Desktop' . '.csv';
   	 	$filepath = 'exports/' . $filename;

		header('Content-Type: text/csv');
		header('Content-Disposition: attachment; filename="' . $filename . '"');

		$output = fopen('php://output', 'w');
		fputcsv($output, ['id_clasificacion', 'id_piloto', 'temporada', 'puntos_totales', 'posicion_global']);
		
		while ($row = $result->fetch_assoc()) {
			fputcsv($output, $row);
		}
	}

	public function displayInformation(){
		$this->db = new mysqli($this->server, $this->user, $this->pass, $this->dbname);
           
        if ($this->db->connect_error){
            exit("<h2>ERROR conexión: ".$this->db->connect_error."</h2>");
        }
		$query = "SELECT id_piloto, nombre, nacionalidad, fecha_nacimiento FROM pilotos ORDER BY id_piloto ASC";
		$stmt = $this->db->prepare($query);
		$stmt->execute();

		$result = $stmt->get_result();
		if ($result->num_rows > 0){
			$list = '<ul>';

			while ($row = $result->fetch_assoc()){
				$id_piloto = $row['id_piloto'];
				$nombre = $row['nombre'];
				$nacionalidad = $row['nacionalidad'];
				$fecha_nacimiento = $row['fecha_nacimiento'];

				$list .= '<li>';
				$list .= '<strong>' . htmlspecialchars($nombre) . '</strong>';
				$list .= '<ul>';
				$list .= '<li><strong>ID:</strong> ' . htmlspecialchars($id_piloto) . '</li>';
				$list .= '<li><strong>Nacionalidad:</strong> ' . htmlspecialchars($nacionalidad) . '</li>';
				$list .= '<li><strong>Fecha de Nacimiento:</strong> ' . htmlspecialchars($fecha_nacimiento) . '</li>';
				$list .= '</ul>';
				$list .= '</li>';
			}

			$list .= '</ul>';
			echo $list;
		}
		$this->db->close();
	}
}

$ranking = new Ranking();
$ranking->checkUserInput();
?>
<!DOCTYPE HTML>

<html lang="es">
<head>
    <!-- Datos que describen el documento -->
    <meta charset="UTF-8" />
	<meta name ="author" content ="Pelayo Sierra Lobo" />
	<meta name ="description" content ="Ranking de pilotos de F1" />
	<meta name ="keywords" content ="F1, F1 Desktop" />
    <meta name ="viewport" content ="width=device-width, initial-scale=1.0" />
	<title>F1Desktop: Juegos</title>
	<link rel="stylesheet" type="text/css" href="../estilo/estilo.css" />
	<link rel="stylesheet" type="text/css" href="../estilo/layout.css" />
	<link rel=icon href=../multimedia/imagenes/favicon.ico sizes="16x16" type="image/vnd.microsoft.icon">
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
			<a href = "../index.html" title = "F1 Desktop: Inicio">Inicio</a>
			<a href = "../piloto.html" title = "F1 Desktop: Piloto">Piloto</a>
			<a href = "../noticias.html" title = "F1 Desktop: Noticias">Noticias</a>
			<a href = "../calendario.html" title = "F1 Desktop: Calendario">Calendario</a>
			<a href = "../meteorologia.html" title = "F1 Desktop: Meteorología">Meteorología</a>
			<a href = "../circuito.html" title = "F1 Desktop: Circuito">Circuito</a>
			<a href = "../viajes.php" title = "F1 Desktop: Viajes">Viajes</a>
			<a href = "../juegos.html" class="active" title = "F1 Desktop: Juegos">Juegos</a>
            
		</nav>
	</header>
    <p>Estás en: <a href="../index.html">Inicio</a> | <a href="juegos.html">Juegos</a> | Ranking</p>
	<main>
		<h2>Ranking de pilotos</h2>
		<form action="#" method="POST" enctype="multipart/form-data">
                <label>
                    Insertar datos (csv): 
                    <input type="file" name="csv" required>
                </label>
                <input type="submit" name="import" value="Insertar datos">
        </form>
		<?php $ranking->displayInformation() ?>
	</main>
</body>
</html>