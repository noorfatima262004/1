import { useEffect, useState } from 'react';
import {
  FaBoxes,
  FaClipboardList,
  FaHome,
  FaPizzaSlice,
  FaUser,
  FaUsers,
} from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// Import Thunks
import { listAdminUsers } from '../../redux/asyncThunks/adminThunks';
import { listOrders } from '../../redux/asyncThunks/orderThunks';
import { listPizzas } from '../../redux/asyncThunks/pizzaThunks';
import { listUsers } from '../../redux/asyncThunks/userThunks';
import { listInventory } from '../../redux/asyncThunks/inventoryThunks';

// Import Components
import MainContent from '../../components/ui/Admin/Dashboard/MainContent';
import SideBar from '../../components/ui/Admin/Dashboard/SideBar/SideBar';

function AdminDashboardScreen() {
  const menuItems = [
    { name: 'Home', icon: <FaHome className="mr-2" /> },
    { name: 'Staff', icon: <FaUsers className="mr-2" /> },
    { name: 'Users', icon: <FaUser className="mr-2" /> },
    { name: 'Pizzas', icon: <FaPizzaSlice className="mr-2" /> },
    { name: 'Orders', icon: <FaClipboardList className="mr-2" /> },
    { name: 'Inventory', icon: <FaBoxes className="mr-2" /> },
  ];

  const [activeMenuItem, setActiveMenuItem] = useState('Home');
  const [collapsible, setCollapsible] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.user);
  const { adminUserInfo, isAdminLoading } = useSelector((state) => state.admin);

  // Conditionally filter the menuItems based on the user's role
  const filteredMenuItems = adminUserInfo && adminUserInfo.role === 'admin'
    ? menuItems
    : menuItems.filter(item => item.name !== 'Staff' && item.name !== 'Users');

  const toggleSidebar = () => {
    setCollapsible((prevState) => !prevState);
  };

  const handleMenuItemClick = (name) => {
    setActiveMenuItem(name);
    toggleSidebar();
  };

  useEffect(() => {
    if (isAdminLoading) return; // If admin data is still loading, prevent further action

    if (!adminUserInfo) {
      navigate('/admin/login');
    } else if (!adminUserInfo.isApproved) {
      // Admin is not approved, no action needed
      return;
    } else {
      // Fetch admin-specific data when adminUserInfo exists and is approved
      dispatch(listUsers({}));
      dispatch(listAdminUsers({}));
      dispatch(listPizzas({}));
      dispatch(listOrders({}));
      dispatch(listInventory({}));
    }
  }, [dispatch, navigate, adminUserInfo, isAdminLoading]);

  useEffect(() => {
    // Redirect to homepage if a regular user is logged in
    if (userInfo && !adminUserInfo) {
      navigate('/');
    }
  }, [navigate, userInfo, adminUserInfo]);

  if (isAdminLoading) {
    return <div>Loading...</div>; // Show a loading indicator while the data is being fetched
  }

  return (
    <section className="min-h-screen flex flex-row bg-orange-600 text-white pt-16 sm:pt-20">
      {adminUserInfo && adminUserInfo.isApproved ? (
        <>
          {collapsible && (
            <SideBar
              menuItems={filteredMenuItems} // Use filtered menu items based on role
              handleMenuItemClick={handleMenuItemClick}
              activeMenuItem={activeMenuItem}
              collapsible={collapsible}
            />
          )}

          <MainContent
            menuItems={filteredMenuItems} // Pass filtered menu items
            activeMenuItem={activeMenuItem}
            collapsible={collapsible}
            onToggleSidebar={toggleSidebar}
          />
        </>
      ) : (
        // Render the approval message directly, centered
        <div className="flex items-center justify-center min-h-screen w-full">
          <div className="bg-white rounded-2xl p-4 sm:p-6 w-full sm:w-2/3 md:w-1/2 shadow-lg">
            <h2 className="text-2xl text-orange-500 font-bold mb-4">
              Account Approval Pending
            </h2>
            <p className="text-center text-black text-xl leading-relaxed">
              Your account is currently pending approval. Please wait until an admin approves your account to gain access.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

export default AdminDashboardScreen;
