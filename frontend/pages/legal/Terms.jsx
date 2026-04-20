import LegalLayout          from "./LegalLayout";
import { PolicyContent }    from "./Privacy";

const SECTIONS = [
  {
    heading: "Overview",
    body: `By accessing this site or purchasing from it, you agree to these terms. Everything offered here, including presets, LUTs, and digital products, is provided under these conditions. If you do not agree, you should not use the service. These terms may evolve over time. Continued use means you accept those changes.`,
  },
  {
    heading: "Use of the service",
    body: `You agree to use this site responsibly and within the law. You must not misuse the platform, attempt to disrupt it, or use it for anything unlawful. Any violation may result in immediate termination of access.`,
  },
  {
    heading: "Digital products and licensing",
    body: `All products sold are digital and licensed, not owned. When you purchase, you receive a personal, non-transferable license to use the product in your own creative work. This includes both personal and commercial use. You may not resell, share, distribute, or transfer the original files in any form. The files remain the intellectual property of EL3V3N. You are free to use the results created with them, but not the files themselves.`,
  },
  {
    heading: "No refunds",
    body: `Due to the nature of digital products, all sales are final once the files are accessed or downloaded. If there is a genuine issue with your files, such as corruption or missing content, support is available to resolve it.`,
  },
  {
    heading: "Compatibility",
    body: `Products are designed for specific software and workflows. It is your responsibility to ensure compatibility with your tools and setup before purchasing. We cannot guarantee performance across all future updates or unsupported platforms.`,
  },
  {
    heading: "Payments",
    body: "All payments are processed securely through trusted providers. We do not store sensitive payment details. Transactions are encrypted and handled according to industry standards.",
  },
  {
    heading: "Accuracy of content",
    body: `We aim to present all information clearly and accurately. However, results may vary depending on your image, lighting, camera, and workflow. The visuals shown are a reference, not a guarantee.`,
  },
  {
    heading: "Changes to products and pricing",
    body: "Products, pricing, and availability may change at any time. We reserve the right to update or remove content without prior notice.",
  },
  {
    heading: "Third-party services",
    body: "Some parts of the service rely on third-party tools. We are not responsible for how those platforms operate or handle your data. Use of those services is at your own discretion.",
  },
  {
    heading: "External links",
    body: "Links may take you outside this site. Once you leave, you are subject to the policies of those platforms.",
  },
  {
    heading: "User input",
    body: "If you share feedback, ideas, or suggestions, you allow us to use them without restriction. You are responsible for ensuring your submissions do not violate any rights or laws.",
  },
  {
    heading: "Prohibited use",
    body: `You may not use this platform to harm, exploit, or violate others. sThis includes misuse of content, unauthorised distribution, or any illegal activity. Access may be revoked if these terms are violated.`,
  },
  {
    heading: "Limitation of liability",
    body: `All products and services are provided as they are. We do not guarantee uninterrupted access or specific results. Use of the service is at your own risk. sWe are not liable for any loss, damage, or outcome resulting from the use of our products.`,
  },
  {
    heading: "Indemnification",
    body: "You agree to take responsibility for any misuse of the service or violation of these terms.",
  },
  {
    heading: "Termination",
    body: "We may suspend or terminate access if these terms are not respected. You may stop using the service at any time.",
  },
  {
    heading: "Governing law",
    body: "These terms are governed by applicable laws in the operating jurisdiction.",
  },
  {
    heading: "Changes to these terms",
    body: "These terms may be updated when necessary. Continued use of the service means you accept those updates.",
  },
  {
    heading: "Contact",
    body: "If you have any questions, you can reach out at:\n\nhello@yourdomain.com",
  },
];

export default function Terms() {
  return (
    <LegalLayout title="Terms of Service" subtitle="Please read carefully">
      <PolicyContent sections={SECTIONS} />
    </LegalLayout>
  );
}