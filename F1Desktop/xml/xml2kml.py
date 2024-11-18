import xml.etree.ElementTree as ET

class Kml(object):
    """
    Genera archivo KML con puntos y líneas
    @version 1.0 17/Noviembre/2023
    @author: Juan Manuel Cueva Lovelle. Universidad de Oviedo
    """
    def __init__(self, archivoXML):
        """
        Crea el elemento raíz y el espacio de nombres
        """
        self.raiz = ET.Element('kml', xmlns="http://www.opengis.net/kml/2.2") # inicializa el KML
        self.doc = ET.SubElement(self.raiz,'Document')

        self.archivoXML = archivoXML
        self.lista_coordenadas = [] # parsea el XML

    def load_data(self):
        try:
            tree = ET.parse(self.archivoXML)
            root = tree.getroot()
            coordenadas_inicio = root.find('.//{http://www.uniovi.es}coordenadas_inicio')

            # Coordenadas iniciales
            if coordenadas_inicio is not None:
                longitud_inicial = self.coordinates_to_decimal(coordenadas_inicio.find('{http://www.uniovi.es}longitud').text)
                latitud_inicial = self.coordinates_to_decimal(coordenadas_inicio.find('{http://www.uniovi.es}latitud').text)
                altitud_inicial = coordenadas_inicio.find('{http://www.uniovi.es}altitud').text
                self.lista_coordenadas.append(f"{longitud_inicial},{latitud_inicial},{altitud_inicial}")

            # Coordenadas de cada tramo
            for tramo in root.findall('.//{http://www.uniovi.es}tramo'):
                coordenadas_final = tramo.find('.//{http://www.uniovi.es}coordenadas_final')
                if coordenadas_final is not None:
                    latitud = self.coordinates_to_decimal(coordenadas_final.find('{http://www.uniovi.es}latitud').text)
                    longitud = self.coordinates_to_decimal(coordenadas_final.find('{http://www.uniovi.es}longitud').text)
                    altitud = coordenadas_final.find('{http://www.uniovi.es}altitud').text
                    self.lista_coordenadas.append(f"{longitud},{latitud},{altitud}")
        except IOError:
             print ('No se encuentra el archivo ', self.archivoXML)
             exit()
        except ET.ParseError:
            print("Error procesando en el archivo XML = ", self.archivoXML)
            exit()

    def addPlacemark(self,nombre,descripcion,long,lat,alt, modoAltitud):
        """
        Añade un elemento <Placemark> con puntos <Point>
        """
        pm = ET.SubElement(self.doc,'Placemark')
        ET.SubElement(pm,'name').text = '\n' + nombre + '\n'
        ET.SubElement(pm,'description').text = '\n' + descripcion + '\n'
        punto = ET.SubElement(pm,'Point')
        ET.SubElement(punto,'coordinates').text = '\n{},{},{}\n'.format(long,lat,alt)
        ET.SubElement(punto,'altitudeMode').text = '\n' + modoAltitud + '\n'

    def addLineString(self,nombre, color, ancho):
        """
        Añade el LineString al documento KML basado en las coordenadas extraídas
        """
        pm = ET.SubElement(self.doc, 'Placemark')
        ET.SubElement(pm, 'name').text = f"\n{nombre}\n"

        estilo = ET.SubElement(pm, 'Style')
        linea = ET.SubElement(estilo, 'LineStyle')
        ET.SubElement(linea, 'color').text = f"\n{color}\n"
        ET.SubElement(linea, 'width').text = f"\n{ancho}\n"

        ls = ET.SubElement(pm, 'LineString')
        ET.SubElement(ls, 'tessellate').text = '1'
        ET.SubElement(ls, 'altitudeMode').text = 'relativeToGround'
        ET.SubElement(ls, 'coordinates').text = '\n' + "\n".join(self.lista_coordenadas) + '\n'

    def escribir(self,nombreArchivoKML):
        """
        Escribe el archivo KML con declaración y codificación
        """
        arbol = ET.ElementTree(self.raiz)
        arbol.write(nombreArchivoKML, encoding='utf-8', xml_declaration=True)

    def coordinates_to_decimal(self, coordenada):
        """
        Convierte coordenadas a formato decimal ya que en mi XML están escritas en formato DD°MM'SS.S"X
        """
        # Eliminar espacios en blanco
        coordenada = coordenada.strip()
        
        # Extraer los grados, minutos y segundos
        grados = float(coordenada.split('°')[0])
        minutos = float(coordenada.split('°')[1].split("'")[0])
        segundos = float(coordenada.split("'")[1].split('"')[0])
        
        # Determinar el signo basado en la dirección
        direccion = coordenada[-1]
        signo = -1 if direccion in ['W', 'S'] else 1
        
        # Convertir a decimal
        decimal = signo * (grados + minutos/60 + segundos/3600)
        
        return round(decimal, 8)
    
    def ver(self):
        """
        Muestra el archivo KML en consola. Se utiliza para depuración
        """
        print("\nElemento raiz = ", self.raiz.tag)
        for hijo in self.raiz.findall('.//'):
            print("\nElemento = ", hijo.tag)
            print("Contenido = ", (hijo.text or "").strip())
            print("Atributos = ", hijo.attrib)

def main():
    
   nombreKML = "C:/Users/Usuario/OneDrive/Escritorio/EII/3º Software/SEW/F1Desktop/xml/circuito.kml"
   archivoXML = "C:/Users/Usuario/OneDrive/Escritorio/EII/3º Software/SEW/F1Desktop/xml/circuitoEsquema.xml"
   circuito = Kml(archivoXML)

   circuito.load_data()
   circuito.addLineString("Circuito Completo", "ff0000ff", "4")
   circuito.ver()  # Visualización en consola para depuración
   circuito.escribir(nombreKML)
   print(f"Creado el archivo: {nombreKML}")
    
if __name__ == "__main__":
    main()    