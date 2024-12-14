-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 10-12-2024 a las 10:39:16
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `records`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `registro`
--

CREATE TABLE `registro` (
  `nombre` varchar(255) NOT NULL,
  `apellidos` varchar(255) NOT NULL,
  `nivel` int(11) NOT NULL,
  `tiempo` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Volcado de datos para la tabla `registro`
--

INSERT INTO `registro` (`nombre`, `apellidos`, `nivel`, `tiempo`) VALUES
('Pelayo', 'Sierra Lobo', 1, 309),
('Pelayo', 'Sierra Lobo', 1, 348),
('Juan', 'Juanez', 1, 333),
('Juan', 'Juanez', 1, 333),
('Pepe', 'Peponcio', 3, 363),
('Marcos', 'Losada', 0, 236),
('Pelape', 'Pelape', 0, 363),
('Marcos', 'Losada', 1, 281),
('Pelayo', 'Sierra Lobo', 2, 327),
('Dani', 'El Menda', 1, 311),
('Arthur', 'Morgan', 2, 301),
('Rogelio', 'Álvarez', 1, 292),
('Pelayo', 'Sierra Lobo', 1, 300),
('Pelayo', 'Sierra Lobo', 1, 384),
('Pelayo', 'Sierra Lobo', 1, 335),
('aaa', 'aaaa', 0, 320),
('dsasa', 'dsadsads', 2, 304),
('sad', 'dsadsa', 2, 328),
('asdf', 'sadfg', 3, 265),
('Pelayo', 'Sierra Lobo', 2, 265),
('Pelayo', 'Sierra Lobo', 2, 270),
('Pelayo', 'Sierra Lobo', 2, 300),
('dsadasdsa', 'dsadsadsadsa', 1, 294);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
