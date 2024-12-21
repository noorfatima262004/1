import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

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
      clearMessages();
    });
  };

  const handleChange = (_id) => {
    const user = adminUserList.find((user) => user._id === _id);
    if (!user) {
      console.log("User not found for ID:", _id);
      return;
    }

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
      clearMessages();
    });
  };

  const successMessage = adminUserUpdateProfileByIdSuccess
    ? 'User Updated Successfully!'
    : adminUserDeleteByIdSuccess
    ? 'User Deleted Successfully!'
    : null;

  const getErrorMessage = () => {
    if (adminUserListError) return adminUserListError;
    if (adminUserDeleteByIdError) return adminUserDeleteByIdError;
    if (adminUserUpdateProfileByIdError) return adminUserUpdateProfileByIdError;
    return null;
  };

  const errorMessage = getErrorMessage();

  useEffect(() => {
    if (!loading && !adminUserList.length) {
      dispatch(listAdminUsers({}));
    }
  }, [dispatch, loading, adminUserList]);

  const clearMessages = () => {
    // Clear success/error messages from the Redux store
  };

  const generatePDF = () => {
    const doc = new jsPDF();
  
    doc.setFontSize(18);
    doc.text("Staff List Report", 14, 22);
  
    const tableColumns = ['ID', 'Name', 'Email', 'Role', 'Approved'];
    const tableRows = adminUserList.map((user) => [
      user._id,
      user.name,
      user.email,
      user.role,
      user.isApproved ? 'Yes' : 'No',
    ]);
  
    // Define custom column widths
    const columnWidths = [58, 30, 55, 22, 25]; // Array with custom widths for each column
  
    doc.autoTable({
      head: [tableColumns],
      body: tableRows,
      startY: 30, // Start the table after the title
      theme: 'striped',
      styles: {
        fontSize: 12,
      },
      columnStyles: {
        0: { cellWidth: columnWidths[0] }, // Width for ID column
        1: { cellWidth: columnWidths[1] }, // Width for Name column
        2: { cellWidth: columnWidths[2] }, // Width for Email column
        3: { cellWidth: columnWidths[3] }, // Width for Role column
        4: { cellWidth: columnWidths[4] }, // Width for Permissions column
      },
    });
  
    doc.save("staff_list_report.pdf"); // Download the PDF
  };
  

  return (
    <div className="w-full p-4">
      <h2 className="text-2xl font-bold my-2">All Staff</h2>
      {loading ? (
        <Loader />
      ) : (
        <>
          {errorMessage && <Message>{errorMessage}</Message>}
          <div className="mb-4 flex justify-end">
            <button
              onClick={generatePDF}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Generate PDF Report
            </button>
          </div>
          <div className="mt-4">
            {adminUserList.length > 0 ? (
              console.log(adminUserList),
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
