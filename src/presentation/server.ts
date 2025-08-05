import { CheckServiceUC } from "../domain/use-cases/checks/check-service";
import { CronService } from "./cron/cron-service";

import { FileSystemDataSource } from "@infrastructure/datasources/file-system.datasource";
import { ILogRepository } from "@infrastructure/repository/log.repository.impl";

// -> IRepository -> IDataSource
const fileSystemDataSource = new FileSystemDataSource();
const fileSystemLogRepository = new ILogRepository(fileSystemDataSource);

const SuccessCallback = () => console.log(`${new Date()} - OK`);
const ErrorCallback = (error: string) => console.log(`${new Date()} - ${error}`);

export class Server {
  public static start() {
    console.log("Server is running ");
    CronService.createJob("*/5 * * * * *", async () => {
      // Dependency Injection DataSource
      const checkService = new CheckServiceUC(
        fileSystemLogRepository,
        SuccessCallback,
        ErrorCallback
      );

      await checkService.execute("https://www.google.com");
    });
  }
}
