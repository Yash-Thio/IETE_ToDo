// CommonJS version of the test script
const { addOrUpdateUser } = require("./todoServices");
const { db } = require("./firebase");

// Test function for addOrUpdateUser
async function testAddOrUpdateUser() {
  try {
    console.log("Testing addOrUpdateUser...");
    const userId = "EvleJdJmraLT08B2eiFx"; // Your test user ID
    const userData = {
      email: "example@email.com",
      name: "John Smith",
      image: "https://example.com/profile.jpg",
    };

    const result = await addOrUpdateUser(userId, userData);
    console.log("User added/updated successfully:", result);
    return result;
  } catch (error) {
    console.error("Test failed:", error);
    console.error("Error details:", error.message);
  }
}

// Main function to run all tests
async function runTests() {
  try {
    // Test user functions
    await testAddOrUpdateUser();
    console.log("All tests completed!");
  } catch (error) {
    console.error("Testing failed:", error);
  } finally {
    // Close any open connections if needed
    console.log("Tests finished, you can close the process");
    process.exit(0);
  }
}

// Execute tests
runTests();
