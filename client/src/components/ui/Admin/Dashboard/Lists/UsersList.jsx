import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Import Thunks
import {
  deleteUserById,
  listUsers,
} from '../../../../../redux/asyncThunks/userThunks';

// Import Components
import Loader from '../../../Loader';
import Message from '../../../Message';
import Table from '../Table';
// import UserStats from './stats/UserStats';

function UsersList() {
  const userColumns = ['_id', 'name', 'email', 'numberOfOrders', 'isVerified'];

  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);
  const {
    loading,
    userList,
    userListError,
    userDeleteByIdError,
    userDeleteByIdSuccess,
  } = user;

  const handleDelete = (id) => {
    dispatch(deleteUserById(id)).then(() => dispatch(listUsers({})));
  };

  const successMessageDelete = userDeleteByIdSuccess && {
    status: '200',
    message: 'User Deleted Successfully!',
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text('User Statistics Report', 14, 20);

    // Add user statistics table
    const tableData = userList.map((user) => [
      user._id,
      user.name,
      user.email,
      user.orders.length,
      user.isVerified ? 'Yes' : 'No',
    ]);

    doc.autoTable({
      head: [userColumns],
      body: tableData,
      startY: 30,
    });

    // Save the PDF
    doc.save('user_statistics_report.pdf');
  };

  useEffect(() => {
    if (!userList) {
      dispatch(listUsers({}));
    }
  }, [dispatch, userList]);

  return (
    <div className="w-full p-4">
      <h2 className="text-2xl font-bold my-2">All Users</h2>
      <div className="mb-4 flex justify-end">
            <button
              onClick={generatePDF}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Generate PDF Report
            </button>
          </div>
      {loading ? (
        <Loader />
      ) : (
        <>
          {(userListError || userDeleteByIdError) && (
            <Message>{userListError || userDeleteByIdError}</Message>
          )}
          {successMessageDelete && <Message>{successMessageDelete}</Message>}
          <div className="mt-4">
            {userList.length > 0 ? (
              <>
                <Table
                  data={userList}
                  columns={userColumns}
                  handleDelete={handleDelete}
                />
                {/* <UserStats userList={userList} /> Add the stats here */}
         
              </>
            ) : (
              <h2 className="text-white text-xl text-center rounded-md border-2 border-orange-400 font-semibold mb-2 p-4">
                No Users Found..
              </h2>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default UsersList;
