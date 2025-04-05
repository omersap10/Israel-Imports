import React, { useState } from "react";
import "./TableControls.css";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const CATEGORY_LABELS = {
  Year: "שנה",
  Origin_Country: "מדינה",
  GovernmentProcedureTypeName: "קבוצת טובין",
  Quantity_MeasurementUnitName: "יחידת מידה",
  TermsOfSale: "תנאי מכר",
  TradeAgreementName: "הסכם סחר",
  CustomsHouse: "בית מכס",
};

const SORTABLE_FIELDS = {
  ...CATEGORY_LABELS,
  NISCurrencyAmount: 'שווי (ש"ח)',
  Quantity: "כמות",
  GeneralCustomsTax: "מכס",
  PurchaseTax: "מס קנייה",
  VAT: 'מע"מ',
};

const NON_NUMERIC_FILTERS = Object.keys(CATEGORY_LABELS);

const TableControls = ({
  sortField,
  setSortField,
  sortOrder,
  setSortOrder,
  filters,
  setFilters,
  uniqueOptions,
  filteredData,
}) => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [tempSelections, setTempSelections] = useState([]);
  const [showSubmit, setShowSubmit] = useState(false);

  const handleCheckboxChange = (e) => {
    const value = e.target.value;
    setTempSelections((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
    setShowSubmit(true);
  };

  const handleSubmitFilters = () => {
    if (selectedCategory) {
      setFilters({
        ...filters,
        [selectedCategory]: tempSelections,
      });
    }
    setShowSubmit(false);
  };

  const scrollToInsights = () => {
    const el = document.getElementById("insights-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const removeFilter = (key) => {
    const updated = { ...filters };
    delete updated[key];
    setFilters(updated);
  };

  const activeFilters = Object.entries(filters)
    .filter(([_, val]) => val?.length > 0)
    .map(([key, val]) => ({
      key,
      label: CATEGORY_LABELS[key] || key,
      values: val.join(", "),
    }));

  // Export table to Excel
  const exportToExcel = () => {
    if (!filteredData || filteredData.length === 0) {
      alert("אין נתונים לייצוא");
      return;
    }

    const exportFields = {
      Year: "שנה",
      Origin_Country: "מדינה",
      GovernmentProcedureTypeName: "קבוצת טובין",
      NISCurrencyAmount: 'שווי (ש"ח)',
      Quantity: "כמות",
      Quantity_MeasurementUnitName: "יחידת מידה",
      TermsOfSale: "תנאי מכר",
      TradeAgreementName: "הסכם סחר",
      CustomsHouse: "בית מכס",
      GeneralCustomsTax: "מכס",
      PurchaseTax: "מס קנייה",
      VAT: 'מע"מ',
    };

    const exportRows = filteredData.map((row) => {
      const exportRow = {};
      for (const [key, label] of Object.entries(exportFields)) {
        exportRow[label] = row[key] || "";
      }
      return exportRow;
    });

    const worksheet = XLSX.utils.json_to_sheet(exportRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "נתוני ייבוא");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, "נתוני_ייבוא.xlsx");
  };

  return (
    <>
      <div className="dashboard-controls-card">
        {/* Filter */}
        <div className="controls-card">
          <h3>סינון</h3>
          <div className="filter-section">
            <div>
              <label>בחר קטגוריה:</label>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  const selected = e.target.value;
                  setSelectedCategory(selected);
                  setTempSelections(filters[selected] || []);
                }}
              >
                <option value="">-- ללא --</option>
                {NON_NUMERIC_FILTERS.map((field) => (
                  <option key={field} value={field}>
                    {CATEGORY_LABELS[field]}
                  </option>
                ))}
              </select>
            </div>

            {selectedCategory && (
              <div className="filter-fields">
                <label>שדות:</label>
                <div className="filter-fields-options">
                  {(uniqueOptions[selectedCategory] || [])
                    .filter((val) => val && val !== "")
                    .map((val) => (
                      <label key={val} className="filter-checkbox">
                        <input
                          type="checkbox"
                          value={val}
                          checked={tempSelections.includes(val)}
                          onChange={handleCheckboxChange}
                        />
                        {val}
                      </label>
                    ))}
                </div>
              </div>
            )}

            {showSubmit && (
              <button onClick={handleSubmitFilters} className="filter-submit">
                החל סינון
              </button>
            )}
          </div>
        </div>

        {/* Sort */}
        <div className="controls-card">
          <h3>מיון</h3>
          <div className="sort-section">
            <div>
              <label>מיין לפי:</label>
              <select
                value={sortField}
                onChange={(e) => setSortField(e.target.value)}
              >
                <option value="">-- ללא --</option>
                {Object.entries(SORTABLE_FIELDS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label>סדר:</label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="asc"> עולה 🡡</option>
                <option value="desc"> יורד 🡣</option>
              </select>
            </div>
          </div>
        </div>

        {/* Insights and Export */}
        <div className="controls-card">
          <h3>ניתוח נתונים ראשוני</h3>
          <div className="insights-summary">
            <div className="insights-summary">
              <ul>
                <li>
                  המדינה המובילה בייבוא: <strong>סין</strong>
                </li>
                <li>
                  המטבע הנפוץ ביותר: <strong>USD</strong>
                </li>
                <li>
                  בתי מכס בולטים: <strong>אילת, נהר הירדן ואשדוד </strong>
                </li>
              </ul>
            </div>
            <button onClick={scrollToInsights}>
              עבור לאזור ניתוח מתקדם 🔍
            </button>
            <button onClick={exportToExcel} className="export-button">
              ייצוא לאקסל 📤
            </button>
          </div>
        </div>
      </div>

      {/* Active Filters Summary */}
      {activeFilters.length > 0 && (
        <div className="active-filters-card">
          <h4>סינון פעיל:</h4>
          {activeFilters.map((f, i) => (
            <div className="filter-tag" key={i}>
              <span>
                <strong>{f.label}:</strong> {f.values}
              </span>
              <button onClick={() => removeFilter(f.key)}>❌</button>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default TableControls;
