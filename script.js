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
          slug: "mercedes-s-class",
          name: "Mercedes-Benz S-Class",
          subtitle: "Executive flagship sedan for premium wholesale orders",
          year: "2024",
          engine: "3.0T",
          fuel: "Gasoline / Mild Hybrid",
          drive: "AWD",
          transmission: "9AT",
          color: "Black / Beige / Silver",
          stock: "In Stock / Ready for Shipment"
        },
        {
          slug: "bmw-7-series",
          name: "BMW 7 Series",
          subtitle: "Luxury long-wheelbase sedan with dealer-ready configurations",
          year: "2024",
          engine: "3.0T",
          fuel: "Gasoline / Hybrid",
          drive: "RWD / AWD",
          transmission: "8AT",
          color: "Black / White / Cognac",
          stock: "In Stock / Ready for Shipment"
        },
        {
          slug: "lexus-ls",
          name: "Lexus LS",
          subtitle: "Stable luxury sedan for wholesale fleet and showroom supply",
          year: "2024",
          engine: "3.5L",
          fuel: "Gasoline / Hybrid",
          drive: "RWD / AWD",
          transmission: "10AT / E-CVT",
          color: "Black / Gray / Ivory",
          stock: "Order Available / Fast Allocation"
        },
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
          image: "assets/mercedes-s450-main.jpg"
        }
      ]
    },
    "suv-pickup": {
      slug: "suv-pickup",
      title: "SUV & Pickup Trucks",
      shortTitle: "SUV & Pickup Trucks",
      type: "SUV / pickup truck",
      page: "suv-pickup.html",
      intro: "High-demand SUVs and pickup trucks for family use, project fleets, utility channels and regional bulk dealership supply.",
      products: [
        {
          slug: "toyota-land-cruiser",
          name: "Toyota Land Cruiser",
          subtitle: "High-demand off-road SUV for government and dealer channels",
          year: "2024",
          engine: "3.5T",
          fuel: "Gasoline",
          drive: "4WD",
          transmission: "10AT",
          color: "White / Black / Sand",
          stock: "In Stock / Ready for Shipment"
        },
        {
          slug: "ford-ranger",
          name: "Ford Ranger",
          subtitle: "Mid-size pickup truck for utility and resale markets",
          year: "2024",
          engine: "2.3T",
          fuel: "Gasoline / Diesel",
          drive: "4WD / RWD",
          transmission: "10AT / 6MT",
          color: "White / Gray / Blue",
          stock: "Bulk Order Available"
        },
        {
          slug: "toyota-hilux",
          name: "Toyota Hilux",
          subtitle: "Reliable pickup model for Africa and Middle East distribution",
          year: "2024",
          engine: "2.7L / 2.8T",
          fuel: "Gasoline / Diesel",
          drive: "4WD / RWD",
          transmission: "6AT / 6MT",
          color: "White / Silver / Black",
          stock: "In Stock / Ready for Shipment"
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
          slug: "byd-song-plus",
          name: "BYD Song Plus",
          subtitle: "Popular new energy SUV for high-volume overseas demand",
          year: "2025",
          engine: "EV / DM-i",
          fuel: "Electric / Plug-in Hybrid",
          drive: "FWD",
          transmission: "Single-Speed / E-CVT",
          color: "White / Gray / Blue",
          stock: "In Stock / Ready for Shipment"
        },
        {
          slug: "geely-monjaro",
          name: "Geely Monjaro",
          subtitle: "Premium Chinese SUV with export-friendly configuration range",
          year: "2025",
          engine: "2.0T",
          fuel: "Gasoline",
          drive: "AWD / FWD",
          transmission: "8AT",
          color: "Black / Silver / Green",
          stock: "Bulk Order Available"
        },
        {
          slug: "chery-tiggo-8-pro",
          name: "Chery Tiggo 8 Pro",
          subtitle: "Family SUV for dealership supply and regional wholesale",
          year: "2025",
          engine: "1.6T / 2.0T",
          fuel: "Gasoline",
          drive: "FWD",
          transmission: "7DCT",
          color: "White / Black / Gray",
          stock: "In Stock / Ready for Shipment"
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
        {
          slug: "compact-suv-skd-kit",
          name: "Compact SUV SKD Kit",
          subtitle: "Assembly-ready compact SUV package for local plant integration",
          year: "2025",
          engine: "1.5T / EV",
          fuel: "Gasoline / Electric",
          drive: "FWD",
          transmission: "CVT / DCT / Single-Speed",
          color: "Paint plan on request",
          stock: "Production Slot Available"
        },
        {
          slug: "pickup-skd-kit",
          name: "Pickup Truck SKD Kit",
          subtitle: "Utility pickup kit with body, chassis and assembly support files",
          year: "2025",
          engine: "2.0T / 2.4L",
          fuel: "Gasoline / Diesel",
          drive: "4WD / RWD",
          transmission: "6MT / 8AT",
          color: "Paint plan on request",
          stock: "Order Available"
        },
        {
          slug: "city-ev-skd-kit",
          name: "City EV SKD Kit",
          subtitle: "Urban electric car kit for clean mobility assembly programs",
          year: "2025",
          engine: "EV Motor",
          fuel: "Electric",
          drive: "FWD",
          transmission: "Single-Speed",
          color: "Paint plan on request",
          stock: "Production Slot Available"
        }
      ]
    },
    "auto-spare-parts": {
      slug: "auto-spare-parts",
      title: "Auto Spare Parts",
      shortTitle: "Auto Spare Parts",
      type: "Export-ready auto spare part",
      page: "auto-spare-parts.html",
      intro: "Wholesale spare parts supply for service networks, workshops, rebuild channels and mixed-container export programs.",
      products: [
        {
          slug: "engine-maintenance-kit",
          name: "Engine Maintenance Kit",
          subtitle: "Filters, belts and service parts for scheduled workshop supply",
          year: "Latest Production",
          engine: "Multi-platform",
          fuel: "Gasoline / Diesel",
          drive: "Applicable by model",
          transmission: "Applicable by model",
          color: "Standard packaging",
          stock: "In Stock / Ready for Shipment"
        },
        {
          slug: "brake-system-parts",
          name: "Brake System Parts",
          subtitle: "Pads, discs and related brake components for volume buyers",
          year: "Latest Production",
          engine: "Multi-platform",
          fuel: "Universal",
          drive: "Applicable by model",
          transmission: "Applicable by model",
          color: "Standard packaging",
          stock: "Bulk Order Available"
        },
        {
          slug: "suspension-parts-set",
          name: "Suspension Parts Set",
          subtitle: "Shock absorbers, arms and bushings for repair distribution",
          year: "Latest Production",
          engine: "Multi-platform",
          fuel: "Universal",
          drive: "Applicable by model",
          transmission: "Applicable by model",
          color: "Standard packaging",
          stock: "In Stock / Ready for Shipment"
        }
      ]
    }
  };

  const categoryList = [
    categoryMap["luxury-vehicle"],
    categoryMap["suv-pickup"],
    categoryMap["chinese-brand-new-cars"],
    categoryMap["skd-car-kits"],
    categoryMap["auto-spare-parts"]
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
      "skd-car-kits": "crop-mid-right",
      "auto-spare-parts": "crop-right"
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
        return [
          '<article class="list-card">',
          '<img class="' + (product.image ? 'product-img' : product.imageClass) + '" src="' + (product.image || 'assets/category-composite.png') + '" alt="' + product.name + '">',
          '<div class="list-card-body">',
          '<p class="list-card-meta">' + category.shortTitle + '</p>',
          '<h3><a class="card-title-link" href="product.html?category=' + category.slug + '&item=' + product.slug + '">' + product.name + '</a></h3>',
          '<p>' + product.subtitle + '</p>',
          '<div class="list-card-specs">',
          '<span>' + product.year + '</span>',
          '<span>' + product.fuel + '</span>',
          '<span>' + product.transmission + '</span>',
          '</div>',
          '<a class="card-action-link" href="product.html?category=' + category.slug + '&item=' + product.slug + '">VIEW DETAILS | SEND INQUIRY</a>',
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
        heroImage.className = 'product-img';
        heroImage.src = product.image;
      } else {
        heroImage.className = product.imageClass;
      }
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
      const href = "mailto:melodyzhang0716@gmail.com?subject=" +
        encodeURIComponent(subject) +
        "&body=" +
        encodeURIComponent(lines.join("\n"));
      window.location.href = href;
    });
  });
})();
