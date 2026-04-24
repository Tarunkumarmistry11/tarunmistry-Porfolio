const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const mongoose = require("mongoose");
const Product  = require("../models/Product");

const products = [
  {
    name:        "Beach House Lightroom Preset Pack",
    slug:        "beach-house-lightroom-preset-pack",
    category:    "presets",
    shortDesc:   "Dark, earthy tones with lifted shadows and warm highlights.",
    description: "20 hand-crafted Lightroom presets built for golden-hour and moody outdoor photography. Each preset is non-destructive and works across all camera profiles.",
    compatibility: ["Lightroom Classic", "Lightroom Mobile", "Lightroom CC"],
    includes:    ["20 XMP presets", "20 DNG mobile presets", "PDF installation guide"],
    howToUse:    "1. Download the ZIP file.\n2. Open Lightroom → Develop module → Presets panel.\n3. Right-click → Import Presets → select the XMP files.\n4. Apply and adjust exposure to taste.",
    faqs: [
      { question: "Do these work on mobile?", answer: "Yes — DNG files included for Lightroom Mobile." },
      { question: "Which cameras are supported?", answer: "All cameras — presets adapt to any RAW file." },
    ],
    coverImage:    "https://res.cloudinary.com/dvumrmwbp/image/upload/v1776963111/Beach_house_tfjrdp.png",
    previewImages: [
      "https://res.cloudinary.com/dvumrmwbp/image/upload/v1777001116/20240101_074649-3_mfbnhl.jpg",
      "https://res.cloudinary.com/dvumrmwbp/image/upload/v1777001111/20240101_074807-3_idksww.jpg",
    ],
    price:         { IN: 799,  US: 12, EU: 11, GB: 10 },
    originalPrice: { IN: 1299, US: 19, EU: 17, GB: 15 },
    downloadFiles: ["presets/moody-cinematic-pack.zip"], // Supabase path
    featured:      true,
    order:         1,
  },
    {
    name:        "Eclipse Lightroom Preset Pack",
    slug:        "eclipse-lightroom-preset-pack",
    category:    "presets",
    shortDesc:   "Dark, earthy tones with lifted shadows and warm highlights.",
    description: "20 hand-crafted Lightroom presets built for golden-hour and moody outdoor photography. Each preset is non-destructive and works across all camera profiles.",
    compatibility: ["Lightroom Classic", "Lightroom Mobile", "Lightroom CC"],
    includes:    ["20 XMP presets", "20 DNG mobile presets", "PDF installation guide"],
    howToUse:    "1. Download the ZIP file.\n2. Open Lightroom → Develop module → Presets panel.\n3. Right-click → Import Presets → select the XMP files.\n4. Apply and adjust exposure to taste.",
    faqs: [
      { question: "Do these work on mobile?", answer: "Yes — DNG files included for Lightroom Mobile." },
      { question: "Which cameras are supported?", answer: "All cameras — presets adapt to any RAW file." },
    ],
    coverImage:    "https://res.cloudinary.com/dvumrmwbp/image/upload/v1776963110/Eclipse_city_dpuvs3.png",
    previewImages: [
      "https://res.cloudinary.com/dvumrmwbp/image/upload/v1777001116/20240101_074649-3_mfbnhl.jpg",
      "https://res.cloudinary.com/dvumrmwbp/image/upload/v1777001111/20240101_074807-3_idksww.jpg",
    ],
    price:         { IN: 799,  US: 12, EU: 11, GB: 10 },
    originalPrice: { IN: 1299, US: 19, EU: 17, GB: 15 },
    downloadFiles: ["presets/moody-cinematic-pack.zip"], // Supabase path
    featured:      true,
    order:         1,
  },
   {
    name:        "Malacca Lightroom Preset Pack",
    slug:        "malacca-lightroom-preset-pack",
    category:    "presets",
    shortDesc:   "Dark, earthy tones with lifted shadows and warm highlights.",
    description: "20 hand-crafted Lightroom presets built for golden-hour and moody outdoor photography. Each preset is non-destructive and works across all camera profiles.",
    compatibility: ["Lightroom Classic", "Lightroom Mobile", "Lightroom CC"],
    includes:    ["20 XMP presets", "20 DNG mobile presets", "PDF installation guide"],
    howToUse:    "1. Download the ZIP file.\n2. Open Lightroom → Develop module → Presets panel.\n3. Right-click → Import Presets → select the XMP files.\n4. Apply and adjust exposure to taste.",
    faqs: [
      { question: "Do these work on mobile?", answer: "Yes — DNG files included for Lightroom Mobile." },
      { question: "Which cameras are supported?", answer: "All cameras — presets adapt to any RAW file." },
    ],
    coverImage:    "https://res.cloudinary.com/dvumrmwbp/image/upload/v1776963110/Malacca_kr8vvl.png",
    previewImages: [
      "https://res.cloudinary.com/dvumrmwbp/image/upload/v1777001116/20240101_074649-3_mfbnhl.jpg",
      "https://res.cloudinary.com/dvumrmwbp/image/upload/v1777001111/20240101_074807-3_idksww.jpg",
    ],
    price:         { IN: 799,  US: 12, EU: 11, GB: 10 },
    originalPrice: { IN: 1299, US: 19, EU: 17, GB: 15 },
    downloadFiles: ["presets/moody-cinematic-pack.zip"], // Supabase path
    featured:      true,
    order:         1,
  },
  {
    name:        "Webi Lightroom Preset Pack",
    slug:        "webi-lightroom-preset-pack",
    category:    "presets",
    shortDesc:   "Dark, earthy tones with lifted shadows and warm highlights.",
    description: "20 hand-crafted Lightroom presets built for golden-hour and moody outdoor photography. Each preset is non-destructive and works across all camera profiles.",
    compatibility: ["Lightroom Classic", "Lightroom Mobile", "Lightroom CC"],
    includes:    ["20 XMP presets", "20 DNG mobile presets", "PDF installation guide"],
    howToUse:    "1. Download the ZIP file.\n2. Open Lightroom → Develop module → Presets panel.\n3. Right-click → Import Presets → select the XMP files.\n4. Apply and adjust exposure to taste.",
    faqs: [
      { question: "Do these work on mobile?", answer: "Yes — DNG files included for Lightroom Mobile." },
      { question: "Which cameras are supported?", answer: "All cameras — presets adapt to any RAW file." },
    ],
    coverImage:    "https://res.cloudinary.com/dvumrmwbp/image/upload/v1776963108/Webi_lzqr4e.png",
    previewImages: [
      "https://res.cloudinary.com/dvumrmwbp/image/upload/v1777001116/20240101_074649-3_mfbnhl.jpg",
      "https://res.cloudinary.com/dvumrmwbp/image/upload/v1777001111/20240101_074807-3_idksww.jpg",
    ],
    price:         { IN: 799,  US: 12, EU: 11, GB: 10 },
    originalPrice: { IN: 1299, US: 19, EU: 17, GB: 15 },
    downloadFiles: ["presets/moody-cinematic-pack.zip"], // Supabase path
    featured:      true,
    order:         1,
  },
  {
    name:        "Perka Lightroom Preset Pack",
    slug:        "perka-lightroom-preset-pack",
    category:    "presets",
    shortDesc:   "Dark, earthy tones with lifted shadows and warm highlights.",
    description: "20 hand-crafted Lightroom presets built for golden-hour and moody outdoor photography. Each preset is non-destructive and works across all camera profiles.",
    compatibility: ["Lightroom Classic", "Lightroom Mobile", "Lightroom CC"],
    includes:    ["20 XMP presets", "20 DNG mobile presets", "PDF installation guide"],
    howToUse:    "1. Download the ZIP file.\n2. Open Lightroom → Develop module → Presets panel.\n3. Right-click → Import Presets → select the XMP files.\n4. Apply and adjust exposure to taste.",
    faqs: [
      { question: "Do these work on mobile?", answer: "Yes — DNG files included for Lightroom Mobile." },
      { question: "Which cameras are supported?", answer: "All cameras — presets adapt to any RAW file." },
    ],
    coverImage:    "https://res.cloudinary.com/dvumrmwbp/image/upload/v1776963109/Perka_h09b4l.png",
    previewImages: [
      "https://res.cloudinary.com/dvumrmwbp/image/upload/v1777001116/20240101_074649-3_mfbnhl.jpg",
      "https://res.cloudinary.com/dvumrmwbp/image/upload/v1777001111/20240101_074807-3_idksww.jpg",
    ],
    price:         { IN: 799,  US: 12, EU: 11, GB: 10 },
    originalPrice: { IN: 1299, US: 19, EU: 17, GB: 15 },
    downloadFiles: ["presets/moody-cinematic-pack.zip"], // Supabase path
    featured:      true,
    order:         1,
  },
  {
    name:        "Desert Gold LUT Pack",
    slug:        "desert-gold-lut-pack",
    category:    "luts",
    shortDesc:   "Warm ochre palette inspired by desert light and volcanic landscapes.",
    description: "15 cinematic LUTs optimised for video editors. Works in Premiere Pro, DaVinci Resolve, and Final Cut Pro. Inspired by desert dunes and golden-hour warmth.",
    compatibility: ["Premiere Pro", "DaVinci Resolve", "Final Cut Pro", "After Effects"],
    includes:    ["15 .cube LUT files", "15 .3dl LUT files", "Installation PDF"],
    howToUse:    "1. Download and unzip.\n2. In Premiere Pro: Lumetri Color → Creative → Look → Browse.\n3. Navigate to the .cube file and apply.\n4. Adjust intensity with the slider.",
    faqs: [
      { question: "What format are the LUTs?", answer: "Both .cube and .3dl formats are included." },
      { question: "Do they work in free DaVinci?", answer: "Yes — LUTs work in both the free and paid version." },
    ],
    coverImage:    "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800",
    previewImages: [
      "https://images.unsplash.com/photo-1482189349482-3defd547e0e9?w=800",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
    ],
    price:         { IN: 599,  US: 9,  EU: 8,  GB: 7  },
    originalPrice: { IN: 999,  US: 15, EU: 13, GB: 12 },
    downloadFiles: ["luts/desert-gold-lut-pack.zip"],
    featured:      true,
    order:         2,
  },
  {
    name:        "Dolomites Print — Edition I",
    slug:        "dolomites-print-edition-i",
    category:    "prints",
    shortDesc:   "Fine-art print from the Italian Dolomites. Limited edition of 50.",
    description: "Archival pigment print on 300gsm Hahnemühle Photo Rag paper. Signed and numbered. Ships in a protective tube within 7–10 business days.",
    compatibility: [],
    includes:    ["One fine-art print", "Certificate of authenticity", "Protective tube packaging"],
    howToUse:    "Frame behind UV-protective glass. Avoid direct sunlight for longevity.",
    faqs: [
      { question: "What sizes are available?", answer: "A3 (30×42cm) and A2 (42×59cm)." },
      { question: "Do you ship internationally?", answer: "Yes — worldwide shipping available." },
    ],
    coverImage:    "https://images.unsplash.com/photo-1535225166978-5c9e6d989b56?w=800",
    previewImages: [
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800",
    ],
    price:         { IN: 3499, US: 49, EU: 44, GB: 39 },
    originalPrice: null,
    downloadFiles: [], // prints are physical — no download
    featured:      false,
    order:         3,
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    await Product.deleteMany({});
    const inserted = await Product.insertMany(products);
    console.log(`✅ Inserted ${inserted.length} shop products`);
  } catch (err) {
    console.error("❌ Seed failed:", err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

seed();