import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

// POST /api/symptom-checker/image
// Expects multipart/form-data with image
export const checkSymptomsImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Image file required.' });
    }
    // Read and encode image as base64
    const imagePath = req.file.path;
    const imageData = fs.readFileSync(imagePath);
    const base64Image = imageData.toString('base64');

    // Compose prompt for OpenAI Vision
    const prompt = `You are a virtual health assistant. A user has uploaded an image of a potential symptom (e.g., skin rash, wound, swelling, etc.).
Analyze the image and provide possible common conditions, urgency (emergency/non-emergency), and basic advice. Do NOT give a diagnosis. Add a disclaimer: This is not a diagnosis, consult a doctor for medical advice.`;

    // Call OpenAI Vision API (GPT-4 Vision)
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4-vision-preview',
        messages: [
          { role: 'system', content: 'You are a helpful and safe health assistant.' },
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              { type: 'image_url', image_url: `data:image/jpeg;base64,${base64Image}` }
            ]
          }
        ],
        max_tokens: 500,
        temperature: 0.3,
      }),
    });

    if (!openaiRes.ok) {
      const err = await openaiRes.text();
      return res.status(500).json({ success: false, message: 'OpenAI Vision API error', error: err });
    }
    const data = await openaiRes.json();
    const answer = data.choices?.[0]?.message?.content || 'Sorry, unable to process your image right now.';

    // Optionally, delete the uploaded file after processing
    fs.unlink(imagePath, () => {});

    res.json({ success: true, result: answer });
  } catch (error) {
    console.error('Symptom checker image error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// POST /api/symptom-checker
// req.body: { symptoms: string }
export const checkSymptoms = async (req, res) => {
  try {
    const { symptoms } = req.body;
    if (!symptoms || typeof symptoms !== 'string') {
      return res.status(400).json({ success: false, message: 'Symptoms description required.' });
    }

    // Compose prompt for OpenAI
    const prompt = `You are a virtual health assistant. A user describes their symptoms as: "${symptoms}".\n\nList possible common conditions, urgency (emergency/non-emergency), and basic advice. Do NOT give a diagnosis. Add a disclaimer: This is not a diagnosis, consult a doctor for medical advice.`;

    // Call OpenAI API
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a helpful and safe health assistant.' },
          { role: 'user', content: prompt },
        ],
        max_tokens: 300,
        temperature: 0.3,
      }),
    });

    if (!openaiRes.ok) {
      const err = await openaiRes.text();
      return res.status(500).json({ success: false, message: 'OpenAI API error', error: err });
    }
    const data = await openaiRes.json();
    const answer = data.choices?.[0]?.message?.content || 'Sorry, unable to process your symptoms right now.';

    // Log usage (for compliance)
    // Optionally, save { user: req.user?.id, symptoms, answer, date: new Date() } to DB

    res.json({ success: true, result: answer });
  } catch (error) {
    console.error('Symptom checker error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
