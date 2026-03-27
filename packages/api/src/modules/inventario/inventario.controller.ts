import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards, Res, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { ApiKeyGuard } from '../auth/guards/api-key/api-key.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { CreateInventarioDto } from './dto/create-inventario.dto';
import { UpdateInventarioDto } from './dto/update-inventario.dto';
import { ActualizarPrecioManualDto } from './dto/actualizar-precio-manual.dto';
import { InventarioService } from './inventario.service';
import { CreateIngresoMercaderiaDto } from './dto/create-ingreso-mercaderia.dto';
import { ExcelExportService } from '@/services/excel-export/excel-export.service'
import { FileInterceptor } from '@nest-lab/fastify-multer';
import { File } from '@nest-lab/fastify-multer';
import { Response } from 'express'; // Importar Response desde 'express'
import { PERMISOS } from '@/constants/permisos';
import { AuthorizationGuard } from '../auth/guards/authorization/authorization.guard';
import { RequirePermissions } from '../auth/decorators/require-permissions/require-permissions.decorator';



@Controller('inventario')
@UseGuards(JwtAuthGuard, ApiKeyGuard, AuthorizationGuard)
export class InventarioController {
  constructor(
    private readonly inventarioService: InventarioService,
    private readonly excelExportService: ExcelExportService,  // Inyectamos el servicio para generar el Excel

  ) { }

  @RequirePermissions(PERMISOS.INVENTARIO_CREAR)
  @Post()
  create(@Body() createInventarioDto: CreateInventarioDto) {
    return this.inventarioService.create(createInventarioDto);
  }

  @RequirePermissions(PERMISOS.INVENTARIO_VER)
  @Get()
  findAll(
    @Query('limit') take: number,
    @Query('skip') skip: number,
    @Query('filter') filter: string,
    @Query('order') order: string,
  ) {
    const where = filter ? JSON.parse(filter) : [];
    const orderBy = order
      ? JSON.parse(order)
      : {};
    const options = {
      where,
      order: orderBy,
      take,
      skip,
    };
    return this.inventarioService.findAll(options);
  }

  @RequirePermissions(PERMISOS.INVENTARIO_VER)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inventarioService.findOne(+id);
  }

  @RequirePermissions(PERMISOS.INVENTARIO_EDITAR)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInventarioDto: UpdateInventarioDto) {
    return this.inventarioService.update(+id, updateInventarioDto);
  }

  @RequirePermissions(PERMISOS.INVENTARIO_ELIMINAR)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.inventarioService.remove(+id);
  }


  @RequirePermissions(PERMISOS.INVENTARIO_INGRESO_MERCADERIA)
  @Post("ingreso-mercaderia")
  createIngreso(@Body() createInventarioDto: CreateIngresoMercaderiaDto) {
    return this.inventarioService.createIngreso(createInventarioDto);
  }

  @RequirePermissions(PERMISOS.INVENTARIO_EDITAR)
  @Post(':id/precio')
  actualizarPrecio(
    @Param('id') id: string,
    @Body() dto: ActualizarPrecioManualDto,
    @Req() req: any,
  ) {
    const userId = req?.user?.id || null;
    return this.inventarioService.actualizarPrecioManual(+id, dto.precio, dto.motivo, userId);
  }

  @RequirePermissions(PERMISOS.INVENTARIO_VER)
  @Get(':id/precio-historial')
  getPrecioHistorial(@Param('id') id: string) {
    return this.inventarioService.getPrecioHistorial(+id);
  }

  @RequirePermissions(PERMISOS.INVENTARIO_VER_EXCEL)
  @Get('excel')
  async exportToExcel(
    @Query('limit') take: number,
    @Query('skip') skip: number,
    @Query('filter') filter: string,
    @Query('order') order: string,
    @Query('columns') columns: string,
    @Res() response: Response,  // Usamos la respuesta de express
  ) {
    const where = filter ? JSON.parse(filter) : [];
    const orderBy = order ? JSON.parse(order) : {};
    const showColumns = columns ? Object.keys(JSON.parse(columns)).filter(key => JSON.parse(columns)[key]) : [];
    const options = {
      where,
      order: orderBy,
      take: Number.MAX_SAFE_INTEGER,
      skip,
    };
    // Obtener los datos desde el servicio
    const presupuestos = await this.inventarioService.findAll(options);
    function getNestedValue(obj: any, path: string) {
      return path.split('.').reduce((acc, part) => acc ? acc[part] : undefined, obj);
    }
    // Procesar los datos para el formato Excel
    const excelData = presupuestos.map((presupuesto) => {
      const filteredData: Record<string, any> = {};

      showColumns.forEach((key) => {
        // Obtener el valor para cada clave, considerando que algunas pueden ser anidadas
        filteredData[key] = getNestedValue(presupuesto, key);
      });

      return filteredData;
    });

    // Generar el archivo Excel como buffer
    const fileBuffer = await this.excelExportService.generarExcel('inventario', excelData);

    // // Configurar los encabezados de la respuesta
    response.header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    response.header('Content-Disposition', 'attachment; filename="inventario.xlsx"');

    // // Enviar el buffer como respuesta
    response.send(fileBuffer);
  }

  @Post('migrar-excel')
  @RequirePermissions(PERMISOS.INVENTARIO_IMPORTAR_EXCEL)
  @UseInterceptors(FileInterceptor('file'))
  async migrarDesdeExcel(
    @UploadedFile() file: File,
    @Body('manejaStock') manejaStock: string,
  ) {
    if (!file) {
      throw new BadRequestException('No se ha proporcionado ningún archivo');
    }

    if (!file.originalname.match(/\.(xlsx|xls)$/)) {
      throw new BadRequestException('El archivo debe ser un Excel (.xlsx o .xls)');
    }

    try {
      const manejaStockBool = manejaStock === 'true';
      const resultado = await this.inventarioService.procesarMigracionExcel(file.buffer, manejaStockBool);
      return resultado;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

}
