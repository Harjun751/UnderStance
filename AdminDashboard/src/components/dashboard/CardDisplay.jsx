import { BiSolidCategoryAlt } from "react-icons/bi";
import { FaFlag } from "react-icons/fa";
import { GiInjustice } from "react-icons/gi";
import { MdQuiz } from "react-icons/md";


const iconMap = {
    questions: <MdQuiz />,
    categories: <BiSolidCategoryAlt />,
    parties: <FaFlag />,
    stances: <GiInjustice />,
};

const CardDisplay = ({ cards, dataMap }) => {
    return (
        <div className="stats-grid">
            {cards.map((card) => {
                const init_data = dataMap[card.dataType] || [];
                let cardValue = 0;

                let data = init_data;
                
                console.log(data)

                if (card.filter !== null) {
                    data = data.filter(item =>
                        card.filter.every(f => String(item[f.filterField]) === String(f.filterValue))
                    );
                }

                if (card.action === "count") {
                    cardValue = data.length;
                } else if (card.action === "countUnique") {
                    const uniqueValues = new Set(data.map((item) => item[card.field]));
                    cardValue = uniqueValues.size;
                }

                return (
                    <div className="card" key={card}>
                        <div className="card-content">
                            <div className="text-block">
                                <p className="card-title">{card.title}</p>
                                <h3 className="card-number">{cardValue}</h3>
                            </div>
                            <div className={`icon-container ${card.color}`}>
                                {iconMap[card.dataType]}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    )
}

export default CardDisplay;

