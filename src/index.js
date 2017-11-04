/**
 * Entry point
 */
import App from './components/App/App';
import {
   patchDate
} from './utils/patchDate';

patchDate();

const app = new App({
   element: jQuery(document.body)
});

document.body.addEventListener('contextmenu', event => event.preventDefault());