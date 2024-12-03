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
    // delete: "/delete",
  },
  picture: {
    base: "/picture",
    get: "/all",
    upload: "/upload",
  },
  diary: {
    base: "/diary",
    get: "",
    addNote: "/add/note",
    updateNote: "/update/note/:id",
    sendNote: "/send/note/:id",
    sendPhoto: "/send/photo/:id",
    getNoteInfo: "/note/info/:id",
    getPhotoInfo: "/photo/info/:id",
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
  center: {
    base: "/center",
    add: "/add",
    info: "/info/:id",
    update: "/update/:id",
    delete: "/delete/:id",
    search: "/search",
  },
  reservation: {
    base: "/reservation",
    add: "/add",
    ownerAll: "/owner/all",
    centerAll: "/center/all",
    accept: "/accept/:id",
    decline: "/decline/:id",
  },
} as const; // read-only
