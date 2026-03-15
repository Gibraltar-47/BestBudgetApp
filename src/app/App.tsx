import { RouterProvider } from 'react-router';
import { router } from './routes';
import { AppProvider } from './context/AppContext';

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4">
        <div className="relative">
          <div className="relative bg-black rounded-[55px] p-[14px] shadow-2xl" style={{ width: '421px', height: '900px' }}>
            <div className="relative bg-white rounded-[41px] overflow-hidden h-full">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 z-50">
                <div className="bg-black h-[30px] w-[150px] rounded-b-[20px] flex items-center justify-center">
                  <div className="w-[60px] h-[6px] bg-gray-800 rounded-full mt-2"></div>
                </div>
              </div>
              <div className="h-full overflow-y-auto overflow-x-hidden">
                <RouterProvider router={router} />
              </div>
            </div>
          </div>
          <div className="absolute right-[0px] top-[180px] w-[3px] h-[72px] bg-[#161616] rounded-l-md"></div>
          <div className="absolute left-[0px] top-[150px] w-[3px] h-[44px] bg-[#161616] rounded-r-md"></div>
          <div className="absolute left-[0px] top-[212px] w-[3px] h-[44px] bg-[#161616] rounded-r-md"></div>
        </div>
      </div>
    </AppProvider>
  );
}
