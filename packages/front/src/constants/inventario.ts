export const TIPO_MOVIMIENTO = {
    IN: 'IN',
    OUT: 'OUT',
    AJUSTE: 'AJUSTE',
    RESERVA: 'RESERVA',
    RESERVA_USADA: 'RESERVA_USADA',
    RESERVA_DEVUELTA: 'RESERVA_DEVUELTA',
    PRESTAMO: 'PRESTAMO',
    DEVOLUCION: 'DEVOLUCION',
} as const


export const MOTIVO_MOVIMIENTO = {
    DEVOLUCION: 'devolucion',
    RESERVA_USADA: 'uso'
}


export const UNIDADES: Record<string, string> = {
    UN: "Unidad (UN)",
    KG: "Kilogramo (KG)",
    G: "Gramo (G)",
    L: "Litro (L)",
    ML: "Mililitro (ML)",
    M: "Metro (M)",
    M2: "Metro cuadrado (M2)",
    M3: "Metro cúbico (M3)",
    CJ: "Caja (CJ)",
    PQT: "Paquete (PQT)",
    PAR: "Par (PAR)",
    ROL: "Rollo (ROL)",
    BOT: "Botella (BOT)",
    LAT: "Lata (LAT)",
    LB: "Libra (LB)",
    CM: "Centímetro (CM)",
    CM2: "Centímetro cuadrado (CM2)",
    CM3: "Centímetro cúbico (CM3)",
    MIN: "Minuto (MIN)",
    H: "Hora (H)",
    D: "Día (D)",
    SEM: "Semana (SEM)",
    MES: "Mes (MES)",
    MG: "Miligramo (MG)",
}

