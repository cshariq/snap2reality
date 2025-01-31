import { applyParams, save, ActionOptions } from "gadget-server";

// Powers form in web/routes/sign-in.tsx

export const run: ActionRun = async ({ params, record, logger, api, session }) => {
  applyParams(params, record);
  record.lastSignedIn = new Date();
  await save(record);
  // Assigns the signed-in user to the active session
  session?.set("user", { _link: record.id });
};

export const onSuccess: ActionOnSuccess = async ({ params, record, logger, api, session }) => {
  // Your logic goes here
};

export const options: ActionOptions = {
  actionType: "update",
  triggers: {
    googleOAuthSignIn: true,
    emailSignIn: true,
  },
};
