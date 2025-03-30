const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 3000;

const dbURI = process.env.MONGODB_URI || 'mongodb+srv://vudathayajushi:<db_password>@pixelportfolio.mgwre.mongodb.net/?retryWrites=true&w=majority&appName=pixelportfolio';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

const formSchema = new mongoose.Schema({
    name: String,
    portfolioTitle: String,
    profilePicturePath: String,
    skills: String,
    websiteUrl: String,
    linkedinUrl: String,
    githubUrl: String,
    preferredColor: String,
    category: String,
    phoneNumber: String,
    launchDate: Date,
    portfolioDescription: String,
    experience: String,
    aesthetic: String,
    aestheticOptions: [String]
});

const FormData = mongoose.model('FormData', formSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

app.post('/submit-form', upload.single('profile-picture'), async (req, res) => {
    const formData = req.body;
    const profilePicture = req.file;

    const newFormData = new FormData({
        name: formData.name,
        portfolioTitle: formData['portfolio-title'],
        profilePicturePath: profilePicture.path,
        skills: formData.skills,
        websiteUrl: formData['website-url'],
        linkedinUrl: formData['linkedin-url'],
        githubUrl: formData['github-url'],
        preferredColor: formData['preferred-color'],
        category: formData.category,
        phoneNumber: formData['phone-number'],
        launchDate: formData['launch-date'],
        portfolioDescription: formData['portfolio-description'],
        experience: formData.experience,
        aesthetic: formData.aesthetic,
        aestheticOptions: formData.options ? (Array.isArray(formData.options) ? formData.options : [formData.options]) : []
    });

    try {
        await newFormData.save();
        res.send('Form submission received and saved to MongoDB!');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error saving form data.');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});