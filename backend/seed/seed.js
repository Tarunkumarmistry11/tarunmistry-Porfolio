const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const mongoose = require("mongoose");
const Project = require("../models/Project");
const About = require("../models/About");

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/giuligartner";

const projects = [
  {
    title: "Beach House",
    slug: "Beach-House",
    type: "stills",
    date: "March 2023",
    location: "Andaman Islands",
    description:
      "A visual journey through the icy landscapes of Greenland, capturing the raw beauty of the Arctic wilderness.",
    coverImageLeft:
      "https://ik.imagekit.io/eleven08/Eleven-gallery%20/20240101_074807-3.jpg?updatedAt=1718470808945",
    coverImageRight:
      "https://ik.imagekit.io/eleven08/Eleven-gallery%20/20240101_074649-3.jpg?updatedAt=1718470128804",
    colorPalette: ["#214356", "#8db2c3", "#e7e7e9", "#989598", "#445f88"],
    images: [],
    featured: true,
    order: 1,
  },
  {
    title: "Cayuga Collection",
    slug: "cayuga-collection",
    type: "stills",
    date: "July 2021",
    location: "Costa Rica",
    description:
      "Commercial photography for the Cayuga Collection of boutique eco-lodges across Costa Rica.",
    coverImageLeft:
      "https://cdn.prod.website-files.com/60eeb025115a75902b86a796/636e58a592fb7b4db982c315_cayuga-collection-preview-left.jpg",
    coverImageRight:
      "https://cdn.prod.website-files.com/60eeb025115a75902b86a796/636e58a8a32be0a9103ba1e5_cayuga-collection-preview-right.jpg",
    colorPalette: ["#edb46d", "#86a946", "#43999f", "#6b8fa8", "#414a4c"],
    images: [],
    featured: true,
    order: 2,
  },
  {
    title: "Pandore",
    slug: "pandore",
    type: "motion",
    date: "October 2024",
    location: "Gran Canaria",
    description:
      "A cinematic short film shot in the volcanic landscapes of Gran Canaria.",
    coverImageLeft:
      "https://cdn.prod.website-files.com/60eeb025115a75902b86a796/673632e1a80ab647ca436e73_COVER%20WEBSITE.jpg",
    coverImageRight:
      "https://cdn.prod.website-files.com/60eeb025115a75902b86a796/673634d2e193994b86379a2e_3.jpg",
    images: [
      "https://cdn.prod.website-files.com/60eeb025115a75902b86a796/673634d514296f186d6ef6e1_ONE.jpg",
      "https://cdn.prod.website-files.com/60eeb025115a75902b86a796/673634d870e6eaa89a664fde_two.jpg",
    ],
    colorPalette: [],
    featured: true,
    order: 3,
  },
];

const aboutData = {
  bio: `We are a product of our environment, probably more than we'd care to admit. Growing up in a small village by the mountains of the Italian Dolomites helped me shape a profound yet playful relationship with nature.

The unique culture, impressive and almost imposing mountains paved the way for my creative upbringing. This environment allowed my visual sensations to blossom and gave free rein to my artistic inclinations.

I have always been drawn to artistic mediums that can evoke feelings. So when I picked up a camera for the first time, it truly felt like magic.

I shared how I perceive my everyday life with others – colorful, calm, yet ever-moving. I never liked to sit there, trying to explain. Instead, I want to show it, **visually**.

The hunt for impactful moments sparked my curiosity to venture beyond the horizons and chase it to the edge of the world. As a result, my creative appetite has spread over to other mediums such as **filmmaking**, **film photography**, **design**, **podcasting**, **music**, and going on the hunt for the best pancakes on the planet.`,
  portraitWarm:
    "https://cdn.prod.website-files.com/60db5e59f76ae577e9f50d42/63769165c83b013d52239a63_giulia-warm.jpg",
  portraitCold:
    "https://cdn.prod.website-files.com/60db5e59f76ae577e9f50d42/63769165d4de2442394ed214_giulia-cold.jpg",
  portraitVideo:
    "https://cdn.prod.website-files.com/60db5e59f76ae577e9f50d42/6139d03190e20858dec6d960_Video Portrait BW-transcode.mp4",
  photos: [
    "https://cdn.prod.website-files.com/60db5e59f76ae577e9f50d42/635e509877408d75da804c25_Parker%20Scmidt-205.jpg",
    "https://cdn.prod.website-files.com/60db5e59f76ae577e9f50d42/61f7f6a452675ad591cfd1a8_photo-creative-6.jpg",
    "https://cdn.prod.website-files.com/60db5e59f76ae577e9f50d42/61f7f6a498d63ab45b056cb8_photo-creative-3.jpg",
    "https://cdn.prod.website-files.com/60db5e59f76ae577e9f50d42/635e4fddb16556675ceb906f_97660031.jpg",
    "https://cdn.prod.website-files.com/60db5e59f76ae577e9f50d42/635e4f897080454b764d417c_AG_CORNWALL_DEC2021_10.jpg",
    "https://cdn.prod.website-files.com/60db5e59f76ae577e9f50d42/61f7f6a3627fccd34acd48ef_photo-creative-2.jpg",
    "https://cdn.prod.website-files.com/60db5e59f76ae577e9f50d42/61f7f6a45b40c6821923f5cd_photo-creative-7.jpg",
  ],
  awards: [
    {
      title: "Best Cinematography",
      festival: "Berlin Indie Film Festival",
      festivalUrl: "https://berlinindiefilmfestival.com/",
      year: "2023",
    },
    {
      title: "Best Super Short",
      festival: "New York International Film Awards",
      festivalUrl: "https://newyorkinternationalfilmawards.com/",
      year: "2023",
    },
    {
      title: "Best Under 5 Minute Film",
      festival: "Boden International Film Festival",
      festivalUrl: "https://bodenfilmfestival.se/",
      year: "2023",
    },
    {
      title: "Best Cinematography",
      festival: "Venice Art & Film Festival | VIFF",
      festivalUrl: "http://www.art-viff.com/",
      year: "2022",
    },
    {
      title: "Honoree: Best Photography & Design for Social",
      festival: "Webby Awards",
      festivalUrl: "https://www.webbyawards.com/",
      year: "2021",
    },
  ],
  press: [
    {
      name: "The Pill Magazine",
      url: "https://thepillmagazine.com/feature/hiking-to-the-alpine-lakes-in-chamonix/?lang=en",
      formats: ["digital", "print"],
    },
    {
      name: "Rucksack Magazine",
      url: "https://rucksackmag.com/shop/volume-8-gold-edition",
      formats: ["print"],
    },
    {
      name: "Nomadict Interview",
      url: "https://nomadict.org/",
      formats: ["print"],
    },
    {
      name: "Atlantic Airways In-flight Magazine",
      url: "#",
      formats: ["print"],
    },
    {
      name: "FLOWT Magazine",
      url: "#",
      formats: ["print"],
    },
  ],
  podcasts: [
    {
      title: "The Yellow Podcast",
      url: "https://podcasts.apple.com/us/podcast/the-yellow-podcast/id1477721306",
    },
    {
      title: "Not So Perfect with Taj Arora",
      url: "https://tajarora.com/giuliawoergartner/",
    },
    {
      title: "Ramblin Radio with Zack Kravits",
      url: "https://podtail.com/podcast/ramblin-radio/photographing-the-world-with-giulia-gartner-the--2/",
    },
    {
      title: "Creative Catalyst with Chris Campbell",
      url: "https://podcasts.apple.com/gb/podcast/travel-commercial-photographer-giulia-gartner/id1497466369?i=1000474986525",
    },
  ],
};

const seedDB = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB:", mongoose.connection.host);

    console.log("Clearing existing data...");
    await Project.deleteMany({});
    await About.deleteMany({});
    console.log("Cleared existing data");

    console.log("Inserting projects...");
    const insertedProjects = await Project.insertMany(projects);
    console.log(`Inserted ${insertedProjects.length} projects`);

    console.log("Inserting about...");
    const insertedAbout = await About.create(aboutData);
    console.log("Inserted about:", insertedAbout._id);

    console.log("✅ Database seeded successfully!");
  } catch (err) {
    console.error("❌ Seed failed:", err);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
    process.exit(0);
  }
};

seedDB();