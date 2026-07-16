import { FaHeart, FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Brand */}
          <div>
            <h3 className="footer-heading">DoctorTrust</h3>
            <p className="footer-description">Building trust and safety in healthcare through verified profiles and transparent communication.</p>
            <div className="social-links">
              <a href="#" className="social-link" aria-label="Facebook">
                <FaFacebook />
              </a>
              <a href="#" className="social-link" aria-label="Twitter">
                <FaTwitter />
              </a>
              <a href="#" className="social-link" aria-label="LinkedIn">
                <FaLinkedin />
              </a>
              <a href="#" className="social-link" aria-label="Instagram">
                <FaInstagram />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="footer-column-heading">Platform</h4>
            <ul className="footer-list">
              <li className="footer-item">
                <a href="/" className="footer-link">Home</a>
              </li>
              <li className="footer-item">
                <a href="/doctors" className="footer-link">Find Doctors</a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="footer-column-heading">Company</h4>
            <ul className="footer-list">
              <li className="footer-item">
                <a href="#" className="footer-link">About Us</a>
              </li>
              <li className="footer-item">
                <a href="#" className="footer-link">Blog</a>
              </li>
              <li className="footer-item">
                <a href="#" className="footer-link">Careers</a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="footer-column-heading">Legal</h4>
            <ul className="footer-list">
              <li className="footer-item">
                <a href="#" className="footer-link">Privacy Policy</a>
              </li>
              <li className="footer-item">
                <a href="#" className="footer-link">Terms of Service</a>
              </li>
              <li className="footer-item">
                <a href="#" className="footer-link">Contact</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="footer-divider">
          <div className="footer-bottom">
            <p className="footer-copy">
              © {currentYear} DoctorTrust Network. Made with{' '}
              <FaHeart className="footer-heart-icon" /> for healthcare professionals.
            </p>
            <p className="footer-badge">Safety • Verification • Response</p>
            <div className="dev-credit">
              Made with ♥ by <a href="https://github.com/Chinmay0004R" target="_blank" rel="noopener noreferrer" aria-label="Chinmay Murkar GitHub" className="dev-credit-link">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="dev-credit-icon">
                  <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.87 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.69-3.88-1.54-3.88-1.54-.53-1.36-1.3-1.72-1.3-1.72-1.06-.72.08-.71.08-.71 1.17.08 1.79 1.2 1.79 1.2 1.04 1.78 2.73 1.27 3.4.97.11-.76.41-1.27.75-1.56-2.55-.29-5.23-1.28-5.23-5.72 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.47.11-3.07 0 0 .97-.31 3.18 1.18a11.07 11.07 0 0 1 2.9-.39c.99 0 1.99.13 2.9.39 2.2-1.49 3.17-1.18 3.17-1.18.63 1.6.23 2.78.11 3.07.74.81 1.19 1.84 1.19 3.1 0 4.45-2.69 5.43-5.25 5.71.42.36.8 1.08.8 2.18 0 1.57-.01 2.83-.01 3.22 0 .31.21.68.8.56C20.71 21.39 24 17.08 24 12 24 5.73 18.27.5 12 .5z"/>
                </svg>
                Chinmay Murkar
              </a>
              <span className="dev-credit-note">This is my GitHub link</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
