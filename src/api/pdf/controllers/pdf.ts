const puppeteer = require('puppeteer');

export default {
  generatePdf: async (ctx) => {
    try {
      // Spuštění prohlížeče
      const browser = await puppeteer.launch();
      // Otevření nové stránky
      const page = await browser.newPage();
      
      // Navigace na cílovou URL
      await page.goto('https://www.16personalities.com/enfj-personality');
      
      // (Volitelné) Počkání na konkrétní element na stránce
      // await page.waitForSelector('selector');

      // Generování PDF
      const pdf = await page.pdf({ format: 'A4' });
      
      // Uzavření prohlížeče
      await browser.close();
      
      // Nastavení HTTP hlaviček pro odpověď
      ctx.set("Content-Type", "application/pdf");
      ctx.set("Content-Disposition", "attachment; filename=\"scraped.pdf\"");
      
      // Odeslání PDF v odpovědi
      ctx.body = pdf;
    } catch (err) {
      ctx.body = err;
    }
  }
};
