export type ChangelogEntryType = 'new' | 'improved' | 'fixed';

export type ChangelogChange = {
    type: ChangelogEntryType;
    text: string;
};

export type ChangelogEntry = {
    date: string;
    changes: ChangelogChange[];
};

export const CHANGELOG_DATA: ChangelogEntry[] = [
    {
        date: '27 de marzo, 2026',
        changes: [
            { type: 'fixed', text: 'Se corrige error que impedía asociar imagen al guardar un ejemplo' },
            { type: 'improved', text: 'Se mejora formulario de ejemplo con campo de subida de imagen' },
            { type: 'improved', text: 'Se reorganiza menú principal con secciones Ejemplo, Administración y Configuración' },
            { type: 'fixed', text: 'Se corrige error en módulo de envío de notificaciones' },
        ],
    },
];
