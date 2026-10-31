/* Run against the production export: node scripts/serve.mjs */
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs");
async function run() {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 960 },
    reducedMotion: "reduce",
  });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  const origin = "http://127.0.0.1:3000";
  try {
    for (const route of [
      "/",
      "/services/",
      "/gallery/",
      "/about/",
      "/contact/",
      "/privacy/",
    ]) {
      const response = await page.goto(origin + route);
      assert.equal(response.status(), 200, route);
      await page.locator("h1").waitFor();
      assert.equal(await page.locator("h1").count(), 1);
      assert.ok((await page.title()).includes("NORD"));
      assert.ok(await page.locator('meta[property="og:title"]').count());
      await page.locator("footer").scrollIntoViewIfNeeded();
      await page.waitForTimeout(100);
      const broken = await page
        .locator("img")
        .evaluateAll((imgs) =>
          imgs
            .filter((i) => i.complete && i.naturalWidth === 0)
            .map((i) => i.src),
        );
      assert.deepEqual(broken, [], route + " broken images");
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        ),
        false,
        route + " horizontal overflow",
      );
    }
    await page.goto(origin);
    await page.getByRole("button", { name: "ET", exact: true }).click();
    await page.getByRole("heading", { level: 1, name: /SINU AUTO/ }).waitFor();
    assert.equal(await page.locator("html").getAttribute("lang"), "et");
    await page
      .getByRole("link", { name: "Teenused", exact: true })
      .first()
      .click();
    await page.getByRole("heading", { level: 1, name: /ERAKORDNE/ }).waitFor();
    assert.ok(
      await page
        .getByRole("heading", { name: "Salongi hooldus", exact: true })
        .count(),
    );
    await page.reload();
    await page
      .getByRole("heading", { name: "Salongi hooldus", exact: true })
      .waitFor();
    await page.getByRole("button", { name: "EN", exact: true }).click();
    await page.goto(origin + "/gallery/");
    await page.getByRole("button", { name: /^Interior/ }).click();
    await page.waitForFunction(
      () => document.querySelectorAll(".gallery-item").length === 2,
    );
    await page.locator(".gallery-item").first().click();
    assert.equal(await page.locator("dialog").evaluate((el) => el.open), true);
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("Escape");
    assert.equal(await page.locator("dialog").evaluate((el) => el.open), false);
    await page.getByRole("button", { name: /^All work/ }).click();
    await page.waitForFunction(
      () => document.querySelectorAll(".gallery-item").length === 6,
    );
    const slider = page.getByRole("slider");
    await slider.focus();
    await slider.fill("72");
    assert.equal(await slider.inputValue(), "72");
    await page.keyboard.press("ArrowLeft");
    assert.equal(await slider.inputValue(), "71");
    await page.goto(origin + "/contact/?service=3#booking");
    await page.waitForFunction(
      () => document.querySelector("#booking-service").value === "3",
    );
    await page
      .getByRole("button", { name: "Preview booking request", exact: true })
      .click();
    assert.equal(await page.locator('[aria-invalid="true"]').count(), 5);
    await page.getByLabel("Full name").fill("Demo Visitor");
    await page.getByLabel("Email address").fill("invalid");
    await page.getByLabel("Phone number").fill("123");
    await page.getByLabel("Vehicle make and model").fill("Porsche 911");
    await page.getByLabel("Preferred date").fill("2000-01-01");
    await page
      .getByRole("button", { name: "Preview booking request", exact: true })
      .click();
    assert.equal(await page.locator('[aria-invalid="true"]').count(), 3);
    const submissions = [];
    page.on("request", (req) => {
      if (req.method() !== "GET") submissions.push(req.url());
    });
    await page.getByLabel("Email address").fill("demo@example.com");
    await page.getByLabel("Phone number").fill("+372 5555 1234");
    await page.getByLabel("Preferred date").fill("2099-01-01");
    await page
      .getByRole("button", { name: "Preview booking request", exact: true })
      .click();
    await page
      .getByRole("status")
      .filter({ hasText: "No appointment was submitted" })
      .waitFor();
    assert.deepEqual(submissions, []);
    await page.goto(origin);
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 700) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 30));
      }
      window.scrollTo(0, 0);
    });
    await page.screenshot({
      path: "artifacts/home-desktop.png",
      fullPage: true,
    });
    for (const width of [320, 390, 768]) {
      await page.setViewportSize({ width, height: 844 });
      await page.goto(origin);
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        ),
        false,
        "mobile overflow " + width,
      );
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(origin);
    await page
      .getByRole("button", { name: "Open navigation", exact: true })
      .click();
    await page
      .locator("#mobile-nav")
      .getByRole("link", { name: "Our Work", exact: true })
      .click();
    await page.waitForURL("**/gallery/");
    await page.getByRole("button", { name: /^Interior/ }).click();
    await page.locator(".gallery-item").first().click();
    await page.getByRole("button", { name: "Close", exact: true }).click();
    await page.goto(origin);
    await page.screenshot({
      path: "artifacts/home-mobile.png",
      fullPage: false,
    });
    assert.deepEqual(errors, []);
    console.log(
      "PASS: 6 routes, metadata, images, EN/ET persistence, filters, keyboard lightbox, range control, demo validation/no submissions, responsive widths, mobile navigation.",
    );
  } finally {
    await browser.close();
  }
}
fs.mkdirSync("artifacts", { recursive: true });
run().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
