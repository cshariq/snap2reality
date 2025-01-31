import { applyParams, save, ActionOptions } from "gadget-server";

// Powers form in web/routes/reset-password.tsx

export const run: ActionRun = async ({ params, record, logger, api, connections }) => {
  // Applies new 'password' to the user record and saves to database
  applyParams(params, record);
  await save(record);
  return {
    result: "ok"
  }
};

export const onSuccess: ActionOnSuccess = async ({ params, record, logger, api, connections }) => {
  // Your logic goes here
};

export const options: ActionOptions = {
  actionType: "custom",
  returnType: true,
  triggers: {
    resetPassword: true,
  },
};
