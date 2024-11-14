/**
 * Express router paths go here.
 */

export default {
  base: "/api",
  auth: {
    base: "/auth",
    signup: "/signup",
    login: "/login",
  },
  user: {
    base: "/user",
    // get: "/all",
    // add: "/add",
    // update: "/update/:id",
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
    addNote: "/add/note",
    addPhoto: "/add/photo",
    sendNote: "/send/note",
    sendPhoto: "/send/photo",
  },
  dog: {
    base: "/dog",
    get: "/all",
    reservationsToday: "/reservations/today",
    info: "/info/:id",
    add: "/add",
    update: "/update/:id",
    delete: "/delete/:id",
  },
} as const; //읽기 전용으로
