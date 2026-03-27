const CHANGELOG_DATA = [
    {
        date: "25 de marzo, 2026",
        changes: [
            { type: "improved", text: "Se permite filtrar presupuestos por múltiples procesos generales simultáneamente" },
        ]
    },
    {
        date: "24 de marzo, 2026",
        changes: [
            { type: "new", text: "Se agrega módulo de simulaciones de cashflow: crear, guardar y editar escenarios desde cero o desde el estado actual" },
            { type: "improved", text: "El buscador de transacciones en simulaciones apunta a los datos simulados, no a los reales" },
            { type: "improved", text: "Los botones de importar y exportar Excel se ocultan al visualizar una simulación" },
        ]
    },
    {
        date: "20 de marzo, 2026",
        changes: [
            { type: "new", text: "Se agrega historico de precios de inventario" },
        ]
    },
    {
        date: "18 de marzo, 2026",
        changes: [
            { type: "new", text: "Se puede iniciar un trabajo desde el dashboard operario buscando una OT por número, sin necesidad de asignación previa" },
            { type: "fixed", text: "Se corrige error al entrar al mapa de carteles" },
        ]
    },
    {
        date: "17 de marzo, 2026",
        changes: [
            { type: "fixed", text: "Se corrige asignación de tipo (PRODUCCIÓN/SERVICIO) en ítems generados desde órdenes de contratos marco" },
        ]
    },
    {
        date: "16 de marzo, 2026",
        changes: [
            { type: "new", text: "Se agrega módulo Ubicaciones como activo con CRUD completo (nombre y descripción)" },
            { type: "new", text: "Se agregan Ubicaciones en el menú lateral bajo Activos" },
            { type: "improved", text: "La OT de mantenimiento permite seleccionar un único tipo de mantenimiento (obligatorio)" },
            { type: "new", text: "Se pueden agregar materiales/suministros al crear una OT de mantenimiento con reserva de stock automática" },
            { type: "improved", text: "El selector de unidad de medida en materiales de OT muestra la equivalencia en unidades base a descontar" },
            { type: "improved", text: "La impresión de OT de mantenimiento muestra el tipo del recurso junto al código" },
            { type: "new", text: "Se puede exportar la tabla de reservas a Excel" },
            { type: "improved", text: "La tabla de reservas permite filtrar por número, OT, trabajo y creador por columna" },
            { type: "improved", text: "El botón para agregar conversión de inventario se accede desde el formulario del producto" },
        ]
    },
    {
        date: "15 de marzo, 2026",
        changes: [
            { type: "new", text: "Se agrega creación de Órdenes de Trabajo de mantenimiento desde el recurso de alquiler" },
            { type: "new", text: "Se agrega tipo a los ítems de presupuesto (Servicio, Producción, Mantenimiento)" },
            { type: "new", text: "Se agrega estado EN MANTENIMIENTO para presupuestos de tipo mantenimiento" },
            { type: "improved", text: "La tabla de presupuestos muestra columna de tipo de ítem con filtrado" },
            { type: "improved", text: "El campo Comprador en presupuesto pasa a ser opcional" },
            { type: "new", text: "Se agrega selección explícita de trabajos por ítem de presupuesto (Trabajos adicionales)" },
            { type: "improved", text: "Las tabs de carga de costos se deshabilitan si el trabajo no está seleccionado en Trabajos adicionales" },
            { type: "improved", text: "Al asignar una receta se pre-seleccionan automáticamente los trabajos que tienen costos cargados" },
            { type: "improved", text: "Los trabajos seleccionados se persisten y se cargan correctamente al editar el ítem" },
            { type: "improved", text: "La OT de mantenimiento ahora usa react-hook-form con validación y permite múltiples tareas" },
        ]
    },
    {
        date: "14 de marzo, 2026",
        changes: [
            { type: "new", text: "Se agrega módulo Carteles con CRUD completo, mapa de ubicación y selector de coordenadas" },
            { type: "new", text: "Se agrega módulo Trailers con CRUD completo" },
            { type: "new", text: "Se agregan secciones Carteles y Trailers en el menú bajo Activos" },
            { type: "new", text: "El mapa de carteles se mueve a la página de Carteles con una solapa dedicada" },
            { type: "improved", text: "La tabla de Recursos se simplifica mostrando solo datos generales (código, proveedor, tipo, estado, precio)" },
            { type: "improved", text: "Al seleccionar un recurso en el formulario de alquiler se carga automáticamente localidad y zona desde el cartel" },
            { type: "improved", text: "La flota de vehículos se integra al sistema de activos habilitando contratos y precios futuros" },
            { type: "improved", text: "El equipamiento se integra al sistema de activos habilitando contratos y precios futuros" },
            { type: "improved", text: "Se puede filtrar por código en las tablas de Flota y Equipamiento" },
            { type: "improved", text: "El selector de flota en jornadas muestra correctamente el vehículo asignado al editar" },
            { type: "improved", text: "El selector de equipamiento en jornadas muestra correctamente el equipo asignado al editar" },
        ]
    },
    {
        date: "13 de marzo, 2026",
        changes: [
            { type: "improved", text: "se permite colocar el . como separador decimal en el input number" },
        ]
    },
    {
        date: "12 de marzo, 2026",
        changes: [
            { type: "new", text: "Se agrega módulo de Equipamiento (maquinarias, herramientas, computadoras, etc.) con CRUD completo" },
            { type: "new", text: "Se agrega sección Flota en el menú con gestión de vehículos y asignación a jornadas" },
            { type: "new", text: "Se agrega mapa de carteles con visualización geográfica de todos los recursos tipo cartel" },
            { type: "new", text: "Se pueden cargar coordenadas a los recursos mediante un mapa interactivo con selector de punto" },
            { type: "improved", text: "Se pueden asignar equipos de trabajo a las jornadas además de vehículos de flota" },
            { type: "improved", text: "La tarjeta de jornada en el calendario muestra la cantidad de equipamiento asignado" },
            { type: "improved", text: "El estado de los carteles se muestra en el mapa con marcadores de color por estado" },
            { type: "improved", text: "El popup del mapa muestra cliente y vencimiento de contrato cuando el cartel está arrendado" },
            { type: "improved", text: "Se elimina el estado 'En Mantenimiento' y se reemplaza por un badge de OT activa junto al estado en la tabla" },
        ]
    },
    {
        date: "5 de marzo, 2026",
        changes: [
            { type: "new", text: "Se agrega sección Producción en el menú con Panel Operarios y Estadísticas" },
            { type: "new", text: "Los operarios pueden identificarse por DNI y ver sus asignaciones del día" },
            { type: "new", text: "Se agrega control de inicio y fin de trabajo por asignación de operario" },
            { type: "new", text: "Se agrega panel de jornadas en curso para supervisión en tiempo real" },
            { type: "new", text: "Se agrega vista 'Estado del personal' en Producción con indicador de asignación de jornada por operario" },
            { type: "new", text: "Se agrega buscador de transacciones en el cashflow" },
            { type: "improved", text: "Se agrega tercer gráfico en la Visión General de cashflow con transacciones por fecha al seleccionar una categoría" },
            { type: "improved", text: "Se mejora el encabezado del cashflow con títulos más compactos" },
        ]
    },
    {
        date: "2 de marzo, 2026",
        changes: [
            { type: "new", text: "Se agrega sección 'Visión General' en el dashboard de cashflow con proyección de ingresos y egresos pendientes por rubro y categoría" },
            { type: "improved", text: "El dashboard de cashflow ahora tiene dos vistas: Visión General y Estadísticas Avanzadas" },
        ]
    },
    {
        date: "1 de marzo, 2026",
        changes: [
            { type: "new", text: "Se agrega visualización de fotos de inventario en el formulario de solicitud de compras" },
            { type: "new", text: "Se agrega nuevo estado 'Pendiente de Compras' en el proceso general de presupuestos" },
            { type: "new", text: "Se agregan secciones 'Enviadas a almacén' y 'Pendientes compras' en el dashboard de presupuestos" },
        ]
    },
    {
        date: "26 de febrero, 2026",
        changes: [
            { type: "new", text: "Se agrega selector de persona que retira en el formulario de egreso masivo" },
            { type: "improved", text: "El botón PDF en egreso masivo ahora está disponible para todos los tipos (OT, Centro de Costo y Reserva)" },
            { type: "improved", text: "El PDF de egreso de OT reutiliza la plantilla de reserva, mostrando 'Sin Reserva' cuando no aplica" },
            { type: "improved", text: "Se agrega información de la orden de compra (número, presupuesto, estado y fecha) en el encabezado del formulario" },
            { type: "improved", text: "La tabla de órdenes de compra recuerda los filtros, ordenamiento y paginación entre sesiones" },
        ]
    },
    {
        date: "23 de febrero, 2026",
        changes: [
            { type: "fixed", text: "Se corrige cálculo de importe bruto al ingresar montos con decimales en formulario de factura" },
            { type: "improved", text: "El formulario de envío de notificaciones ahora muestra el mensaje con formato visual (HTML renderizado)" },
            { type: "improved", text: "El detalle de un envío de notificación ahora muestra el cuerpo del mensaje renderizado en lugar de HTML crudo" },
            { type: "improved", text: "Se muestra el ID de la oferta junto al estado en la tabla de órdenes de compra" },
        ]
    },
    {
        date: "22 de febrero, 2026",
        changes: [
            { type: "new", text: "Se agrega envío real de emails al notificar clientes por facturas pendientes" },
            { type: "new", text: "Se agrega página de configuración de notificaciones (SMTP, modo prueba y email de prueba)" },
            { type: "new", text: "Se agrega editor de texto enriquecido para plantillas de notificaciones" },
            { type: "improved", text: "Las notificaciones por email ahora muestran la tabla de facturas con formato visual en el cuerpo del mensaje" },
            { type: "improved", text: "Se mejora el formulario de factura: el importe bruto ahora es editable y calcula el monto neto automáticamente" },
            { type: "improved", text: "Se reemplaza el cambio de estado de factura por edición completa desde la tabla" },
            { type: "improved", text: "Se agregan botones de editar y eliminar cobros en la tabla expandida de facturas" },
        ]
    },
    {
        date: "20 de febrero, 2026",
        changes: [
            { type: "new", text: "Se agrega columna N° de presupuesto/alquiler en tabla de facturas con enlace al modelo" },
            { type: "new", text: "Se agrega funcionalidad de cobro masivo para procesar múltiples facturas en una sola transacción" },
            { type: "improved", text: "Se puede filtrar facturas por número de presupuesto o alquiler" },
        ]
    },
    {
        date: "19 de febrero, 2026",
        changes: [
            { type: "new", text: "Se agrega exportación de cashflow a Excel por rango de fechas y agrupación (diaria, semanal, mensual, trimestral)" },
        ]
    },
    {
        date: "18 de febrero, 2026",
        changes: [
            { type: "improved", text: "Se permite seleccionar facturas individualmente para notificar solo las seleccionadas" },
            { type: "improved", text: "Se muestra el destinatario (email o teléfono) en el historial de envíos de notificaciones" },
            { type: "improved", text: "Se genera un registro de envío por cliente en lugar de por factura" },
        ]
    },
    {
        date: "17 de febrero, 2026",
        changes: [
            { type: "new", text: "Se agrega módulo de plantillas de notificación para facturas" },
            { type: "new", text: "Se agrega historial de envíos de notificaciones" },
            { type: "new", text: "Se agrega envío masivo de notificaciones por email o WhatsApp desde el dashboard de facturación" },
            { type: "improved", text: "Se agregan campos de contacto para pagos a proveedores en clientes (email y teléfono)" },
        ]
    },
    {
        date: "10 de febrero, 2026",
        changes: [
            { type: "new", text: "Se agrega campo TNA (Tasa Nominal Anual) en bancos" },
            { type: "improved", text: "Se muestra patente de equipamiento en selector y jornadas" },
        ]
    },
    {
        date: "9 de febrero, 2026",
        changes: [
            { type: "improved", text: "Se agregan campos específicos para tipos de equipamiento (VIN, horas de marcha, capacidad de izaje, cantidad de ejes, cantidad de auxilio)" },
            { type: "improved", text: "Se agrega discriminación visual por colores en jornadas según tipo (servicio en azul, producto en amarillo)" },
            { type: "improved", text: "Se habilita eliminación de tipos de equipamiento con control de permisos" },
            { type: "improved", text: "Se deshabilita creación de nuevos tipos de equipamiento y edición del campo código" },
        ]
    },
    {
        date: "8 de febrero, 2026",
        changes: [
            { type: "new", text: "Se agrega sección Flota en el menú lateral" },
            { type: "improved", text: "Se mejora sistema de iconos en navegación para carga automática" },
            { type: "improved", text: "Se agrega asociación de equipamiento a jornadas de trabajo" },
            { type: "improved", text: "Se mejora gestión de adjuntos y fotos en equipamiento" },
        ]
    },
    {
        date: "5 de febrero, 2026",
        changes: [
            { type: "improved", text: "Se agrega opcion para ver ofertas desde la tabla de solcoms" },
            { type: "improved", text: "Se agrega comparativa en todas las tablas de ofertas" },
        ]
    },
    {
        date: "3 de febrero, 2026",
        changes: [
            { type: "new", text: "Se agrega campo banco en el formulario de cobro, asociado automáticamente a la transacción del cashflow" },
            { type: "new", text: "Se agrega opción de marcar transacciones como proyectado o real en lote desde el cashflow" },
            { type: "new", text: "Se agrega opción de mostrar u ocultar el banco asociado en cada transacción del cashflow" },
            { type: "new", text: "Se agrega pagina para ver todos los presupuestos de compras" },
            { type: "improved", text: "Se muestra el monto total de las transacciones seleccionadas en la barra de acciones del cashflow" },
            { type: "improved", text: "Se persiste el estado de secciones expandidas y opciones de visualización del cashflow entre sesiones" },
            { type: "improved", text: "Se agrega el nombre del solicitante en el formulario de solcom" },
            { type: "fixed", text: "Se agrega el creador en la tabla de reservas" },
        ]
    },
    {
        date: "2 de febrero, 2026",
        changes: [
            { type: "improved", text: "Se agregaron mejoras en el cashflow" },
        ]
    },
    {
        date: "28 de enero, 2026",
        changes: [
            { type: "new", text: "Se agrega la posibilidad de rechazar ofertas de compras" },
            { type: "improved", text: "Se mejora la vista semanal en el cashflow" },
        ]
    },
    {
        date: "27 de enero, 2026",
        changes: [
            { type: "fixed", text: "Se corrige error al realizar egresos de mercaderia relacionado con los movimientos de inventario" },
        ]
    },
    {
        date: "26 de enero, 2026",
        changes: [
            { type: "improved", text: "Se agregan mejoras sobre visualizacion de stock" },
            { type: "fixed", text: "Se agrega auditoria de los cambios de estado en modulo de compras" },
        ]
    },
    {
        date: "23 de enero, 2026",
        changes: [
            { type: "new", text: "Se agrega el modulo de reservas " },
            { type: "new", text: "Se agrega la posibilidad de realizar solcom desde la verificacion de almacen " },
            { type: "new", text: "Se agrega la posibilidad de realizar un egreso a traves de una reserva " },
            { type: "new", text: "Se agrega en las ofertas el presupuesto y el centro de costo" },
            { type: "new", text: "Se asocia a los movimientos de inventario, persona y reserva" },

        ]
    },
    {
        date: "22 de enero, 2026",
        changes: [
            { type: "fixed", text: "Se corrige error en la vista mensual del calendario" },
            { type: "fixed", text: "Se corrige error en la visualizacion de las ofertas de la solcom" },
        ]
    },
    {
        date: "21 de enero, 2026",
        changes: [
            { type: "improved", text: "Se agrega la opcion de aprobar ofertas desde la tabla comparativa" },
            { type: "improved", text: "Se agrega la opcion de cambiar colores desde la tabla de ofertas" },
        ]
    },
    {
        date: "20 de enero, 2026",
        changes: [
            { type: "improved", text: "Se agrega filtro de solcom en la tabla de ofertas" },
        ]
    },
    {
        date: "16 de enero, 2026",
        changes: [
            { type: "new", text: "Se agrega opción de duplicar ofertas desde el detalle de la oferta" },
            { type: "new", text: "Se agrega columna 'Fecha Límite' en la tabla de items de SOLCOMs" },
            { type: "new", text: "Se agrega botón 'Limpiar datos' en el menú de configuración para borrar el almacenamiento local" },
            { type: "improved", text: "Se agrega filtro de rango en las fechas de las solcoms" },
            { type: "fixed", text: "Se corrigen los filtros de items de solcoms" },
            { type: "fixed", text: "Se optimiza la consulta de items de solcoms" },
        ]
    },
    {
        date: "15 de enero, 2025",
        changes: [
            { type: "new", text: "Se permite la edicion de las observaciones de las ordenes de compras emitidas" },
            { type: "new", text: "Se corrige error al dirigir hacia una solcom" },
        ]
    },
    {
        date: "13 de enero, 2025",
        changes: [
            { type: "new", text: "Se permite asignar compradores por producto individual en las solicitudes de compra" },
            { type: "new", text: "Se agrega opción para asignar múltiples productos a un comprador en una sola acción" },
            { type: "new", text: "Se realiza migracion de ofertas al nuevo esquema" },
            { type: "fixed", text: "Se corrige error al aplicar filtros de rango de precios y cantidades en las tablas" },
        ]
    },
    {
        date: "9 de enero, 2026",
        changes: [
            { type: "fixed", text: "Se permite la posibilidad de eliminar jornadas de trabajo" },
            { type: "new", text: "Se agregan filtros al modulo de jornadas de trabajo" },
            { type: "improved", text: "Se optimiza la consulta de los presupuestos de ordenes de compras" },
        ]
    },
    {
        date: "8 de enero, 2026",
        changes: [
            { type: "fixed", text: "Se utiliza la fecha mayor a la hora de crear la transaccion en el cashflow para los presupuestos" },
            { type: "improved", text: "Se simplifica la logica de creacino de jornadas de trabajo" },
        ]
    },
    {
        date: "6 de enero, 2026",
        changes: [
            { type: "fixed", text: "Se corrige error al cargar las facturas y cobros" },
            { type: "fixed", text: "Se corrige error para las aprobaciones automaticas de gerencia en las ofertas" },
        ]
    },
    {
        date: "5 de enero, 2026",
        changes: [
            { type: "new", text: "Se agrega el modulo de casos de ventas" },
            { type: "new", text: "Se agrega el modulo de jornadas de trabajos" },
            { type: "new", text: "Se agrega el modulo de personas" },
            { type: "new", text: "Se unifica la facturacion y cobros de los presupuestos y alquileres" },
            { type: "improved", text: "Se mejoran los eventos de facturacion y cobros asociados al cashflow" },
        ]
    },
    {
        date: "18 de diciembre, 2025",
        changes: [
            { type: "new", text: "Se agrega configuración para limite de compras" },
            { type: "fixed", text: "Se corrige error en el datepicker" },
            { type: "improved", text: "Se autoaprueba si el presupuesto es menor al minimo de compra por gerencia" },

        ]
    },
    {
        date: "17 de diciembre, 2025",
        changes: [
            { type: "new", text: "Se crea sistema de calendarios reutilizable para distintos módulos" },
            { type: "improved", text: "Se mejora la estructura del calendario de contactos" },
            { type: "improved", text: "Se optimiza la carga de contratos marco de presupuesto" },
            { type: "improved", text: "Se optimiza la generación de PDF de órdenes de compra" },
            { type: "fixed", text: "Se corrige visualización de items históricos en formulario de contratos marco producto" },
        ]
    },
    {
        date: "16 de diciembre, 2025",
        changes: [
            { type: "improved", text: "Se agregan mejoras de usabilidad al modulo de ventas" },
        ]
    },
    {
        date: "12 de diciembre, 2025",
        changes: [
            { type: "improved", text: "Se agrega el proveedor a la tabla de ordenes de compras" },
            { type: "new", text: "Se agrega modulo de ventas" },

        ]
    },
    {
        date: "10 de diciembre, 2025",
        changes: [
            { type: "fixed", text: "Se corrige error al cargar conceptos sin precio unitario" },
            { type: "fixed", text: "Se corrige error al agrupar los conceptos en los analisis de inventario" },
            { type: "new", text: "Se agrega formulario para manejo de los tipos de contacto" },

        ]
    },
    {
        date: "5 de diciembre, 2025",
        changes: [
            { type: "new", text: "Se agregan las vistas 'Mis Presupuestos' y 'Presupuestos Activos' con tablas independientes" },
            { type: "new", text: "Se agrega sistema de comparación de ofertas con selección múltiple mediante checkboxes" },
            { type: "new", text: "Se agrega botón 'Comparar' en las tablas de ofertas para análisis lado a lado" },
            { type: "new", text: "Se agrega página '/ofertas/comparar' con visualización comparativa de ofertas" },
            { type: "new", text: "Se agrega componente selector de color para ofertas" },
            { type: "new", text: "Se agregan campos 'color' y 'favorito' en ofertas para mejor organización" },
            { type: "improved", text: "Se mejora el selector de proveedores con búsqueda en tiempo real y scroll infinito" },
            { type: "improved", text: "Se permite reasignar comprador en solicitudes de compra" },
            { type: "improved", text: "Se agrega horario de atención y recepción de mercadería en los pdf de solcom y oc" },
            { type: "improved", text: "Tabla comparativa muestra productos como filas y proveedores como columnas con precios unitarios y totales" },
            { type: "improved", text: "Diseño minimalista con información colapsable (validez, disponibilidad, moneda, observaciones)" },
            { type: "improved", text: "Indicadores visuales de mejor precio: unitario (verde) y total (azul)" },
            { type: "improved", text: "Ofertas favoritas resaltadas con fondo amarillo y mejor oferta general con color primario" },
            { type: "improved", text: "Soporte completo para modo oscuro con buen contraste en comparativas" },
            { type: "fixed", text: "Se corrige el filtrado de ofertas por SOLCOM para buscar correctamente por ID numérico" },
        ]
    },
    {
        date: "1 de diciembre, 2025",
        changes: [
            { type: "fixed", text: "Se corrigio cuit y domicilio fiscal en las ordes de compras" },
            { type: "new", text: "Se agrega persistencia de filtros en las solcoms" },
            { type: "new", text: "Se agrega la posibilidad de visualizar los items de una solcom" },

        ]
    },
    {
        date: "27 de noviembre, 2025",
        changes: [
            { type: "improved", text: "El número de ingresos brutos pasa a ser campo opcional en proveedores" },
            { type: "improved", text: "Se agregan los campos base de auditoria en los proveedores" },
            { type: "new", text: "Se agregan el monto total en las ofertas" },
        ]
    },
    {
        date: "26 de noviembre, 2025",
        changes: [
            { type: "fixed", text: "Se corrige error al visualizar la solcom de una oferta" },
            { type: "improved", text: "Se agrega mejor descripcion a las transacciones de facturacion y cobros" },
            { type: "improved", text: "Se auditan el campo descripcion de los presupuestos y sus items" },
        ]
    },
    {
        date: "20 de noviembre, 2025",
        changes: [
            { type: "new", text: "Se agrega la opcion para duplicar presupuestos" },
            { type: "new", text: "Se agrega la opcion cancelar ordenes de compra" },
            { type: "new", text: "Se agrega la opción para generar pdf de las solicitudes de compras" },
            { type: "improved", text: "Se agrega la opción para modificar los impuestos" },
        ]
    },
    {
        date: "19 de noviembre, 2025",
        changes: [
            { type: "improved", text: "Se agrega servicio para editar el estado de las solicitudes de compra" },
            { type: "fixed", text: "Se corrige error en la edición de rubros de proveedores" },
            { type: "fixed", text: "Se corrige error en la creación de los métodos de pagos" },
            { type: "new", text: "Se agregan nuevos campos en proveedores" },
            { type: "new", text: "Se agregan items de descripcion para la orden de compra" },

        ]
    },
    {
        date: "18 noviembre, 2025",
        changes: [{ type: "fixed", text: "Se corrige error en actualización de recepción de orden de compra" }]
    },
    {
        date: "17 noviembre, 2025",
        changes: [{ type: "new", text: "Se agrega modulo de compras" }]
    },
    {
        date: "11 noviembre, 2025",
        changes: [
            { type: "improved", text: "Se agregan unidades faltantes" },
            { type: "improved", text: "Se mejora el buscador de productos" },
            { type: "improved", text: "Se crea un permiso para listar ots " },

        ]
    },
    {
        date: "10 noviembre, 2025",
        changes: [
            { type: "new", text: "Se agrega unidad de medida en costeo tecnico" },
            { type: "improved", text: "Se mejora la diferencia para el calculo del cashflow" },

        ]
    },
    {
        date: "3 noviembre, 2025",
        changes: [
            { type: "fixed", text: "Se agrega un nuevo filtro para ver los presupuestos en mis procesos generales asignados" },
        ]
    },
    {
        date: "31 octubre, 2025",
        changes: [
            { type: "fixed", text: "Se corrige en el filtrado de los clientes en los dashboards" },
            { type: "fixed", text: "Se agregan el iva en los montos proyectados y cobrados" },
        ]
    },
    {
        date: "27 octubre, 2025",
        changes: [
            { type: "improved", text: "Se agrega el estado enviado a almacen" },
            { type: "improved", text: "Se agregan procesos generales a los roles de produccion y servicio" },
            { type: "fixed", text: "Se corrige el formato en la visualizacion del presupuesto" },
        ]
    },
    {
        date: "24 octubre, 2025",
        changes: [
            { type: "fixed", text: "Se corrige visualización de descubierto bancario - ahora muestra el último valor registrado en lugar de 0 cuando no hay saldo del día actual" },
            { type: "improved", text: "El saldo acumulado del cashflow ahora resta automáticamente los descubiertos bancarios usados a partir de la fecha actual" },
            { type: "improved", text: "Los reportes de cashflow también consideran descubiertos bancarios para mostrar el dinero real disponible" },
            { type: "new", text: "Se agrega solapa de Historial en presupuestos con línea de tiempo horizontal mostrando todos los cambios de estado con colores del proceso, usuario y fecha de cada cambio" },
            { type: "new", text: "Se agrega análisis de tiempo acumulado por proceso general en formato de cards (4 por fila) - muestra días/horas/minutos totales en cada estado con porcentajes y barras de progreso" },
            { type: "new", text: "Se agrega dashboard de producción" },
            { type: "improved", text: "El PDF de presupuestos ahora muestra la fecha histórica desde la auditoría cuando el presupuesto pasó a estado 'Propuesta Preparada' en lugar de la fecha actual" },
        ]
    },
    {
        date: "22 octubre, 2025",
        changes: [
            { type: "new", text: "Se agrega módulo de Centros de Costo para gestión de egresos" },
            { type: "improved", text: "Se refactoriza sistema de movimientos de inventario - simplificación del flujo de egresos" },
            { type: "improved", text: "Se modifica formulario de movimientos para soportar Centro de Costo y presupuesto directamente" },
            { type: "improved", text: "Se agrega validación de stock disponible en formularios de egreso (individual y masivo)" },
            { type: "improved", text: "Se mejora cálculo de stock libre para evitar valores negativos" },
            { type: "new", text: "Se agrega pestaña de Análisis de Inventario en presupuestos (materiales, suministros, mano de obra, productos extras)" },
            { type: "improved", text: "Se optimiza cálculo de stock reservado excluyendo las reservas de la OT actual en análisis" },
            { type: "improved", text: "Se simplifica gestión de reservas - uso de reserva ahora genera movimiento OUT" },
            { type: "improved", text: "Se agregan indicadores visuales de stock disponible vs necesario en análisis de presupuestos" },
            { type: "improved", text: "Se mejora UX del formulario de verificación de almacén mostrando detalle de productos sin stock" },
            { type: "improved", text: "Se agrega botón de egreso masivo directo desde tabla de inventario" },
            { type: "fixed", text: "Se corrige eliminación de stockReservado en duplicado de productos" },
        ]
    },
    {
        date: "20 octubre, 2025",
        changes: [
            { type: "improved", text: "Se agrega la posibilidad de visualizar el cashflow por mes dia semanas y Q" },
            { type: "improved", text: "Se agrega la posibilidad de editar las categorias de una transaccion" },
            { type: "improved", text: "Se agrega la posibilidad de editar multiples transacciones" },

        ]
    },
    {
        date: "15 octubre, 2025",
        changes: [
            { type: "fixed", text: "Se corrige error al sumar las reservas de materiales de otras ots" },
            { type: "improved", text: "Se agrega la posibilidad de no contabilizar un monto en la cuenta" },

        ]
    },
    {
        date: "11 octubre, 2025",
        changes: [
            { type: "new", text: "Se agrega descubierto y su uso en los bancos", },
            { type: "improved", text: "Se agregan filtros de categorias en los dashboard de cash" },
        ]
    },
    {
        date: "9 octubre, 2025",
        changes: [
            { type: "fixed", text: "Se permite ingresar nros negativos en los bancos" },
            { type: "fixed", text: "Se permite ingresar bancos sin logos" },
            { type: "improved", text: "Se corrige el layout de la pagina de dashboard" },
            { type: "improved", text: "Se muestra el dia actual con un color distintivo" },
            { type: "improved", text: "Se mejora el comportamiento del selector de fechas en rangos" },

        ]
    },
    {
        date: "8 octubre, 2025",
        changes: [
            { type: "improved", text: "Se elimina el campo 'proyectado' de las transacciones del cashflow" },
            { type: "new", text: "Se agrega fecha a las transacciones" },
            { type: "new", text: "Se agregan bancos y saldos" },
            { type: "new", text: "Se agrega reporte de saldos" },

        ]
    },
    {
        date: "6 octubre, 2025",
        changes: [
            { type: "new", text: "Se crea el rol de finanzas" },
            { type: "new", text: "Se crea el dashboard del cashflow" },
            { type: "improved", text: "Se agrega el campo 'proyectado' a las transacciones del cashflow" },

        ]
    },
    {
        date: "3 octubre, 2025",
        changes: [
            { type: "new", text: "Se crea el modulo de cashflow" },
            { type: "fixed", text: "Se corrige error en el campo monto para todos los formularios (se invierten las , por los .) " },
            { type: "improved", text: "Se agregan validaciones en los formularios de carga de facturas de presupuestos" },


        ]
    },
    {
        date: "30 septiembre, 2025",
        changes: [
            { type: "improved", text: "Se agrega fecha vencimiento a las facturas de los presupuestos" },
            { type: "improved", text: "Se asocia cobro con facturas" },
            { type: "improved", text: "Se agrega retenciones a los cobros" },
            { type: "new", text: "Se crea abm de metodos de pago" },
            { type: "improved", text: "Se asocia metodos de pago a los cobros" },
            { type: "fixed", text: "Se corrige error en la validacion de los datos de la factura y los cobros" },
            { type: "new", text: "Se crea abm de categorias de cashflow" },

        ]
    },
    {
        date: "25 septiembre, 2025",
        changes: [
            { type: "fixed", text: "Se corrige error en costeo costeo tecnico" },
            { type: "fixed", text: "Se corrige error en realizar reservas decimales" },

        ]
    },
    {
        date: "24 septiembre, 2025",
        changes: [
            { type: "fixed", text: "Se corrige el error al obtener los datos de los proveedores desde AFIP" },
            { type: "new", text: "Se agrega la tarjeta de facturacion mensual" },

        ]
    },
    {
        date: "22 septiembre, 2025",
        changes: [
            { type: "new", text: "Se crea el abm de proveedores y rubros" },
            { type: "new", text: "Se crea el web service de afip" },
            { type: "new", text: "Se integra con el servicio de AFIP para obtener los datos de los proveedores" },
        ]
    },
    {
        date: "16 septiembre, 2025",
        changes: [
            { type: "improved", text: "Se agregan graficos para filtrar por cantidad de ots para un proceso general" },
            { type: "improved", text: "Se agregan graficos administrativos, de producto, de servicio y de ventas" },
            { type: "new", text: "Se agregan la cantidad de dias que las ots estan en estado de auditoria" },
        ]
    },
    {
        date: "12 septiembre, 2025",
        changes: [
            { type: "fixed", text: "Se corrige el formato de la fecha en los presupuestos" },
            { type: "fixed", text: "Se corrige error que genera presupuestos duplicados al hacer doble click en guardar" },
        ]
    },
    {
        date: "11 septiembre, 2025",
        changes: [
            { type: "new", text: "Se agregaron los gráficos de ventas por proceso teniendo en cuenta las tablas de auditoria" },
            { type: "improved", text: "Se mejoro el diseño de las tarjetas " },
            { type: "fixed", text: "Se corrige la logica para realizar la auditoria de los presupuestos" },
            { type: "fixed", text: "Se corrige error al verificar stock de productos" },

        ]
    },
    {
        date: "9 septiembre, 2025",
        changes: [
            { type: "improved", text: "Se modifica el diseño de los gráficos de ventas, cada tarjeta tiene asociado un gráfico" },

        ]
    },
    {
        date: "5 septiembre, 2025",
        changes: [
            { type: "new", text: "Se agregan gráficos de ventas por proceso general" },
            { type: "fixed", text: "Se corrige para que todos los usuarios puedan descargar excel" },

        ]
    },
    {
        date: "4 septiembre, 2025",
        changes: [
            { type: "new", text: "Se agrega navegación completa en charts: semana → clientes → presupuestos individuales" },
            { type: "improved", text: "Listado de presupuestos ordenado por monto con navegación directa al detalle" },
        ]
    },
    {
        date: "3 septiembre, 2025",
        changes: [
            { type: "new", text: "Se agrega dashboard de ventas por fecha de fabricación estimada" },
            { type: "new", text: "Se agrega dashboard de ventas por fecha de entrega estimada" },
            { type: "improved", text: "Dashboards de presupuestos con vista semanal y drill-down por cliente" },
            { type: "improved", text: "Diseño responsive para dashboards con layout de 2 columnas" },
        ]
    },
    {
        date: "2 septiembre, 2025",
        changes: [
            { type: "improved", text: "Se agregan valores por defecto para comisiones en presupuestos de contrato marco" },
            { type: "fixed", text: "Se corrigen validaciones en formulario de presupuesto de contrato marco producto" },
        ]
    },
    {
        date: "1 septiembre, 2025",
        changes: [
            { type: "fixed", text: "Se corrige error al ordenar por los productos por categorias" },
            { type: "new", text: "Se realiza la migracion de inventario" },
        ]
    },
    {
        date: "26 agosto, 2025",
        changes: [
            { type: "improved", text: "Se permiten los decimales en las cantidades de los presupuestos" },
            { type: "improved", text: "Se muestra elmonto de los contratos marcos en formato moneda" },
            { type: "improved", text: "Se agrega la posibilidad de modificar inventario con o sin stock" },
        ]
    },
    {
        date: "25 agosto, 2025",
        changes: [
            { type: "new", text: "Se agrega la opcion de visualizar las unidades de medida" },
            { type: "new", text: "Se agrega la opcion de migrar inventario en base a un excel" },
            { type: "improved", text: "Se agrega la opcion de visualizar los contratos marcos como grilla" },
            { type: "improved", text: "Se agrega libra como unidad de medida" },
        ]
    },
    {
        date: "22 agosto, 2025",
        changes: [
            { type: "fixed", text: "Se corrige error de validacion de fechas de servicio" },
            { type: "fixed", text: "Se corrige error al entrar a la pagina de estadisticas de contrato marco si no tiene monto" },
            { type: "improved", text: "Se agrega la opcion de eliminar productos pero mantenga las referencias de los productos" },
            { type: "new", text: "Se agrega la funcionalidad de subcategorías para productos" },
        ]
    },
    {
        date: "20 agosto, 2025",
        changes: [
            { type: "fixed", text: "Se corrige error al crear presupuestos con items duplicados" },
            { type: "improved", text: "Se agregan nombres de columnas descriptivos en los reportes de presupuestos" },
        ]
    },
    {
        date: "18 agosto, 2025",
        changes: [
            { type: "new", text: "Se agregaro la solapa de estadisticas por contrato marco" },
            { type: "improved", text: "Se actualiza el estado de las ordenes de CM sola si esta activa" },
            { type: "improved", text: "Se corrige los tipos de datos para los campos de costeo comercial" },
            { type: "improved", text: "Se cambio el orden de las columnas ancho por alto en las ordenes de producto" },
            { type: "fixed", text: "Se corrige de desincronizacion entre ordenes de contrato marco y ots" },
            { type: "improved", text: "Se agregan los campos de auditoria para los items del presupuesto" },
            { type: "improved", text: "Se unifican los servicios de ordenes de producto y servicio" },
        ]
    },
    {
        date: "14 agosto, 2025",
        changes: [
            { type: "new", text: "Se agrega el formulario de ordenes de producto" },
            { type: "fixed", text: "Se error en costeo tecnico que no permitia cargar cantidades decimales" },
        ]
    },
    {
        date: "13 agosto, 2025",
        changes: [
            { type: "fixed", text: "Se corrige de mostrar de mostrar el estado en la tabla" },
            { type: "fixed", text: "Se corrige error al mostrar el talonario de la orden de servicio en el estado finalizado" },
            { type: "new", text: "Se agrega la posibilida de incluir items de concepto en costeo técnico" },
        ]
    },
    {
        date: "12 agosto, 2025",
        changes: [
            { type: "fixed", text: "Se corrige error al eliminar registros" },
            { type: "fixed", text: "Se corrige error al duplicar los talonarios" },
            { type: "new", text: "Agrega la posibilida de descargar reportes de inventario" },
            { type: "improved", text: "Se agrega el campo de Familia y subcategoria de inventario" },
        ]
    },
    {
        date: "11 agosto, 2025",
        changes: [
            { type: "new", text: "Se crea el módulo de contratos marcos" },
            { type: "new", text: "Se crea la posibilidad de crear contratos marcos" },
            { type: "new", text: "Se crea la posibilidad de crear talonarios" },
            { type: "new", text: "Se asocia cada item del talonario a una receta" },
            { type: "new", text: "Se crea la posibilidad de crear ordenes de servicio" },
            { type: "new", text: "Se asocia la orden de servicio del contrato a un presupuesto" },
            { type: "fixed", text: "Se corrige modificar el estado a cobrado luego de cargar un cobro" },
            { type: "new", text: "Se agrega formulario de cargar certificacion" },
            { type: "new", text: "Se agrega formulario de validacion de servicio" },
            { type: "new", text: "Se agrega formulario de confirmacion de entrega" },
            { type: "new", text: "Se crea el rol de servicio y se dividen rol de produccion y servicio" },

        ]
    },
    {
        date: "4 agosto, 2025",
        changes: [
            { type: "improved", text: "Se agrega mayor numero de datos para la paginación (100 y 500)" },
        ]
    },
    {
        date: "30 julio, 2025",
        changes: [
            { type: "improved", text: "Se cambia el orden de las columnas fecha entrega y fabricación" },
            { type: "new", text: "Se agrega la posibilidad de agregar imagenes para un producto" },
            { type: "fixed", text: "Se corrige los estilos de las fechas de entrega" },
        ]
    },
    {
        date: "28 julio, 2025",
        changes: [
            { type: "new", text: "Se agrega la posibilidad de crear fechas de fabricacion y entrega estimada" },

        ]
    },
    {
        date: "25 julio, 2025",
        changes: [
            { type: "improved", text: "Se agrega la posiblidad de filtrar la fecha de entrega por rango" },

        ]
    },
    {
        date: "23 julio, 2025",
        changes: [
            { type: "fixed", text: "Se corrige error al eliminar productos" },
            { type: "fixed", text: "Se corrige la generacion de movimientos con una conversión" },
            { type: "improved", text: "Se agrega los permisos para que el rol facturación pueda visualizar las ots en producción" },

        ]
    },
    {
        date: "22 julio, 2025",
        changes: [
            { type: "improved", text: "Se mejora el selector de unidades asociadas a un producto" },
            { type: "improved", text: "Se agrega la posibilida de visualizar en el rol de vendedor los estados trabajo_terminado y certificacion_pendiente " },
            { type: "fixed", text: "Se elimina llamado extra en la solapa de conversiones" },

        ]
    },
    {
        date: "21 julio, 2025",
        changes: [
            { type: "new", text: "Se agrega tabla de conversion de unidades para los productos" },
            { type: "new", text: "Se agrega la posibilidad de poder elegir una conversion en los ingresos" },
            { type: "new", text: "Se agrega la posibilidad de poder elegir una conversion en los movimientos de inventario" },
            { type: "new", text: "Se agrega la conversion utilizada en la tabla de movimientos" },
        ]
    },
    {
        date: "18 julio, 2025",
        changes: [
            { type: "fixed", text: "Se corrige la suma de totales en la solapa de costeo técnico" },
        ]
    },
    {
        date: "17 julio, 2025",
        changes: [
            { type: "new", text: "Se cambia el nombre de categoria de productos por familia productos" },
            { type: "new", text: "Se agregan las familias y categorias a los productos" },
            { type: "new", text: "Se agrega la posiblidad de asignar categorias a cada familia de producto" },
            { type: "fixed", text: "Se agregan los permisos al rol almacen para que pueda gestionar stock" },
        ]
    },
    {
        date: "15 julio, 2025",
        changes: [
            { type: "improved", text: "Se modifica para que a la hora de mostrar la cantidad disponible de un producto tenga en cuenta la cantidad reservada" },
            { type: "new", text: "Se agrega la opción de ignorar el stock cuando se hace la validación de almacen" },
            { type: "improved", text: "Se el N° de reserva en la tabla de reservas" },
            { type: "improved", text: "Se el N° de movimiento en la tabla de movimientos" },
        ]
    },
    {
        date: "14 julio, 2025",
        changes: [
            { type: "improved", text: "Se agregan por defecto los porcentajes 180 80 y 180 para calcular los precios de ventas" },
            { type: "improved", text: "Se agrego la columna progreso al lado de fecha de entrega" },
            { type: "fixed", text: "Se corrige error de redondeo en calculo automatico de valores de venta" },
        ]
    },
    {
        date: "11 julio, 2025",
        changes: [
            { type: "improved", text: "Se mejoro el calculo de IG, ahora se aplica el porcentaje a la ganancia neta (ventatotal-costototal)" },
        ]
    },
    {
        date: "10 julio, 2025",
        changes: [
            { type: "new", text: "Agrego integracion entre el modulo de stock y los presupuestos" },
            { type: "new", text: "Se agrego la validacion de que no te permita iniciar un trabajo o finalizar si no hay stock disponible" },
            { type: "new", text: "Se agrego que cuando se finaliza un presupuesto se descuenta del stock los materiales ya sea por uso de reserva o directamente" },
            { type: "new", text: "Se agrego que cuando se verifica por almacen un presupuesto, se realiza la reserva de los materiales" },
            { type: "new", text: "Se agrego formulario para realizar ingresos de mercaderia y asociarlos a las ots" },
            { type: "new", text: "Se agrego formulario para registrar movimientos de inventarios" },
            { type: "new", text: "Se la posibilidad de visualizar las reservas de un producto" },
            { type: "new", text: "Se agregaron los movimientos de inventario (IN, OUT, AJUSTE, RESERVA, RESERVA USADA)" },
            { type: "new", text: "Se agregaron los campos de informacion de productos (unidad de medida, sku, descripcion)" },
            { type: "new", text: "Se agregaron los campos de stock (alerta, stock actual, maximo, minimo y stock reservado a los productos" },
            { type: "improved", text: "Se mejoro para que solo el rol Administrador y Producción pueda cambiar fecha de entrega" },
            { type: "improved", text: "Se mejoro que solo le envie la notificacion de cambio de fecha al vendedor asignado al presupuesto" },
        ]
    },
    {
        date: "8 julio, 2025",
        changes: [
            { type: "new", text: "Se agrego formulario para actualizar e implementó un sistema de colores para la Fecha de Entregafecha de entrega" },
            { type: "new", text: "Se agrego un mensaje para mantener el registro de la fecha de entrega" },
            { type: "new", text: "Se agrego una notificación a los roles (Costeo comercial, producción, Admin de ventas, Vendedor, y Administrador) para notificar un cambio en fecha de entrega" },
            { type: "new", text: "Se Agrega el filtro para visualizar los contratos de alquiler vigentes" },
            { type: "fixed", text: "Se corrigió un error al enviar una notificacion de mensajes en los contratos de alquiler" },
        ]
    },
    {
        date: "4 julio, 2025",
        changes: [
            { type: "new", text: "Se agregó la columna Fecha de Entrega." },
            { type: "new", text: "Se implementó un sistema de colores para la Fecha de Entrega: amarillo si faltan 15 días o menos, naranja si faltan 7 días o menos, rojo si está vencida y verde en caso contrario." },
            { type: "improved", text: "Se configuró por defecto el mantenimiento de la oferta en 15 días." }
        ]
    },
    {
        date: "30 junio, 2025",
        changes: [
            { type: "improved", text: "Se cambian el orden de las columnas en ruteros" },
        ],
    },
    {
        date: "25 junio, 2025",
        changes: [
            { type: "improved", text: "Se permite la actualizacion de precios solo para el admin de ventas" },
        ],
    },
    {
        date: "23 junio, 2025",
        changes: [
            { type: "improved", text: "Se optimiza la funcion para obtener la rentabilidad al actualizar y crear items" },
            { type: "improved", text: "Se optimiza la funcion para calcular el valor total, ahora actualiza proporcionalmente las comisiones" },
            { type: "improved", text: "Se optimiza la funcion para calcular el valor por item, ahora actualiza proporcionalmente las comisiones" },
            { type: "improved", text: "Se optimiza la funcion para recalcular el costeo técnico, ahora no depende de la receta" },
        ],
    },
    {
        date: "20 de junio, 2025",
        changes: [
            { type: "new", text: "Se conectan los contratos de alquileres con los presupuestos" },
            { type: "new", text: "Se visualizan todos los presupuestos de un alquiler en la solapa mantenimiento" },
            { type: "new", text: "Al crear un mantenimiento se crea un presupuesto en estado costeo técnico" },
            { type: "new", text: "Se agrega el campo de producción estatus" },
            { type: "new", text: "Se agrega la logica para visualizar los presupuestos finalizada la producción" },
            { type: "new", text: "Se agrega el filtro en mantenimiento para los alquileres y recursos" },
            { type: "new", text: "Se agrega el campo periodicidad de actualizacion en los alquileres" },
            { type: "new", text: "Se agrega el filtro de periodicidad de actualización" },
            { type: "new", text: "Se agrega la posibilidad de actualizar el precio por lote de los alquileres" },
            { type: "new", text: "Se agrega alertas de vencimiento de contratos" },
            { type: "new", text: "Se agrega el N° del presupuesto en el titulo de la pagina" },
            { type: "new", text: "Se agrega el N° del presupuesto en el PDF que se descarga" },
            { type: "improved", text: "Se mejora los badge para diferenciar los estados de los alquileres y recursos" },
            { type: "fixed", text: "Se corrigió un error al editar los presupuestos, haciendo que se eliminen los archivos cargados" },

        ],
    },

    {
        date: "12 de junio, 2025",
        changes: [
            { type: "new", text: "Se agrego la opcion para fijar los precios por item y que calcule el adicional proporcional." },
            { type: "new", text: "Se agregó el calculo automatico de valor de venta al modificar la cantidad de items" },
        ],
    },
    {
        date: "11 de junio, 2025",
        changes: [
            { type: "improved", text: "Se permitió al rol de almacén ver la orden de trabajo en PDF." },
            { type: "improved", text: "Se permitió al rol de almacén ver los costos en el formulario de costeo." },
            { type: "improved", text: "Se permitió al rol de almacén ver los costos en la orden de trabajo PDF." },
            { type: "fixed", text: "Se corrigió un error en la generación de la orden de trabajo PDF." }
        ],
    },
    {
        date: "10 de junio, 2025",
        changes: [
            { type: "improved", text: "Se agrego el total de costo por cada item en el formulario de costeo comercial" },

        ],
    },
    {
        date: "6 de junio, 2025",
        changes: [
            { type: "improved", text: "Se agrego a 30 días como valor predeterminado en metodo de pago" },
            { type: "fixed", text: "Se corrigió el filtro descripcion en los presupuestos" },
            { type: "fixed", text: "Se corrigió el nombre del comprador en el presupuesto PDF" },

        ],
    },
    {
        date: "4 de junio, 2025",
        changes: [
            { type: "improved", text: "Se agregó valores por defecto para calcular los costos administrativos" },
        ],
    },
    {
        date: "3 de junio, 2025",
        changes: [
            { type: "new", text: "Se agregó la opción para fijar precios de ventas" },
            { type: "new", text: "Se agregó la funcionalidad para restablecer costeo comercial" },
        ],
    },
    {
        date: "2 de junio, 2025",
        changes: [
            { type: "new", text: "Se agregó la página para ver el historial de cambios" },
            { type: "new", text: "Se agregó la opcion para duplicar recetas" },
            { type: "new", text: "Se agregó la opcion para duplicar productos" },
            { type: "new", text: "Se agregó la opcion para elimnar varios productos" },
            { type: "new", text: "Se agregó botón para refrescar la página" },
            { type: "improved", text: "Se agregó decimales en los precios del inventario" },
            { type: "fixed", text: "Se corrigió un error en el porcentaje de indices" },
            { type: "fixed", text: "Se añadieron los permisos de cargar archivos a todos los usuarios" },
            { type: "fixed", text: "Se agregó el permiso para gestionar indices al usuario Admin de ventas" },
            { type: "fixed", text: "Se agregó restriccion para eliminar productos usados en presupuestos" },
            { type: "fixed", text: "Se corrigió un error al actualizar un los materiales de un item" },
        ],
    },
]
export { CHANGELOG_DATA }