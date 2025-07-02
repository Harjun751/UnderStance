import { Link } from "react-router-dom";
import "./Footer.css";
import { FaGithub, FaGoogleDrive, FaYoutube } from "react-icons/fa";

const Footer = () => {
    return (
        <footer class="footer">
            <div class="footer-container">
                <div class="footer-grid">
                    <div class="footer-column">
                        <h3 class="footer-heading">Navigation</h3>
                        <ul class="footer-list">
                            <Link to="/">
                                <li>
                                    <div class="footer-link">Home</div>
                                </li>
                            </Link>
                            <Link to="/quiz">
                                <li>
                                    <div class="footer-link">Quiz</div>
                                </li>
                            </Link>
                            <Link to="/read-stances">
                                <li>
                                    <div class="footer-link">Read Stances</div>
                                </li>
                            </Link>
                            {/* add actual link & page next time, for now enjoy what i've left behind */}
                            <Link>
                                <li>About</li>
                            </Link>
                        </ul>
                    </div>

                    <div class="footer-column">
                        <h3 class="footer-heading">Development</h3>
                        <ul class="footer-list">
                            {/* add actual link & page next time, for now enjoy what i've left behind */}
                            <Link>
                                <li>
                                    <a
                                        href="https://www.youtube.com/watch?v=JO334h_PhuU&pp=ygUSY29vbCBndXkgbWVtZSBzb25n0gcJCd4JAYcqIYzv"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        class="footer-link"
                                    >
                                        About Us
                                    </a>
                                </li>
                            </Link>
                            <Link>
                                <li>
                                    <a
                                        href="https://docs.google.com/spreadsheets/d/1amv7Aa4VcDngvbswcU4n80nv4tjPsn8oJAOVqbWXiyI/edit?usp=sharing"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        class="footer-link"
                                    >
                                        Project Log
                                    </a>
                                </li>
                            </Link>
                        </ul>
                    </div>

                    <div class="footer-column">
                        <h3 class="footer-heading">Legal</h3>
                        <ul class="footer-list">
                            {/* add actual link & page next time, for now enjoy what i've left behind */}
                            <Link>
                                <li>
                                    <a
                                        href="https://www.youtube.com/watch?v=OyDyOweu-PA&pp=ygUKcG9saXNoIGNvdw%3D%3D"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        class="footer-link"
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
                                        class="footer-link"
                                    >
                                        Terms
                                    </a>
                                </li>
                            </Link>
                        </ul>
                    </div>

                    <div class="footer-column">
                        <h3 class="footer-heading">Connect</h3>
                        <div class="footer-social">
                            <a
                                href="https://github.com/Harjun751/UnderStance"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="footer-icon"
                            >
                                <FaGithub />
                            </a>
                            {/* add actual link next time, for now enjoy what i've left behind */}
                            <a
                                href="https://drive.google.com/drive/folders/1ng0SbyCBXA9R_t_X6sa0VSiRyDYCwJeu?usp=sharing"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="footer-icon"
                            >
                                <FaGoogleDrive />
                            </a>
                            <a
                                href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="footer-icon"
                            >
                                <FaYoutube />
                            </a>
                        </div>
                        <div class="footer-comment">
                            <p class="footer-note">
                                HEY I JUST MET YOU <br />
                                AND THIS IS CRAZY <br />
                                BUT HERE'S MY NUMBER <br />
                                SO CALL ME MAYBE
                            </p>
                        </div>
                    </div>
                </div>

                <div class="footer-bottom">
                    <p>&copy; 2025 UnderStance</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
