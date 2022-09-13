// npx autocannon -c 100 -d 10 localhost:3000 --renderStatusCode
import axios from "axios";
import autocannon from "autocannon";
import { createHmac } from "node:crypto";
axios.defaults;

const URL = "http://localhost:8080/api/v1";

const createUser = async ({ email, password }) => {
  try {
    const user = {
      email,
      password,
      name: "autocannon",
      role: "technician",
    };

    const response = await axios.post(`${URL}/user`, user);
    console.log(response?.data?.message);
  } catch (error) {
    console.error(JSON.stringify(error.response.data));
    throw error;
  }
};

const getToken = async ({ email, password }) => {
  const login = {
    email,
    password,
  };
  const { data } = await axios.post(`${URL}/login`, login);
  const { token } = data;
  return { token };
};

const createTasks = async ({ token }) => {
  try {
    console.log("------ Start creating tasks ------");
    const secret = "abcdefg";
    const promiseCreateTasks = [...Array(1000)].map(async (numberNull) => {
      const hash = createHmac("sha256", secret)
        .update("I love cupcakes")
        .digest("hex");
      const task = {
        name: `task-${hash}`,
        summary: "summary",
      };
      await axios.post(`${URL}/tasks`, task, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("task created");
    });
    await Promise.all(promiseCreateTasks);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const runLoadTests = async () => {
  try {
    const autocannonUser = {
      email: "autocannon@teste.com",
      password: "autocannon",
    };
    //await createUser(autocannonUser);
    const { token } = await getToken(autocannonUser);
    //await createTasks({ token });
    console.log("--- running load tests ----");

    const instaceAutocannon = autocannon({
      url: `${URL}/tasks`,
      connections: 10,
      pipelining: 1,
      duration: 10,
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    // this is used to kill the instance on CTRL-C
    process.once("SIGINT", () => {
      instaceAutocannon.stop();
    });
    autocannon.track(instaceAutocannon, {
      renderProgressBar: true,
      renderLatencyTable: true,
      renderResultsTable: true,
    });
    const result = await instaceAutocannon;
  } catch (error) {
    throw error;
  }
};

runLoadTests();
