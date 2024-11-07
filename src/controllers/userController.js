import User from "../models/User";
import bcrypt from "bcrypt";

export const getJoin = (req, res) => {
  return res.status(400).render("join", { pageTitle: "Join" });
};

export const postJoin = async (req, res) => {
  const { email, name, username, password, password2 } = req.body;

  const pageTitle = "Join";

  if (password !== password2 || !password) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "Please Check the Password.",
    });
  }

  const exists = await User.exists({
    $or: [{ username }, { email }],
  });
  if (exists) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "This Username or email is already taken.",
    });
  }

  try {
    await User.create({
      email,
      name,
      username,
      password,
    });
    return res.redirect("/login");
  } catch (error) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: error._message,
    });
  }
};

export const getLogin = (req, res) => {
  return res.render("login", { pageTitle: "Login" });
};

export const postLogin = async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  const pageTitle = "Login";

  if (!user) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "This username doesn't exists.",
    });
  }

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "Wrong passsword.",
    });
  }
  // set Sessions
  req.session.loggedIn = true;
  req.session.user = user;
  return res.redirect("/");
};

export const logout = (req, res) => {
  return res.send("Logout");
};

export const profile = (req, res) => {
  return res.send("Profile");
};

export const editUser = (req, res) => {
  return res.send("Edit User");
};

export const deleteUser = (req, res) => {
  return res.send("Delete User");
};
