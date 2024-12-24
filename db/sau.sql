-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 24-12-2024 a las 22:09:35
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
-- Base de datos: `sau`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clientes`
--

CREATE TABLE `clientes` (
  `pppoe` varchar(50) NOT NULL,
  `nombres` text DEFAULT NULL,
  `apellidos` text DEFAULT NULL,
  `ciudad` varchar(50) DEFAULT NULL,
  `estado` varchar(50) DEFAULT NULL,
  `telefono` text DEFAULT NULL,
  `email` text DEFAULT NULL,
  `fecha_registro` date DEFAULT NULL,
  `fecha_corte` date DEFAULT NULL,
  `tipo_paquete` varchar(50) DEFAULT NULL,
  `monto_mensual` decimal(10,2) DEFAULT NULL,
  `municipio` varchar(50) DEFAULT NULL,
  `observaciones` text DEFAULT NULL,
  `status` enum('Seleccionar...','Activo','Desactivado') DEFAULT 'Seleccionar...',
  `direccion` text DEFAULT NULL,
  `celula` varchar(125) DEFAULT NULL,
  `cuenta_depositar` text DEFAULT NULL,
  `numero_referencia` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `instalaciones`
--

CREATE TABLE `instalaciones` (
  `id_instalaciones` int(11) NOT NULL,
  `fecha_instalacion` date DEFAULT NULL,
  `observacion` mediumtext DEFAULT NULL,
  `fotos` varchar(500) DEFAULT NULL,
  `costo_instalacion` float DEFAULT NULL,
  `Clientes_pppoe` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pagos`
--

CREATE TABLE `pagos` (
  `id_pagos` int(11) NOT NULL,
  `fecha_pago` date DEFAULT NULL,
  `monto` decimal(10,2) DEFAULT NULL,
  `referencia_bancaria` text DEFAULT NULL,
  `descripcion` varchar(100) DEFAULT NULL,
  `Clientes_pppoe` varchar(50) DEFAULT NULL,
  `comprobante` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `soporte`
--

CREATE TABLE `soporte` (
  `id_soporte` int(11) NOT NULL,
  `fecha_reporte` date DEFAULT NULL,
  `descripcion` mediumtext DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `Clientes_pppoe` varchar(50) DEFAULT NULL,
  `nivel_soporte` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `role`, `created_at`) VALUES
(1, 'Cristobal_Chambe', '$argon2id$v=19$m=65536,t=3,p=4$scSZNYfkT3jHAiYYulJ2XQ$Nq2yBsqKcT8CpDLQgES2PgXaKZs0i28sfyCxhHSOpio', 'admin', '2024-09-08 21:13:21'),
(2, 'Ambar_Chambe', '$argon2id$v=19$m=65536,t=3,p=4$G1JWJEBL/BILBvpLQY4QLg$iVOuoICuotWm2GrqncV18iKxyv2xY6QnUTzxbUXWQyo', NULL, '2024-09-09 00:50:31'),
(3, 'Gema_Chambe', '$argon2id$v=19$m=65536,t=3,p=4$ESO/OooXbSzqWM1gK3g3Kw$MyhiIydUnIpNIpZTe8R6eG7dRh9snCNB8J/b+4mykaM', NULL, '2024-09-09 00:57:44'),
(4, 'Hugo_Chambe', '$argon2id$v=19$m=65536,t=3,p=4$gVFUUZFOEPyK/FShxUPDtA$I8RCatZ4SejJpwY0Dvk5lh4Lgqg2QCuEZB05LkwETTs', NULL, '2024-09-09 00:57:44'),
(5, 'Mariela_Zambrano', '$argon2id$v=19$m=65536,t=3,p=4$B6izhRwAb8H7aLmClWs7ZQ$zbZjNXcG0P/JAJglu2mWWqMboTwVgILhkpjuKeriy1U', NULL, '2024-09-09 00:57:44'),
(6, 'Paloma_Chambe', '$argon2id$v=19$m=65536,t=3,p=4$xyGbEyJxBl0OLo11wcmkfg$acQQcX1e8wCgytDLHn1WboIEJQDK189o9D9oTQC3TqQ', NULL, '2024-09-09 00:57:44'),
(7, 'Raquel_Zambrano', '$argon2id$v=19$m=65536,t=3,p=4$M6SWTV7yoC5HFrnSZ4kNxw$Vj+QyjuagVHfuHxJf5RU3pay8bVC/6FBPQZtj7GQZ4Y', NULL, '2024-09-09 00:57:44');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `clientes`
--
ALTER TABLE `clientes`
  ADD PRIMARY KEY (`pppoe`);

--
-- Indices de la tabla `instalaciones`
--
ALTER TABLE `instalaciones`
  ADD PRIMARY KEY (`id_instalaciones`),
  ADD KEY `Clientes_pppoe` (`Clientes_pppoe`);

--
-- Indices de la tabla `pagos`
--
ALTER TABLE `pagos`
  ADD PRIMARY KEY (`id_pagos`),
  ADD KEY `Clientes_pppoe` (`Clientes_pppoe`);

--
-- Indices de la tabla `soporte`
--
ALTER TABLE `soporte`
  ADD PRIMARY KEY (`id_soporte`),
  ADD KEY `Clientes_pppoe` (`Clientes_pppoe`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `instalaciones`
--
ALTER TABLE `instalaciones`
  MODIFY `id_instalaciones` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT de la tabla `pagos`
--
ALTER TABLE `pagos`
  MODIFY `id_pagos` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=90;

--
-- AUTO_INCREMENT de la tabla `soporte`
--
ALTER TABLE `soporte`
  MODIFY `id_soporte` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `instalaciones`
--
ALTER TABLE `instalaciones`
  ADD CONSTRAINT `instalaciones_ibfk_1` FOREIGN KEY (`Clientes_pppoe`) REFERENCES `clientes` (`pppoe`);

--
-- Filtros para la tabla `pagos`
--
ALTER TABLE `pagos`
  ADD CONSTRAINT `pagos_ibfk_1` FOREIGN KEY (`Clientes_pppoe`) REFERENCES `clientes` (`pppoe`);

--
-- Filtros para la tabla `soporte`
--
ALTER TABLE `soporte`
  ADD CONSTRAINT `soporte_ibfk_1` FOREIGN KEY (`Clientes_pppoe`) REFERENCES `clientes` (`pppoe`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
