(function () {
  const body = document.body;
  const toggle = document.querySelector("[data-menu-toggle]");
  const nav = document.querySelector("[data-nav]");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      const expanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!expanded));
      body.classList.toggle("nav-open", !expanded);
    });

    nav.addEventListener("click", function (event) {
      if (event.target.tagName === "A") {
        toggle.setAttribute("aria-expanded", "false");
        body.classList.remove("nav-open");
      }
    });
  }

  const categoryMap = {
    "luxury-vehicle": {
      slug: "luxury-vehicle",
      title: "Luxury Vehicle",
      shortTitle: "Luxury Vehicle",
      type: "Luxury vehicle",
      page: "luxury-vehicle.html",
      intro: "Premium sedans and executive models selected for dealership procurement, VIP fleet supply and image-led resale channels.",
      products: [
        {
          slug: "mercedes-s450",
          name: "Mercedes-Benz S450",
          subtitle: "New generation executive sedan with advanced technology and premium comfort",
          year: "2026",
          engine: "3.0T",
          fuel: "Gasoline",
          drive: "AWD",
          transmission: "9AT",
          color: "Black / White / Gray",
          stock: "Q3 2026 Allocation Available",
          image: "assets/mercedes-s450-main.jpg",
          pageUrl: "mercedes-s450.html"
        },
        {
          slug: "Mercedes- GLS450",
          name: "Mercedes-Benz GLS450",
          subtitle: "2026 GLS450: Luxurious 7-seat large SUV, stable powertrain for wholesale supply",
          year: "2026",
          engine: "3.0T",
          fuel: "Gasoline",
          drive: "RWD / AWD",
          transmission: "Automatic",
          color: "Black / White / Gray",
          stock: "Q3 2026",
          image: "assets/products/Mercedes- GLS450/main.png",
          gallery: ["assets/products/Mercedes- GLS450/1.png", "assets/products/Mercedes- GLS450/2.png", "assets/products/Mercedes- GLS450/3.png", "assets/products/Mercedes- GLS450/main.png"]
        },
        {
          slug: "lexus-gx-550",
          name: "Lexus GX 550",
          subtitle: "Premium luxury off-road SUV with exceptional comfort and capability for high-end market",
          year: "2026",
          engine: "3.4L Twin-Turbo V6",
          fuel: "Gasoline",
          drive: "Full-Time Four-Wheel Drive (4WD)",
          transmission: "10-Speed Automatic Transmission",
          color: "Black / White / Gray / Silver",
          stock: "Available",
          image: "assets/products/lexus-gx-550/main.png",
          listImageClass: "product-img product-img-contain",
          detailImageClass: "product-img product-img-contain",
          gallery: ["assets/products/lexus-gx-550/1.png", "assets/products/lexus-gx-550/2.png", "assets/products/lexus-gx-550/3.png", "assets/products/lexus-gx-550/4.png", "assets/products/lexus-gx-550/main.png"]
        },
        {
          slug: "porsche-cayenne",
          name: "Porsche Cayenne",
          subtitle: "Premium luxury performance SUV for high-end dealerships and VIP client procurement",
          year: "2026",
          engine: "3.0T V6 / 4.0T V8",
          fuel: "Gasoline",
          drive: "AWD",
          transmission: "Automatic",
          color: "Black / White / Gray / Silver",
          stock: "Available",
          image: "assets/products/porsche-cayenne/main.jpg",
          gallery: ["assets/products/porsche-cayenne/1.jpg", "assets/products/porsche-cayenne/2.jpg", "assets/products/porsche-cayenne/3.jpg", "assets/products/porsche-cayenne/main.jpg"]
        },
        {
          slug: "land-rover-range-rover",
          name: "Land Rover Range Rover",
          subtitle: "Flagship luxury off-road SUV for premium showrooms and high-end clientele",
          year: "2026",
          engine: "3.0T L6 / 4.4T V8",
          fuel: "Gasoline",
          drive: "AWD",
          transmission: "Automatic",
          color: "Black / White / Gray / Silver",
          stock: "Available",
          image: "assets/products/land-rover-range-rover/main.jpg",
          gallery: ["assets/products/land-rover-range-rover/1.jpg", "assets/products/land-rover-range-rover/2.jpg", "assets/products/land-rover-range-rover/3.jpg", "assets/products/land-rover-range-rover/main.jpg"]
        },
        {
          slug: "land-rover-defender-110",
          name: "Land Rover Defender 110",
          subtitle: "Iconic luxury off-road SUV for adventure enthusiasts and premium dealerships",
          year: "2026",
          engine: "2.0T L4 / 3.0T L6",
          fuel: "Gasoline",
          drive: "AWD",
          transmission: "Automatic",
          color: "Black / White / Gray / Silver",
          stock: "Available",
          image: "assets/products/land-rover-defender-110/main.jpg",
          gallery: ["assets/products/land-rover-defender-110/1.jpg", "assets/products/land-rover-defender-110/2.jpg", "assets/products/land-rover-defender-110/3.jpg", "assets/products/land-rover-defender-110/main.jpg"]
        },
        {
          slug: "audi-a8l-horch",
          name: "Audi A8L Horch",
          subtitle: "Ultra-luxury executive sedan for VIP clients and high-end showroom procurement",
          year: "2026",
          engine: "3.0T V6 / 4.0T V8",
          fuel: "Gasoline",
          drive: "RWD / AWD",
          transmission: "Automatic",
          color: "Black / White / Gray / Silver",
          stock: "Available",
          image: "assets/products/audi-a8l-horch/main.jpg",
          gallery: ["assets/products/audi-a8l-horch/1.jpg", "assets/products/audi-a8l-horch/2.jpg", "assets/products/audi-a8l-horch/3.jpg", "assets/products/audi-a8l-horch/main.jpg"]
        },
        {
          slug: "mercedes-benz-gle",
          name: "Mercedes-Benz GLE",
          subtitle: "Premium luxury mid-size SUV for global dealerships and family client procurement",
          year: "2026",
          engine: "2.0T L4 / 3.0T L6",
          fuel: "Gasoline",
          drive: "RWD / AWD",
          transmission: "Automatic",
          color: "Black / White / Gray / Silver",
          stock: "Available",
          image: "assets/products/mercedes-benz-gle/main.jpg",
          gallery: ["assets/products/mercedes-benz-gle/1.jpg", "assets/products/mercedes-benz-gle/2.jpg", "assets/products/mercedes-benz-gle/3.jpg", "assets/products/mercedes-benz-gle/main.jpg"]
        },
        {
          slug: "lexus-lx600",
          name: "Lexus LX600",
          subtitle: "Flagship luxury full-size SUV for high-end dealerships and VIP clientele",
          year: "2026",
          engine: "5.7L V8",
          fuel: "Gasoline",
          drive: "AWD",
          transmission: "Automatic",
          color: "Black / White / Gray / Silver",
          stock: "Available",
          image: "assets/products/lexus-lx600/main.jpg",
          gallery: ["assets/products/lexus-lx600/1.jpg", "assets/products/lexus-lx600/2.jpg", "assets/products/lexus-lx600/3.jpg", "assets/products/lexus-lx600/main.jpg"]
        }
      ]
    },
    "suv-pickup": {
      slug: "suv-pickup",
      title: "International Brand New Cars",
      shortTitle: "International Brand New Cars",
      type: "SUV / pickup truck",
      page: "suv-pickup.html",
      intro: "High-demand SUVs and pickup trucks for family use, project fleets, utility channels and regional bulk dealership supply.",
      products: [

        {
          slug: "mg-zs",
          name: "MG ZS",
          subtitle: "Fashion compact family SUV with complete configuration for global buyers",
          year: "2026",
          engine: "1.5L / 1.5T Turbo",
          fuel: "Petrol",
          drive: "FWD",
          transmission: "CVT",
          color: "White, Black, Silver, Gray",
          stock: "In Stock",
          image: "assets/products/mg-zs/main.png",
          gallery: ["assets/products/mg-zs/1.png","assets/products/mg-zs/2.webp","assets/products/mg-zs/3.jpg","assets/products/mg-zs/main.png"]
        },
        {
          slug: "Volkswagen Tiguan L Pro",
          name: "Volkswagen Tiguan L Pro",
          subtitle: "New 2026 Volkswagen Tiguan L Pro Turbo Sport Utility",
          year: "2026",
          engine: "2.0T",
          fuel: "Gasoline",
          drive: "FWD",
          transmission: "Automatic",
          color: "Optional",
          stock: "In Stock",
          image: "assets/products/Volkswagen Tiguan L Pro/main.png",
          gallery: ["assets/products/Volkswagen Tiguan L Pro/1.jpg", "assets/products/Volkswagen Tiguan L Pro/2.png", "assets/products/Volkswagen Tiguan L Pro/3.png", "assets/products/Volkswagen Tiguan L Pro/main.png"]
        },
        {
          slug: "mazda-cx-5",
          name: "Mazda CX-5",
          subtitle: "Sporty and stylish compact SUV with premium driving dynamics for global market",
          year: "2026",
          engine: "2.0L Naturally Aspirated / 2.5L Naturally Aspirated / 2.5L Turbo",
          fuel: "Gasoline",
          drive: "Front-Wheel Drive (FWD) / All-Wheel Drive (AWD)",
          transmission: "6-Speed Automatic Transmission",
          color: "Black / White / Gray / Red",
          stock: "Available",
          image: "assets/products/mazda-cx-5/main.jpg",
          gallery: ["assets/products/mazda-cx-5/1.jpg", "assets/products/mazda-cx-5/2.jpg", "assets/products/mazda-cx-5/3.jpg", "assets/products/mazda-cx-5/main.jpg"]
        },
        {
          slug: "toyota-corolla",
          name: "Toyota Corolla",
          subtitle: "Reliable and fuel-efficient compact sedan for global daily commuting and fleet use",
          year: "2026",
          engine: "1.2T Turbo / 1.5L Naturally Aspirated / 1.8L Hybrid",
          fuel: "Gasoline / Hybrid",
          drive: "Front-Wheel Drive (FWD)",
          transmission: "Automatic Transmission / Manual Transmission",
          color: "Black / White / Silver / Gray",
          stock: "Available",
          image: "assets/products/toyota-corolla/main.jpg",
          gallery: ["assets/products/toyota-corolla/1.jpg", "assets/products/toyota-corolla/2.jpg", "assets/products/toyota-corolla/3.jpg", "assets/products/toyota-corolla/main.jpg"]
        },
        {
          slug: "hyundai-elantra",
          name: "Hyundai Elantra",
          subtitle: "Stylish and economical compact sedan with advanced tech features for global market",
          year: "2026",
          engine: "1.4T Turbo / 1.5L Naturally Aspirated / 1.6L Hybrid",
          fuel: "Gasoline / Hybrid",
          drive: "Front-Wheel Drive (FWD)",
          transmission: "Automatic Transmission / Manual Transmission",
          color: "Black / White / Gray / Blue",
          stock: "Available",
          image: "assets/products/hyundai-elantra/main.jpg",
          gallery: ["assets/products/hyundai-elantra/1.jpg", "assets/products/hyundai-elantra/2.jpg", "assets/products/hyundai-elantra/3.jpg", "assets/products/hyundai-elantra/main.jpg"]
        },
        {
          slug: "mg5",
          name: "MG5",
          subtitle: "Stylish and affordable compact sedan with sporty design for global young market",
          year: "2026",
          engine: "1.5L Naturally Aspirated / 1.5T Turbo",
          fuel: "Gasoline",
          drive: "Front-Wheel Drive (FWD)",
          transmission: "Automatic Transmission / Manual Transmission",
          color: "Black / White / Gray / Red",
          stock: "Available",
          image: "assets/products/mg5/main.jpg",
          gallery: ["assets/products/mg5/1.jpg", "assets/products/mg5/2.jpg", "assets/products/mg5/3.jpg", "assets/products/mg5/main.jpg"]
        }
      ]
    },
    "chinese-brand-new-cars": {
      slug: "chinese-brand-new-cars",
      title: "Chinese Brand New Cars",
      shortTitle: "Chinese Brand New Cars",
      type: "Brand new complete vehicle",
      page: "chinese-brand-new-cars.html",
      intro: "Fast-moving new Chinese passenger vehicles including EV, hybrid and fuel models sourced for international resale programs.",
      products: [
        {
          slug: "tank-700",
          name: "TANK 700",
          subtitle: "Flagship luxury hardcore off-road hybrid SUV with premium capability",
          year: "2026",
          engine: "3.0T V6 Twin-Turbo Hi4-T Hybrid",
          fuel: "Hybrid",
          drive: "Full-time 4WD",
          transmission: "9AT",
          color: "Black, White, Gray, Green",
          stock: "In Stock",
          image: "assets/products/tank-700/main.jpg",
          gallery: ["assets/products/tank-700/1.png","assets/products/tank-700/2.jpg","assets/products/tank-700/3.jpg","assets/products/tank-700/main.jpg"]
        },
        {
          slug: "haval-m6",
          name: "Haval M6",
          subtitle: "Affordable practical family petrol SUV with spacious interior",
          year: "2026",
          engine: "1.5T Turbo",
          fuel: "Petrol",
          drive: "FWD",
          transmission: "6MT / 7DCT",
          color: "White, Black, Gray, Blue",
          stock: "In Stock",
          image: "assets/products/haval-m6/main.jpg",
          gallery: ["assets/products/haval-m6/1.jpg","assets/products/haval-m6/2.jpg","assets/products/haval-m6/3.jpg","assets/products/haval-m6/main.jpg"]
        },
        {
          slug: "byd-seagull",
          name: "BYD Seagull",
          subtitle: "World's top-selling entry-level pure electric city car with fast charging",
          year: "2026",
          engine: "Permanent Magnet Synchronous Motor",
          fuel: "Pure Electric",
          drive: "FWD",
          transmission: "Single-speed Reduction",
          color: "White, Pink, Blue, Green",
          stock: "In Stock",
          image: "assets/products/byd-seagull/main.jpg",
          gallery: ["assets/products/byd-seagull/1.jpg","assets/products/byd-seagull/2.jpg","assets/products/byd-seagull/3.jpg","assets/products/byd-seagull/main.jpg"]
        },
        {
          slug: "byd-song-plus-dmi",
          name: "BYD Song PLUS DM-i",
          subtitle: "Global best-selling plug-in hybrid family SUV with long range and low fuel consumption",
          year: "2026",
          engine: "1.5L DM-i Super Hybrid System",
          fuel: "Plug-in Hybrid",
          drive: "FWD",
          transmission: "E-CVT",
          color: "White, Black, Gray, Blue",
          stock: "In Stock",
          image: "assets/products/byd-song-plus-dmi/main.png",
          gallery: ["assets/products/byd-song-plus-dmi/1.png","assets/products/byd-song-plus-dmi/2.png","assets/products/byd-song-plus-dmi/3.png","assets/products/byd-song-plus-dmi/main.png"]
        },
        {
          slug: "zeekr-009",
          name: "ZEEKR 009",
          subtitle: "Flagship ultra-luxury pure electric large MPV with premium comfort",
          year: "2026",
          engine: "Dual Permanent Magnet Synchronous Motors",
          fuel: "Pure Electric",
          drive: "AWD",
          transmission: "Single-speed Reduction",
          color: "Black, White, Gray, Blue",
          stock: "In Stock",
          image: "assets/products/zeekr-009/main.jpg",
          gallery: ["assets/products/zeekr-009/1.jpg","assets/products/zeekr-009/2.jpg","assets/products/zeekr-009/3.jpg","assets/products/zeekr-009/main.jpg"]
        },
        {
          slug: "byd-yuan-up",
          name: "BYD Yuan Up",
          subtitle: "Compact urban pure electric SUV for young buyers with reliable battery performance",
          year: "2026",
          engine: "Permanent Magnet Synchronous Motor",
          fuel: "Pure Electric",
          drive: "FWD",
          transmission: "Single-speed Reduction",
          color: "White, Black, Gray, Pink",
          stock: "In Stock",
          image: "assets/products/byd-yuan-up/main.png",
          gallery: ["assets/products/byd-yuan-up/1.png","assets/products/byd-yuan-up/2.png","assets/products/byd-yuan-up/3.png","assets/products/byd-yuan-up/main.png"]
        },
        {
          slug: "jetour-traveller-t2",
          name: "Jetour Traveller (Jetour T2)",
          subtitle: "Rugged compact SUV with versatile performance for urban commuting and light off-road adventures",
          year: "2026",
          engine: "1.5T Turbo / 2.0T Turbo",
          fuel: "Gasoline",
          drive: "Front-Wheel Drive (FWD) / Four-Wheel Drive (4WD)",
          transmission: "Automatic Transmission",
          color: "Black / White / Gray / Military Green",
          stock: "Available",
          image: "assets/products/jetour-traveller-t2/main.jpg",
          gallery: ["assets/products/jetour-traveller-t2/1.jpg", "assets/products/jetour-traveller-t2/2.jpg", "assets/products/jetour-traveller-t2/3.jpg", "assets/products/jetour-traveller-t2/main.jpg"]
        },
        {
          slug: "geely-coolray-binyue",
          name: "Geely Coolray (Binyue)",
          subtitle: "Sporty and affordable compact SUV with advanced tech for young global buyers",
          year: "2026",
          engine: "1.4T Turbo / 1.5T Turbo",
          fuel: "Gasoline",
          drive: "Front-Wheel Drive (FWD)",
          transmission: "Automatic Transmission",
          color: "Black / White / Gray / Blue",
          stock: "Available",
          image: "assets/products/geely-coolray-binyue/main.jpg",
          gallery: ["assets/products/geely-coolray-binyue/1.jpg", "assets/products/geely-coolray-binyue/2.jpg", "assets/products/geely-coolray-binyue/3.jpg", "assets/products/geely-coolray-binyue/main.jpg"]
        },
        {
          slug: "aion-i60-reev",
          name: "AION i60 REEV",
          subtitle: "High-efficiency range-extended electric sedan with long range for global new energy market",
          year: "2026",
          engine: "Range Extender + Permanent Magnet Synchronous Motor",
          fuel: "Electric / Gasoline (Range Extender)",
          drive: "Front-Wheel Drive (FWD)",
          transmission: "Single-Speed Automatic Transmission",
          color: "Black / White / Gray / Blue",
          stock: "Available",
          image: "assets/products/aion-i60-reev/main.jpg",
          gallery: ["assets/products/aion-i60-reev/1.jpg", "assets/products/aion-i60-reev/2.jpg", "assets/products/aion-i60-reev/3.jpg", "assets/products/aion-i60-reev/main.jpg"]
        },
        {
          slug: "leapmotor-t03",
          name: "Leapmotor T03",
          subtitle: "Affordable and compact pure electric city car for urban commuting and global micro EV market",
          year: "2026",
          engine: "Permanent Magnet Synchronous Motor",
          fuel: "Pure Electric",
          drive: "Front-Wheel Drive (FWD)",
          transmission: "Single-Speed Automatic Transmission",
          color: "Black / White / Gray / Pink",
          stock: "Available",
          image: "assets/products/leapmotor-t03/main.jpg",
          gallery: ["assets/products/leapmotor-t03/1.jpg", "assets/products/leapmotor-t03/2.jpg", "assets/products/leapmotor-t03/3.jpg", "assets/products/leapmotor-t03/main.jpg"]
        },
        {
          slug: "livan",
          name: "Livan",
          subtitle: "Reliable and affordable new energy vehicles for global market with versatile model options",
          year: "2026",
          engine: "Electric / Hybrid",
          fuel: "Electric / Hybrid",
          drive: "Front-Wheel Drive (FWD)",
          transmission: "Automatic Transmission",
          color: "Black / White / Gray",
          stock: "Available",
          image: "assets/products/livan/main.jpg",
          gallery: ["assets/products/livan/1.jpg", "assets/products/livan/2.jpg", "assets/products/livan/3.jpg", "assets/products/livan/main.jpg"]
        }
      ]
    },
    "skd-car-kits": {
      slug: "skd-car-kits",
      title: "SKD Car Kits",
      shortTitle: "SKD Car Kits",
      type: "SKD assembly kit",
      page: "skd-car-kits.html",
      intro: "Semi-knocked-down vehicle kits for overseas assembly partners with export document coordination and configuration support.",
      products: [
      ]
    },
    "used-cars": {
      slug: "used-cars",
      title: "Used Cars",
      shortTitle: "Used Cars",
      type: "Inspected used vehicle",
      page: "used-cars.html",
      intro: "Inspected pre-owned sedans, SUVs and commercial units for overseas dealers, fleet buyers and resale channels.",
      products: [
      ]
    }
  };

  const categoryList = [
    categoryMap["luxury-vehicle"],
    categoryMap["suv-pickup"],
    categoryMap["chinese-brand-new-cars"],
    categoryMap["used-cars"],
    categoryMap["skd-car-kits"]
  ];

  categoryList.forEach(function (category) {
    category.products.forEach(function (product) {
      product.categorySlug = category.slug;
      product.categoryTitle = category.title;
      product.imageClass = getImageClass(category.slug);
    });
  });

  function getImageClass(categorySlug) {
    const imageClassMap = {
      "luxury-vehicle": "crop-left",
      "suv-pickup": "crop-mid-left",
      "chinese-brand-new-cars": "crop-center",
      "used-cars": "crop-center",
      "skd-car-kits": "crop-mid-right"
    };
    return imageClassMap[categorySlug] || "crop-center";
  }

  function getCategoryFromLocation() {
    const pageCategory = document.body.getAttribute("data-category");
    if (pageCategory && categoryMap[pageCategory]) {
      return categoryMap[pageCategory];
    }

    const params = new URLSearchParams(window.location.search);
    const slug = params.get("category");
    if (slug && categoryMap[slug]) {
      return categoryMap[slug];
    }

    return null;
  }

  function getProductForDetail(category) {
    const params = new URLSearchParams(window.location.search);
    const productSlug = params.get("item");
    if (!category) {
      return null;
    }
    return category.products.find(function (product) {
      return product.slug === productSlug;
    }) || category.products[0];
  }

  function renderCategoryPage() {
    const category = getCategoryFromLocation();
    const categoryPage = document.querySelector("[data-category-page]");
    if (!category || !categoryPage) {
      return;
    }

    const titleNode = document.querySelector("[data-category-title]");
    const introNode = document.querySelector("[data-category-intro]");
    const breadcrumbNode = document.querySelector("[data-category-name]");
    const listNode = document.querySelector("[data-product-list]");

    if (titleNode) {
      titleNode.textContent = category.title;
    }

    if (introNode) {
      introNode.textContent = category.intro;
    }

    if (breadcrumbNode) {
      breadcrumbNode.textContent = category.title;
    }

    if (listNode) {
      listNode.innerHTML = category.products.map(function (product) {
        const listImageClass = product.listImageClass || (product.image ? 'product-img' : product.imageClass);
        return [
          '<article class="list-card">',
          '<img class="' + listImageClass + '" src="' + (product.image || 'assets/category-composite.png') + '" alt="' + product.name + '">',
          '<div class="list-card-body">',
          '<p class="list-card-meta">' + category.shortTitle + '</p>',
          '<h3><a class="card-title-link" href="' + (product.pageUrl || ('product.html?category=' + category.slug + '&item=' + product.slug)) + '">' + product.name + '</a></h3>',
          '<p>' + product.subtitle + '</p>',
          '<div class="list-card-specs">',
          '<span>' + product.year + '</span>',
          '<span>' + product.fuel + '</span>',
          '<span>' + product.transmission + '</span>',
          '</div>',
          '<a class="card-action-link" href="' + (product.pageUrl || ('product.html?category=' + category.slug + '&item=' + product.slug)) + '">VIEW DETAILS | SEND INQUIRY</a>',
          '</div>',
          '</article>'
        ].join("");
      }).join("");
    }

    document.title = category.title + " | Worlda Global Auto";
  }

  function renderProductPage() {
    const category = getCategoryFromLocation();
    const productTitle = document.querySelector("[data-product-title]");
    const productType = document.querySelector("[data-spec='type']");
    const productSubtitle = document.querySelector("[data-product-subtitle]");
    const specYear = document.querySelector("[data-spec='year']");
    const specEngine = document.querySelector("[data-spec='engine']");
    const specFuel = document.querySelector("[data-spec='fuel']");
    const specDrive = document.querySelector("[data-spec='drive']");
    const specTransmission = document.querySelector("[data-spec='transmission']");
    const specColor = document.querySelector("[data-spec='color']");
    const specStock = document.querySelector("[data-spec='stock']");
    const categoryLinks = document.querySelectorAll("[data-category-link]");
    const heroImage = document.querySelector("[data-product-image]");
    const galleryNode = document.querySelector("[data-product-gallery]");

    if (!productTitle || !category) {
      return;
    }

    const product = getProductForDetail(category);

    productTitle.textContent = product.name;
    document.title = product.name + " | Worlda Global Auto";

    if (productSubtitle) {
      productSubtitle.textContent = product.subtitle;
    }

    if (productType) {
      productType.textContent = category.type;
    }

    if (specYear) {
      specYear.textContent = product.year;
    }

    if (specEngine) {
      specEngine.textContent = product.engine;
    }

    if (specFuel) {
      specFuel.textContent = product.fuel;
    }

    if (specDrive) {
      specDrive.textContent = product.drive;
    }

    if (specTransmission) {
      specTransmission.textContent = product.transmission;
    }

    if (specColor) {
      specColor.textContent = product.color;
    }

    if (specStock) {
      specStock.textContent = product.stock;
    }

    if (heroImage) {
      if (product.image) {
        heroImage.className = product.detailImageClass || 'product-img';
        heroImage.src = product.image;
        heroImage.alt = product.name;
      } else {
        heroImage.className = product.imageClass;
      }
    }

    if (galleryNode) {
      const galleryImages = (product.gallery && product.gallery.length ? product.gallery : [product.image]).filter(Boolean);
      galleryNode.innerHTML = galleryImages.slice(0, 4).map(function (src, index) {
        return '<button class="thumb-button" type="button" data-gallery-src="' + src + '" aria-label="View image ' + (index + 1) + ' for ' + product.name + '">' +
          '<img src="' + src + '" alt="' + product.name + ' detail image ' + (index + 1) + '">' +
        '</button>';
      }).join("");

      galleryNode.querySelectorAll("[data-gallery-src]").forEach(function (button) {
        button.addEventListener("click", function () {
          if (heroImage) {
            heroImage.src = button.getAttribute("data-gallery-src");
            heroImage.alt = product.name;
          }
        });
      });
    }

    categoryLinks.forEach(function (link) {
      const slug = link.getAttribute("data-category-link");
      if (categoryMap[slug]) {
        link.href = categoryMap[slug].page;
      }
    });
  }

  renderCategoryPage();
  renderProductPage();

  document.querySelectorAll("[data-inquiry-form]").forEach(function (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      const formData = new FormData(form);
      const subject = "Worlda Global Auto Inquiry";
      const lines = [
        "Name: " + (formData.get("name") || ""),
        "Email: " + (formData.get("email") || ""),
        "Quantity: " + (formData.get("quantity") || ""),
        "Message: " + (formData.get("message") || ""),
        "Page: " + window.location.href
      ];
      const href = "mailto:sales01@worldaauto.com?subject=" +
        encodeURIComponent(subject) +
        "&body=" +
        encodeURIComponent(lines.join("\n"));
      window.location.href = href;
    });
  });
})();





