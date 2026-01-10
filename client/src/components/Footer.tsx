import * as React from "react";

interface FooterSection {
  title: string;
  links: string[];
}

const footerData: FooterSection[] = [
  {
    title: "Support",
    links: ["Help Center", "Get help with a safety issue", "Air cover"],
  },
  {
    title: "Hosting",
    links: ["Airbnb your home", "Hosting resources"],
  },
  {
    title: "Airbnb",
    links: ["Newsroom", "Careers", "Investors"],
  },
];

const Footer: React.FC = () => {
  return (
    <footer className="footer-wrapper">
      <div className="footer-content">
        {/* Top Grid */}
        <div className="footer-grid">
          {footerData.map((section) => (
            <div key={section.title}>
              <h3 className="footer-column-title">{section.title}</h3>
              <ul className="footer-links">
                {section.links.map((link) => (
                  <li key={link} className="footer-link-item">
                    {link}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="footer-divider"></div>

        {/* Bottom Section */}
        <div className="footer-bottom">
          <div className="footer-bottom-left">
            <span>&copy; {new Date().getFullYear()} Airbnb, Inc.</span>
            <ul className="bottom-legal-links">
              <li>Privacy</li>
              <li>Terms</li>
              <li>Sitemap</li>
              <li>Company details</li>
            </ul>
          </div>

          <div className="footer-bottom-right">
            <div className="language-currency">
              <span>English (IN)</span>
              <span>₹ INR</span>
            </div>
            {/* Remove heavy social SVGs for better LCP */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
