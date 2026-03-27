import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, AfterLoad } from 'typeorm';
import { BaseEntity } from '@/common/base.entity';
import { Cliente } from '@/modules/cliente/entities/cliente.entity';
import { Cobro } from '@/modules/cobro/entities/cobro.entity';
import { MoneyColumn } from '@/common/decorators/money-column.decorator';
import { FACTURA_ESTADO } from '@/constants/factura';


@Entity('factura')
export class Factura extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 50, name: 'modelo' })
    modelo: string; // 'presupuesto' o 'alquiler'

    @Column({ type: 'int', name: 'modelo_id' })
    modeloId: number;

    @MoneyColumn({ name: 'monto', nullable: true })
    monto?: number;

    @MoneyColumn({ name: 'importe_bruto', nullable: true })
    importeBruto?: number;

    @Column({ type: 'varchar', length: 100, nullable: true, name: 'alicuota' })
    alicuota?: string;

    @Column({
        type: 'enum',
        enum: ['pendiente', 'pagado', 'parcial'],
        default: 'pendiente',
        nullable: false,
        name: 'estado'
    })
    estado: string;

    @Column({ type: 'varchar', length: 100, nullable: true, name: 'folio' })
    folio: string;

    @Column({ type: 'varchar', length: 255, name: 'fecha' })
    fecha: string;

    @Column({ type: 'varchar', length: 255, nullable: true, name: 'fecha_vencimiento' })
    fechaVencimiento: string;

    @Column({ type: 'varchar', length: 255, nullable: true, name: 'inicio_periodo' })
    inicioPeriodo: string;

    @Column({ type: 'varchar', length: 255, nullable: true, name: 'fin_periodo' })
    finPeriodo: string;

    @Column({ type: 'int', nullable: true, name: 'cliente_id' })
    clienteId: number;

    @ManyToOne(() => Cliente, (cliente) => cliente.id, { nullable: true })
    @JoinColumn({ name: 'cliente_id' })
    cliente: Cliente;

    @OneToMany(() => Cobro, (cobro) => cobro.factura)
    cobros: Cobro[];

    // Se calcula automáticamente después de cargar la entidad si los cobros están presentes
    montoCobrado?: number;

    @AfterLoad()
    calcularMontoCobrado() {
        if (Array.isArray(this.cobros) && this.cobros.length) {
            this.montoCobrado = this.cobros
                .filter(c => !c.deletedAt)
                .reduce((sum, c) => Number(sum) + Number(c.monto ?? 0), 0);
        } else {
            this.montoCobrado = 0;
        }
    }
}
