# Souk Machine

An interactive digital mosaic celebrating the vibrant, chaotic, and sensory-rich environments of markets from around the world. Souk Machine is an online directory where people capture the visual and auditory experience of visiting markets, creating a dynamic and interactive cultural archive through video and audio recordings.

**[🌐 Live Demo](https://soukmachine-92aad94b7dd6.herokuapp.com/)**

![Ruby Version](https://img.shields.io/badge/ruby-3.1.2-red)
![Rails Version](https://img.shields.io/badge/rails-7.1.3-red)
![PostgreSQL](https://img.shields.io/badge/postgresql-blue)

## Features

- **Interactive Map**: Explore market submissions from around the world using Mapbox GL
- **Media Submissions**: Upload video and audio recordings directly from markets
- **Geolocation**: Automatic address geocoding and map pinning
- **Artist Showcase**: Dedicated profiles for contributing artists
- **Responsive Design**: Mobile-optimized interface with progressive web app capabilities
- **Admin Dashboard**: Manage submissions and artists through a secure admin panel

## Technology Stack

- **Backend**: Ruby on Rails 7.1.3
- **Database**: PostgreSQL
- **Authentication**: Devise
- **File Storage**: Cloudinary (video/audio uploads)
- **Geocoding**: Geocoder gem with Mapbox integration
- **Frontend**: 
  - Stimulus (JavaScript framework)
  - Bootstrap 5
  - Mapbox GL JS for interactive maps
  - SCSS for styling
- **Deployment**: Docker-ready configuration

## Prerequisites

Before you begin, ensure you have the following installed:
- Ruby 3.1.2
- PostgreSQL
- Node.js (for JavaScript dependencies)
- Yarn package manager

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/souk-machine.git
   cd souk-machine
   ```

2. **Install dependencies**
   ```bash
   bundle install
   yarn install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory with the following variables:
   ```env
   # Mapbox (required for maps and geocoding)
   MAPBOX_API_KEY=your_mapbox_api_key
   
   # Cloudinary (required for file uploads)
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   
   # Database (development)
   LEILA_DATABASE_PASSWORD=your_db_password
   ```

4. **Database Setup**
   ```bash
   rails db:create
   rails db:migrate
   rails db:seed
   ```

5. **Start the server**
   ```bash
   rails server
   ```

6. **Visit the application**
   Navigate to `http://localhost:3000` in your browser

## API Keys Setup

### Mapbox Configuration
1. Sign up for a [Mapbox account](https://www.mapbox.com/)
2. Create an API token with the following scopes:
   - Maps
   - Geocoding
3. Add your token to the `.env` file as `MAPBOX_API_KEY`

### Cloudinary Configuration
1. Sign up for a [Cloudinary account](https://cloudinary.com/)
2. Get your credentials from the dashboard
3. Add them to your `.env` file and `config/cloudinary.yml`

## Docker Deployment

The application includes Docker configuration for easy deployment:

```bash
# Build the image
docker build -t souk-machine .

# Run the container
docker run -p 3000:3000 souk-machine
```

## Key Features Explained

### Map Integration
- Interactive map powered by Mapbox GL JS
- Custom markers for each submission
- Click markers to view submission details in a popup
- Automatic bounds fitting to show all submissions

### File Upload System
- Supports video and audio file uploads
- Files are automatically uploaded to Cloudinary
- Streaming support for large video files
- Fallback handling for upload failures

### Address Autocomplete
- Real-time address suggestions using Mapbox Geocoder
- Automatic latitude/longitude extraction
- Location validation before submission

### Admin System
- Secure admin dashboard protected by Devise authentication
- Manage user submissions and artist profiles
- Soft delete functionality with confirmation dialogs

## Project Structure

```
app/
├── assets/           # Stylesheets and static assets
├── controllers/      # Rails controllers
├── javascript/       # Stimulus controllers and JS modules
├── models/          # ActiveRecord models
├── uploaders/       # CarrierWave file uploaders
└── views/           # ERB templates

config/
├── initializers/    # Configuration files
├── environments/    # Environment-specific settings
└── routes.rb        # Application routes

db/
├── migrate/         # Database migrations
├── schema.rb        # Current database schema
└── seeds.rb         # Seed data
```

## Contributing

We welcome contributions! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Guidelines

1. Follow Rails conventions and best practices
2. Write meaningful commit messages
3. Add tests for new functionality
4. Update documentation when needed

## Testing

Run the test suite:
```bash
rails test
rails test:system  # For system tests
```

## Deployment Notes

- The application is configured for production deployment with Docker
- Environment variables must be properly set in production
- SSL is enforced in production (configured in `production.rb`)
- Asset precompilation is handled in the Dockerfile

## License

See the `app/assets/stylesheets/LICENSE` file for details.

## Acknowledgments

- Special thanks to all contributing artists featured in the platform

---

**Souk Machine** - Capturing the sounds and sights of markets worldwide, one submission at a time. 🎥🎵🗺️
