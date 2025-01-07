import { Outlet } from 'react-router';

export default function ResumeLayout() {
  return (
    <div className="mx-auto min-h-screen max-w-2xl bg-background px-6 py-12 antialiased sm:py-24">
      <Outlet />
    </div>
  );
}
