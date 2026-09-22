# AGC Website: Go-Live Guide for Abdul

**For:** Abdul  |  **Client:** American General Contractor LLC (Daniel A. Bettran)  |  **Domain:** AmericanBuildNJ.com  |  **Built by:** VYNTEX, LLC

This is everything needed to take the website from the zip file to live, in order. Do the steps in sequence. The one part that needs the most care is **Step 6: making sure estimate appointments reach Daniel's Google Calendar**.


## What you are receiving

- **agc-website-react.zip**: the complete website project (React + Vite). This is the ONLY file you deploy.
- **agc-full-site-demo.html**: a show-and-tell demo for the client. Never deploy this one. Its forms do not send email.

How the site works, in one paragraph: it is a static React site hosted on Vercel. There is no database. The Free Estimate form sends an email through a service called FormSubmit to **info@americanbuildnj.com** with a copy to **daniel.bettran@gmail.com**. Google reviews come through one small Vercel function. Everything you would normally edit (phone, email, social links, photos, services text) lives in a few files inside **src/config/**.


## Step 0. Before you start

- [ ] The mailbox **info@americanbuildnj.com** exists and you (or Daniel) can open it. The form cannot be activated without it.
- [ ] You know which Google account Daniel uses for his calendar (his Google Workspace account or daniel.bettran@gmail.com). Ask him. You need this for Step 6.
- [ ] Installed on your computer: **Node.js 22 LTS** (nodejs.org), **Git**, **VS Code**.
- [ ] Accounts: **GitHub** and **Vercel** (sign in to Vercel with the GitHub account).
- [ ] Access to wherever the domain AmericanBuildNJ.com is registered (for DNS in Step 7).


## Step 1. Run the site on your computer

1. Unzip **agc-website-react.zip** somewhere simple, for example D:\agc-website.
2. Open that folder in VS Code. Open the terminal (Terminal > New Terminal).
3. Run the two commands below. The site opens at http://localhost:5173

```bash
npm install
npm run dev
```

> **Note:** On your computer the reviews section will say "Customer reviews are on the way" and that is normal. Reviews only load on Vercel. Do NOT submit the estimate form from localhost yet; wait for Step 5 so FormSubmit is activated from the real address.


## Step 2. Put the code on GitHub

1. On github.com create a **new, empty, private** repository, for example **agc-website**. Do not add a README or .gitignore (the project already has them).
2. In the VS Code terminal, run the commands below. Replace ACCOUNT with the GitHub account name.

```bash
git init
git add .
git commit -m "AGC website"
git branch -M main
git remote add origin https://github.com/ACCOUNT/agc-website.git
git push -u origin main
```


## Step 3. Deploy on Vercel (test address first)

1. vercel.com > **Add New > Project** > import the **agc-website** repo.
2. Vercel detects **Vite** automatically. Do not change any build settings. Click **Deploy**.
3. When it finishes you get a free test address like **agc-website.vercel.app**. Open it on your computer and on your phone.

> **IMPORTANT:** Stop here. Do NOT connect the real domain yet. Finish Steps 4, 5 and 6 on the test address first.


## Step 4. Look everything over on the test address

- [ ] Logo is large in the header and hero. Menu shows: Home, Services, About, Contact Us.
- [ ] The red Free Estimate buttons pulse/glow. On a phone, the CALL / FREE ESTIMATE bar sits at the bottom.
- [ ] Services menu opens all 9 service pages. A service page's estimate button opens the form with that project type already selected.
- [ ] Contact Us page shows the contact cards, the South Jersey section and the Google map.
- [ ] Old addresses redirect: /service-area goes to /contact, and /book goes to /request-estimate.


## Step 5. Activate the estimate form (FormSubmit). Required

FormSubmit will not deliver anything until the receiving address confirms it once.

1. On the **Vercel test address**, fill out the Free Estimate form completely. Use your own name, phone and email as the customer. Attach one photo. **In step 7 of the form, pick an appointment date and a time window** (you need this for Step 6).
2. Submit. You stay on the site and see a confirmation with a ticket number (FormSubmit's own page never appears).
3. Open the inbox of **info@americanbuildnj.com**. Find the email from FormSubmit titled **Activate Form** and click the activation button. Check spam if you do not see it.
4. Go back to the site and submit a **second** test the same way. This one is the real test.

**The second test passes if all of these are true:**

- [ ] The email arrives at **info@americanbuildnj.com**.
- [ ] The subject starts with a ticket number in brackets, e.g. [AGC-260921-K7M2], and the same number is the first row of the email and appears on the thank-you page.
- [ ] A copy arrives at **daniel.bettran@gmail.com**.
- [ ] The subject starts with: New estimate request + APPOINTMENT REQUEST
- [ ] The email shows every field in a table, and the photo is attached.
- [ ] Near the bottom there is a row **ACCEPT: add to Google Calendar** with a long link.
- [ ] Pressing Reply on the email addresses the reply to the customer, not to FormSubmit.


## Step 6. IMPORTANT: appointments must reach Daniel's Google Calendar

Daysi's reminder: **when a customer chooses an estimate date on the website, it has to end up on Daniel's Google (Gmail) Calendar.** Here is exactly how that works, so you can set it up and explain it to Daniel.


### How it works

- The customer picks a preferred date and time window in step 7 of the estimate form. That is a **request**. The confirmation screen tells them so. Daniel asked that nothing be confirmed until he accepts it.
- The request arrives by email with the **ACCEPT: add to Google Calendar** link.
- When Daniel taps that link, Google Calendar opens with the appointment already filled in: title, date, a one-hour time inside the requested window, the project address as the location, the customer's phone and project notes, and **the customer already added as a guest**.
- Daniel adjusts the exact time if needed and taps **Save**. Google asks whether to send invitations. He chooses **Send**.
- Result: the appointment is now on Daniel's calendar, and the customer receives Google's invitation email, which is their confirmation. Google also handles the reminders.
- To decline or suggest another time, Daniel just replies to the request email. The reply goes to the customer.

> **IMPORTANT:** The appointment does NOT appear on the calendar by itself. It appears when Daniel taps the link and saves. That is on purpose, so customers cannot lock in times he cannot make. Make sure Daniel understands this, otherwise requests will sit in his inbox.


### What you need to set up

1. Confirm with Daniel which Google account holds his work calendar (Workspace account or daniel.bettran@gmail.com).
2. On **Daniel's phone**: install the **Google Calendar** app and the **Gmail** app, signed in to that account. If he has several Google accounts on the phone, make the work one the default in the browser too (sign out of the others in Safari/Chrome, or sign in to the work one first).
3. Make sure both inboxes that receive requests are on his phone: **info@americanbuildnj.com** and **daniel.bettran@gmail.com**, with notifications ON, so he sees requests right away.
4. Use the second test email from Step 5. **On Daniel's phone**, open it and tap the ACCEPT link.
5. Check that the event opens pre-filled under the **correct account and calendar**, then Save and Send.
6. Confirm the event is on his calendar and that your test customer email received the Google invitation.
7. Delete the test event afterwards.

**If the link behaves badly on the phone** (opens the wrong account, or a cut-down mobile page that will not save): open the same email on a computer signed in to Daniel's account and click the link there. It always works on desktop. On iPhone you can also try long-press > Open in Chrome, or request the desktop site. Tell Daysi what happened so the link can be adjusted.


### Show Daniel the routine (2 minutes)

1. New email arrives: "New estimate request + APPOINTMENT REQUEST".
2. Read the project details and look at the photos.
3. Scroll to the bottom, tap **ACCEPT: add to Google Calendar**.
4. Fix the exact time, tap **Save**, choose **Send** invitations.
5. Cannot make it? Tap Reply and offer another time.

> **Note:** Optional later upgrade: if Daniel wants every request to land on his calendar automatically as a TENTATIVE event before he accepts, that can be done with a Zapier automation (Gmail: new email with subject containing APPOINTMENT REQUEST > Google Calendar: create event). Not needed for launch. Ask Daysi first.


## Step 7. Connect the real domain

1. Vercel > the project > **Settings > Domains**. Add **americanbuildnj.com** and **www.americanbuildnj.com**.
2. Vercel shows the DNS records to create (usually an A record for the root and a CNAME for www). Add them where the domain is registered.
3. **Do not delete the MX records.** Those run the info@ email. Only add or change the records Vercel lists.
4. Wait for Vercel to show the domain as valid (minutes to a few hours). HTTPS is automatic.
5. Open https://americanbuildnj.com and submit one more estimate test from the real domain. If FormSubmit sends another Activate email, click it again.


## Step 8. Fill in the remaining content

Each of these is a small edit in one file, then commit and push (Step 10). None of them block the launch.


### Social media links: src/config/business.js

Facebook, Instagram and the Google Business Profile link are already filled in. Add TikTok or YouTube in the **social** block if Daniel opens them. Icons appear automatically in the top bar, the footer and the Contact Us page.


### Photos: src/config/images.js

Daniel's portrait is already in place (public/team/daniel-bettran.jpg). Service-card photos are optional:

1. Put image files in **public/projects/**. Landscape JPG or WebP, about 1600 px wide, under 500 KB each if possible.
2. In images.js set **src** to the path, for example "/projects/kitchen-01.jpg", and write a short **alt** description.
3. The placeholder tiles disappear on their own.


### Daniel's bio: src/pages/About.jsx

Add his approved paragraphs to the **ownerBio** list near the top of the file. Do not invent a biography, years in business, awards or guarantees.


### Google Business Profile, map and reviews

1. Make sure **American General Contractor LLC** has a verified Google Business Profile with the website set to https://americanbuildnj.com. This is the single biggest factor for showing up in local Google searches.
2. **Map:** Google Maps > the AGC listing > Share > Embed a map > copy only the link inside src="..." and paste it into **mapEmbedUrl** in business.js.
3. **Review button:** Business Profile > Ask for reviews > copy the link into **googleReviewUrl** in business.js.
4. **Place ID:** open the Google share link from business.js in a browser to see the listing, then look the business up in Google's Place ID Finder (developers.google.com/maps/documentation/places/web-service/place-id). Paste the ID (starts with ChIJ) into **googlePlaceId** in business.js. This switches the review button to a direct "Write a review" link.
5. **Live reviews on the site:** Google Cloud Console > new project > enable **Places API (New)** > create an API key and restrict it to Places API.
6. Vercel > Settings > **Environment Variables** > add **GOOGLE_PLACES_API_KEY** and **GOOGLE_PLACE_ID** > Redeploy.

> **Note:** Google only returns up to 5 reviews (the ones it ranks most relevant). The site shows 4 and 5 star reviews with text, plus the true overall rating and count. It refreshes once a day.

> **IMPORTANT:** Never put the Google API key in the code, in GitHub, in an email or in a chat. It goes only in Vercel's Environment Variables.


## Step 9. Search engines

1. **Google Search Console** (search.google.com/search-console): add americanbuildnj.com, verify it with the DNS TXT record, then Sitemaps > submit **https://americanbuildnj.com/sitemap.xml**
2. **Bing Webmaster Tools**: add the site and import from Search Console.
3. Nothing else to do in the code. Every page already has its own title, description and structured data, and the sitemap rebuilds itself on every deploy.


## Step 10. Making changes later

Edit the file in VS Code, save, then:

```bash
git add .
git commit -m "describe the change"
git push
```

Vercel redeploys automatically in about a minute. If Daysi sends an updated zip, copy the changed files over your folder (keep your **.git** folder), then commit and push.

**Where things live**

| To change | Edit this file |
|---|---|
| Phone, email, license, social links, map, review link | src/config/business.js |
| Where estimate emails go (leadEmail, leadCc) | src/config/business.js |
| Service pages: text, FAQs, page titles | src/config/services.js |
| Photos (service cards, owner) | src/config/images.js |
| Form choices: project types, budgets, time windows | src/config/estimate.js |
| Menu tabs | src/components/Header.jsx (nav) |
| Daniel's bio | src/pages/About.jsx (ownerBio) |
| Colors and fonts | top of src/styles.css (:root) |


## Troubleshooting

| Problem | Fix |
|---|---|
| No email after submitting the form | The Activate Form email was not clicked, or it went to spam. Check info@ inbox and spam, activate, test again. |
| Email arrives at info@ but not Daniel's Gmail | Check Gmail spam and mark Not spam. Confirm leadCc in business.js is spelled correctly. |
| Photos missing from the email | Total attachments are limited to 10 MB. The site shrinks photos automatically; very old phones may fail. Ask the customer to email them. |
| Spam submissions | In src/lib/formsubmit.js change _captcha from "false" to "true". Customers then pass a quick captcha. |
| Calendar link opens the wrong Google account | Sign in to the correct account first in that browser, or open the email on a computer signed in as Daniel. |
| Reviews not showing | Both Google variables must be in Vercel and the project redeployed. Check Vercel > Logs for /api/reviews. |
| A page shows 404 on refresh | vercel.json must be in the project root. Do not delete it. |
| Domain works but the site shows Not secure | Wait; Vercel issues the certificate once DNS finishes. Check Settings > Domains for errors. |


## Launch checklist

- [ ] info@americanbuildnj.com mailbox working
- [ ] Code pushed to GitHub
- [ ] Deployed on Vercel test address and reviewed on phone and computer
- [ ] FormSubmit activated; second test delivered to BOTH inboxes with photo
- [ ] Calendar ACCEPT link tested on Daniel's own phone, under the right Google account
- [ ] Daniel shown the 5-step routine
- [ ] Domain connected, MX records untouched, HTTPS valid
- [ ] Final test submitted from americanbuildnj.com
- [ ] Sitemap submitted in Google Search Console
- [ ] Told Daysi what is still missing: Google Place ID, map embed link, Daniel's bio

Questions about the code or changes: send them to Daysi and she will get an updated project file.
