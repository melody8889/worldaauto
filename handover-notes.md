# Worlda Global Auto Static Site Handover Notes

## Site Type

This project is now a pure static website package for GitHub + Vercel deployment.

## Main Files

- `index.html`: homepage
- `luxury-vehicle.html`: category page
- `suv-pickup.html`: category page
- `chinese-brand-new-cars.html`: category page
- `skd-car-kits.html`: category page
- `auto-spare-parts.html`: category page
- `product.html`: unified product detail page
- `privacy.html`: privacy policy page
- `styles.css`: global styles
- `script.js`: category/product data and interactions
- `robots.txt`: crawler rules
- `sitemap.xml`: sitemap
- `vercel.json`: Vercel static deployment config

## Deployment Target

- Code repository: GitHub
- Hosting: Vercel
- Deployment mode: static site, no WordPress backend

## Current Form Behavior

Inquiry forms currently open the visitor's email client and prepare a message to:

- `sales01@worldaauto.com`

For a production form workflow, replace this with a server-side form service or email API later.

## Recommended Next Steps

1. Initialize or connect this folder to a GitHub repository.
2. Push the project code to GitHub.
3. Import the GitHub repository into Vercel.
4. Set the production domain in Vercel after deployment succeeds.
5. Update canonical URLs and sitemap URLs if the final production domain changes.

## Notes

- No WordPress admin, wp-admin account or CMS backend is included in this static version.
- Product category pages and product detail routing are handled by plain HTML + query parameters in `script.js`.
