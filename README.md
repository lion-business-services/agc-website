# American General Contractor LLC — Website

> **Abdul: start with `ABDUL-GO-LIVE-GUIDE.md` (also included as a PDF). It walks through every step in order.**

React + Vite. Hosted on Vercel. Estimate requests are emailed through FormSubmit. No database.
Built by VYNTEX, LLC.

## Run it on your computer
```bash
npm install
npm run dev        # opens at http://localhost:5173
```

## Put it online (GitHub → Vercel)
```bash
git init
git add .
git commit -m "AGC website"
git branch -M main
git remote add origin https://github.com/<account>/<new-repo>.git
git push -u origin main
```
1. vercel.com → **Add New → Project** → import the repo. Vercel detects Vite automatically. Click **Deploy**.
2. **Settings → Domains** → add `americanbuildnj.com` and `www.americanbuildnj.com`, then set the DNS records Vercel shows at the domain registrar.
3. After that, every `git push` updates the live site.

## Estimate form → email (FormSubmit)
- Requests go to **info@americanbuildnj.com** with a copy to **daniel.bettran@gmail.com**. Change either in `src/config/business.js` (`leadEmail`, `leadCc`).
- **One-time activation (required):** the first time the form is submitted on the live site, FormSubmit emails an **"Activate Form"** link to info@americanbuildnj.com. Click it. Nothing is delivered until that is done, so submit one test request yourself right after launch.
- After activating, FormSubmit gives you a random string to use instead of the email address in the form, which hides the address from spam bots. To use it, set `leadEmail` to that string.
- Photos are shrunk in the visitor's browser (a 6 MB phone photo becomes about 300 KB) because FormSubmit allows 10 MB of attachments per email. Up to 6 current + 6 inspiration photos.
- Spam: a hidden honeypot field is on. If spam gets through, open `src/lib/submitEstimate.js` and change `_captcha` from `"false"` to `"true"` to add FormSubmit's captcha step.
- After sending, visitors land on `/thank-you`.

## Appointment requests (inside the Free Estimate form)
There is no separate booking page. Step 7 of the estimate form lets the customer request a visit date and time window. Nothing is confirmed until Daniel accepts it.

1. The customer gets an automatic email right away: request received, appointment time NOT confirmed yet.
2. AGC (info@ + Daniel) gets the estimate email. If a date was requested, the subject says **+ APPOINTMENT REQUEST** and the bottom of the email has an **ACCEPT: add to Google Calendar** link.
3. **To accept:** Daniel clicks that link. His Google Workspace calendar opens with the visit pre-filled (customer, phone, address, project, requested window) and the customer added as a guest. He sets the exact time, clicks **Save → Send invitation**. Google emails the customer the invite, which is their confirmation, and handles reminders.
4. **To decline or propose another time:** reply to the email; the reply goes straight to the customer.

Tip: Daniel should be signed in to the Workspace Google account on his phone so the link opens the business calendar.

## Google Map
Shown on the home page and the combined Contact & Service Area page. It starts as a South Jersey overview (no street address is published). Once the Google Business Profile exists: Google Maps → AGC listing → **Share → Embed a map** → copy only the `src="..."` link into `mapEmbedUrl` in `src/config/business.js`. The map will then show the AGC pin with its star rating.

## Social media
Paste the full profile links into `social` in `src/config/business.js` (Facebook, Instagram, TikTok, YouTube, Google). Icons appear in the top bar, footer and Contact page, and the links are added to the site's Google business data (`sameAs`). Blank ones stay hidden. `googleReviewUrl` adds a "Leave us a Google review" button.

## SEO (built in)
- Every page has its own title, description and canonical link. After each build, `scripts/seo-pages.mjs` writes a real HTML file per page with those tags plus structured data (GeneralContractor, Service, FAQ, Breadcrumb), so Google, Facebook and iMessage previews are correct for every URL. It also rebuilds `sitemap.xml`. You never run it by hand.
- After launch: add the site in **Google Search Console**, verify the domain, and submit `https://americanbuildnj.com/sitemap.xml`. Do the same in **Bing Webmaster Tools**.
- The single biggest local-SEO factor is a verified, complete **Google Business Profile** (categories, service area, photos, hours) with the website link pointing here. That also powers the map pin and the reviews.

## Estimate ticket numbers
Every estimate request gets a ticket like **AGC-260921-K7M2** (AGC, date as YYMMDD, 4 random letters/numbers). It appears in the email subject in brackets, as the first row of the email, in the customer's automatic reply, on the thank-you page, and in the calendar event title. Search the info@ inbox for the ticket to pull up the case. Change the prefix in `src/lib/formsubmit.js` (`makeTicket`).

## Google reviews
`api/reviews.js` is a small Vercel function that fetches AGC's Google rating and reviews and keeps the API key private. Until it is set up, the site shows "Customer reviews are on the way."
1. Claim/verify the Google Business Profile for American General Contractor LLC.
2. Google Cloud Console → create a project → enable **Places API (New)** → create an API key (restrict it to Places API).
3. Find AGC's **Place ID** with Google's Place ID Finder.
4. Vercel → Project → **Settings → Environment Variables** → add `GOOGLE_PLACES_API_KEY` and `GOOGLE_PLACE_ID` → redeploy.

Google returns at most 5 reviews (the ones it ranks most relevant). Only 4- and 5-star reviews with text are displayed; the overall rating and total count are shown as Google reports them. Results refresh daily.
Note: `/api/reviews` runs on Vercel, not under `npm run dev`. Locally you will see the empty state; that is normal.

## Editing content (no coding needed beyond these files)
| To change…                               | Edit                          |
| ---------------------------------------- | ----------------------------- |
| Phone, email, license, social links      | `src/config/business.js`      |
| Service pages: text, FAQs, SEO titles    | `src/config/services.js`      |
| **Photos** (service cards, owner)        | `src/config/images.js`        |
| Form choices (budgets, timelines, etc.)  | `src/config/estimate.js`      |
| Menu tabs                                | `src/components/Header.jsx` → `nav` |
| Daniel's bio                             | `src/pages/About.jsx` → `ownerBio` |
| Colors and fonts                         | top of `src/styles.css` (`:root`) |

### Adding photos
1. Drop the file into `public/projects/` (JPG or WebP, landscape, about 1600px wide).
2. In `src/config/images.js` set `src: "/projects/your-file.jpg"` and write a short `alt` description.
3. Save, commit, push. Placeholders disappear on their own.

Stock photos are fine for the service cards.

## Still needed before launch
- [ ] Domain DNS pointed at Vercel
- [ ] info@americanbuildnj.com mailbox live, then **activate FormSubmit** with a test submission
- [ ] Service card photos + Daniel's bio (his photo is already in)
- [ ] Google Business Profile + the two Google env vars (reviews)
- [x] Facebook, Instagram and Google Business Profile links (done, in `business.js`)
- [ ] Google **Place ID** → `googlePlaceId` in `business.js` AND `GOOGLE_PLACE_ID` in Vercel (turns on the direct review link + live reviews). Google Maps embed link → `mapEmbedUrl`.
- [ ] Daniel signed in to the Workspace Google account on his phone (for the one-click appointment accept link)
- [ ] Privacy policy reviewed by AGC
- [ ] Submit `https://americanbuildnj.com/sitemap.xml` in Google Search Console
- [ ] Optional: Google Tag Manager snippet in `index.html` (events are already wired in `src/lib/analytics.js`)

## Shareable one-file demo
`npm run build:preview` builds the whole site into a single file at `dist-preview/index.html` (forms simulate sending, map and reviews are placeholders). Useful for showing the client. The real site never uses this mode.
