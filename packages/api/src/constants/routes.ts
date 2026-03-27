import { PERMISOS } from './permisos';

export const MENU = [
    // General
    {
        id: PERMISOS.RUTA_DASHBOARD,
        title: 'Inicio',
        url: '/',
        icon: 'Home',
    },

    // Módulo: Ejemplo
    {
        title: 'Ejemplo',
        icon: 'BookOpen',
        items: [
            {
                id: PERMISOS.RUTA_EJEMPLOS,
                title: 'Ejemplos',
                url: '/ejemplos',
                icon: 'List',
            },
            {
                id: PERMISOS.RUTA_EJEMPLO_CATEGORIAS,
                title: 'Categorías de Ejemplo',
                url: '/ejemplo-categorias',
                icon: 'Tag',
            },
        ]
    },

    // Módulo: Administración
    {
        title: 'Administración',
        icon: 'Settings',
        items: [
            {
                id: PERMISOS.RUTA_USUARIOS,
                title: 'Usuarios',
                url: '/usuarios',
                icon: 'Users',
            },
            {
                id: PERMISOS.RUTA_ROLES,
                title: 'Roles',
                url: '/roles',
                icon: 'ShieldCheck',
            },
            {
                id: PERMISOS.RUTA_SMTP_CLIENT,
                title: 'SMTP',
                url: '/administracion/smtp-client',
                icon: 'Mail',
            },
            {
                id: PERMISOS.RUTA_PLANTILLA_NOTIFICACION,
                title: 'Plantillas de Notificación',
                url: '/administracion/plantillas',
                icon: 'FileText',
            },
            {
                id: PERMISOS.RUTA_ENVIO_NOTIFICACION,
                title: 'Envíos de Notificación',
                url: '/administracion/envios-notificacion',
                icon: 'Send',
            },
        ]
    },

    // Configuración
    {
        title: 'Configuración',
        icon: 'SlidersHorizontal',
        items: [
            {
                id: PERMISOS.RUTA_EJEMPLO_CONFIG,
                title: 'Configuración de Ejemplo',
                url: '/config/ejemplo',
                icon: 'Settings2',
            },
        ]
    },
];
