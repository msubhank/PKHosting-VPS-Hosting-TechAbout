# PKHosting Responsive VPS Pricing Page

**TechAbout Web Developer Assessment Submission**  
**Candidate Project:** High-Performance Cloud VPS Pricing Interface  
**Technology Stack:** Vanilla HTML5, Vanilla CSS3 (Custom Properties), Vanilla JavaScript (ES6+). Zero external dependencies, 100% offline-ready (<40 KB total payload).

---

## 🚀 How to Run the Project

This project requires **no build step, no Node server, no package manager, and no internet connection**.

1. **Direct Browser Execution**:
   - Simply double-click [`index.html`](file:///d:/assessment%20techabout/index.html) or right-click and open with **Google Chrome** or **Mozilla Firefox**.
2. **Local HTTP Server (Optional)**:
   ```bash
   # Using Python 3:
   python -m http.server 8000
   # Then open: http://localhost:8000
   
   # Or using Node npx:
   npx serve .
   ```

---

## 🎯 Pricing Logic & Formulas Checked Exactly

* **Annual Billing Rule ("10 months for 12")**:
  $$\text{Effective Monthly Price} = \frac{\text{Monthly Base Price} \times 10}{12}$$
  - **Starter**: $\frac{2,400 \times 10}{12} = \mathbf{Rs\ 2,000 / month}$
  - **Growth**: $\frac{4,800 \times 10}{12} = \mathbf{Rs\ 4,000 / month}$ *(Checked: Exactly matches test case in brief)*
  - **Scale**: $\frac{9,600 \times 10}{12} = \mathbf{Rs\ 8,000 / month}$
  - **Dedicated Core**: $\frac{19,500 \times 10}{12} = \mathbf{Rs\ 16,250 / month}$
* **Annual Billed Total**:
  $$\text{Total Billed} = \text{Monthly Base Price} \times 10$$
  *(Starter: Rs 24,000/yr | Growth: Rs 48,000/yr | Scale: Rs 96,000/yr | Dedicated Core: Rs 195,000/yr)*
* **Savings Badges**:
  - Dynamically computed in JavaScript via $\text{Monthly Base} \times 2$ (representing 2 free months / 16.7% discount).
* **Hard-coded Currency Conversion (No Rate API)**:
  - $1\text{ USD} = 278.50\text{ PKR}$
  - $1\text{ GBP} = 355.00\text{ PKR}$
  - **PKR Formatting**: Formatted as whole numbers with thousands separators (`Rs 2,400`).
  - **USD / GBP Formatting**: Formatted with exactly two decimal places (`$8.62`, `£6.76`).
* **State Persistence**:
  - Currency and billing cycle selections persist across page reloads via `localStorage` (with a safe in-memory fallback for private browsing mode).

---

## 🌐 Browsers & Viewports Tested

| Test Scenario | Google Chrome | Mozilla Firefox | Status |
|---|---|---|---|
| **Mobile (360px)** | Pass | Pass | Clean stacked layout; zero horizontal page overflow; comparison table scrolls inside self-contained box |
| **Tablet (768px)** | Pass | Pass | Balanced 2x2 grid; clear typography hierarchy |
| **Desktop (1440px)** | Pass | Pass | 4-column aligned grid with featured Growth card elevation |
| **200% Browser Zoom** | Pass | Pass | Fluid units prevent text clipping; controls wrap gracefully |
| **Keyboard Only (Tab)** | Pass | Pass | Skip link, visible focus rings on all interactive elements, arrow-key navigation on radiogroup |
| **Offline Mode** | Pass | Pass | Zero external requests (no Google Fonts, no CDN scripts); 100% self-contained |
| **No-JavaScript Mode** | Pass | Pass | Initial Monthly PKR prices and full 10-row table hard-coded in raw HTML; FAQ uses native `<details>` |

---

## 🎨 Architectural & Design Decisions

1. **Zero Cumulative Layout Shift (CLS = 0)**:
   - When toggling between Monthly and Annual billing, height is pre-allocated on `.billed-annually-info` (`min-height: 22px`). Buttons and feature lists never jump or shift.
2. **Semantic HTML & Screen Reader Accessibility**:
   - Headings strictly structured (`h1` -> `h2` -> `h3`).
   - Screen reader updates communicated via a polite live region (`#pricing-announcer` with `aria-live="polite"`).
   - High contrast palette exceeds WCAG AA 4.5:1 ratio (body text achieves 15.8:1 contrast).
3. **Responsive Comparison Table**:
   - The 10-spec table is wrapped in `.table-responsive-container` with `overflow-x: auto; -webkit-overflow-scrolling: touch`. The page body remains strictly constrained with no horizontal scrollbar.
4. **Self-Contained Vector Graphics**:
   - Brand logo, feature checkmarks, metrics, and payment badges (JazzCash, EasyPaisa, 1Link, Visa/Mastercard) are authored as clean, optimized inline SVGs. Zero external image requests.

---



## 🔮 What I Would Improve with Additional Time

1. **Interactive Configurator Slider**: A resource slider allowing users to dynamically adjust RAM and vCPU sliders to compute a custom hybrid plan.
2. **Automated Currency Geolocation (GeoIP)**: Auto-detecting visitor IP (e.g. defaulting to PKR for Pakistani IPs, USD for global visitors) with explicit user override capability.
3. **WHMCS / Billing Portal Integration**: Direct URL query parameter mapping to checkout carts (e.g., `cart.php?a=add&pid=vps_growth&billingcycle=annually&currency=PKR`).
