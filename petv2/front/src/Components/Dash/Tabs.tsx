import { MoreVertical, Search } from 'lucide-react';
import { useState } from 'react';
import Table from './Table';
import { AddAnimal } from '../../Pages/AddAnimal';

export const Tabs = ({}) => {
  const [activeTab, setActiveTab] = useState<'animals' | 'requests' | 'add'>(
    'animals'
  );

  const animals = [
    {
      id: 1,
      name: 'מקס',
      image:
        'https://images.unsplash.com/photo-1734966213753-1b361564bab4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkZW4lMjByZXRyaWV2ZXIlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjI3MTczODl8MA&ixlib=rb-4.1.0&q=80&w=1080',
      gender: 'זכר',
      age: 'שנתיים',
      status: 'available',
      date: '1 נובמבר 2025',
    },
    {
      id: 2,
      name: 'לונה',
      image:
        'https://images.unsplash.com/photo-1702914954859-f037fc75b760?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXRlJTIwY2F0JTIwcG9ydHJhaXR8ZW58MXx8fHwxNzYyNzY3NDczfDA&ixlib=rb-4.1.0&q=80&w=1080',
      gender: 'נקבה',
      age: 'שנה',
      status: 'pending',
      date: '3 נובמבר 2025',
    },
    {
      id: 3,
      name: 'צ׳רלי',
      image:
        'https://images.unsplash.com/photo-1555557135-0971899f7e3c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwdXBweSUyMGRvZyUyMHBvcnRyYWl0fGVufDF8fHx8MTc2Mjc5ODc2MXww&ixlib=rb-4.1.0&q=80&w=1080',
      gender: 'זכר',
      age: '6 חודשים',
      status: 'adopted',
      date: '5 ספטמבר 2025',
    },
    {
      id: 4,
      name: 'מיה',
      image:
        'https://images.unsplash.com/photo-1583098026747-559b9f41e586?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraXR0ZW4lMjBjYXQlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjI3OTg3NjJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      gender: 'נקבה',
      age: '3 חודשים',
      status: 'fostered',
      date: '10 אוקטובר 2025',
    },
  ];

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
