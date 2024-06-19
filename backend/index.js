const express = require('express');
const app = express();
const port = process.env.PORT || 5001;
const cors = require('cors');
require('dotenv').config();
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.static("public"));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// database configuration

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = process.env.MONGODB_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const fileName = Date.now() + ext;
    cb(null, fileName);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = ['.png', '.jpg', '.jpeg'];
    const ext = path.extname(file.originalname);
    if (!allowedTypes.includes(ext.toLowerCase())) {
      const error = new Error('Only PNG, JPG, and JPEG are allowed');
      error.code = 'FILE_TYPE_NOT_ALLOWED';
      return cb(error, false);
    }
    cb(null, true);
  }
}).single('image');

async function run() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();

    // Create a collection of documents
    const listPatient = client.db("appointmentApp").collection("patients");
    const listDoctor = client.db("appointmentApp").collection("doctors");
    const listAppointments = client.db("appointmentApp").collection("appointments");

    // Endpoint untuk mengambil data dokter
    app.get('/doctors', async (req, res) => {
      try {
        const doctors = await listDoctor.find({}).toArray();
        res.json(doctors);
      } catch (error) {
        console.error('Error fetching doctors:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });

    // delete doctor 
    app.delete('/doctors/:id', async (req, res) => {
      const { id } = req.params;
      try {
        await listDoctor.deleteOne({ _id: new ObjectId(id) });
        res.json({ message: 'Doctor deleted successfully' });
      } catch (error) {
        console.error('Error deleting doctor:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });

    // Endpoint untuk menambahkan dokter
    app.post('/doctors', (req, res) => {
      upload(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
          return res.status(400).json({ message: err.message });
        } else if (err) {
          return res.status(500).json({ message: err.message });
        }

        if (!req.file) {
          return res.status(400).json({ message: 'No file uploaded' });
        }

        const { name, specialty } = req.body;
        const fileName = req.file.filename;
        const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;

        try {
          await listDoctor.insertOne({ name, specialty, fileName, url });
          res.status(201).json({ message: "Doctor created successfully" });
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Internal server error' });
        }
      });
    });

    

    // register
    app.post("/register", async (req, res) => {
      try {
        const {fullName, email, password, role, phone} = req.body;
        const existingUser = await listPatient.findOne({ email });
        if (existingUser) {
          return res.status(409).send("User already exists");
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const data = {fullName, email, password: hashedPassword, role, phone};
        const result = await listPatient.insertOne(data);
        res.send(result);
      } catch (error) {
        console.error("Failed to register:", error);
        res.status(500).send("Failed to register");
      }
    });     
    
    //login 
    app.post("/login", async (req, res) => {
      const { email, password } = req.body;

      // Cari pengguna berdasarkan email
      const existingUser = await listPatient.findOne({ email });

      // Jika pengguna tidak ditemukan atau password tidak cocok, kirim respons error
      if (!existingUser || !(await bcrypt.compare(password, existingUser.password))) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      // Filter data pengguna agar tidak menyertakan informasi sensitif
      const filteredUserData = {
        _id: existingUser._id,
        fullName: existingUser.fullName,
        email: existingUser.email,
        role: existingUser.role,
        phone: existingUser.phone
      };

      // Kirim data pengguna yang difilter ke frontend
      res.status(200).json({ user: filteredUserData });
    });

    app.get('/get-user', async (req, res) => {
      try {
        // Cari pengguna dengan peran (role) 'user'
        const users = await listPatient.find({ role: 'user' }).toArray();
        res.status(200).json(users);
      } catch (error) {
        console.error("Failed to get users:", error);
        res.status(500).send("Failed to get users");
      }
    });

    app.delete('/delete-user/:id', async (req, res) => {
      try {
        const { id } = req.params;
        const result = await listPatient.deleteOne({ _id: new ObjectId(id) });
        res.send(result);
      } catch (error) {
        console.error("Failed to delete user:", error);
        res.status(500).send("Failed to delete user");
      }
    });

    app.post("/logout" , (req, res) => {
      res.status(200).json({ message: "Logout successful" });
    })

    // Insert a book to the database
    app.post("/upload-queue", async (req, res) => {
      try {
        const { patientName, email, phone, date, time, doctorName, status } = req.body;
        const existingUser = await listPatient.findOne({ email });

        // Pastikan pengguna dengan email yang sama ditemukan sebelum menambahkan data ke appointment
        if (existingUser) {
          const data = { patientName, email, phone, role: existingUser.role };
          // Tambahkan data phone ke tabel listPatient jika belum ada
          if (!existingUser.phone) {
            await listPatient.updateOne({ email }, { $set: { phone } });
          }
          // Tambahkan data appointment ke tabel listAppointments
          const appointmentData = { patientName, email, phone, date, time, doctorName, status };
          const result = await listAppointments.insertOne(appointmentData);
          res.send(result);
        } else {
          res.status(404).send("User not found");
        }
      } catch (error) {
        console.error("Failed to upload queue:", error);
        res.status(500).send("Failed to upload queue");
      }
    });


    // get all data patient 
    app.get('/all-queue', async (req, res) => {
      const patient = await listAppointments.find().toArray();
      res.send(patient)
    });

    // get data patient by id
    app.get('/queue/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await listAppointments.findOne(query);
        res.send(result)
      } catch (error) {
        console.error('Failed to get patient:', error);
        res.status(500).send('Failed to get patient');
      }
    });

    // update data patient by id
    app.put('/update-queue/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const options = { upsert: true };
        const updateDoc = {
          $set: {
            status: 'finish',
          },
        };
        const result = await listAppointments.updateOne(filter, updateDoc, options);
        res.send(result)
      } catch (error) {
        console.error('Failed to update patient:', error);
        res.status(500).send('Failed to update patient');
      }
    });

    // delete data patient 
    app.delete('/queue/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await listAppointments.deleteOne(query);
        res.send(result)
      } catch (error) {
        console.error('Failed to delete patient:', error);
        res.status(500).send('Failed to delete patient');
      }
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}

run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
});
