export const localsMiddleware = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn); // default value: false
  res.locals.siteName = "Wetube";
  res.locals.loggedInUser = req.session.user; // default value: indefined

  next();
};
