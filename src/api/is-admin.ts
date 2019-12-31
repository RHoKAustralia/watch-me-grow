import { NextApiRequest, NextApiResponse } from "next";
import basicAuth from "basic-auth";
import compare from "tsscmp";

/**
 * Checks if the user has specified the right username and password.
 *
 * If so, simply returns true.
 * If false, returns the request with 401 Access Denied and returns false.
 */
export default function isAdmin(req: NextApiRequest, res: NextApiResponse) {
  const credentials = basicAuth(req);

  if (!credentials || !check(credentials.name, credentials.pass)) {
    res.statusCode = 401;
    res.setHeader("WWW-Authenticate", 'Basic realm="watchmegrow.care"');
    console.error(
      "Denied access" + (!!credentials ? ` for ${credentials.name}` : "")
    );
    res.end("Access denied");
    return false;
  } else {
    return true;
  }
}

function check(name: string, pass: string) {
  if (process.env.WMG_PASSWORD) {
    var valid = true;
    // Simple method to prevent short-circut and use timing-safe compare
    valid = compare(name, "admin") && valid;
    valid = compare(pass, process.env.WMG_PASSWORD) && valid;
    return valid;
  } else {
    console.error(
      `process.env.WMG_PASSWORD was not set, all auth'd requests will be denied`
    );
    return false;
  }
}
