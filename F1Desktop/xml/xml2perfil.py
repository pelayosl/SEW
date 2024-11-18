import xml.etree.ElementTree as ET

class PerfilAltimetria:
    def __init__(self, archivo_xml):
        self.archivo_xml = archivo_xml
        self.distancias = []
        self.altitudes = []
        self.distancia_total = 0
        
    def cargar_datos(self):
        try:
            tree = ET.parse(self.archivo_xml)
            root = tree.getroot()
            coordenadas_inicio = root.find('.//{http://www.uniovi.es}coordenadas_inicio')
            
            # Obtener coordenada inicial
            if coordenadas_inicio is not None:
                altitud_inicial = float(coordenadas_inicio.find('{http://www.uniovi.es}altitud').text)
                self.distancias.append(0)
                self.altitudes.append(altitud_inicial)
            
            # Obtener datos de cada tramo
            for tramo in root.findall('.//{http://www.uniovi.es}tramo'):
                distancia = float(tramo.get('distancia'))
                self.distancia_total += distancia
                coordenadas_final = tramo.find('.//{http://www.uniovi.es}coordenadas_final')
                if coordenadas_final is not None:
                    altitud = float(coordenadas_final.find('{http://www.uniovi.es}altitud').text)
                    self.distancias.append(self.distancia_total)
                    self.altitudes.append(altitud)
                    
        except Exception as e:
            print(f"Error al cargar el XML: {e}")
            exit()
    
    def generar_svg(self, archivo_salida):
        # Establecer límites fijos para la altitud
        min_alt = 0  # Forzar mínimo a 0
        max_alt = 4  # Forzar máximo a 4
        rango_alt = max_alt - min_alt
        
        # Encontrar valor máximo para la distancia
        max_dist = max(self.distancias)
        
        # Dimensiones del SVG
        ancho = 500
        alto = 180
        margen = 50
        altura_grafico = alto - (2 * margen)
        
        # Generar puntos para la polilínea
        puntos = []
        for i in range(len(self.distancias)):
            # Escalar la distancia al ancho disponible
            x = margen + (self.distancias[i] / max_dist) * (ancho - 2 * margen)
            
            # Escalar la altitud al alto disponible usando los límites fijos
            y = alto - margen - ((self.altitudes[i] - min_alt) / rango_alt * altura_grafico)
            puntos.append(f"{x},{y}")
        
        # Añadir puntos para cerrar el polígono
        puntos.append(f"{ancho-margen},{alto-margen}")  # Esquina inferior derecha
        puntos.append(f"{margen},{alto-margen}")       # Esquina inferior izquierda
        
        # Crear el SVG
        svg = f'''<?xml version="1.0" encoding="UTF-8"?>
    <svg xmlns="http://www.w3.org/2000/svg" version="2.0" width="{ancho}" height="{alto}">
        <text x="{ancho/2}" y="30" text-anchor="middle" font-size="20">
            Perfil de Altimetría del Circuito
        </text>
        
        <polyline points="{' '.join(puntos)}" fill="lightblue" stroke="blue" stroke-width="2"/>

        <line x1="{margen}" y1="{alto-margen}" x2="{ancho-margen}" y2="{alto-margen}"
            stroke="black" stroke-width="2"/>
        <text x="{ancho/2}" y="{alto-20}" text-anchor="middle">
            Distancia (m)
        </text>
        
        <line x1="{margen}" y1="{margen}" x2="{margen}" y2="{alto-margen}"
            stroke="black" stroke-width="2"/>
        <text x="20" y="{alto/2}" transform="rotate(-90,20,{alto/2})" text-anchor="middle">
            Altitud (m)
        </text>
        
        <!-- Marcas de escala -->
        <text x="{margen}" y="{alto-margen+20}" text-anchor="middle">
            0
        </text>
        <text x="{ancho-margen}" y="{alto-margen+20}" text-anchor="middle">
            {int(max_dist)}m
        </text>
        <text x="{margen-30}" y="{alto-margen}" text-anchor="end">
            {min_alt}m
        </text>
        <text x="{margen-30}" y="{margen}" text-anchor="end">
            {max_alt}m
        </text>
    </svg>'''
        
        # Guardar el archivo
        try:
            with open(archivo_salida, 'w', encoding='utf-8') as f:
                f.write(svg)
            print(f"Archivo SVG generado correctamente: {archivo_salida}")
        except Exception as e:
            print(f"Error al guardar el archivo SVG: {e}")

def main():
    archivo_xml = "C:/Users/Usuario/OneDrive/Escritorio/EII/3º Software/SEW/F1Desktop/xml/circuitoEsquema.xml"
    archivo_svg = "C:/Users/Usuario/OneDrive/Escritorio/EII/3º Software/SEW/F1Desktop/xml/altimetria.svg"
    
    perfil = PerfilAltimetria(archivo_xml)
    perfil.cargar_datos()
    perfil.generar_svg(archivo_svg)

if __name__ == "__main__":
    main()