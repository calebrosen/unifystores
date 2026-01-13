import Dashboard from './pages/dashboard/dashboard.jsx';
import Login from './pages/login/login.jsx';

import Coupons from './pages/coupons/coupons.jsx';
import CreateCoupon from './pages/coupons/createCoupon.jsx';
import ModifyCoupons from './pages/coupons/modifyCoupons.jsx';
import CreateCampaignCoupons from './pages/coupons/CreateCampaignCoupons.jsx';

import AddNewSalesAgent from './pages/salesagent/addNewSalesAgent.jsx';
import EditSalesAgents from './pages/salesagent/editSalesAgents.jsx';
import ImportSalesAgents from './pages/salesagent/importSalesAgents.jsx';
import SalesAgent from './pages/salesagent/SalesAgent.jsx';

import PartDiagrams from './pages/partdiagrams/partdiagrams.jsx';
import PartDiagramsPushToStores from './pages/partdiagrams/pushPartDiagrams.jsx';

import Information from './pages/information/information.jsx';
import PushInformation from './pages/information/pushInformation.jsx';
import ViewEditInformation from './pages/information/viewEditInformation.jsx';

import AddNewManufacturer from './pages/manufacturers/AddNewManufacturer.jsx';
import EditManufacturerName from './pages/manufacturers/EditManufacturerName.jsx';
import Manufacturers from './pages/manufacturers/manufacturers.jsx';
import ViewPushManufacturers from './pages/manufacturers/ViewPushManufacturers.jsx';

import AddNewOrderStatus from './pages/orderstatus/AddNewOrderStatus.jsx';
import EditPushOrderStatusName from './pages/orderstatus/EditPushOrderStatusName.jsx';
import OrderStatus from './pages/orderstatus/orderstatus.jsx';
import ViewPushOrderStatuses from './pages/orderstatus/ViewPushOrderStatuses.jsx';

import EditPushStockStatusName from './pages/stockstatus/EditPushStockStatusName.jsx';
import StockStatus from './pages/stockstatus/StockStatus.jsx';
import ViewPushStockStatuses from './pages/stockstatus/ViewPushStockStatuses.jsx';

import AddNewCustomerGroup from './pages/customergroups/AddNewCustomerGroup.jsx';
import CustomerGroups from './pages/customergroups/customergroups.jsx';
import EditCustomerGroupName from './pages/customergroups/EditCustomerGroupName.jsx';
import ViewPushCustomerGroups from './pages/customergroups/ViewPushCustomerGroups.jsx';

import Countries from './pages/countries/Countries.jsx';
import EditCountriesOnStore from './pages/countries/EditCountriesOnStore.jsx';
import ViewEnabledCountries from './pages/countries/ViewEnabledCountries.jsx';

import EditZonesOnStore from './pages/zones/EditZonesOnStore.jsx';
import ViewEnabledZones from './pages/zones/ViewEnabledZones.jsx';
import Zones from './pages/zones/Zones.jsx';

import EditSingleProductDescription from './pages/productdescription/EditSingleDescription.jsx';
import ProductDescription from './pages/productdescription/productdescription.jsx';

import CopyProductsToStores from './pages/products/copyProducts/CopyProductsToStores.jsx';
import DiscontinuedWhileSuppliesLast from './pages/products/DiscontinuedWhileSuppliesLast.jsx';
import Products from './pages/products/Products.jsx';
import UpdateProducts from './pages/products/UpdateProducts.jsx';
import ProductPromotions from './pages/products/ProductPromotions.jsx';

import Filters from './pages/filters/Filters.jsx';
import AddCategoryFilters from './pages/filters/AddCategoryFilters.jsx';

import Categories from './pages/categories/Categories.jsx';
import CopyCategories from './pages/categories/CopyCategories.jsx';


import AddEditDocuments from './pages/documents/AddEditDocuments.jsx';
import Documents from './pages/documents/Documents.jsx';

import Attributes from './pages/attributes/Attributes.jsx';
import CopyAttributes from './pages/attributes/CopyAttributes.jsx';

export const routes = [
  { path: "/", element: <Login />, auth: false },
  { path: "/login", element: <Login />, auth: false },

  { path: "/dashboard", element: <Dashboard />, auth: true },

  // Coupons
  { path: "/coupons", element: <Coupons />, auth: true },
  { path: "/coupons/createCoupon", element: <CreateCoupon />, auth: true, storesRadio: true },
  { path: "/coupons/modifyCoupons", element: <ModifyCoupons />, auth: true, storesRadio: true },
  { path: "/coupons/CreateCampaignCoupons", element: <CreateCampaignCoupons />, auth: true, storesRadio: true },

  // Sales Agents
  { path: "/salesagent", element: <SalesAgent />, auth: true },
  { path: "/salesagent/AddNewSalesAgent", element: <AddNewSalesAgent />, auth: true },
  { path: "/salesagent/editSalesAgents", element: <EditSalesAgents />, auth: true },
  { path: "/salesagent/importSalesAgents", element: <ImportSalesAgents />, auth: true, storesRadio: true },

  // Part Diagrams
  { path: "/partdiagrams", element: <PartDiagrams />, auth: true },
  { path: "/partdiagrams/pushToStores", element: <PartDiagramsPushToStores />, auth: true, storesRadio: true },

  // Information
  { path: "/information", element: <Information />, auth: true },
  { path: "/information/pushInformation", element: <PushInformation />, auth: true, storesRadio: true },
  { path: "/information/viewEditInformation", element: <ViewEditInformation />, auth: true },

  // Manufacturers
  { path: "/manufacturers", element: <Manufacturers />, auth: true },
  { path: "/manufacturers/AddNewManufacturer", element: <AddNewManufacturer />, auth: true },
  { path: "/manufacturers/EditManufacturerName", element: <EditManufacturerName />, auth: true },
  { path: "/manufacturers/ViewPushManufacturers", element: <ViewPushManufacturers />, auth: true, storesRadio: true },

  // Order Status
  { path: "/orderstatus", element: <OrderStatus />, auth: true },
  { path: "/orderstatus/AddNewOrderStatus", element: <AddNewOrderStatus />, auth: true },
  { path: "/orderstatus/EditPushOrderStatusName", element: <EditPushOrderStatusName />, auth: true },
  { path: "/orderstatus/ViewPushOrderStatuses", element: <ViewPushOrderStatuses />, auth: true, storesRadio: true },

  // Stock Status
  { path: "/stockstatus", element: <StockStatus />, auth: true },
  { path: "/stockstatus/EditPushStockStatusName", element: <EditPushStockStatusName />, auth: true },
  { path: "/stockstatus/ViewPushStockStatuses", element: <ViewPushStockStatuses />, auth: true, storesRadio: true },

  // Customer Groups
  { path: "/customergroups", element: <CustomerGroups />, auth: true },
  { path: "/customergroups/AddNewCustomerGroup", element: <AddNewCustomerGroup />, auth: true },
  { path: "/customergroups/EditCustomerGroupName", element: <EditCustomerGroupName />, auth: true },
  { path: "/customergroups/ViewPushCustomerGroups", element: <ViewPushCustomerGroups />, auth: true, storesRadio: true },

  // Countries
  { path: "/countries", element: <Countries />, auth: true },
  { path: "/countries/EditCountriesOnStore", element: <EditCountriesOnStore />, auth: true, storesRadio: true },
  { path: "/countries/ViewEnabledCountries", element: <ViewEnabledCountries />, auth: true },

  // Zones
  { path: "/zones", element: <Zones />, auth: true },
  { path: "/zones/EditZonesOnStore", element: <EditZonesOnStore />, auth: true, storesRadio: true },
  { path: "/zones/ViewEnabledZones", element: <ViewEnabledZones />, auth: true },

  // Product Description
  { path: "/productdescription", element: <ProductDescription />, auth: true },
  { path: "/productdescription/EditSingleDescription", element: <EditSingleProductDescription />, auth: true },

  // Products
  { path: "/products", element: <Products />, auth: true },
  { path: "/products/CopyProductsToStores", element: <CopyProductsToStores />, auth: true, storesRadio: true },
  { path: "/products/UpdateProducts", element: <UpdateProducts />, auth: true, storesRadio: true },
  { path: "/products/DiscontinuedWhileSuppliesLast", element: <DiscontinuedWhileSuppliesLast />, auth: true },
  { path: "/products/ProductPromotions", element: <ProductPromotions />, auth: true },

  // Filters
  { path: "/filters", element: <Filters />, auth: true },
  { path: "/filters/AddCategoryFilters", element: <AddCategoryFilters />, auth: true },

  // Categories
  { path: "/categories", element: <Categories />, auth: true },
  { path: "/categories/CopyCategories", element: <CopyCategories />, auth: true, storesRadio: true },

  // Documents
  { path: "/documents", element: <Documents />, auth: true },
  { path: "/documents/AddEditDocuments", element: <AddEditDocuments />, auth: true },

  // Attributes
  { path: "/attributes", element: <Attributes />, auth: true },
  { path: "/attributes/CopyAttributes", element: <CopyAttributes />, auth: true, storesRadio: true },
];
