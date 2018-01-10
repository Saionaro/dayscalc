/**
 * Entry point
 */
import App from './components/App/App';
import {
   patchDate
} from './utils/patchDate';

patchDate();

new App({
   element: jQuery(document.body)
});

document.body.addEventListener('contextmenu', event => event.preventDefault());