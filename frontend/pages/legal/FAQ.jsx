import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import LegalLayout from "./LegalLayout";

const FAQ_ITEMS = [
{
q: "What are Lightroom Presets?",
a: `Lightroom presets are more than just filters.

They are carefully shaped adjustments that control light, color, contrast, and mood in a single step.

Each preset is built through a consistent visual approach, helping you create images that feel cohesive, atmospheric, and intentional. Instead of starting from scratch every time, you begin with a strong foundation.

They are not meant to replace your vision, but to guide it — a starting point that helps you move faster, while still leaving room to refine the image into something that feels truly yours.`,
},

{
q: "What do I need to use the presets?",
a: `To use the presets on mobile, you only need the free Adobe Lightroom Mobile app. No subscription is required, and the workflow is simple and accessible.

For desktop use, you will need Adobe Lightroom CC, which requires a paid subscription. This version offers more control and flexibility, especially for fine-tuning details.

Both mobile and desktop presets follow the same visual direction, so your style remains consistent across devices.`,
},

{
q: "What kind of images do they work best on?",
a: `The presets are designed to work across a wide range of images, from phone photography to professional camera work.

They perform best on images with natural light and balanced exposure, where tones and colors have room to breathe. However, they are flexible enough to adapt to different environments, lighting conditions, and scenes.

Every image is different. The preset sets the tone, but small adjustments allow you to bring the image to life.`,
},

{
q: "What is the difference between Mobile and Desktop presets?",
a: `Mobile presets are created specifically for Lightroom Mobile on iPhone and Android. They are easy to use, quick to apply, and perfect for editing on the go.

Desktop presets are designed for Lightroom CC and provide a more detailed editing environment. They allow deeper control over color grading, tonal balance, and fine adjustments.

While the tools differ slightly, the visual outcome remains aligned. Both are built to deliver the same cinematic language.`,
},

{
q: "What are LUTs (Video Filters)?",
a: `LUTs, or Look-Up Tables, are the video equivalent of presets. They transform the color and tone of your footage, shaping the overall mood of a scene.

Instead of adjusting each parameter manually, a LUT applies a predefined color grade that brings consistency and atmosphere to your video.

It is not just about color — it is about how the footage feels.`,
},

{
q: "What software can I use with LUTs?",
a: `LUTs can be used in any editing software that supports .CUBE files.

For mobile editing, apps like VN Video Editor or 24FPS provide a simple and effective workflow.

For desktop, LUTs integrate seamlessly with tools such as Adobe Premiere Pro, After Effects, Final Cut Pro, DaVinci Resolve, and more.

This allows you to maintain a consistent visual identity across both photo and video.`,
},

{
q: "Which currency do you use?",
a: `Prices are displayed in INR for users in India.
For all other regions, prices are automatically shown in USD. This allows a more localized and seamless experience based on your location.`,
},

{
q: "How will I receive my files?",
a: `Once your purchase is complete, you will receive an email containing your download link.

This email also acts as your access point — your purchase history and files remain available there whenever you need them.

If the email does not appear in your inbox, check your spam folder. If it is still missing, simply reach out and it will be resolved quickly.`,
},

{
q: "I am having trouble downloading my files",
a: `For the best experience, download your files using Chrome on either your phone or desktop.

If the issue continues, do not worry — just reach out and you will be guided through it. The goal is to make sure you receive everything without friction.`,
},

{
q: "How do I install the presets and LUTs?",
a: `Each purchase includes a step-by-step installation guide. The process is designed to be simple, even if you are new to editing.

From importing the files to applying them correctly, everything is clearly explained so you can start creating immediately.`,
},

{
q: "Will the presets work in one click?",
a: `In many cases, yes — but every image carries its own light, tones, and environment.

Because of this, small adjustments may sometimes be needed to refine the final result.

Think of presets as a foundation. They bring you close, and a few subtle tweaks make it complete.`,
},

{
q: "Can I transfer the presets to a new device?",
a: `Yes. Once downloaded, your presets and LUTs can be stored and reused across devices.

It is recommended to keep a backup so you always have access, regardless of where you are editing from.`,
},

{
q: "Can I share or resell the presets?",
a: `No. All products are licensed for personal use only.

Sharing, redistributing, or reselling the files is not permitted.`,
},

{
q: "Do you offer refunds?",
a: `Due to the digital nature of the products, refunds cannot be offered once the files have been downloaded.

However, if you face any issue before accessing your files, you can reach out and it will be handled properly.

Support is always available — you are not left figuring things out alone.`,
},
];

export default function FAQ() {
  const [open, setOpen] = useState(null);

  const containerRef = useRef(null);
  const itemsRef = useRef([]);
  const contentRefs = useRef([]);
  const glowRef = useRef(null);

  const toggle = (i) => {
    setOpen(open === i ? null : i);
  };

  // 🔥 Cinematic Entry
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(containerRef.current, {
        opacity: 0,
        y: 60,
        duration: 1.2,
        ease: "power3.out",
      });

      gsap.from(itemsRef.current, {
        opacity: 0,
        y: 40,
        stagger: 0.1,
        duration: 1,
        delay: 0.3,
        ease: "power3.out",
      });
    });

    return () => ctx.revert();
  }, []);

  // 🔥 Accordion
  useEffect(() => {
    contentRefs.current.forEach((el, i) => {
      if (!el) return;

      if (open === i) {
        gsap.fromTo(
          el,
          { height: 0, opacity: 0 },
          {
            height: "auto",
            opacity: 1,
            duration: 0.6,
            ease: "power3.out",
          }
        );
      } else {
        gsap.to(el, {
          height: 0,
          opacity: 0,
          duration: 0.4,
          ease: "power3.inOut",
        });
      }
    });
  }, [open]);

  // 🔥 Cursor Glow
  const handleMouseMove = (e) => {
    const glow = glowRef.current;
    if (!glow) return;

    gsap.to(glow, {
      x: e.clientX - 150,
      y: e.clientY - 150,
      duration: 0.4,
      ease: "power3.out",
    });
  };

  return (
    <LegalLayout title="FAQ" subtitle="Frequently asked questions">
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        style={{
          position: "relative",
          maxWidth: "1200px",
        }}
      >
        {/* ✨ Glow */}
        <div
          ref={glowRef}
          style={{
            position: "fixed",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            pointerEvents: "none",
            background: "radial-gradient(circle, rgba(255,255,255,0.08), transparent 70%)",
            filter: "blur(80px)",
            zIndex: 0,
          }}
        />

        {FAQ_ITEMS.map((item, i) => (
          <div
            key={i}
            ref={(el) => (itemsRef.current[i] = el)}
            style={{
              borderBottom: "1px solid var(--fg20)",
              position: "relative",
              zIndex: 1,
            }}
          >
            <button
              onClick={() => toggle(i)}
              style={{
                width: "100%",
                padding: "30px 0",
                background: "none",
                border: "none",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontFamily: "'Playfair Display', serif",
                fontSize: "1.2rem",
                cursor: "pointer",
                color: open === i ? "var(--fg)" : "var(--fg60)",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                gsap.to(e.currentTarget, {
                  x: 8,
                  duration: 0.3,
                  ease: "power3.out",
                });
              }}
              onMouseLeave={(e) => {
                gsap.to(e.currentTarget, {
                  x: 0,
                  duration: 0.4,
                  ease: "power3.out",
                });
              }}
            >
              <span>{item.q}</span>

              <span
                style={{
                  transform: open === i ? "rotate(45deg)" : "rotate(0deg)",
                  transition: "transform 0.4s ease",
                }}
              >
                +
              </span>
            </button>

            {/* Answer */}
            <div
              ref={(el) => (contentRefs.current[i] = el)}
              style={{ overflow: "hidden", height: 0 }}
            >
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.95rem",
                  lineHeight: 1.9,
                  color: "var(--fg60)",
                  paddingBottom: "30px",
                }}
              >
                {item.a}
              </p>
            </div>
          </div>
        ))}
      </div>
    </LegalLayout>
  );
}