import { MoreVertical, Search } from 'lucide-react';
import { useState } from 'react';
import Table from './Table';
import { AddAnimal } from '../../Pages/AddAnimal';

export const Tabs = ({}) => {
  const [activeTab, setActiveTab] = useState<'animals' | 'requests' | 'add'>(
    'animals'
  );

  return (
    <>
      <div className="tab-nav">
        <button
          className={`tab-button ${activeTab === 'animals' ? 'active' : ''}`}
          onClick={() => setActiveTab('animals')}
        >
          החיות שלי
        </button>
        <button
          className={`tab-button ${activeTab === 'requests' ? 'active' : ''}`}
          onClick={() => setActiveTab('requests')}
        >
          בקשות
        </button>
        <button
          className={`tab-button ${activeTab === 'add' ? 'active' : ''}`}
          onClick={() => setActiveTab('add')}
        >
          הוסף חיה
        </button>
      </div>

      {activeTab === 'animals' && (
        <div className="table-container">
          <div className="table-search relative">
            <Search className="search-icon" size={20} />
            <input type="text" placeholder="חפש חיה..." />
          </div>
          <Table />
          <div className="pagination">
            <span>מציג 1-4 מתוך 24</span>
            <div>
              <button>הקודם</button>
              <button className="active">הבא</button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'requests' && (
        <div className="text-center py-16 card">
          <div className="text-6xl mb-4">📋</div>
          <h3>8 בקשות חדשות ממתינות</h3>
          <p>בדוק את הבקשות וענה למעוניינים באימוץ</p>
        </div>
      )}

      {activeTab === 'add' && (
        <div className="max-w-2xl mx-auto card p-8">
          <h2 className="text-xl font-bold mb-6">הוסף חיה חדשה</h2>
          <AddAnimal />
        </div>
      )}
    </>
  );
};
