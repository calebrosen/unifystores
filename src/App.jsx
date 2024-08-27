import React from 'react';
import ReactDOM from 'react-dom/client';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import IsAuthenticated from './components/auth.js';
import HomeAndLogOutButtons from './components/HomeAndLogOutButtons.jsx';
import Stores from './components/stores/Stores.jsx';
import StoresRadio from './components/stores/StoresRadio.jsx';
import { StoreProvider } from './contexts/StoreContext.jsx';
import './index.css';
import AddNewAttributeGroup from './pages/attributes/AddNewAttributeGroup.jsx';
import Attributes from './pages/attributes/Attributes.jsx';
import Countries from './pages/countries/Countries.jsx';
import EditCountriesOnStore from './pages/countries/EditCountriesOnStore.jsx';
import ViewEnabledCountries from './pages/countries/ViewEnabledCountries.jsx';
import Coupons from './pages/coupons/coupons.jsx';
import CreateCoupon from './pages/coupons/createCoupon.jsx';
import ModifyCoupons from './pages/coupons/modifyCoupons.jsx';
import AddNewCustomerGroup from './pages/customergroups/AddNewCustomerGroup.jsx';
import CustomerGroups from './pages/customergroups/customergroups.jsx';
import EditCustomerGroupName from './pages/customergroups/EditCustomerGroupName.jsx';
import ViewPushCustomerGroups from './pages/customergroups/ViewPushCustomerGroups.jsx';
import Dashboard from './pages/dashboard/dashboard.jsx';
import Information from './pages/information/information.jsx';
import PushInformation from './pages/information/pushInformation.jsx';
import ViewEditInformation from './pages/information/viewEditInformation.jsx';
import Login from './pages/login/login.jsx';
import AddNewManufacturer from './pages/manufacturers/AddNewManufacturer.jsx';
import EditManufacturerName from './pages/manufacturers/EditManufacturerName.jsx';
import Manufacturers from './pages/manufacturers/manufacturers.jsx';
import ViewPushManufacturers from './pages/manufacturers/ViewPushManufacturers.jsx';
import AddNewOrderStatus from './pages/orderstatus/AddNewOrderStatus.jsx';
import EditPushOrderStatusName from './pages/orderstatus/EditPushOrderStatusName.jsx';
import OrderStatus from './pages/orderstatus/orderstatus.jsx';
import ViewPushOrderStatuses from './pages/orderstatus/ViewPushOrderStatuses.jsx';
import PartDiagrams from './pages/partdiagrams/partdiagrams.jsx';
import PartDiagramsPushToStores from './pages/partdiagrams/pushPartDiagrams.jsx';
import ProductDescription from './pages/productdescription/productdescription.jsx';
import ViewEditProductDescription from './pages/productdescription/ViewEditProductDescription.jsx';
import EditProducts from './pages/products/EditProducts.jsx';
import Products from './pages/products/Products.jsx';
import ReleaseProducts from './pages/products/ReleaseProducts.jsx';
import AddNewSalesAgent from './pages/salesagent/addNewSalesAgent.jsx';
import EditSalesAgents from './pages/salesagent/editSalesAgents.jsx';
import SalesAgent from './pages/salesagent/SalesAgent.jsx';
import AddNewStockStatus from './pages/stockstatus/AddNewStockStatus.jsx';
import EditPushStockStatusName from './pages/stockstatus/EditPushStockStatusName.jsx';
import StockStatus from './pages/stockstatus/StockStatus.jsx';
import ViewPushStockStatuses from './pages/stockstatus/ViewPushStockStatuses.jsx';
import EditZonesOnStore from './pages/zones/EditZonesOnStore.jsx';
import ViewEnabledZones from './pages/zones/ViewEnabledZones.jsx';
import Zones from './pages/zones/Zones.jsx';

const App = () => {
  return (
    <StoreProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<RequireAuth><HomeAndLogOutButtons><Dashboard /></HomeAndLogOutButtons></RequireAuth>} />
          <Route path="/coupons" element={<RequireAuth><HomeAndLogOutButtons><Coupons /></HomeAndLogOutButtons></RequireAuth>} />
          <Route path="/coupons/createCoupon" element={<RequireAuth><HomeAndLogOutButtons><StoresRadio><CreateCoupon /></StoresRadio></HomeAndLogOutButtons></RequireAuth>} />
          <Route path="/coupons/modifyCoupons" element={<RequireAuth><HomeAndLogOutButtons><StoresRadio><ModifyCoupons /></StoresRadio></HomeAndLogOutButtons></RequireAuth>} />
          <Route path="/salesagent/addAgentToList" element={<RequireAuth><HomeAndLogOutButtons><Stores></Stores></HomeAndLogOutButtons></RequireAuth>} />
          <Route path="/partdiagrams" element={<RequireAuth><HomeAndLogOutButtons><PartDiagrams /></HomeAndLogOutButtons></RequireAuth>} />
          <Route path="/partdiagrams/pushToStores" element={<RequireAuth><HomeAndLogOutButtons><StoresRadio><PartDiagramsPushToStores /></StoresRadio></HomeAndLogOutButtons></RequireAuth>} />
          <Route path="/information" element={<RequireAuth><HomeAndLogOutButtons><Information /></HomeAndLogOutButtons></RequireAuth>} />
          <Route path="/information/viewEditInformation" element={<RequireAuth><HomeAndLogOutButtons><ViewEditInformation /></HomeAndLogOutButtons></RequireAuth>} />
          <Route path="/information/pushInformation" element={<RequireAuth><HomeAndLogOutButtons><StoresRadio><PushInformation /></StoresRadio></HomeAndLogOutButtons></RequireAuth>} />
          <Route path="/manufacturers" element={<RequireAuth><HomeAndLogOutButtons><Manufacturers /></HomeAndLogOutButtons></RequireAuth>} />
          <Route path="/manufacturers/ViewPushManufacturers" element={<RequireAuth><HomeAndLogOutButtons><StoresRadio><ViewPushManufacturers /></StoresRadio></HomeAndLogOutButtons></RequireAuth>} />
          <Route path="/manufacturers/EditManufacturerName" element={<RequireAuth><HomeAndLogOutButtons><EditManufacturerName /></HomeAndLogOutButtons></RequireAuth>} />
          <Route path="/manufacturers/AddNewManufacturer" element={<RequireAuth><HomeAndLogOutButtons><AddNewManufacturer /></HomeAndLogOutButtons></RequireAuth>} />
          <Route path="/orderstatus" element={<RequireAuth><HomeAndLogOutButtons><OrderStatus /></HomeAndLogOutButtons></RequireAuth>} />
          <Route path="/orderstatus/AddNewOrderStatus" element={<RequireAuth><HomeAndLogOutButtons><AddNewOrderStatus /></HomeAndLogOutButtons></RequireAuth>} />
          <Route path="/orderstatus/EditPushOrderStatusName" element={<RequireAuth><HomeAndLogOutButtons><EditPushOrderStatusName /></HomeAndLogOutButtons></RequireAuth>} />
          <Route path="/orderstatus/ViewPushOrderStatuses" element={<RequireAuth><HomeAndLogOutButtons><StoresRadio><ViewPushOrderStatuses /></StoresRadio></HomeAndLogOutButtons></RequireAuth>} />
          <Route path="/stockstatus" element={<RequireAuth><HomeAndLogOutButtons><StockStatus /></HomeAndLogOutButtons></RequireAuth>} />
          <Route path="/stockstatus/AddNewStockStatus" element={<RequireAuth><HomeAndLogOutButtons><AddNewStockStatus /></HomeAndLogOutButtons></RequireAuth>} />
          <Route path="/stockstatus/EditPushStockStatusName" element={<RequireAuth><HomeAndLogOutButtons><EditPushStockStatusName /></HomeAndLogOutButtons></RequireAuth>} />
          <Route path="/stockstatus/ViewPushStockStatuses" element={<RequireAuth><HomeAndLogOutButtons><StoresRadio><ViewPushStockStatuses /></StoresRadio></HomeAndLogOutButtons></RequireAuth>} />
          <Route path="/customergroups" element={<RequireAuth><HomeAndLogOutButtons><CustomerGroups /></HomeAndLogOutButtons></RequireAuth>} />
          <Route path="/customergroups/EditCustomerGroupName" element={<RequireAuth><HomeAndLogOutButtons><EditCustomerGroupName /></HomeAndLogOutButtons></RequireAuth>} />
          <Route path="/customergroups/ViewPushCustomerGroups" element={<RequireAuth><HomeAndLogOutButtons><StoresRadio><ViewPushCustomerGroups /></StoresRadio></HomeAndLogOutButtons></RequireAuth>} />
          <Route path="/customergroups/AddNewCustomerGroup" element={<RequireAuth><HomeAndLogOutButtons><AddNewCustomerGroup /></HomeAndLogOutButtons></RequireAuth>} />
          <Route path="/salesagent" element={<RequireAuth><HomeAndLogOutButtons><SalesAgent /></HomeAndLogOutButtons></RequireAuth>} />
          <Route path="/salesagent/AddNewSalesAgent" element={<RequireAuth><HomeAndLogOutButtons><AddNewSalesAgent /></HomeAndLogOutButtons></RequireAuth>} />
          <Route path="/countries" element={<RequireAuth><HomeAndLogOutButtons><Countries /></HomeAndLogOutButtons></RequireAuth>} />
          <Route path="/countries/EditCountriesOnStore" element={<RequireAuth><HomeAndLogOutButtons><StoresRadio><EditCountriesOnStore /></StoresRadio></HomeAndLogOutButtons></RequireAuth>} />
          <Route path="/countries/ViewEnabledCountries" element={<RequireAuth><HomeAndLogOutButtons><ViewEnabledCountries /></HomeAndLogOutButtons></RequireAuth>} />
          <Route path="/zones" element={<RequireAuth><HomeAndLogOutButtons><Zones /></HomeAndLogOutButtons></RequireAuth>}/>
          <Route path="/zones/EditZonesOnStore" element={<RequireAuth><HomeAndLogOutButtons><StoresRadio><EditZonesOnStore /></StoresRadio></HomeAndLogOutButtons></RequireAuth>} />
          <Route path="/zones/ViewEnabledZones" element={<RequireAuth><HomeAndLogOutButtons><ViewEnabledZones /></HomeAndLogOutButtons></RequireAuth>} />
          <Route path="/productdescription" element={<RequireAuth><HomeAndLogOutButtons><ProductDescription /></HomeAndLogOutButtons></RequireAuth>}/>
          <Route path="/products" element={<RequireAuth><HomeAndLogOutButtons><Products /></HomeAndLogOutButtons></RequireAuth>}/>
          <Route path="/products/ReleaseProducts" element={<RequireAuth><HomeAndLogOutButtons><StoresRadio><ReleaseProducts /></StoresRadio></HomeAndLogOutButtons></RequireAuth>} />
          <Route path="/productdescription/EditDescription" element={<RequireAuth><HomeAndLogOutButtons><ViewEditProductDescription /></HomeAndLogOutButtons></RequireAuth>}/>
          <Route path="/products/EditProducts" element={<RequireAuth><HomeAndLogOutButtons><EditProducts /></HomeAndLogOutButtons></RequireAuth>}/>
          <Route path="/salesagent/editSalesAgents" element={<RequireAuth><HomeAndLogOutButtons><EditSalesAgents /></HomeAndLogOutButtons></RequireAuth>}/>
          <Route path="/attributes/AddNewAttributeGroup" element={<RequireAuth><HomeAndLogOutButtons><AddNewAttributeGroup /></HomeAndLogOutButtons></RequireAuth>}/>
          <Route path="/attributes" element={<RequireAuth><HomeAndLogOutButtons><Attributes /></HomeAndLogOutButtons></RequireAuth>}/>
        </Routes>
      </Router>
    </StoreProvider>
  );
};

const RequireAuth = ({ children }) => {
  const isLoggedIn = IsAuthenticated();
  return isLoggedIn ? children : <Navigate to="/login" />;
};

ReactDOM.createRoot(document.getElementById('root')).render(<App />);