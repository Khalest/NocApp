import { Server } from "./presentation/server";

(async () => {
  main();
})();

async function main() {
  Server.start();
}
