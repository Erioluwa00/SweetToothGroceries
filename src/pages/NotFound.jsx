import { Link } from 'react-router-dom';
import { EmptyIcon } from '../components/CartDrawer';

export default function NotFound() {
  return (
    <div className="container page-center">
      <div className="success">
        <EmptyIcon name="cookie" />
        <h1>Oops, this page got eaten</h1>
        <p>We couldn't find what you were looking for — but the snacks are still here.</p>
        <Link to="/shop" className="btn btn--green btn--lg">Back to the shop</Link>
      </div>
    </div>
  );
}
