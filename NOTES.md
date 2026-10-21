# PKHosting VPS Pricing — Notes & Observations

This document covers my audit of the live [PKHosting.com](https://www.pkhosting.com) website, along with the design decisions and trade-offs I made while building this VPS pricing page.

---

## 1. Six Things I Noticed on the Live PKHosting Pricing Section

Here are six specific elements from the live site, what happens when a user encounters them, and how I fixed them on this page.

### 1. Currency switcher is stuck at the very top
* **Element**: The currency selector in the main navigation bar.
* **What happens**: When you scroll down to compare hosting packages, the currency dropdown is completely out of view. If you want to see prices in USD instead of PKR, you have to scroll all the way back up to the top (or open the mobile hamburger menu), change it, and then scroll back down. It interrupts the buying flow.
* **My fix**: I put the currency dropdown right beside the Monthly/Annual toggle in a clean toolbar right above the pricing cards. You can switch currency and billing cycle in one place without scrolling anywhere.

### 2. Price updates are invisible to screen readers
* **Element**: The dynamic price text inside each plan card.
* **What happens**: When you switch between Monthly and Annually or pick a different currency, the numbers change instantly on screen. But for someone using a screen reader (like NVDA or JAWS), nothing is announced. The user has no idea that the price just changed or what the new total is.
* **My fix**: I added an invisible `aria-live="polite"` status region. Whenever you change the billing period or currency, it announces a clear sentence (for example: *"Showing Annually pricing in PKR. Growth plan is Rs 4,000 per month."*).

### 3. The card content jumps when switching to Annual (Layout Shift)
* **Element**: The annual savings badge and discount label.
* **What happens**: On the live site, toggling annual billing injects a new line of text below the price. Because no space was reserved for it beforehand, the whole card suddenly expands, pushing the buttons and feature lists down by 20 to 30 pixels. This causes a noticeable visual jump (Cumulative Layout Shift) and can cause misclicks on mobile.
* **My fix**: In CSS, I gave the subtitle area a fixed minimum height (`min-height: 22px`). Whether you are viewing monthly or annual pricing, the card size stays identical and rock-solid with zero jumping.

### 4. The comparison table stretches the whole page sideways on small phones
* **Element**: The wide feature comparison table.
* **What happens**: On screens narrower than 400px (like an iPhone SE or small Android phone), the comparison table is too wide to fit. Instead of scrolling just the table, the entire website gets horizontal scroll. The user ends up accidentally dragging the whole page left and right while trying to scroll down.
* **My fix**: I wrapped the table inside its own scrolling box (`overflow-x: auto`) and locked the page body (`overflow-x: hidden`). The table scrolls smoothly on its own, and I added a simple visual hint above it (*"← Scroll horizontally to inspect all plans →"*).

### 5. Gray and pink discount text is hard to read (Low Contrast)
* **Element**: Muted gray and light pink text on badges and plan intervals.
* **What happens**: The contrast between the text and background is too weak (below the standard 4.5:1 ratio). If you are using your phone outdoors in the sunlight, it is genuinely hard to read the discount amount or see whether a plan is billed monthly or yearly.
* **My fix**: I used a high-contrast dark theme. Normal body text has a 15.8:1 contrast ratio against the dark background, and badges use bright, crisp emerald green on a soft dark container so everything is clearly readable in any lighting.

### 6. Prices break or stay blank if JavaScript is slow or turned off
* **Element**: Price numbers inserted only through JavaScript.
* **What happens**: If a user is on a slow 3G mobile connection in Pakistan and the JavaScript file takes time to load (or fails completely), the price cards stay blank or show empty dashes. The user cannot see how much a server costs.
* **My fix**: I wrote the default **Monthly PKR** prices (`Rs 2,400`, `Rs 4,800`, `Rs 9,600`, `Rs 19,500`) directly into the HTML file. Even if you completely disable JavaScript in your browser, the page still looks great, shows all prices, and the FAQ still opens and closes normally.

---

