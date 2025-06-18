import './HeroSection.css';
import { Link } from 'react-router-dom';

const HeroSection = () => {
    return (
        <div className="hero-section">
            <div className="hero-container">
                <h1 className="hero-title">
                    Understand your Political Stance!
                </h1>
                <p className="hero-subtitle">
                    Take our simple Quiz and explore detailed political positions to
                    understand your political stance today!
                </p>
                <div className="hero-buttons">
                    <Link to="/quiz">
                        <button type="button" className="btn btn-outline">
                            Take discover Now!
                        </button>
                    </Link>
                    <Link to="/read-stances">
                        <button type="button" className="btn btn-secondary">
                            Explore Stances
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;