# Paid Report Validation Playbook

## Goal

Prove that strangers will pay for one clean digital product before building accounts, subscriptions, or a marketplace.

## Product

**Professional Kundali Matching PDF**

- Free: compatibility score preview.
- Paid: full printable PDF with D1/D9 charts, Ashtakoot breakdown, Manglik analysis, Dasha timing, marriage yogas, Navamsa analysis, remedies, and disclaimer.
- Test price: `₹299` in India or `$5` for diaspora users.

## Setup

1. Create a Razorpay, Paddle, or similar payment link for the report.
2. Add that URL to `PREMIUM_PRODUCT.paymentUrl` in `js/pages/matching.js`.
3. Optional: add `whatsappNumber` or `upiId` in the same config for manual orders.
4. Share a direct link to `/#matching`.
5. After a buyer pays, verify the payment in your payment dashboard.
6. Ask the buyer to enter the payment/order reference in the unlock modal, or do it for them during manual fulfillment.

## Validation Metrics

Track these before building more:

- 100 unique visitors to the matching page.
- 20+ generated previews.
- 5+ checkout/payment-link clicks.
- 1-3 real paid orders.

If you get at least one real paid order from people outside your immediate friends/family circle, the product has a monetization signal.

## Next Backend Step

Once payment demand is proven, replace manual unlock with:

- Hosted checkout.
- Payment webhook.
- Server-generated report/order ID.
- Paid report unlock tied to the verified payment.
- Email delivery of the PDF receipt/report.
