import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import TicketDetail from './pages/TicketDetail';
import { TicketProvider } from './context/TicketContext';

function App() {
    return (
        <TicketProvider>
            <Router>
                <Layout>
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/ticket/:id" element={<TicketDetail />} />
                    </Routes>
                </Layout>
            </Router>
        </TicketProvider>
    );
}

export default App;
