import express from "express";
import { dbConnection } from "./database/dbConnection.js";
import jobRouter from "./routes/jobRoutes.js";
import userRouter from "./routes/userRoutes.js";
import applicationRouter from "./routes/applicationRoutes.js";
import { config } from "dotenv";
import cors from "cors";
import { errorMiddleware } from "./middlewares/error.js";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";

const app = express();
config({ path: ".env" });

// app.use(cors());
// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Methods",
//     "GET,HEAD,OPTIONS,POST,PUT,DELETE"
//   );
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept, Authorization"
//   );
//   next();
// });

// app.use(// connectiong with frontend
//   cors({
//     origin: [process.env.FRONTEND_URL], //  we are using array because we can connect our backend with many frontends
//     methods: ["GET", "POST", "DELETE", "PUT"],
//     credentials: true, //allow cookies 
//   })
// );

app.use(
  cors({
    origin: ["*"],
    methods: ["*"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // basically it will convert string into json
 
app.use(
  fileUpload({ // we can also use multer insted of fileupload
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/job", jobRouter);
app.use("/api/v1/application", applicationRouter);

dbConnection(); // here we will not use dbconnection as middleware thats why we are not writing in app.use

app.use(errorMiddleware);
export default app;
