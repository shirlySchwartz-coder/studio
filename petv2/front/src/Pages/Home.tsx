import { containerClass, errorClass } from '../utils/style';
import { List } from '../Components/List';
import { Hero } from '../Components/Hero/Hero';
import { SearchBar } from '../Components/SearchBar/SearchBar';

export function Home() {
  return (
    <>
      <Hero />
      <SearchBar />
      <List />
    </>
  );
}
