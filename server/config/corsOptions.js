import whitelist from "./whitelist.js";

const corsOptions = {
  origin: (origin, cb) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      cb(null, true);
    } else {
      cb(new Error("CORS ERROR"));
    }
  },
};

export default corsOptions;
