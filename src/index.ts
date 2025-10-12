import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import csurf from 'csurf'
import cookieParser from 'cookie-parser'


const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
app.use(csurf({ cookie: true }))

// Home route - HTML
app.get('/', (req, res) => {
   @ts-ignore
  const csrfToken = req.csrfToken();
  res.type('html').send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Styled Contact Form</title>
  <script>
    // Load external CSS from 'style' URL parameter
    window.onload = function () {
      const params = new URLSearchParams(window.location.search);
      const styleUrl = params.get('style');
      if (styleUrl) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = styleUrl;
        document.head.appendChild(link);
      }
    };
  </script>
</head>
<body>
  <div class="form-container">
    <h1>Contact Us</h1>
    <form action="/submit" method="post">
      <div class="form-group">
        <label for="name">Name:</label>
        <input type="text" id="name" name="name" required>
      </div>

      <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" id="email" name="email" required>
      </div>

      <div class="form-group">
        <label for="message">Message:</label>
        <textarea id="message" name="message" rows="5" required></textarea>
      </div>

      <input type="hidden" name="_csrf" value="${csrfToken}">
      
      <div class="form-group">
        <button type="submit">Send Message</button>
      </div>
    </form>
  </div>
</body>
</html>
  `)
})

app.get('/about', function (req, res) {
  res.sendFile(path.join(__dirname, '..', 'components', 'about.htm'))
})

// Example API endpoint - JSON
app.get('/api-data', (req, res) => {
  res.json({
    message: 'Here is some sample API data',
    items: ['apple', 'banana', 'cherry'],
  })
})

// Health check
app.get('/healthz', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() })
})

export default app
