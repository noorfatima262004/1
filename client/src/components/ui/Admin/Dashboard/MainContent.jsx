import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

// Import Components
import Home from './Home';
import InventoryList from './Lists/InventoryList';
import OrdersList from './Lists/OrdersList';
import PizzasList from './Lists/PizzasList';
import StaffList from './Lists/StaffList';
import UsersList from './Lists/UsersList';
import SideBarToggleButton from './SideBar/SideBarToggleButton';

function MainContent({ activeMenuItem, collapsible, onToggleSidebar }) {
  const admin = useSelector((state) => state.admin);
  const { adminUserInfo } = admin;

  const formattedUserName = adminUserInfo.name
    .split(' ')
    .map((name) => name.charAt(0).toUpperCase() + name.slice(1))
    .join(' ');

  // Check if the user is an admin
  const isAdmin = adminUserInfo.role === 'admin'; // Adjust this condition based on your role logic

  return (
    <div
      className={`bg-orange-600 ${collapsible ? 'w-10/12' : 'w-full'} transition-width duration-300 ease-in-out p-10`}
    >
      <SideBarToggleButton onClick={onToggleSidebar} isOpen={collapsible} />
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-4xl text-center font-bold">
          Welcome to Admin Panel
          <span className="text-orange-300"> {formattedUserName}</span>!
        </h1>
        {activeMenuItem === 'Home' && <Home />}
        {isAdmin && activeMenuItem === 'Staff' && <StaffList />}
        {activeMenuItem === 'Users' && <UsersList />}
        {activeMenuItem === 'Pizzas' && <PizzasList />}
        {activeMenuItem === 'Orders' && <OrdersList />}
        {activeMenuItem === 'Inventory' && <InventoryList />}
      </div>
    </div>
  );
}

MainContent.propTypes = {
  activeMenuItem: PropTypes.string.isRequired,
  collapsible: PropTypes.bool.isRequired,
  onToggleSidebar: PropTypes.func.isRequired,
};

export default MainContent;
