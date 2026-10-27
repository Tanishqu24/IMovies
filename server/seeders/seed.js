const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const User = require('../models/User');
const Movie = require('../models/Movie');
const Theatre = require('../models/Theatre');
const Screen = require('../models/Screen');
const Show = require('../models/Show');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const Review = require('../models/Review');
const Coupon = require('../models/Coupon');
const Notification = require('../models/Notification');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/imovies';

const defaultLayout = [
  {
    rowLetter: 'A',
    category: 'VIP',
    basePrice: 500,
    seats: Array.from({ length: 8 }, (_, i) => ({ seatNumber: i + 1, seatId: `A${i + 1}`, isAvailable: true }))
  },
  {
    rowLetter: 'B',
    category: 'VIP',
    basePrice: 500,
    seats: Array.from({ length: 8 }, (_, i) => ({ seatNumber: i + 1, seatId: `B${i + 1}`, isAvailable: true }))
  },
  {
    rowLetter: 'C',
    category: 'Premium',
    basePrice: 320,
    seats: Array.from({ length: 10 }, (_, i) => ({ seatNumber: i + 1, seatId: `C${i + 1}`, isAvailable: true }))
  },
  {
    rowLetter: 'D',
    category: 'Premium',
    basePrice: 320,
    seats: Array.from({ length: 10 }, (_, i) => ({ seatNumber: i + 1, seatId: `D${i + 1}`, isAvailable: true }))
  },
  {
    rowLetter: 'E',
    category: 'Premium',
    basePrice: 320,
    seats: Array.from({ length: 10 }, (_, i) => ({ seatNumber: i + 1, seatId: `E${i + 1}`, isAvailable: true }))
  },
  {
    rowLetter: 'F',
    category: 'Regular',
    basePrice: 220,
    seats: Array.from({ length: 12 }, (_, i) => ({ seatNumber: i + 1, seatId: `F${i + 1}`, isAvailable: true }))
  },
  {
    rowLetter: 'G',
    category: 'Regular',
    basePrice: 220,
    seats: Array.from({ length: 12 }, (_, i) => ({ seatNumber: i + 1, seatId: `G${i + 1}`, isAvailable: true }))
  },
  {
    rowLetter: 'H',
    category: 'Regular',
    basePrice: 220,
    seats: Array.from({ length: 12 }, (_, i) => ({ seatNumber: i + 1, seatId: `H${i + 1}`, isAvailable: true }))
  }
];

const seedData = async () => {
  try {
    console.log(`Connecting to ${MONGODB_URI}...`);
    await mongoose.connect(MONGODB_URI);
    console.log('Connected! Dropping old database and indexes...');

    await mongoose.connection.db.dropDatabase();

    console.log('Old data cleared. Seeding Users...');

    // 1 Super Admin
    const admin = await User.create({
      fullName: 'Vikramaditya Roy (Admin)',
      email: 'admin@imovies.com',
      password: 'Password123!',
      phone: '+91 9876543210',
      role: 'admin',
      city: 'Mumbai',
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      isActive: true
    });

    // 2 Theatre Managers
    const manager1 = await User.create({
      fullName: 'Rajesh Sharma',
      email: 'rajesh.manager@imovies.com',
      password: 'Password123!',
      phone: '+91 9820012345',
      role: 'manager',
      city: 'Mumbai',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      isActive: true
    });

    const manager2 = await User.create({
      fullName: 'Anita Deshmukh',
      email: 'anita.manager@imovies.com',
      password: 'Password123!',
      phone: '+91 9830067890',
      role: 'manager',
      city: 'Bengaluru',
      profileImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
      isActive: true
    });

    // 10 Customers
    const customerNames = [
      { name: 'Aarav Patel', email: 'aarav@gmail.com', city: 'Mumbai' },
      { name: 'Diya Sen', email: 'diya@gmail.com', city: 'Delhi-NCR' },
      { name: 'Rohan Gupta', email: 'rohan@gmail.com', city: 'Bengaluru' },
      { name: 'Sneha Reddy', email: 'sneha@gmail.com', city: 'Hyderabad' },
      { name: 'Kabir Khan', email: 'kabir@gmail.com', city: 'Mumbai' },
      { name: 'Ananya Roy', email: 'ananya@gmail.com', city: 'Pune' },
      { name: 'Dev Sharma', email: 'dev@gmail.com', city: 'Delhi-NCR' },
      { name: 'Isha Nair', email: 'isha@gmail.com', city: 'Bengaluru' },
      { name: 'Varun Verma', email: 'varun@gmail.com', city: 'Hyderabad' },
      { name: 'Pooja Hegde', email: 'pooja@gmail.com', city: 'Mumbai' }
    ];

    const customers = [];
    for (let c of customerNames) {
      const cust = await User.create({
        fullName: c.name,
        email: c.email,
        password: 'Password123!',
        phone: `+91 ${Math.floor(9000000000 + Math.random() * 999999999)}`,
        role: 'customer',
        city: c.city,
        profileImage: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(c.name)}`,
        isActive: true
      });
      customers.push(cust);
    }

    console.log('Seeded Users. Seeding 5 Theatres...');

    // 5 Theatres
    const theatresData = [
      {
        name: 'PVR INOX Grand Mall',
        address: '4th Floor, High Street Phoenix, Lower Parel',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400013',
        managerId: manager1._id,
        facilities: ['4K Dolby Atmos', 'IMAX Laser', 'Recliner Loungers', 'Gourmet Food Court', 'Valet Parking'],
        status: 'active'
      },
      {
        name: 'Cinépolis Seawoods Grand Central',
        address: 'Sector 40, Seawoods Railway Station Complex',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400706',
        managerId: manager1._id,
        facilities: ['VIP Recliners', 'Dolby 7.1', 'Coffee Lounge', 'Free Wi-Fi', 'Wheelchair Access'],
        status: 'active'
      },
      {
        name: 'PVR Directors Cut Vasant Kunj',
        address: 'Ambience Mall, Nelson Mandela Marg, Vasant Kunj',
        city: 'Delhi-NCR',
        state: 'Delhi',
        pincode: '110070',
        managerId: manager2._id,
        facilities: ['Luxury Dining', '4DX Motion', 'Dolby Atmos', 'Private Lounges'],
        status: 'active'
      },
      {
        name: 'INOX Nexus Forum Mall Koramangala',
        address: 'Hosur Road, Koramangala',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560095',
        managerId: manager2._id,
        facilities: ['IMAX 3D', 'Laser Projection', 'Food & Beverages', 'Dolby Atmos'],
        status: 'active'
      },
      {
        name: 'Prasads Multiplex & IMAX',
        address: 'NTR Gardens, Necklace Road',
        city: 'Hyderabad',
        state: 'Telangana',
        pincode: '500063',
        managerId: manager2._id,
        facilities: ['Giant Screen IMAX', 'Dolby Atmos', 'Gaming Zone', 'Multi-cuisine Restaurant'],
        status: 'active'
      }
    ];

    const theatres = await Theatre.insertMany(theatresData);

    // Link assigned theatres to managers
    await User.findByIdAndUpdate(manager1._id, {
      assignedTheatres: [theatres[0]._id, theatres[1]._id]
    });
    await User.findByIdAndUpdate(manager2._id, {
      assignedTheatres: [theatres[2]._id, theatres[3]._id, theatres[4]._id]
    });

    console.log('Seeded Theatres. Seeding Screens...');

    const screens = [];
    for (const t of theatres) {
      // 2 screens per theatre
      const s1 = await Screen.create({
        theatreId: t._id,
        screenName: 'Screen 1 (IMAX Laser)',
        screenType: 'IMAX 3D / Dolby Atmos',
        totalSeats: 82,
        seatLayout: defaultLayout,
        seatCategories: [
          { name: 'Regular', basePath: 220 },
          { name: 'Premium', basePath: 320 },
          { name: 'VIP', basePath: 500 }
        ]
      });
      const s2 = await Screen.create({
        theatreId: t._id,
        screenName: 'Screen 2 (Dolby Atmos Prime)',
        screenType: '4K Dolby Atmos',
        totalSeats: 82,
        seatLayout: defaultLayout,
        seatCategories: [
          { name: 'Regular', basePath: 200 },
          { name: 'Premium', basePath: 300 },
          { name: 'VIP', basePath: 450 }
        ]
      });
      screens.push(s1, s2);
    }

    console.log('Seeded Screens. Seeding 12 Movies...');

    // 12 Movies
    const moviesData = [
      {
        title: 'Dune: Part Two',
        description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the universe, he endeavors to prevent a terrible future only he can foresee.',
        poster: 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg',
        trailerUrl: 'https://www.youtube.com/watch?v=Way9Dexny3w',
        genre: ['Sci-Fi', 'Adventure', 'Action'],
        language: ['English', 'Hindi'],
        duration: 166,
        releaseDate: new Date('2024-03-01'),
        rating: 8.8,
        ratingCount: 1420,
        cast: ['Timothée Chalamet', 'Zendaya', 'Rebecca Ferguson', 'Javier Bardem', 'Austin Butler'],
        director: 'Denis Villeneuve',
        certification: 'UA',
        status: 'now_showing'
      },
      {
        title: 'Oppenheimer',
        description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II.',
        poster: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/fm6K9vY9Wg9Kp3z8TehTeep7p5m.jpg',
        trailerUrl: 'https://www.youtube.com/watch?v=uYPbbksJxIg',
        genre: ['Biography', 'Drama', 'History'],
        language: ['English', 'Hindi'],
        duration: 180,
        releaseDate: new Date('2023-07-21'),
        rating: 8.9,
        ratingCount: 2300,
        cast: ['Cillian Murphy', 'Emily Blunt', 'Matt Damon', 'Robert Downey Jr.', 'Florence Pugh'],
        director: 'Christopher Nolan',
        certification: 'A',
        status: 'now_showing'
      },
      {
        title: 'Deadpool & Wolverine',
        description: 'A listless Wade Wilson toils away in civilian life with his days as the morally flexible mercenary, Deadpool, behind him. But when his homeworld faces an existential threat, Wade must reluctantly suit up with an even more reluctant Wolverine.',
        poster: 'https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/yDHYTfA3R0jFYba16jBB1ef8oIt.jpg',
        trailerUrl: 'https://www.youtube.com/watch?v=73_1biulkYk',
        genre: ['Action', 'Comedy', 'Sci-Fi'],
        language: ['English', 'Hindi', 'Tamil', 'Telugu'],
        duration: 128,
        releaseDate: new Date('2024-07-26'),
        rating: 8.4,
        ratingCount: 1850,
        cast: ['Ryan Reynolds', 'Hugh Jackman', 'Emma Corrin', 'Matthew Macfadyen'],
        director: 'Shawn Levy',
        certification: 'A',
        status: 'now_showing'
      },
      {
        title: 'Gladiator II',
        description: 'Years after witnessing the death of revered hero Maximus at the hands of his uncle, Lucius must enter the Colosseum after his home is conquered by the tyrannical Emperors who now lead Rome with an iron fist.',
        poster: 'https://image.tmdb.org/t/p/w500/2cxhvwyEwRlysAmRH4iodkvo0z5.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/euYIwmwkmz95mnEx7vBM0Mqz5r9.jpg',
        trailerUrl: 'https://www.youtube.com/watch?v=4rgYUipGJNo',
        genre: ['Action', 'Adventure', 'Drama'],
        language: ['English', 'Hindi'],
        duration: 148,
        releaseDate: new Date('2024-11-15'),
        rating: 8.1,
        ratingCount: 940,
        cast: ['Paul Mescal', 'Pedro Pascal', 'Denzel Washington', 'Connie Nielsen'],
        director: 'Ridley Scott',
        certification: 'A',
        status: 'now_showing'
      },
      {
        title: 'Interstellar',
        description: 'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.',
        poster: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/xJHokMbljvjADYdit5fK5VQsXEG.jpg',
        trailerUrl: 'https://www.youtube.com/watch?v=zSWdZVtXT7E',
        genre: ['Sci-Fi', 'Drama', 'Adventure'],
        language: ['English', 'Hindi'],
        duration: 169,
        releaseDate: new Date('2014-11-07'),
        rating: 8.7,
        ratingCount: 3100,
        cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain', 'Michael Caine'],
        director: 'Christopher Nolan',
        certification: 'UA',
        status: 'now_showing'
      },
      {
        title: 'The Dark Knight',
        description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
        poster: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/dqK9Hag1054tghRQSqLSfrkvQnA.jpg',
        trailerUrl: 'https://www.youtube.com/watch?v=EXeTwQWrcwY',
        genre: ['Action', 'Crime', 'Drama'],
        language: ['English', 'Hindi'],
        duration: 152,
        releaseDate: new Date('2008-07-18'),
        rating: 9.0,
        ratingCount: 4500,
        cast: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart', 'Michael Caine', 'Gary Oldman'],
        director: 'Christopher Nolan',
        certification: 'UA',
        status: 'now_showing'
      },
      {
        title: 'Jawan',
        description: 'A high-octane action thriller which outlines the emotional journey of a man who is set out to rectify the wrongs in the society while honoring a promise made years ago.',
        poster: 'https://image.tmdb.org/t/p/w500/jYW3g3jXUeE1r7Oa5p9j9YyFvXf.jpg',
        backdrop: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1200&q=80',
        trailerUrl: 'https://www.youtube.com/watch?v=MWOlnZSnXWE',
        genre: ['Action', 'Thriller'],
        language: ['Hindi', 'Tamil', 'Telugu'],
        duration: 169,
        releaseDate: new Date('2023-09-07'),
        rating: 7.9,
        ratingCount: 1680,
        cast: ['Shah Rukh Khan', 'Nayanthara', 'Vijay Sethupathi', 'Deepika Padukone'],
        director: 'Atlee',
        certification: 'UA',
        status: 'now_showing'
      },
      {
        title: 'RRR',
        description: 'A fearless revolutionary and an officer in the British force, who once shared a deep bond, decide to join forces and chart out an inspiring path of freedom against the despotic rulers.',
        poster: 'https://image.tmdb.org/t/p/w500/nEufeZlyAOLqO2brrs0yeMu1QXO.jpg',
        backdrop: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80',
        trailerUrl: 'https://www.youtube.com/watch?v=NgBoAM8G4Yk',
        genre: ['Action', 'Drama'],
        language: ['Telugu', 'Hindi', 'Tamil'],
        duration: 187,
        releaseDate: new Date('2022-03-25'),
        rating: 8.3,
        ratingCount: 2200,
        cast: ['N. T. Rama Rao Jr.', 'Ram Charan', 'Ajay Devgn', 'Alia Bhatt'],
        director: 'S. S. Rajamouli',
        certification: 'UA',
        status: 'now_showing'
      },
      {
        title: 'Inception',
        description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project and his team.',
        poster: 'https://image.tmdb.org/t/p/w500/ljsZTbVsrQSqZgWeep2B1QiDKuh.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg',
        trailerUrl: 'https://www.youtube.com/watch?v=YoHD9XEInc0',
        genre: ['Action', 'Sci-Fi', 'Thriller'],
        language: ['English', 'Hindi'],
        duration: 148,
        releaseDate: new Date('2010-07-16'),
        rating: 8.8,
        ratingCount: 3900,
        cast: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Elliot Page', 'Tom Hardy'],
        director: 'Christopher Nolan',
        certification: 'UA',
        status: 'now_showing'
      },
      {
        title: 'Avatar: Fire and Ash',
        description: 'The journey continues as Jake Sully and Neytiri encounter a new, aggressive volcanic clan of Na\'vi known as the "Ash People", testing Pandora to its limits.',
        poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=500&q=80',
        backdrop: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
        trailerUrl: 'https://www.youtube.com/watch?v=d9MyW72ELq0',
        genre: ['Action', 'Adventure', 'Fantasy', 'Sci-Fi'],
        language: ['English', 'Hindi'],
        duration: 190,
        releaseDate: new Date('2025-12-19'),
        rating: 0,
        ratingCount: 0,
        cast: ['Sam Worthington', 'Zoe Saldaña', 'Sigourney Weaver', 'Stephen Lang'],
        director: 'James Cameron',
        certification: 'UA',
        status: 'upcoming'
      },
      {
        title: 'Avengers: Secret Wars',
        description: 'The culmination of the Multiverse Saga brings Earth\'s mightiest heroes together with iconic variants across time and reality to combat a cataclysmic multiversal collapse.',
        poster: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=500&q=80',
        backdrop: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
        trailerUrl: 'https://www.youtube.com/watch?v=TcMBFSGVi1c',
        genre: ['Action', 'Sci-Fi', 'Adventure'],
        language: ['English', 'Hindi', 'Tamil', 'Telugu'],
        duration: 185,
        releaseDate: new Date('2027-05-07'),
        rating: 0,
        ratingCount: 0,
        cast: ['Pedro Pascal', 'Robert Downey Jr.', 'Benedict Cumberbatch', 'Tom Holland'],
        director: 'Anthony Russo, Joe Russo',
        certification: 'UA',
        status: 'upcoming'
      },
      {
        title: 'Spider-Man: Beyond the Spider-Verse',
        description: 'Miles Morales traverses the boundless multiverse to rescue his loved ones from the perils of destiny and stop the devastating collision of realities.',
        poster: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&w=500&q=80',
        backdrop: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80',
        trailerUrl: 'https://www.youtube.com/watch?v=cqGjhVJWtEg',
        genre: ['Animation', 'Action', 'Sci-Fi'],
        language: ['English', 'Hindi'],
        duration: 140,
        releaseDate: new Date('2026-06-12'),
        rating: 0,
        ratingCount: 0,
        cast: ['Shameik Moore', 'Hailee Steinfeld', 'Oscar Isaac', 'Daniel Kaluuya'],
        director: 'Joaquim Dos Santos, Kemp Powers',
        certification: 'U',
        status: 'upcoming'
      }
    ];

    const movies = await Movie.insertMany(moviesData);

    console.log('Seeded Movies. Seeding Shows across current and future dates...');

    // Generate show dates: Today, Tomorrow, Day+2, Day+3
    const today = new Date();
    const dates = [];
    for (let i = 0; i < 4; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      dates.push(d.toISOString().split('T')[0]);
    }

    const showTimings = ['10:30 AM', '02:00 PM', '06:15 PM', '09:45 PM'];
    const shows = [];

    // Assign shows for Now Showing movies across theatres and screens
    const nowShowingMovies = movies.filter(m => m.status === 'now_showing');

    for (const date of dates) {
      for (let tIndex = 0; tIndex < theatres.length; tIndex++) {
        const theatre = theatres[tIndex];
        const theatreScreens = screens.filter(s => String(s.theatreId) === String(theatre._id));

        for (let sIndex = 0; sIndex < theatreScreens.length; sIndex++) {
          const screen = theatreScreens[sIndex];
          const movie = nowShowingMovies[(tIndex + sIndex) % nowShowingMovies.length];

          for (const time of showTimings) {
            const bookedInitialSeats = [];
            // Seed a few pre-booked seats for realism
            if (date === dates[0]) {
              bookedInitialSeats.push('C4', 'C5', 'F6', 'F7');
            }

            const show = await Show.create({
              movieId: movie._id,
              theatreId: theatre._id,
              screenId: screen._id,
              showDate: date,
              startTime: time,
              endTime: 'End of show',
              seatPricing: {
                Regular: screen.seatCategories[0] ? screen.seatCategories[0].basePrice : 220,
                Premium: screen.seatCategories[1] ? screen.seatCategories[1].basePrice : 320,
                VIP: screen.seatCategories[2] ? screen.seatCategories[2].basePrice : 500
              },
              bookedSeats: bookedInitialSeats,
              status: 'active'
            });
            shows.push(show);
          }
        }
      }
    }

    console.log(`Seeded ${shows.length} Shows. Seeding Sample Bookings & Payments...`);

    // Seed Sample Bookings
    const sampleBookingsData = [
      {
        bookingId: 'IM-892104',
        user: customers[0],
        show: shows[0],
        seats: [
          { seatId: 'C4', category: 'Premium', price: 320 },
          { seatId: 'C5', category: 'Premium', price: 320 }
        ],
        subtotal: 640,
        fee: 60,
        tax: 11,
        discount: 50,
        coupon: 'WELCOME50',
        total: 661
      },
      {
        bookingId: 'IM-451982',
        user: customers[1],
        show: shows[0],
        seats: [
          { seatId: 'F6', category: 'Regular', price: 220 },
          { seatId: 'F7', category: 'Regular', price: 220 }
        ],
        subtotal: 440,
        fee: 60,
        tax: 11,
        discount: 0,
        coupon: '',
        total: 511
      },
      {
        bookingId: 'IM-309112',
        user: customers[2],
        show: shows[1],
        seats: [
          { seatId: 'A3', category: 'VIP', price: 500 },
          { seatId: 'A4', category: 'VIP', price: 500 }
        ],
        subtotal: 1000,
        fee: 60,
        tax: 11,
        discount: 100,
        coupon: 'IMOVIES100',
        total: 971
      }
    ];

    for (let sb of sampleBookingsData) {
      const booking = await Booking.create({
        bookingId: sb.bookingId,
        userId: sb.user._id,
        showId: sb.show._id,
        movieId: sb.show.movieId,
        theatreId: sb.show.theatreId,
        screenId: sb.show.screenId,
        selectedSeats: sb.seats,
        subtotal: sb.subtotal,
        convenienceFee: sb.fee,
        tax: sb.tax,
        discountAmount: sb.discount,
        couponCode: sb.coupon,
        totalAmount: sb.total,
        bookingStatus: 'confirmed',
        paymentStatus: 'paid',
        qrCodeData: JSON.stringify({
          bookingId: sb.bookingId,
          showId: sb.show._id,
          seats: sb.seats.map(s => s.seatId)
        })
      });

      const payment = await Payment.create({
        bookingId: booking._id,
        userId: sb.user._id,
        amount: sb.total,
        paymentMethod: 'upi',
        transactionId: `TXN-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
        paymentStatus: 'success',
        paymentDate: new Date()
      });

      booking.paymentId = payment._id;
      await booking.save();
    }

    console.log('Seeded Bookings. Seeding Coupons...');

    const couponsData = [
      {
        code: 'WELCOME50',
        description: 'Flat ₹50 OFF on your first cinema ticket booking!',
        discountType: 'flat',
        discountValue: 50,
        minimumAmount: 300,
        expiryDate: new Date('2026-12-31'),
        usageLimit: 500,
        timesUsed: 14,
        isActive: true
      },
      {
        code: 'IMOVIES100',
        description: 'Save ₹100 on movie bookings above ₹800',
        discountType: 'flat',
        discountValue: 100,
        minimumAmount: 800,
        expiryDate: new Date('2026-12-31'),
        usageLimit: 300,
        timesUsed: 27,
        isActive: true
      },
      {
        code: 'BLOCKBUSTER20',
        description: '20% OFF up to ₹150 on blockbuster movies',
        discountType: 'percentage',
        discountValue: 20,
        maxDiscount: 150,
        minimumAmount: 500,
        expiryDate: new Date('2026-12-31'),
        usageLimit: 250,
        timesUsed: 42,
        isActive: true
      },
      {
        code: 'VIPCINEMA',
        description: 'Exclusive 15% discount on VIP Recliner tickets',
        discountType: 'percentage',
        discountValue: 15,
        maxDiscount: 200,
        minimumAmount: 600,
        expiryDate: new Date('2026-12-31'),
        usageLimit: 100,
        timesUsed: 8,
        isActive: true
      }
    ];

    await Coupon.insertMany(couponsData);

    console.log('Seeded Coupons. Seeding Reviews...');

    // Seed Reviews
    const reviewsData = [
      {
        userId: customers[0]._id,
        movieId: movies[0]._id,
        rating: 10,
        comment: 'Dune Part Two is a pure cinematic masterpiece! Denis Villeneuve delivered breathtaking visuals and Hans Zimmer’s score shook the cinema.'
      },
      {
        userId: customers[1]._id,
        movieId: movies[0]._id,
        rating: 9,
        comment: 'Unbelievable scale and storytelling. Timothée and Zendaya had incredible chemistry on screen.'
      },
      {
        userId: customers[2]._id,
        movieId: movies[1]._id,
        rating: 10,
        comment: 'Cillian Murphy delivered an Oscar-worthy performance of a lifetime. The Trinity test sequence was nerve-wrecking.'
      },
      {
        userId: customers[3]._id,
        movieId: movies[2]._id,
        rating: 9,
        comment: 'Non-stop laughs, brutal action, and incredible fan service! Ryan Reynolds and Hugh Jackman are legendary together.'
      },
      {
        userId: customers[4]._id,
        movieId: movies[3]._id,
        rating: 8,
        comment: 'Thrilling Colosseum spectacle! Denzel Washington stole every single scene he appeared in.'
      }
    ];

    await Review.insertMany(reviewsData);

    console.log('Seeding completed successfully!');
    console.log('\n======================================================');
    console.log('🌟 SEEDING SUMMARY');
    console.log('======================================================');
    console.log('Super Admin:       admin@imovies.com  / Password123!');
    console.log('Theatre Manager 1: rajesh.manager@imovies.com / Password123!');
    console.log('Theatre Manager 2: anita.manager@imovies.com  / Password123!');
    console.log('Customer:          aarav@gmail.com    / Password123!');
    console.log('Movies Seeded:     12 movies');
    console.log('Theatres Seeded:   5 theatres');
    console.log('Screens Seeded:    10 screens');
    console.log(`Shows Seeded:      ${shows.length} shows across 4 days`);
    console.log('======================================================\n');

    process.exit(0);
  } catch (error) {
    console.error('Seeding Error:', error);
    process.exit(1);
  }
};

seedData();
