import { RetoolRPC } from "retoolrpc";
import axios from "axios";

const rpc = new RetoolRPC({
  apiToken: 'retool_01jzjd5943fwg4knjch3c5mawn',
  host: 'https://zetaglobalcustomerengineeringintern.retool.com',
  resourceId: 'dcf37370-8fce-49ef-b823-ec140f3f31c6',
  environmentName: 'production',
  pollingIntervalMs: 1000,
  version: '0.0.1',
  logLevel: 'info',
});

const BASE_URL = 'http://localhost:3000'; 

rpc.register({
  name: 'getAllUsers',
  arguments: {},
  implementation: async () => (await axios.get(`${BASE_URL}/users`)).data,
});

rpc.register({
  name: 'getAllApps',
  arguments: {},
  implementation: async () => (await axios.get(`${BASE_URL}/apps`)).data,
});

rpc.register({
  name: 'getUserPermissions',
  arguments: {
    email: { type: 'string', required: true },
  },
  implementation: async ({ email }) => {
    const users = (await axios.get(`${BASE_URL}/users`)).data;
    const user = users.find(u => u.email === email);
    if (!user) throw new Error('User not found');
    return (await axios.get(`${BASE_URL}/permissions/${user.id}`)).data;
  }
});

rpc.register({
  name: 'grantAccess',
  arguments: {
    user_id: { type: 'number', required: true },
    app_id: { type: 'number', required: true },
  },
  implementation: async ({ user_id, app_id }) =>
    (await axios.post(`${BASE_URL}/permissions`, { user_id, app_id })).data,
});

rpc.register({
  name: 'revokeAccess',
  arguments: {
    user_id: { type: 'number', required: true },
    app_id: { type: 'number', required: true },
  },
  implementation: async ({ user_id, app_id }) =>
    (await axios.delete(`${BASE_URL}/permissions`, { data: { user_id, app_id } })).data,
});

rpc.listen();
