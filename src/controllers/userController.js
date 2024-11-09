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

  const user = await User.findOne({ username, socialOnly: false });
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

// GitHub Login 공부 더 해야 함. 다시 반복적으로 보자.
// todo: Google Login 구현
export const startGitHubLogin = (req, res) => {
  const baseUrl = "https://github.com/login/oauth/authorize";
  const config = {
    client_id: process.env.GITHUB_CLIENT_ID,
    allow_signup: true,
    scope: "read:user user:email",
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl);
};

export const finishGitHubLogin = async (req, res) => {
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GITHUB_CLIENT_ID,
    client_secret: process.env.GITHUB_SECRET,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;

  const tokenRequest = await (
    await fetch(finalUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();

  if ("access_token" in tokenRequest) {
    const { access_token } = tokenRequest;
    const apiUrl = "https://api.github.com";
    const userData = await (
      await fetch(`${apiUrl}/user`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();

    const emailData = await (
      await fetch(`${apiUrl}/user/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailObj = emailData.find(
      (email) => email.primary === true && email.verified === true
    );
    if (!emailObj) {
      return res.redirect("/login");
    }
    let user = await User.findOne({ email: emailObj.email });
    if (!user) {
      user = await User.create({
        avatarUrl: userData.avatar_url,
        email: emailObj.email,
        name: userData.name,
        username: userData.login,
        password: "",
        socialOnly: true,
      });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
  } else {
    return res.redirect("/login");
  }
};

export const logout = (req, res) => {
  req.session.destroy();
  return res.redirect("/");
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
