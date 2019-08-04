import RenderAuthorized from '@/components/Authorized';
import {getAuthority} from './authority';

//let Authorized = RenderAuthorized(getAuthority()); // eslint-disable-line

let Authorized = RenderAuthorized([
  '/listPointAddress',
  '/pointAddressManager',
  '/pointAddressManager/save',
  '/pointAddressManager/delete',
  '/appraiseManager',
  '/appraiseManager/save',
  '/conclusionManager',
  '/conclusionManager/save',
  '/categroyLabel',
]); // eslint-disable-line

// Reload the rights component
const reloadAuthorized = () => {
  Authorized = RenderAuthorized(getAuthority());
};

export {reloadAuthorized};
export default Authorized;
