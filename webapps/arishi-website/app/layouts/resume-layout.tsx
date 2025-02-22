import { Outlet } from 'react-router';

export default function ResumeLayout() {
  return (
    <main className="relative container mx-auto scroll-my-12 overflow-auto p-4 md:p-16 print:p-11">
      <Outlet />
    </main>
  );
}
