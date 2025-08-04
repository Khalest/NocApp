import { CheckService } from "../domain/use-cases/checks/check-service";
import { CronService } from "./cron/cron-service";

export class Server {
  public static start() {
    console.log("Server is running ");
    CronService.createJob("*/5 * * * * *", async () => {
      // Dependency Injection
      const checkService = new CheckService(
        () => console.log("success"),
        (error) => console.log(error)
      );
      await checkService.execute("https://www.google.com");
    });
  }
}
