import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const PAYMENT_METHODS = [
  {
    name: "Google Pay",
    icon: (
      <svg viewBox="0 0 60 30" width="60" height="30" xmlns="http://www.w3.org/2000/svg">
        <rect width="60" height="30" rx="4" fill="white" stroke="#E0E0E0" strokeWidth="0.8"/>
        <text x="8" y="20" fontFamily="Arial" fontWeight="700" fontSize="11" fill="#4285F4">G</text>
        <text x="17" y="20" fontFamily="Arial" fontWeight="400" fontSize="9" fill="#4285F4">o</text>
        <text x="23" y="20" fontFamily="Arial" fontWeight="400" fontSize="9" fill="#EA4335">o</text>
        <text x="30" y="20" fontFamily="Arial" fontWeight="400" fontSize="9" fill="#FBBC04">g</text>
        <text x="36" y="20" fontFamily="Arial" fontWeight="400" fontSize="9" fill="#34A853">le</text>
        <text x="7" y="28" fontFamily="Arial" fontWeight="500" fontSize="7" fill="#5F6368">Pay</text>
      </svg>
    ),
  },
  {
    name: "Mastercard",
    icon: (
      <svg viewBox="0 0 48 30" width="48" height="30" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="30" rx="4" fill="#252525"/>
        <circle cx="18" cy="15" r="9" fill="#EB001B"/>
        <circle cx="30" cy="15" r="9" fill="#F79E1B"/>
        <path d="M24 7.8C26.1 9.3 27.5 11.5 27.5 15C27.5 18.5 26.1 20.7 24 22.2C21.9 20.7 20.5 18.5 20.5 15C20.5 11.5 21.9 9.3 24 7.8Z" fill="#FF5F00"/>
      </svg>
    ),
  },
  {
    name: "Visa",
    icon: (
      <svg viewBox="0 0 60 30" width="60" height="30" xmlns="http://www.w3.org/2000/svg">
        <rect width="60" height="30" rx="4" fill="white" stroke="#E0E0E0" strokeWidth="0.8"/>
        <text x="8" y="21" fontFamily="Arial" fontWeight="900" fontSize="16" fill="#1A1F71" letterSpacing="-1">VISA</text>
      </svg>
    ),
  },
  {
    name: "Razorpay / UPI",
    icon: (
      <svg viewBox="0 0 60 30" width="60" height="30" xmlns="http://www.w3.org/2000/svg">
        <rect width="60" height="30" rx="4" fill="white" stroke="#E0E0E0" strokeWidth="0.8"/>
        <text x="6" y="20" fontFamily="Arial" fontWeight="900" fontSize="13" fill="#097939">U</text>
        <text x="17" y="20" fontFamily="Arial" fontWeight="900" fontSize="13" fill="#ED752E">P</text>
        <text x="28" y="20" fontFamily="Arial" fontWeight="900" fontSize="13" fill="#840F8B">I</text>
        <text x="37" y="20" fontFamily="Arial" fontSize="7" fontWeight="600" fill="#666">pay</text>
      </svg>
    ),
  },
];

export default function PaymentMethods() {
  const paymentRef = useRef(null);

  useEffect(() => {
    const container = paymentRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      const icons = container.querySelectorAll(".payment-icon");
      if (!icons.length) return;

      gsap.fromTo(
        icons,
        { opacity: 0, y: 12 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power3.out",
          stagger: 0.04,
          scrollTrigger: {
            trigger: container,
            start: "top 92%",
            once: true,
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div ref={paymentRef} style={{ padding: "0 clamp(20px,5vw,80px) clamp(60px,8vw,100px)", maxWidth: "1300px", margin: "0 auto" }}>
      <div style={{ width: "100%", height: "1px", background: "var(--fg10)", marginBottom: "clamp(32px,4vw,48px)" }} />

      <p style={{
        fontFamily: "'Space Mono', monospace",
        fontSize: "0.58rem",
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        color: "var(--fg40)",
        marginBottom: "20px",
        textAlign: "center",
      }}>
        Accepted payment methods
      </p>

      <div style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        gap: "12px",
      }}>
        {PAYMENT_METHODS.map(({ name, icon }) => (
          <div
            key={name}
            className="payment-icon"
            title={name}
            style={{
              opacity: 0,
              lineHeight: 0,
              cursor: "default",
            }}
            onMouseEnter={(e) => {
              gsap.to(e.currentTarget, { y: -3, scale: 1.08, duration: 0.25, ease: "power2.out" });
            }}
            onMouseLeave={(e) => {
              gsap.to(e.currentTarget, { y: 0, scale: 1, duration: 0.25, ease: "power2.out" });
            }}
          >
            {icon}
          </div>
        ))}
      </div>
    </div>
  );
}