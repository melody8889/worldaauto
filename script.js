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
    "auto-spare-parts": {
      slug: "auto-spare-parts",
      title: "Auto Spare Parts",
      shortTitle: "Auto Spare Parts",
      type: "Export-ready auto spare part",
      page: "auto-spare-parts.html",
      intro: "Wholesale spare parts supply for service networks, workshops, rebuild channels and mixed-container export programs.",
      products: [
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
      const href = "mailto:sales01@worldaauto.com?subject=" +
        encodeURIComponent(subject) +
        "&body=" +
        encodeURIComponent(lines.join("\n"));
      window.location.href = href;
    });
  });
})();



