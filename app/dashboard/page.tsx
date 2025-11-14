import NavMenu from "@/components/NavMenu";

export default function Dashboard() {
  return (
    <div>
      <header className="fixed top-0 right-0 left-0 z-10 flex items-center justify-between bg-white px-4 py-3 shadow-sm sm:px-6 lg:px-8">
        <div className="text-lg font-bold text-gray-900">Docupop</div>
        <NavMenu />
      </header>
    </div>
  );
}
