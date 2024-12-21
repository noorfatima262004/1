
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import 'jspdf-autotable';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from 'chart.js';


// Import Thunks
import {
  deleteOrderById,
  listOrders,
  updateOrderById,
} from '../../../../../redux/asyncThunks/orderThunks';

// Import Components
import Loader from '../../../Loader';
import Message from '../../../Message';
import Table from '../Table';

// Register Chart.js components
ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

function OrdersList() {
  const orderColumns = [
    '_id',
    'user',
    'status',
    'salesTax',
    'deliveryCharges',
    'totalPrice',
    'orderItems',
    'deliveredAt',
  ];

  const dispatch = useDispatch();

  const order = useSelector((state) => state.order);
  const {
    loading,
    orderList,
    orderListError,
    orderDeleteByIdError,
    orderDeleteByIdSuccess,
    orderUpdateByIdError,
    orderUpdateByIdSuccess,
  } = order;

  const ordersReceived =
    orderList && orderList.filter((order) => order.status === 'Received');
  const ordersInTheKitchen =
    orderList && orderList.filter((order) => order.status === 'In the Kitchen');
  const ordersSentForDelivery =
    orderList &&
    orderList.filter((order) => order.status === 'Sent for Delivery');
  const ordersDelivered =
    orderList && orderList.filter((order) => order.status === 'Delivered');

  const handleDelete = (id) => {
    dispatch(deleteOrderById(id)).then(() => dispatch(listOrders({})));
  };

  const successMessageDelete = orderDeleteByIdSuccess && {
    status: '200',
    message: 'Order Deleted Successfully!',
  };

  const handleUpdate = (id, selectedStatus) => {
    dispatch(
      updateOrderById({
        id,
        status: selectedStatus,
      })
    ).then(() => dispatch(listOrders({})));
  };

  const successMessageUpdate = orderUpdateByIdSuccess && {
    status: '200',
    message: 'Order Updated Successfully!',
  };


  // Profit calculation
  const calculateProfit = () => {
    return orderList.reduce((totalProfit, order) => {
      const orderRevenue = (order.totalPrice*order.orderItems.length); // Total revenue for the order
      const orderCosts = order.totalPrice-order.salesTax-order.deliveryCharges; // If no COGS provided, assume it's 0
      const orderProfit = orderRevenue - orderCosts;
      return totalProfit + orderProfit;
    }, 0);
  };

  
  // Revnue calculation
  const calculateRevenue = () => {
    return orderList.reduce((total, order) => total + (order.totalPrice*order.orderItems.length), 0);
  };

  
  const generateRevenuePDF = () => {
    const doc = new jsPDF('landscape'); // Use landscape mode for a wider layout
    doc.text('Orders Report', 14, 20);

    // Define custom column widths
    const columnStyles = {
      0: { cellWidth: 53 }, // For `_id`
      1: { cellWidth: 53 }, // For `user`
      2: { cellWidth: 28 }, // For `status`
      3: { cellWidth: 18 }, // For `salesTax`
      4: { cellWidth: 18 }, // For `deliveryCharges`
      5: { cellWidth: 20 }, // For `totalPrice`
      6: { cellWidth: 22 }, // For `orderItems`
      7: { cellWidth: 48 }, // For `deliveredAt`
    };
  
    // Add order data to PDF
    const tableData = orderList.map((order) => [
      order._id,
      order.user,
      order.status,
      order.salesTax,
      order.deliveryCharges,
      order.totalPrice,
      order.orderItems.length,
      order.deliveredAt || 'N/A',
    ]);
  
    doc.autoTable({
      head: [orderColumns],
      body: tableData,
      startY: 40,
      theme: 'grid',
      styles: {
        fontSize: 10, // Adjust font size if necessary
        textColor: [0, 0, 0], // Ensure text is black
      },
      columnStyles: columnStyles,
      tableWidth: 'auto',
      didParseCell: (data) => {
        // Apply background colors based on order status (assume status is in the 3rd column)
        const rowIndex = data.row.index;
        const status = orderList[rowIndex]?.status;
  
        if (data.section === 'body' && data.column.index === 2) {
          if (status === 'Received') {
            data.cell.styles.fillColor = [230, 240, 255]; // Light blue
          } else if (status === 'In the Kitchen') {
            data.cell.styles.fillColor = [255, 243, 205]; // Light yellow
          } else if (status === 'Sent for Delivery') {
            data.cell.styles.fillColor = [255, 230, 230]; // Light red
          } else if (status === 'Delivered') {
            data.cell.styles.fillColor = [220, 255, 220]; // Light green
          }
        }
      },
    });
  
    // Save PDF
    doc.save('orders_report.pdf');
  };
  
  useEffect(() => {
    if (!orderList) {
      dispatch(listOrders({}));
    }
  }, [dispatch, orderList]);

  // Prepare data for the bar chart
  const chartData = {
    labels: ['Received', 'In the Kitchen', 'Sent for Delivery', 'Delivered'],
    datasets: [
      {
        label: 'Number of Orders',
        data: [
          ordersReceived.length,
          ordersInTheKitchen.length,
          ordersSentForDelivery.length,
          ordersDelivered.length,
        ],
        backgroundColor: ['#FF6384', '#4682B4', '#FFCE56', '#77DD77'], // Custom colors
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: '#000000', // Black text for better visibility
          font: {
            size: 14, // Slightly larger font size
          },
        },
      },
      title: {
        display: true,
        text: 'Order Status Overview', // Add a descriptive title
        color: '#000000', // Black text for better contrast
        font: {
          size: 18, // Larger font for title
          weight: 'bold',
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#000000', // Black text for x-axis labels
          font: {
            size: 12,
          },
        },
        title: {
          display: true,
          text: 'Order Status',
          color: '#000000',
          font: {
            size: 14,
            weight: 'bold',
          },
        },
      },
      y: {
        ticks: {
          color: '#000000', // Black text for y-axis labels
          font: {
            size: 12,
          },
        },
        title: {
          display: true,
          text: 'Number of Orders',
          color: '#000000',
          font: {
            size: 14,
            weight: 'bold',
          },
        },
      },
    },
  };
// line chart

const prepareChartData = () => {
  const revenueByDate = {};

  orderList.forEach((order) => {
    const date = new Date(order.createdAt).toLocaleDateString();
    const revenue = order.totalPrice;

    if (revenueByDate[date]) {
      revenueByDate[date] += revenue;
    } else {
      revenueByDate[date] = revenue;
    }
  });

  const labels = Object.keys(revenueByDate);
  const data = Object.values(revenueByDate);

  return { labels, data };
};

// const { labels, data } = prepareChartData();

// const LinechartData = {
//   labels: labels,
//   datasets: [
//     {
//       label: 'Revenue',
//       data: data,
//       fill: false,
//       borderColor: '#4bc0c0',
//       tension: 0.1,
//     },
//   ],
// };

// const LinechartOptions = {
//   responsive: true,
//   plugins: {
//     legend: {
//       display: true,
//       labels: {
//         color: '#000000',
//       },
//     },
//     title: {
//       display: true,
//       text: 'Revenue Over Time',
//       color: '#000000',
//       font: {
//         size: 18,
//         weight: 'bold',
//       },
//     },
//   },
//   scales: {
//     x: {
//       ticks: {
//         color: '#000000',
//       },
//       title: {
//         display: true,
//         text: 'Date',
//         color: '#000000',
//         font: {
//           size: 14,
//           weight: 'bold',
//         },
//       },
//     },
//     y: {
//       ticks: {
//         color: '#000000',
//       },
//       title: {
//         display: true,
//         text: 'Revenue ($)',
//         color: '#000000',
//         font: {
//           size: 14,
//           weight: 'bold',
//         },
//       },
//     },
//   },
// };

const generateRevenueReportPDF = async () => {
  console.log('Generating revenue report...');
  const doc = new jsPDF('landscape');

  // Add Title with Larger Font Size
  doc.setFontSize(18); // Increase font size for title
  doc.text('Revenue Report', 14, 20);

  const totalRevenue = calculateRevenue();
  console.log('Total revenue calculated:', totalRevenue);

  // Add Total Revenue with Highlight
  doc.setFontSize(16); // Larger font size for total revenue
  doc.setTextColor(255, 0, 0); // Bright red for emphasis
  doc.text(`Total Revenue: $${totalRevenue.toFixed(2)}`, 14, 30);

     const totalProfit = calculateProfit();
  

  doc.text(`Total Profit: $${totalProfit.toFixed(2)}`, 14, 40);
  
  const { labels, data } = prepareChartData();
  console.log('Chart data prepared:', { labels, data });

  // Bright colors for the chart
  const LinechartData = {
    labels: labels,
    datasets: [
      {
        label: 'Revenue',
        data: data,
        fill: true, // Enable filling for a more vibrant look
        backgroundColor: 'rgba(255, 99, 132, 0.2)', // Bright background
        borderColor: 'rgba(255, 99, 132, 1)', // Bright border color
        pointBackgroundColor: 'rgba(54, 162, 235, 1)', // Bright points
        tension: 0.4, // Smooth lines
        borderWidth: 3, // Thicker lines
      },
    ],
  };

  const LinechartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Revenue Over Time',
        color: '#4bc0c0',
        font: {
          size: 20, // Larger chart title font size
          weight: 'bold',
        },
      },
      legend: {
        labels: {
          color: '#000',
          font: {
            size: 14, // Larger legend font size
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#000',
          font: {
            size: 12, // Larger x-axis font size
          },
        },
      },
      y: {
        ticks: {
          color: '#000',
          font: {
            size: 12, // Larger y-axis font size
          },
        },
      },
    },
  };

  const canvasElement = document.createElement('canvas');
  canvasElement.width = 800;
  canvasElement.height = 400;
  document.body.appendChild(canvasElement);

  const chart = new ChartJS(canvasElement.getContext('2d'), {
    type: 'line',
    data: LinechartData,
    options: LinechartOptions,
  });

  // Wait for chart to render
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Use html2canvas to capture the chart
  await html2canvas(canvasElement).then((canvas) => {
    const chartImage = canvas.toDataURL('image/png');
    console.log('Generated Chart Image:', chartImage);
    if (chartImage.startsWith('data:image/png')) {
      doc.addImage(chartImage, 'PNG', 14, 50, 250, 120); // Slightly increase chart size
      console.log('Chart added to PDF.');
    } else {
      console.error('Failed to add chart image to PDF.');
    }
    chart.destroy();
    document.body.removeChild(canvasElement);
  });

  // Save the PDF
  doc.save('revenue_report.pdf');
};






  return (
    <div className="w-full p-4">
      <h2 className="text-2xl font-bold my-2">All Orders</h2>
      {loading ? (
        <Loader />
      ) : (
        <>
          {(orderListError || orderDeleteByIdError || orderUpdateByIdError) && (
            <Message>
              {orderListError || orderDeleteByIdError || orderUpdateByIdError}
            </Message>
          )}
          {(successMessageDelete || successMessageUpdate) && (
            <Message>{successMessageDelete || successMessageUpdate}</Message>
          )}
          <div className="mt-4">
            {orderList.length > 0 ? (
              <>
                <div className="mb-4 flex justify-end">
                  <button
                    onClick={generateRevenuePDF}
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                  >
                    Generate PDF Report
                  </button>
                </div>
              

                <div className="mb-4 flex justify-end">
                  <button
                    onClick={generateRevenueReportPDF}
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                  >
                    Generate Revenue  Report
                  </button>
                </div>
                
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh', // Full viewport height for vertical centering
                  }}
                >
                  <Bar data={chartData} options={chartOptions} />
                </div>

                {ordersReceived.length > 0 ? (
                  <div className="mb-4">
                    <h1 className="text-3xl text-center font-bold border-b-2 border-orange-900 p-1 my-2">
                      Received Orders
                    </h1>
                    <Table
                      data={ordersReceived}
                      columns={orderColumns}
                      handleDelete={handleDelete}
                      handleChange={handleUpdate}
                    />
                  </div>
                ) : (
                  <h2 className="text-white text-xl text-center rounded-md border-2 border-orange-400 font-semibold mb-2 p-4">
                    No Orders Received Yet..
                  </h2>
                )}
                {ordersInTheKitchen.length > 0 ? (
                  <div className="mb-4">
                    <h1 className="text-3xl text-center font-bold border-b-2 border-orange-900 p-1 my-2">
                      Orders In The Kitchen
                    </h1>

                    <Table
                      data={ordersInTheKitchen}
                      columns={orderColumns}
                      handleDelete={handleDelete}
                      handleChange={handleUpdate}
                    />
                  </div>
                ) : (
                  <h2 className="text-white text-xl text-center rounded-md border-2 border-orange-400 font-semibold mb-2 p-4">
                    No Orders In The Kitchen..
                  </h2>
                )}
                {ordersSentForDelivery.length > 0 ? (
                  <div className="mb-4">
                    <h1 className="text-3xl text-center font-bold border-b-2 border-orange-900 p-1 my-2">
                      Orders Sent For Delivery
                    </h1>

                    <Table
                      data={ordersSentForDelivery}
                      columns={orderColumns}
                      handleDelete={handleDelete}
                      handleChange={handleUpdate}
                    />
                  </div>
                ) : (
                  <h2 className="text-white text-xl text-center rounded-md border-2 border-orange-400 font-semibold mb-2 p-4">
                    No Orders Sent For Delivery..
                  </h2>
                )}
                {ordersDelivered.length > 0 ? (
                  <div className="mb-4">
                    <h1 className="text-3xl text-center font-bold border-b-2 border-orange-900 p-1 my-2">
                      Orders Delivered
                    </h1>

                    <Table
                      data={ordersDelivered}
                      columns={orderColumns}
                      handleDelete={handleDelete}
                      handleChange={handleUpdate}
                    />
                  </div>
                ) : (
                  <h2 className="text-white text-xl text-center rounded-md border-2 border-orange-400 font-semibold mb-2 p-4">
                    No Orders Delivered..
                  </h2>
                )}
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {/* <Line data={LinechartData} options={LinechartOptions} /> */}
          </div>
              </>
            ) : (
              <h2 className="text-white text-xl text-center rounded-md border-2 border-orange-400 font-semibold mb-2 p-4">
                No Orders Found..
              </h2>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default OrdersList;
