import { Link, Outlet } from 'umi';
import styles from './index.less';

export default function Layout() {
  return (
    <div className={styles.navs}>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/d3">D3 example</Link>
        </li>
        <li>
          <Link to="/g2">G2 example</Link>
        </li>
      </ul>
      <Outlet />
    </div>
  );
}
