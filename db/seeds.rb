# db/seeds.rb

Submission.destroy_all

Submission.create!(
  [
    {
      file: "https://res-5.cloudinary.com/dti22guzl/video/upload/v1716644217/uhricjtwmzqvfs5lckbk.mp4?_a=BACE4iBn",
      latitude: 48.8584,
      longitude: 2.2945,
      language: "French",
      details: "An audio recording from the Eiffel Tower."
    },
    {
      file: "https://example.com/video1.mp4",
      latitude: 51.5074,
      longitude: -0.1278,
      language: "English",
      details: "A video recording from London."
    },
    {
      file: "https://example.com/audio2.mp3",
      latitude: 40.7128,
      longitude: -74.0060,
      language: "English",
      details: "An audio recording from New York City."
    },
    {
      file: "https://example.com/video2.mp4",
      latitude: 35.6895,
      longitude: 139.6917,
      language: "Japanese",
      details: "A video recording from Tokyo."
    },
    {
      file: "https://example.com/audio3.mp3",
      latitude: -33.8688,
      longitude: 151.2093,
      language: "English",
      details: "An audio recording from Sydney."
    }
  ]
)

puts "Seed data created for submissions."

# Clear existing data (optional)
Artist.destroy_all

# Seed data
artists = [
  {
    name: "Leila Boutaam",
    bio: "Leila Boutaam is the visionary creator of Souk Machine. Her work explores the auditory and visual textures of global marketplaces, weaving together stories and experiences from diverse cultures.",
    website: "http://leilaboutaam.com"
  },
  {
    name: "Akira Yamamoto",
    bio: "Akira Yamamoto is a Japanese artist known for his immersive soundscapes that transport listeners to the bustling markets of Tokyo. His work is a symphony of sights and sounds that capture the essence of urban life.",
    website: "http://akirayamamotoart.jp"
  },
  {
    name: "Aisha Khan",
    bio: "Aisha Khan, based in Lahore, Pakistan, creates vivid visual narratives that showcase the vibrant energy of South Asian markets. Her paintings are a celebration of color, culture, and community.",
    website: "http://aishakhanart.com"
  },
  {
    name: "Carlos Mendes",
    bio: "Carlos Mendes is a Brazilian multimedia artist whose work highlights the rhythmic and lively atmosphere of Rio de Janeiro's street markets. His art is a dance of colors and sounds.",
    website: "http://carlosmendesart.br"
  },
  {
    name: "Elena Petrova",
    bio: "Elena Petrova is a Russian artist who captures the serene yet bustling markets of Moscow. Her work focuses on the intricate details and the human stories within these spaces.",
    website: "http://elenapetrovaart.ru"
  },
  {
    name: "Fatima al-Hassan",
    bio: "Fatima al-Hassan, hailing from Cairo, Egypt, brings the rich tapestries of Egyptian markets to life through her vibrant and evocative paintings. Her art is a blend of tradition and contemporary expression.",
    website: "http://fatimaalhassanart.eg"
  },
  {
    name: "Luca Bianchi",
    bio: "Luca Bianchi is an Italian artist whose photographic works capture the essence of Mediterranean markets. His images are a feast for the eyes, showcasing the beauty of everyday market scenes in Italy.",
    website: "http://lucabianchi.it"
  },
  {
    name: "Mei Ling",
    bio: "Mei Ling, from Shanghai, China, creates intricate digital artworks that reflect the dynamic and ever-changing nature of Chinese markets. Her art is a fusion of traditional elements and modern techniques.",
    website: "http://meilingart.cn"
  },
  {
    name: "Nina Müller",
    bio: "Nina Müller is a German artist who explores the sensory experiences of European markets. Her mixed media work delves into the textures, sounds, and sights of these bustling hubs of activity.",
    website: "http://ninamueller.de"
  },
  {
    name: "Santiago López",
    bio: "Santiago López, based in Mexico City, captures the vibrancy and cultural richness of Mexican markets through his colorful and dynamic paintings. His work is a tribute to the spirit of community and commerce.",
    website: "http://santiagolopezart.mx"
  }
]

# Create artists
artists.each do |artist|
  Artist.create!(artist)
end



puts "Seed data created for artists."

# db/seeds.rb
User.destroy_all

User.create!(email: 'admin@soukmachine.com', password: 'Welovefood24!', password_confirmation: 'Welovefood24!', admin: true) if Rails.env.development?

puts "Admin user created."
