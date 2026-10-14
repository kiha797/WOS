import { SearchBar } from '../SearchBar';

export default function SearchBarExample() {
  return (
    <div className="p-6 bg-background">
      <SearchBar onSearch={(q) => console.log("Search:", q)} />
    </div>
  );
}
