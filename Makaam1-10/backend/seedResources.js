require("dotenv").config();
const mongoose = require("mongoose");
const { Resource } = require("./models/resource");
const connection = require("./db");

// Sample resources data
const resources = [
  {
    title: "React Documentation",
    description: "The official React documentation with tutorials, guides, and API reference.",
    url: "https://reactjs.org/docs/getting-started.html",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1200px-React-icon.svg.png",
    domain: "Web Development",
    type: "Course",
    isPremium: false,
    tags: ["react", "javascript", "frontend"]
  },
  {
    title: "Figma Design Course",
    description: "Comprehensive course on UI/UX design using Figma, from basics to advanced techniques.",
    url: "https://www.figma.com/resources/learn-design/",
    imageUrl: "https://cdn.sanity.io/images/599r6htc/localized/46a76c802176eb17b04e12108de7e7e0f3736dc6-1108x1108.png",
    domain: "Design",
    type: "Course",
    isPremium: true,
    tags: ["figma", "ui", "ux", "design"]
  },
  {
    title: "TensorFlow Tutorials",
    description: "Learn machine learning with TensorFlow through practical examples and tutorials.",
    url: "https://www.tensorflow.org/tutorials",
    imageUrl: "https://www.tensorflow.org/site-assets/images/project-logos/tensorflow-logo-social.png",
    domain: "Data Science",
    type: "Course",
    isPremium: false,
    tags: ["tensorflow", "machine learning", "python"]
  },
  {
    title: "GitHub - Awesome Python",
    description: "A curated list of awesome Python frameworks, libraries, software and resources.",
    url: "https://github.com/vinta/awesome-python",
    imageUrl: "",
    domain: "Web Development",
    type: "GitHub Repository",
    isPremium: false,
    tags: ["python", "resources", "libraries"]
  },
  {
    title: "AWS Certified Solutions Architect",
    description: "Comprehensive course to prepare for the AWS Certified Solutions Architect exam.",
    url: "https://aws.amazon.com/certification/certified-solutions-architect-associate/",
    imageUrl: "https://d1.awsstatic.com/training-and-certification/certification-badges/AWS-Certified-Solutions-Architect-Associate_badge.3419559c682629072f1eb968d59dea0741772c0f.png",
    domain: "DevOps",
    type: "Course",
    isPremium: true,
    tags: ["aws", "cloud", "certification"]
  },
  {
    title: "Flutter Documentation",
    description: "Official documentation for Flutter, Google's UI toolkit for building beautiful, natively compiled applications.",
    url: "https://flutter.dev/docs",
    imageUrl: "https://storage.googleapis.com/cms-storage-bucket/70760bf1e88b184bb1bc.png",
    domain: "Mobile Development",
    type: "Other",
    isPremium: false,
    tags: ["flutter", "dart", "mobile"]
  },
  {
    title: "Blockchain Fundamentals",
    description: "Learn the basics of blockchain technology, cryptocurrencies, and smart contracts.",
    url: "https://www.coursera.org/learn/blockchain-basics",
    imageUrl: "https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://coursera-course-photos.s3.amazonaws.com/83/e258e0532611e780a5a5a3b1f291da/Logo_Course_1.png?auto=format%2Ccompress&dpr=1",
    domain: "Blockchain",
    type: "Course",
    isPremium: true,
    tags: ["blockchain", "cryptocurrency", "smart contracts"]
  },
  {
    title: "Cybersecurity Handbook",
    description: "A comprehensive guide to cybersecurity principles, threats, and best practices.",
    url: "https://www.nist.gov/cyberframework",
    imageUrl: "https://www.nist.gov/sites/default/files/images/2021/10/13/NIST%20Cybersecurity%20Framework%202.0%20Logo.png",
    domain: "Cybersecurity",
    type: "Book",
    isPremium: false,
    tags: ["security", "privacy", "risk management"]
  }
];

// Connect to MongoDB
connection()
  .then(() => {
    console.log("Connected to MongoDB successfully");
    seedDatabase();
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  });

// Seed the database with sample resources
async function seedDatabase() {
  try {
    // Clear existing resources
    await Resource.deleteMany({});
    console.log("Cleared existing resources");

    // Insert new resources
    const result = await Resource.insertMany(resources);
    console.log(`Successfully seeded ${result.length} resources`);

    // Close the connection
    mongoose.connection.close();
    console.log("Database connection closed");
  } catch (error) {
    console.error("Error seeding database:", error);
    mongoose.connection.close();
    process.exit(1);
  }
}
