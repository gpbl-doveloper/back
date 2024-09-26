/**
 * Express router paths go here.
 */

export default {
  base: "/api",
  users: {
    base: "/users",
    get: "/all",
    add: "/add",
    update: "/update",
    delete: "/delete/:id",
  },
} as const; //읽기 전용으로
