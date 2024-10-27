"use client"

import { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useRouter } from "next/navigation";
import { db } from '@/app/(services)/firebase/config';
import toast, { Toaster } from 'react-hot-toast';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/app/(services)/firebase/config';

interface LogEntry {
  id: string;
  username: string;
  time: string;
  prompt: string;
  collection: string;
  url?: string;
  [key: string]: any;
}

type SortDirection = 'asc' | 'desc';
type SortField = keyof Pick<LogEntry, 'username' | 'time' | 'prompt'>;

export default function AdminDashboard() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [selectedLogs, setSelectedLogs] = useState<string[]>([]);
  const [sortField, setSortField] = useState<SortField>('time');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const router = useRouter();
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    if (!loading && (!user || user.email !== 'adiadithyakrishnan@gmail.com')) {
      router.push('/');
      toast.error('Access denied');
    } else if (user) {
      fetchLogs();
    }
  }, [user, loading]);

  if (loading) {
    return (
      <div className="min-h-screen  text-gray-700 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-600"></div>
      </div>
    );
  }

  if (!user || user.email !== 'adiadithyakrishnan@gmail.com') {
    return null;
  }

  const fetchLogs = async () => {
    try {
      const logSnapshot = await getDocs(collection(db, 'log'));
      const userSnapshot = await getDocs(collection(db, 'nsfw-users'));
      
      const logData: LogEntry[] = logSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        collection: 'log'
      } as LogEntry));
      
      const userData: LogEntry[] = userSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        collection: 'nsfw-users'
      } as LogEntry));
      
      setLogs([...logData, ...userData]);
    } catch (error) {
      console.error('Error fetching logs:', error);
      toast.error('Failed to fetch logs');
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedLogs = [...logs].sort((a: LogEntry, b: LogEntry) => {
    const aValue = (a[sortField] || '').toString();
    const bValue = (b[sortField] || '').toString();
    return sortDirection === 'asc' 
      ? aValue.localeCompare(bValue)
      : bValue.localeCompare(aValue);
  });

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedLogs(e.target.checked ? logs.map(log => log.id) : []);
  };

  const handleSelect = (id: string) => {
    setSelectedLogs(prev => 
      prev.includes(id)
        ? prev.filter(logId => logId !== id)
        : [...prev, id]
    );
  };

  const handleDelete = async () => {
    try {
      const deletePromises = selectedLogs.map(async (logId) => {
        const logToDelete = logs.find(log => log.id === logId);
        if (logToDelete) {
          await deleteDoc(doc(db, logToDelete.collection, logId));
        }
      });

      await Promise.all(deletePromises);
      toast.success('Logs deleted successfully');
      await fetchLogs();
      setSelectedLogs([]);
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting logs:', error);
      toast.error('Failed to delete logs');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? ' ↑' : ' ↓';
  };

  return (
    <div className="min-h-screen w-full  text-gray-100 h-full p-12 overflow-y-scroll">
      <Toaster />
      
      {/* Main Card */}
      <div className="bg-[#fdfdfd] rounded-lg border  overflow-hidden shadow-lg">
        {/* Header */}
        <div className="p-6 flex justify-between items-center border-b">
          <h1 className="text-2xl font-bold text-[#3d3d3d]">Admin Dashboard</h1>
          {selectedLogs.length > 0 && (
            <button
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete Selected ({selectedLogs.length})
            </button>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#fdfdfd]   p-1">
              <tr>
                <th className="w-12 px-6 py-3">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-600 bg-gray-100 checked:bg-blue-500"
                    checked={selectedLogs.length === logs.length && logs.length > 0}
                    onChange={handleSelectAll}
                  />
                </th>
                {['username', 'time', 'prompt'].map((field) => (
                  <th
                    key={field}
                    onClick={() => handleSort(field as SortField)}
                    className="px-6 py-3 text-left text-xs font-medium text-[#2d2d2d] uppercase tracking-wider cursor-pointer 0"
                  >
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                    {getSortIcon(field as SortField)}
                  </th>
                ))}
                <th className="px-6 py-3 text-left text-xs font-medium text-[#2d2d2d] uppercase tracking-wider">
                  Collection
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedLogs.map((log) => (
                <tr key={log.id} className=" text-[#2d2d2d]">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-600 bg-gray-700 checked:bg-blue-500"
                      checked={selectedLogs.includes(log.id)}
                      onChange={() => handleSelect(log.id)}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{log.username || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{log.time || 'N/A'}</td>
                  <td className="px-6 py-4">
                    <div className="max-w-md truncate">{log.prompt || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{log.collection}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#fdfdfd] rounded-lg max-w-md w-full p-6 border border-gray-700">
            <h3 className="text-lg font-medium text-[#2d2d2d] mb-2">Confirm Delete</h3>
            <p className="text-gray-800 mb-6">
              Are you sure you want to delete {selectedLogs.length} selected log{selectedLogs.length === 1 ? '' : 's'}? 
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-[#2d2d2d] rounded-lg hover:bg-blue-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-[#2d2d2d] rounded-lg hover:bg-red-700 transition-colors"
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