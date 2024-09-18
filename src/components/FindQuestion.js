import React, { useState, useEffect } from 'react';
import { db } from '../firebase';  // Ensure Firebase is properly configured
import { Link } from 'react-router-dom';

function FindQuestion() {
  const [questions, setQuestions] = useState([]);
  const [filter, setFilter] = useState('');
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch questions from Firestore
  useEffect(() => {
    const fetchData = async () => {
      try {
        const snapshot = await db.collection('posts').orderBy('timestamp', 'desc').get();
        const questionData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setQuestions(questionData);
        setFilteredQuestions(questionData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching questions:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter questions based on user input
  useEffect(() => {
    if (filter) {
      const filtered = questions.filter(
        (question) =>
          question.title.toLowerCase().includes(filter.toLowerCase()) ||
          question.tags.some(tag => tag.toLowerCase().includes(filter.toLowerCase()))
      );
      setFilteredQuestions(filtered);
    } else {
      setFilteredQuestions(questions);
    }
  }, [filter, questions]);

  const handleDelete = (id) => {
    db.collection('posts').doc(id).delete()
      .then(() => {
        setQuestions(prevQuestions => prevQuestions.filter(question => question.id !== id));
      })
      .catch(error => {
        console.error("Error deleting question:", error);
      });
  };

  if (loading) {
    return <p>Loading questions...</p>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Find a Question</h2>
      <input
        type="text"
        placeholder="Filter by title or tag"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        style={{ padding: '10px', width: '300px', marginBottom: '20px' }}
      />

      {/* Add a button to navigate to the Post page */}
      <div style={{ marginBottom: '20px' }}>
        <Link to="/post">
          <button style={{ padding: '10px 20px', background: '#4CAF50', color: 'white', border: 'none' }}>
            Create New Post
          </button>
        </Link>
      </div>

      {/* Display the list of questions */}
      {filteredQuestions.length > 0 ? (
        filteredQuestions.map((question) => (
          <div key={question.id} className="question-card" style={{ border: '1px solid #ddd', padding: '10px', marginBottom: '10px' }}>
            <h3>{question.title}</h3>
            <p>{question.description || question.abstract}</p>
            <p><strong>Tags:</strong> {question.tags.join(', ')}</p>
            <p><small>{new Date(question.timestamp?.toDate()).toLocaleDateString()}</small></p>

            {/* Display Image if Available */}
            {question.imageUrl && (
              <div style={{ marginBottom: '10px' }}>
                <img src={question.imageUrl} alt="Uploaded" style={{ maxWidth: '100%', height: 'auto' }} />
              </div>
            )}

            <button onClick={() => handleDelete(question.id)} style={{ background: '#ff4d4f', color: 'white', padding: '5px 10px', border: 'none' }}>
              Delete
            </button>
          </div>
        ))
      ) : (
        <p>No questions found</p>
      )}
    </div>
  );
}

export default FindQuestion;
