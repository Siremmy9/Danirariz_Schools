# Danirariz Schools: Website Template

A premium, responsive school website built with plain HTML5, CSS3 and vanilla JavaScript (no frameworks, no backend), plus a demo admin dashboard that stores data in the browser (localStorage).

## 1. Folder structure
```
index.html  about.html  schools.html  academics.html  admissions.html
fees.html   facilities.html  gallery.html  news.html  contact.html
admin/      login.html dashboard.html admissions.html students.html staff.html
            fees.html news.html gallery.html facilities.html academics.html
            testimonials.html messages.html activities.html settings.html
css/        style.css  responsive.css  admin.css
js/         config.js  storage.js  main.js  admissions.js  fees.js  gallery.js  admin.js
assets/     images/  videos/  icons/  logo/
```
Staff and Our Schools appear on About (`about.html#team`) and `schools.html`; Testimonials appear on Home and About.

## 2. Setup
Open `index.html` in a browser, or serve the folder (e.g. `npx serve` or `python3 -m http.server`) and visit `http://localhost:8000`. No build step. Upload the whole folder to any static host (Netlify, cPanel, GitHub Pages) to go live.

## 3. Replace the logo
Replace `assets/logo/logo.svg` with the school logo (keep the name), or change `logo` in `js/config.js`. You can also upload it in Admin > Settings. Replace `assets/icons/favicon.svg` for the browser tab icon.

## 4. Replace the hero video
Put your MP4 at `assets/videos/school-hero.mp4` (H.264, 720p/1080p, 10-20s, no audio, under ~8 MB). The included file is a tiny placeholder. If the video is missing the hero shows the poster image (`heroPoster` in `js/config.js`).

## 5. Configure WhatsApp
In `js/config.js` set `whatsapp` to digits only, e.g. `2348012345678` (234 + number without the leading 0). While it still contains `X`, buttons open WhatsApp without a number. Edit `whatsappMessage` for the pre-filled text.

## 6. Configure Google Maps
Google Maps > search the school > Share > Embed a map > copy the `src="..."` URL. Paste it into `mapUrl` in `js/config.js` (or Admin > Settings > Google Maps). Look for the `PASTE GOOGLE MAP EMBED URL HERE` comment. No coordinates are invented. "Get Directions" searches the address.

## 7. Change school information
Everything lives in ONE place: `js/config.js` (name, tagline, address, phone, email, WhatsApp, social links, colours, sections/classes, values, about text, stats). The admin Settings page overrides these in the browser. Also update the static SEO bits per page: `<title>`, meta description, canonical URL (`YOUR-DOMAIN.com`), Open Graph image, and the JSON-LD block in `index.html`.

## 8. Using the admin dashboard
Go to `admin/login.html`. Demo account: **admin / admin123**.
- Dashboard: totals, charts, recent activity
- Admissions: change status (Pending, Reviewed, Contacted, Approved, Rejected)
- Staff, News, Gallery, Facilities, Academics, Testimonials, Students: add, edit, delete (news can be published/unpublished)
- School Fees: edit amounts and bank details; the public Fees page updates immediately
- Messages: mark Read / Unread / Replied
- Activities: log of changes
- Settings: school details, logo, colours, stats, backup/export, reset demo data

**Important:** the login is DEMO ONLY (see the comment at the top of `js/admin.js`) and data lives only in each visitor's own browser. Before going live, replace `Auth` and the `Store` functions with a real backend/API. Public form submissions only reach the admin on the same browser until then.

## 9. Customise for another school
1. Duplicate the folder. 2. Edit `js/config.js`. 3. Replace logo, hero video and images. 4. Update the SEO/JSON-LD in the HTML. 5. Open the admin to replace sample staff, news, fees and gallery items (sample data is clearly marked; use Settings > Reset to clear).

## Notes
- Sample figures (statistics, hours, age ranges, placeholder staff names) are placeholders: replace them.
- Placeholder images are generated; add real photos via the admin or `config.js` image paths.
- Respects `prefers-reduced-motion` (video and animations are reduced).
