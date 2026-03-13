import MobileLayout from "@/components/layout/MobileLayout";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const termsContent = `
## 1. Introduction

Welcome to truFindo ("Platform"), operated by truFindo B.V., a company registered in the Netherlands (KvK: 12345678), with its registered office at Keizersgracht 123, 1015 CJ Amsterdam, the Netherlands.

By accessing or using our Platform, you agree to be bound by these Terms & Conditions ("Terms"). If you do not agree, please refrain from using the Platform.

## 2. Definitions

- **Customer**: A natural person using the Platform to find and book services from Traders.
- **Trader**: A verified professional offering home services through the Platform.
- **Booking**: A confirmed arrangement between a Customer and a Trader for the provision of services.
- **Platform Fee**: The service charge applied by truFindo on each Booking (currently 5%).

## 3. Eligibility

You must be at least 18 years old and a resident of the European Economic Area (EEA) to use the Platform. By registering, you confirm that you meet these requirements.

## 4. Account Registration

You are responsible for maintaining the confidentiality of your account credentials. You must provide accurate, current, and complete information during registration and keep it updated.

## 5. Bookings and Payments

- All prices displayed are inclusive of VAT unless stated otherwise.
- Payment is processed securely via our payment partners (iDEAL, credit/debit card, bank transfer).
- Funds are held in escrow until the service is completed and confirmed by the Customer.
- The Platform Fee is non-refundable once a service has been completed.

## 6. Cancellation and Refunds

- **24+ hours before**: Full refund.
- **12–24 hours before**: 50% refund.
- **Less than 12 hours**: No refund.
- Traders who cancel without valid reason may face account restrictions.

## 7. Liability

truFindo acts as an intermediary and is not liable for the quality, safety, or legality of services provided by Traders. We verify Trader identities and credentials but do not guarantee outcomes.

## 8. Intellectual Property

All content on the Platform, including logos, text, and design, is the property of truFindo B.V. and protected under Dutch and EU intellectual property laws.

## 9. Dispute Resolution

Disputes shall be resolved in accordance with the laws of the Netherlands. For EU consumers, the European Commission's Online Dispute Resolution platform is available at https://ec.europa.eu/consumers/odr.

## 10. Changes to Terms

We reserve the right to modify these Terms at any time. Continued use of the Platform after changes constitutes acceptance.

## 11. Contact

truFindo B.V.
Keizersgracht 123, 1015 CJ Amsterdam
Email: legal@trufindo.nl
Phone: +31 20 123 4567
`;

const privacyContent = `
## 1. Data Controller

truFindo B.V. ("we", "us") is the data controller for personal data processed through the Platform, in accordance with the General Data Protection Regulation (GDPR — Regulation (EU) 2016/679).

## 2. Data We Collect

- **Identity data**: Full name, date of birth, government ID (for Traders).
- **Contact data**: Email address, phone number, postal address.
- **Financial data**: Payment method details, transaction history.
- **Technical data**: IP address, browser type, device information, cookies.
- **Usage data**: Booking history, reviews, chat messages, search queries.
- **Biometric data**: Selfie for identity verification (Traders only).

## 3. Legal Basis for Processing

We process your data based on:
- **Contract performance** (Art. 6(1)(b) GDPR): To provide our services.
- **Legal obligation** (Art. 6(1)(c) GDPR): Tax, anti-money laundering (Wwft), and consumer protection compliance.
- **Legitimate interest** (Art. 6(1)(f) GDPR): Fraud prevention, platform security, analytics.
- **Consent** (Art. 6(1)(a) GDPR): Marketing communications, optional cookies.

## 4. Data Retention

- Account data: Retained for the duration of your account + 5 years after deletion (legal obligation).
- Transaction data: 7 years (Dutch tax law).
- Chat messages: 2 years after last activity.
- Verification documents: Deleted within 90 days of successful verification.

## 5. Your Rights (GDPR)

You have the right to:
- **Access** your personal data (Art. 15).
- **Rectify** inaccurate data (Art. 16).
- **Erase** your data ("right to be forgotten") (Art. 17).
- **Restrict** processing (Art. 18).
- **Data portability** (Art. 20).
- **Object** to processing (Art. 21).
- **Withdraw consent** at any time (Art. 7).

To exercise your rights, contact: privacy@trufindo.nl

## 6. Data Sharing

We share data with:
- **Payment processors**: For transaction processing (Mollie B.V.).
- **Identity verification**: For KYC checks (Onfido Ltd.).
- **Cloud hosting**: Data stored on EU-based servers (AWS eu-west-1).
- **Law enforcement**: When required by Dutch or EU law.

We do **not** sell your personal data.

## 7. International Transfers

All data is processed within the EEA. If transfers outside the EEA are necessary, we use Standard Contractual Clauses (SCCs) approved by the European Commission.

## 8. Cookies

We use essential cookies for functionality and optional analytics cookies. You can manage preferences via our cookie banner. See our Cookie Policy for details.

## 9. Data Protection Officer

truFindo B.V.
Attn: Data Protection Officer
Keizersgracht 123, 1015 CJ Amsterdam
Email: dpo@trufindo.nl

## 10. Supervisory Authority

You have the right to lodge a complaint with the Dutch Data Protection Authority (Autoriteit Persoonsgegevens): https://autoriteitpersoonsgegevens.nl
`;

const licencesContent = `
## Open Source Licences

truFindo uses the following open source software:

### React
- Licence: MIT
- Copyright © Meta Platforms, Inc.

### Tailwind CSS
- Licence: MIT
- Copyright © Tailwind Labs, Inc.

### Radix UI
- Licence: MIT
- Copyright © WorkOS

### Lucide Icons
- Licence: ISC
- Copyright © Lucide Contributors

### date-fns
- Licence: MIT
- Copyright © Sasha Koss

### React Router
- Licence: MIT
- Copyright © Remix Software, Inc.

---

## Platform Licences & Compliance

### Chamber of Commerce (KvK)
Registration: 12345678

### Dutch Consumer Authority (ACM)
truFindo complies with Dutch consumer protection regulations and the EU Consumer Rights Directive (2011/83/EU).

### Payment Services
Payment processing is handled by Mollie B.V., a licensed Payment Service Provider under the Dutch Central Bank (DNB).

### Anti-Money Laundering (Wwft)
truFindo complies with the Dutch Anti-Money Laundering and Anti-Terrorist Financing Act (Wet ter voorkoming van witwassen en financieren van terrorisme).

### GDPR Compliance
truFindo is fully compliant with the General Data Protection Regulation (EU) 2016/679. See our Privacy Policy for details.

---

## Third-Party Service Providers

| Provider | Purpose | Jurisdiction |
|----------|---------|--------------|
| Mollie B.V. | Payment processing | Netherlands |
| Onfido Ltd. | Identity verification | United Kingdom (EU SCCs) |
| Amazon Web Services | Cloud hosting (eu-west-1) | Ireland |
| Google LLC | Analytics, Maps | USA (EU SCCs) |

---

*Last updated: 1 March 2026*
`;

const contentMap: Record<string, { title: string; content: string }> = {
  terms: { title: "Terms & Conditions", content: termsContent },
  privacy: { title: "Privacy Policy", content: privacyContent },
  licences: { title: "Licences", content: licencesContent },
};

const LegalDetail = () => {
  const navigate = useNavigate();
  const { section } = useParams();
  const doc = contentMap[section || ""] || contentMap.terms;

  return (
    <MobileLayout>
      <div className="flex items-center gap-3 border-b border-border px-4 py-3">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <h1 className="text-lg font-bold text-foreground font-heading">{doc.title}</h1>
      </div>
      <div className="px-4 py-5">
        <div className="prose prose-sm max-w-none text-foreground prose-headings:text-foreground prose-headings:font-bold prose-h2:text-sm prose-h2:mt-6 prose-h2:mb-2 prose-h3:text-xs prose-h3:mt-4 prose-p:text-xs prose-p:text-muted-foreground prose-p:leading-relaxed prose-li:text-xs prose-li:text-muted-foreground prose-strong:text-foreground prose-a:text-primary prose-table:text-xs">
          {doc.content.split("\n").map((line, i) => {
            const trimmed = line.trim();
            if (!trimmed) return null;
            if (trimmed.startsWith("## ")) return <h2 key={i} className="text-sm font-bold text-foreground mt-6 mb-2">{trimmed.replace("## ", "")}</h2>;
            if (trimmed.startsWith("### ")) return <h3 key={i} className="text-xs font-bold text-foreground mt-4 mb-1">{trimmed.replace("### ", "")}</h3>;
            if (trimmed.startsWith("- ")) return <div key={i} className="flex gap-2 ml-2 mb-1"><span className="text-muted-foreground">•</span><span className="text-xs text-muted-foreground leading-relaxed">{renderBold(trimmed.replace("- ", ""))}</span></div>;
            if (trimmed.startsWith("| ") && trimmed.includes("|")) return null; // skip tables for simplicity
            if (trimmed === "---") return <hr key={i} className="my-4 border-border" />;
            if (trimmed.startsWith("*")) return <p key={i} className="text-[10px] text-muted-foreground italic mt-2">{trimmed.replace(/\*/g, "")}</p>;
            return <p key={i} className="text-xs text-muted-foreground leading-relaxed mb-2">{renderBold(trimmed)}</p>;
          })}
        </div>
      </div>
    </MobileLayout>
  );
};

function renderBold(text: string) {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i} className="font-semibold text-foreground">{part}</strong> : part
  );
}

export default LegalDetail;
