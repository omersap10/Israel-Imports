import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import "./InsightsChart.css";

const InsightsChart = ({ data }) => {
  // Chart 1: Total import value per country
  const countryTotals = data.reduce((acc, row) => {
    const country = row.Origin_Country?.trim();
    const amount = parseFloat(row.NISCurrencyAmount) || 0;
    if (!country || country === "") return acc;
    acc[country] = (acc[country] || 0) + amount;
    return acc;
  }, {});
  const countryChartData = Object.entries(countryTotals)
    .map(([country, value]) => ({ country, value: Math.round(value) }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  // Chart 2: Count of records per item group
  const procedureCounts = data.reduce((acc, row) => {
    const group = row.GovernmentProcedureTypeName?.trim();
    if (!group || group === "") return acc;
    acc[group] = (acc[group] || 0) + 1;
    return acc;
  }, {});
  const groupChartData = Object.entries(procedureCounts)
    .map(([group, count]) => ({ group, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Chart 3: Average import value per Customs House
  const customsStats = data.reduce((acc, row) => {
    const house = row.CustomsHouse?.trim();
    const amount = parseFloat(row.NISCurrencyAmount) || 0;
    if (!house || house === "") return acc;
    if (!acc[house]) acc[house] = { sum: 0, count: 0 };
    acc[house].sum += amount;
    acc[house].count += 1;
    return acc;
  }, {});
  const customsAvgChartData = Object.entries(customsStats)
    .filter(([house]) => house !== "Other")
    .map(([house, { sum, count }]) => ({
      house,
      avg: Math.round(sum / count),
    }));

  // Chart 4: Currency code distribution
  const currencyCounts = data.reduce((acc, row) => {
    const currency = row.CurrencyCode?.trim();
    if (!currency) return acc;
    acc[currency] = (acc[currency] || 0) + 1;
    return acc;
  }, {});
  const currencyChartData = Object.entries(currencyCounts).map(
    ([currency, count]) => ({ currency, count })
  );

  const pieColors = [
    "#3366CC", // strong blue
    "#DC3912", // red
    "#FF9900", // orange
    "#109618", // green
    "#990099", // purple
    "#0099C6", // light blue
    "#DD4477", // pink
    "#66AA00", // lime
    "#B82E2E", // dark red
    "#316395", // muted blue
    "#994499", // mauve
    "#22AA99", // teal
    "#AAAA11", // olive
    "#6633CC", // deep purple
    "#E67300", // vivid orange
  ];

  // Chart 5: Trade Agreement Preference
  const agreementCounts = data.reduce((acc, row) => {
    const agreement = row.TradeAgreementName?.trim();
    if (!agreement || agreement === "") return acc;
    acc[agreement] = (acc[agreement] || 0) + 1;
    return acc;
  }, {});
  const agreementChartData = Object.entries(agreementCounts).map(
    ([agreement, count]) => ({ agreement, count })
  );

  // Chart 6: Customs Tax vs. Goods Value (aggregated difference per customs house)
  const taxDiscrepancy = data.reduce((acc, row) => {
    const house = row.CustomsHouse?.trim();
    const value = parseFloat(row.NISCurrencyAmount) || 0;
    const declaredTax = parseFloat(row.GeneralCustomsTax) || 0;
    if (!house || house === "") return acc;
    if (!acc[house]) acc[house] = { value: 0, declared: 0, count: 0 };
    acc[house].value += value;
    acc[house].declared += declaredTax;
    acc[house].count += 1;
    return acc;
  }, {});
  const discrepancyChartData = Object.entries(taxDiscrepancy).map(
    ([house, { value, declared, count }]) => ({
      house,
      discrepancy: Math.round(value - declared),
    })
  );

  /* Summary statistics
  const totalImports = countryChartData.reduce((sum, c) => sum + c.value, 0);
  const topCountry =
    [...countryChartData].sort((a, b) => b.value - a.value)[0]?.country || "";
  const mostUsedCurrency =
    [...currencyChartData].sort((a, b) => b.count - a.count)[0]?.currency || "";*/

  return (
    <div className="insights-section-wrapper">
      <h2 className="insights-section-title"> ניתוח נתונים מתקדם 🔍</h2>
      <div className="summary-box">
        <h4>מסקנות עיקריות:</h4>
        <ul>
          <li>
            <strong> סין</strong> היא שותפת הסחר העיקרית של ישראל בייבוא, עם
            שווי כולל גבוה במיוחד – דבר המצביע על תלות בולטת בשרשרת האספקה
            מהמזרח הרחוק.
          </li>
          <li>
            המטבע הנפוץ ביותר בעסקאות ייבוא הוא{" "}
            <strong>הדולר האמריקאי (USD)</strong>, דבר שמצביע על קשרי סחר
            גלובליים בדגש על ארה"ב וספקים מבוססי דולר.
          </li>
          <li>
            בתי מכס כמו <strong>אילת</strong>, <strong>אשדוד</strong> ו
            <strong>חיפה</strong> מטפלים בעסקאות עם שווי ממוצע גבוה יותר, מה
            שמרמז על תפקידם המרכזי במסחר הימי.
          </li>
          <li>
            מדינות כגון <strong>סין, בריטניה</strong> ו<strong>ארה"ב</strong>,
            מהוות חלק ניכר מסך הייבוא, מה שמעיד על{" "}
            <strong>תלות גבוהה בספקים גלובליים מרכזיים</strong> – מצב שמחייב
            מדיניות לגיוון מקורות הייבוא.
          </li>
          <li>
            קבוצות טובין מסוימות, כמו ייבוא מסחרי, מופיעות בתדירות חריגה, מה
            שעשוי לשקף <strong>צמיחה בביקוש פנימי</strong> לסוגי מוצרים אלו, או
            לחלופין <strong>רגולציה מקלה</strong> עבורם.
          </li>
          <li>
            נמצא כי קיימת <strong>העדפה להסכמי סחר מסוימים</strong>, כמו ההסכם
            ההאירופי – מה שמעלה את החשיבות להמשך פיתוח ושימור הסכמים בינלאומיים
            שמיטיבים עם היבואן הישראלי.
          </li>
          <li>
            קיימת שונות ניכרת בין <strong>המיסים שהוצהרו</strong> לבין{" "}
            <strong>שווי הסחורה בפועל</strong>, תופעה שעשויה להעיד על{" "}
            <strong>פערי דיווח, תמריצי מס, או חוסר אחידות רגולטורית</strong>.
          </li>
        </ul>
      </div>

      {/* Chart 1 */}
      <div className="insights-chart-wrapper">
        <h3> שווי ייבוא לפי מדינה (Top 10)</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart
            data={countryChartData}
            margin={{ top: 20, right: 30, bottom: 50, left: 80 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="country"
              angle={-35}
              textAnchor="end"
              interval={0}
              height={60}
              tick={{ fontSize: 12 }}
              dy={15}
              dx={-5}
            />
            <YAxis
              tickFormatter={(v) => v.toLocaleString("he-IL")}
              tick={{ fill: "#6b3d1d", fontSize: 13, fontWeight: 500, dx: -95 }}
            />
            <Tooltip formatter={(v) => `₪${v.toLocaleString()} שווי`} />
            <Bar
              dataKey="value"
              fill="#c18b4a"
              radius={[6, 6, 0, 0]}
              className="chart-bar"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Chart 2 */}
      <div className="insights-chart-wrapper">
        <h3>מספר רשומות לפי קבוצת טובין (Top 10)</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart
            data={groupChartData}
            margin={{ top: 20, right: 30, bottom: 50, left: 80 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="group"
              angle={-25}
              textAnchor="end"
              interval={0}
              height={60}
              tick={{ fontSize: 12 }}
              dy={70}
              dx={-30}
            />
            <YAxis
              tickFormatter={(v) => v.toLocaleString("he-IL")}
              tick={{ fill: "#6b3d1d", fontSize: 13, fontWeight: 500, dx: -80 }}
            />
            <Tooltip formatter={(v) => ` ${v.toLocaleString()} רשומות`} />
            <Bar
              dataKey="count"
              fill="#c18b4a"
              radius={[6, 6, 0, 0]}
              className="chart-bar"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Chart 3 */}
      <div className="insights-chart-wrapper">
        <h3>ממוצע שווי ייבוא לפי בית מכס</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart
            data={customsAvgChartData}
            margin={{ top: 20, right: 30, bottom: 50, left: 80 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="house"
              angle={-25}
              textAnchor="end"
              interval={0}
              height={60}
              tick={{ fontSize: 12 }}
              dy={50}
              dx={-25}
            />
            <YAxis
              tickFormatter={(v) => v.toLocaleString("he-IL")}
              tick={{ fill: "#6b3d1d", fontSize: 13, fontWeight: 500, dx: -80 }}
            />
            <Tooltip formatter={(v) => `₪${v.toLocaleString()}  בממוצע`} />
            <Bar
              dataKey="avg"
              fill="#ba8854"
              radius={[6, 6, 0, 0]}
              className="chart-bar"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Chart 4: Pie */}
      <div className="insights-chart-wrapper">
        <h3>התפלגות סוגי מטבע בעסקאות ייבוא</h3>
        <ResponsiveContainer width="100%" height={360}>
          <PieChart>
            <Pie
              dataKey="count"
              data={currencyChartData}
              nameKey="currency"
              cx="50%"
              cy="50%"
              outerRadius={110}
              labelLine={false}
            >
              {currencyChartData.map((_, i) => (
                <Cell
                  key={`cell-${i}`}
                  fill={pieColors[i % pieColors.length]}
                />
              ))}
            </Pie>
            <Legend verticalAlign="bottom" layout="horizontal" height={40} />
            <Tooltip formatter={(v) => `עסקאות ${v.toLocaleString()}`} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Chart 5: Trade Agreement Distribution */}
      <div className="insights-chart-wrapper">
        <h3>העדפה לפי הסכמי סחר</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart
            data={agreementChartData}
            margin={{ top: 20, right: 30, bottom: 50, left: 80 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="agreement"
              angle={-25}
              textAnchor="end"
              interval={0}
              height={60}
              tick={{ fontSize: 12 }}
              dy={50}
              dx={-15}
            />
            <YAxis
              tickFormatter={(v) => v.toLocaleString("he-IL")}
              tick={{ fill: "#6b3d1d", fontSize: 13, fontWeight: 500, dx: -80 }}
            />
            <Tooltip formatter={(v) => `${v.toLocaleString()} עסקאות`} />
            <Bar
              dataKey="count"
              fill="#ba8854"
              radius={[6, 6, 0, 0]}
              className="chart-bar"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Chart 6: Discrepancy Between Declared Tax and Actual Value */}
      <div className="insights-chart-wrapper">
        <h3>הפער בין ערך הסחורות למכס שהוצהר לפי בית מכס</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart
            data={discrepancyChartData}
            margin={{ top: 20, right: 30, bottom: 50, left: 80 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="house"
              angle={-25}
              textAnchor="end"
              interval={0}
              height={60}
              tick={{ fontSize: 12 }}
              dy={50}
              dx={-25}
            />
            <YAxis
              tickFormatter={(v) => `₪${v.toLocaleString("he-IL")}`}
              tick={{
                fill: "#6b3d1d",
                fontSize: 13,
                fontWeight: 500,
                dx: -105,
              }}
            />
            <Tooltip formatter={(v) => `₪${v.toLocaleString()} פער`} />
            <Bar
              dataKey="discrepancy"
              fill="#ba8854"
              radius={[6, 6, 0, 0]}
              className="chart-bar"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default InsightsChart;
