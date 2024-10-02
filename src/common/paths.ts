/**
 * Express router paths go here.
 */

export default {
  base: "/api",
  user: {
    base: "/user",
    get: "/all",
    add: "/add",
    update: "/update",
    delete: "/delete/:id",
  },
  diary: {
    base: "/diary",
  },
} as const; //읽기 전용으로
