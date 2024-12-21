import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Chart, registerables } from 'chart.js';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Import Thunks
import { deleteStockById, listInventory, updateStockById } from '../../../../../redux/asyncThunks/inventoryThunks';

// Import Components
import Loader from '../../../Loader';
import Message from '../../../Message';
import Table from '../Table';

Chart.register(...registerables);

function InventoryList() {
  const inventoryColumns = ['_id', 'item', 'price', 'threshold', 'quantity'];

  const dispatch = useDispatch();
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  const inventory = useSelector((state) => state.inventory);
  const {
    loading,
    inventoryList,
    inventoryListError,
    inventoryDeleteByIdError,
    inventoryDeleteByIdSuccess,
  } = inventory;

  useEffect(() => {
    if (!inventoryList) {
      dispatch(listInventory({}));
    }
  }, [dispatch, inventoryList]);

  useEffect(() => {
    if (inventoryList && chartRef.current) {
      // Destroy previous chart instance if it exists
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      const ctx = chartRef.current.getContext('2d');
      const data = [
        inventoryList.bases?.length || 0,
        inventoryList.cheeses?.length || 0,
        inventoryList.sauces?.length || 0,
        inventoryList.veggies?.length || 0,
      ];

      chartInstanceRef.current = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['Bases', 'Cheeses', 'Sauces', 'Veggies'],
          datasets: [
            {
              data,
              backgroundColor: ['#ff6384', '#36a2eb', '#cc65fe', '#FFDB58'],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: {
              labels: {
                color: 'white',
                font: {
                  size: 14,
                  weight: 'bold',
                },
              },
            },
          },
        },
      });
    }

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [inventoryList]);


    const handleDelete = (id) => {
      dispatch(deleteStockById(id)).then(() => dispatch(listInventory({})));
    };

    const handleUpdate = (id, selectedStatus) => {
        dispatch(
          updateStockById({
            id,
            status: selectedStatus,
          })
        ).then(() => dispatch(listInventory({})));
      };
    

  // Function to generate PDF report
  const generatePDF = () => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(18);
    doc.text('Inventory Report', 20, 20);

    // Data for each inventory category
    const inventoryData = [
      { category: 'Bases', data: inventoryList.bases, color: '#ff6384' },
      { category: 'Cheeses', data: inventoryList.cheeses, color: '#36a2eb' },
      { category: 'Sauces', data: inventoryList.sauces, color: '#cc65fe' },
      { category: 'Veggies', data: inventoryList.veggies, color: '#DAA520' },
    ];

    let yPosition = 30;

    // Loop through categories and create tables
    inventoryData.forEach((category) => {
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text(category.category, 20, yPosition);
      yPosition += 10;

      const tableData = category.data.map((item) => [
        item._id,
        item.item,
        item.price,
        item.threshold,
        item.quantity,
      ]);

      autoTable(doc, {
        startY: yPosition,
        head: [
          ['_id', 'Item', 'Price', 'Threshold', 'Quantity']
        ],
        body: tableData,
        styles: {
          fillColor: [255, 255, 255],  // Set body rows to white or default color
          textColor: [0, 0, 0],  // Set text color to black for body rows
        },
        headStyles: {
          fillColor: [category.color],  // Set header row color
          textColor: [255, 255, 255],  // Set header text color to white
          fontStyle: 'bold',
        },
        theme: 'grid',
      });

      yPosition = doc.lastAutoTable.finalY + 10; // Adjust for next table
    });

    // Save the PDF
    doc.save('inventory_report.pdf');
  };

  return (
    <div className="w-full p-4">
      <h2 className="text-2xl font-bold my-2">All Stocks</h2>
      {loading ? (
        <Loader />
      ) : (
        <>
          {(inventoryListError || inventoryDeleteByIdError) && (
            <Message>{inventoryListError || inventoryDeleteByIdError}</Message>
          )}
          {inventoryDeleteByIdSuccess && (
            <Message>Inventory Item Deleted Successfully!</Message>
          )}
          <div className="mt-4">
            {inventoryList ? (
              <>
                {/* Render inventory tables */}
                {['bases', 'cheeses', 'sauces', 'veggies'].map((category) => (
                  <div className="mb-4" key={category}>
                    <h1 className="text-3xl text-center font-bold border-b-2 border-orange-900 p-1 my-2">
                      All {category.charAt(0).toUpperCase() + category.slice(1)}
                    </h1>
                    <Table
                      data={inventoryList[category]}
                      columns={inventoryColumns}
                      handleDelete={handleDelete}
                      handleChange={handleUpdate}
                    />

                  </div>
                ))}

                <div className="flex justify-center items-center mt-10 gap-20">
                  <canvas
                    ref={chartRef}
                    className="w-40 h-44"
                    style={{ maxWidth: '900px', maxHeight: '600px' }}
                  ></canvas>
                </div>
                <div className="mb-4 flex justify-end">
                  <button
                    onClick={generatePDF}
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                  >
                    Generate PDF Report
                  </button>
                </div>
              </>
            ) : (
              <h2 className="text-white text-xl text-center rounded-md border-2 border-orange-400 font-semibold mb-2 p-4">
                No Stock Found..
              </h2>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default InventoryList;
