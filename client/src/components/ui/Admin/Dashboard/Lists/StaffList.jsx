import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// Import Thunks
import {
  deleteAdminUserById,
  listAdminUsers,
  updateAdminUserById,
} from '../../../../../redux/asyncThunks/adminThunks';

// Import Components
import Loader from '../../../Loader';
import Message from '../../../Message';
import Table from '../Table';

function StaffList() {
  const adminUserColumns = [
    '_id',
    'name',
    'email',
    'role',
    'permissions',
    'isApproved',
  ];

  const dispatch = useDispatch();

  const admin = useSelector((state) => state.admin);
  const {
    loading,
    adminUserList,
    adminUserListError,
    adminUserDeleteByIdError,
    adminUserUpdateProfileByIdError,
    adminUserUpdateProfileByIdSuccess,
    adminUserDeleteByIdSuccess,
  } = admin;

  const handleDelete = (id) => {
    dispatch(deleteAdminUserById(id)).then(() => {
      dispatch(listAdminUsers({}));
      // Clear messages after action
      clearMessages();
    });
  };

  const handleChange = (_id) => {
    const user = adminUserList.find((user) => user._id === _id);
    if (!user) {
      console.log("User not found for ID:", _id);
      return; // Exit if user is not found
    }

    // Toggle isApproved
    const updatedUser = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      permissions: user.permissions,
      isApproved: !user.isApproved,
    };

    dispatch(updateAdminUserById(updatedUser)).then(() => {
      dispatch(listAdminUsers({}));
      // Clear messages after action
      clearMessages();
    });

    console.log("handleChange _id", _id, "New isApproved:", updatedUser.isApproved); 
  };

  const successMessage = adminUserUpdateProfileByIdSuccess
    ? 'User Updated Successfully!'
    : adminUserDeleteByIdSuccess
    ? 'User Deleted Successfully!'
    : null;

  const getErrorMessage = () => {
    if (adminUserListError) {
      return adminUserListError; // Return list error
    }
    if (adminUserDeleteByIdError) {
      return adminUserDeleteByIdError; // Return delete error
    }
    if (adminUserUpdateProfileByIdError) {
      return adminUserUpdateProfileByIdError; // Return update error
    }
    return null; // No error
  };

  const errorMessage = getErrorMessage();

  useEffect(() => {
    if (!loading && !adminUserList.length) {
      dispatch(listAdminUsers({}));
    }
  }, [dispatch, loading, adminUserList]);

  // Function to clear messages
  const clearMessages = () => {
    // Dispatch actions to clear success/error messages in the Redux store
    // This will depend on how you set up your Redux state management
  };

  return (
    <div className="w-full p-4">
      <h2 className="text-2xl font-bold my-2">All Staff</h2>
      {loading ? (
        <Loader />
      ) : (
        <>
          {errorMessage && (
            <Message>
              {errorMessage}
            </Message>
          )}
          {/* {successMessage && (
            <Message>
              {successMessage}
            </Message>
          )} */}
          <div className="mt-4">
            {adminUserList.length > 0 ? (
              <Table
                data={adminUserList}
                columns={adminUserColumns}
                handleDelete={handleDelete}
                handleChange={handleChange}
              />
            ) : (
              <h2 className="text-white text-xl text-center rounded-md border-2 border-orange-400 font-semibold mb-2 p-4">
                No Staff Found..
              </h2>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default StaffList;
