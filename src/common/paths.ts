/**
 * Express router paths go here.
 */

export default {
  base: "/api",
  user: {
    base: "/user",
    // get: "/all",
    // add: "/add",
    // update: "/update",
    // delete: "/delete/:id",
  },
  picture: {
    base: "/picture",
    get: "/all",
    upload: "/upload",
  },
  diary: {
    base: "/diary",
    get: "/all",
    info: "/:id",
    add: "/add",
  },
} as const; //읽기 전용으로
