import * as React from "react";

interface FooterSection {
  title: string;
  links: string[];
}

const footerData: FooterSection[] = [
  {
    title: "Support",
    links: [
      "Help Center",
      "Get help with a safety issue",
      "Air cover",
      "Anti-discrimination",
      "Disability support",
      "Cancellation options",
      "Report neighbourhood concern",
    ],
  },
  {
    title: "Hosting",
    links: [
      "Airbnb your home",
      "AirCover for Hosts",
      "Hosting resources",
      "Community forum",
      "Hosting responsibly",
    ],
  },
  {
    title: "Airbnb",
    links: [
      "Newsroom",
      "New features",
      "Careers",
      "Investors",
      "Airbnb.org emergency stays",
    ],
  },
];

const Footer: React.FC = () => {
  return (
    <footer className="footer-wrapper">
      <div className="footer-content">
        {/* Top Section: Links Grid */}
        <div className="footer-grid">
          {footerData.map((section) => (
            <div key={section.title} className="footer-column">
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

        {/* Bottom Section: Info and Socials */}
        <div className="footer-bottom">
          <div className="footer-bottom-left">
            <span className="copyright">
              &copy; {new Date().getFullYear()} Airbnb, Inc.
            </span>
            <ul className="bottom-legal-links">
              <li>Privacy</li>
              <li>Terms</li>
              <li>Sitemap</li>
              <li>Company details</li>
            </ul>
          </div>

          <div className="footer-bottom-right">
            <div className="language-currency">
              <svg
                viewBox="0 0 24 24"
                className="globe-icon"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582"
                />
              </svg>
              <span className="bold-link">English (IN)</span>
              <span className="bold-link">₹ INR</span>
            </div>

            <div className="footer-socials">
              <svg viewBox="0 0 50 50" className="social-icon">
                <path d="M41,4H9C6.24,4,4,6.24,4,9v32c0,2.76,2.24,5,5,5h32c2.76,0,5-2.24,5-5V9C46,6.24,43.76,4,41,4z M37,19h-2c-2.14,0-3,0.5-3,2 v3h5l-1,5h-4v15h-5V29h-4v-5h4v-3c0-4,2-7,6-7c2.9,0,4,1,4,1V19z"></path>
              </svg>
              <svg viewBox="0 0 50 50" className="social-icon">
                <path d="M 11 4 C 7.134 4 4 7.134 4 11 L 4 39 C 4 42.866 7.134 46 11 46 L 39 46 C 42.866 46 46 42.866 46 39 L 46 11 C 46 7.134 42.866 4 39 4 L 11 4 z M 13.085938 13 L 21.023438 13 L 26.660156 21.009766 L 33.5 13 L 36 13 L 27.789062 22.613281 L 37.914062 37 L 29.978516 37 L 23.4375 27.707031 L 15.5 37 L 13 37 L 22.308594 26.103516 L 13.085938 13 z"></path>
              </svg>
              <svg viewBox="0 0 50 50" className="social-icon">
                <path d="M 16 3 C 8.83 3 3 8.83 3 16 L 3 34 C 3 41.17 8.83 47 16 47 L 34 47 C 41.17 47 47 41.17 47 34 L 47 16 C 47 8.83 41.17 3 34 3 L 16 3 z M 37 11 C 38.1 11 39 11.9 39 13 C 39 14.1 38.1 15 37 15 C 35.9 15 35 14.1 35 13 C 35 11.9 35.9 11 37 11 z M 25 14 C 31.07 14 36 18.93 36 25 C 36 31.07 31.07 36 25 36 C 18.93 36 14 31.07 14 25 C 14 18.93 18.93 14 25 14 z M 25 16 C 20.04 16 16 20.04 16 25 C 16 29.96 20.04 34 25 34 C 29.96 34 34 29.96 34 25 C 34 20.04 29.96 16 25 16 z"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
