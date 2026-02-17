/**
 * Stitch Screens Data for Biddt Project
 * 
 * This file contains all 34 screens from the Google Stitch project.
 * Use this with the sync_stitch_screens MCP tool to import into Notion.
 */

export const stitchScreens = [
  { name: "Seller Analytics & Earnings", screenId: "04080298a6024861aca00406b270be42", category: "Profile", theme: "Both" },
  { name: "High-Energy Bidding Interaction", screenId: "127b2b6aa3614a30a6e103b1750e1768", category: "Product", theme: "Both" },
  { name: "Outbid Alert - Deep Navy", screenId: "1667562b3a504a448975a31cbe48437a", category: "System", theme: "Dark" },
  { name: "Sell: Final Review and Shipping", screenId: "1c9064565a774c69a4390142ffa3c756", category: "Sell", theme: "Light" },
  { name: "Product Comparison Table", screenId: "1e5dcf92d19943f48e855b0d7e747163", category: "Product", theme: "Light" },
  { name: "Live Auction Dashboard", screenId: "24eee9cd6b8e4659abb2a88dc88a7ea8", category: "Home", theme: "Both" },
  { name: "Home Marketplace Feed", screenId: "2d6030e8e44e4162849edc27e2227c8f", category: "Home", theme: "Light" },
  { name: "Market Price Analyzer", screenId: "3b17cb71d016477c809097465c415a76", category: "Product", theme: "Light" },
  { name: "Biddt Home - Nike Light Theme", screenId: "3e83638a95014fce926643b3469dba4c", category: "Home", theme: "Light" },
  { name: "Sell: Pricing and Auction Settings", screenId: "4743319224874d9a91eb703b2e82f50f", category: "Sell", theme: "Light" },
  { name: "Outbid Alert - Minimalist Light", screenId: "4d248e8a006c4032a70e47857e7ff2de", category: "System", theme: "Light" },
  { name: "Winning Reveal - Deep Navy", screenId: "5043a1e31e4c476ea959254fb20d741c", category: "System", theme: "Dark" },
  { name: "Home Feed - Minimalist Light", screenId: "6efbcaba71aa435180b86e17693c43bd", category: "Home", theme: "Light" },
  { name: "Create Biddt Account", screenId: "7b02e04471c3432fabf420f4bea1703d", category: "Onboarding", theme: "Light" },
  { name: "Premium Product Experience", screenId: "81789992365e4543afabe26e9a2d4c21", category: "Product", theme: "Both" },
  { name: "Safe Exchange & QR Scan", screenId: "828d6af57d7c4a1e9cd590e17a0d3279", category: "Checkout", theme: "Both" },
  { name: "Member Profile Hub", screenId: "842e10336d8d4a7080d6264fb926d4bd", category: "Profile", theme: "Both" },
  { name: "Profile Hub - Light & Chromium", screenId: "849c0dbc88dc4aa9a39e9d537f60de5c", category: "Profile", theme: "Light" },
  { name: "Monochrome Chat - Dark Theme", screenId: "8c8ae81652724319bb0b44ded3424969", category: "System", theme: "Dark" },
  { name: "Profile and Digital Wallet", screenId: "92f0a431afbc4761b587b82bf92a3d9c", category: "Profile", theme: "Both" },
  { name: "Sell: Item Specifications", screenId: "9d95399ed77b48088c9af4d7c0ace237", category: "Sell", theme: "Light" },
  { name: "Item Negotiation Chat", screenId: "9d9c0c68ebc345a09b8d707406e79997", category: "System", theme: "Both" },
  { name: "Biddt Home - Nike Deep Navy Dark", screenId: "b75322776c5147a0b39b5d96ecdd2fb4", category: "Home", theme: "Dark" },
  { name: "Secure Checkout & Payment", screenId: "b7fa5a2e3a2d43deac4bbf04736eee35", category: "Checkout", theme: "Light" },
  { name: "Advanced Search Filters", screenId: "c072851d3ca14c8e8be004b527f35378", category: "Search", theme: "Light" },
  { name: "Detailed Item Performance", screenId: "c7d41376df7949c0ba8ca7497f46e7e1", category: "Sell", theme: "Light" },
  { name: "Diamond Mystery Splash - Dark Theme", screenId: "c80118e3fea343948ba9c916f7b2a3bb", category: "Onboarding", theme: "Dark" },
  { name: "Winning Reveal - Minimalist Light", screenId: "cc967b5f1f174b86b9f7bff49c3cf335", category: "System", theme: "Light" },
  { name: "Home Feed - Obsidian Dark", screenId: "cee5735370ab4f3bbdf965f7167a1db8", category: "Home", theme: "Dark" },
  { name: "Bid Placement Success", screenId: "d47267f8cd3243febbd11017bd3df3d0", category: "System", theme: "Both" },
  { name: "Sell: Add Photos and Media", screenId: "d498a5fb7761483d9be2790fd27b9de2", category: "Sell", theme: "Light" },
  { name: "Featured Product Details", screenId: "d62ab653213e498fb24186ef359489a8", category: "Product", theme: "Both" },
  { name: "Welcome to Biddt Splash", screenId: "e5aad76499fc4b4096614062d423fec9", category: "Onboarding", theme: "Both" },
  { name: "Profile - Minimalist Light", screenId: "e6eedc7446e946c585c0874831a56281", category: "Profile", theme: "Light" },
];

// Category counts for reference
export const categoryCounts = stitchScreens.reduce((acc, screen) => {
  acc[screen.category] = (acc[screen.category] || 0) + 1;
  return acc;
}, {});

console.log("Stitch Screens Summary:");
console.log("======================");
console.log(`Total: ${stitchScreens.length} screens`);
console.log("\nBy Category:");
Object.entries(categoryCounts)
  .sort((a, b) => b[1] - a[1])
  .forEach(([cat, count]) => console.log(`  ${cat}: ${count}`));
console.log("\nBy Theme:");
const themeCounts = stitchScreens.reduce((acc, screen) => {
  acc[screen.theme] = (acc[screen.theme] || 0) + 1;
  return acc;
}, {});
Object.entries(themeCounts)
  .sort((a, b) => b[1] - a[1])
  .forEach(([theme, count]) => console.log(`  ${theme}: ${count}`));
