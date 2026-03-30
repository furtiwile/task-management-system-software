import { AxiosInstance } from "axios";
import { createAxiosClient } from "../Domen/axios/client/AxiosClientFactory";
import { ISIEMService } from "../Domen/services/ISIEMService";
import { SIEMEvent } from "../Domen/model/SIEMEvent";
import { convertEventToSIEMPayload } from "../Domen/Helpers/convertes/SIEMPayloadConverter";
import { ILogerService } from "../../Domain/services/ILogerService";
import { SeverityEnum } from "../../Domain/enums/SeverityEnum";
import { LoggingServiceEnum } from "../../Domain/enums/LoggingServiceEnum";
import { LogerService } from "../../Services/LogerServices/LogerService";

export class SIEMService implements ISIEMService {
  private readonly siemClient: AxiosInstance;
  private readonly loggerService: ILogerService;
  constructor() {
    this.siemClient = createAxiosClient(process.env.SIEM!);
    this.loggerService = new LogerService(LoggingServiceEnum.SIEM);
  }

  sendEvent(event: SIEMEvent): void {
    this.sendToSIEM(event);
  }

  private sendToSIEM(event: SIEMEvent): void {
    const payload = convertEventToSIEMPayload(event);
    this.siemClient.post("/parserEvents/log", payload).catch((err) => {
      this.loggerService.log(SeverityEnum.ERROR, `Failed to send SIEM event for ${event.url ?? "N/A"}: ${err instanceof Error ? err.message : "Unknown"}`);
    });
  }
}
