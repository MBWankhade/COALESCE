const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

const PORT = 3000;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Connect to MongoDB
mongoose.connect(
  `mongodb+srv://mwankhade718:${process.env.DB_PASSWORD}@cluster0.ymnr3wf.mongodb.net/Coalesce?retryWrites=true&w=majority&appName=Cluster0`,
);

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
  },
  otp: {
    type: String,
  },
  password: {
    type: String,
  },
  roomCodes: {
    type: [{
      roomCode: {
        type: String,
      },
      groupName: {
        type: String,
      }
    }],
    default: []
  }
});


const User = mongoose.model("User", userSchema);

const roomSchema = new mongoose.Schema({
  groupName: {
    type: String,
    required: true
  },
  roomCode: {
    type: String,
    required: true,
    unique: true // Ensures room codes are unique
  }
});
const Room = mongoose.model('Room', roomSchema);

const secretKey = "s3cr3tk3y"

const questionSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  options: [],
  imageSolution: {
    fieldname: String,
    originalname: String,
    encoding: String,
    mimetype: String,
    buffer: Buffer,
    size: Number,
  },
  date: {
    type: Date,
    default: () => Date(),
  },
  roomCode :{
    type : String,
    required : true,
  }
});
const Question = mongoose.model('Question', questionSchema);

const authenticateUserJwt = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, secretKey, (err, user) => {
      if (err) {
        console.log(err);
        return res.sendStatus(403);
      }
      req.user = user;
      console.log(user);
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

app.get('/user', authenticateUserJwt, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.user.email });
    user.password = "";
    res.json({ user });
  } catch (error) {
    console.error('Error fetching admin:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post("/register", async (req, res) => {
  try {
    console.log(req.body);
    const { email,firstName } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP

    // Save user details to the database
    const newUser = new User({
      email,
      otp,
      firstName,
    });
    await newUser.save();

    // Send OTP to the user's email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "mwankhade718@gmail.com", // Your Gmail email address
        pass: "zxbu qyrr yizg izzr", // Your Gmail password or an application-specific password
      },
    });

    const mailOptions = {
      from: "mwankhade718@gmail.com",
      to: email,
      subject: "OTP for Registration",
      text: `Your OTP for registration is ${otp}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ message: "Failed to send OTP" });
      }
      res.status(200).json({ message: "OTP sent successfully" });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/verify-otp", async (req, res) => {
  try {
    console.log(req.body);

    const { email, otp } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Verify the provided OTP against the stored OTP in the user document
    const isOtpValid = otp && user.otp === otp;

    if (!isOtpValid) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Clear the OTP in the user document after successful login (optional for one-time use)
    user.otp = undefined;
    await user.save();

    // Generate a JWT token for authentication
    const token = jwt.sign({ userId: user._id }, secretKey, {
      expiresIn: "1d",
    });

    res.status(200).json({ token, userId: user._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post('/user/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email, password });
    if (user) {
      const token = jwt.sign({ userId: user._id }, secretKey, {
        expiresIn: "1d",
      });
      console.log('logged in successfully');
      res.json({ message: 'Logged in successfully', token });
    } else {
      res.status(403).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/set-password', authenticateUserJwt, async (req, res) => {
  try {
    const user_id = req.user.userId;
    const { password } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      user_id ,
      { password },
      { new: true } 
    );

    if (updatedUser) {
      res.status(200).json({ message: 'Password set successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.post('/create-room', authenticateUserJwt, async (req, res) => {
  try {
    const { groupName } = req.body;
    const generatedCode = Math.random().toString(36).substr(2, 7);

    // Create a new room object with groupName and generatedCode
    const newRoom = new Room({
      groupName: groupName,
      roomCode: generatedCode
    });

    // Save the new room to the database
    const savedRoom = await newRoom.save();

    const userId = req.user.userId;

    // Update the user's document to push the roomCode and groupName
    await User.findByIdAndUpdate(userId, {
      $push: {
        roomCodes: {
          roomCode: generatedCode,
          groupName: groupName
        }
      }
    });

    res.status(201).json({ message: 'Room created successfully', room: savedRoom });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to create room', message: error.message });
  }
});


app.post('/addQuestion/:roomCode', authenticateUserJwt, upload.single('imageSolution'), async (req, res) => {
  const roomCode = req.params.roomCode;
  const user = req.user;
  if (req.file) {
    console.log(user.userId);
    const imageSolution = req.file;
    const all = Object.keys(req.body).map(key => req.body[key]);
    const options = all[1];
    const question = req.body.question;

    try {

      const newQuestion = new Question({
        userId : user.userId,
        roomCode : roomCode,
        question,
        options: options,
        imageSolution,
      });

      await newQuestion.save();

      res.json({ message: 'Question created successfully', QuestionId: newQuestion.id });
    } catch (error) {
      console.error('Error creating question:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    // If imageSolution is not provided
    console.log(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }))
    const all = Object.keys(req.body).map(key => req.body[key]);
    const options = all[1];
    const question = req.body.question;

    try {
      const newQuestion = new Question({
        adminId: user._id,
        question,
        options: options,
      });

      await newQuestion.save();

      res.json({ message: 'Question created successfully', QuestionId: newQuestion.id });
    } catch (error) {
      console.error('Error creating question:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
});

app.get('/getAllDates/:roomCode', authenticateUserJwt, async (req, res) => {
  const roomCode = req.params.roomCode;

  try {
    const dates = await Question.aggregate([
      { $match: { roomCode } }, // Match documents with the specified room code and user ID
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
        },
      },
      { $sort: { "_id": 1 } },
    ]);

    // Format dates to Indian Standard Time (IST) without using libraries
    const formattedDates = dates.map(dateObj => {
      const utcDate = new Date(dateObj._id);
      const istDate = new Date(utcDate.getTime() + 5.5 * 60 * 60 * 1000); // Add 5.5 hours for IST
      const formattedDate = istDate.toISOString().split('T')[0];
      return formattedDate;
    });

    res.status(200).json({ success: true, data: formattedDates });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

app.get('/getAllQuestions/:roomCode', async (req, res) => {
  const { date } = req.query;
  const { roomCode } = req.params;
  try {
    let query = { roomCode };

    if (date) {
      // If date is provided, convert it from IST to UTC and create a date range for the entire day in UTC
      const startOfDayIST = new Date(date);
      const endOfDayIST = new Date(startOfDayIST);

      // Convert to UTC (subtract 5 hours and 30 minutes)
      startOfDayIST.setUTCHours(0, 0, 0, 0);
      endOfDayIST.setUTCHours(23, 59, 59, 999);

      // Query date range in UTC
      const startOfDayUTC = startOfDayIST.toISOString();
      const endOfDayUTC = endOfDayIST.toISOString();
      
      query.date = { $gte: startOfDayUTC, $lte: endOfDayUTC };
    }

    const questions = await Question.find(query);

    if (questions.length > 0) {
      res.status(200).json({ success: true, data: questions });
    } else {
      res.status(404).json({ success: false, error: 'No questions found for this date and room code' });
    }
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});


app.get('/getAllFriends/:roomCode', async (req, res) => {
  const { roomCode } = req.params;
  try {
    const users = await User.find({ 'roomCodes.roomCode': roomCode });
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

app.get('/friends/getDates/:roomCode/:userId?' ,authenticateUserJwt, async (req, res) => {
  const { roomCode } = req.params;
  let {userId} = req.query;
  console.log(roomCode);
  console.log(userId);

  if( !userId ) {
    userId = req.user.userId;
  }
  try {
    const dates = await Question.aggregate([
      { $match: { userId: userId, roomCode: roomCode } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
        },
      },
      { $sort: { "_id": 1 } },
    ]);

    // Format dates to Indian Standard Time (IST) without using libraries
    const formattedDates = dates.map(dateObj => {
      const utcDate = new Date(dateObj._id);
      const istDate = new Date(utcDate.getTime() + 5.5 * 60 * 60 * 1000); // Add 5.5 hours for IST
      const formattedDate = istDate.toISOString().split('T')[0];
      return formattedDate;
    });

    console.log(formattedDates);
    res.status(200).json({ success: true, data: formattedDates });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});


app.get('/friend/getAllQuestions/:roomCode', authenticateUserJwt, async (req, res) => {
  const { roomCode } = req.params;
  let { userId, date } = req.query;
  try {
    if( !userId ) {
      userId = req.user.userId;
    }
    let query = { userId: userId, roomCode: roomCode };

    if (date) {
      // If date is provided, convert it from IST to UTC and create a date range for the entire day in UTC
      const startOfDayIST = new Date(date);
      const endOfDayIST = new Date(startOfDayIST);
    
      // Convert to UTC (subtract 5 hours and 30 minutes)
      startOfDayIST.setUTCHours(0, 0, 0, 0);
      endOfDayIST.setUTCHours(23, 59, 59, 999);
    
      // Query date range in UTC
      const startOfDayUTC = startOfDayIST.toISOString();
      const endOfDayUTC = endOfDayIST.toISOString();
    
      query.date = { $gte: startOfDayUTC, $lte: endOfDayUTC };
    }
    const questions = await Question.find(query);

    if (questions.length > 0) {
      res.status(200).json({ success: true, data: questions });
    } else {
      res.status(404).json({ success: false, error: 'No questions found for this user, room, and date' });
    }
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

app.delete('/deleteQuestion/:questionId', authenticateUserJwt, async (req, res) => {
  const questionId = req.params.questionId;

  try {
    const result = await Question.findByIdAndDelete(questionId);

    if (!result) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }

    return res.status(200).json({ success: true, message: 'Question deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.get('/get-rooms', authenticateUserJwt, async (req, res) => {
  try {
    // Get the user ID from the authenticated request
    const userId = req.user.userId;

    // Find the user document based on the user ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Extract room codes and group names from the user document
    const roomData = user.roomCodes.map(room => ({
      roomCode: room.roomCode,
      groupName: room.groupName
    }));

    // Send room codes and group names in the response
    res.json({ roomData });
  } catch (error) {
    console.error('Error fetching room data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/ifRoomExists/:roomCode', authenticateUserJwt, async (req, res) => {
  const roomCode = req.params.roomCode;
  const userId = req.user.userId;

  try {
    const room = await Room.findOne({ roomCode });

    if (room) {
      const user = await User.findById(userId);

      if (user.roomCodes.some(code => code.roomCode === roomCode)) {
        // If the room code already exists for the user, send a message
        res.status(400).json({ exists: true, message: 'Room already added' });
      } else {
        // If the room code doesn't exist for the user, add it
        await User.findByIdAndUpdate(userId, {
          $push: {
            roomCodes: {
              roomCode: room.roomCode,
              groupName: room.groupName
            }
          }
        });
        res.status(200).json({ exists: true, room });
      }
    } else {
      res.status(404).json({ exists: false, message: 'Room not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/dummyRoute/always-up', async (req, res) => {
  try {
    console.log("always up called me");
    res.send('The server is always up!');
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: 'Internal Server Error',
      status: false,
    });
  }
});






// Start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

