import { expect, test } from "@playwright/test";
import { completeOnboarding, signup } from "./helpers";

test("a failed run tells the user why instead of going quiet", async ({ page }) => {
  const stamp = Date.now();
  // completeOnboarding skips model setup, so the first run fails in the executor.
  await signup(page, `run-failure-${stamp}@rakazo.test`, "password12", "Run Failure");
  await completeOnboarding(page);

  await page.getByPlaceholder(/^Message /).fill("do something");
  await page.getByRole("button", { name: "Send" }).click();

  const error = page.getByTestId("composer-error");
  await expect(error).toBeVisible({ timeout: 30_000 });
  await expect(error).not.toBeEmpty();

  await page.getByTestId("composer-error-dismiss").click();
  await expect(error).toBeHidden();
});
