import "./App.css";
import { BigCalendar } from "./components/ReactBigCalendar";
import { Dashboard } from "./components/Dashboard";
import { Todos } from "./components/Todos";
import {
  BrowserRouter as Router,
  Routes, Route, Link
} from 'react-router-dom'

import { QueryClient, QueryClientProvider } from './cross-window-query-library'

const queryClient = new QueryClient();

function App() {
  return (
      <div className="App">
          <Router>
            <div className="container">
              <div className="navigation">
                <Link to="/">Dashboard</Link>
                <Link to="/todos">Todos</Link>
                <Link to="/calendar">Calendar</Link>
                <Link to="/notes">Notes</Link>
              </div>
            </div>
            <div className="container">
              <QueryClientProvider client={queryClient}>
                <Routes>
                  <Route path="/" element={<Dashboard/>}/>
                  <Route path="/todos" element={<Todos showAdd={true} />}/>
                  <Route path="/calendar" element={<BigCalendar modificationEnabled={true}/>}/>
                  <Route path="/notes" />
                </Routes>
              </QueryClientProvider>
            </div>
          </Router>
        </div>
  );
}

export default App;