const {test, expect} = require("@playwright/test");

test("real browser: start, pause, resume and reset", async ({page}) => {
  await page.goto("http://127.0.0.1:8765/");
  await expect(page.getByRole("status")).toContainText("准备就绪");
  await page.getByRole("button",{name:"开始",exact:true}).click();
  await expect(page.getByRole("status")).toContainText("游戏中");
  await page.keyboard.press("Space");
  await expect(page.getByRole("status")).toContainText("已暂停");
  await page.keyboard.press("Space");
  await expect(page.getByRole("status")).toContainText("游戏中");
  await page.getByRole("button",{name:"重新开始"}).click();
  await expect(page.getByRole("status")).toContainText("准备就绪");
  await expect(page.locator("#score")).toHaveText("0");
});

test("real browser: input controls and wall collision", async ({page}) => {
  await page.setViewportSize({width:390,height:844});
  await page.goto("http://127.0.0.1:8765/");
  await expect(page.locator("canvas")).toBeVisible();
  await page.getByRole("button",{name:"开始",exact:true}).click();
  await page.getByRole("button",{name:"向上"}).click();
  await expect(page.getByRole("status")).toContainText("游戏中");
  // Moving upwards from row five reaches the wall in about 750 ms.
  await expect(page.getByRole("status")).toContainText("游戏结束", {timeout:6000});
  await page.getByRole("button",{name:"重新开始"}).click();
  await expect(page.getByRole("status")).toContainText("准备就绪");
});
