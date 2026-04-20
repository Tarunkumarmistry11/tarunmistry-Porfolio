import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LegalLayout from "./LegalLayout";

gsap.registerPlugin(ScrollTrigger);

const SECTIONS = [
  {
    heading: "What we collect",
    body: `When you make a purchase, we collect the information you provide such as your name, email address, and billing details. This information is used to process your order, deliver your files, and maintain a record of your purchase.

When you browse the site, certain technical information may also be collected automatically. This can include your IP address, browser type, device information, and how you interact with the site. This data helps us understand performance, improve usability, and refine the overall experience. If you choose to receive updates, we may use your email to share information about new releases, products, or updates. You can opt out of these communications at any time.`,
  },
  {
    heading: "Consent",
    body: `By providing your information to complete a purchase, you consent to its use for that specific purpose. If we request your information for any additional purpose, such as marketing, you will always be given the option to accept or decline. You can withdraw your consent at any time by contacting us. Once withdrawn, we will stop using your information for the purposes you no longer agree to, unless required by law.`,
  },
  {
    heading: "Disclosure",
    body: `Your personal information is not sold or shared unnecessarily. It may only be disclosed if required by law, to comply with legal obligations, or if there is a violation of our terms or misuse of the service.`,
  },
  {
    heading: "Payments",
    body: `All payments are processed securely through trusted third party providers such as Razorpay or Stripe. Your payment information is encrypted and handled in accordance with PCI DSS security standards. Sensitive details such as card numbers are never stored on our servers beyond what is required to complete the transaction. This ensures that your financial data remains protected throughout the process.`,
  },
  {
    heading: "Third party services",
    body: `We rely on third party services to operate the store, process payments, and deliver functionality. These providers only access the information necessary to perform their specific role. They are not permitted to use your data for unrelated purposes. Each service operates under its own privacy policy, and we recommend reviewing them if you want a deeper understanding of how your data is handled. If a transaction involves services based outside your country, your data may be subject to the laws of that jurisdiction.`,
  },
  {
    heading: "External links",
    body: `Some areas of the site may contain links to external platforms. Once you leave this site, we are not responsible for the privacy practices or content of those third party websites. We encourage reviewing their policies before sharing any personal information.`,
  },
  {
    heading: "Security",
    body: `We take reasonable and appropriate measures to protect your information. All sensitive data is encrypted and handled using industry standard security practices. Access to personal data is limited and controlled to prevent unauthorized use. While no system can guarantee absolute security, we continuously work to maintain a safe and reliable environment.`,
  },
  {
    heading: "Cookies",
    body: `Cookies are used to enhance your browsing experience. They help remember your preferences, maintain session information, and understand how you interact with the site. This allows us to improve performance and deliver a smoother experience. You can choose to disable cookies through your browser settings, though some features of the site may not function as intended.`,
  },
  {
    heading: "Age requirement",
    body: `By using this site, you confirm that you meet the legal age requirement in your region, or that you have permission from a parent or guardian.`,
  },
  {
    heading: "Changes to this policy",
    body: `This privacy policy may be updated from time to time to reflect changes in practices, legal requirements, or improvements to the service. Any updates will take effect immediately once published on this page.`,
  },
  {
    heading: "Contact",
    body: `If you would like to access, update, or remove your personal information, or if you have any questions or concerns, you can reach out at any time.

Contact: hello@yourdomain.com`,
  },
];

export default function Privacy() {
  return (
    <LegalLayout title="Privacy Policy" subtitle="How we handle your data">
      <PolicyContent sections={SECTIONS} />
    </LegalLayout>
  );
}

export function PolicyContent({ sections }) {
  const containerRef = useRef(null);
  const sectionRefs = useRef([]);
  const glowRef = useRef(null);

  // 🎬 Scroll Reveal Animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      sectionRefs.current.forEach((el) => {
        if (!el) return;

        gsap.fromTo(
          el,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    });

    return () => ctx.revert();
  }, []);

  // ✨ Cursor Glow
  const handleMouseMove = (e) => {
    if (!glowRef.current) return;

    gsap.to(glowRef.current, {
      x: e.clientX - 160,
      y: e.clientY - 160,
      duration: 0.5,
      ease: "power3.out",
    });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      style={{
        maxWidth: "1200px",
        display: "flex",
        flexDirection: "column",
        gap: "64px",
        position: "relative",
      }}
    >
      {/* Ambient Glow */}
      <div
        ref={glowRef}
        style={{
          position: "fixed",
          width: "320px",
          height: "320px",
          borderRadius: "50%",
          pointerEvents: "none",
          background:
            "radial-gradient(circle, rgba(255,255,255,0.035), transparent 70%)",
          filter: "blur(120px)",
          zIndex: 0,
        }}
      />

      {sections.map((s, i) => (
        <div
          key={i}
          ref={(el) => (sectionRefs.current[i] = el)}
          style={{
            position: "relative",
            zIndex: 1,
            transition: "opacity 0.4s ease",
          }}
          onMouseEnter={(e) => {
            sectionRefs.current.forEach((sec) => {
              if (sec && sec !== e.currentTarget) {
                sec.style.opacity = "0.3";
              }
            });

            gsap.to(e.currentTarget, {
              y: -6,
              duration: 0.3,
              ease: "power3.out",
            });
          }}
          onMouseLeave={(e) => {
            sectionRefs.current.forEach((sec) => {
              if (sec) sec.style.opacity = "1";
            });

            gsap.to(e.currentTarget, {
              y: 0,
              duration: 0.4,
              ease: "power3.out",
            });
          }}
        >
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.25rem,2vw,1.5rem)",
              fontWeight: 400,
              color: "var(--fg)",
              marginBottom: "18px",
            }}
          >
            {s.heading}
          </h2>

          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "1rem",
              lineHeight: 1.95,
              color: "var(--fg60)",
              whiteSpace: "pre-line",
              maxWidth: "1200px",
            }}
          >
            {s.body}
          </p>
        </div>
      ))}
    </div>
  );
}