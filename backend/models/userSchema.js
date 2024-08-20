import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your Name!"],
    minLength: [3, "Name must contain at least 3 Characters!"],
    maxLength: [30, "Name cannot exceed 30 Characters!"],
  },
  email: {
    type: String,
    required: [true, "Please enter your Email!"],
    validate: [validator.isEmail, "Please provide a valid Email!"],
  },
  phone: {
    type: Number,
    required: [true, "Please enter your Phone Number!"],
  },
  password: {
    type: String,
    required: [true, "Please provide a Password!"],
    minLength: [8, "Password must contain at least 8 characters!"],
    maxLength: [32, "Password cannot exceed 32 characters!"],
    select: false,
  },
  role: {
    type: String,
    required: [true, "Please select a role"],
    enum: ["Job Seeker", "Employer"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


//ENCRYPTING THE PASSWORD WHEN THE USER REGISTERS OR MODIFIES HIS PASSWORD
userSchema.pre("save", async function (next) { // Mongoose provides middleware (also known as hooks) to intercept specific stages of the document lifecycle, such as before validation, before saving, or after removing documents. The pre-save hook (pre("save", ...)) is called before a document is saved to the database.
  if (!this.isModified("password")) {
    next(); //  the next function is called to skip the hashing process and proceed with the save operation
  }
  this.password = await bcrypt.hash(this.password, 10); // The second argument to the hash function is the number of salt rounds. Salt rounds determine the computational cost of hashing. Higher numbers make the hash stronger by increasing the time it takes to compute, making brute force attacks more challenging. 
});

//COMPARING THE USER PASSWORD ENTERED BY USER WITH THE USER SAVED PASSWORD
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password); // The bcrypt.compare function is used to compare a plaintext password (enteredPassword) with a hashed password (this.password). This method checks if the entered password, when hashed, matches the stored hash.
};

//GENERATING A JWT TOKEN WHEN A USER REGISTERS OR LOGINS, IT DEPENDS ON OUR CODE THAT WHEN DO WE NEED TO GENERATE THE JWT TOKEN WHEN THE USER LOGIN OR REGISTER OR FOR BOTH. 
userSchema.methods.getJWTToken = function () {

  // jwt.sign() function is used to generate a JWT. 
  //jwt.sign(payload, secretOrPrivateKey, [options, callback])  
  // The data you want to include in the token. This is typically an object with user information and claims.
  // secretOrPrivateKey: A string or buffer containing the secret key used to sign the token. This key is essential for verifying the token's integrity later on.
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, { // basically when our user is create then mongodb assigns that user a id called _id
    expiresIn: process.env.JWT_EXPIRES,
  });
};

export const User = mongoose.model("User", userSchema);
