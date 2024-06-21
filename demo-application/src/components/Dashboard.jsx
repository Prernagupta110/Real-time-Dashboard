import { Todos } from "./Todos";
import { BigCalendar } from "./ReactBigCalendar";
import "./Dashboard.css";

export const Dashboard = () => {
    return (
        <div className="Dashboard">
            <div className="container">
                <h1>Dashboard</h1>
            </div>
            <div className="container">
                <Todos showAdd={false} />
            </div>
            <div className="container">
                <BigCalendar modificationEnabled={false}/>
            </div>
        </div>
    );
}