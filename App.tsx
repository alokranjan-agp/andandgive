import React from 'react';
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import Login from "./components/Login";
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  return (
    <>
      <SignedOut>
        <Login />
      </SignedOut>
      <SignedIn>
        <div className="min-h-screen bg-slate-50">
          <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="hidden w-8 h-8 bg-bni-red rounded-lg flex items-center justify-center text-white font-bold">
                  P
                </div>
                <span className="font-monda font-bold text-2xl text-slate-800 tracking-tight">
                  ask<span className="text-bni-red">&give</span>
                </span>
              </div>
              <div className="flex items-center gap-4">
                <UserButton />
              </div>
            </div>
          </nav>
          <Dashboard />
        </div>
      </SignedIn>
    </>
  );
};

export default App;
