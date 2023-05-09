const express = require("express");
const app = express();
const port = 3000;
const jwt = require("jsonwebtoken");
const multer = require("multer");
var path = require("path");
const { Products, ProductCart } = require("./models");
const { User } = require("./models");
const bcrypt = require("bcrypt");
const secretKey = "secretkey";
const crypto = require("crypto");
const { where, Op } = require("sequelize");
const db = require("./models/index");
var generator = require("generate-password");
const nodemailer = require("nodemailer");
const Url = "http://localhost:3001";

// var request = require('request');
// Set up Global configuration access

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3001");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});
app.use(express.json());

// var Data
// request('https://fakestoreapi.com/products', function (error, response, body) {
//     if (!error && response.statusCode === 200) {
//          Data=(JSON.parse(body)) // Print the google web page.
//      }
// })

//  const ProductListData = [
//   {
//       id: 0,
//       img: `${Url}/static/media/burger1.2244bc02a3d347b6bdda.jpg`,
//       label: "Ham Burger",
//       price: "Rs100",
//       category:"Burger"
//   },
//   {
//       id: 1,
//       img: `${Url}/static/media/burger2.3ca2e9753f9acf20ca46.jpg`,
//       label: "Turkey Burger",
//       price: "Rs100",
//       category:"Burger"
//   },
//   {
//       id: 2,
//       img: `${Url}/static/media/burger3.6be97a612b580d595585.jpg`,
//       label: "Mushroom Burger",
//       price: "Rs100",
//       category:"Burger"
//   },
//   {
//       id: 3,
//       img: `${Url}/static/media/burger4.f7c5294d0481fb12cc4c.jpg`,
//       label: "Elk Burger",
//       price: "Rs100",
//       category:"Burger"
//   },
//   {
//       id: 4,
//       img: `${Url}/static/media/burger5.efc6c71968cf3ffe817a.jpg`,
//       label: "Veggie Burger",
//       price: "Rs100",
//       category:"Burger"
//   },
//   {
//       id: 5,
//       img: `${Url}/static/media/burger6.d21d528bedb9088bf89f.jpg`,
//       label: "Wild salmon Burger",
//       price: "Rs100",
//       category:"Burger"
//   },
//   {
//       id: 6,
//       img: `${Url}/static/media/burger7.7616a05818c3d394373b.jpg`,
//       label: "Bean Burger",
//       price: "Rs100",
//       category:"Burger"
//   },
//   {
//       id: 7,
//       img: `${Url}/static/media/burger8.64ac4258587951ab9d29.jpg`,
//       label: "Cheese Burger",
//       price: "Rs100",
//       category:"Burger"
//   },
//   {
//       id: 8,
//       img: `${Url}/static/media/burger9.43a7190909a032f8700b.jpg`,
//       label: "Beyond meat Burger",
//       price: "Rs100",
//       category:"Burger"
//   },
//   {
//       id: 9,
//       img: `${Url}/static/media/pizza1.f15385546f60c8d0f0d9.jpg`,
//       label: "Farmhouse Pizza",
//       price: "Rs100",
//       category:"Pizza"

//   },
//   {
//       id: 10,
//       img: `${Url}/static/media/pizza2.4967c9cbe3fec366a31a.jpg`,
//       label: " Peppy Paneer Pizza",
//       price: "Rs100",
//       category:"Pizza"
//   },
//   {
//       id: 11,
//       img: ` ${Url}/static/media/pizza3.3914f9eb0c0b372910ea.jpg`,
//       label: "Aussie Pizza",
//       price: "Rs100",
//       category:"Pizza"
//   },
//   {
//       id: 12,
//       img: ` ${Url}/static/media/pizza4.9c207cdf68c9700b11ce.jpg`,
//       label: "Margherita Pizza",
//       price: "Rs100",
//       category:"Pizza"
//   },
//   {
//       id: 13,
//       img: `${Url}/static/media/pizza5.ebcb16b50e4ef0060a5e.jpg`,
//       label: "7Cheese Pizza",
//       price: "Rs100",
//       category:"Pizza"
//   },
//   {
//       id: 14,
//       img: ` ${Url}/static/media/pizza6.f482f459be92f0045d9a.jpg`,
//       label: "BBQ Chicken Pizza",
//       price: "Rs100",
//       category:"Pizza"
//   },
//   {
//       id: 15,
//       img: `${Url}/static/media/pizza7.3c8ecc492220a3922731.jpg`,
//       label: "Pepperoni Pizza",
//       price: "Rs100",
//       category:"Pizza"
//   },
//   {
//       id: 16,
//       img: `${Url}/static/media/pizza8.e82e43e0a3fc5dab999e.jpg`,
//       label: "Spring Pizza",
//       price: "Rs100",
//       category:"Pizza"
//   },
//   {
//       id: 17,
//       img: `${Url}/static/media/pizza9.2df1cebb0cf62346965c.png`,
//       label: "Paneer Makhni Pizza",
//       price: "Rs100",
//       category:"Pizza"
//   },

//   {
//       id: 18,
//       img: `${Url}/static/media/fries1.a22aa7e7dac0430e1606.jpg`,
//       label: " Curly Fries",
//       price: "Rs100",
//       category:"Fries"
//   },
//   {
//       id: 19,
//       img: ` ${Url}/static/media/fries2.77f3829939f27add7ea9.jpg`,
//       label: " Garlic Fries",
//       price: "Rs100",
//       category:"Fries"
//   },
//   {
//       id: 20,
//       img: `${Url}/static/media/fries3.fdc41e93f0cb0232ccc9.jpg`,
//       label: " Loaded Fries",
//       price: "Rs100",
//       category:"Fries"
//   },
//   {
//       id: 21,
//       img: `${Url}/static/media/fries4.1be731a9ea738c8f2b8d.jpg`,
//       label: "Chocolate Fries",
//       price: "Rs100",
//       category:"Fries"
//   },
//   {
//       id: 22,
//       img: `${Url}/static/media/fries5.ad7b3013a741e463ed21.jpg`,
//       label: "Black Olived Fries",
//       price: "Rs100",
//       category:"Fries"
//   },
//   {
//       id: 23,
//       img: `${Url}/static/media/tacos1.c0fc03b48ceff2949eec.jpg`,
//       label: " Tacos Al Pastor",
//       price: "Rs100",
//       category:"Tacos"
//   },
//   {
//       id: 24,
//       img: `${Url}/static/media/tacos2.aa22d7eaaa9a6949dcd4.jpg`,
//       label: "Tacos De Barbacoa",
//       price: "Rs100",
//       category:"Tacos"
//   },
//   {
//       id: 25,
//       img: `${Url}/static/media/tacos3.3aa48a655971ecd46edf.jpg`,
//       label: "Tacos De Birria",
//       price: "Rs100",
//       category:"Tacos"
//   },
//   {
//       id: 26,
//       img: `${Url}/static/media/wrap1.ecbc4a37be9cc38ba47e.jpg`,
//       label: "Strawberry Wrap",
//       price: "Rs100",
//       category:"Wrap"
//   },
//   {
//       id: 27,
//       img: `${Url}/static/media/wrap2.70e038c940a03c8bd9dd.jpg`,
//       label: "Easy BLT Wraps",
//       price: "Rs100",
//       category:"Wrap"
//   },
//   {
//       id: 28,
//       img: `${Url}/static/media/wrap3.403d65f7584fe5d5cb3c.jpg`,
//       label: "Chicken Wraps",
//       price: "Rs100",
//       category:"Wrap"
//   },
//   {
//       id: 29,
//       img: `${Url}/static/media/drink1.16f40d241acc25542ae7.jpg`,
//       label: "Mojito Drink",
//       price: "Rs100",
//       category:"Drink"
//   },
//   {
//       id: 30,
//       img: `${Url}/static/media/drink2.61d2b7de2ef273b09ade.jpg`,
//       label: "Mai Tai Drink",
//       price: "Rs100",
//       category:"Drink"
//   },
//   {
//       id: 31,
//       img: `${Url}/static/media/drink3.7e4f15d9623209412eb0.jpg`,
//       label: "Mint Julep Drink",
//       price: "Rs100",
//       category:"Drink"
//   },
//   {
//       id: 32,
//       img: `${Url}/static/media/drink4.29f06d22945bc3d798e1.jpg`,
//       label: "Cosmopolitan Drink",
//       price: "Rs100",
//       category:"Drink"
//   },
//   {
//       id: 33,
//       img: `${Url}/static/media/salad1.83a0f0e5e63f4a7d6db4.jpg`,
//       label: " Strawberry Salad",
//       price: "Rs100",
//       category:"Salad"
//   },
//   {
//       id: 34,
//       img: `${Url}/static/media/salad2.220eef8c1b33204efd3f.jpg`,
//       label: " Greek Salad",
//       price: "Rs100",
//       category:"Salad"
//   },
//   {
//       id: 35,
//       img: `${Url}/static/media/salad3.b83d3bfe921c5a0e939a.jpg`,
//       label: "Cobb Salad",
//       price: "Rs100",
//       category:"Salad"
//   },
//   {
//       id: 36,
//       img: `${Url}/static/media/salad4.11315812d1179c69192a.jpg`,
//       label: "Caesar Salad Supreme",
//       price: "Rs100",
//       category:"Salad"
//   },
// ]



// Product add in database
app.post("/add", async (req, res) => {
  ProductListData.forEach((value) => {
    Products.create({
      productName: value.label,
      productPrice: value.price,
      productDiscription: value.label,
      productImage: value.img,
      category: value.category
      // productLabel: value.label,
      // productSize: value.size,
      // productOffer: value.ProductOffer,
      // productPath: value.to,
    });
  });
});

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
  const { firstName, lastName, email, password } = req.body;
  var data = { firstName, lastName, email, password };
  console.log(data)
  if (!firstName || !lastName || !email || !password) {
    res.status(401).send("all filds are required ");
  } else {
    const user = await User.findOne({ where: { email: email } });
    if (user) {
      res.send(" user already exits");
    }
    else {
      var EncPass = await bcrypt.hash(password, 10);
      await User.create({ firstName, lastName, email, password: EncPass });
      res.status(200).send("Registered succesfully");
    }
  }
});

// app.post("/Register", async (req, res) => {
//   const { email, firstName } = req.body;
//   var data = { email, firstName };

//   function generatePasswordFromEmail(email) {
//     const firstChar = email.charAt(0).toUpperCase();
//     const emailPrefix = email.substring(0, 3);
//     const randomNumber = Math.floor(Math.random() * 9000) + 1000;

//     const password = `${firstChar}${emailPrefix}@${randomNumber}`;
//     return password;
//   }
//   if (!email || !firstName) {
//     res.status(401).send("all filds are required ");
//   } else {
//     const user = await User.findOne({ where: { email: email } });
//     if (user) {
//       res.send(" user already exits");
//     } else {
//       generatedPass = "Urva@1234";
//       // generatePasswordFromEmail(email);
//       var EncPass = await bcrypt.hash(generatedPass, 10);
//       await User.create({ email, firstName, password: EncPass });
//       var transporter = nodemailer.createTransport({
//         service: "gmail",
//         auth: {
//           user: "urvashil.itpath@gmail.com",
//           pass: "rjfhsbwlwtkihvey",
//         },
//       });

//       var mailOptions = {
//         from: "urvashil.itpath@gmail.com",
//         to: "urvashil9723@gmail.com",
//         subject: "Your Authntication Password",
//         text: "Your Password is :-   " + generatedPass,
//       };

//       transporter.sendMail(mailOptions, function (error, info) {
//         if (error) {
//           console.log(error);
//         } else {
//           console.log("Email sent: " + info.response);
//         }
//       });
//       res.status(200).send("Registered succesfully");
//     }
//   }
// });

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

// app.post("/login", async (req, res) => {
//   const { email, password } = req.body;
//   var data = { email, password };
//   console.log(">>>>>>>>>", data);
//   if (!email || !password) {
//     res.status(401).send("all filds are required ");
//   } 
//   else {
//     const user = await User.findOne({ where: { email: email } });
//     if (user === null) {
//       res.send("Email Does not exist");
//     }
//     if (user) {
//       bcrypt.compare(password, user.password, (err, result) => {
//         if (err) {
//           console.error(err);
//           return;
//         }
//         if (result) {
//           jwt.sign({ user }, secretKey, (err, token) => {
//             res.send({ msg: "login successful", token: token });
//           });
//         } else {
//           return res.json({ Password: "password was incorect" });
//         }
//       });
//     }
//   }
// });

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  // const data = { email, password };
  // console.log(data)
  if (!email || !password) {
    res.status(401).send("all filds are required ");
  }
  else {
    const user = await User.findOne({ where: { email: email } });
    if (user) {
      let check = await bcrypt.compare(password, user.password);
      if (check == true) {
        console.log("login successful");
        jwt.sign({ user }, secretKey, { expiresIn: '300s' }, (err, token) => {
          res.json({
            token
          })
        })
      } else {
        return res.status(401).json({ Password: " password  incorrect" });
      }
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

app.get("/users", async (req, res) => {
  User.findAll().then((User) => res.json(User));
});

//all user
app.get("/users/:id", verifyToken, (req, res) => {
  User.findAll({ where: { id: req.params.id } }).then((users) =>
    res.json(users)
  );
});

//update
app.patch("/users/:id", verifyToken, (req, res) => {
  User.findByPk(req.params.id).then(function (users) {
    users
      .update(req.body, {
        where: { id: req.params.id },
      })
      .then((users) => {
        res.json(users);
      });
  });
});

//delete
app.delete("/users/:id", (req, res) => {
  User.findByPk(req.params.id)
    .then(function (users) {
      users.destroy();
    })
    .then((users) => {
      res.sendStatus(200);
    });
});

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
  console.log(req.file);
  const { productName, productPrice0, productDiscription } = req.body;
  const file = req.file;
  console.log("file :>> ", file);
  var data = {
    productName,
    productPrice0,
    productImage: file.path,
    productDiscription,
  };
  console.log(data);
  if (!productName || !productPrice0 || !productDiscription) {
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
        productPrice0,
        productImage: file.path,
        productDiscription,
      });
      res.status(200).send("Product Add succesfully");
    }
  }
});

app.get("/Searchproduct", verifyToken, async (req, res) => {
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

app.get("/AllProduct", async (req, res) => {
  const productData = await Products.findAll();
  res.json(productData);
});

app.get("/categary/:type", async (req, res) => {
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
    res.send("Product Add Into cart Successfully");
    await ProductCart.create({ ProductId: req.params.id, UserId: userid });
  }
});

app.get("/allCartData", verifyToken, async (req, res, next) => {
  var userid;
  jwt.verify(req.token, secretKey, (err, AunthenticateData) => {
    userid = AunthenticateData.user.id;
  });
  const AllCartDAta = await ProductCart.findAll({
    attributes: ["ProductId"],
    where: { UserId: userid },
  });

  if (AllCartDAta.length !== 0) {
    const productCart = await Products.findAll({
      where: { id: { [Op.in]: AllCartDAta.map((p) => p.ProductId) } },
    });
    res.send(productCart);
  } else {
    res.send("No Cart Data");
  }
});

app.delete("/DeleteProduct/:id", verifyToken, (req, res) => {
  ProductCart.findByPk(req.params.id)
    .then(function (product) {
      product.destroy();
    })
    .then((product) => {
      res.status(200).send("Product Delete succefully");
    });
});

db.sequelize.sync().then(() => {
  console.log("🔄 All models were synchronized successfully.");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
