import http from "k6/http";
import { check, sleep } from "k6";

export let options = {
  vus: 1000,
  duration: "1m",
};

const BASE_URL = "https://stage.agalias-project.online";
const TOKEN = __ENV.BEARER_TOKEN_TEST_LOAD;

function executeScenario() {
  // Load main page
  let resMain = http.get(BASE_URL);
  check(resMain, {
    "main page status is 200": (r) => r.status === 200,
  });

  // Authorized requiest on /s3-files
  let resAuth = http.get(`${BASE_URL}/s3-files`, {
    headers: {
      Authorization: TOKEN,
    },
  });
  check(resAuth, {
    "/s3-files with token returns 200": (r) => r.status === 200,
  });

  sleep(1);
}

export default executeScenario;
