import "./FeatureSection.css";
import { SiGoogleanalytics } from "react-icons/si";
import { FaBullseye } from "react-icons/fa6";
import { ImTree } from "react-icons/im";
import { MdQuiz } from "react-icons/md";

const FeatureSection = () => {
    return (
        <div className="features-section" id="features">
            <div className="features-container">
                <div className="features-header">
                    <h2 className="features-subtitle">Features</h2>
                    <p className="features-title">How UnderStance Works</p>
                </div>

                <div className="features-list">
                    <div className="feature-item">
                        <div className="feature-icon">
                            <i className="icon-white icon-lg"><MdQuiz /></i>
                        </div>
                        <div className="feature-text">
                            <h3 className="feature-heading">Simple Quiz</h3>
                            <p className="feature-description">
                                Our quiz covers all major political issue! Each question ...... add more in post
                            </p>
                        </div>
                    </div>

                    <div className="feature-item">
                        <div className="feature-icon">
                            <i className="icon-white icon-lg"><SiGoogleanalytics /></i>
                        </div>
                        <div className="feature-text">
                            <h3 className="feature-heading">
                                Alignment Breakdown
                            </h3>
                            <p className="feature-description">
                                Receive a personalized breakdown of your political leanings with clear visualizations!
                            </p>
                        </div>
                        
                    </div>

                    <div className="feature-item">
                        <div className="feature-icon">
                            <i className="icon-white icon-lg"><ImTree /></i>
                        </div>
                        <div className="feature-text">
                            <h3 className="feature-heading">
                                Stance Breakdown
                            </h3>
                            <p className="feature-description">
                                Read & Explore the various parties reply to each question to gain a better understanding!
                            </p>
                        </div>
                    </div>

                    <div className="feature-item">
                        <div className="feature-icon">
                            <i className="icon-white icon-lg"><FaBullseye /></i>
                        </div>
                        <div className="feature-text">
                            <h3 className="feature-heading">Accuracy Focused</h3>
                            <p className="feature-description">
                                Fine tune each question’s importance based on your personal values!
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FeatureSection;