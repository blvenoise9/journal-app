import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout.tsx';
import { Home } from './pages/Home.tsx';
import { NewEntry } from './pages/NewEntry.tsx';
import { EditEntry } from './pages/EditEntry.tsx';
import { Memories } from './pages/Memories.tsx';
import { EntryDetail } from './pages/EntryDetail.tsx';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/new" element={<NewEntry />} />
            <Route path="/edit/:id" element={<EditEntry />} />
            <Route path="/entry/:id" element={<EntryDetail />} />
            <Route path="/memories" element={<Memories />} />
          </Routes>
        </Layout>
      </div>
    </Router>
  );
}

export default App; 