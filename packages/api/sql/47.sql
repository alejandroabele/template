-- ============================================
-- MIGRACION 47: RBAC - ROLES POR PROCESO GENERAL
-- ============================================
-- Esta migración implementa el sistema de control de acceso basado en roles
-- vinculado a estados de procesos generales (flujo de trabajo de presupuestos)
-- ============================================

-- ============================================
-- 1. CREACIÓN DE ESTRUCTURAS DE BASE DE DATOS
-- ============================================

-- Tabla de relación roles-proceso_general
CREATE TABLE IF NOT EXISTS `role_proceso_general` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `role_id` INT NOT NULL,
  `proceso_general_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_role_proceso_general` (`role_id`, `proceso_general_id`),
  INDEX `idx_role_id` (`role_id`),
  INDEX `idx_proceso_general_id` (`proceso_general_id`)
);

-- ============================================
-- 2. INSERCIÓN DE PERMISOS POR ENTIDADES/TABLAS
-- ============================================

-- ============================================
-- 2.1. TABLA: presupuesto (Presupuestos)
-- ============================================

-- Operaciones CRUD básicas
INSERT INTO permissions (codigo, descripcion, modulo) VALUES
('PRESUPUESTOS_VER', 'Permite visualizar el listado y detalle de presupuestos del sistema', 'presupuestos'),
('PRESUPUESTOS_CREAR', 'Permite crear nuevos presupuestos para clientes', 'presupuestos'),
('PRESUPUESTOS_EDITAR', 'Permite modificar presupuestos existentes', 'presupuestos'),
('PRESUPUESTOS_ELIMINAR', 'Permite eliminar presupuestos del sistema', 'presupuestos');

-- Verificaciones y aprobaciones
INSERT INTO permissions (codigo, descripcion, modulo) VALUES
('PRESUPUESTOS_VERIFICAR_ALMACEN', 'Permite verificar la disponibilidad de materiales en almacén para el presupuesto', 'presupuestos'),
('PRESUPUESTOS_APROBAR_SERVICIO', 'Permite aprobar presupuestos de tipo servicio', 'presupuestos'),
('PRESUPUESTOS_CERTIFICAR', 'Permite certificar presupuestos completados y entregas realizadas', 'presupuestos');

-- Gestión de fechas y entrega
INSERT INTO permissions (codigo, descripcion, modulo) VALUES
('PRESUPUESTOS_REGISTRAR_FECHA', 'Permite registrar fechas de eventos en el presupuesto', 'presupuestos'),
('PRESUPUESTOS_ACTUALIZAR_FECHA_ENTREGA', 'Permite modificar la fecha estimada de entrega del presupuesto', 'presupuestos'),
('PRESUPUESTOS_ACTUALIZAR_FECHA_FABRICACION', 'Permite modificar la fecha de inicio de fabricación del presupuesto', 'presupuestos'),
('PRESUPUESTOS_CONFIRMAR_ENTREGA', 'Permite confirmar la entrega final del presupuesto al cliente', 'presupuestos');

-- Costeo técnico y comercial
INSERT INTO permissions (codigo, descripcion, modulo) VALUES
('PRESUPUESTOS_COSTEO_TECNICO_VER', 'Permite visualizar el costeo técnico del presupuesto', 'presupuestos'),
('PRESUPUESTOS_COSTEO_TECNICO_CREAR', 'Permite crear y editar el costeo técnico del presupuesto', 'presupuestos'),
('PRESUPUESTOS_COSTEO_COMERCIAL_VER', 'Permite visualizar el costeo comercial del presupuesto', 'presupuestos'),
('PRESUPUESTOS_COSTEO_COMERCIAL_CREAR', 'Permite crear y editar el costeo comercial del presupuesto', 'presupuestos');

-- Análisis de costos
INSERT INTO permissions (codigo, descripcion, modulo) VALUES
('PRESUPUESTOS_VER_ANALISIS', 'Permite ver el análisis detallado de costos del presupuesto', 'presupuestos'),
('PRESUPUESTOS_VER_MATERIALES_ANALISIS', 'Permite visualizar el análisis de costos de materiales', 'presupuestos'),
('PRESUPUESTOS_VER_SUMINISTROS_ANALISIS', 'Permite visualizar el análisis de costos de suministros', 'presupuestos'),
('PRESUPUESTOS_VER_MANO_DE_OBRA_ANALISIS', 'Permite visualizar el análisis de costos de mano de obra', 'presupuestos'),
('PRESUPUESTOS_VER_PRODUCTOS_EXTRAS_ANALISIS', 'Permite visualizar el análisis de productos extras y adicionales', 'presupuestos'),
('PRESUPUESTOS_COSTOS_MATERIALES_VER', 'Permite ver los costos de materiales utilizados en el presupuesto', 'presupuestos'),
('PRESUPUESTOS_PRECIO_VENTA_VER', 'Permite visualizar el precio de venta final del presupuesto', 'presupuestos');

-- Exportación y reportes
INSERT INTO permissions (codigo, descripcion, modulo) VALUES
('PRESUPUESTOS_EXPORTAR_PDF', 'Permite generar y descargar presupuestos en formato PDF', 'presupuestos'),
('PRESUPUESTOS_EXPORTAR_EXCEL', 'Permite exportar listados de presupuestos a formato Excel', 'presupuestos'),
('PRESUPUESTOS_EXPORTAR_ORDEN_PDF', 'Permite generar órdenes de trabajo/producción en formato PDF', 'presupuestos');

-- Flujo de trabajo y diseño
INSERT INTO permissions (codigo, descripcion, modulo) VALUES
('PRESUPUESTOS_ENVIAR_A_ALMACEN', 'Permite enviar el presupuesto al área de almacén para verificación de stock', 'presupuestos'),
('PRESUPUESTOS_CARGAR_DISENO', 'Permite cargar archivos de diseño asociados al presupuesto', 'presupuestos');

-- Dashboards y vistas especiales
INSERT INTO permissions (codigo, descripcion, modulo) VALUES
('PRESUPUESTOS_DASHBOARD', 'Permite acceder al dashboard principal de presupuestos', 'presupuestos'),
('PRESUPUESTOS_PRODUCCION_DASHBOARD', 'Permite acceder al dashboard de presupuestos de producción', 'presupuesto_produccion'),
('PRESUPUESTOS_SERVICIOS_DASHBOARD', 'Permite acceder al dashboard de presupuestos de servicios', 'presupuesto_produccion');

-- Filtros de visibilidad de presupuestos (RBAC)
INSERT INTO permissions (codigo, descripcion, modulo) VALUES
('PRESUPUESTOS_FILTRO_VER_PROPIOS', 'Permite ver únicamente los presupuestos propios (como vendedor asignado)', 'filtros_presupuestos'),
('PRESUPUESTOS_FILTRO_VER_DISENO_COMPLETO', 'Permite ver presupuestos que tienen el diseño marcado como completo', 'filtros_presupuestos'),
('PRESUPUESTOS_FILTRO_VER_COSTEO_COMPLETO', 'Permite ver presupuestos que tienen el costeo técnico marcado como completo', 'filtros_presupuestos'),
('PRESUPUESTOS_FILTRO_VER_COSTEO_COMERCIAL_COMPLETO', 'Permite ver presupuestos que tienen el costeo comercial marcado como completo', 'filtros_presupuestos'),
('PRESUPUESTOS_FILTRO_VER_PRODUCCION_COMPLETO', 'Permite ver presupuestos que tienen la producción marcada como completa', 'filtros_presupuestos');

-- ============================================
-- 2.2. TABLA: presupuesto_facturacion (Facturas de presupuestos)
-- ============================================

INSERT INTO permissions (codigo, descripcion, modulo) VALUES
('PRESUPUESTO_FACTURACION_VER', 'Permite visualizar las facturas emitidas de presupuestos (Activa la tabs de Administracion)', 'presupuesto_facturacion'),
('PRESUPUESTO_FACTURACION_CREAR', 'Permite generar nuevas facturas para presupuestos', 'presupuesto_facturacion'),
('PRESUPUESTO_FACTURACION_EDITAR', 'Permite modificar facturas de presupuestos', 'presupuesto_facturacion'),
('PRESUPUESTO_FACTURACION_ELIMINAR', 'Permite eliminar facturas de presupuestos', 'presupuesto_facturacion');

-- ============================================
-- 2.3. TABLA: presupuesto_cobro (Cobranzas de presupuestos)
-- ============================================

INSERT INTO permissions (codigo, descripcion, modulo) VALUES
('PRESUPUESTO_COBRO_VER', 'Permite visualizar las cobranzas asociadas a presupuestos (Activa la tabs de Administracion)', 'presupuesto_cobro'),
('PRESUPUESTO_COBRO_CREAR', 'Permite registrar nuevas cobranzas de presupuestos', 'presupuesto_cobro'),
('PRESUPUESTO_COBRO_EDITAR', 'Permite modificar cobranzas de presupuestos existentes', 'presupuesto_cobro'),
('PRESUPUESTO_COBRO_ELIMINAR', 'Permite eliminar registros de cobranzas de presupuestos', 'presupuesto_cobro');

-- ============================================
-- 2.4. TABLA: presupuesto_item (Items de presupuesto)
-- ============================================

INSERT INTO permissions (codigo, descripcion, modulo) VALUES
('PRESUPUESTO_ITEM_VER', 'Permite visualizar los items de presupuestos', 'presupuesto_item'),
('PRESUPUESTO_ITEM_CREAR', 'Permite agregar items a presupuestos', 'presupuesto_item'),
('PRESUPUESTO_ITEM_EDITAR', 'Permite modificar items de presupuestos', 'presupuesto_item'),
('PRESUPUESTO_ITEM_ELIMINAR', 'Permite eliminar items de presupuestos', 'presupuesto_item'),
('PRESUPUESTO_ITEM_ASIGNAR_RECETAS', 'Permite asignar recetas de producción a items de presupuestos', 'presupuesto_item');

-- ============================================
-- 2.5. TABLA: presupuesto_materiales (Materiales de presupuesto)
-- ============================================

INSERT INTO permissions (codigo, descripcion, modulo) VALUES
('PRESUPUESTO_MATERIALES_VER', 'Permite visualizar materiales de presupuestos', 'presupuesto_materiales'),
('PRESUPUESTO_MATERIALES_CREAR', 'Permite agregar materiales a presupuestos', 'presupuesto_materiales'),
('PRESUPUESTO_MATERIALES_EDITAR', 'Permite modificar materiales de presupuestos', 'presupuesto_materiales'),
('PRESUPUESTO_MATERIALES_ELIMINAR', 'Permite eliminar materiales de presupuestos', 'presupuesto_materiales');

-- ============================================
-- 2.6. TABLA: presupuesto_suministros (Suministros de presupuesto)
-- ============================================

INSERT INTO permissions (codigo, descripcion, modulo) VALUES
('PRESUPUESTO_SUMINISTROS_VER', 'Permite visualizar suministros de presupuestos', 'presupuesto_suministros'),
('PRESUPUESTO_SUMINISTROS_CREAR', 'Permite agregar suministros a presupuestos', 'presupuesto_suministros'),
('PRESUPUESTO_SUMINISTROS_EDITAR', 'Permite modificar suministros de presupuestos', 'presupuesto_suministros'),
('PRESUPUESTO_SUMINISTROS_ELIMINAR', 'Permite eliminar suministros de presupuestos', 'presupuesto_suministros');

-- ============================================
-- 2.7. TABLA: presupuesto_mano_de_obra (Mano de obra)
-- ============================================

INSERT INTO permissions (codigo, descripcion, modulo) VALUES
('PRESUPUESTO_MANO_DE_OBRA_VER', 'Permite visualizar la mano de obra de presupuestos', 'presupuesto_mano_de_obra'),
('PRESUPUESTO_MANO_DE_OBRA_CREAR', 'Permite agregar mano de obra a presupuestos', 'presupuesto_mano_de_obra'),
('PRESUPUESTO_MANO_DE_OBRA_EDITAR', 'Permite modificar mano de obra de presupuestos', 'presupuesto_mano_de_obra'),
('PRESUPUESTO_MANO_DE_OBRA_ELIMINAR', 'Permite eliminar mano de obra de presupuestos', 'presupuesto_mano_de_obra');

-- ============================================
-- 2.8. TABLA: presupuesto_trabajos (Trabajos/servicios de presupuesto)
-- ============================================

INSERT INTO permissions (codigo, descripcion, modulo) VALUES
('PRESUPUESTO_TRABAJOS_VER', 'Permite visualizar trabajos/servicios de presupuestos', 'presupuesto_trabajos'),
('PRESUPUESTO_TRABAJOS_CREAR', 'Permite agregar trabajos a presupuestos', 'presupuesto_trabajos'),
('PRESUPUESTO_TRABAJOS_EDITAR', 'Permite modificar trabajos de presupuestos', 'presupuesto_trabajos'),
('PRESUPUESTO_TRABAJOS_ELIMINAR', 'Permite eliminar trabajos de presupuestos', 'presupuesto_trabajos');

-- ============================================
-- 2.9. TABLA: presupuesto_produccion (Gestión de producción/servicios)
-- ============================================

INSERT INTO permissions (codigo, descripcion, modulo) VALUES
('PRESUPUESTO_PRODUCCION_VER', 'Permite visualizar trabajos de producción/servicio de presupuestos', 'presupuesto_produccion'),
('PRESUPUESTO_PRODUCCION_CREAR', 'Permite crear trabajos de producción/servicio para presupuestos', 'presupuesto_produccion'),
('PRESUPUESTO_PRODUCCION_EDITAR', 'Permite iniciar y finalizar trabajos de producción/servicio de presupuestos', 'presupuesto_produccion'),
('PRESUPUESTO_PRODUCCION_ELIMINAR', 'Permite eliminar trabajos de producción/servicio de presupuestos', 'presupuesto_produccion');

-- ============================================
-- 2.10. TABLA: presupuesto_receta (Recetas de producción)
-- ============================================

INSERT INTO permissions (codigo, descripcion, modulo) VALUES
('PRESUPUESTO_RECETA_VER', 'Permite visualizar recetas de producción', 'presupuesto_receta'),
('PRESUPUESTO_RECETA_CREAR', 'Permite crear nuevas recetas de producción', 'presupuesto_receta'),
('PRESUPUESTO_RECETA_EDITAR', 'Permite modificar recetas de producción existentes', 'presupuesto_receta'),
('PRESUPUESTO_RECETA_ELIMINAR', 'Permite eliminar recetas de producción', 'presupuesto_receta');

-- ============================================
-- 2.11. TABLA: inventario (Inventario)
-- ============================================

-- Gestión básica
INSERT INTO permissions (codigo, descripcion, modulo) VALUES
('INVENTARIO_VER', 'Permite visualizar el inventario de productos y materiales', 'inventario'),
('INVENTARIO_CREAR', 'Permite registrar nuevos productos en el inventario', 'inventario'),
('INVENTARIO_EDITAR', 'Permite modificar productos del inventario', 'inventario'),
('INVENTARIO_ELIMINAR', 'Permite eliminar productos del inventario', 'inventario'),
('INVENTARIO_INGRESO_MERCADERIA', 'Permite registrar ingresos de mercadería al inventario', 'inventario'),
('INVENTARIO_EGRESO_MERCADERIA', 'Permite registrar egresos de mercadería al inventario', 'inventario'),
('INVENTARIO_VER_EXCEL', 'Permite exportar el inventario a formato Excel', 'inventario'),
('INVENTARIO_IMPORTAR_EXCEL', 'Permite importar productos al inventario desde Excel', 'inventario');

-- ============================================
-- 2.12. TABLA: inventario_familia (Familias de productos)
-- ============================================

INSERT INTO permissions (codigo, descripcion, modulo) VALUES
('INVENTARIO_FAMILIA_VER', 'Permite visualizar las familias de productos del inventario', 'inventario_familia'),
('INVENTARIO_FAMILIA_CREAR', 'Permite crear nuevas familias de productos', 'inventario_familia'),
('INVENTARIO_FAMILIA_EDITAR', 'Permite modificar familias de productos existentes', 'inventario_familia'),
('INVENTARIO_FAMILIA_ELIMINAR', 'Permite eliminar familias de productos', 'inventario_familia');

-- ============================================
-- 2.13. TABLA: inventario_categoria (Categorías de productos)
-- ============================================

INSERT INTO permissions (codigo, descripcion, modulo) VALUES
('INVENTARIO_CATEGORIA_VER', 'Permite visualizar las categorías de productos del inventario', 'inventario_categoria'),
('INVENTARIO_CATEGORIA_CREAR', 'Permite crear nuevas categorías de productos', 'inventario_categoria'),
('INVENTARIO_CATEGORIA_EDITAR', 'Permite modificar categorías de productos existentes', 'inventario_categoria'),
('INVENTARIO_CATEGORIA_ELIMINAR', 'Permite eliminar categorías de productos', 'inventario_categoria');

-- ============================================
-- 2.14. TABLA: movimiento_inventario (Movimientos de inventario)
-- ============================================

INSERT INTO permissions (codigo, descripcion, modulo) VALUES
('MOVIMIENTO_INVENTARIO_VER', 'Permite visualizar el historial de movimientos de inventario', 'movimiento_inventario'),
('MOVIMIENTO_INVENTARIO_CREAR', 'Permite registrar movimientos de inventario (entradas/salidas)', 'movimiento_inventario'),
('MOVIMIENTO_INVENTARIO_EDITAR', 'Permite modificar movimientos de inventario', 'movimiento_inventario'),
('MOVIMIENTO_INVENTARIO_ELIMINAR', 'Permite eliminar movimientos de inventario', 'movimiento_inventario');

-- ============================================
-- 2.15. TABLA: inventario_reserva (Reservas de inventario)
-- ============================================

INSERT INTO permissions (codigo, descripcion, modulo) VALUES
('INVENTARIO_RESERVA_VER', 'Permite visualizar reservas de inventario para presupuestos', 'inventario_reserva'),
('INVENTARIO_RESERVA_CREAR', 'Permite crear reservas de stock para presupuestos', 'inventario_reserva'),
('INVENTARIO_RESERVA_EDITAR', 'Permite modificar reservas de inventario existentes', 'inventario_reserva'),
('INVENTARIO_RESERVA_ELIMINAR', 'Permite eliminar reservas de inventario', 'inventario_reserva');

-- ============================================
-- 2.16. TABLA: alquiler (Alquileres)
-- ============================================

-- Operaciones básicas
INSERT INTO permissions (codigo, descripcion, modulo) VALUES
('ALQUILERES_VER', 'Permite visualizar el listado y detalle de alquileres de recursos', 'alquileres'),
('ALQUILERES_CREAR', 'Permite crear nuevos contratos de alquiler de recursos', 'alquileres'),
('ALQUILERES_EDITAR', 'Permite modificar contratos de alquiler existentes', 'alquileres'),
('ALQUILERES_ELIMINAR', 'Permite eliminar contratos de alquiler del sistema', 'alquileres'),
('ALQUILERES_DASHBOARD', 'Permite acceder al dashboard de gestión de alquileres', 'alquileres');

-- Reportes de alquileres
INSERT INTO permissions (codigo, descripcion, modulo) VALUES
('ALQUILERES_EXPORTAR_EXCEL', 'Permite exportar listados de alquileres a formato Excel', 'alquileres'),
('ALQUILERES_REPORTE_FACTURACION', 'Permite acceder al reporte de facturación de alquileres', 'alquileres'),
('ALQUILERES_REPORTE_CANTIDAD_RECURSOS', 'Permite ver el reporte de cantidad de recursos alquilados', 'alquileres'),
('ALQUILERES_REPORTE_ESTADO_RECURSOS', 'Permite ver el reporte del estado actual de recursos alquilados', 'alquileres');

-- ============================================
-- 2.17. TABLA: alquiler_recurso (Recursos para alquiler)
-- ============================================

INSERT INTO permissions (codigo, descripcion, modulo) VALUES
('ALQUILERES_RECURSOS_VER', 'Permite visualizar el catálogo de recursos disponibles para alquiler', 'alquiler_recurso'),
('ALQUILERES_RECURSOS_CREAR', 'Permite registrar nuevos recursos disponibles para alquiler', 'alquiler_recurso'),
('ALQUILERES_RECURSOS_EDITAR', 'Permite modificar recursos del catálogo de alquiler', 'alquiler_recurso'),
('ALQUILERES_RECURSOS_ELIMINAR', 'Permite eliminar recursos del catálogo de alquiler', 'alquiler_recurso'),
('ALQUILERES_RECURSOS_EXCEL', 'Permite exportar el catálogo de recursos a formato Excel', 'alquiler_recurso');

-- ============================================
-- 2.18. TABLA: alquiler_precio (Precios de alquileres)
-- ============================================

INSERT INTO permissions (codigo, descripcion, modulo) VALUES
('ALQUILERES_PRECIO_VER', 'Permite visualizar las tarifas y precios de alquiler de recursos', 'alquiler_precio'),
('ALQUILERES_PRECIO_CREAR', 'Permite crear nuevas tarifas de alquiler para recursos', 'alquiler_precio'),
('ALQUILERES_PRECIO_EDITAR', 'Permite modificar tarifas de alquiler existentes', 'alquiler_precio'),
('ALQUILERES_PRECIO_ELIMINAR', 'Permite eliminar tarifas de alquiler', 'alquiler_precio');

-- ============================================
-- 2.19. TABLA: alquiler_mantenimiento (Mantenimientos)
-- ============================================

INSERT INTO permissions (codigo, descripcion, modulo) VALUES
('ALQUILERES_MANTENIMIENTO_VER', 'Permite visualizar el historial de mantenimientos de recursos alquilados', 'alquiler_mantenimiento'),
('ALQUILERES_MANTENIMIENTO_CREAR', 'Permite registrar nuevos mantenimientos de recursos alquilados', 'alquiler_mantenimiento'),
('ALQUILERES_MANTENIMIENTO_EDITAR', 'Permite modificar registros de mantenimiento existentes', 'alquiler_mantenimiento'),
('ALQUILERES_MANTENIMIENTO_ELIMINAR', 'Permite eliminar registros de mantenimiento', 'alquiler_mantenimiento');

-- ============================================
-- 2.20. TABLA: alquiler_factura (Facturas de alquileres)
-- ============================================

INSERT INTO permissions (codigo, descripcion, modulo) VALUES
('ALQUILERES_FACTURAS_VER', 'Permite visualizar las facturas generadas por alquileres', 'alquiler_factura'),
('ALQUILERES_FACTURAS_CREAR', 'Permite generar nuevas facturas de alquileres', 'alquiler_factura'),
('ALQUILERES_FACTURAS_EDITAR', 'Permite modificar facturas de alquileres existentes', 'alquiler_factura'),
('ALQUILERES_FACTURAS_ELIMINAR', 'Permite eliminar facturas de alquileres', 'alquiler_factura');

-- ============================================
-- 2.21. TABLA: alquiler_cobranza (Cobranzas de alquileres)
-- ============================================

INSERT INTO permissions (codigo, descripcion, modulo) VALUES
('ALQUILERES_COBRANZAS_VER', 'Permite visualizar las cobranzas asociadas a alquileres', 'alquiler_cobranza'),
('ALQUILERES_COBRANZAS_CREAR', 'Permite registrar nuevas cobranzas de alquileres', 'alquiler_cobranza'),
('ALQUILERES_COBRANZAS_EDITAR', 'Permite modificar cobranzas de alquileres existentes', 'alquiler_cobranza'),
('ALQUILERES_COBRANZAS_ELIMINAR', 'Permite eliminar registros de cobranzas de alquileres', 'alquiler_cobranza');

-- ============================================
-- 2.22. TABLA: cashflow (Flujo de caja)
-- ============================================

-- Cashflow específico
INSERT INTO permissions (codigo, descripcion, modulo) VALUES
('CASHFLOW_VER', 'Permite visualizar el flujo de caja y movimientos financieros', 'cashflow'),
('CASHFLOW_CREAR', 'Permite registrar nuevos movimientos en el flujo de caja', 'cashflow'),
('CASHFLOW_EDITAR', 'Permite modificar movimientos del flujo de caja', 'cashflow'),
('CASHFLOW_ELIMINAR', 'Permite eliminar movimientos del flujo de caja', 'cashflow'),
('CASHFLOW_REPORTES', 'Permite acceder a reportes y estadísticas del flujo de caja', 'cashflow');

-- ============================================
-- 2.23. TABLA: cashflow_categoria (Categorías de cashflow)
-- ============================================

INSERT INTO permissions (codigo, descripcion, modulo) VALUES
('CASHFLOW_CATEGORIA_VER', 'Permite visualizar las categorías de clasificación del cashflow', 'cashflow_categoria'),
('CASHFLOW_CATEGORIA_CREAR', 'Permite crear nuevas categorías para clasificar movimientos financieros', 'cashflow_categoria'),
('CASHFLOW_CATEGORIA_EDITAR', 'Permite modificar categorías de cashflow existentes', 'cashflow_categoria'),
('CASHFLOW_CATEGORIA_ELIMINAR', 'Permite eliminar categorías de cashflow', 'cashflow_categoria');

-- ============================================
-- 2.24. TABLA: banco (Bancos y cuentas bancarias)
-- ============================================

INSERT INTO permissions (codigo, descripcion, modulo) VALUES
('BANCOS_VER', 'Permite visualizar las cuentas bancarias registradas', 'banco'),
('BANCOS_CREAR', 'Permite registrar nuevas cuentas bancarias en el sistema', 'banco'),
('BANCOS_EDITAR', 'Permite modificar información de cuentas bancarias', 'banco'),
('BANCOS_ELIMINAR', 'Permite eliminar cuentas bancarias del sistema', 'banco');

-- ============================================
-- 2.25. TABLA: banco_saldo (Saldos bancarios)
-- ============================================

INSERT INTO permissions (codigo, descripcion, modulo) VALUES
('BANCOS_SALDO_VER', 'Permite visualizar los saldos de las cuentas bancarias', 'banco_saldo'),
('BANCOS_SALDO_CREAR', 'Permite registrar actualizaciones de saldo bancario', 'banco_saldo'),
('BANCOS_SALDO_EDITAR', 'Permite modificar registros de saldo bancario', 'banco_saldo'),
('BANCOS_SALDO_ELIMINAR', 'Permite eliminar registros de saldo bancario', 'banco_saldo');

-- ============================================
-- 2.26. TABLA: metodo_pago (Métodos de pago)
-- ============================================

INSERT INTO permissions (codigo, descripcion, modulo) VALUES
('METODO_PAGO_VER', 'Permite visualizar los métodos de pago disponibles', 'metodo_pago'),
('METODO_PAGO_CREAR', 'Permite crear nuevos métodos de pago en el sistema', 'metodo_pago'),
('METODO_PAGO_EDITAR', 'Permite modificar métodos de pago existentes', 'metodo_pago'),
('METODO_PAGO_ELIMINAR', 'Permite eliminar métodos de pago del sistema', 'metodo_pago');

-- ============================================
-- 2.27. TABLA: centro_costo (Centros de costo)
-- ============================================

INSERT INTO permissions (codigo, descripcion, modulo) VALUES
('CENTRO_COSTO_VER', 'Permite visualizar los centros de costo de la empresa', 'centro_costo'),
('CENTRO_COSTO_CREAR', 'Permite crear nuevos centros de costo para clasificación de gastos', 'centro_costo'),
('CENTRO_COSTO_EDITAR', 'Permite modificar centros de costo existentes', 'centro_costo'),
('CENTRO_COSTO_ELIMINAR', 'Permite eliminar centros de costo del sistema', 'centro_costo');

-- ============================================
-- 2.28. TABLA: indice (Índices económicos)
-- ============================================

INSERT INTO permissions (codigo, descripcion, modulo) VALUES
('INDICE_VER', 'Permite visualizar índices económicos (inflación, dólar, etc.)', 'indice'),
('INDICE_CREAR', 'Permite registrar nuevos valores de índices económicos', 'indice'),
('INDICE_EDITAR', 'Permite modificar valores de índices económicos', 'indice'),
('INDICE_ELIMINAR', 'Permite eliminar registros de índices económicos', 'indice');

-- ============================================
-- 2.29. TABLA: cliente (Clientes)
-- ============================================

INSERT INTO permissions (codigo, descripcion, modulo) VALUES
('CLIENTES_VER', 'Permite visualizar el listado de clientes', 'cliente'),
('CLIENTES_CREAR', 'Permite registrar nuevos clientes en el sistema', 'cliente'),
('CLIENTES_EDITAR', 'Permite modificar información de clientes existentes', 'cliente'),
('CLIENTES_ELIMINAR', 'Permite eliminar clientes del sistema', 'cliente');

-- ============================================
-- 2.30. TABLA: proveedor (Proveedores)
-- ============================================

INSERT INTO permissions (codigo, descripcion, modulo) VALUES
('PROVEEDORES_VER', 'Permite visualizar el listado de proveedores', 'proveedor'),
('PROVEEDORES_CREAR', 'Permite registrar nuevos proveedores en el sistema', 'proveedor'),
('PROVEEDORES_EDITAR', 'Permite modificar información de proveedores existentes', 'proveedor'),
('PROVEEDORES_ELIMINAR', 'Permite eliminar proveedores del sistema', 'proveedor');

-- ============================================
-- 2.31. TABLA: proveedor_rubro (Rubros de proveedores)
-- ============================================

INSERT INTO permissions (codigo, descripcion, modulo) VALUES
('PROVEEDORES_RUBRO_VER', 'Permite visualizar los rubros de clasificación de proveedores', 'proveedor_rubro'),
('PROVEEDORES_RUBRO_CREAR', 'Permite crear nuevos rubros para proveedores', 'proveedor_rubro'),
('PROVEEDORES_RUBRO_EDITAR', 'Permite modificar rubros de proveedores', 'proveedor_rubro'),
('PROVEEDORES_RUBRO_ELIMINAR', 'Permite eliminar rubros de proveedores', 'proveedor_rubro');

-- ============================================
-- 2.32. TABLA: contrato_marco (Contratos marco)
-- ============================================

INSERT INTO permissions (codigo, descripcion, modulo) VALUES
('CONTRATO_MARCO_VER', 'Permite visualizar contratos marco con clientes', 'contrato_marco'),
('CONTRATO_MARCO_CREAR', 'Permite crear nuevos contratos marco', 'contrato_marco'),
('CONTRATO_MARCO_EDITAR', 'Permite modificar contratos marco existentes', 'contrato_marco'),
('CONTRATO_MARCO_ELIMINAR', 'Permite eliminar contratos marco del sistema', 'contrato_marco'),
('CONTRATO_MARCO_REPORTES', 'Permite acceder a reportes de contratos marco', 'contrato_marco');

-- ============================================
-- 2.33. TABLA: contrato_marco_presupuesto (Presupuestos de contratos marco)
-- ============================================

INSERT INTO permissions (codigo, descripcion, modulo) VALUES
('CONTRATO_MARCO_PRESUPUESTO_VER', 'Permite visualizar presupuestos asociados a contratos marco', 'contrato_marco_presupuesto'),
('CONTRATO_MARCO_PRESUPUESTO_CREAR', 'Permite crear presupuestos dentro de contratos marco', 'contrato_marco_presupuesto'),
('CONTRATO_MARCO_PRESUPUESTO_EDITAR', 'Permite modificar presupuestos de contratos marco', 'contrato_marco_presupuesto'),
('CONTRATO_MARCO_PRESUPUESTO_ELIMINAR', 'Permite eliminar presupuestos de contratos marco', 'contrato_marco_presupuesto');

-- ============================================
-- 2.34. TABLA: contrato_marco_talonario (Talonarios de contratos marco)
-- ============================================

INSERT INTO permissions (codigo, descripcion, modulo) VALUES
('CONTRATO_MARCO_TALONARIO_VER', 'Permite visualizar talonarios de contratos marco', 'contrato_marco_talonario'),
('CONTRATO_MARCO_TALONARIO_CREAR', 'Permite crear nuevos talonarios para contratos marco', 'contrato_marco_talonario'),
('CONTRATO_MARCO_TALONARIO_EDITAR', 'Permite modificar talonarios de contratos marco', 'contrato_marco_talonario'),
('CONTRATO_MARCO_TALONARIO_ELIMINAR', 'Permite eliminar talonarios de contratos marco', 'contrato_marco_talonario');

-- ============================================
-- 2.35. TABLA: user (Usuarios)
-- ============================================

INSERT INTO permissions (codigo, descripcion, modulo) VALUES
('USUARIOS_VER', 'Permite visualizar el listado de usuarios del sistema', 'usuarios'),
('USUARIOS_CREAR', 'Permite crear nuevos usuarios del sistema', 'usuarios'),
('USUARIOS_EDITAR', 'Permite modificar información de usuarios existentes', 'usuarios'),
('USUARIOS_ELIMINAR', 'Permite eliminar usuarios del sistema', 'usuarios');

-- ============================================
-- 2.36. TABLA: role (Roles y permisos)
-- ============================================

INSERT INTO permissions (codigo, descripcion, modulo) VALUES
('ROLES_VER', 'Permite visualizar los roles del sistema', 'permisos'),
('ROLES_CREAR', 'Permite crear nuevos roles con permisos personalizados', 'permisos'),
('ROLES_EDITAR', 'Permite modificar roles existentes y sus permisos', 'permisos'),
('ROLES_ELIMINAR', 'Permite eliminar roles del sistema', 'permisos'),
('PERMISOS_GESTIONAR', 'Permite gestionar permisos y asignarlos a roles', 'permisos');

-- Permisos para gestión de roles por proceso general (tabla intermedia role_proceso_general)
INSERT INTO permissions (codigo, descripcion, modulo) VALUES
('ROLE_PROCESO_GENERAL_VER', 'Permite visualizar los roles asignados a procesos generales', 'permisos'),
('ROLE_PROCESO_GENERAL_CREAR', 'Permite asignar roles a estados de procesos generales', 'permisos'),
('ROLE_PROCESO_GENERAL_EDITAR', 'Permite modificar roles de procesos generales', 'permisos'),
('ROLE_PROCESO_GENERAL_ELIMINAR', 'Permite eliminar asignaciones de roles de procesos generales', 'permisos');

-- ============================================
-- 2.37. TABLA: proceso_general (Procesos generales)
-- ============================================

INSERT INTO permissions (codigo, descripcion, modulo) VALUES
('PROCESO_GENERAL_VER', 'Permite visualizar los estados de procesos generales del sistema', 'presupuestos'),
('PROCESO_GENERAL_CREAR', 'Permite crear nuevos estados de proceso general', 'presupuestos'),
('PROCESO_GENERAL_EDITAR', 'Permite modificar estados de proceso general', 'presupuestos'),
('PROCESO_GENERAL_ELIMINAR', 'Permite eliminar estados de proceso general', 'presupuestos');

-- ============================================
-- 2.38. TABLA: area (Áreas organizacionales)
-- ============================================

INSERT INTO permissions (codigo, descripcion, modulo) VALUES
('AREA_VER', 'Permite visualizar las áreas de ventas de la empresa', 'area'),
('AREA_CREAR', 'Permite crear nuevas áreas de ventas organizacionales', 'area'),
('AREA_EDITAR', 'Permite modificar áreas de ventas existentes', 'area'),
('AREA_ELIMINAR', 'Permite eliminar áreas de ventas de la empresa', 'area');

-- ============================================
-- 2.39. TABLA: archivo (Archivos y documentos)
-- ============================================

INSERT INTO permissions (codigo, descripcion, modulo) VALUES
('ARCHIVOS_VER', 'Permite visualizar archivos adjuntos en el sistema', 'archivo'),
('ARCHIVOS_CREAR', 'Permite cargar nuevos archivos al sistema', 'archivo'),
('ARCHIVOS_EDITAR', 'Permite modificar información de archivos existentes', 'archivo'),
('ARCHIVOS_ELIMINAR', 'Permite eliminar archivos del sistema', 'archivo');

-- ============================================
-- 2.40. TABLA: auditoria (Auditoría y trazabilidad)
-- ============================================

INSERT INTO permissions (codigo, descripcion, modulo) VALUES
('AUDITORIA_VER', 'Permite visualizar los registros de auditoría del sistema', 'auditoria'),
('AUDITORIA_CREAR', 'Permite crear registros de auditoría manual', 'auditoria'),
('AUDITORIA_EDITAR', 'Permite modificar registros de auditoría', 'auditoria'),
('AUDITORIA_ELIMINAR', 'Permite eliminar registros de auditoría', 'auditoria'),
('AUDITORIA_PRESUPUESTO_HISTORIAL', 'Permite ver el historial de cambios de presupuestos en auditoría', 'auditoria');

-- ============================================
-- 2.41. TABLA: notificacion (Notificaciones)
-- ============================================

INSERT INTO permissions (codigo, descripcion, modulo) VALUES
('NOTIFICACIONES_VER', 'Permite visualizar notificaciones del sistema', 'notificacion'),
('NOTIFICACIONES_CREAR', 'Permite crear y enviar notificaciones a usuarios', 'notificacion'),
('NOTIFICACIONES_EDITAR', 'Permite modificar notificaciones existentes', 'notificacion'),
('NOTIFICACIONES_ELIMINAR', 'Permite eliminar notificaciones del sistema', 'notificacion');

-- ============================================
-- 2.42. TABLA: mensaje (Mensajes internos)
-- ============================================

INSERT INTO permissions (codigo, descripcion, modulo) VALUES
('MENSAJES_VER', 'Permite visualizar mensajes del sistema de comunicación interna', 'mensaje'),
('MENSAJES_CREAR', 'Permite crear y enviar mensajes a usuarios', 'mensaje'),
('MENSAJES_EDITAR', 'Permite modificar mensajes enviados', 'mensaje'),
('MENSAJES_ELIMINAR', 'Permite eliminar mensajes del sistema', 'mensaje');

-- ============================================
-- 2.43. INTEGRACIONES EXTERNAS
-- ============================================

-- Integración AFIP
INSERT INTO permissions (codigo, descripcion, modulo) VALUES
('AFIP_CONSULTAR_PADRON', 'Permite consultar el padrón de contribuyentes en AFIP', 'afip');

-- ============================================
-- 2.44. PERMISOS DE NAVEGACIÓN (RUTAS)
-- ============================================

INSERT INTO permissions (codigo, descripcion, modulo) VALUES
('RUTA_DASHBOARD', 'Inicio', 'rutas'),
('RUTA_USUARIOS', 'Usuarios', 'rutas'),
('RUTA_PRODUCTOS', 'Inventario', 'rutas'),
('RUTA_CATEGORIAS', 'Familia Productos', 'rutas'),
('RUTA_PRESUPUESTOS', 'Presupuestos', 'rutas'),
('RUTA_PRESUPUESTOS_ESTADISTICAS', 'Estadísticas presupuestos', 'rutas'),
('RUTA_CLIENTES', 'Clientes', 'rutas'),
('RUTA_RECURSOS', 'Recursos', 'rutas'),
('RUTA_INDICES', 'Índices', 'rutas'),
('RUTA_ALQUILERES', 'Alquileres', 'rutas'),
('RUTA_AREAS', 'Áreas', 'rutas'),
('RUTA_RECETAS', 'Recetas', 'rutas'),
('RUTA_ACTUALIZACIONES', 'Actualizaciones', 'rutas'),
('RUTA_MOVIMIENTOS_INVENTARIO', 'Movimientos Inventario', 'rutas'),
('RUTA_CONTRATOS_MARCO', 'Contratos Marco', 'rutas'),
('RUTA_PROVEEDORES', 'Proveedores', 'rutas'),
('RUTA_RUBROS', 'Rubros de Proveedores', 'rutas'),
('RUTA_METODO_PAGO', 'Método de Pago', 'rutas'),
('RUTA_CASHFLOW', 'Ver Cashflow', 'rutas'),
('RUTA_CASHFLOW_CATEGORIAS', 'Categorías Cashflow', 'rutas'),
('RUTA_CASHFLOW_ESTADISTICAS', 'Estadísticas Cashflow', 'rutas'),
('RUTA_BANCOS', 'Bancos', 'rutas'),
('RUTA_CENTRO_COSTO', 'Centros de Costos', 'rutas'),
('RUTA_ROLES', 'Roles', 'rutas');

-- ============================================
-- 3. ASIGNACIÓN DE PERMISOS AL ROL ADMINISTRADOR
-- ============================================

-- Asignar todos los permisos al rol administrador (role_id = 1)
INSERT INTO role_permissions (role_id, permission_id)
SELECT 1, id
FROM permissions;

-- ============================================
-- 4. ASIGNACIÓN DE ROLES A PROCESOS GENERALES
-- ============================================

-- Asignar el rol administrador a todos los procesos generales
INSERT INTO role_proceso_general (role_id, proceso_general_id)
SELECT 1, pg.id
FROM proceso_general pg
WHERE NOT EXISTS (
  SELECT 1
  FROM role_proceso_general rpg
  WHERE rpg.role_id = 1 AND rpg.proceso_general_id = pg.id
);
