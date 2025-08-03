import { CronService } from "./cron/cron-service";

export class Server {
  public static start() {
    console.log("Server is running ");
    CronService.createJob("*/5 * * * * *", () => {
      const date = new Date();
      console.log("5 seconds passed", date);
    });
  }
}
