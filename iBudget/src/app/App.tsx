import { RouterProvider } from 'react-router';
import { router } from './routes';
import { AppProvider } from './context/AppContext';

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center p-4">
        <div className="relative">
          <div className="relative bg-[#121212] rounded-[55px] p-[14px] shadow-2xl" style={{ width: '421px', height: '900px' }}>
            <div className="relative bg-white dark:bg-slate-950 rounded-[41px] overflow-hidden h-full">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 z-50">
                <div className="bg-black h-[30px] w-[150px] rounded-b-[20px] flex items-center justify-center">
                  <div className="w-[60px] h-[6px] bg-gray-800 rounded-full mt-2" />
                </div>
              </div>
              <div className="h-full">
                <RouterProvider router={router} />
              </div>
            </div>
          </div>
          <div className="absolute right-[8px] top-[190px] w-[4px] h-[78px] bg-black rounded-l-md" />
          <div className="absolute left-[8px] top-[155px] w-[4px] h-[50px] bg-black rounded-r-md" />
          <div className="absolute left-[8px] top-[225px] w-[4px] h-[50px] bg-black rounded-r-md" />
        </div>
      </div>
    </AppProvider>
  );
}
