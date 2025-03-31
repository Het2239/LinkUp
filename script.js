import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { firestore } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { 
  TruckIcon, 
  BookOpenIcon, 
  MailIcon, 
  UserGroupIcon, 
  LocationMarkerIcon, 
  MenuIcon,
  BellIcon,
  SparklesIcon
} from '@heroicons/react/outline';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [recentTaxis, setRecentTaxis] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch notifications
        const notificationsSnapshot = await firestore
          .collection('notifications')
          .orderBy('createdAt', 'desc')
          .limit(5)
          .get();
        
        const notificationsData = notificationsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // Fetch upcoming events
        const now = new Date();
        const eventsSnapshot = await firestore
          .collection('events')
          .where('date', '>=', now)
          .orderBy('date', 'asc')
          .limit(3)
          .get();
        
        const eventsData = eventsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // Fetch recent taxi searches
        const taxisSnapshot = await firestore
          .collection('taxis')
          .orderBy('createdAt', 'desc')
          .limit(3)
          .get();
        
        const taxisData = taxisSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setNotifications(notificationsData);
        setUpcomingEvents(eventsData);
        setRecentTaxis(taxisData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  // Placeholder data for UI development
  const placeholderNotifications = [
    { id: 1, title: 'New Study Material', description: 'Data Structures notes uploaded by Prof. Johnson', createdAt: new Date(2025, 2, 28) },
    { id: 2, title: 'Upcoming Event', description: 'Tech Fest 2025 registrations open!', createdAt: new Date(2025, 2, 27) },
    { id: 3, title: 'Mess Menu Update', description: 'Special dinner this weekend', createdAt: new Date(2025, 2, 25) }
  ];
  
  const placeholderEvents = [
    { id: 1, title: 'Tech Fest 2025', description: 'Annual technology festival', date: new Date(2025, 3, 15), location: 'Main Auditorium' },
    { id: 2, title: 'Cultural Night', description: 'Music and dance performances', date: new Date(2025, 3, 5), location: 'Open Air Theatre' },
    { id: 3, title: 'Career Fair', description: 'Meet top companies and recruiters', date: new Date(2025, 3, 10), location: 'Convention Center' }
  ];
  
  const placeholderTaxis = [
    { id: 1, destination: 'Airport', date: new Date(2025, 3, 2), time: '14:00', requiredMembers: 3, currentMembers: 2, createdBy: 'John D.' },
    { id: 2, destination: 'Shopping Mall', date: new Date(2025, 3, 3), time: '10:00', requiredMembers: 4, currentMembers: 1, createdBy: 'Sarah M.' },
    { id: 3, destination: 'Railway Station', date: new Date(2025, 3, 4), time: '08:30', requiredMembers: 3, currentMembers: 3, createdBy: 'Alex K.' }
  ];
  
  const displayNotifications = notifications.length > 0 ? notifications : placeholderNotifications;
  const displayEvents = upcomingEvents.length > 0 ? upcomingEvents : placeholderEvents;
  const displayTaxis = recentTaxis.length > 0 ? recentTaxis : placeholderTaxis;
  
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  // Quick access feature links
  const featureLinks = [
    { name: 'Taxi Search', path: '/taxi-search', icon: TruckIcon, color: 'bg-yellow-500', description: 'Find ride partners' },
    { name: 'Study Materials', path: '/study-materials', icon: BookOpenIcon, color: 'bg-blue-500', description: 'Access course notes' },
    { name: 'Mail Formats', path: '/mail-formats', icon: MailIcon, color: 'bg-indigo-500', description: 'Email templates' },
    { name: 'Know Your People', path: '/know-your-people', icon: UserGroupIcon, color: 'bg-purple-500', description: 'College directory' },
    { name: 'Outings & Trips', path: '/outings', icon: LocationMarkerIcon, color: 'bg-green-500', description: 'Plan your adventures' },
    { name: 'Mess Menu', path: '/mess-menu', icon: MenuIcon, color: 'bg-red-500', description: 'Today\'s food' }
  ];
  
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Welcome back, {currentUser?.fullName?.split(' ')[0] || 'Student'}!</h1>
        <p className="text-gray-600 dark:text-gray-300">Here's what's happening on campus today.</p>
      </div>
      
      {/* Quick Access Features */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Quick Access</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {featureLinks.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link 
                key={feature.name}
                to={feature.path}
                className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 text-center group"
              >
                <div className={`${feature.color} rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3 text-white`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-medium text-gray-800 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200">
                  {feature.name}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {feature.description}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Notifications */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
              <BellIcon className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" />
              Recent Notifications
            </h2>
            <Link to="/" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
              View all
            </Link>
          </div>
          
          <div className="space-y-3">
            {loading ? (
              <div className="animate-pulse space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-gray-200 dark:bg-gray-700 h-16 rounded"></div>
                ))}
              </div>
            ) : (
              displayNotifications.map((notification) => (
                <div key={notification.id} className="border-b border-gray-100 dark:border-gray-700 pb-3 last:border-0 last:pb-0">
                  <h3 className="font-medium text-gray-800 dark:text-white">{notification.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{notification.description}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {formatDate(notification.createdAt)}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
        
        {/* Upcoming Events */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
              <SparklesIcon className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" />
              Upcoming Events
            </h2>
            <Link to="/outings" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
              View all
            </Link>
          </div>
          
          <div className="space-y-4">
            {loading ? (
              <div className="animate-pulse space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-gray-200 dark:bg-gray-700 h-20 rounded"></div>
                ))}
              </div>
            ) : (
              displayEvents.map((event) => (
                <div key={event.id} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                  <div className="flex justify-between">
                    <h3 className="font-medium text-gray-800 dark:text-white">{event.title}</h3>
                    <span className="text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300 rounded-full px-2 py-1">
                      {formatDate(event.date)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{event.description}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center">
                    <LocationMarkerIcon className="h-3 w-3 mr-1" />
                    {event.location}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
        
        {/* Recent Taxi Searches */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
              <TruckIcon className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" />
              Recent Taxi Groups
            </h2>
            <Link to="/taxi-search" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
              View all
            </Link>
          </div>
          
          <div className="space-y-4">
            {loading ? (
              <div className="animate-pulse space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-gray-200 dark:bg-gray-700 h-20 rounded"></div>
                ))}
              </div>
            ) : (
              displayTaxis.map((taxi) => (
                <div key={taxi.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-800 dark:text-white">{taxi.destination}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {formatDate(taxi.date)} at {taxi.time}
                      </p>
                    </div>
                    <div className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 text-xs rounded px-2 py-1">
                      {taxi.currentMembers}/{taxi.requiredMembers} joined
                    </div>
                  </div>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Created by {taxi.createdBy}
                    </span>
                    <button className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white py-1 px-3 rounded transition-colors duration-200">
                      Join
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;