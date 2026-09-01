export async function mockOpenRouter(page, outputText) {
  await page.route('**/openrouter.ai/**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        choices: [
          {
            message: {
              content: outputText,
            },
          },
        ],
      }),
    });
  });
}
export async function mockOpenRouterError(page, statusCode, errorMessage) {
  await page.route('**/openrouter.ai/**', async (route) => {
    await route.fulfill({
      status: statusCode,
      contentType: 'application/json',
      body: JSON.stringify({
        error: {
          message: errorMessage,
        },
      }),
    });
  });
}
export async function mockGeminiStream(page, chunks) {
  await page.route('**/generativelanguage.googleapis.com/**', async (route) => {
    let body = '';
    chunks.forEach((chunk) => {
      const payload = {
        candidates: [
          {
            content: {
              parts: [
                {
                  text: chunk,
                },
              ],
            },
          },
        ],
      };
      body += 'data: ' + JSON.stringify(payload) + '\n\n';
    });
    body += 'data: [DONE]\n\n';
    await route.fulfill({
      status: 200,
      contentType: 'text/event-stream',
      body,
    });
  });
}
export async function mockGeminiError(page, statusCode, errorMessage) {
  await page.route('**/generativelanguage.googleapis.com/**', async (route) => {
    await route.fulfill({
      status: statusCode,
      contentType: 'application/json',
      body: JSON.stringify({
        error: {
          message: errorMessage,
        },
      }),
    });
  });
}
