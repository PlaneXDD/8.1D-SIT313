import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';  // Import Navigate for redirection
import Post from './components/Post';  // Import the Post component
import FindQuestion from './components/FindQuestion';  // Import the FindQuestion component

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect the root URL ("/") to the Find Question page */}
        <Route path="/" element={<Navigate to="/find-questions" />} />
        
        {/* Route to the Post Page where users can create new posts */}
        <Route path="/post" element={<Post />} />
        
        {/* Route to the Find Question Page where users can view questions */}
        <Route path="/find-questions" element={<FindQuestion />} />
      </Routes>
    </Router>
  );
}

export default App;
