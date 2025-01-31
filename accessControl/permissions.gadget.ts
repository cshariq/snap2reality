import type { GadgetPermissions } from "gadget-server";

/**
 * This metadata describes the access control configuration available in your application.
 * Grants that are not defined here are set to false by default.
 *
 * View and edit your roles and permissions in the Gadget editor at https://snap-2-reality.gadget.app/edit/settings/permissions
 */
export const permissions: GadgetPermissions = {
  type: "gadget/permissions/v1",
  roles: {
    "signed-in": {
      storageKey: "signed-in",
      default: {
        read: true,
        action: true,
      },
      models: {
        image: {
          read: true,
          actions: {
            create: true,
            delete: true,
            generate: true,
            update: true,
            uploadFile: true,
          },
        },
        part: {
          read: true,
          actions: {
            delete: true,
            extract: true,
            update: true,
          },
        },
        user: {
          read: true,
          actions: {
            changePassword: {
              filter: "accessControl/filters/user/tenant.gelly",
            },
            dropbox: true,
            imageProcessing: true,
            signOut: {
              filter: "accessControl/filters/user/tenant.gelly",
            },
            update: {
              filter: "accessControl/filters/user/tenant.gelly",
            },
          },
        },
        z: {
          read: true,
          actions: {
            create: true,
            delete: true,
            update: true,
          },
        },
      },
    },
    unauthenticated: {
      storageKey: "unauthenticated",
      models: {
        user: {
          read: true,
          actions: {
            changePassword: true,
            delete: true,
            dropbox: true,
            imageProcessing: true,
            sendResetPassword: true,
            sendVerifyEmail: true,
            signIn: true,
            signUp: true,
            update: true,
            verifyEmail: true,
          },
        },
      },
    },
  },
};
