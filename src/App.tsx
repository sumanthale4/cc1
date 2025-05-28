import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import DashboardPage from './pages/DashboardPage';
import TransactionReviewPage from './pages/TransactionReviewPage';
import HumanReviewPage from './pages/HumanReviewPage';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/transactions" element={<TransactionReviewPage />} />
          <Route path="/human-review" element={<HumanReviewPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;