# Sitemap & SEO Setup

## Overview
This project includes automatic sitemap generation to help search engines discover and index your content.

## Features

### 1. Static Sitemap (`public/sitemap.xml`)
- Contains all main static pages
- Located at: `/sitemap.xml`
- Update this file when adding new static pages

### 2. Dynamic Sitemap (Edge Function)
- Automatically includes all published blog posts
- Located at: `supabase/functions/generate-sitemap/index.ts`
- Access via: `your-domain.com/api/generate-sitemap`

### 3. Robots.txt (`public/robots.txt`)
- Configured to allow search engine crawlers
- Points to sitemap location
- Disallows portal and admin pages

## How to Use

### For Production
1. **Update your domain**: Replace `https://yourdomain.com` in:
   - `public/sitemap.xml`
   - `public/robots.txt`

2. **Submit to search engines**:
   - Google Search Console: https://search.google.com/search-console
   - Bing Webmaster Tools: https://www.bing.com/webmasters

3. **Verify sitemap**: Visit `your-domain.com/sitemap.xml`

### Automatic Updates
- Blog posts are automatically included when published
- The SitemapGenerator component monitors changes
- No manual updates needed for blog content

## SEO Best Practices Implemented

✅ Semantic HTML structure
✅ Meta descriptions on all pages
✅ Proper heading hierarchy (H1, H2, etc.)
✅ Alt text for all images
✅ Mobile-responsive design
✅ Fast page load times
✅ Clean, descriptive URLs
✅ Sitemap for search engines
✅ Robots.txt configuration

## Assignment Preview & Download

Students and teachers can now:
- Click on any assignment to preview it
- View PDF files directly in the browser
- Download assignments in their original format (PDF, Word, etc.)
- See assignment details including due dates and descriptions

The AssignmentViewer component automatically handles different file types:
- **PDFs**: Direct preview in iframe
- **Images**: Direct display
- **Word documents**: Download to view
- **Other formats**: Download button

## Need Help?

For any issues with SEO or sitemap generation, check:
1. Browser console for errors
2. Network tab for failed requests
3. Supabase edge function logs
