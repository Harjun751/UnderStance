import { Link } from "react-router-dom";
import "./Footer.css";
import { FaGithub, FaGoogleDrive, FaYoutube } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-grid">
                    <div className="footer-column">
                        <h3 className="footer-heading">Navigation</h3>
                        <ul className="footer-list">
                            <Link to="/">
                                <li>
                                    <div className="footer-link">Home</div>
                                </li>
                            </Link>
                            <Link to="/quiz">
                                <li>
                                    <div className="footer-link">Quiz</div>
                                </li>
                            </Link>
                            <Link to="/read-stances">
                                <li>
                                    <div className="footer-link">
                                        Read Stances
                                    </div>
                                </li>
                            </Link>
                            {/* add actual link & page next time, for now enjoy what i've left behind */}
                            <Link to="/">
                                <li>
                                    <div className="footer-link">About</div>
                                </li>
                            </Link>
                        </ul>
                    </div>

                    <div className="footer-column">
                        <h3 className="footer-heading">Development</h3>
                        <ul className="footer-list">
                            {/* add actual link & page next time, for now enjoy what i've left behind */}
                            <li>
                                <a
                                    href="https://www.youtube.com/watch?v=JO334h_PhuU&pp=ygUSY29vbCBndXkgbWVtZSBzb25n0gcJCd4JAYcqIYzv"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="footer-link"
                                >
                                    About Us
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://docs.google.com/spreadsheets/d/1amv7Aa4VcDngvbswcU4n80nv4tjPsn8oJAOVqbWXiyI/edit?usp=sharing"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="footer-link"
                                >
                                    Project Log
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* <div className="footer-column">
                        <h3 className="footer-heading">Legal</h3>
                        <ul className="footer-list">
                            <Link>
                                <li>
                                    <a
                                        href="https://www.youtube.com/watch?v=OyDyOweu-PA&pp=ygUKcG9saXNoIGNvdw%3D%3D"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="footer-link"
                                    >
                                        Privacy
                                    </a>
                                </li>
                            </Link>
                            <Link>
                                <li>
                                    <a
                                        href="https://www.youtube.com/watch?v=wRRsXxE1KVY&pp=ygUUam9obiBjZW5hIHByYW5rIGNhbGw%3D"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="footer-link"
                                    >
                                        Terms
                                    </a>
                                </li>
                            </Link>
                        </ul>
                    </div> */}

                    <div className="footer-column connect">
                        <h3 className="footer-heading">Connect</h3>
                        <div className="footer-social">
                            <a
                                href="https://github.com/Harjun751/UnderStance"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="footer-icon"
                            >
                                <FaGithub />
                            </a>
                            {/* add actual link next time, for now enjoy what i've left behind */}
                            <a
                                href="https://docs.google.com/document/d/1z0Gtlh0FeqNAVAOSh_NjCHuAHqm-_sV4XCGCb14MrWI/edit?usp=sharing"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="footer-icon"
                            >
                                <FaGoogleDrive />
                            </a>
                            <a
                                href="https://drive.google.com/file/d/1C9GSJBkcab39OmJ8_tm7-54eaIUD_S3s/view?usp=sharing"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="footer-icon"
                            >
                                <FaYoutube />
                            </a>
                        </div>
                        {/* <div className="footer-comment">
                            <p className="footer-note">
                                HEY I JUST MET YOU <br />
                                AND THIS IS CRAZY <br />
                                BUT HERE'S MY NUMBER <br />
                                SO CALL ME MAYBE
                            </p>
                        </div> */}
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; 2025 UnderStance</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
