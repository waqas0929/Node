const express = require("express");
require("./db/config");
const User = require("./db/User");
const { authenticateToken } = require("./middleware/auth");
const bcrypt = require("bcrypt");

const Jwt = require("jsonwebtoken");
const jwtKey = "login";

const compareString = (string, encryptedString) => {
  return bcrypt.compareSync(string, encryptedString);
};

const app = express();

app.use(express.json());

const encryptString = async (string) => {
  const salt = await bcrypt.genSalt(10);

  return bcrypt.hashSync(string, salt);
};

app.post("/register", async (req, resp) => {
  try {
    let existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      resp.send({ message: "Email is already register" });
    } else {
      const hashedPassword = await encryptString(req.body.password);

      let result = await User.create({
        email: req.body.email,
        password: hashedPassword,
        previousPasswords: [{ password: hashedPassword, date: new Date() }],
      });
      resp.send(result);
    }
  } catch (error) {
    resp.status(404).send({ message: error.message });
  }
});
app.post("/login", async (req, resp) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email,
    });
    if (!user) {
      return resp.status(401).send({ message: "Invalid email or password" });
    }
    const isPasswordValid = await compareString(password, user.password);

    if (!isPasswordValid) {
      return resp.status(401).send({ message: "Invalid email or password" });
    }

    const token = Jwt.sign({ user }, jwtKey);
    const userDetails = {
      id: user._id,
      name: user.name,
      email: user.email,
    };
    resp.send({ userDetails, token });
  } catch (error) {
    resp.status(500).send({ message: error.message });
  }
});

app.get("/user/my/password", authenticateToken, async (req, resp) => {
  try {
    let user = await User.findById(req.user.id);
    if (!user) {
      return resp.status(404).send({ message: "User Not Found" });
    }
    resp.send(user);
  } catch (error) {
    resp.status(500).send({ message: error.messagae });
  }
});

app.put("/user/my/password", authenticateToken, async (req, resp) => {
  try {
    let user = await User.findById(req.user.id);

    if (!user) {
      return resp.status(404).send({ message: "User Not Found" });
    }

    // check if old password is entered correctly
    if (!req.body.oldPassword || !req.body.newPassword) {
      return resp
        .status(400)
        .send({ message: "Please Enter both old and new Password" });
    }

    const isOldPasswordCorrect = await compareString(
      req.body.oldPassword,
      user.password
    );

    if (!isOldPasswordCorrect) {
      return resp.status(400).send({ message: "incorrect old password" });
    }

    //check if the new password is same as the old password
    if (req.body.oldPassword === req.body.newPassword) {
      return resp
        .status(400)
        .send({ message: "New Password conot be the same as old password" });
    }

    // Check if the new password has been used before

    const previousPasswords = user.previousPasswords || [];
    const isNewPasswordUsedBefore = previousPasswords
      .map((passwordObject) => passwordObject.password)
      .some((hashedPassword) =>
        bcrypt.compareSync(req.body.newPassword, hashedPassword)
      );

    if (isNewPasswordUsedBefore) {
      return resp
        .status(400)
        .send({ message: "new password has been used before" });
    }

    // Generate a new password

    const hashedPassword = await encryptString(req.body.newPassword);

    // Save the new password and update the previous passwords list

    if (previousPasswords.length >= 10) {
      previousPasswords.pop();
    }
    user.password = hashedPassword;
    user.previousPasswords = [
      ...previousPasswords,
      { password: user.password, date: new Date() },
    ];

    // //add password to password history
    user.password = [{ password: user.password, date: new Date() }];

    user.password = hashedPassword;
    await user.save();

    resp.send({ message: "Password Changed Successfully" });
  } catch (error) {
    resp.status(500).send({ message: error.message });
  }
});

app.listen(3001);

// (async () => {
//   const encrypted = await encryptString("taha");

//   const resp = await compareString("taha", encrypted);
//   debugger;
// })();
