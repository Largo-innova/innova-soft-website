const express = require('express');
const path = require('path');
const rateLimit = require('express-rate-limit');
const app = express();

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// EJS configuratie
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.render('index', {
    title: 'Innova Soft - .NET Software Development Experts',
    currentPage: 'home',
    metaDescription: 'Professionele .NET software ontwikkeling, websites, API\'s en database oplossingen. Maak uw digitaal potentieel waar met Innova Soft.'
  });
});

app.get('/diensten', (req, res) => {
  res.render('diensten', {
    title: 'Onze Diensten - Innova Soft',
    currentPage: 'diensten',
    metaDescription: 'Ontdek onze .NET development diensten: websites, webapplicaties, API\'s, databases en custom software oplossingen.'
  });
});

app.get('/over-ons', (req, res) => {
  res.render('over-ons', {
    title: 'Over Innova Soft - Ons Verhaal',
    currentPage: 'over-ons',
    metaDescription: 'Leer Innova Soft kennen: uw betrouwbare partner in .NET software ontwikkeling met jarenlange expertise.'
  });
});

app.get('/portfolio', (req, res) => {
  res.render('portfolio', {
    title: 'Portfolio - Onze Projecten',
    currentPage: 'portfolio',
    metaDescription: 'Bekijk onze succesvolle .NET projecten en ontdek hoe wij bedrijven helpen groeien met innovatieve software.'
  });
});

app.get('/contact', (req, res) => {
  res.render('contact', {
    title: 'Contact - Innova Soft',
    currentPage: 'contact',
    metaDescription: 'Neem contact op met Innova Soft voor professionele .NET software ontwikkeling op maat.'
  });
});

// Nieuwe Privacy Policy route
app.get('/privacy-policy', (req, res) => {
  res.render('privacy', {
    title: 'Privacybeleid - Innova Soft',
    currentPage: 'privacy',
    metaDescription: 'Lees het privacybeleid van Innova Soft. Wij beschermen uw gegevens volgens de AVG/GDPR wetgeving.'
  });
});

// Contact form processing
app.post('/contact', async (req, res) => {
  try {
    const { name, email, phone, company, service, budget, message } = req.body;
    
    // Hier zou je e-mail functionaliteit toevoegen
    console.log('Nieuwe lead:', {
      name, email, phone, company, service, budget, message
    });
    
    // Simuleer verwerking
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    res.json({ 
      success: true, 
      message: 'Bedankt voor uw bericht! We nemen binnen 24 uur contact met u op.' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Er ging iets mis. Probeer het later opnieuw.' 
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server draait op http://localhost:${PORT}`);
});