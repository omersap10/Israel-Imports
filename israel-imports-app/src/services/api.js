import axios from "axios";

const BASE_URL = "https://data.gov.il/api/3/action/datastore_search";
const RESOURCE_ID = "6d3b03e1-de9c-42a8-bb08-91ba564c2f34";

export const fetchImportData = async () => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        resource_id: RESOURCE_ID,
        // limit: 1000000, // you can bring it back if needed
      },
      timeout: 60000, // ⏰ 60 seconds timeout
    });
    return response.data.result.records;
  } catch (error) {
    if (error.code === "ECONNABORTED") {
      console.error("The request took too long and was aborted.");
    } else {
      console.error("Error fetching import data:", error.message);
    }
    // Throw an error to be caught in your component
    throw new Error("אירעה שגיאה בעת טעינת הנתונים. אנא נסה שוב מאוחר יותר.");
  }
};
