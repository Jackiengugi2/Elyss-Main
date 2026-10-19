# Elyss School — Parent Landing Page

A single-page, conversion-focused landing page for **Elyss School**, Kikuyu Road, Thogoto,
Kikuyu, Kiambu County. Built as a funnel, not a brochure: it answers the four questions a
parent actually has, then asks for one thing — a visit.

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

## Funnel structure

The page follows the Awareness → Consideration → Conversion model in the CTA & Funnel
Guide. Eight sections, ~580 words of visible copy, one repeated call to action.

| # | Section | Funnel stage | Job |
|---|---|---|---|
| 1 | Hero | Awareness | One promise, two buttons, a reassurance line |
| 2 | Trust bar | Awareness | Three facts that qualify the school in 5 seconds |
| 3 | What parents ask us first | **Consideration** | Kill the four objections: CBE, fees, transport, "can I see it?" |
| 4 | What your child gets | **Consideration** | Three benefits a parent notices at home |
| 5 | Come and see it for yourself | **Conversion** | The visit, framed as the low-risk next step |
| 6 | Three steps | **Conversion** | Remove "what happens next?" friction |
| 7 | Quick answers | Consideration | Four residual objections, collapsed |
| 8 | Book your visit | **Conversion** | Four-field form |

Every section routes back to **0711 650 405**. The sticky Call / WhatsApp bar is always
on screen on phones.

### Copy rules applied

- Short sentences, everyday words — written to be read on a phone, quickly.
- Questions phrased the way parents say them (*"Is it really CBE?"*, *"How much are the fees?"*).
- Benefits, not features: *"Your child learns to work out sums in their head"* rather than
  *"Abacus and mental maths programme."*
- Risk removed at every CTA: **free visit · no obligation · nothing to pay to enquire ·
  we reply the same day**.
- One primary action throughout: **book a visit**. Not "learn more", not "explore".

---

## Where the content came from

| Source document | What it supplied |
|---|---|
| `Elyss_School_-_International_Campus_E-Pamphlet.html` | Visual system: Deep Navy `#0F2C59`, Soft Gold `#D4AF37`, Teal `#00A896`, type hierarchy |
| `Elyss_FAQs.docx` | Contact details and the priority FAQ answers (simplified in tone, same substance) |
| `Elyss_Keyword_Automations.docx` | Transport/NTSA wording, location and maps pin, socials |
| `Elyss_School_October_2026_Content_Calendar.xlsx` | Funnel model and CTA guide, campus split, Abacus, practical work, Open Day |
| `Inquiry_Follow-Up_and_Tracking_Guide.docx` | Form fields, mapped onto the Inquiry Tracker |

### ⚠️ Important note on the e-pamphlet

The e-pamphlet describes a generic international school with **placeholder details that
are not Elyss's**: a US phone number (`+1 (555) 019-2831`), a `.edu` domain, an
Olympic-size pool, and a "98% first-choice university placement rate."

**None of that is on this page.** Every fact and contact comes from the three working
documents, which describe the real school: a Christian CBE learning centre,
Playgroup–Grade 6 plus Junior School, phone `0711 650 405`. Only the colour palette and
type hierarchy carried across.

---

## Verified details used on the page

- **Phone / WhatsApp:** 0711 650 405 (`tel:+254711650405`, `wa.me/254711650405`)
- **Email:** info@elyssschool.co.ke
- **Location:** Kikuyu Road, Thogoto, Kikuyu, Kiambu County
- **Maps pin:** https://maps.app.goo.gl/hpA1GRRHoaXCGrRq8?g_st=aw
- **Facebook:** https://www.facebook.com/elyss.school · **Instagram:** https://www.instagram.com/elyss.school
- **Campuses:** Thogoto · Lusigetti
- **Curriculum:** Kenya CBE, Playgroup to Grade 6, plus Junior School at Thogoto
- **Transport:** NTSA-approved vehicles, certified drivers, route-based planning

---

## ✅ Confirm with the school before publishing

Gaps the source documents themselves left blank or flagged. Nothing was invented to fill
them — each is either omitted from the page or marked in the HTML.

1. **Open Day date.** Confirmed: Saturday 14 November 2026. The bar links to the
   registration site; remove it (`<div class="announce">`) after the event.
2. **Campus naming.** The calendar flags an assumption that Thogoto is the main campus and
   Lusigetti the international one. Confirm it isn't reversed.
3. **Fees, M-Pesa, office hours, intake dates.** Blank in the source docs. The page uses
   the school's approved line — *"tell us the class and we'll send a clear breakdown"* —
   rather than publishing numbers. Keeping fee figures off the page also matches the
   Meta ad-approval note in the CTA & Funnel Guide.
4. **Which classes have live intake.** Docs say Playgroup–Grade 6; the calendar markets
   Junior School. The page presents both.
5. **Photos.** Two slots, marked `PHOTO SLOT 1/2` in the HTML, render as labelled
   placeholders. See below.

---

## Replacing the photo placeholders

```html
<!-- before -->
<figure class="photo photo--hero" data-photo="Photo — learners in class at Thogoto"></figure>

<!-- after -->
<figure class="photo photo--hero">
  <img src="assets/img/thogoto-class.jpg" alt="Elyss learners working together in class">
</figure>
```

Add `.photo img { width:100%; height:100%; object-fit:cover; }` and drop `data-photo` so
the placeholder label disappears. Also point `og:image` in `<head>` at a real photo
(1200×630) for WhatsApp and Facebook link previews — this matters when the page is shared
into parent groups.

Photo/video consent from families is on the Open Day preparation checklist — worth
settling before any images go up.

---

## The form — four fields on purpose

Every extra field costs conversions, so the form asks only what the team needs to make
the first call:

| Field | Tracker column |
|---|---|
| Your name | Name |
| Phone or WhatsApp number | Email / Phone |
| Your child's age or class | Grade Level |
| Which campus? | *(campus preference, per the CTA & Funnel Guide)* |
| — | **Source** = this landing page *(recommended addition)* |
| — | **Date Logged** = submission date *(recommended addition)* |

Email, preferred start, transport and free-text message were dropped from the form —
they're better asked on the follow-up call, where an admissions person is already talking
to the parent.

With no backend, submitting validates the fields then opens WhatsApp pre-filled to
0711 650 405 — matching how the school already works, since WhatsApp Business is the
primary channel.

### Capturing leads directly instead

```html
<form class="form" id="inquiryForm" data-endpoint="https://formspree.io/f/XXXXXXX" novalidate>
```

Works with Formspree, Netlify Forms, Google Apps Script, or any endpoint accepting
`application/json`. On failure it tells the parent to call 0711 650 405 — a parent is
never left without a way to reach a real person.

**Follow-up still applies:** log same-day, contact within 24 hours, share the tracker
update back within 24–48 hours (Follow-Up Guide, Steps 1–3).

---

## Netlify deploy & Mashujaa Day

- `netlify.toml` publishes the repo root with no build step. The form is a Netlify form
  (`elyss-enquiry`): enable **Forms → form detection** and redeploy so Netlify registers it.
  Each enquiry is stored in Netlify, then the parent is offered a WhatsApp link; if Netlify
  can't be reached they get the pre-filled WhatsApp link instead.
- A seasonal **Mashujaa Day** section sits under the trust bar (artwork and logo from the
  school's poster, in `assets/img/`). Delete it after October.
- The Open Day bar reads **Saturday 14 November** (confirmed) and links to the Open Day
  registration site, https://elyss-open-day.netlify.app.

## Built-in behaviour

- Sticky header, mobile dropdown nav, permanent Call / WhatsApp bar on phones
- Accessible FAQ accordion (one panel at a time, full keyboard support)
- Kenyan mobile validation (`07XX`, `01XX`, `+254…`) with plain-language errors
- Honeypot field against bots
- Scroll reveals with a safety net so content can never stay hidden
- Reduced-motion and print stylesheets
- Semantic landmarks, skip link, visible focus rings, `aria-live` form status

## Keyword alignment

Section IDs match the Meta keyword automations so ad, auto-reply and page use the same
words: `#questions` (fees, bei, transport, CBC/CBE), `#offer` (abacus, creative art),
`#visit` (visit, tour, openday), `#join` (admission, intake, enrol), `#book` (register).

---

Prepared for Elyss School by ElyonEdge Marketing & Sales.
