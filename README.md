# The Kindled Movement Method

Landing site for Keene Jones' movement seminars. Plain static HTML, CSS and JS.
No build step, no dependencies. Open `index.html` in a browser and it runs.

Copy comes from the "Website Copy" section of the
[Project Marketing: Keene Jones](https://docs.google.com/document/d/1Ky3i-H6Dfl_wkV2UkpLGn4rvwt595AZEeaQyEqmA_cw/edit)
doc.

## Files

| File | What it is |
| --- | --- |
| `index.html` | The whole page |
| `styles.css` | All styling |
| `script.js` | Mobile menu, scroll reveal, form handling, and the config block |
| `assets/` | Photos |
| `robots.txt` | Currently blocks search engines. See "Going live" below |

## Local preview

    cd kindled-movement
    python3 -m http.server 8000

Then open http://localhost:8000

## Making the forms actually collect signups

Right now both forms fall back to opening the visitor's mail app with the message
pre-written to Keene. That works, but it loses anyone who does not have mail set
up on their device.

To capture signups properly, make a free form at [formspree.io](https://formspree.io),
then paste the endpoint into the top of `script.js`:

    var FORM_ENDPOINT = "https://formspree.io/f/xxxxxxx";

Both forms will POST to it and the visitor never leaves the page. The fallback
address lives in the two lines under it, assembled at runtime so scrapers do not
lift it off the page.

## Adding or swapping photos

Photos go in `assets/`. The page looks for these, and shows a warm gradient panel
wherever one is missing:

| Slot | File | Shape |
| --- | --- | --- |
| Hero | `assets/hero.jpg` | Portrait, 4:5 |
| Story | `assets/story.jpg` | Portrait, 4:5 |
| Strip | `assets/strip-1.jpg`, `strip-2.jpg`, `strip-3.jpg` | Landscape, 4:3 |

Keep them under about 400 KB each so the page stays fast. To resize on a Mac:

    sips -Z 1600 photo.jpg --out assets/hero.jpg

## Going live

The site is currently set to stay out of Google, since it is on a
`github.io` preview URL rather than a real domain. When Keene is ready to be found:

1. Delete the `<meta name="robots" content="noindex, nofollow">` line in `index.html`
2. Replace the contents of `robots.txt` with `User-agent: *` and `Allow: /`

If a custom domain gets set up later, add a `CNAME` file containing the domain and
point the DNS at GitHub Pages.
