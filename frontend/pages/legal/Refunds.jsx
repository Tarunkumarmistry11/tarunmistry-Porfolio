import LegalLayout       from "./LegalLayout";
import { PolicyContent } from "./Privacy";

const SECTIONS = [
  {
    heading: "Digital products",
    body: `All products available on this site are digital and delivered instantly.

Because of the nature of digital files, once a product has been downloaded or accessed, it cannot be returned. For this reason, refunds are not available after download.`,
  },
  {
    heading: "Before download",
    body: `If you have completed a purchase but have not downloaded your files yet, you can reach out for assistance.

In such cases, we can review the request and help resolve the situation appropriately.`,
  },
  {
    heading: "Support and issues",
    body: `If you experience any technical issues, such as missing files, corrupted downloads, or access problems, support is available.

The goal is to ensure you receive your files correctly and without friction.`,
  },
  {
    heading: "Contact",
    body: "For any concerns or assistance, you can reach out at:\n\nhello@yourdomain.com",
  },
  {
    heading: "Closing note",
    body: "Each product is created with intention and delivered as a digital experience. If something does not feel right, reach out. It will be handled with care.",
  },
];

export default function Refunds() {
  return (
    <LegalLayout title="Refund Policy" subtitle="Our commitment to you">
      <PolicyContent sections={SECTIONS} />
    </LegalLayout>
  );
}