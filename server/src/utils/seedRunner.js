require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Service = require('../models/Service');
const Order = require('../models/Order');
const Booking = require('../models/Booking');
const Review = require('../models/Review');
const Complaint = require('../models/Complaint');
const { categoriesData, servicesData } = require('./seedData');

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/urbano_nursery';
    console.log(`Connecting to MongoDB at: ${mongoUri}`);
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected for database seeding...');

    // Clean existing database and any old indexes
    console.log('Dropping existing database and indexes...');
    await mongoose.connection.db.dropDatabase();
    console.log('Database cleanly reset.');

    // 1. Create Users
    console.log('Seeding users...');
    const adminUser = await User.create({
      name: process.env.ADMIN_NAME || 'Admin Urbano',
      email: (process.env.ADMIN_EMAIL || 'admin@urbanonursery.com').toLowerCase(),
      password: process.env.ADMIN_PASSWORD || 'Admin@12345',
      role: 'admin',
      phone: '+91 98765 43210',
      address: {
        street: '12 Green Park Avenue',
        city: 'Bengaluru',
        state: 'Karnataka',
        postalCode: '560034',
        country: 'India',
      },
      vendorStatus: 'approved',
    });

    const approvedNursery = await User.create({
      name: 'Sunil Kumar (Green Haven)',
      email: 'greenhaven@urbanonursery.com',
      password: 'Nursery@12345',
      role: 'nursery',
      phone: '+91 98450 11223',
      address: {
        street: '45 Lalbagh Botanical Road',
        city: 'Bengaluru',
        state: 'Karnataka',
        postalCode: '560004',
        country: 'India',
      },
      vendorStatus: 'approved',
      nurseryProfile: {
        nurseryName: 'Green Haven Botanical Nursery',
        description: 'Cultivating healthy indoor exotics, hardy outdoor shrubs, and organic native plants for over 15 years.',
        businessAddress: '45 Lalbagh Botanical Road, Bengaluru',
        city: 'Bengaluru',
        rating: 4.9,
        reviewCount: 38,
        contactPhone: '+91 98450 11223',
      },
    });

    const pendingNursery = await User.create({
      name: 'Anita Roy (Bloom & Flora)',
      email: 'bloomflora@urbanonursery.com',
      password: 'Pending@12345',
      role: 'nursery',
      phone: '+91 97312 88491',
      address: {
        street: '18 HSR Layout, Sector 3',
        city: 'Bengaluru',
        state: 'Karnataka',
        postalCode: '560102',
        country: 'India',
      },
      vendorStatus: 'pending',
      nurseryProfile: {
        nurseryName: 'Bloom & Flora Nursery Hub',
        description: 'Specialists in flowering perennials, medicinal herbs, and hand-potted bonsai collections.',
        businessAddress: '18 HSR Layout, Sector 3, Bengaluru',
        city: 'Bengaluru',
        rating: 4.7,
        reviewCount: 12,
        contactPhone: '+91 97312 88491',
      },
    });

    const gardenerUser1 = await User.create({
      name: 'Ramesh Kumar',
      email: 'ramesh.gardener@urbanonursery.com',
      password: 'Gardener@12345',
      role: 'gardener',
      phone: '+91 99001 55443',
      avatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=400&q=80',
      address: {
        street: '78 Koramangala 4th Block',
        city: 'Bengaluru',
        state: 'Karnataka',
        postalCode: '560034',
        country: 'India',
      },
      vendorStatus: 'approved',
      gardenerProfile: {
        bio: 'Certified Master Gardener with 8+ years of dedicated experience in urban terrace gardens, lawn restoration, and organic pest remedies.',
        experienceYears: 8,
        specialties: ['Lawn Maintenance', 'Fruit Tree Pruning', 'Organic Pest Doctor', 'Balcony Transformation'],
        hourlyRate: 450,
        rating: 4.9,
        reviewCount: 42,
        availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        workingHours: '09:00 AM - 06:00 PM',
        isAvailable: true,
      },
    });

    const gardenerUser2 = await User.create({
      name: 'Sunita Sharma',
      email: 'sunita.gardener@urbanonursery.com',
      password: 'Gardener@12345',
      role: 'gardener',
      phone: '+91 98862 33119',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
      address: {
        street: '22 Indiranagar 100ft Road',
        city: 'Bengaluru',
        state: 'Karnataka',
        postalCode: '560038',
        country: 'India',
      },
      vendorStatus: 'approved',
      gardenerProfile: {
        bio: 'Passionate horticulturist specializing in exotic houseplant rehabilitation, custom potting blends, and bonsai styling.',
        experienceYears: 5,
        specialties: ['Plant Doctor & Pest', 'Soil Repotting', 'Bonsai Styling', 'Herb Gardens'],
        hourlyRate: 400,
        rating: 4.8,
        reviewCount: 29,
        availableDays: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        workingHours: '09:00 AM - 05:00 PM',
        isAvailable: true,
      },
    });

    const pendingGardener = await User.create({
      name: 'Vikram Singh',
      email: 'vikram.gardener@urbanonursery.com',
      password: 'Pending@12345',
      role: 'gardener',
      phone: '+91 97401 22998',
      address: {
        street: '88 Whitefield Main Road',
        city: 'Bengaluru',
        state: 'Karnataka',
        postalCode: '560066',
        country: 'India',
      },
      vendorStatus: 'pending',
      gardenerProfile: {
        bio: 'Agricultural graduate with practical expertise in hydroponics, hedge sculpting, and landscape irrigation systems.',
        experienceYears: 3,
        specialties: ['Hydroponics', 'Hedge Sculpting', 'Drip Irrigation'],
        hourlyRate: 350,
        rating: 4.6,
        reviewCount: 4,
        availableDays: ['Monday', 'Wednesday', 'Friday', 'Saturday'],
        workingHours: '09:00 AM - 05:00 PM',
        isAvailable: true,
      },
    });

    const customerUser = await User.create({
      name: 'Ananya Verma',
      email: 'ananya.customer@urbanonursery.com',
      password: 'Customer@12345',
      role: 'customer',
      phone: '+91 98123 45678',
      address: {
        street: 'Flat 402, Green Meadows, 5th Main',
        city: 'Bengaluru',
        state: 'Karnataka',
        postalCode: '560076',
        country: 'India',
      },
      vendorStatus: 'approved',
    });

    // 2. Create Categories
    console.log('Seeding categories...');
    const createdCategories = await Category.insertMany(categoriesData);
    const categoryMap = {};
    createdCategories.forEach((cat) => {
      categoryMap[cat.slug] = cat;
    });

    // 3. Create Services
    console.log('Seeding gardening services...');
    const createdServices = await Service.insertMany(servicesData);

    // 4. Create Products
    console.log('Seeding products with care guides and high quality botanical imagery...');
    const productsData = [
      {
        name: 'Snake Plant (Sansevieria Trifasciata)',
        botanicalName: 'Dracaena trifasciata',
        description: 'The ultimate indestructible air-purifying plant. NASA clean air study ranked it among top air toxin filters. Features upright sword-like foliage with yellow margins. Survives weeks of drought and low lighting.',
        shortDescription: 'Indestructible air-purifying indoor plant with upright golden variegated leaves.',
        price: 399,
        originalPrice: 499,
        stock: 45,
        category: categoryMap['indoor-plants']._id,
        indoorOutdoor: 'indoor',
        images: [
          'https://images.unsplash.com/photo-1593482892290-f54927ae1bf6?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?auto=format&fit=crop&w=800&q=80',
        ],
        careGuide: {
          light: 'Low to bright indirect sunlight; tolerates artificial fluorescent lighting.',
          water: 'Water once every 2-3 weeks; allow soil to dry completely between waterings.',
          soil: 'Fast-draining cactus and succulent mix with perlite.',
          temperature: '15°C - 32°C',
          humidity: 'Low to average household humidity (30-50%).',
        },
        difficulty: 'Beginner Friendly',
        nursery: approvedNursery._id,
        isFeatured: true,
        ratingsAverage: 4.9,
        ratingsQuantity: 34,
        tags: ['air-purifying', 'low-maintenance', 'bedroom-plant', 'drought-tolerant'],
      },
      {
        name: 'Money Plant (Golden Pothos)',
        botanicalName: 'Epipremnum aureum',
        description: 'A classic indoor vine with heart-shaped emerald green leaves splash-painted with sunny gold. Believed to attract positive energy and good luck in Feng Shui. Thrives in soil or water containers.',
        shortDescription: 'Lush climbing vine with heart-shaped gold-splashed foliage. Symbol of prosperity.',
        price: 249,
        originalPrice: 349,
        stock: 60,
        category: categoryMap['indoor-plants']._id,
        indoorOutdoor: 'both',
        images: [
          'https://images.unsplash.com/photo-1598880940371-c756e015fea1?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=80',
        ],
        careGuide: {
          light: 'Medium to bright indirect light. Avoid scorching direct afternoon rays.',
          water: 'Water once weekly or when top inch of soil feels dry to the touch.',
          soil: 'Rich, aerated potting mix with peat moss.',
          temperature: '18°C - 30°C',
          humidity: 'Thrives in moderate to high humidity; mist occasionally.',
        },
        difficulty: 'Beginner Friendly',
        nursery: approvedNursery._id,
        isFeatured: true,
        ratingsAverage: 4.8,
        ratingsQuantity: 48,
        tags: ['vining', 'good-luck', 'hanging-basket', 'water-growing'],
      },
      {
        name: 'Peace Lily (Spathiphyllum)',
        botanicalName: 'Spathiphyllum wallisii',
        description: 'Renowned for dramatic dark green foliage and serene white flower spathes. Notorious for visually telling you when it needs water by gracefully drooping, then springing back upright minutes after drinking.',
        shortDescription: 'Graceful white blooming plant renowned for air purification and easy moisture signaling.',
        price: 499,
        originalPrice: 649,
        stock: 30,
        category: categoryMap['flowering-plants']._id,
        indoorOutdoor: 'indoor',
        images: [
          'https://images.unsplash.com/photo-1593691509543-c55fb32e7355?auto=format&fit=crop&w=800&q=80',
        ],
        careGuide: {
          light: 'Filtered low to medium light. Direct sun causes leaf burn.',
          water: 'Keep soil consistently lightly moist; sensitive to over-chlorinated tap water.',
          soil: 'Spongy potting mix with vermiculite and cocopeat.',
          temperature: '18°C - 28°C',
          humidity: 'Prefers 50-60% humidity; ideal for bathrooms or humid corners.',
        },
        difficulty: 'Beginner Friendly',
        nursery: approvedNursery._id,
        isFeatured: true,
        ratingsAverage: 4.7,
        ratingsQuantity: 28,
        tags: ['flowering', 'clean-air', 'shade-loving'],
      },
      {
        name: 'Areca Palm (Chrysalidocarpus Lutescens)',
        botanicalName: 'Dypsis lutescens',
        description: 'Transforms ordinary living spaces into a lavish tropical resort. Feathery arching fronds add natural architecture, softness, and humidify indoor spaces during dry air seasons.',
        shortDescription: 'Stately tropical palm with arching feathery fronds. Exceptional indoor humidifier.',
        price: 799,
        originalPrice: 999,
        stock: 22,
        category: categoryMap['indoor-plants']._id,
        indoorOutdoor: 'both',
        images: [
          'https://images.unsplash.com/photo-1616690710400-a16d146927c5?auto=format&fit=crop&w=800&q=80',
        ],
        careGuide: {
          light: 'Bright filtered sunlight. A few hours of mild morning sun helps vigorous growth.',
          water: 'Water generously in summer, allowing top 2 inches of soil to dry before rewatering.',
          soil: 'Rich loamy soil with excellent drainage holes.',
          temperature: '18°C - 35°C',
          humidity: 'Appreciates regular misting in air-conditioned environments.',
        },
        difficulty: 'Intermediate',
        nursery: approvedNursery._id,
        isFeatured: true,
        ratingsAverage: 4.8,
        ratingsQuantity: 19,
        tags: ['tropical', 'statement-plant', 'living-room', 'pet-friendly'],
      },
      {
        name: 'Monstera Deliciosa (Swiss Cheese Plant)',
        botanicalName: 'Monstera deliciosa',
        description: 'The celebrity icon of interior design! Known for magnificent perforated fenestrated foliage that develops holes as the plant matures. A fast and rewarding grower that climbs gracefully on moss poles.',
        shortDescription: 'Dramatic tropical plant with iconic perforated leaves and lush aerial roots.',
        price: 899,
        originalPrice: 1199,
        stock: 18,
        category: categoryMap['indoor-plants']._id,
        indoorOutdoor: 'both',
        images: [
          'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=80',
        ],
        careGuide: {
          light: 'Gentle morning sun or bright indirect light.',
          water: 'Water thoroughly when soil is dry half-way down the pot.',
          soil: 'Aroid mix containing orchid bark, perlite, and chunky coco chips.',
          temperature: '20°C - 32°C',
          humidity: '60%+ humidity encouraged for large fenestrations.',
        },
        difficulty: 'Beginner Friendly',
        nursery: approvedNursery._id,
        isFeatured: true,
        ratingsAverage: 5.0,
        ratingsQuantity: 52,
        tags: ['aroid', 'collector', 'moss-pole', 'instagram-favorite'],
      },
      {
        name: 'Kashmiri Fragrant Rose Plant',
        botanicalName: 'Rosa damascena',
        description: 'Famous for intensely sweet, therapeutic scent and velvety crimson-red petals. Bloomer that flourishes in sunny balconies and garden beds. Essential for traditional floral tea and puja rituals.',
        shortDescription: 'Intensely fragrant crimson roses that bloom bountifully in sunny outdoor spaces.',
        price: 299,
        originalPrice: 399,
        stock: 35,
        category: categoryMap['flowering-plants']._id,
        indoorOutdoor: 'outdoor',
        images: [
          'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=800&q=80',
        ],
        careGuide: {
          light: 'Full direct sunlight (at least 5-6 hours daily).',
          water: 'Water deeply every morning, especially during hot summer seasons.',
          soil: 'Fertile garden soil with composted cow manure and mustard cake.',
          temperature: '15°C - 35°C',
          humidity: 'Moderate outdoor humidity.',
        },
        difficulty: 'Intermediate',
        nursery: approvedNursery._id,
        isFeatured: false,
        ratingsAverage: 4.6,
        ratingsQuantity: 21,
        tags: ['fragrant', 'balcony', 'traditional', 'flowering'],
      },
      {
        name: 'Organic Tomato F1 Hybrid Seeds (Pack of 50)',
        botanicalName: 'Solanum lycopersicum',
        description: 'High-germination heirloom tomato seeds bred for heavy clustering yields and disease resistance. Produces plump, juicy, sweet red tomatoes ideal for salads, curries, and balcony pot farming.',
        shortDescription: 'Non-GMO seeds for high-yielding, juicy, sweet red tomatoes in home containers.',
        price: 129,
        originalPrice: 199,
        stock: 120,
        category: categoryMap['seeds-bulbs']._id,
        indoorOutdoor: 'outdoor',
        images: [
          'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=800&q=80',
        ],
        careGuide: {
          light: 'Germinate in warm shade, transplant to full sunlight.',
          water: 'Keep seedling tray moist; do not flood.',
          soil: 'Fine cocopeat germination plug mix.',
          temperature: '20°C - 30°C',
          humidity: 'Moderate.',
        },
        difficulty: 'Beginner Friendly',
        nursery: approvedNursery._id,
        isFeatured: false,
        ratingsAverage: 4.7,
        ratingsQuantity: 15,
        tags: ['edible-garden', 'seeds', 'organic', 'kitchen-garden'],
      },
      {
        name: 'Italian Sweet Basil Herb Seeds (Pack of 100)',
        botanicalName: 'Ocimum basilicum',
        description: 'Aromatic culinary herb seeds with tender, aromatic leaves perfect for homemade pesto, pasta, and herbal infusions. Germinates in just 4-7 days on your kitchen windowsill.',
        shortDescription: 'Fresh aromatic culinary herb seeds that sprout in 5 days for kitchen cooking.',
        price: 99,
        originalPrice: 149,
        stock: 95,
        category: categoryMap['seeds-bulbs']._id,
        indoorOutdoor: 'both',
        images: [
          'https://images.unsplash.com/photo-1618164436241-4473940d1f5c?auto=format&fit=crop&w=800&q=80',
        ],
        careGuide: {
          light: '4-6 hours of sunny window exposure.',
          water: 'Water bottom-up to keep leaves dry.',
          soil: 'Light porous potting mix.',
          temperature: '18°C - 30°C',
          humidity: 'Average.',
        },
        difficulty: 'Beginner Friendly',
        nursery: approvedNursery._id,
        isFeatured: false,
        ratingsAverage: 4.8,
        ratingsQuantity: 12,
        tags: ['herb', 'seeds', 'culinary', 'kitchen'],
      },
      {
        name: 'Artisan Glazed Ceramic Planter 8-Inch',
        botanicalName: 'Handcrafted Ceramic Pot',
        description: 'Exquisite handcrafted stoneware planter fired at 1200°C with an emerald forest reactive glaze. Includes built-in drainage hole and matching water drip saucer to safeguard hardwood floors and tables.',
        shortDescription: 'Heavyweight glazed emerald ceramic planter with matching saucer and drainage.',
        price: 549,
        originalPrice: 799,
        stock: 40,
        category: categoryMap['pots-planters']._id,
        indoorOutdoor: 'both',
        images: [
          'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80',
        ],
        careGuide: {
          light: 'Weatherproof UV resistant glaze.',
          water: 'Drainage hole keeps roots from waterlogging.',
          soil: 'Accommodates 8-inch nursery grow pots or direct soil potting.',
          temperature: 'All weather resistant.',
          humidity: 'Non-porous glaze retains moisture.',
        },
        difficulty: 'Beginner Friendly',
        nursery: approvedNursery._id,
        isFeatured: true,
        ratingsAverage: 4.9,
        ratingsQuantity: 27,
        tags: ['ceramic', 'planter', 'luxury-decor', 'saucer-included'],
      },
      {
        name: 'Ergonomic Heavy-Duty Gardening Tool Kit (5 Pcs)',
        botanicalName: 'Stainless Steel Tool Set',
        description: 'Includes transplant trowel, hand cultivator fork, bypass pruning shear with safety lock, weeder, and anti-slip garden gloves. Made from rust-resistant polished aluminum alloy with soft-grip rubberized handles.',
        shortDescription: '5-piece rust-resistant cast aluminum hand tools with non-slip grips and garden gloves.',
        price: 899,
        originalPrice: 1299,
        stock: 25,
        category: categoryMap['tools-plant-care']._id,
        indoorOutdoor: 'both',
        images: [
          'https://images.unsplash.com/photo-1617576683096-00fc8eecb3af?auto=format&fit=crop&w=800&q=80',
        ],
        careGuide: {
          light: 'Wipe clean after each use.',
          water: 'Rust-resistant alloy; dry tools before storing.',
          soil: 'Suitable for hard, rocky, and compacted soils.',
          temperature: 'Durable in all climates.',
          humidity: 'Store in dry toolkit pouch.',
        },
        difficulty: 'Beginner Friendly',
        nursery: approvedNursery._id,
        isFeatured: true,
        ratingsAverage: 4.9,
        ratingsQuantity: 31,
        tags: ['tools', 'shears', 'trowel', 'gardening-kit'],
      },
      {
        name: 'Premium Organic Vermicompost (5 kg Bag)',
        botanicalName: 'Earthworm Castings & Organic Bio-manure',
        description: '100% pure organic earthworm manure rich in beneficial soil microbes, nitrogen, phosphorus, and humic acid. Enhances water retention and stimulates explosive root and vegetative growth without chemical burn risk.',
        shortDescription: '100% natural, odorless microbial-rich bio fertilizer for lush plant vitality.',
        price: 279,
        originalPrice: 350,
        stock: 80,
        category: categoryMap['soils-fertilizers']._id,
        indoorOutdoor: 'both',
        images: [
          'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80',
        ],
        careGuide: {
          light: 'Store in cool dry place away from direct heat.',
          water: 'Mix 2 tablespoons per 6-inch pot every 15-20 days.',
          soil: 'Improves aeration, moisture retention, and microbial ecology.',
          temperature: 'Normal ambient storage.',
          humidity: 'Keep bag zip-locked.',
        },
        difficulty: 'Beginner Friendly',
        nursery: approvedNursery._id,
        isFeatured: false,
        ratingsAverage: 4.8,
        ratingsQuantity: 44,
        tags: ['organic-fertilizer', 'vermicompost', 'soil-health', 'chemical-free'],
      },
      {
        name: 'Cold-Pressed Pure Neem Oil Plant Spray (250 ml)',
        botanicalName: 'Azadirachta indica extract',
        description: 'Pre-mixed organic bio-pesticide and fungicide. Safely eradicates aphids, mealybugs, whiteflies, spider mites, and powdery mildew without harming friendly honeybees or domestic pets.',
        shortDescription: 'Ready-to-use organic bio-pesticide spray for bugs, mites, and leaf fungus.',
        price: 249,
        originalPrice: 320,
        stock: 55,
        category: categoryMap['tools-plant-care']._id,
        indoorOutdoor: 'both',
        images: [
          'https://images.unsplash.com/photo-1584467541268-b040f83be3fd?auto=format&fit=crop&w=800&q=80',
        ],
        careGuide: {
          light: 'Spray in early evening or morning. Avoid spraying under hot midday sun.',
          water: 'Spray top and underside of leaves every 7-10 days.',
          soil: 'Safe when it drips into the potting soil.',
          temperature: 'Room temperature storage.',
          humidity: 'Non-toxic bio formula.',
        },
        difficulty: 'Beginner Friendly',
        nursery: approvedNursery._id,
        isFeatured: false,
        ratingsAverage: 4.7,
        ratingsQuantity: 18,
        tags: ['pest-control', 'neem-oil', 'organic', 'bug-spray'],
      },
    ];

    const createdProducts = await Product.insertMany(productsData);

    // 5. Create Sample Orders
    console.log('Seeding sample orders...');
    const sampleOrder1 = await Order.create({
      orderNumber: 'URB-9821-4401',
      customer: customerUser._id,
      items: [
        {
          product: createdProducts[0]._id, // Snake Plant
          name: createdProducts[0].name,
          price: createdProducts[0].price,
          quantity: 2,
          image: createdProducts[0].images[0],
          nursery: approvedNursery._id,
        },
        {
          product: createdProducts[8]._id, // Ceramic Planter
          name: createdProducts[8].name,
          price: createdProducts[8].price,
          quantity: 1,
          image: createdProducts[8].images[0],
          nursery: approvedNursery._id,
        },
      ],
      shippingAddress: {
        fullName: 'Ananya Verma',
        phone: '+91 98123 45678',
        addressLine: 'Flat 402, Green Meadows, 5th Main',
        city: 'Bengaluru',
        state: 'Karnataka',
        postalCode: '560076',
      },
      paymentMethod: 'Cash on Delivery',
      paymentStatus: 'Pending',
      orderStatus: 'Processing',
      subtotal: 399 * 2 + 549,
      shippingFee: 0,
      totalAmount: 399 * 2 + 549,
      deliveryNotes: 'Please ring the doorbell and leave package in the safety grill.',
    });

    const sampleOrder2 = await Order.create({
      orderNumber: 'URB-8419-7723',
      customer: customerUser._id,
      items: [
        {
          product: createdProducts[1]._id, // Money Plant
          name: createdProducts[1].name,
          price: createdProducts[1].price,
          quantity: 1,
          image: createdProducts[1].images[0],
          nursery: approvedNursery._id,
        },
        {
          product: createdProducts[9]._id, // Tool Kit
          name: createdProducts[9].name,
          price: createdProducts[9].price,
          quantity: 1,
          image: createdProducts[9].images[0],
          nursery: approvedNursery._id,
        },
      ],
      shippingAddress: {
        fullName: 'Ananya Verma',
        phone: '+91 98123 45678',
        addressLine: 'Flat 402, Green Meadows, 5th Main',
        city: 'Bengaluru',
        state: 'Karnataka',
        postalCode: '560076',
      },
      paymentMethod: 'Demo Online Payment (Card / UPI)',
      paymentStatus: 'Paid',
      orderStatus: 'Delivered',
      subtotal: 249 + 899,
      shippingFee: 0,
      totalAmount: 249 + 899,
    });

    // 6. Create Sample Bookings
    console.log('Seeding sample bookings...');
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);

    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 3);

    await Booking.create({
      customer: customerUser._id,
      gardener: gardenerUser1._id,
      service: createdServices[0]._id, // Lawn Mowing
      bookingDate: tomorrow,
      timeSlot: '09:00 AM - 12:00 PM',
      serviceAddress: {
        fullName: 'Ananya Verma',
        phone: '+91 98123 45678',
        addressLine: 'Villa 14, Palm Grove, Sarjapur Road',
        city: 'Bengaluru',
        state: 'Karnataka',
        postalCode: '560035',
      },
      status: 'Confirmed',
      price: createdServices[0].basePrice,
      paymentMethod: 'Cash after Service',
      paymentStatus: 'Pending',
      notes: 'Please bring edge trimmer for lawn corners.',
    });

    await Booking.create({
      customer: customerUser._id,
      gardener: gardenerUser2._id,
      service: createdServices[2]._id, // Plant Doctor
      bookingDate: pastDate,
      timeSlot: '03:00 PM - 06:00 PM',
      serviceAddress: {
        fullName: 'Ananya Verma',
        phone: '+91 98123 45678',
        addressLine: 'Flat 402, Green Meadows, 5th Main',
        city: 'Bengaluru',
        state: 'Karnataka',
        postalCode: '560076',
      },
      status: 'Completed',
      price: createdServices[2].basePrice,
      paymentMethod: 'Demo Online Payment (Card / UPI)',
      paymentStatus: 'Paid',
      completedAt: pastDate,
      hasReviewed: true,
      notes: 'Peace lily had yellow tips; diagnosed as fluoride excess in water.',
    });

    // 7. Create Reviews
    console.log('Seeding reviews...');
    await Review.create([
      {
        user: customerUser._id,
        targetType: 'Product',
        targetId: createdProducts[0]._id, // Snake Plant
        rating: 5,
        title: 'Thriving with zero effort!',
        comment: 'Received this in pristine condition with lush green sword-like foliage. Packaged with bio-degradable protective wrap. Truly foolproof indoor plant!',
        isVerifiedPurchase: true,
      },
      {
        user: customerUser._id,
        targetType: 'Product',
        targetId: createdProducts[1]._id, // Money Plant
        rating: 5,
        title: 'Golden variegation is stunning',
        comment: 'Already putting out two new leaves in just 10 days on my sunny desk. High quality root ball and healthy soil mix.',
        isVerifiedPurchase: true,
      },
      {
        user: customerUser._id,
        targetType: 'Service',
        targetId: createdServices[2]._id, // Plant Doctor
        rating: 5,
        title: 'Saved my rare Monstera and Peace Lily!',
        comment: 'Sunita arrived on time with complete diagnostic kits. Pinpointed the exact cause of yellowing tips and sprayed organic neem solution. Super professional!',
        isVerifiedPurchase: true,
      },
    ]);

    // 8. Create Sample Complaint / Dispute
    console.log('Seeding sample dispute ticket...');
    await Complaint.create({
      user: customerUser._id,
      type: 'Order',
      referenceId: sampleOrder1.orderNumber,
      subject: 'Delay inquiry for planter delivery slot',
      description: 'Order placed 2 days ago is in Processing. Wondering if the ceramic planter will be delivered together with the snake plants?',
      priority: 'Low',
      status: 'Open',
    });

    console.log('----------------------------------------------------');
    console.log('SUCCESS: Database successfully seeded with Urbano Nursery data!');
    console.log('----------------------------------------------------');
    console.log('Test Accounts:');
    console.log('1. Admin:      admin@urbanonursery.com        | Admin@12345');
    console.log('2. Nursery:    greenhaven@urbanonursery.com   | Nursery@12345  (Approved)');
    console.log('3. Nursery:    bloomflora@urbanonursery.com   | Pending@12345  (Pending Approval)');
    console.log('4. Gardener:   ramesh.gardener@urbanonursery.com | Gardener@12345 (Approved)');
    console.log('5. Gardener:   sunita.gardener@urbanonursery.com | Gardener@12345 (Approved)');
    console.log('6. Customer:   ananya.customer@urbanonursery.com | Customer@12345');
    console.log('----------------------------------------------------');

    process.exit(0);
  } catch (err) {
    console.error('Error during database seed:', err);
    process.exit(1);
  }
};

seedDatabase();
