// dto/create-presupuesto-item.dto.ts
import { IsNotEmpty, IsOptional, IsNumber, IsString, IsDate, IsArray, IsDecimal } from 'class-validator';

export class CreatePresupuestoItemDto {
    @IsOptional()
    @IsNumber()
    id?: number;

    @IsNotEmpty()
    @IsNumber()
    presupuestoId: number;

    @IsNotEmpty()
    @IsNumber()
    recetaId: number;

    @IsOptional()
    @IsString()
    tipo?: string;

    @IsOptional()
    @IsString()
    descripcion?: string;

    @IsOptional()
    @IsString()
    detalles?: string;

    @IsOptional()
    @IsString()
    observaciones?: string;

    @IsOptional()
    @IsNumber()
    cantidad?: number;

    @IsOptional()
    @IsDecimal()
    materialesCosto?: number;

    @IsOptional()
    @IsDecimal()
    materialesComision?: number;

    @IsOptional()
    @IsDecimal()
    materialesVenta?: number;

    @IsOptional()
    @IsDecimal()
    suministrosCosto?: number;

    @IsOptional()
    @IsDecimal()
    suministrosComision?: number;

    @IsOptional()
    @IsDecimal()
    suministrosVenta?: number;

    @IsOptional()
    @IsDecimal()
    manoDeObraCosto?: number;

    @IsOptional()
    @IsDecimal()
    manoDeObraComision?: number;

    @IsOptional()
    @IsDecimal()
    manoDeObraVenta?: number;

    @IsOptional()
    @IsDecimal()
    trabajocampoCosto?: number;

    @IsOptional()
    @IsDecimal()
    trabajocampoComision?: number;

    @IsOptional()
    @IsDecimal()
    trabajocampoVenta?: number;

    @IsOptional()
    @IsDecimal()
    ivaComision?: number;

    @IsOptional()
    @IsDecimal()
    venta?: number;

    @IsOptional()
    @IsDecimal()
    productoCostoEstimado?: number;

    @IsOptional()
    @IsDecimal()
    servicio_costo_estimado?: number;

    @IsOptional()
    @IsDecimal()
    total_costo_estimado?: number;

    @IsOptional()
    @IsDate()
    fecha_enviado_servicio?: Date;

    @IsOptional()
    @IsDate()
    fecha_estimada_entrega?: Date;

    @IsOptional()
    @IsString()
    direccion_colocacion?: string;

    @IsOptional()
    @IsString()
    ciudad?: string;

    @IsOptional()
    @IsString()
    persona_contacto?: string;

    @IsOptional()
    @IsString()
    tel_contacto?: string;

    @IsOptional()
    @IsString()
    limpieza?: string;

    @IsOptional()
    @IsString()
    horario_trabajar?: string;

    @IsOptional()
    @IsString()
    documentacion?: string;

    @IsOptional()
    @IsArray()
    produccionTrabajos?: {
        producto: ProduccionTrabajo[];
        servicio: ProduccionTrabajo[];
    };
    materiales: any;
    suministros: any;
    manoDeObra: any
    archivo: any
}

class ProduccionTrabajo {
    @IsNumber()
    id: number;

    @IsString()
    nombre: string;

    @IsString()
    tipo: string;

    @IsArray()
    materiales: any[]; // Aquí puedes utilizar un DTO específico para los materiales

    @IsArray()
    suministros: any[]; // Similar para suministros

    @IsArray()
    manoDeObra: any[]; // Y para manoDeObra
}
