
import { containerClass, errorClass } from '../utils/style';
import { List } from '../Components/List';

export function Home() {
  return (
    <div className={containerClass}>
      <List />
    </div>
  );
}
