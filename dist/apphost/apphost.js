"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aspire_js_1 = require("./.modules/aspire.js");
async function main() {
    const builder = await (0, aspire_js_1.createBuilder)();
    await builder
        .addJavaScriptApp('web', '.')
        .withHttpEndpoint({ port: 3000, env: 'PORT' })
        .withArgs(['--hostname', '0.0.0.0']);
    await builder.build().run();
}
void main().catch((error) => {
    console.error('Failed to start the Aspire AppHost.', error);
    process.exit(1);
});
