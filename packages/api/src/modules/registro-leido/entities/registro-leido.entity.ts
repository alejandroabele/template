import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity('registro_leido')
@Index(['usuarioId', 'modelo', 'modeloId'], { unique: true })
export class RegistroLeido {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'usuario_id' })
    usuarioId: number;

    @Column({ type: 'varchar', length: 100, name: 'modelo' })
    modelo: string;

    @Column({ name: 'modelo_id' })
    modeloId: number;

    @Column({ type: 'timestamp', name: 'fecha', default: () => 'CURRENT_TIMESTAMP' })
    fecha: Date;
}
