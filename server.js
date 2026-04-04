const express = require('express');
const path = require('path');


const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve custom.html for /custom route
app.get('/custom', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'custom.html'));
});

// Serve attendance.html for /attendance route
app.get('/attendance', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve meals.html for /meals route
app.get('/meals', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'meals.html'));
});

app.get('/info', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'info.html'));
});
// Submit Meals for a specific date
// Submit Meals for a specific date

// Rest of your server code...

// Rest of your server code...

// Connect to MongoDB
mongoose.connect('mongodb+srv://kashyaphardik789:**********@datax.2u4uvkh.mongodb.net/attendance3', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

// Student Model
// Student Model
const Student = mongoose.model('Student', {
    name: String,
    attendance: String,
    date: {
        type: Date,
        default: Date.now,
    },
    academicPerformance: String,
    finalPercentage: Number,
    address: String,
});

app.use(bodyParser.json());

// Add Student
app.post('/add-student', async (req, res) => {
    try {
        const { name } = req.body;
        const student = new Student({
            name,
            attendance: 'Absent',
        });
        await student.save();
        res.status(200).send('Student added successfully');
    } catch (err) {
        res.status(500).send(err);
    }
});

// Get All Students
app.get('/get-students', async (req, res) => {
    try {
        const students = await Student.find();
        res.status(200).json(students);
    } catch (err) {
        res.status(500).send(err);
    }
});
app.get('/get-students-for-date', async (req, res) => {
    try {
        const date = new Date(req.query.date);
        const students = await Student.find({ meals: { $elemMatch: { date: date } } });
        res.json(students);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


// Submit Attendance for a specific date
app.post('/submit-attendance', async (req, res) => {
    try {
        const { date, attendance } = req.body;

        // Generate collection name based on the date
        const collectionName = `attendance_${new Date(date).toISOString().split('T')[0].replace(/-/g, '_')}`;

        // Create a new collection for the date if it doesn't exist
        if (!mongoose.connection.collections[collectionName]) {
            await mongoose.connection.createCollection(collectionName);
        }

        const Attendance = mongoose.model(collectionName, {
            _id: String,
            name: String,
            attendance: String,
            date: String,
        });

        for (const [studentId, status] of Object.entries(attendance)) {
            const record = new Attendance({
                _id: studentId,
                attendance: status,
                date: new Date(date).toISOString().split('T')[0],
            });
            
            await record.save();
        }

        res.status(200).send('Attendance submitted successfully');
    } catch (err) {
        res.status(500).send(err);
    }
});


//submit meals
// Submit Meals for a specific date
app.post('/submit-meals', async (req, res) => {
    try {
        const { date, meals } = req.body;

        // Generate collection name based on the date
        const collectionName = `meals_${new Date(date).toISOString().split('T')[0].replace(/-/g, '_')}`;

        // Create a new collection for the date if it doesn't exist
        if (!mongoose.connection.collections[collectionName]) {
            await mongoose.connection.db.createCollection(collectionName);
        }

        const Meals = mongoose.model(collectionName, {
            _id: String,
            name: String,
            meal: String,
            date: String,
        });

        for (const [studentId, status] of Object.entries(meals)) {
            const record = new Meals({
                _id: studentId,
                meal: status,
                date: new Date(date).toISOString().split('T')[0],
            });
            
            await record.save();
        }

        res.status(200).send('Meal records submitted successfully');
    } catch (err) {
        res.status(500).send(err);
    }
});

//...
// Add Student Information
app.post('/add-student-info', async (req, res) => {
    try {
        const { studentId, academicPerformance, finalPercentage, address } = req.body;
        
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).send('Student not found');
        }

        student.academicPerformance = academicPerformance;
        student.finalPercentage = finalPercentage;
        student.address = address;

        await student.save();
        res.status(200).send('Student information added successfully');
    } catch (err) {
        res.status(500).send(err);
    }
});


const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
