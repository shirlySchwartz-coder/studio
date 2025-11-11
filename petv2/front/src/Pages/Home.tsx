import { containerClass, errorClass } from '../utils/style';
import { List } from '../Components/List';
import { Hero } from '../Components/Hero/Hero';

export function Home() {
  return (
    <div className={containerClass}>
      <Hero />
      <List />
    </div>
  );
}
