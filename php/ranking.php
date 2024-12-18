
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
				
			else if(isset($_POST["export"])){
				// Completely stop any further processing
				$this->exportCSV();
			}
	
			if (!$result['success'] && $result!=null) {
				echo '<h2>'.$result['message'].'<h2>';
			}
		}
	}
	public function loadData(){
		$this->checkUserInput();
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
		while(($getCSV = fgetcsv($csvFile)) !== false){
			$id_resultado = $getCSV[0];
			$id_carrera = $getCSV[1];
			$id_piloto = $getCSV[2];
			$posicion = $getCSV[3];
			$puntos = $getCSV[4];

			$query = "INSERT IGNORE  INTO resultados 
			(id_resultado, id_carrera, id_piloto, posicion, puntos) 
			VALUES (?, ?, ?, ?, ?)";

			$stmt = $this->db->prepare($query);
			$stmt->bind_param("iiiii", 
				$id_resultado, 
				$id_carrera, 
				$id_piloto, 
				$posicion, 
				$puntos
			);

			if (!$stmt->execute()) {
				return [
					'success' => false,
					'message' => 'Error al insertar datos: ' . $stmt->error
				];
			}

		 	$stmt->close();
		 }
		fclose($csvFile);
		return [
			'success' => true,
			'message' => 'Datos importados correctamente'
		];
	}

	public function exportCSV(){
		ob_clean();
		ob_end_clean();
	
		$query = "SELECT id_clasificacion, id_piloto, puntos_totales, posicion_global FROM clasificaciones ORDER BY posicion_global";
		
		$stmt = $this->db->prepare($query);
		
		if ($stmt === false) {
			return [
				'success' => false,
				'message' => 'Preparation failed: ' . $this->db->error
			];
		}
		
		$stmt->execute();
		
		$result = $stmt->get_result();
		
		if ($result === false) {
			return [
				'success' => false,
				'message' => 'ALERTA: Ha habido un error al recuperar los datos de la tabla clasificaciones: ' . $this->db->error
			];
		}
		
		$filename = 'clasificaciones_F1Desktop.csv';
	
		header('Content-Type: text/csv; charset=utf-8');
		header('Content-Disposition: attachment; filename="' . $filename . '"');
		header('Pragma: no-cache');
		header('Expires: 0');
	
		$output = fopen('php://output', 'w');
		
		fputcsv($output, ['id_clasificacion', 'id_piloto', 'puntos_totales', 'posicion_global']);
		
		while ($row = $result->fetch_assoc()) {
			fputcsv($output, $row);
		}
		
		fclose($output);
		
		exit(0);
	}

	public function displayInformation(){
		$this->db = new mysqli($this->server, $this->user, $this->pass, $this->dbname);
           
        if ($this->db->connect_error){
            exit("<h2>ERROR conexión: ".$this->db->connect_error."</h2>");
        }
		$this->displayDrivers();
		$this->displayRaces();
		$this->displayResults();
		$this->displayClassification();
		$this->db->close();
	}

	private function displayDrivers(){
		$query = "SELECT id_piloto, nombre, nacionalidad, fecha_nacimiento FROM pilotos ORDER BY id_piloto ASC";
		$stmt = $this->db->prepare($query);
		$stmt->execute();

		$result = $stmt->get_result();
		if ($result->num_rows > 0){
			
			$info = '<section><h3>Pilotos</h3>';
			while ($row = $result->fetch_assoc()){
				$list = '<article>';
				$id_piloto = $row['id_piloto'];
				$nombre = $row['nombre'];
				$nacionalidad = $row['nacionalidad'];
				$fecha_nacimiento = $row['fecha_nacimiento'];

				$list .= '<h4>' . htmlspecialchars($nombre) . '</h4>';
				$list .= '<ul>';
				$list .= '<li>ID: ' . htmlspecialchars($id_piloto) . '</li>';
				$list .= '<li>Nacionalidad: ' . htmlspecialchars($nacionalidad) . '</li>';
				$list .= '<li>Nacimiento: ' . htmlspecialchars($fecha_nacimiento) . '</li>';
				$list .= '</ul>';
				$list .= '</li></ul>';
				$list .= '</article>';
				$info .= $list;
			}
			$info .= '</section>';
			echo $info;
		}
	}

	private function displayRaces(){
		$query = 'SELECT c.id_carrera, c.nombre AS nombre_carrera, c.fecha, ci.nombre AS nombre_circuito, ci.pais 
				  FROM carreras c
				  INNER JOIN circuitos ci ON c.id_circuito = ci.id_circuito
				  ORDER BY c.id_carrera ASC';
		$stmt = $this->db->prepare($query);
		$stmt->execute();

		$result = $stmt->get_result();
		if ($result->num_rows > 0){
			
			$info = '<section><h3>Carreras</h3>';
			while ($row = $result->fetch_assoc()){
				$list = '<article>';
				$id_carrera = $row['id_carrera'];
				$nombreCarrera = $row['nombre_carrera'];
				$fecha = $row['fecha'];
				$nombreCircuito = $row['nombre_circuito'];
				$pais = $row['pais'];

				$list .= '<h4>' . htmlspecialchars($nombreCarrera) . '</h4>';
				$list .= '<ul>';
				$list .= '<li>ID: ' . htmlspecialchars($id_carrera) . '</li>';
				$list .= '<li>Fecha: ' . htmlspecialchars($fecha) . '</li>';
				$list .= '<li>Circuito: ' . htmlspecialchars($nombreCircuito) . '</li>';
				$list .= '<li>País: ' . htmlspecialchars($pais) . '</li>';
				$list .= '</ul>';
				$list .= '</li></ul>';
				$list .= '</article>';
				$info .= $list;
			}
			$info .= '</section>';
			echo $info;
		}
	}

	private function displayResults(){
		$years = 'SELECT DISTINCT(YEAR(fecha)) AS year FROM carreras';
		$races = 'SELECT DISTINCT(c.nombre) AS nombre
				  FROM carreras c
					INNER JOIN resultados r ON r.id_carrera = c.id_carrera
					WHERE YEAR(c.fecha) = ?';
		$drivers = 'SELECT p.nombre, r.posicion, r.puntos
					FROM resultados r
					INNER JOIN pilotos p ON r.id_piloto = p.id_piloto
					INNER JOIN carreras c ON r.id_carrera = c.id_carrera
					WHERE YEAR(c.fecha) = ? AND c.nombre = ?';

		$stmtYears = $this->db->prepare($years);
		$stmtYears->execute();
		$resultYears = $stmtYears->get_result();
		if ($resultYears->num_rows > 0){
			
			$info = '<section><h3>Resultados</h3>';
			$resultList = '<ul>';
			// Temporadas en la base de datos
			while ($yearRow = $resultYears->fetch_assoc()) {
				$resultList .= '<li>' . htmlspecialchars($yearRow['year']);
	
				$stmtRaces = $this->db->prepare($races);
				$stmtRaces->bind_param("s", $yearRow['year']); 
				$stmtRaces->execute();
				$resultRaces = $stmtRaces->get_result();
				// Carreras por cada temporada
				if ($resultRaces->num_rows > 0) {
					$resultList .= '<ul>';
					while ($raceRow = $resultRaces->fetch_assoc()) {
						$resultList .= '<li>' . htmlspecialchars($raceRow['nombre']);

						$stmtDrivers = $this->db->prepare( $drivers);
						$stmtDrivers->bind_param("ss", $yearRow['year'], $raceRow['nombre']);
						$stmtDrivers->execute();
						$resultDrivers = $stmtDrivers->get_result();
						// Pilotos por cada carrera
						if ($resultDrivers->num_rows > 0) {
							$resultList .= '<ul>';
							while ($driverRow = $resultDrivers->fetch_assoc()) {
								$driverName = $driverRow['nombre'];
								$driverPosition = $driverRow['posicion'];
								$driverPoints = $driverRow['puntos'];
								$resultList .= '<li>' . htmlspecialchars($driverName) .
								 ': ' . htmlspecialchars($driverPosition) .' puesto, '. htmlspecialchars($driverPoints) .' puntos</li>';
							}
							$resultList .= '</ul>';
						}
						$resultList .= '</li>';

					}
					$resultList .= '</ul>';
				}
	
				$resultList .= '</li>'; 
			}
	
			$resultList .= '</ul>'; 
			$info .= $resultList . '</section>'; 
			echo $info;
		}
	}

	private function displayClassification(){
		$query = 'SELECT p.id_piloto, p.nombre, SUM(r.puntos) AS puntos
				  FROM resultados r
					INNER JOIN carreras c ON c.id_carrera = r.id_carrera
					INNER JOIN pilotos p ON p.id_piloto = r.id_piloto
				  GROUP BY p.nombre
				  ORDER BY SUM(r.puntos) DESC';
		$stmt = $this->db->prepare($query);
		$stmt->execute();
		$posicionGlobal = 0;
		$result = $stmt->get_result();
		if ($result->num_rows > 0) {

			$info = '<section><h3>Clasificación</h3>';
			$info .= '<table>';
			$info .= '<thead>';
			$info .= '<tr>';
			$info .= '<th>Posición</th>';
			$info .= '<th>Piloto</th>';
			$info .= '<th>Puntos</th>';
			$info .= '</tr>';
			$info .= '</thead>';
			$info .= '<tbody>';
	
			$posicionGlobal = 0;

			$insertQuery = 'INSERT INTO clasificaciones (id_piloto, puntos_totales, posicion_global)
							VALUES (?, ?, ?)';
			$stmtInsert = $this->db->prepare($insertQuery);

			while ($row = $result->fetch_assoc()) {
				$posicionGlobal += 1; 
				$id_piloto = htmlspecialchars($row['id_piloto']);
				$driver = htmlspecialchars($row['nombre']);
				$puntos = htmlspecialchars($row['puntos']);
				
				$info .= '<tr>';
				$info .= '<td>' . $posicionGlobal . '</td>';
				$info .= '<td>' . $driver . '</td>';
				$info .= '<td>' . $puntos . '</td>';
				$info .= '</tr>';

				$stmtInsert->bind_param('iii', $id_piloto, $puntos, $posicionGlobal);
				$stmtInsert->execute();
			}
	
			$info .= '</tbody>';
			$info .= '</table>';
			$info .= '</section>';
	
			// Output the table
			echo $info;
		}
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
	<link rel="stylesheet" type="text/css" href="../estilo/ranking.css" />
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
		<h1><a href = "../index.html" title = "F1 Desktop: Inicio">F1 Desktop</a></h1>
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
    <p>Estás en: <a href="../index.html">Inicio</a> | <a href="../juegos.html">Juegos</a> | Ranking</p>
	<section>
			<h2>Menú de Juegos</h2>
            <nav>
                <a href="../memoria.html" title="Accede a juego de memoria">Juego de memoria</a>
				<a href="../semaforo.php" title="Accede a juego del semáforo">Juego del semáforo</a>
				<a href="../api.html" title="Accede a juego de pilotos de F1">Juego de pilotos</a>
				<a href="ranking.php" title="Accede al ranking de pilotos de F1">Ranking de pilotos</a>
            </nav>
        </section>
	<main>
		<h2>Ranking de pilotos</h2>
		<form action="#" method="POST" enctype="multipart/form-data">
                <label>
                    Insertar datos (csv): 
                    <input type="file" name="csv" required>
                </label>
				<label>
					Exportar datos(csv):
					<input type="submit" name="import" value="Insertar datos">
				</label>
                
        </form>
		
		<?php $ranking->displayInformation() ?>
		<form action="#" method="POST">
			<input type="submit" name="export" value="Exportar datos">
		</form>
	</main>
</body>
</html>