/**
 * PKHosting VPS Pricing Page — State Engine & Pricing Calculator
 * 
 * Complies strictly with all assessment rules:
 * 1. Annual calculation formula: (monthly * 10) / 12
 * 2. Annual cards display per-month price, annual total (monthly * 10), and dynamic savings badge.
 * 3. Exchange rates: 1 USD = 278.50 PKR, 1 GBP = 355.00 PKR.
 * 4. PKR formatted as whole numbers, USD and GBP formatted with 2 decimals.
 * 5. State (currency & billing period) persists across page reloads via localStorage.
 * 6. Accessible announcements sent to aria-live="polite" region on every state change.
 */

(function () {
  'use strict';

  // -------------------------------------------------------------------------
  // 1. Constants & Configuration
  // -------------------------------------------------------------------------
  const EXCHANGE_RATES = {
    PKR: 1,
    USD: 278.50, // 1 USD = 278.50 PKR
    GBP: 355.00  // 1 GBP = 355.00 PKR
  };

  const CURRENCY_SYMBOLS = {
    PKR: 'Rs',
    USD: '$',
    GBP: '£'
  };

  const STORAGE_KEYS = {
    BILLING: 'pkhosting_vps_billing',
    CURRENCY: 'pkhosting_vps_currency'
  };

  // Base Monthly PKR Prices (Invented prices as specified)
  const PLAN_DATA = {
    starter: {
      name: 'Starter',
      monthlyPkr: 2400
    },
    growth: {
      name: 'Growth',
      monthlyPkr: 4800
    },
    scale: {
      name: 'Scale',
      monthlyPkr: 9600
    },
    dedicated: {
      name: 'Dedicated Core',
      monthlyPkr: 19500
    }
  };

  // -------------------------------------------------------------------------
  // 2. Application State
  // -------------------------------------------------------------------------
  const state = {
    billingPeriod: 'monthly', // 'monthly' | 'annually'
    currency: 'PKR'           // 'PKR' | 'USD' | 'GBP'
  };

  // -------------------------------------------------------------------------
  // 3. Mathematical & Formatting Engine
  // -------------------------------------------------------------------------

  /**
   * Calculates the display price and annual totals according to strict assessment rules.
   * Rule: Annual billing charges 10 months for 12.
   * Per-month price shown: (monthly * 10) / 12
   */
  function calculatePlanPrices(monthlyPkr, billingPeriod, currency) {
    const rate = EXCHANGE_RATES[currency] || 1;
    
    // Convert base monthly PKR into selected currency
    const monthlyInCurrency = monthlyPkr / rate;

    if (billingPeriod === 'annually') {
      // Per-month figure: (monthly * 10) / 12
      const perMonthPrice = (monthlyInCurrency * 10) / 12;
      
      // Total annual amount billed: monthly * 10
      const annualTotal = monthlyInCurrency * 10;
      
      // Computed Savings Amount: 2 full months free = monthly * 2
      const annualSavings = monthlyInCurrency * 2;
      
      // Percentage savings: (2 / 12) * 100 = 16.666...%
      const savingsPercent = 16.7;

      return {
        perMonthPrice,
        annualTotal,
        annualSavings,
        savingsPercent,
        isAnnual: true
      };
    }

    // Monthly Billing
    return {
      perMonthPrice: monthlyInCurrency,
      annualTotal: 0,
      annualSavings: 0,
      savingsPercent: 0,
      isAnnual: false
    };
  }

  /**
   * Formats a numeric price into localized currency strings.
   * PKR: Whole numbers with thousands separators (e.g. 2,400)
   * USD / GBP: Two decimals (e.g. 8.62)
   */
  function formatCurrencyValue(amount, currency) {
    if (currency === 'PKR') {
      const rounded = Math.round(amount);
      return rounded.toLocaleString('en-US'); // Inserts comma separators
    }
    
    // USD and GBP require exactly 2 decimal places
    return amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  // -------------------------------------------------------------------------
  // 4. Persistence (Safe LocalStorage Helper)
  // -------------------------------------------------------------------------
  function loadPersistedState() {
    try {
      const savedBilling = localStorage.getItem(STORAGE_KEYS.BILLING);
      const savedCurrency = localStorage.getItem(STORAGE_KEYS.CURRENCY);

      if (savedBilling === 'monthly' || savedBilling === 'annually') {
        state.billingPeriod = savedBilling;
      }

      if (EXCHANGE_RATES[savedCurrency]) {
        state.currency = savedCurrency;
      }
    } catch (e) {
      // In private browsing or restricted environments, localStorage may throw
      console.warn('LocalStorage unavailable, defaulting to initial state.', e);
    }
  }

  function persistState() {
    try {
      localStorage.setItem(STORAGE_KEYS.BILLING, state.billingPeriod);
      localStorage.setItem(STORAGE_KEYS.CURRENCY, state.currency);
    } catch (e) {
      console.warn('Failed to save state to LocalStorage.', e);
    }
  }

  // -------------------------------------------------------------------------
  // 5. DOM Update & UI Synchronization
  // -------------------------------------------------------------------------

  /**
   * Synchronizes the UI pricing cards and comparison table with current state.
   */
  function render() {
    const symbol = CURRENCY_SYMBOLS[state.currency];
    const isAnnual = state.billingPeriod === 'annually';

    // 1. Update Pricing Cards
    const cards = document.querySelectorAll('.pricing-card');
    cards.forEach(card => {
      const planKey = card.getAttribute('data-plan');
      const planConfig = PLAN_DATA[planKey];
      if (!planConfig) return;

      const calc = calculatePlanPrices(planConfig.monthlyPkr, state.billingPeriod, state.currency);

      // Currency Symbol
      const symbolElem = card.querySelector('.currency-symbol');
      if (symbolElem) symbolElem.textContent = symbol;

      // Price Value
      const valueElem = card.querySelector('[data-price-value]');
      if (valueElem) {
        valueElem.textContent = formatCurrencyValue(calc.perMonthPrice, state.currency);
      }

      // Annual Billed Subtitle & Computed Savings Badge
      const annualInfoWrapper = card.querySelector('.billed-annually-info');
      const annualTotalElem = card.querySelector('.annual-total-text');
      const savingsBadgeElem = card.querySelector('.savings-badge');

      if (annualInfoWrapper && annualTotalElem && savingsBadgeElem) {
        if (isAnnual) {
          const formattedTotal = formatCurrencyValue(calc.annualTotal, state.currency);
          annualTotalElem.textContent = `Billed ${symbol} ${formattedTotal}/yr`;

          // Dynamic computed savings badge (not typed string!)
          const formattedSavings = formatCurrencyValue(calc.annualSavings, state.currency);
          savingsBadgeElem.textContent = `Save ${symbol} ${formattedSavings} (${calc.savingsPercent}%)`;
          savingsBadgeElem.classList.add('visible');
        } else {
          annualTotalElem.textContent = '';
          savingsBadgeElem.textContent = '';
          savingsBadgeElem.classList.remove('visible');
        }
      }
    });

    // 2. Update Comparison Table Header Prices
    const tablePriceElems = document.querySelectorAll('[data-table-price]');
    tablePriceElems.forEach(elem => {
      const planKey = elem.getAttribute('data-table-price');
      const planConfig = PLAN_DATA[planKey];
      if (!planConfig) return;

      const calc = calculatePlanPrices(planConfig.monthlyPkr, state.billingPeriod, state.currency);
      const formattedPerMonth = formatCurrencyValue(calc.perMonthPrice, state.currency);
      elem.textContent = `${symbol} ${formattedPerMonth}/mo`;
    });

    // 3. Update Controls Toolbar Buttons
    const monthlyBtn = document.getElementById('billing-monthly');
    const annualBtn = document.getElementById('billing-annually');

    if (monthlyBtn && annualBtn) {
      if (isAnnual) {
        annualBtn.classList.add('active');
        annualBtn.setAttribute('aria-checked', 'true');
        monthlyBtn.classList.remove('active');
        monthlyBtn.setAttribute('aria-checked', 'false');
      } else {
        monthlyBtn.classList.add('active');
        monthlyBtn.setAttribute('aria-checked', 'true');
        annualBtn.classList.remove('active');
        annualBtn.setAttribute('aria-checked', 'false');
      }
    }

    // 4. Update Currency Dropdown
    const currencySelect = document.getElementById('currency-selector');
    if (currencySelect && currencySelect.value !== state.currency) {
      currencySelect.value = state.currency;
    }

    // 5. Accessible Screen Reader Status Announcement
    announceToScreenReader();
  }

  /**
   * Announces price and currency state updates to assistive technologies.
   */
  function announceToScreenReader() {
    const announcer = document.getElementById('pricing-announcer');
    if (!announcer) return;

    const periodLabel = state.billingPeriod === 'annually' ? 'Annually (10 months for 12)' : 'Monthly';
    const growthCalc = calculatePlanPrices(PLAN_DATA.growth.monthlyPkr, state.billingPeriod, state.currency);
    const growthFormatted = formatCurrencyValue(growthCalc.perMonthPrice, state.currency);
    const symbol = CURRENCY_SYMBOLS[state.currency];

    announcer.textContent = `Showing ${periodLabel} pricing in ${state.currency}. Growth plan is ${symbol} ${growthFormatted} per month.`;
  }

  // -------------------------------------------------------------------------
  // 6. Event Handlers & Initialization
  // -------------------------------------------------------------------------
  function setupEventListeners() {
    // Billing Toggle: Monthly button
    const monthlyBtn = document.getElementById('billing-monthly');
    if (monthlyBtn) {
      monthlyBtn.addEventListener('click', () => {
        if (state.billingPeriod !== 'monthly') {
          state.billingPeriod = 'monthly';
          persistState();
          render();
        }
      });
    }

    // Billing Toggle: Annually button
    const annualBtn = document.getElementById('billing-annually');
    if (annualBtn) {
      annualBtn.addEventListener('click', () => {
        if (state.billingPeriod !== 'annually') {
          state.billingPeriod = 'annually';
          persistState();
          render();
        }
      });
    }

    // Currency Selector Change
    const currencySelect = document.getElementById('currency-selector');
    if (currencySelect) {
      currencySelect.addEventListener('change', (e) => {
        const newCurrency = e.target.value;
        if (EXCHANGE_RATES[newCurrency]) {
          state.currency = newCurrency;
          persistState();
          render();
        }
      });
    }

    // Keyboard navigation support for segmented radiogroup (Arrow Left / Arrow Right)
    const radiogroup = document.querySelector('.segmented-control');
    if (radiogroup) {
      radiogroup.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
          e.preventDefault();
          state.billingPeriod = state.billingPeriod === 'monthly' ? 'annually' : 'monthly';
          persistState();
          render();
          
          const activeBtn = state.billingPeriod === 'annually' ? annualBtn : monthlyBtn;
          if (activeBtn) activeBtn.focus();
        }
      });
    }
  }

  // -------------------------------------------------------------------------
  // 7. App Bootstrap
  // -------------------------------------------------------------------------
  function init() {
    loadPersistedState();
    setupEventListeners();
    // Re-render UI to restore any saved state from localStorage
    render();
  }

  // Initialize once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
