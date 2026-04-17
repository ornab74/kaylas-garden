import { createBuilder } from './.modules/aspire.js';

async function main(): Promise<void> {
  const builder = await createBuilder();

  await builder
    .addJavaScriptApp('web', '.')
    .withHttpEndpoint({ port: 3000, env: 'PORT' });

  await builder.build().run();
}

void main().catch((error: unknown) => {
  console.error('Failed to start the Aspire AppHost.', error);
  process.exit(1);
});
