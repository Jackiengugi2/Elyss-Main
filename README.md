# Elyss School — Parent Landing Page

A single-page, parent-facing landing page for **Elyss School**, Kikuyu Road, Thogoto,
Kikuyu, Kiambu County. Its job is to give a parent everything they need to decide to
visit — and to make contacting a real person the easiest thing on the page.

Static HTML/CSS/JS. No build step, no dependencies, no framework.

```
index.html
assets/
  css/styles.css
  js/main.js
  img/            ← drop real photos here
```

Open `index.html` in a browser, or serve locally:

```bash
python3 -m http.server 8080    # then visit http://localhost:8080
```

---

## Where the content came from

| Source document | What it supplied |
|---|---|
| `Elyss_School_-_International_Campus_E-Pamphlet.html` | Visual system: Deep Navy `#0F2C59`, Soft Gold `#D4AF37`, Teal `#00A896`, ink `#2B2D42`, paper `#F8F9FA`; the four-step admissions flow; section structure |
| `Elyss_FAQs.docx` | Contact details, the priority FAQs and their approved answers, verbatim |
| `Elyss_Keyword_Automations.docx` | Transport/NTSA wording, location and maps pin, socials, keyword-aligned copy |
| `Elyss_School_October_2026_Content_Calendar.xlsx` | Campus split (Thogoto / Lusigetti), Abacus, Creative Art, JSS transition, Open Day, and the brand voice |
| `Inquiry_Follow-Up_and_Tracking_Guide.docx` | The inquiry form fields — they map 1:1 onto the Inquiry Tracker columns |

### ⚠️ Important note on the e-pamphlet

The e-pamphlet describes a generic international school with **placeholder details that
are not Elyss's**: a US phone number (`+1 (555) 019-2831`), a `.edu` domain, an
Olympic-size pool, a Duke of Edinburgh scheme, and a "98% first-choice university
placement rate."

**None of that was used on this page.** Every fact, figure and contact detail here
comes from the three working documents, which describe the real school: a Christian
CBE learning centre, Playgroup–Grade 6 plus Junior School, phone `0711 650 405`.
Only the colour palette, type hierarchy and layout logic were carried across.

---

## Verified details used on the page

- **Phone / WhatsApp:** 0711 650 405 (`tel:+254711650405`, `wa.me/254711650405`)
- **Email:** info@elyssschool.co.ke
- **Location:** Kikuyu Road, Thogoto, Kikuyu, Kiambu County
- **Maps pin:** https://maps.app.goo.gl/hpA1GRRHoaXCGrRq8?g_st=aw
- **Facebook:** https://www.facebook.com/elyss.school
- **Instagram:** https://www.instagram.com/elyss.school
- **Campuses:** Thogoto (Main — Kindergarten, Primary, JSS) · Lusigetti (International — Kindergarten, Open Day)
- **Curriculum:** Kenya CBE/CBC, Playgroup to Grade 6, plus JSS Grades 7–9 at Thogoto
- **Transport:** NTSA-approved vehicles, certified drivers, route-based planning

---

## ✅ Confirm with the school before publishing

These are the gaps the source documents themselves left blank or flagged. Nothing was
invented to fill them — each is either omitted from the page or marked in the HTML.

1. **Open Day dates.** The announcement bar shows *19–30 October 2026*. The planning
   sheet calls this a **recommendation built around the national exam calendar**, not a
   committed date. Confirm, change, or delete the bar (`<div class="announce">` in
   `index.html`). Note it also proposes closing Tue 20 Oct (Mashujaa Day).
2. **Campus naming.** The calendar flags an assumption: Thogoto = "Main Campus",
   Lusigetti = "International Campus". Confirm this isn't reversed.
3. **Lusigetti street address / map pin.** Not in any document. The Lusigetti card
   currently links to the inquiry form instead of Maps.
4. **Fee structure, M-Pesa Paybill/Till, office hours, next intake dates.** All blank in
   the source docs. The page deliberately follows the school's own approved line —
   *"share your child's age or class and we'll send a clear breakdown"* — rather than
   publishing numbers. Fee figures should stay off the page anyway while running Meta
   ads, per the ad-approval note in the CTA & Funnel Guide.
5. **Grades currently admitting.** The docs say "Playgroup to Grade 6 per current site
   listing — confirm active classes/intake", while the content calendar markets JSS. The
   page presents both; confirm which classes have live intake.
6. **Second phone line** — blank in the docs, so only one number appears.
7. **Photos.** Three slots are marked in the HTML (`PHOTO SLOT 1/2/3`). They render as
   styled placeholders naming the shot needed. Replace each `<figure class="photo">`
   with a real `<img>` — see below.

---

## Replacing the photo placeholders

```html
<!-- before -->
<figure class="photo photo--hero" data-photo="Hero photo — learners in a Thogoto classroom">
  <figcaption>Learners at work, Thogoto Campus</figcaption>
</figure>

<!-- after -->
<figure class="photo photo--hero">
  <img src="assets/img/thogoto-classroom.jpg" alt="Elyss learners working together in a Thogoto classroom">
</figure>
```

Add `.photo img { width:100%; height:100%; object-fit:cover; }` when you do, and drop
the `data-photo` attribute so the placeholder label disappears. Also point
`og:image` in `<head>` at a real photo (1200×630) for link previews.

Photo/video consent from families is on the Open Day preparation checklist — worth
settling before any Open Day images go up.

---

## The inquiry form

By default the form has **no backend**. On submit it validates, then opens WhatsApp
pre-filled with the parent's details addressed to 0711 650 405 — which matches how the
school already works, since WhatsApp Business is the primary FAQ channel.

Fields map directly onto the Inquiry Tracker columns from the Follow-Up Guide, including
the two additions that guide recommends adding to every tracker:

| Form field | Tracker column |
|---|---|
| Your name | Name |
| Phone / WhatsApp, Email | Email / Phone |
| Child's age or current class | Grade Level |
| Campus of interest | *(new — campus preference, per the CTA & Funnel Guide)* |
| Preferred start | Preferred Start |
| Transport needed | Fees Notes / transport route |
| — | **Source** = this landing page *(recommended addition)* |
| — | **Date Logged** = submission date *(recommended addition)* |

### Capturing leads directly instead

Set `data-endpoint` on the form and it POSTs JSON instead of opening WhatsApp:

```html
<form class="form" id="inquiryForm" data-endpoint="https://formspree.io/f/XXXXXXX" novalidate>
```

Works with Formspree, Netlify Forms (via a function), Google Apps Script, or any
endpoint accepting `application/json`. On failure it falls back to telling the parent to
call 0711 650 405 — a parent is never left without a way to reach a real person, per the
FAQ brief.

**Per-stage follow-up still applies:** log same-day, contact within 24 hours, share the
tracker update back within 24–48 hours (Follow-Up Guide, Steps 1–3).

---

## Built-in behaviour

- Sticky header, mobile menu, and a permanent Call / WhatsApp bar on small screens
- FAQ accordion (one panel open at a time, full keyboard and screen-reader support)
- Client-side validation including Kenyan mobile format (`07XX`, `01XX`, `+254…`)
- Honeypot field against bot submissions
- Scroll-reveal animations, disabled under `prefers-reduced-motion`
- Semantic landmarks, skip link, visible focus rings, `aria-live` form status
- Print stylesheet — the page prints cleanly as a handout
- Every section routes back to 0711 650 405

## Keyword alignment

Section IDs and copy are aligned with the Meta keyword automations so an ad, an
auto-reply and this page use the same language: `#admissions` (admission, intake, join,
enrol), `#transport` (transport, bus, van, pickup), `#learning` (CBC, CBE, curriculum,
abacus, creative art), `#faq` (fees, bei, how much), `#inquire` (visit, tour,
appointment), `#campuses` (location, directions, Thogoto, Lusigetti).

---

Prepared for Elyss School by ElyonEdge Marketing & Sales.
