interface QuoteTemplateData {
  // Quote meta
  quoteId: string;
  quoteNumber: number;
  generatedDate: string;
  validTill: string;

  // Company branding
  companyName: string;
  companyLogoUrl?: string;
  companyPhone?: string;
  companyAddress?: string;
  companyGstNumber?: string;
  headerText?: string;
  footerText?: string;
  signatureUrl?: string;

  // Customer info
  customerName: string;
  customerPhone: string;
  customerLocation?: string;

  // Pricing
  systemSizeKW: number;
  panelCostPerKW: number;
  panelCost: number;
  inverterCost: number;
  installationCost: number;
  totalCost: number;
}

export function generateQuoteHtml(data: QuoteTemplateData): string {
  const fmt = (amount: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);

  const logoHtml = data.companyLogoUrl
    ? `<img src="${data.companyLogoUrl}" alt="${data.companyName} logo" style="height:56px;object-fit:contain;border-radius:8px;" />`
    : `<div style="width:56px;height:56px;background:rgba(255,255,255,0.25);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:22px;">☀️</div>`;

  const signatureHtml = data.signatureUrl
    ? `<img src="${data.signatureUrl}" alt="Signature" style="height:48px;margin-top:8px;object-fit:contain;" />`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Quote #${String(data.quoteNumber).padStart(4, '0')} — ${data.companyName}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Segoe UI', Arial, sans-serif; background: #fff; color: #1a1a2e; }
  .page { max-width: 820px; margin: 0 auto; padding: 48px; }

  /* Header */
  .header { background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: white; padding: 28px 36px; border-radius: 16px; margin-bottom: 32px; }
  .header-inner { display: flex; align-items: center; gap: 20px; }
  .company-info { flex: 1; }
  .company-info h1 { font-size: 22px; font-weight: 800; letter-spacing: -0.5px; }
  .company-info .sub { font-size: 12px; opacity: 0.8; margin-top: 2px; line-height: 1.6; }
  .quote-ref { text-align: right; flex-shrink: 0; }
  .quote-ref .label { font-size: 10px; opacity: 0.75; text-transform: uppercase; letter-spacing: 1px; }
  .quote-ref .num { font-size: 24px; font-weight: 800; }
  .quote-ref .date { font-size: 11px; opacity: 0.8; margin-top: 4px; }
  .system-badge { display: inline-block; background: rgba(255,255,255,0.2); color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 700; margin-top: 8px; border: 1px solid rgba(255,255,255,0.35); }
  .header-text-bar { margin-top: 14px; font-size: 12px; opacity: 0.85; border-top: 1px solid rgba(255,255,255,0.2); padding-top: 12px; }

  /* Sections */
  .section { margin-bottom: 30px; }
  .section-title { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; color: #f97316; margin-bottom: 14px; padding-bottom: 8px; border-bottom: 2px solid #fed7aa; }
  .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
  .info-item .label { font-size: 11px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 3px; }
  .info-item .value { font-size: 15px; font-weight: 600; color: #1e293b; }

  /* Table */
  table { width: 100%; border-collapse: collapse; }
  thead th { background: #f8fafc; padding: 13px 18px; text-align: left; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.7px; color: #64748b; border-bottom: 2px solid #e2e8f0; }
  tbody td { padding: 15px 18px; border-bottom: 1px solid #f1f5f9; font-size: 14px; color: #334155; }
  .amount { text-align: right; font-weight: 600; color: #1e293b; }
  .tfoot-row td { padding: 18px !important; background: linear-gradient(135deg, #f97316, #ea580c); color: white !important; font-size: 16px !important; font-weight: 800 !important; }

  /* Footer */
  .footer { margin-top: 40px; padding-top: 24px; border-top: 1px solid #e2e8f0; }
  .footer-row { display: flex; justify-content: space-between; align-items: flex-end; }
  .footer-left { font-size: 12px; color: #64748b; line-height: 1.8; max-width: 65%; }
  .footer-right { text-align: right; }
  .validity-badge { display: inline-block; background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 600; }
  .sig-label { font-size: 10px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 6px; }
</style>
</head>
<body>
<div class="page">

  <!-- Header with logo + company + quote ref -->
  <div class="header">
    <div class="header-inner">
      ${logoHtml}
      <div class="company-info">
        <h1>${data.companyName}</h1>
        <div class="sub">
          ${data.companyAddress ? data.companyAddress + '<br/>' : ''}
          ${data.companyPhone ? '📞 ' + data.companyPhone : ''}
          ${data.companyGstNumber ? ' &nbsp;|&nbsp; GST: ' + data.companyGstNumber : ''}
        </div>
        <span class="system-badge">☀️ ${data.systemSizeKW} kW System</span>
      </div>
      <div class="quote-ref">
        <div class="label">Quote Reference</div>
        <div class="num">#${String(data.quoteNumber).padStart(4, '0')}</div>
        <div class="date">Issued: ${data.generatedDate}</div>
      </div>
    </div>
    ${data.headerText ? `<div class="header-text-bar">${data.headerText}</div>` : ''}
  </div>

  <!-- Customer Details -->
  <div class="section">
    <div class="section-title">Customer Details</div>
    <div class="info-grid">
      <div class="info-item">
        <div class="label">Customer Name</div>
        <div class="value">${data.customerName}</div>
      </div>
      <div class="info-item">
        <div class="label">Phone Number</div>
        <div class="value">${data.customerPhone}</div>
      </div>
      ${data.customerLocation ? `
      <div class="info-item">
        <div class="label">Location</div>
        <div class="value">${data.customerLocation}</div>
      </div>` : ''}
      <div class="info-item">
        <div class="label">Prepared By</div>
        <div class="value">${data.companyName}</div>
      </div>
    </div>
  </div>

  <!-- Cost Breakdown -->
  <div class="section">
    <div class="section-title">Cost Breakdown</div>
    <table>
      <thead>
        <tr>
          <th>Item</th>
          <th>Details</th>
          <th style="text-align:right">Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Solar Panels</strong></td>
          <td style="color:#64748b">${data.systemSizeKW} kW &times; ${fmt(data.panelCostPerKW)}/kW</td>
          <td class="amount">${fmt(data.panelCost)}</td>
        </tr>
        <tr>
          <td><strong>Inverter</strong></td>
          <td style="color:#64748b">Grid-tie inverter unit</td>
          <td class="amount">${fmt(data.inverterCost)}</td>
        </tr>
        <tr>
          <td><strong>Installation &amp; Wiring</strong></td>
          <td style="color:#64748b">Labour, mounting, wiring &amp; commissioning</td>
          <td class="amount">${fmt(data.installationCost)}</td>
        </tr>
      </tbody>
      <tfoot>
        <tr class="tfoot-row">
          <td colspan="2">Total Investment</td>
          <td style="text-align:right">${fmt(data.totalCost)}</td>
        </tr>
      </tfoot>
    </table>
  </div>

  <!-- Footer -->
  <div class="footer">
    <div class="footer-row">
      <div class="footer-left">
        ${data.footerText ? `<p>${data.footerText}</p>` : '<p>This is a computer-generated quotation. Prices are subject to change based on site survey.</p>'}
        <p style="margin-top:6px;color:#94a3b8;font-size:11px;">Quote ID: ${data.quoteId.slice(-10).toUpperCase()}</p>
      </div>
      <div class="footer-right">
        ${signatureHtml}
        ${data.signatureUrl ? `<div class="sig-label">Authorised Signature</div>` : ''}
        <div style="margin-top:10px;">
          <span class="validity-badge">✓ Valid until ${data.validTill}</span>
        </div>
      </div>
    </div>
  </div>

</div>
</body>
</html>`;
}
