const puppeteer = require("puppeteer");
const PptxGenJS = require("pptxgenjs");
const path = require("path");
const fs = require("fs");

// ===== ANSI COLORS FOR CLI =====
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  red: "\x1b[31m",
  bold: "\x1b[1m",
};

(async () => {
  console.log(`\n${colors.cyan}${colors.bold}🚀 Starting Presentation Converter...${colors.reset}\n`);

  try {
    // ===== PARSE ARGUMENTS =====
    const args = process.argv.slice(2);
    const isFresh = args.includes("--fresh") || args.includes("-F");
    const exportPdf = args.includes("--pdf") || args.includes("-P");
    const help = args.includes("--help") || args.includes("-h") || args.includes("-H");
    
    if (help) {
      console.log(`
${colors.bold}Usage:${colors.reset} node converter.js [options]

${colors.bold}Options:${colors.reset}
  --fresh, -F   Remove the old 'output' directory before running.
  --pdf, -P     Export as a PDF document instead of PPTX.
  --slides=N    Specify the total number of slides (default: 10).
  --delay=N     Specify the animation delay in ms (default: 1500).
  --url=URL     Specify a custom URL to capture (default: local index.html).
  --help, -h, -H    Show this help message.
      `);
      process.exit(0);
    }

    const getArgValue = (prefix, defaultVal) => {
      const arg = args.find(a => a.startsWith(prefix));
      return arg ? arg.split("=")[1] : defaultVal;
    };

    const TOTAL_SLIDES = parseInt(getArgValue("--slides=", "10"), 10);
    const DELAY_MS = parseInt(getArgValue("--delay=", "1500"), 10);
    let targetUrl = getArgValue("--url=", null);
    
    if (!targetUrl) {
      targetUrl = "file://" + path.join(__dirname, "index.html");
    }

    const WIDTH = 1920;
    const HEIGHT = 1080;

    // ===== CLEANUP =====
    if (isFresh) {
      const outputDir = path.join(__dirname, "output");
      if (fs.existsSync(outputDir)) {
        console.log(`${colors.yellow}🧹 Removing old output directory...${colors.reset}`);
        try {
          fs.rmSync(outputDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
        } catch (e) {
          if (e.code === 'EBUSY' || e.code === 'EPERM') {
            console.error(`\n${colors.red}${colors.bold}❌ Cannot delete the old output directory.${colors.reset}`);
            console.error(`${colors.yellow}It looks like one of the files (e.g., a PowerPoint presentation) is currently open in another program.${colors.reset}`);
            console.error(`${colors.cyan}Please close PowerPoint or any app using the files in the 'output' folder and try again.${colors.reset}\n`);
            process.exit(1);
          } else {
            throw e;
          }
        }
      }
    }

    // ===== CREATE DATE STRING & DIRS =====
    const now = new Date();
    const date = now.toISOString().slice(0, 19).replace(/[:T]/g, "-");
    const slidesDir = path.join(__dirname, "output", "slides", date);
    const pptDir = path.join(__dirname, "output", "presentations", date);
    const pdfDir = path.join(__dirname, "output", "pdfs", date);

    fs.mkdirSync(slidesDir, { recursive: true });
    if (!exportPdf) fs.mkdirSync(pptDir, { recursive: true });
    if (exportPdf) fs.mkdirSync(pdfDir, { recursive: true });

    // ===== LAUNCH BROWSER =====
    console.log(`${colors.blue}🌐 Launching headless browser...${colors.reset}`);
    const browser = await puppeteer.launch({
      headless: "new",
      defaultViewport: null,
      args: ["--window-size=1920,1080", "--force-device-scale-factor=1", "--no-sandbox"],
    });

    const page = await browser.newPage();
    console.log(`${colors.blue}📄 Loading presentation at: ${colors.reset}${targetUrl}`);
    
    await page.goto(targetUrl, { waitUntil: "networkidle0" });

    await page.setViewport({ width: WIDTH, height: HEIGHT, deviceScaleFactor: 1 });

    await page.evaluate((w, h) => {
      document.body.style.width = w + "px";
      document.body.style.height = h + "px";
      document.body.style.margin = "0";
      document.body.style.overflow = "hidden";
    }, WIDTH, HEIGHT);

    let images = [];

    // ===== CAPTURE SLIDES =====
    console.log(`\n${colors.magenta}📸 Capturing ${TOTAL_SLIDES} slides...${colors.reset}`);
    for (let i = 0; i < TOTAL_SLIDES; i++) {
      await page.evaluate((i) => {
        if (typeof window.goSlide === 'function') {
           window.goSlide(i);
        }
      }, i);

      // Wait for animations
      await new Promise((r) => setTimeout(r, DELAY_MS));

      const fileName = `slide_${String(i + 1).padStart(2, '0')}.png`;
      const filePath = path.join(slidesDir, fileName);

      await page.screenshot({
        path: filePath,
        clip: { x: 0, y: 0, width: WIDTH, height: HEIGHT },
      });

      images.push(filePath);
      process.stdout.write(`\r${colors.green}✅ Captured [${i + 1}/${TOTAL_SLIDES}] - ${fileName}${colors.reset}`);
    }
    console.log(); // Newline after progress

    if (exportPdf) {
      // ===== CREATE PDF =====
      console.log(`\n${colors.yellow}📄 Generating PDF document...${colors.reset}`);
      const pdfFileName = `presentation_${date}.pdf`;
      const pdfPath = path.join(pdfDir, pdfFileName);
      
      // We can generate a PDF directly from the page by scrolling through or using the print stylesheet.
      // However, creating it from the high-res screenshots guarantees the exact visual fidelity.
      await page.setContent(
        images.map(img => `<img src="file://${img}" style="width: 1920px; height: 1080px; margin: 0; padding: 0; display: block; page-break-after: always;">`).join(''),
        { waitUntil: 'networkidle0' }
      );
      
      await page.pdf({
        path: pdfPath,
        width: '1920px',
        height: '1080px',
        printBackground: true,
        pageRanges: `1-${TOTAL_SLIDES}`
      });

      console.log(`${colors.green}${colors.bold}🎉 PDF successfully created: ${pdfFileName}${colors.reset}\n`);
    } else {
      // ===== CREATE PPT =====
      console.log(`\n${colors.yellow}📊 Generating PowerPoint presentation...${colors.reset}`);
      const pptx = new PptxGenJS();
      const pptWidth = 10;
      const pptHeight = 5.625;
      pptx.defineLayout({ name: "CUSTOM_16x9", width: pptWidth, height: pptHeight });
      pptx.layout = "CUSTOM_16x9";

      images.forEach((img) => {
        const slide = pptx.addSlide();
        slide.background = { path: img };
      });

      const pptFileName = `presentation_${date}.pptx`;
      const pptPath = path.join(pptDir, pptFileName);

      await pptx.writeFile({ fileName: pptPath });
      console.log(`${colors.green}${colors.bold}🎉 PPTX successfully created: ${pptFileName}${colors.reset}\n`);
    }

    await browser.close();
  } catch (error) {
    console.error(`\n${colors.red}${colors.bold}❌ Error during conversion:${colors.reset}`, error);
    process.exit(1);
  }
})();
