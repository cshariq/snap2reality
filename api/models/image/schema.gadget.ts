import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "image" model, go to https://snap-2-reality.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "wObnicMSmFGn",
  fields: {
    height: { type: "number", storageKey: "Ms_hu26KcQmU" },
    image: {
      type: "file",
      allowPublicAccess: true,
      storageKey: "OXfurtO0xWQz",
    },
    product: {
      type: "string",
      validations: { required: true },
      storageKey: "77wvpXKb8WeZ",
    },
    quantity: { type: "number", storageKey: "5JB93_Op2bOb" },
    width: { type: "number", storageKey: "pocvBjiJqHnz" },
    xposition: { type: "number", storageKey: "xUYWv2tfiZEb" },
    yposition: { type: "number", storageKey: "yQvOutMhTMZ_" },
  },
};
