import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, Home } from 'lucide-react';
import { Button } from '@/shared/ui/Button';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-[#212121] text-gray-900 dark:text-[#ececec] flex flex-col items-center justify-center p-6 text-center space-y-6 transition-colors duration-200">
      <div className="w-16 h-16 rounded-2xl bg-indigo-100 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
        <FileQuestion className="w-8 h-8" />
      </div>
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-[#ececec]">404 - Page Not Found</h1>
        <p className="text-sm text-gray-600 dark:text-zinc-400 max-w-sm mx-auto">
          The requested OFC360 resource or endpoint does not exist.
        </p>
      </div>
      <Link to="/auth/login">
        <Button variant="primary" leftIcon={<Home className="w-4 h-4" />}>
          Return to Portal
        </Button>
      </Link>
    </div>
  );
};
