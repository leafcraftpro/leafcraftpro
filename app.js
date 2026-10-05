/**
 * Entry-point alias.
 *
 * Hostinger's "Setup Node.js App" creates an application with a default
 * startup file of `app.js`, and that stub is written in CommonJS. This
 * project is an ES module (`"type": "module"` in package.json), so that
 * stub fails immediately with "require is not defined in ES module
 * scope" and Passenger answers with a 503.
 *
 * Rather than depending on which startup file the panel is configured
 * with, this file simply loads the real server. Point the panel at
 * `server.js` if you prefer — both work.
 */

import './server.js';
