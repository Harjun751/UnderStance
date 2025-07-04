import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format, isAfter, isBefore, isEqual, parse, startOfDay } from "date-fns";
import "./AnalyticsSection.css";
import "./Dashboard.css"
import { FaUsers } from "react-icons/fa6";
import { TbUsersPlus } from "react-icons/tb";
import { RiNotificationBadgeFill } from "react-icons/ri";
import { useState, useMemo } from "react";

const AnalyticsSection = ({ data }) => {
    if (!data || data.length === 0) return <div className="section-container">No data available</div>;
    
    //Format dates and parse numbers
    const parsedData = data.map((item) => {
        const rawDate = parse(item.date, "yyyyMMdd", new Date());
        const dateObj = startOfDay(rawDate); // strip time
        return {
            ...item,
            dateObj,
            dateFormatted: format(dateObj, "MMM dd"),
            activeUsers: parseInt(item.activeUsers, 10),
            newUsers: parseInt(item.newUsers, 10),
            screenPageViews: parseInt(item.screenPageViews, 10),
        };
    });

     //Initial dates: Full range from data
    const allDates = parsedData.map(d => d.dateObj);
    const timestamps = allDates.map(d => d.getTime());
    const minDate = format(new Date(Math.min(...timestamps)), "yyyy-MM-dd");
    const maxDate = format(new Date(Math.max(...timestamps)), "yyyy-MM-dd");

    const [fromDate, setFromDate] = useState(minDate);
    const [toDate, setToDate] = useState(maxDate);

    //Filter data based on selected range
    const filteredData = useMemo(() => {
        const from = startOfDay(new Date(fromDate));
        const to = startOfDay(new Date(toDate));
        return parsedData.filter(d =>
            (isAfter(d.dateObj, from) || isEqual(d.dateObj, from)) &&
            (isBefore(d.dateObj, to) || isEqual(d.dateObj, to))
        );
    }, [fromDate, toDate, parsedData]);

    //Calculate statistics
    const totalActiveUsers = filteredData.reduce((sum, d) => sum + d.activeUsers, 0);
    const totalNewUsers = filteredData.reduce((sum, d) => sum + d.newUsers, 0);
    const totalPageViews = filteredData.reduce((sum, d) => sum + d.screenPageViews, 0);

    return (
        <div className="section-container">
            <div className="section-header">
                <h3>Website Traffic</h3>
            </div>
            <div className="analytics-grid">
                <div className="analytics-content">
                    <div className="analytics-content-item">
                        <div className="icon-container blue">
                            <FaUsers />
                        </div>
                        <div className="stats-content">
                            <p className="stats-title">Total Users</p>
                            <h4 className="stats-value">{totalActiveUsers}</h4>
                        </div>
                    </div>
                    <div className="analytics-content-item">
                        <div className="icon-container green">
                            <TbUsersPlus />
                        </div>
                        <div className="stats-content">
                            <p className="stats-title">New Users</p>
                            <h4 className="stats-value">{totalNewUsers}</h4>
                        </div>
                    </div>
                    <div className="analytics-content-item">
                        <div className="icon-container yellow">
                            <RiNotificationBadgeFill />
                        </div>
                        <div className="stats-content">
                            <p className="stats-title">Total Page Views</p>
                            <h4 className="stats-value">{totalPageViews}</h4>
                        </div>
                    </div>
                </div>
                <div className="analytics-settings">
                    <div className="settings-item">
                        <label>
                            From:
                        </label>
                        <input
                            type="date"
                            value={fromDate}
                            min={minDate}
                            max={toDate}
                            onChange={(e) => setFromDate(e.target.value)}
                        />
                    </div>
                    <div className="settings-item">
                        <label>
                            To:
                        </label>
                        <input
                            type="date"
                            value={toDate}
                            min={fromDate}
                            max={maxDate}
                            onChange={(e) => setToDate(e.target.value)}
                        />
                    </div>
                </div>
                <div className="analytics-graph">
                    <h4><u>Active Users Over Time</u></h4>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={filteredData}>
                            <CartesianGrid vertical={false} horizontal={true}/>
                            <XAxis dataKey="dateFormatted" />
                            <YAxis/>
                            <Tooltip />
                            <Line type="monotone" dataKey="activeUsers" stroke="#8884d8" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    )
}

export default AnalyticsSection;