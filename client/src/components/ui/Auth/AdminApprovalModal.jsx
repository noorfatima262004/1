import PropTypes from 'prop-types';

function AdminApprovalModal() {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-10 bg-gray-800 bg-opacity-50 p-4">
      <div className="bg-white rounded-2xl p-4 sm:p-6 w-full sm:w-2/3 md:w-1/2 shadow-lg">
        <h2 className="text-2xl text-orange-500 font-bold mb-4">
          Account Approval Pending
        </h2>
        <p className="text-center text-black text-xl leading-relaxed">
          Your account is currently pending approval. Please wait until an admin approves your account to gain access.
        </p>
      </div>
    </div>
  );
}

export default AdminApprovalModal;
