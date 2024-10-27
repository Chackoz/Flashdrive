"use client"
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { collection, getDocs, deleteDoc, doc, DocumentData } from 'firebase/firestore';
import { useRouter } from "next/navigation";
import { db } from '@/app/(services)/firebase/config';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/app/(services)/firebase/config';
import { Activity, Users, Image, Award, Gamepad } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

interface BaseLogEntry {
  id: string;
  username: string;
  time: string;
}
interface User {
    id: string;
    username: string;
    email: string;
  }
  

interface LogEntry extends BaseLogEntry {
  prompt: string;
  collection: string;
  url?: string;
  [key: string]: any;
}

interface SnakeGameEntry extends BaseLogEntry {
  score: number;
}

interface MemoryGameEntry extends BaseLogEntry {
  highscore: number;
}

interface ActivityData {
  date: string;
  activities: number;
}

interface Stats {
  totalUsers: number;
  sdUsers: number;
  snakeGameUsers: number;
  memoryGameUsers: number;
  topScore: number;
}

type SortDirection = 'asc' | 'desc';
type SortField = keyof Pick<LogEntry, 'username' | 'time' | 'prompt'>;

interface StatCardProps {
  icon: React.ComponentType<any>;
  title: string;
  value: number;
  className: string;
}

// Helper function to convert Firestore data to typed entries
const convertToLogEntry = (doc: DocumentData, collectionName: string): LogEntry => {
  const data = doc.data();
  return {
    id: doc.id,
    username: data.username || 'N/A',
    time: data.time || new Date().toISOString(),
    prompt: data.prompt || 'N/A',
    collection: collectionName,
    ...data
  };
};

const convertToGameEntry = <T extends BaseLogEntry>(doc: DocumentData): T => {
  const data = doc.data();
  return {
    id: doc.id,
    username: data.username || 'N/A',
    time: data.time || new Date().toISOString(),
    ...data
  } as T;
};

export default function EnhancedAdminDashboard() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [selectedLogs, setSelectedLogs] = useState<string[]>([]);
  const [sortField, setSortField] = useState<SortField>('time');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [show,setShow] = useState(false);
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    sdUsers: 0,
    snakeGameUsers: 0,
    memoryGameUsers: 0,
    topScore: 0
  });
  const [userActivityData, setUserActivityData] = useState<ActivityData[]>([]);
  const router = useRouter();
  const [user, loading] = useAuthState(auth);

  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = async () => {
    try {
      const userSnapshot = await getDocs(collection(db, 'user')); // replace 'users' with your collection name
      const usersData: User[] = userSnapshot.docs.map((doc) => ({
        id: doc.id,
        username: doc.data().username || 'N/A',
        email: doc.data().email || 'N/A',
      }));
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    }
  };


  useEffect(() => {
    if (!loading && user) {
      fetchUsers();
    }
  }, [user, loading]);

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        const emailSnapshot = await getDocs(collection(db, 'adminemails'));
        const adminEmails = emailSnapshot.docs.map(doc => doc.data().email);
  
        if (!loading && (!user || !adminEmails.includes(user.email))) {
          router.push('/');
          toast.error('Access denied');
        } else if (user) {
            setShow(true);
          fetchData();
        }
      } catch (error) {
        console.error('Error fetching admin emails:', error);
        toast.error('Failed to verify admin access');
      }
    };
  
    checkAdminAccess();
  }, [user, loading, router]);

  const fetchData = async () => {
    try {
      // Fetch all collections
      const logSnapshot = await getDocs(collection(db, 'log'));
      const userSnapshot = await getDocs(collection(db, 'nsfw-users'));
      const snakeSnapshot = await getDocs(collection(db, 'snake'));
      const memorySnapshot = await getDocs(collection(db, 'memoryGameScores'));
      
      // Process logs with proper typing
      const logData: LogEntry[] = logSnapshot.docs.map(doc => 
        convertToLogEntry(doc, 'log')
      );
      
      const userData: LogEntry[] = userSnapshot.docs.map(doc => 
        convertToLogEntry(doc, 'nsfw-users')
      );

      const snakeData: SnakeGameEntry[] = snakeSnapshot.docs.map(doc =>
        convertToGameEntry<SnakeGameEntry>(doc)
      );

      const memoryData: MemoryGameEntry[] = memorySnapshot.docs.map(doc =>
        convertToGameEntry<MemoryGameEntry>(doc)
      );

      setLogs([...logData, ...userData]);

      // Calculate statistics
      const uniqueUsers = new Set([...logData, ...userData].map(log => log.username));
      const sdUsers = new Set(logData.map(log => log.username));
      const snakeUsers = new Set(snakeData.map(entry => entry.username));
      const memoryUsers = new Set(memoryData.map(entry => entry.username));
      
      const topScore = Math.max(
        ...memoryData.map(entry => entry.highscore || 0),
        ...snakeData.map(entry => entry.score || 0)
      );

      setStats({
        totalUsers: uniqueUsers.size,
        sdUsers: sdUsers.size,
        snakeGameUsers: snakeUsers.size,
        memoryGameUsers: memoryUsers.size,
        topScore
      });

      // Prepare activity data for chart
      const activityByDate = logData.reduce<Record<string, number>>((acc, log) => {
        const date = new Date(log.time).toLocaleDateString();
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});

      const chartData: ActivityData[] = Object.entries(activityByDate)
        .map(([date, activities]) => ({
          date,
          activities
        }))
        .slice(-7); // Last 7 days

      setUserActivityData(chartData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch data');
    }
  };

  const StatCard: React.FC<StatCardProps> = ({ icon: Icon, title, value, className }) => (
    <div className="bg-white p-6 rounded-lg shadow-md border">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-full ${className}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-800">{value}</p>
        </div>
      </div>
    </div>
  );

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleDelete = async () => {
    try {
      await Promise.all(
        selectedLogs.map(async (logId) => {
          const logToDelete = logs.find(log => log.id === logId);
          if (logToDelete) {
            await deleteDoc(doc(db, logToDelete.collection, logId));
          }
        })
      );
      toast.success('Logs deleted successfully');
      await fetchData();
      setSelectedLogs([]);
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting logs:', error);
      toast.error('Failed to delete logs');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    show&&
    <div className="min-h-screen w-full  p-8 h-full overflow-y-scroll">
      <Toaster />
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-600">Overview and analytics of user activities</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={Users}
          title="Total Users"
          value={stats.totalUsers}
          className="bg-blue-100 text-blue-600"
        />
        <StatCard
          icon={Image}
          title="SD Users"
          value={stats.sdUsers}
          className="bg-purple-100 text-purple-600"
        />
        <StatCard
          icon={Gamepad}
          title="Game Users"
          value={stats.snakeGameUsers + stats.memoryGameUsers}
          className="bg-green-100 text-green-600"
        />
        <StatCard
          icon={Award}
          title="Top Score"
          value={stats.topScore}
          className="bg-yellow-100 text-yellow-600"
        />
      </div>

      {/* Activity Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md border mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">User Activity</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={userActivityData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="activities" fill="#4F46E5" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

       {/* Users Table */}
       <div className="bg-white rounded-lg shadow-md border my-8 ">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">User Emails</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800">{user.username}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800">{user.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-lg shadow-md border">
        <div className="p-6 flex justify-between items-center border-b">
          <h2 className="text-xl font-semibold text-gray-800">Stable Diffusion Logs</h2>
          {selectedLogs.length > 0 && (
            <button
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete Selected ({selectedLogs.length})
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-12 px-6 py-3">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300"
                    checked={selectedLogs.length === logs.length && logs.length > 0}
                    onChange={(e) => setSelectedLogs(e.target.checked ? logs.map(log => log.id) : [])}
                  />
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer"
                  onClick={() => handleSort('username')}
                >
                  Username
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer"
                  onClick={() => handleSort('time')}
                >
                  Time
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer"
                  onClick={() => handleSort('prompt')}
                >
                  Activity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300"
                      checked={selectedLogs.includes(log.id)}
                      onChange={() => {
                        setSelectedLogs(prev =>
                          prev.includes(log.id)
                            ? prev.filter(id => id !== log.id)
                            : [...prev, log.id]
                        );
                      }}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800">{log.username}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800">{log.time}</td>
                  <td className="px-6 py-4 text-gray-800">
                    <div className="max-w-md truncate">{log.prompt}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800">{log.collection}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Confirm Delete</h3>
            <p className="text-gray-500 mb-6">
              Are you sure you want to delete {selectedLogs.length} selected log{selectedLogs.length === 1 ? '' : 's'}? 
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}