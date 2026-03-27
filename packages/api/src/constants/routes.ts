import { PERMISOS } from './permisos';

export const MENU = [
    // General
    {
        id: PERMISOS.RUTA_DASHBOARD,
        title: 'Inicio',
        url: '/',
        icon: 'Home',
    },
    {
        id: PERMISOS.RUTA_ACTUALIZACIONES,
        title: 'Actualizaciones',
        url: '/actualizaciones',
        icon: 'Sparkles',
    },

    // Módulo: Presupuestos
    {
        title: 'Presupuestos',
        icon: 'TrafficCone',
        items: [
            {
                id: PERMISOS.RUTA_PRESUPUESTOS,
                title: 'Ver presupuestos',
                url: '/presupuestos',
                icon: 'FileText',
            },
            {
                id: PERMISOS.RUTA_PRESUPUESTOS_ESTADISTICAS,
                title: 'Estadísticas',
                url: '/presupuestos/dashboard',
                icon: 'PieChart',
            },
            {
                id: PERMISOS.RUTA_PLANIFICACIONES,
                title: 'Planificaciones',
                url: '/presupuestos/jornadas',
                icon: 'CalendarClock',
            },
        ]
    },

    // Módulo: Alquileres
    {
        id: PERMISOS.RUTA_ALQUILERES,
        title: 'Alquileres',
        icon: 'Construction',
        items: [
            {
                id: PERMISOS.RUTA_ALQUILERES,
                title: 'Ver alquileres',
                url: '/alquileres',
                icon: 'Hammer',
            },
            {
                id: PERMISOS.RUTA_RECURSOS,
                title: 'Recursos',
                url: '/recursos',
                icon: 'Wrench',
            },
            {
                id: PERMISOS.RUTA_ALQUILERES,
                title: 'Estadísticas',
                url: '/alquileres/dashboard',
                icon: 'BarChart2',
            },
        ]
    },

    // Módulo: Contratos Marco
    {
        id: PERMISOS.RUTA_CONTRATOS_MARCO,
        title: 'Contratos Marco',
        url: '/contratos-marco',
        icon: 'Handshake',
    },

    // Módulo: Ventas
    {
        title: 'Ventas',
        icon: 'BadgeDollarSign',
        items: [
            {
                id: PERMISOS.RUTA_CONTACTO_TIPO,
                title: 'Tipos de Contacto',
                url: '/contacto-tipo',
                icon: 'Tag',
            },
            {
                id: PERMISOS.RUTA_CONTACTO_CASOS,
                title: 'Casos',
                url: '/contacto-casos',
                icon: 'MessageSquare',
            },
            {
                id: PERMISOS.RUTA_CALENDARIO_CONTACTOS,
                title: 'Calendario',
                url: '/calendario-contactos',
                icon: 'Calendar',
            },
        ]
    },

    // Módulo: Activos
    {
        title: 'Activos',
        icon: 'Truck',
        items: [
            {
                id: PERMISOS.RUTA_FLOTA,
                title: 'Flota',
                url: '/flota',
                icon: 'Truck',
            },
            {
                id: PERMISOS.RUTA_EQUIPAMIENTO,
                title: 'Equipamiento',
                url: '/equipamiento',
                icon: 'Wrench',
            },
            {
                id: PERMISOS.RUTA_CARTELES,
                title: 'Carteles',
                url: '/carteles',
                icon: 'MapPin',
            },
            {
                id: PERMISOS.RUTA_TRAILERS,
                title: 'Trailers',
                url: '/trailers',
                icon: 'Container',
            },
            {
                id: PERMISOS.RUTA_UBICACIONES,
                title: 'Ubicaciones',
                url: '/activos/ubicaciones',
                icon: 'MapPinHouse',
            },
        ]
    },

    // Módulo: Catálogos
    {
        title: 'Catálogos',
        icon: 'FolderCog2',
        items: [
            {
                id: PERMISOS.RUTA_CLIENTES,
                title: 'Clientes',
                url: '/clientes',
                icon: 'Users',
            },

            {
                id: PERMISOS.RUTA_RECETAS,
                title: 'Recetas',
                url: '/recetas',
                icon: 'Bookmark',
            },
            {
                id: PERMISOS.RUTA_AREAS,
                title: 'Áreas',
                url: '/areas',
                icon: 'Building2',
            },
            {
                id: PERMISOS.RUTA_PERSONAS,
                title: 'Personas',
                url: '/personas',
                icon: 'User',
            },
            {
                id: PERMISOS.RUTA_PROVEEDORES,
                title: 'Proveedores',
                url: '/proveedores',
                icon: 'Store',
            },
            {
                id: PERMISOS.RUTA_RUBROS,
                title: 'Rubros de Proveedores',
                url: '/rubros',
                icon: 'Tags',
            },
            {
                id: PERMISOS.RUTA_INDICES,
                title: 'Índices',
                url: '/indices',
                icon: 'TrendingUp',
            },
            {
                id: PERMISOS.RUTA_METODO_PAGO,
                title: 'Métodos de Pago',
                url: '/metodo-pago',
                icon: 'CreditCard',
            },
            {
                id: PERMISOS.RUTA_CENTRO_COSTO,
                title: 'Centros de Costos',
                url: '/centro-costo',
                icon: 'Target',
            },
            {
                id: PERMISOS.RUTA_PLAZO_PAGO,
                title: 'Plazos de Pago',
                url: '/plazo-pago',
                icon: 'Calendar',
            },
            {
                id: PERMISOS.RUTA_CUENTA_CONTABLE,
                title: 'Cuentas Contables',
                url: '/cuenta-contable',
                icon: 'BookOpen',
            },
        ]
    },
    {
        title: 'Compras',
        icon: 'ShoppingCart',
        items: [
            {
                id: PERMISOS.RUTA_SOLCOM_CREAR,
                title: 'Crear solicitud de compra',
                url: '/solcom/crear',
                icon: 'Plus',
            },
            {
                id: PERMISOS.RUTA_SOLCOM,
                title: 'Ver Solicitudes',
                url: '/solcom',
                icon: 'List',
            },
            {
                id: PERMISOS.RUTA_SOLCOM_PENDIENTES_AUTORIZACION,
                title: 'Pendientes de Autorización',
                url: '/solcom-pendientes-autorizacion',
                icon: 'Clock',
            },
            {
                id: PERMISOS.RUTA_SOLCOM_ACTIVAS,
                title: 'Solicitudes Activas',
                url: '/solcom-activas',
                icon: 'CheckCircle',
            },
            {
                id: PERMISOS.RUTA_OFERTAS,
                title: 'Presupuestos activos',
                url: '/ofertas',
                icon: 'FileText',
            },
            {
                id: PERMISOS.RUTA_TODAS_OFERTAS,
                title: 'Todas las ofertas',
                url: '/todas-ofertas',
                icon: 'List',
            },
            {
                id: PERMISOS.RUTA_MIS_OFERTAS,
                title: 'Mis presupuestos',
                url: '/mis-ofertas',
                icon: 'User',
            },
            {
                id: PERMISOS.RUTA_ORDEN_COMPRA,
                title: 'Órdenes de Compra',
                url: '/orden-compra',
                icon: 'FileCheck',
            },
            {
                id: PERMISOS.RUTA_COMPRAS_CONFIG,
                title: 'Configuración',
                url: '/config/compras',
                icon: 'Settings',
            },
        ]
    },

    // Módulo: Inventario
    {
        title: 'Inventario',
        icon: 'Package',
        items: [
            {
                id: PERMISOS.RUTA_PRODUCTOS,
                title: 'Productos',
                url: '/productos',
                icon: 'Box',
            },
            {
                id: PERMISOS.RUTA_MOVIMIENTOS_INVENTARIO,
                title: 'Movimientos',
                url: '/movimientos-inventario',
                icon: 'ArrowUpDown',
            },
            {
                id: PERMISOS.RUTA_RESERVAS,
                title: 'Reservas',
                url: '/reservas',
                icon: 'CalendarCheck',
            },
            {
                id: PERMISOS.RUTA_INVENTARIO_EGRESO_MASIVO,
                title: 'Egreso Masivo',
                url: '/inventario/egreso-masivo',
                icon: 'FileMinus',
            },
            {
                id: PERMISOS.RUTA_INVENTARIO_INGRESO_MERCADERIA,
                title: 'Ingreso Mercadería',
                url: '/productos/ingreso',
                icon: 'FilePlus',
            },
            {
                id: PERMISOS.RUTA_CATEGORIAS,
                title: 'Familia Productos',
                url: '/categorias',
                icon: 'Layers',
            },

        ]
    },

    // Módulo: Finanzas
    {
        id: PERMISOS.RUTA_CASHFLOW,
        title: 'Finanzas',
        icon: 'ChartLine',
        items: [
            {
                id: PERMISOS.RUTA_CASHFLOW,
                title: 'Ver Cashflow',
                url: '/cashflow',
                icon: 'Wallet',
            },
            {
                id: PERMISOS.RUTA_CASHFLOW_CATEGORIAS,
                title: 'Categorías Cashflow',
                url: '/cashflow-categoria',
                icon: 'FolderTree',
            },
            {
                id: PERMISOS.RUTA_CASHFLOW_RUBROS,
                title: 'Rubros Cashflow',
                url: '/cashflow-rubro',
                icon: 'FolderKanban',
            },
            {
                id: PERMISOS.RUTA_CASHFLOW_ESTADISTICAS,
                title: 'Estadísticas Cashflow',
                url: '/cashflow/dashboard',
                icon: 'BarChart3',
            },
            {
                id: PERMISOS.RUTA_CASHFLOW_SIMULACIONES,
                title: 'Simulaciones',
                url: '/cashflow/simulaciones',
                icon: 'FlaskConical',
            },
            {
                id: PERMISOS.RUTA_BANCOS,
                title: 'Bancos',
                url: '/bancos',
                icon: 'Landmark',
            },
            {
                id: PERMISOS.RUTA_CASHFLOW_CONFIG,
                title: 'Configuración',
                url: '/config/cashflow',
                icon: 'Settings',
            },
        ]
    },

    // Módulo: Administración
    {
        title: 'Administración',
        icon: 'LayoutDashboard',
        items: [
            {
                id: PERMISOS.RUTA_ADMINISTRACION_FACTURACION,
                title: 'Facturación',
                url: '/administracion/facturacion',
                icon: 'Banknote',
            },
            {
                id: PERMISOS.RUTA_NOTIFICACIONES_CONFIG,
                title: 'Config. Notificaciones',
                url: '/administracion/notificaciones-config',
                icon: 'Settings',
            },
        ]
    },

    // Módulo: Notificaciones
    {
        title: 'Notificaciones',
        icon: 'Bell',
        items: [
            {
                id: PERMISOS.RUTA_NOTIFICACIONES_PLANTILLAS,
                title: 'Plantillas',
                url: '/administracion/plantillas',
                icon: 'FileText',
            },
            {
                id: PERMISOS.RUTA_ENVIOS_NOTIFICACION,
                title: 'Historial de Envíos',
                url: '/administracion/envios-notificacion',
                icon: 'Send',
            },
        ]
    },

    // Módulo: Producción
    {
        title: 'Producción',
        icon: 'HardHat',
        items: [
            {
                id: PERMISOS.RUTA_PANEL_OPERARIO,
                title: 'Panel Operarios',
                url: '/operarios',
                icon: 'ClipboardList',
            },
            {
                id: PERMISOS.RUTA_ESTADISTICAS_PRODUCCION,
                title: 'Estadísticas',
                url: '/produccion/estadisticas',
                icon: 'BarChart2',
            },
            {
                id: PERMISOS.RUTA_ESTADO_PERSONAL,
                title: 'Estado del personal',
                url: '/produccion/personal',
                icon: 'Users',
            },
        ]
    },

    // Módulo: Herramientas
    {
        title: 'Herramientas',
        icon: 'Wrench',
        items: [
            {
                id: PERMISOS.RUTA_HERRAMIENTAS,
                title: 'Ver herramientas',
                url: '/herramientas',
                icon: 'Hammer',
            }
        ]
    },

    // Módulo: Configuración del Sistema
    {
        id: PERMISOS.RUTA_USUARIOS,
        title: 'Configuración del Sistema',
        icon: 'Settings',
        items: [
            {
                id: PERMISOS.RUTA_USUARIOS,
                title: 'Usuarios',
                url: '/usuarios',
                icon: 'UserCog',
            },
            {
                id: PERMISOS.RUTA_ROLES,
                title: 'Roles',
                url: '/roles',
                icon: 'ShieldCheck',
            },
        ]
    },
]

