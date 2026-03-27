DELIMITER $$

CREATE PROCEDURE GenerarSQLPresupuesto(IN p_presupuestoId INT)
BEGIN
    DECLARE v_sql LONGTEXT DEFAULT '';

    SET SESSION group_concat_max_len = 1000000;

    -- PRESUPUESTO PRINCIPAL
    SELECT CONCAT(
        'INSERT INTO presupuesto (fecha, clienteId, comprador, vendedorId, areaId, descripcion_corta, diseno, diseno_solicitar, diseno_estatus, diseno_ubicacion, costeo_estatus, costeo_comercial_estatus, facturacion_estatus, cobranza_estatus, produccion_estatus, fecha_entrega_estimada, progreso_produccion, proyeccion, progreso_servicio, estatusId, proceso_generalId, total, venta_total, costo_total, facturado, lastupdate, ordenId, condicion_iva, condicion_pago, mant_oferta, tiempo_entrega, lugar_entrega, moneda, descripcion_global, hayServicio, hayProducto, estructura_comision, estructura_costo, vendedor_comision, vendedor_costo, director_comision, director_costo, costoadmin_total, tax_ingresos_comision, tax_ingresos_costo, tax_transf_comision, tax_transf_costo, tax_ganancias_comision, tax_ganancias_costo, tax_total, contrib_marginal, margen_total, bab, fecha_entregado, fecha_solicitud_prod, fecha_inicio_prod, monto_facturado, monto_cobrado, alquiler_recurso_id, ignorar_stock, fecha_fabricacion, fecha_fabricacion_estimada, fecha_inicio_serv) VALUES (',
        QUOTE(fecha), ',', IFNULL(clienteId,'NULL'), ',', QUOTE(comprador), ',', IFNULL(vendedorId,'NULL'), ',', IFNULL(areaId,'NULL'), ',', QUOTE(descripcion_corta), ',', QUOTE(diseno), ',', diseno_solicitar, ',', QUOTE(diseno_estatus), ',', QUOTE(diseno_ubicacion), ',', QUOTE(costeo_estatus), ',', QUOTE(costeo_comercial_estatus), ',', QUOTE(facturacion_estatus), ',', QUOTE(cobranza_estatus), ',', QUOTE(produccion_estatus), ',', IFNULL(QUOTE(fecha_entrega_estimada),'NULL'), ',', progreso_produccion, ',', proyeccion, ',', progreso_servicio, ',', IFNULL(estatusId,'NULL'), ',', IFNULL(proceso_generalId,'NULL'), ',', total, ',', venta_total, ',', costo_total, ',', facturado, ',', IFNULL(QUOTE(lastupdate),'NULL'), ',', IFNULL(ordenId,'NULL'), ',', QUOTE(condicion_iva), ',', QUOTE(condicion_pago), ',', QUOTE(mant_oferta), ',', QUOTE(tiempo_entrega), ',', QUOTE(lugar_entrega), ',', QUOTE(moneda), ',', QUOTE(descripcion_global), ',', hayServicio, ',', hayProducto, ',', estructura_comision, ',', estructura_costo, ',', vendedor_comision, ',', vendedor_costo, ',', director_comision, ',', director_costo, ',', costoadmin_total, ',', tax_ingresos_comision, ',', tax_ingresos_costo, ',', tax_transf_comision, ',', tax_transf_costo, ',', tax_ganancias_comision, ',', tax_ganancias_costo, ',', tax_total, ',', contrib_marginal, ',', margen_total, ',', bab, ',', IFNULL(QUOTE(fecha_entregado),'NULL'), ',', IFNULL(QUOTE(fecha_solicitud_prod),'NULL'), ',', IFNULL(QUOTE(fecha_inicio_prod),'NULL'), ',', monto_facturado, ',', monto_cobrado, ',', IFNULL(alquiler_recurso_id,'NULL'), ',', IFNULL(ignorar_stock,0), ',', IFNULL(QUOTE(fecha_fabricacion),'NULL'), ',', IFNULL(QUOTE(fecha_fabricacion_estimada),'NULL'), ',', IFNULL(QUOTE(fecha_inicio_serv),'NULL'), ');', CHAR(10),
        'SET @new_presupuesto_id = LAST_INSERT_ID();', CHAR(10)
    ) INTO v_sql
    FROM presupuesto
    WHERE id = p_presupuestoId;

    -- PRESUPUESTO ITEMS + HIJOS
    SELECT GROUP_CONCAT(
        CONCAT(
            'INSERT INTO presupuesto_h (presupuestoId, receta_id, descripcion, detalles, observaciones, cantidad, materiales_costo, materiales_comision, materiales_venta, suministros_costo, suministros_comision, suministros_venta, manodeobra_costo, manodeobra_comision, manodeobra_venta, trabajocampo_costo, trabajocampo_comision, trabajocampo_venta, iva_comision, venta, producto_costo_estimado, servicio_costo_estimado, total_costo_estimado, fecha_enviado_servicio, fecha_estimada_entrega, direccion_colocacion, ciudad, persona_contacto, tel_contacto, limpieza, horario_trabajar, documentacion) VALUES (@new_presupuesto_id,',
            IFNULL(receta_id,'NULL'), ',', QUOTE(descripcion), ',', QUOTE(detalles), ',', QUOTE(observaciones), ',', cantidad, ',', materiales_costo, ',', materiales_comision, ',', materiales_venta, ',', suministros_costo, ',', suministros_comision, ',', suministros_venta, ',', manodeobra_costo, ',', manodeobra_comision, ',', manodeobra_venta, ',', trabajocampo_costo, ',', trabajocampo_comision, ',', trabajocampo_venta, ',', iva_comision, ',', venta, ',', producto_costo_estimado, ',', servicio_costo_estimado, ',', total_costo_estimado, ',', IFNULL(QUOTE(fecha_enviado_servicio),'NULL'), ',', IFNULL(QUOTE(fecha_estimada_entrega),'NULL'), ',', QUOTE(direccion_colocacion), ',', QUOTE(ciudad), ',', QUOTE(persona_contacto), ',', QUOTE(tel_contacto), ',', QUOTE(limpieza), ',', QUOTE(horario_trabajar), ',', QUOTE(documentacion), ');', CHAR(10),
            'SET @new_item_id = LAST_INSERT_ID();', CHAR(10),

            -- PRESUPUESTO MATERIALES (solo usa concepto)
            IFNULL((
                SELECT GROUP_CONCAT(
                    CONCAT(
                        'INSERT INTO presupuesto_materiales (inventarioId, presupuestoItemId, trabajoId, concepto, punit, cantidad, importe, cantidad_real, costo_prod) VALUES (NULL, @new_item_id,', 
                        IFNULL(m.trabajoId,'NULL'), ',',
                        QUOTE(
                            IF(m.inventarioId IS NOT NULL,
                               (SELECT nombre FROM inventario i WHERE i.inventarioId = m.inventarioId),
                               m.concepto)
                        ), ',', m.punit, ',', IFNULL(m.cantidad,'NULL'), ',', m.importe, ',', IFNULL(m.cantidad_real,'NULL'), ',', m.costo_prod, ');', CHAR(10)
                    ) SEPARATOR ''
                ) FROM presupuesto_materiales m WHERE m.presupuestoItemId = h.id
            ), ''),

            -- PRESUPUESTO SUMINISTROS (solo usa concepto)
            IFNULL((
                SELECT GROUP_CONCAT(
                    CONCAT(
                        'INSERT INTO presupuesto_suministros (inventarioId, presupuestoItemId, trabajoId, concepto, punit, cantidad, importe, cantidad_real, costo_prod) VALUES (NULL, @new_item_id,', 
                        IFNULL(s.trabajoId,'NULL'), ',',
                        QUOTE(
                            IF(s.inventarioId IS NOT NULL,
                               (SELECT nombre FROM inventario i WHERE i.inventarioId = s.inventarioId),
                               s.concepto)
                        ), ',', s.punit, ',', IFNULL(s.cantidad,'NULL'), ',', s.importe, ',', IFNULL(s.cantidad_real,'NULL'), ',', s.costo_prod, ');', CHAR(10)
                    ) SEPARATOR ''
                ) FROM presupuesto_suministros s WHERE s.presupuestoItemId = h.id
            ), ''),

            -- PRESUPUESTO MANO DE OBRA (solo usa concepto)
            IFNULL((
                SELECT GROUP_CONCAT(
                    CONCAT(
                        'INSERT INTO presupuesto_manodeobra (inventarioId, presupuestoItemId, trabajoId, concepto, punit, cantidad, importe, cantidad_real, costo_prod) VALUES (NULL, @new_item_id,', 
                        IFNULL(mo.trabajoId,'NULL'), ',',
                        QUOTE(
                            IF(mo.inventarioId IS NOT NULL,
                               (SELECT nombre FROM inventario i WHERE i.inventarioId = mo.inventarioId),
                               mo.concepto)
                        ), ',', mo.punit, ',', IFNULL(mo.cantidad,'NULL'), ',', mo.importe, ',', IFNULL(mo.cantidad_real,'NULL'), ',', mo.costo_prod, ');', CHAR(10)
                    ) SEPARATOR ''
                ) FROM presupuesto_manodeobra mo WHERE mo.presupuestoItemId = h.id
            ), '')
        ) SEPARATOR ''
    ) INTO @sqlItems
    FROM presupuesto_h h
    WHERE presupuestoId = p_presupuestoId;

    SET v_sql = CONCAT(v_sql, IFNULL(@sqlItems, ''));

    -- PRODUCCIÓN (solo relaciones)
    SELECT GROUP_CONCAT(
        CONCAT(
            'INSERT INTO presupuesto_produccion (presupuestoId, trabajoId, iniciado, terminado, fecha_iniciado, fecha_terminado) VALUES (@new_presupuesto_id,',
            IFNULL(trabajoId,'NULL'), ',', iniciado, ',', terminado, ',', IFNULL(QUOTE(fecha_iniciado),'NULL'), ',', IFNULL(QUOTE(fecha_terminado),'NULL'), ');', CHAR(10)
        ) SEPARATOR ''
    ) INTO @sqlProd
    FROM presupuesto_produccion
    WHERE presupuestoId = p_presupuestoId;

    SET v_sql = CONCAT(v_sql, IFNULL(@sqlProd, ''));

    -- OUTPUT FINAL
    SELECT v_sql AS scriptSQL;
END$$

DELIMITER ;
