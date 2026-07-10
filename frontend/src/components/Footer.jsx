import { useState } from 'react';
import { FaHeart, FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerStyle = {
    marginTop: '3rem',
    borderTop: '1px solid rgba(71, 85, 105, 0.5)',
    backgroundColor: 'rgba(2, 6, 23, 0.8)',
    backdropFilter: 'blur(10px)',
  };

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '3rem 1.5rem',
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '2rem',
    marginBottom: '2rem',
  };

  const sectionHeadingStyle = {
    fontWeight: 'bold',
    color: 'white',
    marginBottom: '0.5rem',
    fontSize: '1.125rem',
  };

  const descriptionStyle = {
    fontSize: '0.875rem',
    color: '#94a3b8',
    marginBottom: '1rem',
  };

  const socialContainerStyle = {
    display: 'flex',
    gap: '0.75rem',
  };

  const socialIconStyle = {
    width: '2rem',
    height: '2rem',
    borderRadius: '0.5rem',
    backgroundColor: '#1e293b',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#94a3b8',
    fontSize: '0.875rem',
    transition: 'all 0.2s ease',
    textDecoration: 'none',
  };

  const socialIconHoverStyle = {
    backgroundColor: '#2563eb',
    color: 'white',
  };

  const columnHeadingStyle = {
    fontWeight: '600',
    color: 'white',
    marginBottom: '1rem',
    fontSize: '0.875rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  };

  const ulStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    listStyle: 'none',
    padding: 0,
    margin: 0,
  };

  const liStyle = {
    fontSize: '0.875rem',
  };

  const linkStyle = {
    color: '#94a3b8',
    textDecoration: 'none',
    transition: 'color 0.3s ease',
  };

  const linkHoverStyle = {
    color: '#60a5fa',
  };

  const dividerStyle = {
    borderTop: '1px solid rgba(71, 85, 105, 0.3)',
    paddingTop: '2rem',
    marginTop: '2rem',
  };

  const bottomContainerStyle = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '1rem',
    flexWrap: 'wrap',
  };

  const copyrightStyle = {
    fontSize: '0.875rem',
    color: '#64748b',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  };

  const footerBadgeStyle = {
    fontSize: '0.75rem',
    color: '#475569',
  };

  const SocialLink = ({ href, icon: Icon }) => {
    const [isHovering, setIsHovering] = useState(false);
    return (
      <a
        href={href}
        style={{
          ...socialIconStyle,
          ...(isHovering && socialIconHoverStyle),
        }}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <Icon />
      </a>
    );
  };

  const FooterLink = ({ href, children }) => {
    const [isHovering, setIsHovering] = useState(false);
    return (
      <a
        href={href}
        style={{
          ...linkStyle,
          ...(isHovering && linkHoverStyle),
        }}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {children}
      </a>
    );
  };

  return (
    <footer style={footerStyle}>
      <div style={containerStyle}>
        <div style={gridStyle}>
          {/* Brand */}
          <div>
            <h3 style={sectionHeadingStyle}>DoctorTrust</h3>
            <p style={descriptionStyle}>Building trust and safety in healthcare through verified profiles and transparent communication.</p>
            <div style={socialContainerStyle}>
              <SocialLink href="#" icon={FaFacebook} />
              <SocialLink href="#" icon={FaTwitter} />
              <SocialLink href="#" icon={FaLinkedin} />
              <SocialLink href="#" icon={FaInstagram} />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={columnHeadingStyle}>Platform</h4>
            <ul style={ulStyle}>
              <li style={liStyle}>
                <FooterLink href="/">Home</FooterLink>
              </li>
              <li style={liStyle}>
                <FooterLink href="/doctors">Find Doctors</FooterLink>
              </li>
              <li style={liStyle}>
                <FooterLink href="/support">Support</FooterLink>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 style={columnHeadingStyle}>Company</h4>
            <ul style={ulStyle}>
              <li style={liStyle}>
                <FooterLink href="#">About Us</FooterLink>
              </li>
              <li style={liStyle}>
                <FooterLink href="#">Blog</FooterLink>
              </li>
              <li style={liStyle}>
                <FooterLink href="#">Careers</FooterLink>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 style={columnHeadingStyle}>Legal</h4>
            <ul style={ulStyle}>
              <li style={liStyle}>
                <FooterLink href="#">Privacy Policy</FooterLink>
              </li>
              <li style={liStyle}>
                <FooterLink href="#">Terms of Service</FooterLink>
              </li>
              <li style={liStyle}>
                <FooterLink href="#">Contact</FooterLink>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div style={dividerStyle}>
          <div style={bottomContainerStyle}>
            <p style={copyrightStyle}>
              © {currentYear} DoctorTrust Network. Made with{' '}
              <FaHeart style={{ color: '#ef4444', fontSize: '0.75rem' }} /> for healthcare professionals.
            </p>
            <p style={footerBadgeStyle}>Safety • Verification • Support</p>
            <div className="dev-credit" style={{ marginTop: '0.5rem' }}>
              Made with ♥ by <a href="https://github.com/Chinmay0004R" target="_blank" rel="noopener noreferrer" aria-label="Chinmay Murkar GitHub" style={{ color: '#94a3b8', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ verticalAlign: 'middle', marginRight: '6px' }}>
                  <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.87 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.69-3.88-1.54-3.88-1.54-.53-1.36-1.3-1.72-1.3-1.72-1.06-.72.08-.71.08-.71 1.17.08 1.79 1.2 1.79 1.2 1.04 1.78 2.73 1.27 3.4.97.11-.76.41-1.27.75-1.56-2.55-.29-5.23-1.28-5.23-5.72 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.47.11-3.07 0 0 .97-.31 3.18 1.18a11.07 11.07 0 0 1 2.9-.39c.99 0 1.99.13 2.9.39 2.2-1.49 3.17-1.18 3.17-1.18.63 1.6.23 2.78.11 3.07.74.81 1.19 1.84 1.19 3.1 0 4.45-2.69 5.43-5.25 5.71.42.36.8 1.08.8 2.18 0 1.57-.01 2.83-.01 3.22 0 .31.21.68.8.56C20.71 21.39 24 17.08 24 12 24 5.73 18.27.5 12 .5z"/>
                </svg>
                Chinmay Murkar
              </a>
              <span style={{ marginLeft: '0.5rem', color: '#64748b' }}>This is my GitHub link</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
