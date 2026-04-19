import { useState } from "react";
import LegalLayout   from "./LegalLayout";

export default function ContactUs() {
  const [form, setForm]     = useState({ name:"", email:"", phone:"", comment:"" });
  const [sent, setSent]     = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // TODO: wire to backend /api/contact when ready
    await new Promise((r) => setTimeout(r, 900));
    setSent(true);
    setLoading(false);
  };

  const inputStyle = {
    background:    "transparent",
    border:        "1px solid var(--fg20, rgba(26,26,26,0.2))",
    color:         "var(--fg)",
    fontFamily:    "'Space Mono', monospace",
    fontSize:      "0.72rem",
    letterSpacing: "0.04em",
    padding:       "14px 16px",
    outline:       "none",
    width:         "100%",
    boxSizing:     "border-box",
    transition:    "border-color 0.25s ease",
    borderRadius:  "2px",
  };

  const labelStyle = {
    fontFamily:    "'Space Mono', monospace",
    fontSize:      "0.58rem",
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color:         "var(--fg40, rgba(26,26,26,0.4))",
    marginBottom:  "8px",
    display:       "block",
  };

  if (sent) {
    return (
      <LegalLayout title="Contact" subtitle="Get in touch">
        <div style={{ maxWidth: "520px" }}>
          <p style={{
            fontFamily:   "'Playfair Display', serif",
            fontSize:     "clamp(1.4rem,2.5vw,1.8rem)",
            fontWeight:   400,
            fontStyle:    "italic",
            color:        "var(--fg)",
            marginBottom: "16px",
          }}>
            Message received.
          </p>
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize:   "0.97rem",
            lineHeight: 1.85,
            color:      "var(--fg60, rgba(26,26,26,0.6))",
          }}>
            Thank you for reaching out. You'll hear back within 24–48 hours.
          </p>
        </div>
      </LegalLayout>
    );
  }

  return (
    <LegalLayout title="Contact" subtitle="We'd love to hear from you">
      <div style={{ maxWidth: "560px" }}>

        <p style={{
          fontFamily:   "'Inter', sans-serif",
          fontSize:     "0.97rem",
          lineHeight:   1.85,
          color:        "var(--fg60, rgba(26,26,26,0.6))",
          marginBottom: "48px",
        }}>
          Have a question, a technical issue, or just want to say something?
          Fill in the form below and we'll get back to you.
        </p>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "24px" }}
        >
          {/* Name */}
          <div>
            <label style={labelStyle}>Name</label>
            <input
              name="name"
              type="text"
              placeholder="Your full name"
              required
              value={form.name}
              onChange={handleChange}
              style={inputStyle}
              onFocus={(e)  => (e.target.style.borderColor = "var(--fg)")}
              onBlur={(e)   => (e.target.style.borderColor = "var(--fg20, rgba(26,26,26,0.2))")}
            />
          </div>

          {/* Email */}
          <div>
            <label style={labelStyle}>Email</label>
            <input
              name="email"
              type="email"
              placeholder="your@email.com"
              required
              value={form.email}
              onChange={handleChange}
              style={inputStyle}
              onFocus={(e)  => (e.target.style.borderColor = "var(--fg)")}
              onBlur={(e)   => (e.target.style.borderColor = "var(--fg20, rgba(26,26,26,0.2))")}
            />
          </div>

          {/* Phone */}
          <div>
            <label style={labelStyle}>Phone number <span style={{ opacity: 0.5 }}>(optional)</span></label>
            <input
              name="phone"
              type="tel"
              placeholder="+91 00000 00000"
              value={form.phone}
              onChange={handleChange}
              style={inputStyle}
              onFocus={(e)  => (e.target.style.borderColor = "var(--fg)")}
              onBlur={(e)   => (e.target.style.borderColor = "var(--fg20, rgba(26,26,26,0.2))")}
            />
          </div>

          {/* Comment */}
          <div>
            <label style={labelStyle}>Comment</label>
            <textarea
              name="comment"
              placeholder="Tell us what's on your mind..."
              required
              rows={6}
              value={form.comment}
              onChange={handleChange}
              style={{
                ...inputStyle,
                resize:     "vertical",
                lineHeight: 1.7,
                fontFamily: "'Inter', sans-serif",
                fontSize:   "0.9rem",
              }}
              onFocus={(e)  => (e.target.style.borderColor = "var(--fg)")}
              onBlur={(e)   => (e.target.style.borderColor = "var(--fg20, rgba(26,26,26,0.2))")}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              alignSelf:     "flex-start",
              background:    "var(--fg)",
              border:        "none",
              borderRadius:  "9999px",
              color:         "var(--bg)",
              fontFamily:    "'Space Mono', monospace",
              fontSize:      "0.62rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              padding:       "14px 32px",
              cursor:        loading ? "wait" : "pointer",
              opacity:       loading ? 0.7 : 1,
              transition:    "opacity 0.25s ease, transform 0.25s ease",
            }}
            onMouseEnter={(e) => { if (!loading) e.currentTarget.style.opacity = "0.8"; }}
            onMouseLeave={(e) => { if (!loading) e.currentTarget.style.opacity = "1"; }}
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </form>
      </div>
    </LegalLayout>
  );
}