import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import { fetchImportData } from "../../services/api";
import TableControls from "../TableControls/TableControls";
import "./SimpleTable.css";
import InsightsChart from "../InsightsChart/InsightsChart";

const SimpleTable = () => {
  const [data, setData] = useState([]);
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 20;

  useEffect(() => {
    const getData = async () => {
      try {
        const rows = await fetchImportData();
        setData(rows);
      } catch (err) {
        alert(err.message);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  const isNumeric = (v) => !isNaN(parseFloat(v)) && isFinite(v);

  const handleSort = (a, b) => {
    if (!sortField) return 0;
    let valA = a[sortField];
    let valB = b[sortField];

    // Sort for numbers
    if (isNumeric(valA) && isNumeric(valB)) {
      return sortOrder === "asc"
        ? parseFloat(valA) - parseFloat(valB) // Ascending order
        : parseFloat(valB) - parseFloat(valA); // Descending order
    }

    // Sort for strings
    return sortOrder === "asc"
      ? String(valA || "").localeCompare(String(valB || ""))
      : String(valB || "").localeCompare(String(valA || ""));
  };

  // Get all the fields of category, create a new set (without dup)
  const getUniqueValues = (key) => {
    return [...new Set(data.map((row) => row[key]).filter(Boolean))];
  };

  const applyFilters = (rows) => {
    return rows.filter((row) => {
      return Object.entries(filters).every(([field, values]) => {
        return values.includes(row[field]);
      });
    });
  };

  // All the categories that can be filtered
  const uniqueOptions = {
    Year: getUniqueValues("Year"),
    Origin_Country: getUniqueValues("Origin_Country"),
    GovernmentProcedureTypeName: getUniqueValues("GovernmentProcedureTypeName"),
    Quantity_MeasurementUnitName: getUniqueValues(
      "Quantity_MeasurementUnitName"
    ),
    TermsOfSale: getUniqueValues("TermsOfSale"),
    TradeAgreementName: getUniqueValues("TradeAgreementName"),
    CustomsHouse: getUniqueValues("CustomsHouse"),
  };

  const filteredData = applyFilters(data);
  const sortedData = [...filteredData].sort(handleSort);

  // Pagination
  const totalPages = Math.ceil(sortedData.length / rowsPerPage);
  const currentRows = sortedData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const goToNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const goToPrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <div className="simple-table-wrapper">
      {loading ? (
        <div className="loading-message">
          <div className="spinner"></div>
          הטבלה בטעינה...
        </div>
      ) : (
        <>
          <TableControls
            sortField={sortField}
            setSortField={setSortField}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            filters={filters}
            setFilters={setFilters}
            uniqueOptions={uniqueOptions}
            filteredData={filteredData}
          />

          <TableContainer component={Paper} className="table-paper">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center">שנה</TableCell>
                  <TableCell align="center">מדינה</TableCell>
                  <TableCell align="center">קבוצת טובין</TableCell>
                  <TableCell align="center">שווי (ש"ח)</TableCell>
                  <TableCell align="center">כמות</TableCell>
                  <TableCell align="center">יחידת מידה</TableCell>
                  <TableCell align="center">תנאי מכר</TableCell>
                  <TableCell align="center">הסכם סחר</TableCell>
                  <TableCell align="center">בית מכס</TableCell>
                  <TableCell align="center">מכס</TableCell>
                  <TableCell align="center">מס קנייה</TableCell>
                  <TableCell align="center">מע"מ</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {currentRows.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell align="center">{row.Year}</TableCell>
                    <TableCell align="center">{row.Origin_Country}</TableCell>
                    <TableCell align="center">
                      {row.GovernmentProcedureTypeName}
                    </TableCell>
                    <TableCell align="center">
                      {row.NISCurrencyAmount}
                    </TableCell>
                    <TableCell align="center">{row.Quantity}</TableCell>
                    <TableCell align="center">
                      {row.Quantity_MeasurementUnitName}
                    </TableCell>
                    <TableCell align="center">{row.TermsOfSale}</TableCell>
                    <TableCell align="center">
                      {row.TradeAgreementName}
                    </TableCell>
                    <TableCell align="center">{row.CustomsHouse}</TableCell>
                    <TableCell align="center">
                      {row.GeneralCustomsTax}
                    </TableCell>
                    <TableCell align="center">{row.PurchaseTax}</TableCell>
                    <TableCell align="center">{row.VAT}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination-controls">
              <Button onClick={goToPrevPage} disabled={currentPage === 1}>
                ▶
              </Button>
              <span>
                עמוד {currentPage} מתוך {totalPages}
              </span>
              <Button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
              >
                ◀
              </Button>
            </div>
          )}

          {/* Insights Section */}
          <div id="insights-section">
            <InsightsChart data={filteredData} />
          </div>
        </>
      )}
    </div>
  );
};

export default SimpleTable;
