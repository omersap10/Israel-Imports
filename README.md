# 🇮🇱 Israel Imports Dashboard 📊

A modern and interactive web application for analyzing Israel’s import statistics. Built with **React.js**, the app fetches real-time data from the [data.gov.il](https://data.gov.il/) API and displays key insights, charts, and filters for a better understanding of Israel's import economy.

---

## 🚀 Features

- 📁 **Live data** pulled from the Israeli government open data API
- 🔍 **Smart filtering** by year, country, customs house, goods type, etc.
- 📈 **Advanced charts** (bar, pie) for:
  - Top countries by import value
  - Goods group frequency
  - Average import value per customs house
  - Currency usage distribution
  - Preferred trade agreements
  - Discrepancy between declared customs tax and goods value
- 🔃 **Sorting and pagination** for large data sets
- 📤 **Export to Excel** for selected data
- 🎨 **Modern responsive UI** using CSS and Recharts

---

## 🛠 Tech Stack

- **Frontend**: React.js, CSS (custom), Recharts
- **Data Fetching**: Axios
- **Export**: SheetJS (xlsx), file-saver
- **Data Source**: [Israel Import Statistics - data.gov.il](https://data.gov.il/dataset/6d3b03e1-de9c-42a8-bb08-91ba564c2f34)

---

## 📦 Installation

```bash
git clone https://github.com/omersap10/Israel-Imports.git
cd Israel-Imports
npm install
npm start
