import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AFIP_SERVICE } from '@/constants/microservices';
import { firstValueFrom } from 'rxjs';

export type PadronData = {
  razonSocial?: string;
  domicilio?: string;
  localidad?: string;
  condicionFrenteIva?: string; // acá solo el código (ej: "1", "6", etc.)
  ingresosBrutos?: string;
};

@Injectable()
export class AfipService {
  constructor(
    @Inject(AFIP_SERVICE.name) private client: ClientProxy,
  ) { }

  private mapPadronData(response: any): PadronData {
    const datos = response?.personaReturn?.datosGenerales;
    const domicilioFiscal = response?.personaReturn?.datosGenerales?.domicilioFiscal;
    const impuestos = [
      ...(response?.personaReturn?.datosRegimenGeneral?.impuesto || []),
      ...(response?.personaReturn?.datosMonotributo?.impuesto || []),
    ];

    const impuestoIVA = impuestos.find((i: any) =>
      ["20", "30", "32"].includes(String(i.idImpuesto))
    );


    return {
      razonSocial: datos ? datos?.razonSocial || datos?.nombre + ' ' + datos?.apellido || "" : "",
      domicilio: domicilioFiscal?.direccion,
      localidad: domicilioFiscal?.localidad,
      condicionFrenteIva: impuestoIVA?.idImpuesto ? String(impuestoIVA?.idImpuesto) : undefined,
      ...response
    };
  }

  async getPadron(cuit: string): Promise<PadronData> {
    const response = await firstValueFrom(
      this.client.send('get-padron', { cuit }),
    );
    return this.mapPadronData(response);
  }
}
