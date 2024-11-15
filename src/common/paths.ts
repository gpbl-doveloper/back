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
    info: "/info/:id",
    update: "/update",
    delete: "/delete",
  },
  picture: {
    base: "/picture",
    get: "/all",
    upload: "/upload",
  },
  diary: {
    base: "/diary",
    get: "/",
    addNote: "/add/note",
    addPhoto: "/add/photo",
    updateNote: "/update/note/:id",
    updatePhoto: "/update/photo/:id",
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
