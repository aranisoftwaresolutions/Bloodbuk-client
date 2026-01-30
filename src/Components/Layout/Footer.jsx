import { Call, Facebook, Instagram, Mail, X, YouTube } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { fetchCompanyInfo } from '../../redux/slices/companyDetailsSlices';
import { Link } from 'react-router-dom';
import { logout } from '../../redux/slices/userSlices';

const Footer = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { companys } = useSelector((state) => state.company);

  useEffect(() => {
    dispatch(fetchCompanyInfo());
  }, [dispatch]);

  return (
    <>
      {companys.map((company, index) => (
        <div className="bg-gray-900 text-[#c6b4b4] w-full py-6 px-4  tracking-[3px] font-sans uppercase"
          key={index}
        >
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-8">
            {/* Get in Touch */}
            <div className="space-y-4">
              <img
                src=""
                className="w-32 h-auto mb-4 object-contain"
                alt="Company Logo"
              />
              <p className="text-[13px] text-[#898585] leading-relaxed max-w-xs tracking-[3px] font-sans">
                {"We'd"} love to hear from you! For inquiries, collaborations, or support,
                feel free to reach out using the details below.
              </p>
            </div>

            {/* Help Links */}
            <div className="space-y-4">
              <h3 className="text-white uppercase  text-sm font-medium tracking-[3px] font-sans">Help</h3>
              <ul className="!list-none p-0 m-0 space-y-3 text-[13px]">
                <li>
                  <Link
                    to="/faq"
                    className="text-[#898585] hover:text-white flex items-center gap-2 transition-all hover:translate-y-0.5 tracking-[3px] font-sans"
                  >
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link
                    to="/accessibility-statement"
                    className="text-[#898585] hover:text-white flex items-center gap-2 transition-all hover:translate-y-0.5 tracking-[3px] font-sans"
                  >
                    Accessibility Statement
                  </Link>
                </li>
                <li>
                  <Link
                    to="/services"
                    className="text-[#898585] hover:text-white flex items-center gap-2 transition-all hover:translate-y-0.5 tracking-[3px] font-sans"
                  >
                    Services
                  </Link>
                </li>
                <li>
                  <Link
                    to="/ordering"
                    className="text-[#898585] hover:text-white flex items-center gap-2 transition-all hover:translate-y-0.5 tracking-[3px] font-sans"
                  >
                    Ordering
                  </Link>
                </li>
                <li>
                  <Link
                    to="/shipping-policy"
                    className="text-[#898585] hover:text-white  flex items-center gap-2 transition-all hover:translate-y-0.5 tracking-[3px] font-sans"
                  >
                    Shipping Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/privacy-policy"
                    className="text-[#898585] hover:text-white flex items-center gap-2 transition-all hover:translate-y-0.5 tracking-[3px] font-sans"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact-us"
                    className="text-[#898585] hover:text-white flex items-center gap-2 transition-all hover:translate-y-0.5 tracking-[3px] font-sans"
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* My Account */}
            <div className="space-y-4">
              <h3 className="text-white uppercase  text-sm font-medium tracking-[3px] font-sans">My Account</h3>
              <ul className="!list-none p-0 m-0 space-y-3 text-[13px] ">
                {user ? (
                  <>
                    <li>
                      <Link
                        to="/profile"
                        className="text-[#898585] hover:text-white flex items-center gap-2 transition-all hover:translate-y-0.5 tracking-[3px] font-sans"
                      >
                        Profile
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/orders"
                        className="text-[#898585] hover:text-white flex items-center gap-2 transition-all hover:translate-y-0.5 tracking-[3px] font-sans"
                      >
                        Orders
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={() => dispatch(logout())}
                        className="text-[#898585] hover:text-white flex items-center tracking-[3px] font-sans uppercase gap-2 transition-all hover:translate-y-0.5 w-full"
                      >
                        Logout
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link
                        to="/sign-in"
                        className="text-[#898585] hover:text-white flex items-center gap-2 transition-all hover:translate-y-0.5"
                      >
                        Sign In
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/sign-up"
                        className="text-[#898585] hover:text-white flex items-center gap-2 transition-all hover:translate-y-0.5"
                      >
                        Sign Up
                      </Link>
                    </li>
                  </>
                )}
              </ul>

              <div className="pt-6">
                <h3 className="text-white uppercase tracking-wider text-sm font-medium pb-3">General Inquiries:</h3>
                <ul className="!list-none p-0 m-0 space-y-3 text-[13px]">
                  <li className="flex items-center gap-3 text-[#898585] ">
                    <Mail className="text-white text-lg" />
                    <span className='flex items-center tracking-[3px] font-sans gap-3'>Email: <p className='tracking-[3px] font-sans lowercase'>{company.email}</p></span>
                  </li>
                  <li className="flex items-center gap-3 text-[#898585]">
                    <Call className="text-white text-lg" />
                    <span className='tracking-[3px] font-sans'>Phone: {company.phone}</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Follow Us */}
            <div className="space-y-4">
              <h3 className="text-white uppercase  text-sm font-medium tracking-[3px] font-sans">Follow Us</h3>
              <ul className="!list-none p-0 m-0 space-y-3 text-[13px]">
                <li>
                  <a
                    href={company.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#898585] hover:text-[#4267B2] flex items-center gap-3 group transition-all"
                  >
                    <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center group-hover:bg-[#4267B2] transition-colors">
                      <Facebook className="group-hover:text-white transition-colors" />
                    </div>
                    <span className="group-hover:text-white transition-colors tracking-[3px] font-sans">Meta</span>
                  </a>
                </li>
                <li>
                  <a
                    href={company.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#898585] hover:text-[#1DA1F2] flex items-center gap-3 group transition-all"
                  >
                    <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center group-hover:bg-[#1DA1F2] transition-colors">
                      <X className="group-hover:text-white transition-colors" />
                    </div>
                    <span className="group-hover:text-white transition-colors tracking-[3px] font-sans">Twitter-X</span>
                  </a>
                </li>
                <li>
                  <a
                    href={company.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#898585] hover:text-[#E1306C] flex items-center gap-3 group transition-all"
                  >
                    <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center group-hover:bg-[#E1306C] transition-colors">
                      <Instagram className="group-hover:text-white transition-colors" />
                    </div>
                    <span className="group-hover:text-white transition-colors tracking-[3px] font-sans">Instagram</span>
                  </a>
                </li>
                <li>
                  <a
                    href={company.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#898585] hover:text-[#FF0000] flex items-center gap-3 group transition-all"
                  >
                    <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center group-hover:bg-[#FF0000] transition-colors">
                      <YouTube className="group-hover:text-white transition-colors" />
                    </div>
                    <span className="group-hover:text-white transition-colors tracking-[3px] font-sans">YouTube</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      ))}

      <footer className="bg-gray-800 py-2 shadow-[0_4px_8px_rgba(0,0,0,0.2)]">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-[10px] text-[#868383] tracking-[3px] font-sans">
            Copyright © 2025. All Rights Reserved.
          </p>
        </div>
      </footer>
    </>
  );
};

export default Footer;
