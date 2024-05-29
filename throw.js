const Buffer = require("safe-buffer").Buffer;
const Keygrip = require("keygrip");

const session =
  "eyJwYXNzcG9ydCI6eyJ1c2VyIjoiNjY0ZGMxYjNhMTQ2ZmM1ZjY4Y2E2ODRiIn19";

const objFromSession = Buffer.from(session, "base64").toString("utf8");

const keygrip = new Keygrip([]);

console.log(objFromSession);
