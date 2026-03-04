export const metadata = {
  title: '관리자',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-gray-50">{children}</div>;
}
