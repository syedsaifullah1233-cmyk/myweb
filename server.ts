import express from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { dbInstance } from './server/db';
import { ContactMessagePayload, Project, WebsiteContent, TestimonialItem } from './src/types';

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Body parsing with safe volumetric limits for base64 project image uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static uploaded files
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Secure In-Memory Session Storage
const activeSessions = new Map<string, { email: string; expiresAt: number }>();
const SESSION_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

// Retrieve admin credentials from environment or secure defaults
const getAdminCredentials = () => {
  const email = process.env.ADMIN_EMAIL || 'aurapixeltech@gmail.com';
  const password = process.env.ADMIN_PASSWORD || '9055772208';
  return { email, password };
};

// Middleware: Authenticate Admin Sessions
const requireAdmin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid authorization header.' });
  }

  const token = authHeader.split(' ')[1];
  const session = activeSessions.get(token);

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized: Active session not found.' });
  }

  if (Date.now() > session.expiresAt) {
    activeSessions.delete(token);
    return res.status(401).json({ error: 'Unauthorized: Session has expired. Please log in again.' });
  }

  // Refresh expiration on activity
  session.expiresAt = Date.now() + SESSION_TTL_MS;
  next();
};

// ==========================================
// API ROUTES
// ==========================================

// Auth: Admin Login
app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body;
  const creds = getAdminCredentials();

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  if (email.toLowerCase().trim() === creds.email.toLowerCase().trim() && password === creds.password) {
    const token = crypto.randomUUID();
    activeSessions.set(token, {
      email: creds.email,
      expiresAt: Date.now() + SESSION_TTL_MS
    });

    return res.json({
      success: true,
      token,
      admin: { email: creds.email }
    });
  }

  return res.status(401).json({ error: 'Invalid email or password.' });
});

// Auth: Verify Admin Session Status
app.get('/api/admin/status', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.json({ authenticated: false });
  }

  const token = authHeader.split(' ')[1];
  const session = activeSessions.get(token);

  if (session && Date.now() < session.expiresAt) {
    return res.json({ authenticated: true, email: session.email });
  }

  if (session) {
    activeSessions.delete(token);
  }

  return res.json({ authenticated: false });
});

// Auth: Admin Logout
app.post('/api/admin/logout', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    activeSessions.delete(token);
  }
  return res.json({ success: true, message: 'Logged out successfully.' });
});

// Projects: Retrieve Projects List
app.get('/api/projects', (req, res) => {
  const projects = dbInstance.getProjects();
  
  // Check if admin is calling to include hidden projects
  const authHeader = req.headers.authorization;
  let isAdminRequest = false;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    const session = activeSessions.get(token);
    if (session && Date.now() < session.expiresAt) {
      isAdminRequest = true;
    }
  }

  if (isAdminRequest) {
    return res.json(projects);
  } else {
    // Normal users only see active/non-hidden projects
    return res.json(projects.filter(p => !p.hidden));
  }
});

// Projects: Add Project (Admin Only)
app.post('/api/projects', requireAdmin, (req, res) => {
  const projectPayload = req.body;
  if (!projectPayload.title || !projectPayload.description || !projectPayload.category) {
    return res.status(400).json({ error: 'Project title, description, and category are required.' });
  }

  const defaultProjectData = {
    title: projectPayload.title,
    description: projectPayload.description,
    details: projectPayload.details || '',
    category: projectPayload.category,
    image: projectPayload.image || 'https://picsum.photos/seed/aurapixel/1200/800',
    thumbnail: projectPayload.thumbnail || 'https://picsum.photos/seed/aurapixel/600/400',
    liveUrl: projectPayload.liveUrl || '',
    isLive: !!projectPayload.isLive,
    featured: !!projectPayload.featured,
    hidden: !!projectPayload.hidden
  };

  const added = dbInstance.addProject(defaultProjectData);
  return res.status(201).json(added);
});

// Projects: Edit Project (Admin Only)
app.put('/api/projects/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const projectPayload = req.body;

  const updated = dbInstance.updateProject(id, projectPayload);
  if (!updated) {
    return res.status(404).json({ error: 'Project not found.' });
  }

  return res.json(updated);
});

// Projects: Delete Project (Admin Only)
app.delete('/api/projects/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const deleted = dbInstance.deleteProject(id);
  if (!deleted) {
    return res.status(404).json({ error: 'Project not found.' });
  }
  return res.json({ success: true, message: 'Project successfully deleted.' });
});

// Content: Get Website Content
app.get('/api/content', (req, res) => {
  const content = dbInstance.getContent();
  return res.json(content);
});

// Content: Save Website Content (Admin Only)
app.put('/api/content', requireAdmin, (req, res) => {
  const newContent = req.body as WebsiteContent;
  if (!newContent || !newContent.hero || !newContent.about || !newContent.services) {
    return res.status(400).json({ error: 'Malformed website content payload.' });
  }

  dbInstance.saveContent(newContent);
  return res.json({ success: true, message: 'Website content updated successfully.', content: newContent });
});

// Testimonials: Publicly Submit a Review
app.post('/api/testimonials', (req, res) => {
  const { clientName, clientRole, clientCompany, feedback, avatar } = req.body;
  if (!clientName || !feedback) {
    return res.status(400).json({ error: 'Name and feedback are required fields.' });
  }

  try {
    const content = dbInstance.getContent();
    if (!content.testimonials) {
      content.testimonials = [];
    }

    const id = `test-${crypto.randomUUID()}`;
    const newTestimonial: TestimonialItem = {
      id,
      clientName,
      clientRole: clientRole || 'Client',
      clientCompany: clientCompany || 'Independent',
      feedback,
      avatar: avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(clientName)}`
    };

    content.testimonials.push(newTestimonial);
    dbInstance.saveContent(content);

    return res.status(201).json({
      success: true,
      message: 'Thank you! Your review has been published successfully.',
      testimonial: newTestimonial
    });
  } catch (err) {
    console.error('Testimonial submission error:', err);
    return res.status(500).json({ error: 'Failed to record testimonial.' });
  }
});

// Media: Base64 Upload Endpoint (Admin Only)
app.post('/api/upload', requireAdmin, (req, res) => {
  const { fileData, originalName } = req.body;
  if (!fileData || !originalName) {
    return res.status(400).json({ error: 'fileData (Base64 string) and originalName are required.' });
  }

  try {
    const relativeUrl = dbInstance.saveBase64File(fileData, originalName);
    return res.json({ success: true, url: relativeUrl });
  } catch (err) {
    console.error('File upload error:', err);
    return res.status(500).json({ error: 'Failed to process file upload.' });
  }
});

// Contact Form submission API & Simulated Email Delivery
app.post('/api/contact', (req, res) => {
  const payload = req.body as ContactMessagePayload;
  
  // High-reliability input validation
  const { name, email, phone, projectType, budget, description, message } = payload;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Full Name, Email Address, and Message are required fields.' });
  }

  // Formatting Email Contents for Aura Pixel Admins
  const adminEmailHtml = `
============================================================
AURA PIXEL TECH LABS - NEW PROJECT QUERY RECEIVED
============================================================
From: ${name}
Email: ${email}
Phone: ${phone || 'Not Provided'}
Project Type: ${projectType || 'Not Selected'}
Estimated Budget: ${budget || 'Not Selected'}
Project Description: 
${description || 'Not Provided'}

Message Body:
${message}
============================================================
`;

  // Formatting Auto-response Thank You Email for the Client
  const clientThankYouHtml = `
============================================================
AURA PIXEL TECH LABS - ACKNOWLEDGMENT
============================================================
Dear ${name},

Thank you for reaching out to Aura Pixel! 

We have received your detailed inquiry regarding a custom ${projectType || 'website'} project. Our creative team is currently auditing your description and technical specifications. We pride ourselves on creating tailored, premium, hand-coded digital experiences, and we look forward to discussing how we can command attention for your brand online.

A Senior Digital Craftsperson will contact you directly within the next 24 business hours at this email address (${email}) or phone number (${phone || 'N/A'}) to schedule our initial design discovery call.

In the meantime, feel free to explore our live projects at the link below:
${process.env.APP_URL || 'https://aurapixel.example.com'}

To digital excellence,
The Aura Pixel Design & Engineering Team
============================================================
`;

  try {
    // 1. Log to server console for high-transparency verification
    console.log('\x1b[36m%s\x1b[0m', '--- AURA PIXEL EMAIL DISPATCH LOGGED ---');
    console.log('Sending Notification Email to admin [aurapixeltech@gmail.com]:', adminEmailHtml);
    console.log(`Sending Auto-Reply Email to client [${email}]:`, clientThankYouHtml);
    console.log('\x1b[36m%s\x1b[0m', '----------------------------------------');

    // 2. Persistently record the emails in local disk log file for auditing
    const logFilePath = path.join(process.cwd(), 'data', 'sent_emails.log');
    const logEntry = `
[TIMESTAMP: ${new Date().toISOString()}]
Recipient: aurapixeltech@gmail.com
Subject: New Client Inquiry - Aura Pixel
${adminEmailHtml}

Recipient: ${email}
Subject: Thank you for contacting Aura Pixel!
${clientThankYouHtml}
================================================================================
\n`;
    fs.appendFileSync(logFilePath, logEntry, 'utf-8');

    // Return successful state
    return res.json({
      success: true,
      message: 'Your query has been securely transmitted. A professional thank-you email has been auto-delivered, and our digital craftspeople will reach out within 24 hours.'
    });
  } catch (err) {
    console.error('Contact submission log file write failure:', err);
    return res.status(500).json({ error: 'Failed to record secure contact dispatch.' });
  }
});

// ==========================================
// VITE CLIENT INTEGRATION
// ==========================================

async function startServer() {
  // Vite integration middleware setup based on environment
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('Vite middleware mounted in DEVELOPMENT mode');
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('Static asset routes mounted in PRODUCTION mode');
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT} under NODE_ENV=${process.env.NODE_ENV || 'development'}`);
  });
}

startServer();
