<?php
class Carrusel {

	private $capital;
	private $pais;

	public function __construct($capital, $pais) {
		$this->capital = $capital;
		$this->pais = $pais;
	}

	public function displayImages() { 
		$api_key = "d1bf36e5e293db8730851ba07d0cd7ce"; 
		$url = 'https://api.flickr.com/services/rest/'; 
		$url .= '?method=flickr.photos.search';
		$url .= '&api_key=' . $api_key; 
		$url .= '&text='.urlencode('City view');
		$url .= '&tags=' . urlencode($this->pais.",".$this->capital); 
		$url .= '&per_page=10';
		$url .= '&format=json'; 
		$url .= '&nojsoncallback=1';  
	
		$respuesta = file_get_contents($url); 
		$json = json_decode($respuesta);	  
	
		for($i = 0; $i < min(10, count($json->photos->photo)); $i++) { 
			$photo = $json->photos->photo[$i];
			
			// Construct photo URL
			$URLfoto = "https://farm{$photo->farm}.staticflickr.com/{$photo->server}/{$photo->id}_{$photo->secret}_m.jpg";
			
			echo "<img alt='".$photo->title."' src='".$URLfoto."' />"; 
		} 
	}

}

class Moneda {

	private $local;
	private $cambio;
	public function __construct($local, $cambio) {
		$this->local = $local;
		$this->cambio = $cambio;
	}

	public function convert() {
		$url = 'https://v6.exchangerate-api.com/v6/b258522ce623a644cc9336d5/pair/'.$this->local.'/'.$this->cambio;
		$respuesta = file_get_contents($url);

		if(false !== $respuesta) {
			$json = json_decode($respuesta);
			if('success' === $json->result) {
				$conversion = round(($json->conversion_rate), 2);
				echo "<p>1 ".$this->local." = ".$conversion." ".$this->cambio."</p>";
			}
				
		}
	}
}
$carrusel = new Carrusel("Riad","SAUDI ARABIA");
$moneda = new Moneda("EUR", "SAR");
?>
<!DOCTYPE HTML>

<html lang="es">
<head>
    <!-- Datos que describen el documento -->
    <meta charset="UTF-8" />
	<meta name ="author" content ="Pelayo Sierra Lobo" />
	<meta name ="description" content ="" />
	<meta name ="keywords" content ="F1, F1 Desktop" />
    <meta name ="viewport" content ="width=device-width, initial-scale=1.0" />
	<title>F1Desktop: Viajes</title>
	<link rel="stylesheet" type="text/css" href="estilo/estilo.css" />
	<link rel="stylesheet" type="text/css" href="estilo/layout.css" />
	<link rel=icon href=multimedia/imagenes/favicon.ico sizes="16x16" type="image/vnd.microsoft.icon">
	<script 
		src="https://code.jquery.com/jquery-3.7.1.min.js" 
		integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" 
		crossorigin="anonymous">
	</script>
	<script src="js/viajes.js"></script>
</head>

<body>
    <!-- Datos con el contenidos que aparece en el navegador -->
    <header>
		<h1><a href = "index.html" title = "F1 Desktop: Inicio">F1 Desktop</a></h1>
		<nav>
			<a href = "index.html" title = "F1 Desktop: Inicio">Inicio</a>
			<a href = "piloto.html" title = "F1 Desktop: Piloto">Piloto</a>
			<a href = "noticias.html" title = "F1 Desktop: Noticias">Noticias</a>
			<a href = "calendario.html" title = "F1 Desktop: Calendario">Calendario</a>
			<a href = "meteorologia.html" title = "F1 Desktop: Meteorología">Meteorología</a>
			<a href = "circuito.html" title = "F1 Desktop: Circuito">Circuito</a>
			<a href = "viajes.html" class="active" title = "F1 Desktop: Viajes">Viajes</a>
			<a href = "juegos.html" title = "F1 Desktop: Juegos">Juegos</a>
		</nav>
	</header>
	<p>Estás en: <a href="index.html">Inicio</a> | Viajes</p>
	<main>
		<h2>Viajes</h2>
		
		
		
		<h3>Carrusel de imágenes</h3>
		<h4>Imágenes de Arabia Saudita</h4>
		<article>
		<article>
			<?php $carrusel->displayImages(); ?>
			<button> &gt; </button>
			<button> &lt; </button>
		</article>
		</article>
		<h3>Conversión del Euro al Riyal saudí </h3>
		<?php $moneda->convert(); ?>
		<script>new Viajes()</script>
	</main>
</body>
</html>