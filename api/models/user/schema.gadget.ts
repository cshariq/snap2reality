import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "user" model, go to https://testtttttttt.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "jra4aG_gPmc4",
  fields: {
    email: {
      type: "email",
      validations: { required: true, unique: true },
      storageKey: "l1W_e0DB70m0",
    },
    emailVerificationToken: {
      type: "string",
      storageKey: "EMva9ZzW_UfB",
    },
    emailVerificationTokenExpiration: {
      type: "dateTime",
      includeTime: true,
      storageKey: "j34VdaMGdTXV",
    },
    emailVerified: {
      type: "boolean",
      default: false,
      storageKey: "K8L-Dz1FE8Sl",
    },
    firstName: { type: "string", storageKey: "ec3HT5mQajno" },
    googleImageUrl: { type: "url", storageKey: "QbZlJ01DQWCD" },
    googleProfileId: { type: "string", storageKey: "qzvUvo2a-KbZ" },
    lastName: { type: "string", storageKey: "76KGXRUvALLg" },
    lastSignedIn: {
      type: "dateTime",
      includeTime: true,
      storageKey: "FFDDPzv07TbS",
    },
    password: {
      type: "password",
      validations: { strongPassword: true },
      storageKey: "CfKy82ZjkdcU",
    },
    profilePicture: {
      type: "file",
      allowPublicAccess: true,
      storageKey: "hIngEnNeCwUl",
    },
    resetPasswordToken: {
      type: "string",
      storageKey: "eHaGeX_vZnWT",
    },
    resetPasswordTokenExpiration: {
      type: "dateTime",
      includeTime: true,
      storageKey: "wQGqM65h0lSd",
    },
    roles: { type: "roleList", storageKey: "4jDH1mQKCiBU" },
  },
};
