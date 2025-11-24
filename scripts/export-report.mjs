import { chromium } from "playwright";
import { execSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {
  console.log("Running Playwright tests...");

  // Run playwright tests & generate HTML report
  execSync("npx playwright test --reporter=html", { stdio: "inherit" });

  console.log("Generating PDF report...");

  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Path to HTML report
  const reportPath = path.join(process.cwd(), "playwright-report", "index.html");

  await page.goto(`file://${reportPath}`, {
    waitUntil: "networkidle"
  });

  await page.pdf({
    path: "Playwright_Test_Report.pdf",
    format: "A4",
    printBackground: true
  });

  await browser.close();

  console.log("📄 PDF saved: Playwright_Test_Report.pdf");
})();
