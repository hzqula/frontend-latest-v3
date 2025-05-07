import React, { useState, useEffect } from 'react';
import LayoutCoordinator from '../../components/layouts/CoordinatorLayout';
import { useNavigate } from 'react-router';
import { useAuth } from '../../context/AuthContext';

interface User {
  email: string;
}

interface SecurityLogs {
  id: number;
  userId: number;
  user: User;
  action: string;
  ipAddress: string;
  device: string;
  createdAt: string;
}

interface PaginationInfo {
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

interface SecurityLogResponse {
  logs: SecurityLogs[];
  pagination: PaginationInfo;
}

export const SecurityLog: React.FC = () => {
  const {token, userRole, isLoading: authLoading } = useAuth();
  const [logs, setLogs] = useState<SecurityLogs[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [showAll, setShowAll] = useState(false);
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).format(date);
  };

  const fetchLogs = async () => {
    setLoading(true);
    try {
      if (!token) {
        throw new Error('No token found. Please login again.');
      }

      const response = await fetch(`http://localhost:5500/api/security-logs?page=${page}&perPage=${perPage}&showAll=${showAll}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to load security logs');

      const data: SecurityLogResponse = await response.json();
      setLogs(data.logs);
      setTotalPages(data.pagination.totalPages);
      setError(null);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load security logs. Please try again.';
      setError(errorMessage);
      console.error('Error fetching logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) {
      setLoading(true);
      return;
    }

    if (!token || !userRole) {
      console.log('Redirecting to login from SecurityLog - token:', token, 'userRole:', userRole);
      navigate('/login');
      return;
    }

    if (userRole !== 'COORDINATOR') {
      setError('Access denied: You do not have permission to access this page.');
      navigate('/login');
      return;
    }

    fetchLogs();
  }, [authLoading, token, userRole, navigate, page, perPage, showAll]);

  const LogBadge: React.FC<{ type: 'info' | 'warning' | 'danger' | 'success'; text: string }> = ({ type, text }) => {
    const colorClasses = {
      info: 'bg-blue-100 text-blue-800',
      warning: 'bg-yellow-100 text-yellow-800',
      danger: 'bg-red-100 text-red-800',
      success: 'bg-green-100 text-green-800',
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClasses[type]}`}>
        {text}
      </span>
    );
  };

  const getLogBadgeType = (action: string) => {
    const actionLower = action.toLowerCase();

    if (actionLower.includes('injection') || actionLower.includes('attack')) {
      return 'danger';
    } else if (actionLower.includes('login failed')) {
      return 'warning';
    } else if (actionLower.includes('login successful')) {
      return 'success';
    } else if (actionLower.includes('registration successful')) {
      return 'success';
    } else if (actionLower.includes('registration failed')) {
      return 'warning';
    } else if (actionLower.includes('Reset password succesful')) {
      return 'success';
    } else if (actionLower.includes('Reset password failed')) {
      return 'warning';
    } else if (actionLower.includes('otp valid')) {
      return 'success';
    } else if (actionLower.includes('otp invalid')) {
      return 'warning';
    } else if (actionLower.includes('brute force')) {
      return 'danger';
    } else {
      return 'info';
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  return (
    <LayoutCoordinator>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">Security Logs</h1>

        <div className="mb-6 bg-white rounded-lg shadow p-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div>
              <label htmlFor="perPage" className="block text-sm font-medium text-gray-700 mb-1">
                Logs per page
              </label>
              <select
                id="perPage"
                value={perPage}
                onChange={(e) => {
                  setPerPage(Number(e.target.value));
                  setPage(1);
                }}
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>

            <div className="flex items-center">
              <input
                id="showAll"
                type="checkbox"
                checked={showAll}
                onChange={(e) => {
                  setShowAll(e.target.checked);
                  setPage(1);
                }}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="showAll" className="ml-2 text-sm text-gray-700">
                Show all logs (including older than 1 month)
              </label>
            </div>

            <div className="ml-auto">
              <button
                onClick={fetchLogs}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            <div className="bg-white shadow overflow-hidden rounded-lg">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Timestamp
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        IP Address
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Device
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {logs.length > 0 ? (
                      logs.map((log) => {
                        const isThreat = log.action.toLowerCase().includes('injection') || 
                                        log.action.toLowerCase().includes('attack');

                        return (
                          <tr key={log.id} className={isThreat ? 'bg-red-50' : ''}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(log.createdAt)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {log.user?.email || 'Unknown'}
                              </div>
                              <div className="text-sm text-gray-500">
                                {log.user?.email.endsWith('@student.unri.ac.id') ? 'STUDENT' :
                                 log.user?.email.endsWith('@lecturer.unri.ac.id') ? 'LECTURER' : 'COORDINATOR'}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <LogBadge 
                                type={getLogBadgeType(log.action)} 
                                text={log.action} 
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {log.ipAddress}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                              {log.device}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                          No logs found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-700">
                  Page {page} of {totalPages}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                    className={`px-3 py-1 rounded ${
                      page === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Previous
                  </button>

                  <div className="flex space-x-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum = page;

                      if (page <= 3) {
                        pageNum = i + 1;
                      } else if (page >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = page - 2 + i;
                      }

                      if (pageNum > 0 && pageNum <= totalPages) {
                        return (
                          <button
                            key={`pagination-${pageNum}-${i}`} 
                            onClick={() => setPage(pageNum)}
                            className={`px-3 py-1 rounded ${
                              pageNum === page
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      }
                      return null;
                    })}
                  </div>

                  <button
                    onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={page === totalPages}
                    className={`px-3 py-1 rounded ${
                      page === totalPages
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </LayoutCoordinator>
  );
};

export default SecurityLog;