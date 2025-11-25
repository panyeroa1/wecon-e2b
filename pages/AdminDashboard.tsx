import React, { useState } from 'react';
import { MOCK_APPLICATIONS } from '../constants';
import { VendorApplication } from '../types';
import { Check, X, FileText } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [applications, setApplications] = useState<VendorApplication[]>(MOCK_APPLICATIONS);

  const handleAction = (id: string, action: 'approved' | 'rejected') => {
    setApplications(prev => 
      prev.map(app => app.id === id ? { ...app, status: action } : app)
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Vendor Applications</h3>
          <p className="mt-1 text-sm text-gray-500">Review pending business registrations.</p>
        </div>
        <ul className="divide-y divide-gray-200">
          {applications.length === 0 ? (
            <li className="px-4 py-8 text-center text-gray-500">No applications to review.</li>
          ) : (
            applications.map((app) => (
              <li key={app.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <p className="text-sm font-medium text-primary-600 truncate">{app.orgName}</p>
                      <p className="text-sm text-gray-500">TIN: {app.tin}</p>
                    </div>
                    <div className="ml-2 flex-shrink-0 flex">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        app.status === 'approved' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {app.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500 mr-6">
                        <FileText className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        Business Permit.pdf
                      </p>
                      <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                         Contact: {app.contactPerson} ({app.email})
                      </p>
                    </div>
                    {app.status === 'pending' && (
                      <div className="mt-2 flex items-center text-sm sm:mt-0 space-x-2">
                        <button
                          onClick={() => handleAction(app.id, 'approved')}
                          className="inline-flex items-center px-3 py-1 border border-transparent rounded-md shadow-sm text-xs font-medium text-white bg-green-600 hover:bg-green-700"
                        >
                          <Check className="mr-1 h-3 w-3" /> Approve
                        </button>
                        <button
                          onClick={() => handleAction(app.id, 'rejected')}
                          className="inline-flex items-center px-3 py-1 border border-transparent rounded-md shadow-sm text-xs font-medium text-white bg-red-600 hover:bg-red-700"
                        >
                          <X className="mr-1 h-3 w-3" /> Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};