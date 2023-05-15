const express = require("express");
const app = express();
const port = 5000;
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const { Products, ProductCart } = require("./models");
const { User } = require("./models");
const bcrypt = require("bcrypt");
const secretKey = "secretkey";
const crypto = require("crypto");
const { Op } = require("sequelize");
const db = require("./models/index");
const generator = require("generate-password");
const cors = require("cors");
const nodemailer = require("nodemailer");
// const Url = "http://localhost:3001";

// var request = require('request');
// Set up Global configuration access

// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "http://localhost:3001");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept, authorization"
//   );
//   res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
//   next();
// });
app.use(express.json());
app.use(express.static("./photos/"));
app.use("*", cors());

// var Data
// request('https://fakestoreapi.com/products', function (error, response, body) {
//     if (!error && response.statusCode === 200) {
//          Data=(JSON.parse(body)) // Print the google web page.
//      }
// })

// Product add in database
// app.post("/add", async (req, res) => {
//   ProductListData.forEach((value) => {
//     Products.create({
//       productName: value.Name,
//       productPrice: value.price,
//       productDiscription: value.Name,
//       productImage: value.image,
//       productLabel: value.label,
//       productSize: value.size,
//       productOffer: value.ProductOffer,
//       productPath: value.to,
//     });
//   });
// });

// app.post("/Register", async (req, res) => {
//   const { firstName, lastName, email, password } = req.body;
//   var data = { firstName, lastName, email, password };
//   console.log(data);
//   if (!firstName || !lastName || !email || !password) {
//     res.status(401).send("all filds are required ");
//   } else {
//     const user = await User.findOne({ where: { email: email } });
//     if (user) {
//       res.send(" user already exits");
//     } else {
//       var EncPass = await bcrypt.hash(password, 10);

//       await User.create({ firstName, lastName, email, password: EncPass });
//       res.status(200).send("Registered succesfully");
//     }
//   }
// });

app.post("/Register", async (req, res) => {
  const { email, firstName } = req.body;
  var data = { email, firstName };

  function generatePasswordFromEmail(email) {
    const firstChar = email.charAt(0).toUpperCase();
    const emailPrefix = email.substring(0, 3);
    const randomNumber = Math.floor(Math.random() * 9000) + 1000;

    const password = `${firstChar}${emailPrefix}@${randomNumber}`;
    return password;
  }
  if (!email || !firstName) {
    res.status(401).send("all filds are required ");
  } else {
    const user = await User.findOne({ where: { email: email } });
    if (user) {
      res.send(" user already exits");
    } else {
      const generatedPass = generatePasswordFromEmail(email);

      var EncPass = await bcrypt.hash(generatedPass, 10);
      await User.create({ email, firstName, password: EncPass });
      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "urvashil.itpath@gmail.com",
          pass: "rjfhsbwlwtkihvey",
        },
      });
      var mailOptions = {
        from: "urvashil.itpath@gmail.com",
        to: email,
        subject: "Your Authntication Password",
        text: "Your Password is :-   " + generatedPass,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
      res.status(200).send("Registered succesfully");
    }
  }
});

function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const token = bearer[1];
    req.token = token;
    next();
  } else {
    return res.send({
      result: "Token is not valid",
    });
  }
}

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  var data = { email, password };

  if (!email || !password) {
    res.status(401).send("all filds are required ");
  } else {
    const user = await User.findOne({ where: { email: email } });

    if (user === null) {
      res.send("Email Does not exist");
    }

    if (user) {
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          console.error(err);
          return;
        }
        if (result) {
          jwt.sign({ user }, secretKey, (err, token) => {
            res.send({
              msg: "login successful",
              token: token,
              role: user.role,
            });
          });
        } else {
          return res.json({ Password: "password was incorect" });
        }
      });
    }
  }
});

app.get("/profile", verifyToken, (req, res, next) => {
  jwt.verify(req.token, secretKey, (err, AunthenticateData) => {
    if (err) {
      return res.status(503).send({
        result: "Invalid token",
      });
    } else {
      return res.send({ AunthenticateData });
    }
  });
});

// app.get("/users", async (req, res) => {
//   User.findAll().then((User) => res.json(User));
// });

//all user
// app.get("/users/:id", verifyToken, (req, res) => {
//   User.findAll({ where: { id: req.params.id } }).then((users) =>
//     res.json(users)
//   );
// });

//update
// app.patch("/users/:id", verifyToken, (req, res) => {
//   User.findByPk(req.params.id).then(function (users) {
//     users
//       .update(req.body, {
//         where: { id: req.params.id },
//       })
//       .then((users) => {
//         res.json(users);
//       });
//   });
// });

//delete
// app.delete("/users/:id", (req, res) => {
//   User.findByPk(req.params.id)
//     .then(function (users) {
//       users.destroy();
//     })
//     .then((users) => {
//       res.sendStatus(200);
//     });
// });

//products

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "photos/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const uploadImg = multer({ storage });

app.post("/Add", uploadImg.single("image"), async (req, res) => {
  const {
    productName,
    productPrice,
    productDiscription,
    productLabel,
    productSize,
    productOffer,
    productPath,
  } = req.body;
  const file = req.file;
  console.log("file :>> ", file);
  var data = {
    productName,
    productPrice,
    productImage: file.path,
    productDiscription,
    productLabel,
    productSize,
    productSize,
    productPath,
  };
  console.log(data);
  if (!productName || !productPrice || !productDiscription) {
    res.status(401).send("all filds are required ");
  } else {
    const product = await Products.findOne({
      where: { productName: productName },
    });
    if (product) {
      res.send(" product already exits");
    } else {
      await Products.create({
        productName,
        productPrice,
        productImage: file.filename,
        productDiscription,
        productLabel,
        productSize,
        productOffer,
        productPath,
      });
      res.status(200).send("Product Add succesfully");
    }
  }
});

app.get("/searchproduct", async (req, res) => {
  const { name } = req.query;
  try {
    const products = await Products.findAll({
      where: {
        // productLabel: { [Op.like]: `%${category}%` },
        productName: { [Op.like]: `%${name}%` },
      },
    });

    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/AllProuct", async (req, res) => {
  const productData = await Products.findAll();
  res.json(productData);
});

app.get("/category/:type", async (req, res) => {
  const productData = await Products.findAll({
    where: {
      productLabel: req.params.type,
    },
  });
  res.json(productData);
});

app.get("/Setcategary/:offer", async (req, res) => {
  const productData = await Products.findAll({
    where: {
      productOffer: req.params.offer,
    },
  });
  res.json(productData);
});

// app.patch("/products/:id", verifyToken, (req, res) => {
//   Products.findByPk(req.params.id).then(function (product) {
//     product
//       .update(req.body, {
//         where: { id: req.params.id },
//       })
//       .then((product) => {
//         res.json(product);
//       });
//   });
// });

var userid;
app.post("/productCart/:id", verifyToken, async (req, res, next) => {
  jwt.verify(req.token, secretKey, (err, AunthenticateData) => {
    userid = AunthenticateData.user.id;
  });
  const productGet = await Products.findOne({ where: { id: req.params.id } });
  if (productGet == null) {
    res.send("product Was not found");
  } else {
    // await ProductCart.create({ ProductId: req.params.id, UserId: userid });
    await ProductCart.findOrCreate({
      where: { ProductId: req.params.id, UserId: userid },
      defaults: { quantity: 1 },
    })
      .then(([productCart, created]) => {
        if (!created) {
          // ProductCart already exists, update the quantity
          productCart.quantity += 1;
          return productCart.save();
        }
      })
      .then(() => {
        res.send("Product Add Into cart Successfully");
      })
      .catch((error) => {
        // Handle the error
        res.send(error);
      });
  }
});

app.get("/allCartData", verifyToken, async (req, res, next) => {
  var userid;
  jwt.verify(req.token, secretKey, (err, AunthenticateData) => {
    userid = AunthenticateData.user.id;
  });
  const AllCartDAta = await ProductCart.findAll({
    attributes: ["ProductId", "quantity"],
    where: { UserId: userid },
  });
  if (AllCartDAta.length !== 0) {
    const productCart = await Products.findAll({
      where: { id: { [Op.in]: AllCartDAta.map((p) => p.ProductId) } },
    });
    res.send(productCart);
  } else {
    res.send([]);
  }
});

app.get("/getQuntity", verifyToken, async (req, res, next) => {
  const AllCartDAta = await ProductCart.findAll({
    attributes: ["ProductId", "quantity"],
  });
  res.send(AllCartDAta);
});

app.get("/decrementQuntity/:id", verifyToken, async (req, res, next) => {
  ProductCart.findOne({
    where: { ProductId: req.params.id },
  })
    .then((productCart) => {
      if (productCart) {
        return productCart.decrement("quantity");
      }
    })
    .then(() => {
      // Success
      res.send("success");
    })
    .catch((error) => {
      // Handle the error
      res.send(error);
    });
});

app.delete("/DeleteProduct/:id", verifyToken, (req, res) => {
  ProductCart.findByPk(req.params.id)
    .then(function (product) {
      product.destroy();
    })
    .then((product) => {
      res.status(200).send("Product Delete succefully");
    })
    .catch((error) => {
      res.status(503).send("Product Dosn't exists");
    });
});

db.sequelize.sync().then(() => {
  console.log("🔄 All models were synchronized successfully.");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
