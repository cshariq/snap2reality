import { applyParams, ActionOptions, save } from "gadget-server";

export const run: ActionRun = async ({ params, record, logger, api, session }) => {
  // Apply incoming parameters to the record
  applyParams(params, record);

  // Set basic user details
  record.lastSignedIn = new Date();
  record.emailVerified = false;
  (record as any).roles = ["signed-in"];

  await save(record);

  // Assign the user to the active session
  session?.set("user", { _link: record.id });

  return {
    result: "ok",
  };
};

export const options: ActionOptions = {
  actionType: "create",
  returnType: true,
  triggers: {
    googleOAuthSignUp: true,
    emailSignUp: true,
  },
};
